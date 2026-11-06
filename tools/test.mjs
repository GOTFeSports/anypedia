// Проверки импорта и страниц превью: npm test
// Challonge здесь не вызывается — используются ответы API, собранные в этом файле.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseChallongeRef, mapChallonge } from './lib/challonge.mjs';
import { rosterFromCsv, stageFromCsv, placementsFromCsv, parseCsv } from './lib/csv.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let passed = 0;
const test = (name, fn) => {
  try { fn(); passed++; console.log(`  ✔ ${name}`); }
  catch (e) { console.error(`  ✖ ${name}\n    ${e.message}`); process.exitCode = 1; }
};

/* ---- «Ответы API» Challonge ---- */
const P = (id, name, rank, seed) => ({ participant: { id, name, final_rank: rank, seed } });
const M = (id, round, p1, p2, w, scores, pre = [], po = id, state = 'complete') => ({
  match: { id, round, player1_id: p1, player2_id: p2, winner_id: w, scores_csv: scores, state, prerequisite_match_ids_csv: pre.join(','), suggested_play_order: po, completed_at: '2026-10-31T15:00:00.000+03:00' },
});
const T = (type, participants, matches, extra = {}) => ({
  tournament: { name: 'Тест Cup', tournament_type: type, start_at: '2026-10-31T14:00:00+03:00', completed_at: '2026-10-31T20:00:00+03:00', full_challonge_url: 'https://challonge.com/testcup', description: '<p>Описание &amp; <b>турнир</b></p>', participants, matches, ...extra },
});

const single = T('single elimination',
  [P(1, 'T1', 1, 1), P(2, 'T2', 2, 2), P(3, 'T3', 3, 3), P(4, 'T4', 4, 4), P(5, 'T5', 5, 5), P(6, 'T6', 5, 6), P(7, 'T7', 5, 7), P(8, 'T8', 5, 8)],
  [
    M(11, 1, 1, 8, 1, '2-0', [], 1), M(12, 1, 4, 5, 4, '', [], 2), M(13, 1, 3, 6, 3, '1-0,0-1,1-0', [], 3), M(14, 1, 2, 7, 2, '2-1', [], 4),
    M(21, 2, 1, 4, 1, '2-0', [11, 12], 5), M(22, 2, 2, 3, 2, '2-1', [13, 14], 6),
    M(31, 3, 3, 4, 3, '2-0', [21, 22], 7), // матч за 3 место (раньше финала)
    M(32, 3, 1, 2, 1, '3-1', [21, 22], 8),
  ]);

const dbl = T('double elimination',
  [P(1, 'A', 1, 1), P(2, 'B', 2, 2), P(3, 'C', 3, 3), P(4, 'D', 4, 4)],
  [
    M(1, 1, 1, 4, 1, '2-0', [], 1), M(2, 1, 2, 3, 2, '2-0', [], 2),
    M(3, 2, 1, 2, 1, '2-1', [1, 2], 5),
    M(4, -1, 4, 3, 3, '2-0', [1, 2], 3),
    M(5, -2, 3, 2, 2, '2-1', [4, 3], 6),
    M(6, 3, 1, 2, 1, '3-0', [3, 5], 7),
    M(7, 4, null, null, null, '', [6], 8, 'pending'), // сброс, не сыгран
  ], { group_stages_enabled: false });

const rr = T('round robin', [P(1, 'A', 1, 1), P(2, 'B', 2, 2), P(3, 'C', 3, 3)],
  [M(1, 1, 1, 2, 1, '2-0'), M(2, 2, 1, 3, 1, '2-1'), M(3, 3, 2, 3, 2, '2-0')]);
const swiss = T('swiss', [P(1, 'A', 1, 1), P(2, 'B', 2, 2), P(3, 'C', 3, 3), P(4, 'D', 3, 4)],
  [M(1, 1, 1, 2, 1, '2-0'), M(2, 1, 3, 4, 3, '2-1'), M(3, 2, 1, 3, 1, '2-0'), M(4, 2, 2, 4, 4, '')]);

