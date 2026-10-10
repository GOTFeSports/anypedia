// scripts/registrations.mjs
// Парсер выгрузок регистрации команд. Две формы:
//   'bot'    — форма из Telegram-бота: time, user_id, team, p1..p5, s1, s2, tg, logo
//   'google' — Google Forms: «Отметка времени», «Название команды…», «Регистрация Игрока N», …
// Нулевые зависимости. Сырой результат содержит ПЕРСОНАЛЬНЫЕ ДАННЫЕ — в git его
// класть нельзя. В репозиторий идёт только toPublicEntry() (ник + позиция).

/* ───────────── CSV / TSV с многострочными ячейками ───────────── */

export function detectDelimiter(text) {
  const head = text.slice(0, 5000);
  const tabs = (head.match(/\t/g) || []).length;
  return tabs >= 5 ? '\t' : ',';
}

export function parseDelimited(text, delimiter = detectDelimiter(text)) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += ch;
    } else if (ch === '"' && cell === '') {
      inQuotes = true;                      // кавычка открывает ячейку только в её начале
    } else if (ch === delimiter) {
      row.push(cell); cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      rows.push(row); row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter(r => r.some(c => c.trim() !== ''));
}

/* ───────────── Разбор ячейки игрока ───────────── */

const norm = s => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const EMPTY = new Set(['', '-', '—', '–', 'нет']);
const clean = v => (v == null || EMPTY.has(String(v).trim().toLowerCase())) ? '' : String(v).trim();

/* «1. 1) Veiro\n2)5300\n…» или «1.nick\n2. Имя\n…» → { 1: 'nick', 2: '…', … }
   Номера полей должны идти подряд, поэтому ник вида «0% Win rate» не ломает разбор. */
export function splitFields(cell) {
  const out = {};
  const lines = String(cell ?? '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let current = null;

  for (let line of lines) {
    if (current === null) {
      // форма бота: перед первым полем стоит номер игрока — «1. 1) Veiro»
      line = line.replace(/^\d+\s*\.\s+(?=1\s*[.)])/, '');
    }
    const m = line.match(/^(\d)\s*[.)]\s*(.*)$/);
    if (m && Number(m[1]) === (current ?? 0) + 1) {
      current = Number(m[1]);
      out[current] = m[2].trim();
    } else if (current !== null) {
      out[current] = `${out[current]} ${line}`.trim();     // перенос значения на новую строку
    }
  }
  return out;
}

/* Стабильный идентификатор игрока в Dota — 32-битный account id.
   Dotabuff/OpenDota дают его напрямую, Steam64 переводится вычитанием константы.
   Vanity-ссылки (steamcommunity.com/id/<имя>) без запроса к Steam не конвертируются. */
const STEAM64_BASE = 76561197960265728n;

export function accountIdFromUrl(url) {
  const u = String(url || '');
  let m = u.match(/(?:dotabuff\.com|opendota\.com)\/players\/(\d+)/i);
  if (m) return m[1];
  m = u.match(/steamcommunity\.com\/profiles\/(\d{17})/i);
  if (m) return String(BigInt(m[1]) - STEAM64_BASE);
  return null;
}

const toMmr = v => {
  const n = parseInt(String(v ?? '').replace(/\D/g, ''), 10);
  return Number.isNaN(n) ? null : n;
};

const toIsoDate = v => {
  const m = String(v || '').match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
};

const FIELD_MAP = {
  // порядок полей внутри ячейки игрока отличается между формами
  bot:    { 1: 'nick', 2: 'mmr', 3: 'steam', 4: 'dotabuff', 5: 'telegram', 6: 'discord' },
  google: { 1: 'nick', 2: 'realName', 3: 'profile', 4: 'contacts', 5: 'mmr', 6: 'position' },
};

function parsePlayer(cell, form) {
  const raw = splitFields(cell);
  const f = {};
  for (const [i, key] of Object.entries(FIELD_MAP[form])) f[key] = clean(raw[i]);
  if (!f.nick) return null;

  let telegram = f.telegram || '';
  let discord = f.discord || '';
  if (f.contacts) {
    const parts = f.contacts.split(/\s*\/\/\s*/).map(s => s.trim()).filter(Boolean);
    telegram = parts.find(p => p.startsWith('@')) || '';
    discord = parts.find(p => p !== telegram) || '';
  }

  const profileUrl = f.dotabuff || f.profile || f.steam || '';
  const accountId = accountIdFromUrl(f.dotabuff) || accountIdFromUrl(f.profile) || accountIdFromUrl(f.steam);
  const posMatch = String(f.position || '').match(/[1-5]/);

  return {
    nick: f.nick,
    pos: posMatch ? Number(posMatch[0]) : null,
    mmr: toMmr(f.mmr),
    realName: f.realName || '',
    telegram,
    discord,
    profileUrl,
    accountId,
  };
}

