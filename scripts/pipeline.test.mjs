// node --test — адаптеры, импорт, проверка и сборка. Фикстуры выдуманные; реальных данных нет.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseManualResults } from './adapters/manual.mjs';
import { challongeIdFromUrl, normalizeChallonge, parseScores, fetchChallonge } from './adapters/challonge.mjs';
import { buildImport } from './lib/importer.mjs';
import { createTournament } from './new-tournament.mjs';
import { runImport } from './import.mjs';
import { validateRoot } from './validate.mjs';
import { buildAll, siteUrlFor } from './build-data.mjs';
import { normKey, slugify } from './lib/util.mjs';

const silent = () => {};
const q = s => `"${String(s).replace(/"/g, '""')}"`;

/* ───────── утилиты ───────── */

test('normKey: регистр, пробелы, знаки и тип апострофа не важны', () => {
  assert.equal(normKey('Neki4 +4'), normKey('neki4+4'));
  assert.equal(normKey("HATER ZDES'"), normKey('HATER ZDES`'));
  assert.notEqual(normKey('Team A'), normKey('Team B'));
});

test('slugify: юникод сохраняется, мусор уходит', () => {
  assert.equal(slugify('BEDLAM: OCTOBER FEST'), 'bedlam-october-fest');
  assert.equal(slugify('海 常 Kaijo'), '海-常-kaijo');
  assert.equal(slugify('!!!'), 'x');
});

/* ───────── manual ───────── */

test('manual: места, диапазоны, перечисления, комментарии', () => {
  const { placements, warnings } = parseManualResults([
    '# итоги',
    '1. EGOISTO Team',
    '2 - Neki4+4',
    '3-4. Gitlz, Kaijo',
    '5-8 место: A; B; C; D',
    '',
    '9) 5Head',
  ].join('\n'));
  assert.deepEqual(warnings, []);
  assert.deepEqual(placements.slice(0, 4), [
    { name: 'EGOISTO Team', place: 1 },
    { name: 'Neki4+4', place: 2 },
    { name: 'Gitlz', place: 3, placeTo: 4 },
    { name: 'Kaijo', place: 3, placeTo: 4 },
  ]);
  assert.deepEqual(placements.slice(4).map(p => [p.name, p.place, p.placeTo]),
    [['A', 5, 8], ['B', 5, 8], ['C', 5, 8], ['D', 5, 8], ['5Head', 9, undefined]]);
});

test('manual: нераспознанные и перевёрнутые строки дают предупреждения, а не молчат', () => {
  const { placements, warnings } = parseManualResults('просто текст\n8-5. X\n1. Ok');
  assert.equal(placements.length, 1);
  assert.equal(warnings.length, 2);
});

/* ───────── challonge ───────── */

const V1 = {
  tournament: {
    state: 'complete',
    participants: [
      { participant: { id: 1, name: 'Test Alpha', final_rank: 1 } },
      { participant: { id: 2, name: 'Test Beta', final_rank: 2 } },
      { participant: { id: 3, name: 'Test Gamma', final_rank: 3 } },
      { participant: { id: 4, name: 'Test Delta', final_rank: 3 } },
    ],
    matches: [
      { match: { id: 10, player1_id: 1, player2_id: 3, winner_id: 1, scores_csv: '2-0', round: 1, state: 'complete' } },
      { match: { id: 11, player1_id: 2, player2_id: 4, winner_id: 2, scores_csv: '2-1', round: 1, state: 'complete' } },
      { match: { id: 12, player1_id: 1, player2_id: 2, winner_id: 1, scores_csv: '2-0', round: 2, state: 'complete' } },
      { match: { id: 13, player1_id: 3, player2_id: null, winner_id: null, scores_csv: '', round: 2, state: 'pending' } },
    ],
  },
};

test('challonge: id из ссылки', () => {
  assert.equal(challongeIdFromUrl('https://challonge.com/ru/YarfCup_8'), 'YarfCup_8');
  assert.equal(challongeIdFromUrl('https://challonge.com/YarfCup_8/module'), 'YarfCup_8');
  assert.equal(challongeIdFromUrl('https://challonge.com/ab'), 'ab');
  assert.equal(challongeIdFromUrl('https://sub.challonge.com/abc'), 'sub-abc');
  assert.equal(challongeIdFromUrl('https://example.com/abc'), null);
});