console.log('Challonge');
test('ссылки → id', () => {
  assert.equal(parseChallongeRef('https://challonge.com/abc_123').id, 'abc_123');
  assert.equal(parseChallongeRef('https://challonge.com/ru/abc123').id, 'abc123');
  assert.equal(parseChallongeRef('https://myorg.challonge.com/cup5').id, 'myorg-cup5');
  assert.equal(parseChallongeRef('abc123').id, 'abc123');
});

test('single elimination: раунды, счёт, W/L, матч за 3 место, линии', () => {
  const { info, roster, result, notes } = mapChallonge(single, { prize: '20 000 ₽', pts: '30000', prizes: [{ place: 1, prize: '15 000 ₽' }] });
  const st = result.stages[0];
  assert.equal(st.type, 'single_elim');
  assert.deepEqual(st.rounds.map((r) => [r.name, r.bracket]), [
    ['1/4 финала', 'upper'], ['Полуфинал', 'upper'], ['Финал', 'final'], ['Матч за 3 место', 'third'],
  ]);
  const q = st.rounds[0].matches;
  assert.deepEqual([q[0].team1, q[0].team2, q[0].score1, q[0].score2], ['T1', 'T8', 2, 0]);
  assert.equal(q[1].winner, 1); assert.equal(q[1].score1, undefined); // без счёта → W/L
  assert.deepEqual([q[2].score1, q[2].score2], [2, 1]); // по партиям
  assert.equal(q[0].next, st.rounds[1].matches[0].id);
  assert.equal(q[3].next, st.rounds[1].matches[1].id);
  assert.equal(st.rounds[1].matches[0].next, st.rounds[2].matches[0].id);
  assert.equal(st.rounds[1].matches[1].next, st.rounds[2].matches[0].id);
  assert.equal(st.rounds[3].matches[0].team1, 'T3'); // матч за 3 место найден по рангам
  assert.equal(st.rounds[3].matches[0].next, undefined);
  assert.deepEqual(result.placements.slice(0, 5).map((p) => [p.place, p.team, p.label]), [
    [1, 'T1', undefined], [2, 'T2', undefined], [3, 'T3', undefined], [4, 'T4', undefined], [5, 'T5', '5–8'],
  ]);
  assert.equal(result.placements.length, 8);
  assert.equal(roster.teams.length, 8);
  assert.equal(info.date_start, '2026-10-31'); assert.equal(info.prize_pool, '20 000 ₽'); assert.equal(info.pts_cap, 30000);
  assert.equal(info.description, 'Описание & турнир'); assert.equal(info.links.challonge, 'https://challonge.com/testcup');
  assert.ok(notes.some((n) => n.includes('за 3 место')));
});

test('double elimination: верхняя/нижняя сетка, гранд-финал, несыгранный сброс', () => {
  const { result, notes } = mapChallonge(dbl);
  const st = result.stages[0];
  assert.equal(st.type, 'double_elim');
  assert.deepEqual(st.rounds.map((r) => [r.name, r.bracket]), [
    ['Полуфинал верхней сетки', 'upper'],
    ['Финал верхней сетки', 'upper'],
    ['Полуфинал нижней сетки', 'lower'],
    ['Финал нижней сетки', 'lower'],
    ['Гранд-финал', 'final'],
  ]);
  const id = (r, i = 0) => st.rounds[r].matches[i].id;
  const nx = (r, i = 0) => st.rounds[r].matches[i].next;
  assert.equal(nx(0, 0), id(1)); assert.equal(nx(0, 1), id(1)); // верхняя сетка
  assert.equal(nx(1), id(4)); // финал верхней → гранд-финал
  assert.equal(nx(2), id(3)); // нижняя → нижняя
  assert.equal(nx(3), id(4)); // финал нижней → гранд-финал
  assert.ok(notes.some((n) => n.includes('сброса')));
  assert.equal(st.rounds[4].matches[0].score1, 3);
});

