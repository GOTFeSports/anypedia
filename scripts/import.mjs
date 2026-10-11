// npm run import -- <id-турнира> [опции]
//
//   --reg <файл.csv>          выгрузка регистрации (по умолчанию private/registrations/<id>.csv, если есть)
//   --form <профиль>          принудительно выбрать профиль формы (иначе определяется по заголовку)
//   --results <файл.txt>      результаты текстом (по умолчанию content/inputs/<id>.txt, если есть)
//   --challonge-json <файл>   сохранённый ответ Challonge (вместо запроса к API)
//   --alias "Имя=team-id"     сопоставить имя из результатов с существующей командой (можно несколько раз)
//   --new "Имя"               создать новую команду вопреки похожести на существующую (можно несколько раз)
//   --dry-run                 показать, что будет сделано, ничего не записывая
//
// Источник результатов берётся из tournament.source: challonge (CHALLONGE_KEY или --challonge-json) или manual.
// Запись идёт «всё или ничего»: если есть неоднозначные имена, ничего не меняется, а отчёт говорит, что делать.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Tournament } from '../schema/index.mjs';
import { readJson, writeJson, listJson } from './lib/util.mjs';
import { parseRegistrations } from './registrations.mjs';
import { parseManualResults } from './adapters/manual.mjs';
import { fetchChallonge, normalizeChallonge } from './adapters/challonge.mjs';
import { buildImport } from './lib/importer.mjs';
import { validateRoot } from './validate.mjs';
import { buildAll } from './build-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const out = { _: [], alias: [], new: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { out._.push(a); continue; }
    const key = a.slice(2);
    if (key === 'dry-run') { out.dryRun = true; continue; }
    const val = argv[++i];
    if (key === 'alias' || key === 'new') out[key].push(val);
    else out[key] = val;
  }
  return out;
}

