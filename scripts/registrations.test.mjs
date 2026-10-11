// node --test scripts/registrations.test.mjs
// Фикстуры повторяют СТРУКТУРУ реальных форм, но все данные выдуманы.
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDelimited, parseRegistrations, accountIdFromUrl, toPublicEntry, splitFields, suggestProfile, loadProfiles, detectProfile } from './registrations.mjs';

const q = s => `"${String(s).replace(/"/g, '""')}"`;
const steam64 = id => String(BigInt(id) + 76561197960265728n);

/* ── форма Telegram-бота ── */
function botPlayer(n, { nick, mmr, id, vanity = false }) {
  const steam = vanity ? 'https://steamcommunity.com/id/some_vanity/' : `https://steamcommunity.com/profiles/${steam64(id)}/`;
  return q(`${n}. 1) ${nick}\n2)${mmr}\n3)${steam}\n4) https://ru.dotabuff.com/players/${id}\n5)@tg_${nick}\n6)disc_${nick}`);
}
const BOT_HEADER = ['time', 'user_id', 'team', 'p1', 'p2', 'p3', 'p4', 'p5', 's1', 's2', 'tg', 'logo'].join('\t');
const botRow = [
  '23.09.2026 11:33', '1000000001', 'Test Alpha',
  botPlayer(1, { nick: 'Nick1', mmr: 5300, id: 1000001 }),
  botPlayer(2, { nick: 'Nick2', mmr: 7180, id: 1000002, vanity: true }),
  botPlayer(3, { nick: 'Nick3', mmr: 7300, id: 1000003 }),
  botPlayer(4, { nick: 'Nick4', mmr: 5300, id: 1000004 }),
  botPlayer(5, { nick: 'Nick5', mmr: 6000, id: 1000005 }),
  '-', '-', '@captain_alpha', 'https://disk.example/logo-alpha',
].join('\t');
const BOT_TSV = `${BOT_HEADER}\n${botRow}\n`;

/* ── Google Forms ── */
const gPlayerHeader = (kind, n) => q(`Регистрация ${kind} ${n}.\n1. Никнейм, используемый на профессиональном уровне;\n2. Настоящее имя;\n3. Ссылку на аккаунт;\n4. Контактные данные (Telegram и Discord);\n5. Основной показатель MMR.\n6. Позиция \n`);
const GOOGLE_HEADER = [
  'Отметка времени', 'Адрес электронной почты', 'Название команды (без Banword на Twitch)',
  'Логотип команды; необязательно (адекватный, желательно на белом или прозрачном) ',
  q('Условием участие в турнире является подписка на медиа-источники\n\nGOTF eSports\nAnyLvL Community\nDiscord'),
  ...[1, 2, 3, 4, 5].map(n => gPlayerHeader('Игрока', n)),
  gPlayerHeader('Замена', 1), gPlayerHeader('Замена', 2),
  q('Скриншоты с актуальным MMR игроков, должно быть видно:\nникнейм;\nmmr;'),
  'Контактные данные капитана команды (Telegram) ',
  gPlayerHeader('Замена', 3),
  'Откуда вы узнали о турнире?',
].join('\t');

const gCell = ({ nick, id, mmr, pos }) =>
  q(`1.${nick}\n2. Имя\n3. https://www.dotabuff.com/players/${id}\n4.  @tg_${id} // disc_${id}\n5. ${mmr}\n6. ${pos}POS\n`);
const gRow = (team, slots) => [
  '04.09.2026 1:41:57', 'someone@example.com', team, 'https://drive.example/logo-beta', 'Да, я согласен.',
  // порядок как в форме: замена 1, замена 2, скриншоты, капитан, замена 3, «откуда узнали»
  ...slots.map(gCell), '', '', 'https://drive.example/shot', '@captain_beta', '', '',
].join('\t');

const GOOGLE_TSV = [
  GOOGLE_HEADER,
  gRow('海 常 Test Beta', [
    { nick: '0% Win rate', id: 2000001, mmr: 5914, pos: 1 },
    { nick: 'Beta2', id: 2000002, mmr: 7390, pos: 2 },
    { nick: 'Beta3', id: 2000003, mmr: 6745, pos: 3 },
    { nick: 'Beta4', id: 2000004, mmr: 5822, pos: 4 },
    { nick: 'Beta5', id: 2000005, mmr: 5894, pos: 5 },
  ]),
  // позиции в другом порядке, чем номера слотов
  gRow('Test Gamma', [
    { nick: 'G1', id: 3000001, mmr: 5000, pos: 5 },
    { nick: 'G2', id: 3000002, mmr: 5000, pos: 4 },
    { nick: 'G3', id: 3000003, mmr: 5000, pos: 3 },
    { nick: 'G4', id: 3000004, mmr: 5000, pos: 2 },
    { nick: 'G5', id: 3000005, mmr: 5000, pos: 1 },
  ]),
].join('\n') + '\n';

test('csv: многострочные ячейки в кавычках не разрывают строки', () => {
  const rows = parseDelimited('a\tb\n"x\ny"\tz\n', '\t');
  assert.equal(rows.length, 2);
  assert.equal(rows[1][0], 'x\ny');
});

test('csv: разделитель определяется автоматически (запятая)', () => {
  const rows = parseDelimited('a,b\n"1,5",2\n');
  assert.deepEqual(rows[1], ['1,5', '2']);
});

