// Импорт из CSV: команды (ростеры), матчи, итоговые места → те же JSON, которые читает сайт.
// Разделитель (запятая, ; или таб) и BOM из Excel определяются автоматически.

export function parseCsv(text) {
  text = String(text).replace(/^﻿/, '');
  const first = text.split(/\r?\n/, 1)[0] || '';
  const count = (ch) => (first.match(new RegExp(ch === '\t' ? '\\t' : `\\${ch}`, 'g')) || []).length;
  const delim = [',', ';', '\t'].sort((a, b) => count(b) - count(a))[0];
  const rows = [];
  let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((x) => x.trim() !== '')) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== '')) rows.push(row);
  if (!rows.length) return { delim, headers: [], rows: [] };
  const headers = rows[0].map((h) => h.trim());
  return { delim, headers, rows: rows.slice(1).map((r) => r.map((x) => x.trim())) };
}

const norm = (h) => String(h).toLowerCase().replace(/[\s_\-.]/g, '');

// Названия колонок: английские и русские варианты
const ALIASES = {
  team: ['team', 'teamname', 'name', 'команда', 'названиекоманды', 'название'],
  logo: ['logo', 'логотип', 'лого'],
  status: ['status', 'статус'],
  qualifier: ['qualifier', 'квалификация'],
  players: ['players', 'игроки', 'состав'],
  coach: ['coach', 'тренер'],
  subs: ['subs', 'sub', 'запас', 'замены', 'запасные'],
  nick: ['nick', 'nickname', 'player', 'игрок', 'ник', 'никнейм'],
  role: ['role', 'роль', 'тип'],
  pos: ['pos', 'position', 'позиция'],
  round: ['round', 'раунд', 'тур', 'этап'],
  team1: ['team1', 'teama', 'home', 'команда1', 'первая', 't1'],
  team2: ['team2', 'teamb', 'away', 'команда2', 'вторая', 't2'],
  score1: ['score1', 'scorea', 'счет1', 'счёт1', 's1'],
  score2: ['score2', 'scoreb', 'счет2', 'счёт2', 's2'],
  date: ['date', 'дата'],
  id: ['id', 'matchid', 'идентификатор'],
  next: ['next', 'nextmatch', 'далее', 'следующий'],
  bracket: ['bracket', 'сетка'],
  group: ['group', 'группа'],
  winner: ['winner', 'победитель'],
  bye: ['bye'],
  place: ['place', 'место'],
  label: ['label', 'подпись'],
};

// Возвращает индекс колонки по каноническому имени (или -1)
export function colIndex(headers, key) {
  const want = ALIASES[key] || [key];
  const hs = headers.map(norm);
  for (const w of want) {
    const i = hs.indexOf(norm(w));
    if (i >= 0) return i;
  }
  return -1;
}

// player1..player5 / игрок1..игрок5 / p1..p5
function playerCols(headers) {
  const out = [];
  headers.forEach((h, i) => {
    const m = norm(h).match(/^(?:player|игрок|p)(\d+)$/);
    if (m) out.push([+m[1], i]);
  });
  return out.sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}
function subCols(headers) {
  const out = [];
  headers.forEach((h, i) => {
    const m = norm(h).match(/^(?:sub|запас|замена)(\d+)$/);
    if (m) out.push([+m[1], i]);
  });
  return out.sort((a, b) => a[0] - b[0]).map((x) => x[1]);
}

// Список в одной ячейке: «a | b | c»; запятая или «;» тоже подходят, если это не разделитель самого CSV
function splitList(v, delim) {
  const seps = ['|', '\n'];
  if (delim !== ';') seps.push(';');
  if (delim !== ',') seps.push(',');
  let parts = [v];
  for (const s of seps) parts = parts.flatMap((p) => p.split(s));
  return parts.map((x) => x.trim()).filter(Boolean);
}

const nickObj = (nick) => ({ nick });

/** Команды. Два формата:
 *  1) строка = команда: team, player1..player5 (или players), coach, subs, logo, status, qualifier
 *  2) строка = игрок: team, nick, role (player | coach | sub), pos
 */