test('challonge: счёт — одиночный и по сетам', () => {
  assert.deepEqual(parseScores('2-1'), [2, 1]);
  assert.deepEqual(parseScores('1-0,0-1,1-0'), [2, 1]);
  assert.equal(parseScores(''), null);
});

test('challonge: места, матчи, незавершённые матчи пропускаются с предупреждением', () => {
  const r = normalizeChallonge(V1);
  assert.deepEqual(r.placements.map(p => [p.name, p.place]),
    [['Test Alpha', 1], ['Test Beta', 2], ['Test Gamma', 3], ['Test Delta', 3]]);
  assert.equal(r.matches.length, 3);
  assert.deepEqual(r.matches[0], { bracket: 'upper', round: 1, a: 'Test Alpha', b: 'Test Gamma', score: [2, 0], winner: 'a' });
  assert.ok(r.warnings.some(w => w.includes('пропущено матчей: 1')));
  assert.equal(r.participants.length, 4);
});

test('challonge: нижняя сетка (отрицательный round), плоский формат без обёрток, идущий турнир', () => {
  const flat = { participants: [{ id: 1, name: 'A' }, { id: 2, name: 'B' }],
    matches: [{ player1_id: 1, player2_id: 2, winner_id: 2, scores_csv: '0-2', round: -1, state: 'complete' }] };
  const r = normalizeChallonge(flat);
  assert.equal(r.matches[0].bracket, 'lower');
  assert.equal(r.matches[0].winner, 'b');
  assert.ok(r.warnings.some(w => w.includes('final_rank')));
});

test('challonge: живой запрос не уходит без ключа, ключ не попадает в сообщение об ошибке', async () => {
  await assert.rejects(() => fetchChallonge('https://challonge.com/x', {}), /CHALLONGE_KEY/);
  let seen = '';
  const fake = async url => { seen = url; return { ok: false, status: 401, statusText: 'Unauthorized' }; };
  await assert.rejects(() => fetchChallonge('https://challonge.com/x', { apiKey: 'SECRET', fetchImpl: fake }), e => !e.message.includes('SECRET'));
  assert.ok(seen.includes('/tournaments/x.json'));
});

/* ───────── importer (чистая логика) ───────── */

const regTeam = (team, players, extra = {}) => ({
  team, submittedAt: '2026-10-01', logoSource: '', captainTelegram: '', subs: [], warnings: [],
  players: players.map(([nick, accountId], i) => ({ nick, pos: i + 1, mmr: 5000, accountId })), ...extra,
});

test('importer: новая команда и игроки создаются, account id привязывается', () => {
  const r = buildImport({ registration: [regTeam('Alpha', [['a1', '101'], ['a2', '102'], ['a3', '103'], ['a4', '104'], ['a5', '105']])] });
  assert.deepEqual(r.createdTeams.map(t => t.id), ['alpha']);
  assert.equal(r.createdPlayers.length, 5);
  assert.equal(r.newAccounts['101'], 'a1');
  assert.deepEqual(r.entries[0].roster.map(x => x.pos), [1, 2, 3, 4, 5]);
  assert.deepEqual(r.unresolved, []);
});

test('importer: похожее имя не создаёт дубль, а требует решения; --alias и --new решают', () => {
  const teams = [{ id: 'test-alpha', name: 'Test Alpha', aliases: [] }];
  const r1 = buildImport({ teams, placements: [{ name: 'Test Alpa', place: 1 }] });
  assert.equal(r1.unresolved.length, 1);
  assert.equal(r1.unresolved[0].suggestions[0].id, 'test-alpha');
  assert.equal(r1.createdTeams.length, 0);

  const r2 = buildImport({ teams, placements: [{ name: 'Test Alpa', place: 1 }], aliases: { 'Test Alpa': 'test-alpha' } });
  assert.deepEqual(r2.unresolved, []);
  assert.deepEqual(r2.updatedTeams[0].aliases, ['Test Alpa']);
  assert.equal(r2.entries[0].team, 'test-alpha');

  const r3 = buildImport({ teams, placements: [{ name: 'Test Alpa', place: 1 }], forceNew: ['Test Alpa'] });
  assert.equal(r3.createdTeams.length, 1);
});

test('importer: смена ника по тому же account id — алиас, а не новый игрок', () => {
  const players = [{ id: 'old-nick', nick: 'old nick', aliases: [], banned: [] }];
  const identity = { accounts: { '777': 'old-nick' } };
  const r = buildImport({ players, identity, registration: [regTeam('T', [['New Nick', '777']])] });
  assert.equal(r.createdPlayers.length, 0);
  assert.deepEqual(r.updatedPlayers[0].aliases, ['New Nick']);
  assert.equal(r.entries[0].roster[0].player, 'old-nick');
});

