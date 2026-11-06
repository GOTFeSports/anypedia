// Импорт турнира из Challonge (API v1) → information.json, roster.json, result.json.
// Работает с живым запросом (нужен API-ключ) или с сохранённым ответом API (--from-file).

export function parseChallongeRef(ref) {
  const s = String(ref).trim();
  const m = s.match(/^https?:\/\/(?:([a-z0-9_-]+)\.)?challonge\.com\/(?:[a-z]{2}(?:-[A-Za-z]+)?\/)?([A-Za-z0-9_]+)/i);
  if (!m) return { id: s };
  const sub = m[1] && m[1].toLowerCase() !== 'www' ? m[1] : '';
  return { id: sub ? `${sub}-${m[2]}` : m[2] };
}

export async function fetchChallonge(ref, apiKey) {
  const { id } = parseChallongeRef(ref);
  if (!apiKey) throw new Error('Нужен API-ключ Challonge: --key КЛЮЧ или переменная CHALLONGE_API_KEY (Challonge → Settings → Developer API)');
  const url = `https://api.challonge.com/v1/tournaments/${encodeURIComponent(id)}.json?api_key=${encodeURIComponent(apiKey)}&include_participants=1&include_matches=1`;
  const res = await fetch(url);
  if (res.status === 401 || res.status === 403) throw new Error('Challonge отклонил ключ (401/403). Проверьте API-ключ и доступ к турниру.');
  if (res.status === 404) throw new Error(`Турнир "${id}" не найден на Challonge (404).`);
  if (!res.ok) throw new Error(`Challonge вернул ${res.status}`);
  return res.json();
}

const TYPE_NAMES = {
  'single elimination': 'Single Elimination',
  'double elimination': 'Double Elimination',
  'round robin': 'Round Robin',
  swiss: 'Швейцарская система',
};
const day = (v) => (v ? String(v).slice(0, 10) : '');
const unwrap = (arr, key) => (arr || []).map((x) => (x && x[key] ? x[key] : x));
const stripHtml = (h) =>
  String(h || '').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();

function roundName(kind, d, r) {
  // d — расстояние от последнего раунда сетки (0 — финал)
  if (kind === 'single') return d === 0 ? 'Финал' : d === 1 ? 'Полуфинал' : `1/${2 ** d} финала`;
  if (kind === 'upper') return d === 0 ? 'Финал верхней сетки' : d === 1 ? 'Полуфинал верхней сетки' : `Верхняя сетка · 1/${2 ** d} финала`;
  return d === 0 ? 'Финал нижней сетки' : d === 1 ? 'Полуфинал нижней сетки' : `Нижняя сетка · раунд ${r}`;
}

// Разбор счёта Challonge: "2-1" или по партиям "1-0,0-1,1-0"
function parseScore(raw, p1id, winnerId) {
  const sets = String(raw || '').split(',').map((x) => x.trim()).filter(Boolean)
    .map((x) => x.match(/^(-?\d+)\s*-\s*(-?\d+)$/)).filter(Boolean).map((m) => [+m[1], +m[2]]);
  let s1 = null, s2 = null;
  if (sets.length === 1) [s1, s2] = sets[0];
  else if (sets.length > 1) {
    s1 = sets.filter(([a, b]) => a > b).length;
    s2 = sets.filter(([a, b]) => b > a).length;
  }
  // Без счёта (или 0-0 при заданном победителе) — победа без счёта (W / L)
  if (s1 == null || (s1 === 0 && s2 === 0 && winnerId)) {
    return winnerId ? { winner: winnerId === p1id ? 1 : 2 } : {};
  }
  // Challonge хранит счёт в порядке player1-player2; если победитель не совпадает со счётом — оставляем как есть
  return { score1: s1, score2: s2 };
}

function placementsOf(participants) {
  const ranked = participants.filter((p) => Number.isFinite(+p.final_rank) && +p.final_rank > 0);
  if (ranked.length < Math.max(2, Math.ceil(participants.length / 2))) return [];
  const byRank = new Map();
  for (const p of ranked) {
    if (!byRank.has(+p.final_rank)) byRank.set(+p.final_rank, []);
    byRank.get(+p.final_rank).push(p);
  }
  const out = [];
  for (const rank of [...byRank.keys()].sort((a, b) => a - b)) {
    const group = byRank.get(rank);
    group.forEach((p, i) => {
      const e = { place: rank + i };
      if (group.length > 1) e.label = `${rank}–${rank + group.length - 1}`;
      e.team = p.name;
      out.push(e);
    });
  }
  return out;
}

