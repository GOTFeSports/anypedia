#!/usr/bin/env node
// Импорт данных турнира в tournaments/<slug>/. Только записывает те же JSON, которые читает сайт —
// существующие файлы без --force не перезаписываются. После импорта запустите: npm run build
//
//   npm run import -- challonge <ссылка|id> [--slug s] [--key КЛЮЧ] [--from-file api.json]
//                       [--series ..] [--organizer ..] [--pts 30000] [--prize "20 000 ₽"]
//                       [--prizes "1=15 000 ₽;2=5 000 ₽"] [--only info,roster,result] [--force] [--dry] [--build]
//   npm run import -- csv roster      <файл.csv> <slug> [--force]
//   npm run import -- csv matches     <файл.csv> <slug> --format list|round_robin|swiss|single_elim|double_elim [--name "Плей-офф"] [--force]
//   npm run import -- csv placements  <файл.csv> <slug>
//   npm run import -- info <slug> --name "Название" [--date 2026-10-31] [--date-end ..] [--prize ..] [--pts ..] [--series ..] [--organizer ..] [--format "Single Elimination"] [--prizes ..]
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { rosterFromCsv, stageFromCsv, placementsFromCsv } from './lib/csv.mjs';
import { fetchChallonge, mapChallonge, parseChallongeRef } from './lib/challonge.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TDIR = process.env.ANYPEDIA_TOURNAMENTS || path.join(ROOT, 'tournaments');
const RESERVED = new Set(['assets', 'css', 'js', 'tools', 'tournaments', 'index', 'index.html']);

function parseArgs(argv) {
  const pos = [], flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const k = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) flags[k] = true;
      else { flags[k] = next; i++; }
    } else pos.push(a);
  }
  return { pos, flags };
}

const die = (msg) => { console.error(`✖ ${msg}`); process.exit(1); };
const slugify = (s) => String(s).toLowerCase().replace(/[_\s]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');

function dirFor(slug) {
  if (!slug) die('Не указан slug турнира (имя папки, оно же адрес на сайте: /<slug>)');
  const s = slugify(slug);
  if (!s) die(`Из "${slug}" не получился адрес: используйте латиницу, цифры и дефис`);
  if (RESERVED.has(s)) die(`Имя "${s}" занято сайтом — выберите другое`);
  return { slug: s, dir: path.join(TDIR, s) };
}

const state = { dry: false, force: false, written: [] };
function writeJson(dir, file, data, { allowOverwrite = false } = {}) {
  const p = path.join(dir, file);
  const rel = path.relative(ROOT, p);
  if (fs.existsSync(p) && !state.force && !allowOverwrite) {
    console.log(`– ${rel}: уже есть, пропущен (перезаписать: --force)`);
    return false;
  }
  if (state.dry) { console.log(`· ${rel}: будет записан (--dry)`); return true; }
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n');
  state.written.push(rel);
  console.log(`✔ ${rel}`);
  return true;
}
const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);

function parsePrizes(v) {
  if (!v || v === true) return [];
  return String(v).split(';').map((x) => x.trim()).filter(Boolean).map((x) => {
    const m = x.match(/^(\d+)(?:\s*-\s*(\d+))?\s*=\s*(.+)$/);
    if (!m) die(`Не разобрал приз "${x}" — формат: 1=15 000 ₽;2=5 000 ₽;3-4=Мерч`);
    return { place: +m[1], ...(m[2] ? { place_to: +m[2] } : {}), prize: m[3].trim() };
  });
}

function infoFromFlags(f) {
  if (!f.name || f.name === true) die('Нужно --name "Название турнира"');
  return {
    name: f.name,
    ...(f.series ? { series: f.series } : {}),
    ...(f.organizer ? { organizer: f.organizer } : {}),
    type: 'online',
    game: 'Dota 2',
    ...(f.date ? { date_start: f.date, date_end: f['date-end'] || f.date } : {}),
    ...(f.format ? { format: String(f.format).split('|').map((x) => x.trim()) } : {}),
    ...(f.pts ? { pts_cap: +f.pts } : {}),
    ...(f.prize ? { prize_pool: f.prize } : {}),
    links: {},
    prizes: parsePrizes(f.prizes),
  };
}

