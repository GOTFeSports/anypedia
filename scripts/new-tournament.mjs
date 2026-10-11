// npm run new-tournament -- --title "Bedlam October Fest" --organizer bedlam --start 2026-10-03 [опции]
//
//   --title "…"            название (обязательно)
//   --organizer <id>       id организатора; коллаб — несколько через запятую: anylvl,bedlam (обязательно)
//   --organizer-name "…"   если организатора ещё нет, создаст заготовку с этим названием
//   --start ГГГГ-ММ-ДД     дата начала (обязательно); --end — если турнир идёт несколько дней
//   --challonge <ссылка>   сетка на Challonge → результаты подтянутся импортом; без неё источник «manual»
//   --prize 15000,10000,5000   призовые по местам, ₽ (1-е, 2-е, 3-е …)
//   --tier A|B|C|S  --limit "…"  --format "…"  --game-format "…"  --registration <url>  --telegram <url>
//   --id <slug>            свой id вместо сгенерированного из названия
//
// Создаёт content/tournaments/<id>.json (и пустой content/inputs/<id>.txt для ручных результатов).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Tournament, Organizer } from '../schema/index.mjs';
import { slugify, writeJson } from './lib/util.mjs';
import { buildAll } from './build-data.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith('--')) continue;
    out[argv[i].slice(2)] = argv[++i];
  }
  return out;
}

export function createTournament(args, { root = ROOT } = {}) {
  const need = k => { if (!args[k]) throw new Error(`не хватает --${k}`); return args[k]; };
  const title = need('title');
  const organizer = need('organizer').split(',').map(s => s.trim()).filter(Boolean);
  const start = need('start');

  const id = args.id || slugify(title);
  const file = path.join(root, 'content', 'tournaments', `${id}.json`);
  if (fs.existsSync(file)) throw new Error(`турнир ${id} уже существует`);

  const raw = {
    id, title, organizer, start, end: args.end || start,
    ...(args.tier && { tier: args.tier.toUpperCase() }),
    ...(args.limit && { limit: args.limit }),
    ...(args.format && { format: args.format }),
    ...(args['game-format'] && { gameFormat: args['game-format'] }),
    prizePool: (args.prize ? args.prize.split(',') : [])
      .map((v, i) => ({ place: i + 1, amountRub: Number(String(v).replace(/\D/g, '')) })),
    links: {
      ...(args.registration && { registration: args.registration }),
      ...(args.telegram && { telegram: args.telegram }),
    },
    source: args.challonge ? { type: 'challonge', url: args.challonge } : { type: 'manual' },
  };
  const tournament = Tournament.parse(raw);

  // организатор: существующий или заготовка
  const created = [];
  for (const o of tournament.organizer) {
    const oFile = path.join(root, 'content', 'organizers', `${o}.json`);
    if (fs.existsSync(oFile)) continue;
    if (!args['organizer-name'] || tournament.organizer.length > 1) {
      throw new Error(`организатора «${o}» нет в content/organizers. Добавь --organizer-name "Название" (для одного организатора) или создай файл вручную`);
    }
    writeJson(oFile, Organizer.parse({ id: o, name: args['organizer-name'] }));
    created.push(o);
  }

  writeJson(file, tournament);
  const inputs = path.join(root, 'content', 'inputs', `${id}.txt`);
  if (!args.challonge && !fs.existsSync(inputs)) {
    fs.mkdirSync(path.dirname(inputs), { recursive: true });
    fs.writeFileSync(inputs, '# Результаты, по одной строке на место. Примеры:\n# 1. Название команды\n# 3-4. Команда А, Команда Б\n');
  }
  return { id, file, createdOrganizers: created, manual: !args.challonge };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const r = createTournament(parseArgs(process.argv.slice(2)));
    const built = buildAll(ROOT);
    console.log(`✔ Создан турнир ${r.id}` + (built.ok ? ', data/ и sitemap.xml пересобраны' : ''));
    if (!built.ok) built.errors.forEach(e => console.error('✖ ' + e));
    r.createdOrganizers.forEach(o => console.log(`  + организатор ${o} (дополни описание и логотип в content/organizers/${o}.json)`));
    console.log('\nДальше:');
    console.log(`  1. положи выгрузку регистрации в private/registrations/${r.id}.csv`);
    console.log(r.manual
      ? `  2. когда турнир закончится — впиши итоги в content/inputs/${r.id}.txt`
      : '  2. когда турнир закончится — export CHALLONGE_KEY=… (или --challonge-json файл)');
    console.log(`  3. npm run import -- ${r.id}`);
    console.log('  4. git add content && git commit && git push');
  } catch (e) { console.error('✖ ' + (e.issues ? e.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ') : e.message)); process.exit(1); }
}