test('round robin → одна группа', () => {
  const st = mapChallonge(rr).result.stages[0];
  assert.equal(st.type, 'groups'); assert.equal(st.groups[0].format, 'round_robin');
  assert.deepEqual(st.groups[0].teams, ['A', 'B', 'C']); assert.equal(st.groups[0].matches.length, 3);
});

test('swiss → раунды и команды', () => {
  const r = mapChallonge(swiss).result;
  assert.equal(r.stages[0].type, 'swiss'); assert.equal(r.stages[0].rounds.length, 2);
  assert.equal(r.stages[0].rounds[1].matches[1].winner, 2);
  assert.deepEqual(r.placements.filter((p) => p.label).map((p) => [p.place, p.label]), [[3, '3–4'], [4, '3–4']]);
});

test('неподдерживаемый тип → понятная ошибка', () => {
  assert.throws(() => mapChallonge(T('free for all', [], [])), /не поддерживается/);
});

console.log('CSV');
test('ростер: Excel (;) с BOM, players через |, запас и тренер', () => {
  const csv = '﻿команда;игроки;тренер;запас;статус\n"Team A";a1|a2|a3|a4|a5;coachA;s1|s2;invited\nTeam B;b1|b2|b3|b4|b5;;;\n';
  const r = rosterFromCsv(csv);
  assert.equal(r.teams.length, 2);
  assert.deepEqual(r.teams[0].players.map((p) => p.nick), ['a1', 'a2', 'a3', 'a4', 'a5']);
  assert.equal(r.teams[0].coach.nick, 'coachA'); assert.equal(r.teams[0].subs.length, 2); assert.equal(r.teams[0].status, 'invited');
  assert.equal(r.teams[1].coach, undefined);
});
test('ростер: player1..player5 и кавычки с запятыми', () => {
  const r = rosterFromCsv('team,player1,player2,player3,player4,player5\n"Team, with comma",a,b,c,d,e\n');
  assert.equal(r.teams[0].name, 'Team, with comma'); assert.equal(r.teams[0].players.length, 5);
});
test('ростер: одна строка = один игрок', () => {
  const r = rosterFromCsv('team,nick,role\nX,p1,player\nX,p2,player\nX,c,coach\nX,s,sub\nY,q1,player\n');
  assert.equal(r.teams.length, 2); assert.equal(r.teams[0].players.length, 2);
  assert.equal(r.teams[0].coach.nick, 'c'); assert.equal(r.teams[0].subs[0].nick, 's');
});
test('матчи: список, швейцарка, группы', () => {
  const csv = 'round,team1,team2,score1,score2,date\n1,A,B,2,0,2026-10-31\n1,C,D,1,2,2026-10-31\n2,A,C,,,\n';
  assert.equal(stageFromCsv(csv, { format: 'list' }).matches.length, 3);
  const sw = stageFromCsv(csv, { format: 'swiss' }).stage;
  assert.equal(sw.rounds.length, 2); assert.equal(sw.rounds[0].name, 'Раунд 1'); assert.equal(sw.teams.length, 4);
  assert.equal(sw.rounds[1].matches[0].score1, undefined);
  const rr = stageFromCsv('group,team1,team2,score1,score2\nA,X,Y,2,1\nB,Z,W,0,2\n', { format: 'round_robin' }).stage;
  assert.deepEqual(rr.groups.map((g) => g.name), ['A', 'B']);
});
test('матчи: single elimination с автосвязкой и double с id/next', () => {
  const csv = 'round,team1,team2,score1,score2\n1/4,A,B,2,0\n1/4,C,D,2,1\n1/4,E,F,0,2\n1/4,G,H,2,0\nПолуфинал,A,C,2,0\nПолуфинал,F,G,0,2\nФинал,A,G,3,1\n';
  const st = stageFromCsv(csv, { format: 'single_elim' }).stage;
  assert.equal(st.rounds.length, 3);
  assert.equal(st.rounds[0].matches[0].next, st.rounds[1].matches[0].id);
  assert.equal(st.rounds[0].matches[3].next, st.rounds[1].matches[1].id);
  assert.equal(st.rounds[1].matches[1].next, st.rounds[2].matches[0].id);
  const d = stageFromCsv('round,bracket,id,next,team1,team2,score1,score2\nR1,верхняя,u1,f,A,B,2,0\nНижний,нижняя,l1,f,C,D,2,1\nФинал,финал,f,,A,C,3,0\n', { format: 'double_elim' }).stage;
  assert.deepEqual(d.rounds.map((r) => r.bracket), ['upper', 'lower', 'final']);
  assert.equal(d.rounds[0].matches[0].next, 'f');
});
test('места: place,team,label', () => {
  const p = placementsFromCsv('место,команда,подпись\n1,A,\n5,B,5–6\n6,C,5–6\n');
  assert.deepEqual(p, [{ place: 1, team: 'A' }, { place: 5, label: '5–6', team: 'B' }, { place: 6, label: '5–6', team: 'C' }]);
});
test('CSV: неверные заголовки → понятная ошибка', () => {
  assert.throws(() => rosterFromCsv('a,b\n1,2\n'), /команд/);
  assert.throws(() => stageFromCsv('a,b\n1,2\n', { format: 'swiss' }), /team1/);
  assert.equal(parseCsv('a;b\n1;2\n').delim, ';');
});