export function mapChallonge(api, opts = {}) {
  const t = api.tournament || api;
  const notes = [];
  const participants = unwrap(t.participants, 'participant')
    .map((p) => ({ ...p, name: p.name || p.display_name || p.challonge_username || `Участник ${p.id}` }));
  const nameById = new Map(participants.map((p) => [p.id, p.name]));
  // В турнирах с групповым этапом id игрока может лежать в group_player_ids
  participants.forEach((p) => (p.group_player_ids || []).forEach((g) => nameById.set(g, p.name)));
  const nm = (id) => (id == null ? '' : nameById.get(id) || '');

  const typeKey = String(t.tournament_type || '').toLowerCase();
  const typeName = TYPE_NAMES[typeKey];
  if (!typeName) throw new Error(`Тип турнира "${t.tournament_type}" не поддерживается (single/double elimination, round robin, swiss)`);
  if (t.group_stages_enabled) notes.push('В турнире включён групповой этап Challonge — он не импортируется, возьмите его из CSV.');

  const raw = unwrap(t.matches, 'match').filter((m) => m && m.round != null);
  const byId = new Map(raw.map((m) => [m.id, m]));
  const prereq = (m) => String(m.prerequisite_match_ids_csv || '').split(',').map((x) => +x.trim()).filter(Boolean);
  const hasPrereq = raw.some((m) => prereq(m).length);

  const rankOf = new Map(participants.map((p) => [p.id, +p.final_rank]));
  const dateOf = (m) => day(m.scheduled_time || m.completed_at || m.started_at);
  const toMatch = (m, id) => {
    const o = { id, team1: nm(m.player1_id), team2: nm(m.player2_id) };
    if (m.state === 'complete') Object.assign(o, parseScore(m.scores_csv, m.player1_id, m.winner_id));
    const d = dateOf(m);
    if (d) o.date = d;
    return o;
  };
  const mid = (m) => `m${m.id}`;
  const sortRounds = (ms) => [...ms].sort((a, b) => (a.suggested_play_order ?? a.id) - (b.suggested_play_order ?? b.id));

  let stage;
  if (typeKey === 'single elimination' || typeKey === 'double elimination') {
    const isDouble = typeKey === 'double elimination';
    // Матч за 3 место: второй матч в последнем раунде одиночной сетки
    let thirdId = null;
    const lastRound = Math.max(...raw.filter((m) => m.round > 0).map((m) => m.round));
    if (!isDouble) {
      const last = sortRounds(raw.filter((m) => m.round === lastRound));
      if (last.length === 2) {
        const byRank = last.find((m) => m.winner_id != null && rankOf.get(m.winner_id) === 3);
        const third = byRank || last[0]; // без рангов считаем, что матч за 3 место идёт раньше финала
        thirdId = third.id;
        notes.push(`Матч за 3 место определён как "${nm(third.player1_id)} vs ${nm(third.player2_id)}"${byRank ? '' : ' (по порядку игры — проверьте)'}.`);
      }
    }
    // Двойная сетка: гранд-финал — первый положительный раунд, куда ведёт матч нижней сетки
    let gfRound = null, resetRound = null;
    if (isDouble) {
      const gfs = raw.filter((m) => m.round > 0 && prereq(m).some((p) => (byId.get(p)?.round ?? 1) < 0));
      if (gfs.length) gfRound = Math.min(...gfs.map((m) => m.round));
      else gfRound = lastRound;
      if (raw.some((m) => m.round === gfRound + 1)) resetRound = gfRound + 1;
    }
    const groupOf = (m) => {
      if (m.id === thirdId) return 'third';
      if (isDouble) {
        if (m.round < 0) return 'lower';
        if (m.round === gfRound || m.round === resetRound) return 'final';
        return 'upper';
      }
      return m.round === lastRound ? 'final' : 'upper';
    };

    // Матч сброса, если он не сыгран, не показываем
    const items = raw.filter((m) => {
      if (m.round === resetRound && m.state !== 'complete') {
        notes.push('Матч сброса гранд-финала не сыгран — пропущен.');
        return false;
      }
      return true;
    });

    const rounds = [];
    const addRounds = (list, bracket, namer) => {
      const nums = [...new Set(list.map((m) => m.round))].sort((a, b) => Math.abs(a) - Math.abs(b));
      nums.forEach((r, i) => {
        const ms = sortRounds(list.filter((m) => m.round === r));
        rounds.push({ name: namer(r, nums.length - 1 - i), bracket, matches: ms.map((m) => toMatch(m, mid(m))), _src: ms });
      });
    };
    const upper = items.filter((m) => groupOf(m) === 'upper');
    const lower = items.filter((m) => groupOf(m) === 'lower');
    const finals = items.filter((m) => groupOf(m) === 'final');
    const third = items.filter((m) => groupOf(m) === 'third');
    if (isDouble) {
      addRounds(upper, 'upper', (r, d) => roundName('upper', d, r));
      addRounds(lower, 'lower', (r, d) => roundName('lower', d, Math.abs(r)));
      addRounds(finals, 'final', (r) => (r === resetRound ? 'Гранд-финал (reset)' : 'Гранд-финал'));
    } else {
      addRounds(upper, 'upper', (r, d) => roundName('single', d + 1, r));
      addRounds(finals, 'final', () => 'Финал');
      addRounds(third, 'third', () => 'Матч за 3 место');
    }

    // Линии между матчами: победитель идёт в матч, для которого этот матч — «предшественник» в той же сетке
    const grp = new Map();
    rounds.forEach((r) => r._src.forEach((m) => grp.set(m.id, r.bracket)));
    const idOf = new Map();
    rounds.forEach((r) => r._src.forEach((m, i) => idOf.set(m.id, r.matches[i])));
    if (hasPrereq) {
      for (const m of items) {
        if (m.id === thirdId) continue;
        for (const p of prereq(m)) {
          const pm = idOf.get(p), g1 = grp.get(p), g2 = grp.get(m.id);
          if (!pm) continue;
          // Выбывшие из верхней сетки падают в нижнюю — это не линия победителя
          const sameFlow = g1 === g2 || g2 === 'final';
          if (sameFlow && !pm.next) pm.next = idOf.get(m.id).id;
        }
      }
    } else {
      notes.push('В ответе нет prerequisite_match_ids — линии сетки расставлены по порядку матчей, проверьте.');
      const up = rounds.filter((r) => r.bracket === 'upper');
      for (let i = 0; i < up.length - 1; i++) {
        const a = up[i].matches, b = up[i + 1].matches;
        if (a.length === b.length * 2) a.forEach((m, k) => (m.next = b[Math.floor(k / 2)].id));
        else if (i === up.length - 2 && b.length === 1 && a.length === 1) a[0].next = b[0].id;
      }
    }
    rounds.forEach((r) => delete r._src);
    stage = { type: isDouble ? 'double_elim' : 'single_elim', name: 'Плей-офф', rounds };
  } else if (typeKey === 'round robin') {
    const ms = sortRounds(raw).map((m) => {
      const o = toMatch(m, undefined);
      delete o.id;
      return o;
    });
    stage = {
      type: 'groups', name: 'Групповой этап',
      groups: [{ name: 'Группа A', format: 'round_robin', teams: participants.map((p) => p.name), matches: ms }],
    };
  } else {
    const nums = [...new Set(raw.map((m) => m.round))].sort((a, b) => a - b);
    stage = {
      type: 'swiss', name: 'Швейцарская система', teams: participants.map((p) => p.name),
      rounds: nums.map((r) => ({
        name: `Раунд ${r}`,
        matches: sortRounds(raw.filter((m) => m.round === r)).map((m) => { const o = toMatch(m, undefined); delete o.id; return o; }),
      })),
    };
  }

  const placements = placementsOf(participants);
  if (!placements.length) notes.push('Итоговых мест в ответе нет (турнир не завершён?) — placements пустой.');

  const info = {
    name: t.name,
    ...(opts.series ? { series: opts.series } : {}),
    ...(opts.organizer ? { organizer: opts.organizer } : {}),
    type: 'online',
    game: 'Dota 2',
    date_start: day(t.start_at || t.started_at || t.created_at),
    date_end: day(t.completed_at || t.start_at || t.started_at || t.created_at),
    format: [typeName],
    ...(opts.pts ? { pts_cap: +opts.pts } : {}),
    ...(opts.prize ? { prize_pool: opts.prize } : {}),
    description: stripHtml(t.description),
    links: { ...(t.full_challonge_url ? { challonge: t.full_challonge_url } : {}) },
    ...(opts.prizes?.length ? { prizes: opts.prizes } : {}),
  };
  if (!info.description) delete info.description;

  return {
    info,
    roster: { teams: [...participants].sort((a, b) => (a.seed ?? 1e9) - (b.seed ?? 1e9)).map((p) => ({ name: p.name, players: [] })) },
    result: { placements, stages: [stage] },
    notes,
  };
}
