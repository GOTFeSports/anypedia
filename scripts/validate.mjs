// npm run validate — проверка content/*: схемы Zod + ссылочная целостность.
// Код возврата 1, если есть ошибки: на хостинге сайт с битыми данными не соберётся.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Organizer, Team, Player, Tournament, Results } from '../schema/index.mjs';
import { listJson, normKey } from './lib/util.mjs';

export const DEFAULT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseAll(kind, schema, rows, errors) {
  const out = [];
  for (const { file, id, data } of rows) {
    const r = schema.safeParse(data);
    if (!r.success) {
      for (const issue of r.error.issues) {
        errors.push(`${path.relative(process.cwd(), file)}: ${issue.path.join('.') || '(корень)'} — ${issue.message}`);
      }
      continue;
    }
    if (kind !== 'results' && r.data.id !== id) {
      errors.push(`${path.relative(process.cwd(), file)}: id «${r.data.id}» не совпадает с именем файла «${id}»`);
      continue;
    }
    out.push({ id, file, data: r.data });
  }
  return out;
}

/* Читает content/ и возвращает типизированный набор (+ ошибки схем). */
export function loadContent(root = DEFAULT_ROOT) {
  const dir = name => path.join(root, 'content', name);
  const errors = [];
  const organizers = parseAll('organizers', Organizer, listJson(dir('organizers')), errors);
  const teams = parseAll('teams', Team, listJson(dir('teams')), errors);
  const players = parseAll('players', Player, listJson(dir('players')), errors);
  const tournaments = parseAll('tournaments', Tournament, listJson(dir('tournaments')), errors);
  const results = parseAll('results', Results, listJson(dir('results')), errors);
  return { organizers, teams, players, tournaments, results, errors };
}

export function validateContent(content) {
  const errors = [...(content.errors || [])];
  const warnings = [];
  const ids = rows => new Set(rows.map(r => r.id));
  const orgIds = ids(content.organizers), teamIds = ids(content.teams),
        playerIds = ids(content.players), tournamentIds = ids(content.tournaments);

  // 1. Команды: имена и алиасы не должны совпадать между разными командами
  const teamKeys = new Map();
  for (const { id, data } of content.teams) {
    for (const n of [data.name, ...data.aliases]) {
      const k = normKey(n);
      if (teamKeys.has(k) && teamKeys.get(k) !== id) {
        errors.push(`teams: название «${n}» (${id}) совпадает с названием команды «${teamKeys.get(k)}» — добавь одно в aliases другого или объедини команды`);
      } else teamKeys.set(k, id);
    }
  }

  // 2. Игроки: одинаковые ники у разных людей допустимы, но стоит знать об этом
  const nickKeys = new Map();
  for (const { id, data } of content.players) {
    const k = normKey(data.nick);
    if (nickKeys.has(k) && nickKeys.get(k) !== id) warnings.push(`players: ник «${data.nick}» у ${id} и ${nickKeys.get(k)} — это точно разные люди?`);
    else nickKeys.set(k, id);
  }

  // 3. Турниры → организаторы
  for (const { id, data } of content.tournaments) {
    for (const o of data.organizer) {
      if (!orgIds.has(o)) errors.push(`tournaments/${id}: организатор «${o}» не найден в content/organizers`);
    }
  }

  // 4. Результаты → турнир, команды, игроки
  for (const { id, data } of content.results) {
    if (!tournamentIds.has(id)) {
      errors.push(`results/${id}: нет турнира content/tournaments/${id}.json`);
      continue;
    }
    const inEntries = new Set();
    for (const e of data.entries) {
      if (!teamIds.has(e.team)) errors.push(`results/${id}: команда «${e.team}» не найдена в content/teams`);
      if (inEntries.has(e.team)) errors.push(`results/${id}: команда «${e.team}» записана дважды`);
      inEntries.add(e.team);

      const pos = new Set();
      for (const r of e.roster) {
        if (!playerIds.has(r.player)) errors.push(`results/${id}: игрок «${r.player}» (${e.team}) не найден в content/players`);
        if (pos.has(r.pos)) errors.push(`results/${id}: у команды «${e.team}» повторяется позиция ${r.pos}`);
        pos.add(r.pos);
      }
      for (const s of e.subs) {
        if (!playerIds.has(s)) errors.push(`results/${id}: запасной «${s}» (${e.team}) не найден в content/players`);
      }
    }
    for (const m of data.matches) {
      for (const side of [m.a, m.b]) {
        if (!inEntries.has(side)) errors.push(`results/${id}: в матче участвует «${side}», которой нет среди entries`);
      }
    }

    // игрок в двух командах одного турнира — возможно, ошибка склейки
    const seen = new Map();
    for (const e of data.entries) {
      for (const p of [...e.roster.map(r => r.player), ...e.subs]) {
        if (seen.has(p) && seen.get(p) !== e.team) warnings.push(`results/${id}: игрок «${p}» значится и в «${seen.get(p)}», и в «${e.team}»`);
        else seen.set(p, e.team);
      }
    }
    // призовые места из prizePool без команды — это нормально для идущих турниров, предупреждаем только если есть результаты
    const t = content.tournaments.find(x => x.id === id).data;
    const placed = new Set(data.entries.filter(e => e.place).map(e => e.place));
    if (placed.size) {
      for (const p of t.prizePool) {
        if (!placed.has(p.place)) warnings.push(`results/${id}: в prizePool есть ${p.place} место, а команды с таким местом нет`);
      }
    }
  }

  return { errors, warnings };
}

export function validateRoot(root = DEFAULT_ROOT) {
  const content = loadContent(root);
  return { content, ...validateContent(content) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { content, errors, warnings } = validateRoot();
  const n = k => content[k].length;
  console.log(`Проверено: организаторов ${n('organizers')}, команд ${n('teams')}, игроков ${n('players')}, турниров ${n('tournaments')}, результатов ${n('results')}.`);
  warnings.forEach(w => console.warn('⚠ ' + w));
  if (errors.length) {
    errors.forEach(e => console.error('✖ ' + e));
    console.error(`\n${errors.length} ошибок. Сборка остановлена.`);
    process.exit(1);
  }
  console.log('Ошибок нет.');
}