test('importer: тёзка с другим account id — отдельный игрок', () => {
  const players = [{ id: 'dasha', nick: 'Dasha', aliases: [], banned: [] }];
  const identity = { accounts: { '1': 'dasha' } };
  const r = buildImport({ players, identity, registration: [regTeam('T', [['Dasha', '2']])] });
  assert.equal(r.createdPlayers[0].id, 'dasha-2');
  assert.ok(r.warnings.some(w => w.includes('тёзка')));
});

test('importer: повторная заявка — остаётся последняя; результаты без регистрации дают пустой ростер', () => {
  const r = buildImport({
    registration: [regTeam('Dup', [['x1', '1']]), regTeam('dup', [['x2', '2']])],
    placements: [{ name: 'Dup', place: 1 }, { name: 'Ghost', place: 2 }],
  });
  assert.ok(r.warnings.some(w => w.includes('повторно')));
  assert.equal(r.entries.find(e => e.team === 'dup').roster[0].player, 'x2');
  assert.deepEqual(r.entries.find(e => e.team === 'ghost').roster, []);
  assert.ok(r.warnings.some(w => w.includes('нет в регистрации')));
});

test('importer: повторный импорт результатов не стирает ростеры', () => {
  const first = buildImport({ registration: [regTeam('Alpha', [['a1', '1']])] });
  const second = buildImport({
    teams: first.createdTeams, players: first.createdPlayers, identity: { accounts: first.newAccounts },
    existingEntries: first.entries, placements: [{ name: 'Alpha', place: 1 }],
  });
  assert.equal(second.entries[0].place, 1);
  assert.equal(second.entries[0].roster.length, 1);
  assert.equal(second.createdTeams.length + second.createdPlayers.length, 0);
});

/* ───────── сквозной прогон: new-tournament → import → validate → build ───────── */

function botCsv(teams) {
  const header = ['time', 'user_id', 'team', 'p1', 'p2', 'p3', 'p4', 'p5', 's1', 's2', 'tg', 'logo'].join('\t');
  const rows = teams.map(({ name, players }) => [
    '01.10.2026 12:00', '1', name,
    ...players.map(([nick, id], i) => q(`${i + 1}. 1) ${nick}\n2)5000\n3)https://steamcommunity.com/profiles/${BigInt(id) + 76561197960265728n}/\n4) https://www.dotabuff.com/players/${id}\n5)@tg_${id}\n6)disc_${id}`)),
    '-', '-', `@cap_${name.replace(/\W/g, '')}`, 'https://disk.example/logo',
  ].join('\t'));
  return [header, ...rows].join('\n') + '\n';
}
const squad = (prefix, base) => [1, 2, 3, 4, 5].map(i => [`${prefix}${i}`, String(base + i)]);