console.log('CLI + сборка');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'anypedia-test-'));
const env = { ...process.env, ANYPEDIA_TOURNAMENTS: path.join(tmp, 'tournaments'), ANYPEDIA_OUT: path.join(tmp, 'out'), SITE_URL: 'https://example.test' };
fs.mkdirSync(env.ANYPEDIA_TOURNAMENTS, { recursive: true });
const run = (script, args, extra = {}) => spawnSync(process.execPath, [path.join(ROOT, 'tools', script), ...args], { env: { ...env, ...extra }, encoding: 'utf8' });
const readT = (slug, f) => JSON.parse(fs.readFileSync(path.join(env.ANYPEDIA_TOURNAMENTS, slug, f), 'utf8'));
const write = (name, text) => { const p = path.join(tmp, name); fs.writeFileSync(p, text); return p; };

test('challonge --from-file пишет три файла, повторный запуск ничего не затирает', () => {
  const api = write('api.json', JSON.stringify(single));
  let r = run('import.mjs', ['challonge', 'https://challonge.com/testcup', '--from-file', api, '--series', 'Тест', '--prize', '20 000 ₽']);
  assert.equal(r.status, 0, r.stderr);
  assert.ok(fs.existsSync(path.join(env.ANYPEDIA_TOURNAMENTS, 'testcup', 'result.json')));
  assert.equal(readT('testcup', 'information.json').series, 'Тест');
  // ручная правка не должна пропасть
  const p = path.join(env.ANYPEDIA_TOURNAMENTS, 'testcup', 'information.json');
  fs.writeFileSync(p, JSON.stringify({ ...readT('testcup', 'information.json'), name: 'Правка вручную' }));
  r = run('import.mjs', ['challonge', 'testcup', '--from-file', api]);
  assert.match(r.stdout, /уже есть, пропущен/);
  assert.equal(readT('testcup', 'information.json').name, 'Правка вручную');
  r = run('import.mjs', ['challonge', 'testcup', '--from-file', api, '--only', 'result', '--force']);
  assert.equal(readT('testcup', 'information.json').name, 'Правка вручную'); // --only не трогает остальное
});