test('account id: Dotabuff напрямую, Steam64 вычитанием, vanity — null', () => {
  assert.equal(accountIdFromUrl('https://www.dotabuff.com/players/12345'), '12345');
  assert.equal(accountIdFromUrl('https://ru.dotabuff.com/players/12345'), '12345');
  assert.equal(accountIdFromUrl('https://steamcommunity.com/profiles/76561197960287930/'), '22202');
  assert.equal(accountIdFromUrl('https://steamcommunity.com/id/some_vanity/'), null);
});

test('splitFields: префикс номера игрока и ник «0% Win rate»', () => {
  assert.equal(splitFields('1. 1) Veiro\n2)5300')[1], 'Veiro');
  assert.equal(splitFields('1. 0% Win rate\n2. Имя')[1], '0% Win rate');
});

test('форма бота: поля, позиции по порядку колонок, пустые замены игнорируются', () => {
  const r = parseRegistrations(BOT_TSV);
  assert.equal(r.form, 'bot');
  assert.equal(r.teams.length, 1);
  const t = r.teams[0];
  assert.equal(t.team, 'Test Alpha');
  assert.equal(t.submittedAt, '2026-09-23');
  assert.equal(t.captainTelegram, '@captain_alpha');
  assert.deepEqual(t.players.map(p => [p.nick, p.pos, p.mmr]),
    [['Nick1', 1, 5300], ['Nick2', 2, 7180], ['Nick3', 3, 7300], ['Nick4', 4, 5300], ['Nick5', 5, 6000]]);
  assert.equal(t.players[1].accountId, '1000002');     // vanity-ссылка Steam, но есть Dotabuff
  assert.equal(t.subs.length, 0);
  assert.deepEqual(r.warnings, []);
});

test('Google-форма: многострочные заголовки, контакты «tg // discord», позиция из поля', () => {
  const r = parseRegistrations(GOOGLE_TSV);
  assert.equal(r.form, 'google');
  assert.equal(r.teams.length, 2);

  const beta = r.teams[0];
  assert.equal(beta.team, '海 常 Test Beta');
  assert.equal(beta.submittedAt, '2026-09-04');
  assert.equal(beta.captainTelegram, '@captain_beta');
  assert.equal(beta.players[0].nick, '0% Win rate');
  assert.equal(beta.players[0].telegram, '@tg_2000001');
  assert.equal(beta.players[0].discord, 'disc_2000001');
  assert.equal(beta.players[0].accountId, '2000001');
  assert.equal(beta.players[3].mmr, 5822);

  const gamma = r.teams[1];
  assert.deepEqual(gamma.players.map(p => [p.nick, p.pos]),
    [['G1', 5], ['G2', 4], ['G3', 3], ['G4', 2], ['G5', 1]]);
  assert.deepEqual(r.warnings, []);
});

test('публичная проекция содержит только ник и позицию', () => {
  const [team] = parseRegistrations(GOOGLE_TSV).teams;
  const pub = toPublicEntry(team);
  assert.deepEqual(pub.roster.map(p => p.pos), [1, 2, 3, 4, 5]);
  const json = JSON.stringify(pub);
  for (const secret of ['tg_', 'disc_', 'Имя', 'mmr', 'accountId', 'dotabuff', 'example.com']) {
    assert.ok(!json.includes(secret), `в публичной проекции утекло: ${secret}`);
  }
});

test('предупреждения: дубли позиций и неполный состав', () => {
  const broken = GOOGLE_TSV.replace(/6\. 2POS/, '6. 1POS');   // у Beta2 позиция 1 вместо 2
  const r = parseRegistrations(broken);
  assert.ok(r.warnings.some(w => w.includes('позиции повторяются')));
});

test('неизвестный заголовок не угадывается', () => {
  const r = parseRegistrations('a\tb\n1\t2\n');
  assert.equal(r.form, null);
  assert.ok(r.warnings.length);
});

test('профили: встроенные профили загружаются и различают формы по заголовку', () => {
  const profiles = loadProfiles();
  assert.deepEqual(profiles.map(p => p.id), ['bot', 'google']);
  assert.equal(detectProfile(parseDelimited(BOT_TSV)[0], profiles).id, 'bot');
  assert.equal(detectProfile(parseDelimited(GOOGLE_TSV)[0], profiles).id, 'google');
});

test('профили: форму можно задать принудительно', () => {
  const r = parseRegistrations(BOT_TSV, { profile: 'google' });
  assert.equal(r.form, 'google');          // профиль выбран явно, даже если не подходит
  assert.equal(parseRegistrations(BOT_TSV, { profile: 'нет-такого' }).form, null);
});

test('suggestProfile: черновик по незнакомой форме разбирает данные так же, как встроенный профиль', () => {
  for (const tsv of [BOT_TSV, GOOGLE_TSV]) {
    const { profile, notes } = suggestProfile(tsv);
    assert.ok(profile, notes.join('; '));
    const viaDraft = parseRegistrations(tsv, { profiles: [profile] });
    const builtin = parseRegistrations(tsv);
    assert.deepEqual(viaDraft.teams, builtin.teams);
  }
});

test('suggestProfile: бессмысленный файл не даёт профиль-призрак', () => {
  const { profile, notes } = suggestProfile('a\tb\n1\t2\n');
  assert.ok(notes.length);
  assert.ok(profile === null || !profile.columns.players);
});
