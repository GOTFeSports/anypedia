// Собирает tournaments/index.json из папок tournaments/<slug>/ и проверяет данные.
// GitHub Pages / Vercel не умеют листать папки, поэтому список турниров, статистика и ближайшие
// матчи для главной страницы лежат в одном файле.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TDIR = process.env.ANYPEDIA_TOURNAMENTS || path.join(ROOT, 'tournaments');
const OUT = process.env.ANYPEDIA_OUT || ROOT; // куда писать страницы для превью (по умолчанию корень сайта)

function readJson(p) {
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error(`✖ ${path.relative(ROOT, p)}: ошибка JSON — ${e.message}`);
    process.exitCode = 1;
    return null;
  }
}

const isUrl = (s) => /^https?:\/\//i.test(s || '');
const hasScore = (m) => m.score1 != null && m.score2 != null && m.score1 !== '' && m.score2 !== '' && !isNaN(m.score1) && !isNaN(m.score2);
const STAGE_NAMES = { groups: 'Групповой этап', swiss: 'Швейцарская система', single_elim: 'Single Elimination', double_elim: 'Double Elimination' };
const stageName = (st) => st.name || STAGE_NAMES[st.type] || 'Этап';

// Этапы: поддерживаем result.stages и старый формат groups / playoffs
function stagesOf(result) {
  if (result?.stages?.length) return result.stages;
  const out = [];
  if (result?.groups?.length) out.push({ type: 'groups', groups: result.groups });
  if (result?.playoffs?.rounds?.length) out.push({ type: 'single_elim', rounds: result.playoffs.rounds });
  return out;
}

// Все матчи турнира списком (для виджета «Матчи» на главной)
function collectMatches(result) {
  const out = [];
  const add = (m, stage) => {
    if (m.team1 && m.team2) out.push({ stage, team1: m.team1, team2: m.team2, score1: m.score1 ?? null, score2: m.score2 ?? null, winner: m.winner ?? null, date: m.date ?? null });
  };
  const rounds = (list, label) => (list ?? []).forEach((r) => (r.matches ?? []).forEach((m) => add(m, label ?? r.name)));
  for (const st of stagesOf(result)) {
    const label = stageName(st);
    if (st.type === 'groups') {
      for (const g of st.groups ?? []) {
        const gl = `${label} · ${g.name ?? ''}`.replace(/ · $/, '');
        (g.matches ?? []).forEach((m) => add(m, gl));
        rounds(g.rounds, gl);
      }
    } else if (st.type === 'swiss') {
      (st.rounds ?? []).forEach((r) => (r.matches ?? []).forEach((m) => add(m, r.name ? `${label} · ${r.name}` : label)));
    } else {
      rounds(st.rounds);
    }
  }
  (result?.matches ?? []).forEach((m) => add(m, m.round || ''));
  return out;
}

// Эти имена нельзя использовать как slug турнира: это папки сайта, адреса /<slug> с ними конфликтуют
const RESERVED = new Set(['assets', 'css', 'js', 'tools', 'tournaments', 'index', 'index.html', 'vercel.json', 'package.json', 'readme.md']);
const list = [];
const pagesMeta = []; // данные для страниц-превью
const allMatches = [];
const uniqueTeams = new Set();
const dirs = fs.existsSync(TDIR) ? fs.readdirSync(TDIR, { withFileTypes: true }).filter((d) => d.isDirectory()) : [];