/* ───────────── Определение формы и сборка команд ───────────── */

export function detectForm(header) {
  const h = header.map(norm);
  if (h.includes('user_id') && h.includes('team') && h.includes('p1')) return 'bot';
  if (h.some(x => x.startsWith('название команды')) && h.some(x => /регистрация игрока 1/.test(x))) return 'google';
  return null;
}

function columnsFor(form, header) {
  const h = header.map(norm);
  const find = re => h.findIndex(x => re.test(x));
  if (form === 'bot') {
    const col = name => h.indexOf(name);
    return {
      time: col('time'), team: col('team'), logo: col('logo'), captain: col('tg'),
      mains: [1, 2, 3, 4, 5].map(n => col(`p${n}`)),
      subs: [1, 2].map(n => col(`s${n}`)),
    };
  }
  const mains = [], subs = [];
  h.forEach((x, i) => {
    let m = x.match(/регистрация игрока (\d)/);
    if (m) mains[Number(m[1]) - 1] = i;
    m = x.match(/регистрация замена (\d)/);
    if (m) subs[Number(m[1]) - 1] = i;
  });
  return {
    time: find(/^отметка времени/), team: find(/^название команды/), logo: find(/^логотип/),
    captain: find(/контактные данные капитана/), mains, subs,
  };
}

export function parseRegistrations(text, { delimiter } = {}) {
  const rows = parseDelimited(text, delimiter);
  const warnings = [];
  if (!rows.length) return { form: null, teams: [], warnings: ['пустой файл'] };

  const header = rows[0];
  const form = detectForm(header);
  if (!form) return { form: null, teams: [], warnings: ['не удалось определить форму по заголовку'] };

  const col = columnsFor(form, header);
  const get = (row, i) => (i >= 0 && i < row.length ? row[i] : '');
  const teams = [];

  for (const row of rows.slice(1)) {
    const name = get(row, col.team).replace(/\s+/g, ' ').trim();
    if (!name) continue;
    const w = [];

    const players = [];
    col.mains.forEach((ci, idx) => {
      const p = ci === undefined ? null : parsePlayer(get(row, ci), form);
      if (!p) { w.push(`пустой слот игрока ${idx + 1}`); return; }
      if (p.pos === null) p.pos = idx + 1;               // форма бота: позиция = номер колонки (предположение)
      players.push(p);
    });

    const subs = col.subs
      .map(ci => (ci === undefined ? null : parsePlayer(get(row, ci), form)))
      .filter(Boolean);

    if (players.length !== 5) w.push(`в основе ${players.length} игроков вместо 5`);
    const positions = players.map(p => p.pos);
    if (new Set(positions).size !== positions.length) w.push(`позиции повторяются: ${positions.join(',')}`);
    const nicks = [...players, ...subs].map(p => p.nick.toLowerCase());
    if (new Set(nicks).size !== nicks.length) w.push('повторяющиеся ники в одной команде');
    for (const p of [...players, ...subs]) {
      if (!p.accountId) w.push(`у «${p.nick}» нет account id (vanity-ссылка или пусто)`);
      if (p.mmr === null) w.push(`у «${p.nick}» не указан MMR`);
    }

    teams.push({
      team: name,
      submittedAt: toIsoDate(get(row, col.time)),
      logoSource: clean(get(row, col.logo)),
      captainTelegram: clean(get(row, col.captain)),
      players,
      subs,
      warnings: w,
    });
    w.forEach(x => warnings.push(`${name}: ${x}`));
  }
  return { form, teams, warnings };
}

/* Единственное, что попадает в публичный репозиторий. */
export function toPublicEntry(team) {
  return {
    team: team.team,
    roster: [...team.players].sort((a, b) => a.pos - b.pos).map(p => ({ nick: p.nick, pos: p.pos })),
    subs: team.subs.map(p => ({ nick: p.nick })),
  };
}
