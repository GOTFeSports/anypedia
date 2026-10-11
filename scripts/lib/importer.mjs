// scripts/lib/importer.mjs — чистая логика импорта (без файлов и сети, поэтому легко тестируется).
//
// Вход: уже существующие команды/игроки, регистрация (из CSV), результаты (из любого адаптера).
// Выход: entries/matches для content/results/<турнир>.json и список новых/изменённых
// команд и игроков. Новые команды и игроки создаются автоматически; единственное, что требует
// решения человека, — имя, похожее на существующую команду, но не совпадающее с ней (unresolved).

import { normKey, uniqueSlug, levenshtein } from './util.mjs';

const clone = v => JSON.parse(JSON.stringify(v));

export function buildImport({
  teams = [], players = [], identity = { accounts: {} },
  existingEntries = [], existingMatches = [],
  registration = null,        // результат parseRegistrations().teams
  placements = null,          // [{ name, place, placeTo? }]
  matches = null,             // [{ bracket, round, a, b, score, winner }] (имена команд)
  participants = [],          // имена всех участников (чтобы у каждого матча была команда в entries)
  aliases = {},               // { 'имя из результатов': 'team-id' } — ручное сопоставление
  forceNew = [],              // имена, которые нужно создать как новые команды вопреки похожести
}) {
  const warnings = [];
  const unresolved = [];

  /* ───── команды ───── */
  const teamList = clone(teams);
  const teamById = new Map(teamList.map(t => [t.id, t]));
  const takenTeamIds = new Set(teamById.keys());
  const teamIndex = new Map();
  const indexTeam = t => { for (const n of [t.name, ...(t.aliases || [])]) teamIndex.set(normKey(n), t.id); };
  teamList.forEach(indexTeam);
  const createdTeams = [], updatedTeams = new Set();
  const forceNewKeys = new Set(forceNew.map(normKey));
  const aliasByKey = new Map(Object.entries(aliases).map(([n, id]) => [normKey(n), id]));

  function createTeam(name) {
    const team = { id: uniqueSlug(name, takenTeamIds), name: name.trim(), aliases: [] };
    teamList.push(team); teamById.set(team.id, team); takenTeamIds.add(team.id);
    indexTeam(team); createdTeams.push(team);
    return team.id;
  }

  function resolveTeam(rawName, context) {
    const name = String(rawName ?? '').replace(/\s+/g, ' ').trim();
    if (!name) return null;
    const key = normKey(name);

    if (aliasByKey.has(key)) {
      const id = aliasByKey.get(key);
      const team = teamById.get(id);
      if (!team) { warnings.push(`--alias: команда «${id}» не существует`); return null; }
      if (!teamIndex.has(key)) { team.aliases.push(name); teamIndex.set(key, id); updatedTeams.add(id); }
      return id;
    }
    if (teamIndex.has(key)) return teamIndex.get(key);
    if (forceNewKeys.has(key)) return createTeam(name);

    const suggestions = [];
    for (const [k, id] of teamIndex) {
      const limit = Math.max(1, Math.floor(Math.min(k.length, key.length) * 0.2));
      if (k.length >= 4 && key.length >= 4 && levenshtein(k, key) <= limit) {
        if (!suggestions.some(s => s.id === id)) suggestions.push({ id, name: teamById.get(id).name });
      }
    }
    if (suggestions.length) {
      if (!unresolved.some(u => u.name === name)) unresolved.push({ name, context, suggestions });
      return null;
    }
    return createTeam(name);
  }

  /* ───── игроки ───── */
  const playerList = clone(players);
  const playerById = new Map(playerList.map(p => [p.id, p]));
  const takenPlayerIds = new Set(playerById.keys());
  const accounts = { ...(identity.accounts || {}) };
  const linked = new Set(Object.values(accounts));
  const playerIndex = new Map();
  const indexPlayer = p => {
    for (const n of [p.nick, ...(p.aliases || [])]) {
      const k = normKey(n);
      if (!playerIndex.has(k)) playerIndex.set(k, []);
      if (!playerIndex.get(k).includes(p.id)) playerIndex.get(k).push(p.id);
    }
  };
  playerList.forEach(indexPlayer);
  const createdPlayers = [], updatedPlayers = new Set(), newAccounts = {};

  function createPlayer(nick, acc) {
    const player = { id: uniqueSlug(nick, takenPlayerIds), nick: nick.trim(), aliases: [], banned: [] };
    playerList.push(player); playerById.set(player.id, player); takenPlayerIds.add(player.id);
    indexPlayer(player); createdPlayers.push(player);
    if (acc) { accounts[acc] = player.id; newAccounts[acc] = player.id; linked.add(player.id); }
    return player.id;
  }

  function resolvePlayer(p, teamName) {
    const acc = p.accountId;
    if (acc && accounts[acc]) {
      const player = playerById.get(accounts[acc]);
      if (player && !(playerIndex.get(normKey(p.nick)) || []).includes(player.id)) {
        player.aliases.push(p.nick.trim()); indexPlayer(player); updatedPlayers.add(player.id);   // сменил ник
      }
      return accounts[acc];
    }
    const candidates = playerIndex.get(normKey(p.nick)) || [];
    if (acc) {
      const free = candidates.find(id => !linked.has(id));
      if (free) { accounts[acc] = free; newAccounts[acc] = free; linked.add(free); return free; }
      if (candidates.length) warnings.push(`«${p.nick}» (${teamName}): ник уже занят другим аккаунтом — создан отдельный игрок (тёзка)`);
      return createPlayer(p.nick, acc);
    }
    warnings.push(`«${p.nick}» (${teamName}): нет account id — игрок сопоставлен только по нику`);
    return candidates.length ? candidates[0] : createPlayer(p.nick, null);
  }

  /* ───── entries ───── */
  const entries = new Map(clone(existingEntries).map(e => [e.team, e]));
  const ensureEntry = teamId => {
    if (!entries.has(teamId)) entries.set(teamId, { team: teamId, roster: [], subs: [] });
    return entries.get(teamId);
  };
  const inRegistration = new Set();

  if (registration) {
    // повторная заявка одной команды: остаётся последняя
    const byKey = new Map();
    for (const r of registration) {
      if (byKey.has(normKey(r.team))) warnings.push(`«${r.team}» подала заявку повторно — использована последняя`);
      byKey.set(normKey(r.team), r);
    }
    for (const reg of byKey.values()) {
      const teamId = resolveTeam(reg.team, 'регистрация');
      if (!teamId) continue;
      inRegistration.add(teamId);
      const entry = ensureEntry(teamId);
      entry.roster = [...reg.players].sort((x, y) => x.pos - y.pos)
        .map(p => ({ player: resolvePlayer(p, reg.team), pos: p.pos }));
      entry.subs = reg.subs.map(p => resolvePlayer(p, reg.team));
    }
  }

  if (placements) {
    for (const e of entries.values()) { delete e.place; delete e.placeTo; }
    const seen = new Set();
    for (const pl of placements) {
      const teamId = resolveTeam(pl.name, 'результаты');
      if (!teamId) continue;
      if (seen.has(teamId)) { warnings.push(`«${pl.name}» указана в результатах дважды — использовано первое место`); continue; }
      seen.add(teamId);
      if (registration && !inRegistration.has(teamId)) warnings.push(`«${pl.name}» есть в результатах, но нет в регистрации — ростер пустой`);
      const entry = ensureEntry(teamId);
      entry.place = pl.place;
      if (pl.placeTo !== undefined) entry.placeTo = pl.placeTo;
    }
  }

  for (const name of participants) {
    const teamId = resolveTeam(name, 'участники');
    if (teamId) ensureEntry(teamId);
  }

  let finalMatches = existingMatches;
  if (matches) {
    finalMatches = [];
    for (const m of matches) {
      const a = resolveTeam(m.a, 'матчи'), b = resolveTeam(m.b, 'матчи');
      if (!a || !b) continue;
      ensureEntry(a); ensureEntry(b);
      finalMatches.push({ bracket: m.bracket, round: m.round, a, b, score: m.score, winner: m.winner });
    }
  }

  const nameOf = id => teamById.get(id)?.name || id;
  const sortedEntries = [...entries.values()].sort((x, y) =>
    (x.place ?? 1e9) - (y.place ?? 1e9) || nameOf(x.team).localeCompare(nameOf(y.team), 'ru'));

  const logoTodo = registration
    ? registration.filter(r => r.logoSource && createdTeams.some(t => normKey(t.name) === normKey(r.team)))
        .map(r => ({ team: r.team, source: r.logoSource }))
    : [];

  return {
    entries: sortedEntries,
    matches: finalMatches,
    createdTeams,
    updatedTeams: [...updatedTeams].map(id => teamById.get(id)),
    createdPlayers,
    updatedPlayers: [...updatedPlayers].map(id => playerById.get(id)),
    newAccounts,
    unresolved,
    warnings,
    logoTodo,
  };
}