for (const d of dirs) {
  const dir = path.join(TDIR, d.name);
  const warn = (msg) => console.warn(`⚠ ${d.name}: ${msg}`);
  if (RESERVED.has(d.name.toLowerCase())) warn('имя папки занято сайтом (адрес /' + d.name + ' не откроется) — переименуйте');
  const info = readJson(path.join(dir, 'information.json'));
  if (!info) {
    warn('нет information.json — пропущен');
    continue;
  }
  const roster = readJson(path.join(dir, 'roster.json'));
  const result = readJson(path.join(dir, 'result.json'));
  const teams = roster?.teams ?? [];
  const placements = result?.placements ?? [];
  const known = new Set(teams.map((t) => t.name));
  teams.forEach((t) => uniqueTeams.add(t.name));

  // --- проверки, чтобы опечатки не доехали до сайта ---
  const used = new Set();
  placements.forEach((p) => used.add(p.team));

  const checkRounds = (rounds, where) => {
    const ids = new Set();
    for (const r of rounds) for (const m of r.matches ?? []) if (m.id) ids.add(m.id);
    for (const r of rounds) {
      for (const m of r.matches ?? []) {
        [m.team1, m.team2].forEach((t) => t && used.add(t));
        if (m.next && !ids.has(m.next)) warn(`${where}: матч "${m.id ?? '?'}" ведёт в несуществующий матч "${m.next}"`);
      }
    }
  };
  const checkMatches = (matches) => (matches ?? []).forEach((m) => [m.team1, m.team2].forEach((t) => t && used.add(t)));

  for (const st of stagesOf(result)) {
    const label = stageName(st);
    if (st.type === 'groups') {
      for (const g of st.groups ?? []) {
        (g.teams ?? []).forEach((t) => used.add(t));
        const f = g.format ?? 'round_robin';
        if (f === 'single_elim' || f === 'double_elim') checkRounds(g.rounds ?? [], `${label} / ${g.name ?? 'группа'}`);
        else if (f === 'swiss') (g.rounds ?? []).forEach((r) => checkMatches(r.matches));
        else checkMatches(g.matches);
      }
    } else if (st.type === 'swiss') {
      (st.teams ?? []).forEach((t) => used.add(t));
      (st.rounds ?? []).forEach((r) => checkMatches(r.matches));
    } else if (st.type === 'single_elim' || st.type === 'double_elim') {
      checkRounds(st.rounds ?? [], label);
    } else {
      warn(`неизвестный тип этапа "${st.type}"`);
    }
  }
  checkMatches(result?.matches);
  if (known.size) for (const t of used) if (!known.has(t)) warn(`"${t}" есть в result, но нет в roster`);

  const logos = [info.logo, ...teams.map((t) => t.logo)].filter((l) => l && !isUrl(l));
  for (const l of logos) if (!fs.existsSync(path.join(dir, l))) warn(`не найден файл логотипа "${l}"`);

  // --- данные для главной ---
  const logoOf = (name) => {
    const t = teams.find((x) => x.name === name);
    return t?.logo ? (isUrl(t.logo) ? t.logo : `tournaments/${d.name}/${t.logo}`) : null;
  };
  for (const m of collectMatches(result)) {
    allMatches.push({ slug: d.name, tournament: info.name ?? d.name, ...m, logo1: logoOf(m.team1), logo2: logoOf(m.team2) });
  }

  const stages = stagesOf(result);
  const sections = [];
  if (teams.length) sections.push({ id: 'participants', label: 'Участники' });
  if (placements.length || info.prizes?.length) sections.push({ id: 'prizes', label: 'Призы' });
  stages.forEach((st, i) => sections.push({ id: `stage-${i}`, label: stageName(st) }));
  if (info.streams?.length) sections.push({ id: 'streams', label: 'Трансляции' });

  const winner = placements.find((p) => p.place === 1)?.team ?? null;
  list.push({
    slug: d.name,
    name: info.name ?? d.name,
    logo: info.logo || null,
    status: info.status ?? 'upcoming',
    date_start: info.date_start ?? null,
    date_end: info.date_end ?? null,
    organizer: info.organizer ?? '',
    prize_pool: info.prize_pool ?? '',
    pts_cap: info.pts_cap ?? null,
    teams_count: teams.length,
    winner,
    winner_logo: winner ? logoOf(winner) : null,
    sections,
  });
  pagesMeta.push({ slug: d.name, info, winner, teams: teams.length });
}

list.sort((a, b) => String(b.date_start ?? '').localeCompare(String(a.date_start ?? '')));

const byDate = (dir) => (a, b) => dir * String(a.date ?? '').localeCompare(String(b.date ?? ''));
const isPlayed = (m) => hasScore(m) || m.winner === 1 || m.winner === 2; // счёт или победа без счёта (W/L)
const played = allMatches.filter(isPlayed);
const planned = allMatches.filter((m) => !isPlayed(m));
const index = {
  generated: new Date().toISOString(),
  stats: {
    tournaments: list.length,
    teams: uniqueTeams.size,
    matches: played.length,
    live: list.filter((t) => t.status === 'live').length,
    finished: list.filter((t) => t.status === 'finished').length,
  },
  matches: {
    upcoming: planned.sort(byDate(1)).slice(0, 12),
    completed: played.sort(byDate(-1)).slice(0, 12),
  },
  tournaments: list,
};

fs.writeFileSync(path.join(TDIR, 'index.json'), JSON.stringify(index, null, 2) + '\n');
console.log(`✔ tournaments/index.json: ${list.length} турнир(ов), ${played.length} сыгранных матчей, ${planned.length} запланированных`);

/* ---------- Страницы для превью ссылок (Telegram, Discord, VK, поисковики) ----------
   Сайт — SPA, а боты соцсетей не выполняют JS и видели бы одну и ту же шапку для любой ссылки.
   Поэтому для каждого турнира рядом с index.html кладётся <slug>.html: это копия index.html
   с названием, описанием и og-тегами конкретного турнира. Браузер открывает ту же SPA как обычно.
   На Vercel адрес /<slug> отдаёт этот файл благодаря "cleanUrls": true в vercel.json. */