export function rosterFromCsv(text) {
  const { delim, headers, rows } = parseCsv(text);
  const ci = (k) => colIndex(headers, k);
  const iTeam = ci('team');
  if (iTeam < 0) throw new Error('В CSV нет колонки с названием команды (team / команда)');
  const iNick = ci('nick');
  const teams = new Map();
  const get = (name) => {
    if (!teams.has(name)) teams.set(name, { name, players: [] });
    return teams.get(name);
  };
  const val = (r, i) => (i >= 0 ? r[i] ?? '' : '');

  if (iNick >= 0 && playerCols(headers).length === 0) {
    const iRole = ci('role'), iPos = ci('pos');
    for (const r of rows) {
      const name = val(r, iTeam);
      if (!name) continue;
      const t = get(name);
      const nick = val(r, iNick);
      if (nick) {
        const role = val(r, iRole).toLowerCase();
        const p = nickObj(nick);
        if (/coach|тренер/.test(role)) t.coach = p;
        else if (/sub|запас|замен/.test(role)) (t.subs ||= []).push(p);
        else {
          if (val(r, iPos)) p.pos = +val(r, iPos) || val(r, iPos);
          t.players.push(p);
        }
      }
      for (const k of ['logo', 'status', 'qualifier']) if (val(r, ci(k))) t[k] = val(r, ci(k));
    }
  } else {
    const pCols = playerCols(headers), sCols = subCols(headers);
    const iPlayers = ci('players'), iCoach = ci('coach'), iSubs = ci('subs');
    for (const r of rows) {
      const name = val(r, iTeam);
      if (!name) continue;
      const t = get(name);
      for (const i of pCols) if (r[i]) t.players.push(nickObj(r[i]));
      if (iPlayers >= 0) splitList(val(r, iPlayers), delim).forEach((n) => t.players.push(nickObj(n)));
      if (val(r, iCoach)) t.coach = nickObj(val(r, iCoach));
      const subs = [...sCols.map((i) => r[i]).filter(Boolean), ...(iSubs >= 0 ? splitList(val(r, iSubs), delim) : [])];
      if (subs.length) (t.subs ||= []).push(...subs.map(nickObj));
      for (const k of ['logo', 'status', 'qualifier']) if (val(r, ci(k))) t[k] = val(r, ci(k));
    }
  }
  return { teams: [...teams.values()].map((t) => (t.players.length ? t : { ...t, players: [] })) };
}

const BRACKETS = [
  [/верх|upper|winner/i, 'upper'],
  [/нижн|lower|loser/i, 'lower'],
  [/3|third|бронз/i, 'third'],
  [/фин|final|grand/i, 'final'],
];
const bracketOf = (v) => {
  if (!v) return 'upper';
  for (const [re, b] of BRACKETS) if (re.test(v)) return b;
  return 'upper';
};
const numOrNull = (v) => (v === '' || v == null || isNaN(+v) ? null : +v);

function matchRows(text) {
  const { headers, rows } = parseCsv(text);
  const ci = (k) => colIndex(headers, k);
  const need = ['team1', 'team2'].filter((k) => ci(k) < 0);
  if (need.length) throw new Error('В CSV нет колонок team1 и team2 (команда1 / команда2)');
  const idx = Object.fromEntries(['round', 'team1', 'team2', 'score1', 'score2', 'date', 'id', 'next', 'bracket', 'group', 'winner', 'bye'].map((k) => [k, ci(k)]));
  return rows
    .map((r) => {
      const g = (k) => (idx[k] >= 0 ? r[idx[k]] ?? '' : '');
      return {
        round: g('round'), team1: g('team1'), team2: g('team2'),
        score1: numOrNull(g('score1')), score2: numOrNull(g('score2')),
        date: g('date'), id: g('id'), next: g('next'), bracket: g('bracket'), group: g('group'),
        winner: numOrNull(g('winner')), bye: /^(1|true|yes|да|bye)$/i.test(g('bye')),
      };
    })
    .filter((m) => m.team1 || m.team2);
}