function tmpRoot() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'anypedia-'));
  fs.writeFileSync(path.join(root, 'CNAME'), 'www.example.test\n');
  return root;
}
const walk = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(d => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const snapshot = root => Object.fromEntries(walk(root).map(f => [path.relative(root, f), fs.readFileSync(f, 'utf8')]));

test('сквозной: ручной турнир с регистрацией → результаты → данные сайта', async () => {
  const root = tmpRoot();
  const { id } = createTournament({
    title: 'Test Cup 1', organizer: 'testorg', 'organizer-name': 'Test Org',
    start: '2026-10-03', prize: '15.000,10000,5000', tier: 'a',
  }, { root });
  assert.equal(id, 'test-cup-1');

  fs.mkdirSync(path.join(root, 'private', 'registrations'), { recursive: true });
  fs.writeFileSync(path.join(root, 'private', 'registrations', `${id}.csv`), botCsv([
    { name: 'Test Alpha', players: squad('alpha', 1000) },
    { name: 'Test Beta', players: squad('beta', 2000) },
    { name: 'Test Gamma', players: squad('gamma', 3000) },
    { name: 'Test Delta', players: squad('delta', 4000) },
  ]));
  fs.writeFileSync(path.join(root, 'content', 'inputs', `${id}.txt`), '1. Test Alpha\n2. Test Beta\n3-4. Test Gamma, Test Delta\n');

  const r = await runImport({ _: [id], alias: [], new: [] }, { root, log: silent, env: {} });
  assert.equal(r.ok, true, JSON.stringify(r.validation || r.unresolved));
  assert.equal(r.createdTeams.length, 4);
  assert.equal(r.createdPlayers.length, 20);

  // производные данные
  const t = JSON.parse(fs.readFileSync(path.join(root, 'data', 'tournaments', `${id}.json`), 'utf8'));
  assert.equal(t.winner.id, 'test-alpha');
  assert.equal(t.prizeTotalRub, 30000);
  assert.equal(t.entries[0].prizeRub, 15000);
  assert.equal(t.entries[1].prizeRub, 10000);
  assert.equal(t.entries[2].prizeRub, undefined);          // 3-4 место делят две команды → приз не выдумываем
  assert.deepEqual(t.entries[0].roster.map(x => x.pos), [1, 2, 3, 4, 5]);

  const team = JSON.parse(fs.readFileSync(path.join(root, 'data', 'teams', 'test-alpha.json'), 'utf8'));
  assert.equal(team.stats.wins, 1);
  assert.equal(team.stats.prizeTotalRub, 15000);
  assert.equal(team.lastRoster.players.length, 5);            // текущий состав выведен, а не вписан руками

  const player = JSON.parse(fs.readFileSync(path.join(root, 'data', 'players', 'alpha1.json'), 'utf8'));
  assert.equal(player.history[0].team.id, 'test-alpha');
  assert.equal(player.stats.mainPosition, 1);

  const org = JSON.parse(fs.readFileSync(path.join(root, 'data', 'organizers', 'testorg.json'), 'utf8'));
  assert.equal(org.stats.prizeTotalRub, 30000);

  const index = JSON.parse(fs.readFileSync(path.join(root, 'data', 'index.json'), 'utf8'));
  assert.equal(index.tournaments[0].winner.name, 'Test Alpha');
  assert.equal(index.teams.length, 4);

  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  assert.ok(sitemap.includes('<loc>https://www.example.test/test-cup-1</loc>'));
  assert.ok(sitemap.includes('/team/test-alpha</loc>'));
  assert.ok(sitemap.includes('/player/alpha1</loc>'));

  // приватность: ни контактов, ни account id, ни имён из формы в публичных папках
  for (const dir of ['content', 'data']) {
    for (const f of walk(path.join(root, dir))) {
      const text = fs.readFileSync(f, 'utf8');
      for (const secret of ['tg_', 'disc_', 'dotabuff', 'steamcommunity', 'example.com', '1001', '2003', 'cap_']) {
        assert.ok(!text.includes(secret), `${path.relative(root, f)} содержит «${secret}»`);
      }
    }
  }
  assert.ok(fs.readFileSync(path.join(root, 'private', 'identity.json'), 'utf8').includes('"1001"'));
});

test('сквозной: повторный импорт ничего не меняет', async () => {
  const root = tmpRoot();
  const { id } = createTournament({ title: 'Again Cup', organizer: 'o', 'organizer-name': 'O', start: '2026-10-03' }, { root });
  fs.mkdirSync(path.join(root, 'private', 'registrations'), { recursive: true });
  fs.writeFileSync(path.join(root, 'private', 'registrations', `${id}.csv`), botCsv([{ name: 'Solo', players: squad('s', 10) }]));
  fs.writeFileSync(path.join(root, 'content', 'inputs', `${id}.txt`), '1. Solo\n');
  await runImport({ _: [id], alias: [], new: [] }, { root, log: silent, env: {} });
  const before = snapshot(root);
  const again = await runImport({ _: [id], alias: [], new: [] }, { root, log: silent, env: {} });
  assert.equal(again.ok, true);
  assert.equal(again.createdTeams.length + again.createdPlayers.length, 0);
  assert.deepEqual(snapshot(root), before);
});

test('сквозной: Challonge из сохранённого JSON, опечатка в названии блокирует запись до решения', async () => {
  const root = tmpRoot();
  createTournament({ title: 'First', organizer: 'o', 'organizer-name': 'O', start: '2026-09-01' }, { root });
  fs.mkdirSync(path.join(root, 'private', 'registrations'), { recursive: true });
  fs.writeFileSync(path.join(root, 'private', 'registrations', 'first.csv'), botCsv([{ name: 'Test Alpha', players: squad('alpha', 1000) }]));
  fs.writeFileSync(path.join(root, 'content', 'inputs', 'first.txt'), '1. Test Alpha\n');
  await runImport({ _: ['first'], alias: [], new: [] }, { root, log: silent, env: {} });

  createTournament({ title: 'Second', organizer: 'o', start: '2026-10-05', challonge: 'https://challonge.com/ru/Second_1' }, { root });
  const json = path.join(root, 'challonge.json');
  fs.writeFileSync(json, JSON.stringify({ tournament: { state: 'complete',
    participants: [{ participant: { id: 1, name: 'Test Alpa', final_rank: 1 } }, { participant: { id: 2, name: 'Brand New', final_rank: 2 } }],
    matches: [{ match: { player1_id: 1, player2_id: 2, winner_id: 1, scores_csv: '2-0', round: 1, state: 'complete' } }] } }));

  const before = snapshot(root);
  const blocked = await runImport({ _: ['second'], 'challonge-json': json, alias: [], new: [] }, { root, log: silent, env: {} });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.unresolved[0].name, 'Test Alpa');
  assert.deepEqual(snapshot(root), before);                  // «всё или ничего»

  const done = await runImport({ _: ['second'], 'challonge-json': json, alias: ['Test Alpa=test-alpha'], new: [] }, { root, log: silent, env: {} });
  assert.equal(done.ok, true);
  const res = JSON.parse(fs.readFileSync(path.join(root, 'content', 'results', 'second.json'), 'utf8'));
  assert.equal(res.entries[0].team, 'test-alpha');
  assert.equal(res.matches.length, 1);
  assert.equal(res.matches[0].b, 'brand-new');
  const alpha = JSON.parse(fs.readFileSync(path.join(root, 'data', 'teams', 'test-alpha.json'), 'utf8'));
  assert.equal(alpha.history.length, 2);
  assert.equal(alpha.aliases[0], 'Test Alpa');
});