const PAGE_MARK = '<!-- anypedia:generated -->';
const escAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pkg = readJson(path.join(ROOT, 'package.json')) || {};
const SITE = String(process.env.SITE_URL || pkg.homepage || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')).replace(/\/+$/, '');
const OG_IMAGE = 'assets/og.png';
const nfmt = (n) => Number(n).toLocaleString('ru-RU').replace(/[\u00a0\u202f]/g, ' ');
const dfmt = (iso) => {
  const x = new Date(`${iso}T00:00:00`);
  return isNaN(x) ? '' : x.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ г\.$/, '');
};
function dRange(a, b) {
  if (!a && !b) return '';
  if (!b || a === b) return dfmt(a || b);
  const x = new Date(`${a}T00:00:00`), y = new Date(`${b}T00:00:00`);
  if (!isNaN(x) && !isNaN(y) && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()) return `${x.getDate()}–${dfmt(b)}`;
  return `${dfmt(a)} — ${dfmt(b)}`;
}

function ogBlock({ title, desc, url }) {
  const img = SITE ? `${SITE}/${OG_IMAGE}` : '';
  return [
    '<!-- og -->',
    `<link rel="canonical" href="${escAttr(url)}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="Anypedia">',
    '<meta property="og:locale" content="ru_RU">',
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(desc)}">`,
    `<meta property="og:url" content="${escAttr(url)}">`,
    ...(img ? [`<meta property="og:image" content="${escAttr(img)}">`, '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">'] : []),
    `<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:title" content="${escAttr(title)}">`,
    `<meta name="twitter:description" content="${escAttr(desc)}">`,
    ...(img ? [`<meta name="twitter:image" content="${escAttr(img)}">`] : []),
    '<!-- /og -->',
  ].join('\n  ');
}

function pageFor(template, { title, desc, url }) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escAttr(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escAttr(desc)}">`)
    .replace(/<!-- og -->[\s\S]*?<!-- \/og -->/, ogBlock({ title, desc, url }));
  return html.replace('<head>', `<head>\n  ${PAGE_MARK}`);
}

function tournamentDesc({ info, winner, teams }) {
  const parts = ['Турнир по Dota 2'];
  const dates = dRange(info.date_start, info.date_end);
  if (dates) parts.push(dates);
  if (info.prize_pool) parts.push(`Призовой фонд ${info.prize_pool}`);
  if (info.pts_cap) parts.push(`Лимит ${nfmt(info.pts_cap)}`);
  if (teams) parts.push(`Команд: ${teams}`);
  if (winner) parts.push(`Победитель: ${winner}`);
  let d = parts.join(' · ');
  if (info.description && d.length < 150) {
    const extra = String(info.description).replace(/\s+/g, ' ').trim();
    if (extra) d += `. ${extra.length > 160 ? `${extra.slice(0, 157).trimEnd()}…` : extra}`;
  }
  return d;
}

const tplPath = path.join(ROOT, 'index.html');
if (fs.existsSync(tplPath)) {
  const template = fs.readFileSync(tplPath, 'utf8');
  if (!SITE) console.warn('⚠ не задан адрес сайта (package.json → homepage или SITE_URL): og:image и og:url не будут добавлены в превью');
  const slugOk = /^[a-z0-9][a-z0-9_-]*$/i;
  const keep = new Set();
  for (const m of pagesMeta) {
    if (RESERVED.has(m.slug.toLowerCase()) || !slugOk.test(m.slug)) {
      console.warn(`⚠ ${m.slug}: страница для превью не создана (адрес должен состоять из латиницы, цифр, - и _)`);
      continue;
    }
    const file = `${m.slug}.html`;
    const title = `${m.info.name ?? m.slug} — Anypedia`;
    const html = pageFor(template, { title, desc: tournamentDesc(m), url: SITE ? `${SITE}/${m.slug}` : `/${m.slug}` });
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, file), html);
    keep.add(file);
  }
  // Удаляем страницы удалённых турниров (только те, что создал сам скрипт)
  for (const f of fs.existsSync(OUT) ? fs.readdirSync(OUT) : []) {
    if (!f.endsWith('.html') || f === 'index.html' || keep.has(f)) continue;
    const head = fs.readFileSync(path.join(OUT, f), 'utf8').slice(0, 400);
    if (head.includes(PAGE_MARK)) fs.unlinkSync(path.join(OUT, f));
  }
  console.log(`✔ страницы для превью ссылок: ${keep.size}`);
}