const cleanMatch = (m, extra = {}) => {
  const o = { ...extra, team1: m.team1, team2: m.team2 };
  if (m.score1 != null && m.score2 != null) { o.score1 = m.score1; o.score2 = m.score2; }
  else if (m.winner === 1 || m.winner === 2) o.winner = m.winner;
  if (m.bye) o.bye = true;
  if (m.date) o.date = m.date;
  return o;
};

const groupBy = (arr, key) => {
  const out = new Map();
  for (const x of arr) {
    const k = key(x);
    if (!out.has(k)) out.set(k, []);
    out.get(k).push(x);
  }
  return out;
};

// Простая автосвязка для single elimination: матч k раунда r → матч ceil(k/2) раунда r+1
export function autoLink(rounds) {
  const up = rounds.filter((r) => (r.bracket || 'upper') === 'upper');
  for (let i = 0; i < up.length - 1; i++) {
    const a = up[i].matches, b = up[i + 1].matches;
    if (b.length * 2 !== a.length) continue;
    a.forEach((m, k) => { if (!m.next && b[Math.floor(k / 2)].id) m.next = b[Math.floor(k / 2)].id; });
  }
}

/** Матчи → этап result.json. format: list | round_robin | swiss | single_elim | double_elim */
export function stageFromCsv(text, { format = 'list', name } = {}) {
  const ms = matchRows(text);
  if (!ms.length) throw new Error('В CSV нет ни одного матча');
  const teamsOf = (arr) => [...new Set(arr.flatMap((m) => [m.team1, m.team2]).filter(Boolean))];

  if (format === 'list') {
    return { matches: ms.map((m) => cleanMatch(m, m.round ? { round: m.round } : {})) };
  }
  if (format === 'round_robin') {
    const groups = [...groupBy(ms, (m) => m.group || 'Группа A')].map(([gname, arr]) => ({
      name: gname, format: 'round_robin', teams: teamsOf(arr), matches: arr.map((m) => cleanMatch(m)),
    }));
    return { stage: { type: 'groups', name: name || 'Групповой этап', groups } };
  }
  if (format === 'swiss') {
    const rounds = [...groupBy(ms, (m) => m.round || 'Раунд 1')].map(([rname, arr]) => ({
      name: /^\d+$/.test(rname) ? `Раунд ${rname}` : rname, matches: arr.map((m) => cleanMatch(m)),
    }));
    return { stage: { type: 'swiss', name: name || 'Швейцарская система', teams: teamsOf(ms), rounds } };
  }
  if (format === 'single_elim' || format === 'double_elim') {
    let n = 0;
    const rounds = [...groupBy(ms, (m) => `${bracketOf(m.bracket)}|${m.round || ''}`)].map(([key, arr]) => {
      const bracket = key.split('|')[0];
      return {
        name: arr[0].round || (bracket === 'final' ? 'Финал' : 'Раунд'),
        bracket,
        matches: arr.map((m) => cleanMatch(m, { id: m.id || `m${++n}`, ...(m.next ? { next: m.next } : {}) })),
      };
    });
    // Пустые id в next → связываем только если next не задан вручную ни у одного матча
    if (format === 'single_elim' && !ms.some((m) => m.next)) autoLink(rounds);
    return { stage: { type: format, name: name || (format === 'single_elim' ? 'Плей-офф' : 'Плей-офф'), rounds } };
  }
  throw new Error(`Неизвестный формат "${format}" (list, round_robin, swiss, single_elim, double_elim)`);
}

/** Итоговые места: place, team, label (необязательно) */
export function placementsFromCsv(text) {
  const { headers, rows } = parseCsv(text);
  const iPlace = colIndex(headers, 'place'), iTeam = colIndex(headers, 'team'), iLabel = colIndex(headers, 'label');
  if (iPlace < 0 || iTeam < 0) throw new Error('В CSV нужны колонки place (место) и team (команда)');
  return rows
    .filter((r) => r[iTeam])
    .map((r) => {
      const p = { place: +String(r[iPlace]).match(/\d+/)?.[0] };
      if (iLabel >= 0 && r[iLabel]) p.label = r[iLabel];
      p.team = r[iTeam];
      return p;
    })
    .filter((p) => p.place);
}
