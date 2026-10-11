// npm run build — content/* → data/*.json + sitemap.xml.
//
// content/ — единственный источник правды. Всё, что можно вывести (победитель, история команды и игрока,
// призовые по местам, текущий состав, суммарные призы организатора, sitemap), считается здесь и
// руками не пишется. data/ — результат сборки: не править.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeJson } from './lib/util.mjs';
import { loadContent, validateContent, DEFAULT_ROOT } from './validate.mjs';

const byDateDesc = (a, b) => String(b.start).localeCompare(String(a.start)) || String(b.end).localeCompare(String(a.end));
const ref = (t) => t && ({ id: t.id, name: t.name, ...(t.logo && { logo: t.logo }) });

export function buildData(content, { siteUrl = '' } = {}) {
  const T = new Map(content.tournaments.map(r => [r.id, r.data]));
  const TM = new Map(content.teams.map(r => [r.id, r.data]));
  const PL = new Map(content.players.map(r => [r.id, r.data]));
  const ORG = new Map(content.organizers.map(r => [r.id, r.data]));
  const RES = new Map(content.results.map(r => [r.id, r.data]));
  const files = new Map();

  const tournamentsSorted = [...T.values()].sort(byDateDesc);
  const prizeTotal = t => t.prizePool.reduce((s, p) => s + p.amountRub, 0);

  /* приз и победитель выводятся из места: только если место занято ровно одной командой */
  const placeCount = (entries, place) => entries.filter(e => e.place === place).length;
  const prizeFor = (t, entries, e) => {
    if (e.place === undefined || e.placeTo !== undefined || placeCount(entries, e.place) !== 1) return undefined;
    return t.prizePool.find(p => p.place === e.place)?.amountRub;
  };
  const winnerOf = (entries) => {
    const first = entries.filter(e => e.place === 1);
    return first.length === 1 ? ref(TM.get(first[0].team)) : null;
  };

  /* ───── турниры ───── */
  const summaries = new Map();
  for (const t of tournamentsSorted) {
    const res = RES.get(t.id) || { entries: [], matches: [] };
    const entries = [...res.entries].sort((a, b) => (a.place ?? 1e9) - (b.place ?? 1e9));
    const doc = {
      ...t,
      organizers: t.organizer.map(o => ref(ORG.get(o))),
      prizeTotalRub: prizeTotal(t),
      teamsCount: entries.length,
      winner: winnerOf(entries),
      entries: entries.map(e => ({
        team: ref(TM.get(e.team)),
        ...(e.place !== undefined && { place: e.place }),
        ...(e.placeTo !== undefined && { placeTo: e.placeTo }),
        ...(prizeFor(t, entries, e) !== undefined && { prizeRub: prizeFor(t, entries, e) }),
        roster: [...e.roster].sort((a, b) => a.pos - b.pos).map(r => ({ player: { id: r.player, nick: PL.get(r.player).nick }, pos: r.pos })),
        subs: e.subs.map(s => ({ id: s, nick: PL.get(s).nick })),
      })),
      matches: res.matches.map(m => ({ ...m, a: ref(TM.get(m.a)), b: ref(TM.get(m.b)) })),
    };
    files.set(`tournaments/${t.id}.json`, doc);
    summaries.set(t.id, {
      id: t.id, title: t.title, start: t.start, end: t.end, organizer: t.organizer,
      ...(t.tier && { tier: t.tier }), location: t.location,
      ...(t.format && { format: t.format }), ...(t.limit && { limit: t.limit }),
      prizeTotalRub: doc.prizeTotalRub, ...(t.prizeNote && { prizeNote: t.prizeNote }),
      teamsCount: doc.teamsCount, winner: doc.winner,
    });
  }

  /* ───── команды и игроки: история из results ───── */
  const teamHistory = new Map([...TM.keys()].map(k => [k, []]));
  const playerHistory = new Map([...PL.keys()].map(k => [k, []]));
  for (const t of tournamentsSorted) {
    const res = RES.get(t.id);
    if (!res) continue;
    const tinfo = { id: t.id, title: t.title, start: t.start, end: t.end, ...(t.tier && { tier: t.tier }) };
    for (const e of res.entries) {
      const prize = prizeFor(t, res.entries, e);
      teamHistory.get(e.team).push({
        tournament: tinfo,
        ...(e.place !== undefined && { place: e.place }), ...(e.placeTo !== undefined && { placeTo: e.placeTo }),
        ...(prize !== undefined && { prizeRub: prize }),
        roster: [...e.roster].sort((a, b) => a.pos - b.pos).map(r => ({ id: r.player, nick: PL.get(r.player).nick, pos: r.pos })),
        subs: e.subs.map(s => ({ id: s, nick: PL.get(s).nick })),
      });
      const row = role => ({
        tournament: tinfo, team: ref(TM.get(e.team)), role,
        ...(e.place !== undefined && { place: e.place }), ...(e.placeTo !== undefined && { placeTo: e.placeTo }),
      });
      for (const r of e.roster) playerHistory.get(r.player).push({ ...row('main'), pos: r.pos });
      for (const s of e.subs) playerHistory.get(s).push(row('sub'));
    }
  }

  const teamStats = (h) => ({
    tournaments: h.length,
    wins: h.filter(x => x.place === 1).length,
    podiums: h.filter(x => x.place !== undefined && x.place <= 3).length,
    prizeTotalRub: h.reduce((s, x) => s + (x.prizeRub || 0), 0),
  });

  for (const [id, team] of [...TM].sort(([a], [b]) => a.localeCompare(b))) {
    const history = teamHistory.get(id);
    files.set(`teams/${id}.json`, {
      ...team, stats: teamStats(history),
      lastRoster: history.length ? { tournament: history[0].tournament, players: history[0].roster, subs: history[0].subs } : null,
      history,
    });
  }

  for (const [id, player] of [...PL].sort(([a], [b]) => a.localeCompare(b))) {
    const history = playerHistory.get(id);
    const teams = new Map();
    for (const h of history) {
      const cur = teams.get(h.team.id) || { team: h.team, first: h.tournament.start, last: h.tournament.start, tournaments: 0 };
      cur.first = h.tournament.start < cur.first ? h.tournament.start : cur.first;
      cur.last = h.tournament.start > cur.last ? h.tournament.start : cur.last;
      cur.tournaments++;
      teams.set(h.team.id, cur);
    }
    const mainPos = history.filter(h => h.role === 'main').map(h => h.pos);
    const favPos = mainPos.length
      ? Object.entries(mainPos.reduce((m, p) => ({ ...m, [p]: (m[p] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0] * 1
      : null;
    files.set(`players/${id}.json`, {
      ...player,
      stats: { tournaments: history.length, wins: history.filter(h => h.place === 1).length, mainPosition: favPos },
      teams: [...teams.values()].sort((a, b) => b.last.localeCompare(a.last)),
      history,
    });
  }

  /* ───── организаторы ───── */
  const orgTournaments = new Map([...ORG.keys()].map(k => [k, []]));
  for (const t of tournamentsSorted) for (const o of t.organizer) orgTournaments.get(o).push(summaries.get(t.id));
  for (const [id, org] of [...ORG].sort(([a], [b]) => a.localeCompare(b))) {
    const list = orgTournaments.get(id);
    files.set(`organizers/${id}.json`, {
      ...org,
      stats: { tournaments: list.length, prizeTotalRub: list.reduce((s, t) => s + t.prizeTotalRub, 0) },
      tournaments: list,
    });
  }

  /* ───── лёгкий индекс для списков и поиска ───── */
  files.set('index.json', {
    tournaments: tournamentsSorted.map(t => summaries.get(t.id)),
    teams: [...TM.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru')).map(t => ({
      id: t.id, name: t.name, ...(t.logo && { logo: t.logo }), region: t.region,
      aliases: t.aliases, ...teamStats(teamHistory.get(t.id)),
    })),
    players: [...PL.values()].sort((a, b) => a.nick.localeCompare(b.nick, 'ru')).map(p => ({
      id: p.id, nick: p.nick, aliases: p.aliases,
      ...(p.country && { country: p.country }), ...(p.photo && { photo: p.photo }),
      tournaments: playerHistory.get(p.id).length,
    })),
    organizers: [...ORG.values()].sort((a, b) => a.name.localeCompare(b.name, 'ru')).map(o => ({
      id: o.id, name: o.name, ...(o.logo && { logo: o.logo }), region: o.region,
      tournaments: orgTournaments.get(o.id).length,
      prizeTotalRub: orgTournaments.get(o.id).reduce((s, t) => s + t.prizeTotalRub, 0),
    })),
  });

  /* ───── sitemap ───── */
  const base = siteUrl.replace(/\/+$/, '');
  const url = (loc, lastmod, changefreq, priority) =>
    `  <url>\n    <loc>${base}/${loc}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  const enc = encodeURIComponent;
  const lastEnd = tournamentsSorted[0]?.end;
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Сгенерировано npm run build. Не править вручную. -->',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    url('', lastEnd, 'daily', '1.0'),
    ...['teams-list', 'players-list', 'organizers-list'].map(p => url(p, lastEnd, 'weekly', '0.7')),
    ...tournamentsSorted.map(t => url(enc(t.id), t.end, 'weekly', '0.8')),
    ...[...TM.keys()].sort().map(id => url(`team/${enc(id)}`, null, 'monthly', '0.6')),
    ...[...PL.keys()].sort().map(id => url(`player/${enc(id)}`, null, 'monthly', '0.5')),
    ...[...ORG.keys()].sort().map(id => url(`organizer/${enc(id)}`, null, 'monthly', '0.6')),
    '</urlset>',
    '',
  ].join('\n');

  return { files, sitemap };
}

const MARKER = '.generated';

export function writeBuild(root, { files, sitemap }) {
  const dataDir = path.join(root, 'data');
  if (fs.existsSync(dataDir)) {
    if (!fs.existsSync(path.join(dataDir, MARKER)) && fs.readdirSync(dataDir).length) {
      throw new Error('папка data/ существует и не создана сборкой (нет data/.generated) — не трогаю её');
    }
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, MARKER), 'Сгенерировано npm run build. Не править вручную.\n');
  for (const [rel, doc] of files) writeJson(path.join(dataDir, rel), doc);
  fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
}

export function siteUrlFor(root, env = process.env) {
  if (env.SITE_URL) return env.SITE_URL;
  const cname = path.join(root, 'CNAME');
  if (fs.existsSync(cname)) {
    const host = fs.readFileSync(cname, 'utf8').trim();
    if (host) return `https://${host}`;
  }
  return '';
}

/* load → validate → build → write. Возвращает ошибки вместо исключения, чтобы вызывающий сам решал, что делать. */
export function buildAll(root = DEFAULT_ROOT, { env = process.env } = {}) {
  const content = loadContent(root);
  const { errors, warnings } = validateContent(content);
  if (errors.length) return { ok: false, errors, warnings };
  const out = buildData(content, { siteUrl: siteUrlFor(root, env) });
  writeBuild(root, out);
  return { ok: true, errors, warnings, files: out.files.size };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = buildAll();
  r.warnings.forEach(w => console.warn('⚠ ' + w));
  if (!r.ok) { r.errors.forEach(e => console.error('✖ ' + e)); process.exit(1); }
  console.log(`✔ Собрано файлов в data/: ${r.files}, sitemap.xml обновлён.`);
}