test('--dry-run ничего не пишет', async () => {
  const root = tmpRoot();
  const { id } = createTournament({ title: 'Dry', organizer: 'o', 'organizer-name': 'O', start: '2026-10-03' }, { root });
  fs.writeFileSync(path.join(root, 'content', 'inputs', `${id}.txt`), '1. Someone\n');
  const before = snapshot(root);
  const r = await runImport({ _: [id], dryRun: true, alias: [], new: [] }, { root, log: silent, env: {} });
  assert.equal(r.dryRun, true);
  assert.deepEqual(snapshot(root), before);
});

/* ───────── validate ───────── */

test('validate: ловит битые ссылки, дубли названий и неверные данные', async () => {
  const root = tmpRoot();
  const { id } = createTournament({ title: 'V Cup', organizer: 'o', 'organizer-name': 'O', start: '2026-10-03' }, { root });
  fs.writeFileSync(path.join(root, 'content', 'inputs', `${id}.txt`), '1. A Team\n');
  await runImport({ _: [id], alias: [], new: [] }, { root, log: silent, env: {} });
  assert.deepEqual(validateRoot(root).errors, []);

  const resFile = path.join(root, 'content', 'results', `${id}.json`);
  const res = JSON.parse(fs.readFileSync(resFile, 'utf8'));
  res.entries[0].team = 'нет-такой';
  res.entries[0].roster = [{ player: 'призрак', pos: 1 }, { player: 'призрак', pos: 1 }];
  fs.writeFileSync(resFile, JSON.stringify(res));

  fs.writeFileSync(path.join(root, 'content', 'teams', 'b-team.json'), JSON.stringify({ id: 'b-team', name: 'a team', aliases: [] }));
  fs.writeFileSync(path.join(root, 'content', 'tournaments', 'bad.json'),
    JSON.stringify({ id: 'bad', title: 'Bad', organizer: ['нет-орга'], start: '2026-13-40', end: '2026-01-01' }));

  const { errors } = validateRoot(root);
  const all = errors.join('\n');
  assert.match(all, /команда «нет-такой» не найдена/);
  assert.match(all, /игрок «призрак»/);
  assert.match(all, /повторяется позиция 1/);
  assert.match(all, /совпадает с названием команды/);
  assert.match(all, /несуществующая дата|дата в формате/);
  assert.ok(errors.length >= 5);
});