function maybeBuild(f) {
  if (!f.build || state.dry) {
    if (!state.dry) console.log('\nДальше: npm run build');
    return;
  }
  const r = spawnSync(process.execPath, [path.join(ROOT, 'tools/build-index.mjs')], { stdio: 'inherit' });
  if (r.status) process.exit(r.status);
}

async function main() {
  const { pos, flags: f } = parseArgs(process.argv.slice(2));
  state.dry = !!f.dry;
  state.force = !!f.force;
  const [cmd, sub] = pos;

  if (cmd === 'challonge') {
    const ref = pos[1];
    if (!ref) die('Укажите ссылку или id турнира Challonge');
    const api = f['from-file']
      ? JSON.parse(fs.readFileSync(f['from-file'], 'utf8'))
      : await fetchChallonge(ref, f.key || process.env.CHALLONGE_API_KEY).catch((e) => die(e.message));
    const out = mapChallonge(api, { series: f.series, organizer: f.organizer, pts: f.pts, prize: f.prize, prizes: parsePrizes(f.prizes) });
    const { slug, dir } = dirFor(f.slug || parseChallongeRef(ref).id);
    const only = new Set(String(f.only || 'info,roster,result').split(',').map((x) => x.trim()));
    console.log(`Турнир: ${out.info.name} → tournaments/${slug}/`);
    if (only.has('info')) writeJson(dir, 'information.json', out.info);
    if (only.has('roster')) writeJson(dir, 'roster.json', out.roster);
    if (only.has('result')) writeJson(dir, 'result.json', out.result);
    out.notes.forEach((n) => console.log(`ℹ ${n}`));
    if (only.has('roster')) console.log('ℹ Challonge не знает составы — игроков добавьте через `csv roster` или вручную.');
    maybeBuild(f);
    return;
  }

  if (cmd === 'csv') {
    const file = pos[2];
    if (!sub || !file) die('Формат: csv <roster|matches|placements> <файл.csv> <slug>');
    if (!fs.existsSync(file)) die(`Файл не найден: ${file}`);
    const { slug, dir } = dirFor(pos[3]);
    const text = fs.readFileSync(file, 'utf8');
    try {
      if (sub === 'roster') {
        const roster = rosterFromCsv(text);
        console.log(`Команд: ${roster.teams.length} → tournaments/${slug}/roster.json`);
        writeJson(dir, 'roster.json', roster);
      } else if (sub === 'matches') {
        const format = f.format && f.format !== true ? f.format : 'list';
        const r = stageFromCsv(text, { format, name: f.name && f.name !== true ? f.name : undefined });
        const p = path.join(dir, 'result.json');
        const cur = readJson(p) || { placements: [], stages: [] };
        if (r.matches) {
          if (cur.matches?.length && !state.force) die('В result.json уже есть общий список matches (перезаписать: --force)');
          cur.matches = r.matches;
          console.log(`Матчей: ${r.matches.length} → result.json (общий список)`);
        } else {
          cur.stages ||= [];
          const dup = cur.stages.findIndex((s) => s.name === r.stage.name);
          if (dup >= 0 && !state.force) die(`Этап "${r.stage.name}" уже есть в result.json. Дайте другое имя (--name) или перезапишите (--force)`);
          if (dup >= 0) cur.stages[dup] = r.stage; else cur.stages.push(r.stage);
          console.log(`Этап "${r.stage.name}" (${r.stage.type}) добавлен в result.json — этапов: ${cur.stages.length}`);
        }
        writeJson(dir, 'result.json', cur, { allowOverwrite: true });
      } else if (sub === 'placements') {
        const placements = placementsFromCsv(text);
        const cur = readJson(path.join(dir, 'result.json')) || { stages: [] };
        cur.placements = placements;
        console.log(`Мест: ${placements.length} → result.json`);
        writeJson(dir, 'result.json', { placements: cur.placements, ...cur }, { allowOverwrite: true });
      } else die(`Неизвестная команда csv ${sub}`);
    } catch (e) {
      die(e.message);
    }
    maybeBuild(f);
    return;
  }

  if (cmd === 'info') {
    const { slug, dir } = dirFor(pos[1]);
    writeJson(dir, 'information.json', infoFromFlags(f));
    maybeBuild(f);
    return;
  }

  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  if (cmd) process.exit(1);
}

main().catch((e) => die(e.stack || e.message));