test('csv roster / matches / placements складываются в один турнир', () => {
  const info = run('import.mjs', ['info', 'csvcup', '--name', 'CSV Cup', '--date', '2026-11-01', '--pts', '30000', '--prizes', '1=15 000 ₽;2=5 000 ₽;3-4=Мерч']);
  assert.equal(info.status, 0, info.stderr);
  assert.deepEqual(readT('csvcup', 'information.json').prizes[2], { place: 3, place_to: 4, prize: 'Мерч' });
  const roster = write('roster.csv', 'team,player1,player2,player3,player4,player5\nAlpha,a1,a2,a3,a4,a5\nBravo,b1,b2,b3,b4,b5\nCharlie,c1,c2,c3,c4,c5\nDelta,d1,d2,d3,d4,d5\n');
  assert.equal(run('import.mjs', ['csv', 'roster', roster, 'csvcup']).status, 0);
  const groups = write('groups.csv', 'group,team1,team2,score1,score2\nA,Alpha,Bravo,2,0\nA,Charlie,Delta,1,2\n');
  const po = write('po.csv', 'round,team1,team2,score1,score2\nПолуфинал,Alpha,Delta,2,0\nПолуфинал,Bravo,Charlie,1,2\nФинал,Alpha,Charlie,3,1\n');
  assert.equal(run('import.mjs', ['csv', 'matches', groups, 'csvcup', '--format', 'round_robin']).status, 0);
  assert.equal(run('import.mjs', ['csv', 'matches', po, 'csvcup', '--format', 'single_elim']).status, 0);
  const dup = run('import.mjs', ['csv', 'matches', po, 'csvcup', '--format', 'single_elim']);
  assert.notEqual(dup.status, 0); assert.match(dup.stderr, /уже есть/); // повтор не дублирует этап
  const pl = write('pl.csv', 'place,team\n1,Alpha\n2,Charlie\n3,Delta\n4,Bravo\n');
  assert.equal(run('import.mjs', ['csv', 'placements', pl, 'csvcup']).status, 0);
  const res = readT('csvcup', 'result.json');
  assert.equal(res.stages.length, 2); assert.equal(res.placements.length, 4);
});

test('вредные slug отклоняются', () => {
  assert.notEqual(run('import.mjs', ['info', 'assets', '--name', 'x']).status, 0);
  assert.notEqual(run('import.mjs', ['info', 'index', '--name', 'x']).status, 0);
});

test('сборка: без предупреждений, страницы превью с экранированием', () => {
  const evil = path.join(env.ANYPEDIA_TOURNAMENTS, 'evil');
  fs.mkdirSync(evil, { recursive: true });
  fs.writeFileSync(path.join(evil, 'information.json'), JSON.stringify({ name: 'Cup "<script>alert(1)</script>"', date_start: '2026-11-01', prize_pool: '1 000 ₽' }));
  const b = run('build-index.mjs', []);
  assert.equal(b.status, 0, b.stderr);
  assert.ok(!b.stderr.includes('⚠'), b.stderr);
  const idx = JSON.parse(fs.readFileSync(path.join(env.ANYPEDIA_TOURNAMENTS, 'index.json'), 'utf8'));
  assert.equal(idx.tournaments.length, 3);
  const page = fs.readFileSync(path.join(tmp, 'out', 'csvcup.html'), 'utf8');
  assert.match(page, /<title>CSV Cup — Anypedia<\/title>/);
  assert.match(page, /og:url" content="https:\/\/example\.test\/csvcup"/);
  assert.match(page, /og:image" content="https:\/\/example\.test\/assets\/og\.png"/);
  assert.match(page, /Победитель: Alpha/);
  assert.match(page, /Призовой фонд|Лимит 30 000/);
  const evilPage = fs.readFileSync(path.join(tmp, 'out', 'evil.html'), 'utf8');
  assert.ok(!evilPage.includes('<script>alert'), 'название не экранировано');
  assert.ok(evilPage.includes('&lt;script&gt;'));
  assert.equal((page.match(/<!-- og -->/g) || []).length, 1);
});

test('удалённый турнир → его страница убирается, чужие html не трогаются', () => {
  fs.writeFileSync(path.join(tmp, 'out', 'handmade.html'), '<!doctype html><title>mine</title>');
  fs.rmSync(path.join(env.ANYPEDIA_TOURNAMENTS, 'evil'), { recursive: true });
  assert.equal(run('build-index.mjs', []).status, 0);
  assert.ok(!fs.existsSync(path.join(tmp, 'out', 'evil.html')));
  assert.ok(fs.existsSync(path.join(tmp, 'out', 'handmade.html')));
});

fs.rmSync(tmp, { recursive: true, force: true });
console.log(process.exitCode ? '\nЕсть ошибки' : `\nВсе проверки пройдены (${passed})`);