test('build: не затирает чужую папку data/, свою пересобирает', () => {
  const foreign = tmpRoot();
  fs.mkdirSync(path.join(foreign, 'data'));
  fs.writeFileSync(path.join(foreign, 'data', 'mine.txt'), 'важное');
  assert.throws(() => buildAll(foreign, { env: {} }), /не трогаю/);
  assert.equal(fs.readFileSync(path.join(foreign, 'data', 'mine.txt'), 'utf8'), 'важное');

  const own = tmpRoot();
  assert.equal(buildAll(own, { env: {} }).ok, true);           // пустой контент валиден
  fs.writeFileSync(path.join(own, 'data', 'stale.json'), '{}');
  assert.equal(buildAll(own, { env: {} }).ok, true);           // повторная сборка допустима…
  assert.equal(fs.existsSync(path.join(own, 'data', 'stale.json')), false);   // …и убирает устаревшее
});

test('build: при ошибках в данных ничего не пишет', () => {
  const root = tmpRoot();
  fs.mkdirSync(path.join(root, 'content', 'teams'), { recursive: true });
  fs.writeFileSync(path.join(root, 'content', 'teams', 'x.json'), '{"id":"Не Slug","name":"X"}');
  const r = buildAll(root, { env: {} });
  assert.equal(r.ok, false);
  assert.equal(fs.existsSync(path.join(root, 'data')), false);
  assert.equal(fs.existsSync(path.join(root, 'sitemap.xml')), false);
});

test('new-tournament: нет организатора без --organizer-name; повторное создание запрещено', () => {
  const root = tmpRoot();
  assert.throws(() => createTournament({ title: 'X', organizer: 'nope', start: '2026-10-03' }, { root }), /organizer-name/);
  createTournament({ title: 'X', organizer: 'o', 'organizer-name': 'O', start: '2026-10-03' }, { root });
  assert.throws(() => createTournament({ title: 'X', organizer: 'o', start: '2026-10-03' }, { root }), /уже существует/);
  assert.throws(() => createTournament({ title: 'X2', organizer: 'o', start: '2026-10-03', end: '2026-10-01' }, { root }));
});

test('адрес сайта: SITE_URL важнее site.json, site.json важнее CNAME', () => {
  const root = tmpRoot();                                        // в tmpRoot есть CNAME www.example.test
  assert.equal(siteUrlFor(root, {}), 'https://www.example.test');
  fs.writeFileSync(path.join(root, 'site.json'), '{"url":"https://anypedia.vercel.app"}');
  assert.equal(siteUrlFor(root, {}), 'https://anypedia.vercel.app');
  assert.equal(siteUrlFor(root, { SITE_URL: 'https://x.test' }), 'https://x.test');
});

test('data/site.js: исполняется и отдаёт то, что читают страницы (команды, игроки, организаторы)', async () => {
  const root = tmpRoot();
  const { id } = createTournament({ title: 'Test Cup 1', organizer: 'testorg', 'organizer-name': 'Test Org', start: '2026-10-03', prize: '15000,10000', 'reg-end': '2026-10-02' }, { root });
  fs.mkdirSync(path.join(root, 'private', 'registrations'), { recursive: true });
  fs.writeFileSync(path.join(root, 'private', 'registrations', `${id}.csv`), botCsv([
    { name: 'Test Alpha', players: squad('alpha', 1000) }, { name: 'Test Beta', players: squad('beta', 2000) }]));
  fs.writeFileSync(path.join(root, 'content', 'inputs', `${id}.txt`), '1. Test Alpha\n2. Test Beta\n');
  const r = await runImport({ _: [id], alias: [], new: [] }, { root, log: silent, env: {} });
  assert.equal(r.ok, true);

  const vm = await import('node:vm');
  const code = fs.readFileSync(path.join(root, 'data', 'site.js'), 'utf8');
  const g = vm.runInNewContext(`${code}; ({ tournaments, teams, organizers, playersData })`);
  assert.equal(g.tournaments[0].winner, 'Test Alpha');
  assert.equal(g.tournaments[0].prize, '25.000₽');
  assert.equal(g.tournaments[0].registrationEnd, '2026-10-02');
  assert.equal(JSON.stringify(g.tournaments[0].organizerIds), '["testorg"]');
  assert.equal(g.tournaments[0].teamsList[0].roster.length, 5);
  const alpha = g.teams.find(t => t.id === 'test-alpha');
  assert.equal(alpha.activeRoster.length, 5);
  assert.equal(alpha.tournaments[0].place, '1');
  assert.equal(alpha.tournaments[0].tournamentId, id);
  assert.equal(alpha.prize, '15.000₽');
  const p = g.playersData.find(x => x.id === 'alpha1');
  assert.equal(p.history[0].active, true);
  assert.equal(p.tournaments[0].teamId, 'test-alpha');
  assert.equal(g.organizers[0].id, 'testorg');
});