export async function runImport(args, { root = ROOT, env = process.env, log = console.log, fetchImpl } = {}) {
  const id = args._[0];
  if (!id) throw new Error('Укажи id турнира: npm run import -- <id-турнира>');

  const tFile = path.join(root, 'content', 'tournaments', `${id}.json`);
  if (!fs.existsSync(tFile)) {
    throw new Error(`турнира «${id}» нет. Сначала создай его: npm run new-tournament -- --title "…" --organizer <id> --start ГГГГ-ММ-ДД`);
  }
  const tournament = Tournament.parse(readJson(tFile));

  // 1. регистрация (необязательна)
  let registration = null, regWarnings = [];
  const regPath = args.reg || path.join(root, 'private', 'registrations', `${id}.csv`);
  if (fs.existsSync(regPath)) {
    const parsed = parseRegistrations(fs.readFileSync(regPath, 'utf8'), { profile: args.form || tournament.form });
    if (!parsed.form) throw new Error(`регистрация ${regPath}: ${parsed.warnings.join('; ')}`);
    registration = parsed.teams;
    regWarnings = parsed.warnings;
    log(`Регистрация: форма «${parsed.form}», команд ${registration.length}.`);
  } else if (args.reg) {
    throw new Error(`нет файла регистрации: ${regPath}`);
  }

  // 2. результаты через адаптер источника
  let placements = null, matches = null, participants = [], srcWarnings = [];
  if (tournament.source.type === 'challonge') {
    let json;
    if (args['challonge-json']) json = readJson(args['challonge-json']);
    else json = await fetchChallonge(tournament.source.url, { apiKey: env.CHALLONGE_KEY, fetchImpl });
    const n = normalizeChallonge(json);
    ({ placements, matches, participants } = n);
    srcWarnings = n.warnings;
    log(`Challonge: участников ${participants.length}, мест ${placements.length}, матчей ${matches.length}.`);
  } else {
    const txtPath = args.results || path.join(root, 'content', 'inputs', `${id}.txt`);
    if (fs.existsSync(txtPath)) {
      const m = parseManualResults(fs.readFileSync(txtPath, 'utf8'));
      if (m.placements.length) placements = m.placements;
      srcWarnings = m.warnings;
      log(`Результаты из текста: записей ${m.placements.length}.`);
    }
  }
  if (!registration && !placements && !participants.length) {
    throw new Error('нечего импортировать: нет ни регистрации, ни результатов');
  }

  // 3. существующее состояние
  const teams = listJson(path.join(root, 'content', 'teams')).map(r => r.data);
  const players = listJson(path.join(root, 'content', 'players')).map(r => r.data);
  const identityFile = path.join(root, 'private', 'identity.json');
  const identity = readJson(identityFile, { accounts: {} });
  const resFile = path.join(root, 'content', 'results', `${id}.json`);
  const existing = readJson(resFile, { entries: [], matches: [] });

  const aliases = Object.fromEntries(args.alias.map(s => {
    const i = s.lastIndexOf('=');
    if (i < 1) throw new Error(`--alias ожидает «Имя=team-id», получено: ${s}`);
    return [s.slice(0, i).trim(), s.slice(i + 1).trim()];
  }));

  const r = buildImport({
    teams, players, identity,
    existingEntries: existing.entries, existingMatches: existing.matches,
    registration, placements, matches, participants,
    aliases, forceNew: args.new,
  });

  // 4. отчёт
  const warnings = [...regWarnings, ...srcWarnings, ...r.warnings];
  if (r.unresolved.length) {
    log('\n✖ Нужно решение человека (ничего не записано):');
    for (const u of r.unresolved) {
      log(`  «${u.name}» (${u.context}) похоже на: ${u.suggestions.map(s => `«${s.name}» [${s.id}]`).join(', ')}`);
      log(`     та же команда:   --alias "${u.name}=${u.suggestions[0].id}"`);
      log(`     новая команда:   --new "${u.name}"`);
    }
    return { ok: false, unresolved: r.unresolved, warnings };
  }

  log(`\nКоманд: +${r.createdTeams.length} новых, ${r.updatedTeams.length} обновлено. Игроков: +${r.createdPlayers.length} новых, ${r.updatedPlayers.length} обновлено.`);
  r.createdTeams.forEach(t => log(`  + команда ${t.name} → ${t.id}`));
  warnings.forEach(w => log('  ⚠ ' + w));
  if (r.logoTodo.length) {
    log('\nЛоготипы (скачай вручную в assets/logos/ и впиши logo в файл команды):');
    r.logoTodo.forEach(x => log(`  ${x.team}: ${x.source}`));
  }

  if (args.dryRun) { log('\n--dry-run: файлы не изменены.'); return { ok: true, dryRun: true, warnings, ...r }; }

  // 5. запись
  r.createdTeams.forEach(t => writeJson(path.join(root, 'content', 'teams', `${t.id}.json`), t));
  r.updatedTeams.forEach(t => writeJson(path.join(root, 'content', 'teams', `${t.id}.json`), t));
  r.createdPlayers.forEach(p => writeJson(path.join(root, 'content', 'players', `${p.id}.json`), p));
  r.updatedPlayers.forEach(p => writeJson(path.join(root, 'content', 'players', `${p.id}.json`), p));
  if (Object.keys(r.newAccounts).length) {
    writeJson(identityFile, { accounts: { ...identity.accounts, ...r.newAccounts } });
  }
  writeJson(resFile, { entries: r.entries, matches: r.matches });

  const check = validateRoot(root);
  check.warnings.forEach(w => log('  ⚠ ' + w));
  if (check.errors.length) {
    check.errors.forEach(e => log('  ✖ ' + e));
    return { ok: false, validation: check.errors, warnings };
  }
  const built = buildAll(root, { env });
  if (!built.ok) { built.errors.forEach(e => log('  ✖ ' + e)); return { ok: false, validation: built.errors, warnings }; }
  log(`\n✔ Записано content/results/${id}.json, data/ и sitemap.xml пересобраны (${built.files} файлов).`);
  return { ok: true, warnings, ...r };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runImport(parseArgs(process.argv.slice(2))).then(r => { if (!r.ok) process.exit(1); })
    .catch(e => { console.error('✖ ' + e.message); process.exit(1); });
}
