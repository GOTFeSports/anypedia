// Собирает data/site.js — ОДИН файл с данными в том виде, в котором их читают страницы сайта
// (глобальные tournaments / teams / organizers / playersData). Всё считается из data/*.json,
// поэтому здесь нет ни одной «ручной» цифры. Вызывается из build-data.mjs.

const money = n => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}₽`;
const placeLabel = h => h.place === undefined ? '' : h.placeTo !== undefined ? `${h.place}-${h.placeTo}` : String(h.place);
const clean = o => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== null));

/* сетка Challonge встраивается через /module; ссылка может быть вида challonge.com/ru/ID или sub.challonge.com/ID */
export function bracketEmbedFor(t) {
  if (t.bracketEmbed) return t.bracketEmbed;
  if (t.source?.type !== 'challonge') return '';
  try {
    const u = new URL(t.source.url);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length > 1 && /^[a-z]{2}(-[A-Z]{2})?$/.test(parts[0])) parts.shift();
    return `${u.origin}/${parts.join('/')}/module`;
  } catch { return ''; }
}

export function buildSiteBundle(files) {
  const docs = prefix => [...files].filter(([k]) => k.startsWith(prefix)).map(([, v]) => v);
  const tDocs = docs('tournaments/');   // от новых к старым
  const teamDocs = docs('teams/');
  const playerDocs = docs('players/');
  const orgDocs = docs('organizers/');
  const tById = new Map(tDocs.map(t => [t.id, t]));
  const teamById = new Map(teamDocs.map(t => [t.id, t]));

  /* ───── турниры ───── */
  const tournaments = tDocs.map(t => clean({
    id: t.id,
    title: t.title,
    limit: t.limit || '',
    start: t.start,
    end: t.end,
    startTime: t.startTime || '',
    registrationStart: t.registrationStart || '',
    registrationEnd: t.registrationEnd || '',
    prizeRub: t.prizeTotalRub,
    prize: t.prizeTotalRub ? money(t.prizeTotalRub) : (t.prizeNote || ''),
    location: t.location,
    teams: t.teamsCount > 0 ? t.teamsCount : (t.teamsLimit ?? 0),
    tier: t.tier,
    format: t.format || '',
    gameFormat: t.gameFormat || '',
    organizer: t.organizers.map(o => o.name).join(' & '),
    organizerIds: t.organizer,
    bracketEmbed: bracketEmbedFor(t),
    registrationLink: t.links.registration || '',
    telegramLink: t.links.telegram || '',
    description: t.description || '',
    winner: t.winner ? t.winner.name : '',
    prizePool: t.prizePool.map(p => {
      const holders = t.entries.filter(e => e.place === p.place);
      return { place: typeof p.place === 'number' ? p.place : Number(p.place), amount: money(p.amountRub),
        team: holders.length === 1 ? holders[0].team.name : '', ...(p.note && { note: p.note }) };
    }),
    links: clean({ dotabuff: t.links.dotabuff, discord: t.links.discord, rules: t.links.rules, bracket: t.links.bracket }),
    casters: t.casters,
    teamsList: t.entries.map(e => clean({
      id: e.team.id,
      name: e.team.name,
      logo: e.team.logo || 'dota2.png',
      roster: e.roster.map(r => ({ nick: r.player.nick, pos: r.pos, id: r.player.id })),
      seed: placeLabel(e) ? `${placeLabel(e)} место` : undefined,
    })),
  }));

  /* ───── игроки: стинты (непрерывные периоды в одной команде) ───── */
  const playerById = new Map(playerDocs.map(p => [p.id, p]));
  const lastTournamentOfTeam = id => teamById.get(id)?.history[0]?.tournament.id;

  const players = playerDocs.map(p => {
    const rows = [...p.history].sort((a, b) => a.tournament.start.localeCompare(b.tournament.start) || a.tournament.end.localeCompare(b.tournament.end));
    const stints = [];
    for (const r of rows) {
      const cur = stints[stints.length - 1];
      if (cur && cur.teamId === r.team.id) {
        cur.left = r.tournament.end; cur.lastTid = r.tournament.id;
        if (r.role === 'main') cur.pos = r.pos;
      } else {
        stints.push({ teamId: r.team.id, pos: r.role === 'main' ? r.pos : null, joined: r.tournament.start, left: r.tournament.end, lastTid: r.tournament.id });
      }
    }
    stints.forEach((s, i) => { s.active = i === stints.length - 1 && lastTournamentOfTeam(s.teamId) === s.lastTid; });
    const lastMain = [...rows].reverse().find(r => r.role === 'main');
    const entryOf = r => teamById.get(r.team.id).history.find(h => h.tournament.id === r.tournament.id);
    return clean({
      id: p.id, nick: p.nick, aliases: p.aliases, photo: p.photo, country: p.country,
      pos: lastMain ? lastMain.pos : null,
      banned: p.banned.map(b => clean({ league: b.league, reason: b.reason })),
      history: stints.map(s => ({ teamId: s.teamId, pos: s.pos, joined: s.joined, left: s.active ? null : s.left, active: s.active })),
      tournaments: [...rows].reverse().map(r => {
        const e = entryOf(r);
        return clean({
          title: r.tournament.title, tournamentId: r.tournament.id, date: r.tournament.start,
          place: placeLabel(r), prize: e?.prizeRub !== undefined ? money(e.prizeRub) : '',
          limit: tById.get(r.tournament.id)?.limit || '', teamId: r.team.id, playerPos: r.role === 'main' ? r.pos : null,
        });
      }),
    });
  });

  /* ───── команды ───── */
  const teams = teamDocs.map(t => {
    const hist = [...t.history].reverse();                      // от старых к новым
    const last = t.lastRoster;
    const activeIds = new Set(last ? last.players.map(x => x.id) : []);
    const streakStart = (pid, upTo) => {                         // начало серии участия игрока (до турнира upTo, если задан)
      let start = null;
      for (const h of hist) {
        start = h.roster.some(x => x.id === pid) ? (start ?? h.tournament.start) : null;
        if (upTo && h.tournament.id === upTo) break;
      }
      return start;
    };
    const lastSeen = pid => [...hist].reverse().find(h => h.roster.some(x => x.id === pid));
    const activeRoster = last ? last.players.map(x => clean({
      nick: x.nick, pos: x.pos, id: x.id, joined: streakStart(x.id),
      photo: playerById.get(x.id)?.photo || 'image.png', country: playerById.get(x.id)?.country,
    })) : [];

    const former = new Map();
    for (const h of hist) for (const x of h.roster) if (!activeIds.has(x.id)) former.set(x.id, x);
    const formerPlayers = [...former.values()].map(x => {
      const seen = lastSeen(x.id);
      const joined = streakStart(x.id, seen.tournament.id);
      const later = playerById.get(x.id)?.history.filter(h => h.tournament.start > seen.tournament.start && h.team.id !== t.id)
        .sort((a, b) => b.tournament.start.localeCompare(a.tournament.start))[0];
      return clean({ nick: x.nick, pos: x.pos, id: x.id, joined, left: seen.tournament.end, newTeam: later ? later.team.name : '' });
    });

    return clean({
      id: t.id, name: t.name, aliases: [t.name, ...t.aliases], logo: t.logo || 'dota2.png', region: t.region,
      prize: money(t.stats.prizeTotalRub), telegramLink: t.telegram || '', captainLink: t.captain || '',
      description: t.description || '', activeRoster, staff: t.staff, formerPlayers,
      tournaments: t.history.map(h => clean({
        title: h.tournament.title, tournamentId: h.tournament.id, date: h.tournament.start, place: placeLabel(h),
        prize: h.prizeRub !== undefined ? money(h.prizeRub) : '', limit: tById.get(h.tournament.id)?.limit || '',
      })),
    });
  });

  /* ───── организаторы ───── */
  const organizers = orgDocs.map(o => clean({
    id: o.id, name: o.name, aliases: [o.name, ...o.aliases], logo: o.logo, region: o.region, description: o.description || '',
    telegramLink: o.telegram || '', discordLink: o.discord || '',
    links: { website: o.website || '', youtube: o.youtube || '' },
  }));

  const list = a => `[\n${a.map(x => '  ' + JSON.stringify(x)).join(',\n')}\n]`;
  return [
    '// Сгенерировано npm run build из content/. Не править вручную.',
    `const tournaments = ${list(tournaments)};`,
    `const teams = ${list(teams)};`,
    `const organizers = ${list(organizers)};`,
    `const playersData = ${list(players)};`,
    '',
  ].join('\n');
}
