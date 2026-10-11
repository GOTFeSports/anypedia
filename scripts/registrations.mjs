// scripts/registrations.mjs
// Парсер выгрузок регистрации команд, управляемый ПРОФИЛЯМИ форм (scripts/form-profiles/*.json).
// Новая форма оператора = новый JSON-файл профиля, код трогать не нужно.
// Сырой результат содержит ПЕРСОНАЛЬНЫЕ ДАННЫЕ — в git его класть нельзя.
// В репозиторий идёт только toPublicEntry() (ник + позиция).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROFILES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'form-profiles');

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

const hnorm = s => String(s ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
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

/* «23.09.2026 11:33» и «2026-09-23…» → «2026-09-23». Формат со слэшами (M/D/Y или D/M/Y) не поддержан намеренно. */
const toIsoDate = v => {
  const s = String(v || '');
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : null;
};

function parsePlayer(cell, profile) {
  const raw = splitFields(cell);
  const f = {};
  profile.cell.fields.forEach((key, i) => { f[key] = clean(raw[i + 1]); });
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

/* ───────────── Профили форм ───────────── */

export function loadProfiles(dir = PROFILES_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort().map(f => {
    const profile = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    for (const key of ['id', 'detect', 'columns', 'cell']) {
      if (!profile[key]) throw new Error(`form-profiles/${f}: нет поля «${key}»`);
    }
    if (!profile.columns.team || !profile.columns.players) throw new Error(`form-profiles/${f}: в columns нужны team и players`);
    if (!profile.cell.fields?.includes('nick')) throw new Error(`form-profiles/${f}: в cell.fields нужен «nick»`);
    return profile;
  });
}

/* spec: { equals: "tg" } | { pattern: "регэксп (\\d)" } — сравнение идёт с заголовком, приведённым к нижнему регистру. */
function matchSpec(spec, headerCell) {
  const h = hnorm(headerCell);
  if (spec.equals !== undefined) return h === String(spec.equals).toLowerCase() ? [h] : null;
  if (spec.pattern !== undefined) return new RegExp(spec.pattern, 'i').exec(h);
  return null;
}

export function detectProfile(header, profiles = loadProfiles()) {
  return profiles.find(p => p.detect.every(spec => header.some(h => matchSpec(spec, h)))) || null;
}

function resolveColumns(profile, header) {
  const findOne = spec => (spec ? header.findIndex(h => matchSpec(spec, h)) : -1);
  const findSlots = spec => {
    const out = [];
    if (!spec) return out;
    header.forEach((h, i) => {
      const m = matchSpec(spec, h);
      if (m && m[1]) out[Number(m[1]) - 1] = i;
    });
    return out;
  };
  const c = profile.columns;
  return {
    time: findOne(c.time), team: findOne(c.team), logo: findOne(c.logo), captain: findOne(c.captain),
    mains: findSlots(c.players), subs: findSlots(c.subs),
  };
}

/* ───────────── Разбор файла ───────────── */

export function parseRegistrations(text, { delimiter, profiles, profile: forcedId } = {}) {
  const rows = parseDelimited(text, delimiter);
  if (!rows.length) return { form: null, teams: [], warnings: ['пустой файл'] };

  const all = profiles ?? loadProfiles();
  const header = rows[0];
  const profile = forcedId ? all.find(p => p.id === forcedId) : detectProfile(header, all);
  if (!profile) {
    return {
      form: null, teams: [], header,
      warnings: [forcedId ? `профиль «${forcedId}» не найден` : 'не удалось определить форму по заголовку — см. npm run suggest-profile'],
    };
  }

  const col = resolveColumns(profile, header);
  const get = (row, i) => (i >= 0 && i < row.length ? row[i] : '');
  const teams = [];
  const warnings = [];

  for (const row of rows.slice(1)) {
    const name = get(row, col.team).replace(/\s+/g, ' ').trim();
    if (!name) continue;
    const w = [];

    const players = [];
    col.mains.forEach((ci, idx) => {
      const p = ci === undefined ? null : parsePlayer(get(row, ci), profile);
      if (!p) { w.push(`пустой слот игрока ${idx + 1}`); return; }
      if (p.pos === null) p.pos = idx + 1;               // нет поля позиции: позиция = номер слота (предположение)
      players.push(p);
    });

    const subs = col.subs
      .map(ci => (ci === undefined ? null : parsePlayer(get(row, ci), profile)))
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
  return { form: profile.id, teams, warnings };
}

/* Единственное, что попадает в публичный репозиторий. */
export function toPublicEntry(team) {
  return {
    team: team.team,
    roster: [...team.players].sort((a, b) => a.pos - b.pos).map(p => ({ nick: p.nick, pos: p.pos })),
    subs: team.subs.map(p => ({ nick: p.nick })),
  };
}

/* ───────────── Черновик профиля для незнакомой формы ───────────── */

const escapeRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function specFor(h) {
  const n = hnorm(h);
  return n.length <= 40 ? { equals: n } : { pattern: '^' + escapeRe(n.slice(0, 30).trim()) };
}

function slotSpec(header, wordRe, simpleRe) {
  const hs = header.map(hnorm);
  if (hs.filter(h => simpleRe.test(h)).length >= 2) return { pattern: simpleRe.source };
  const hits = hs.map(h => wordRe.exec(h)).filter(Boolean);
  if (hits.length >= 2) {
    const m = hits[0];
    const prefix = m.input.slice(0, m.index + m[0].length - 1);   // всё до цифры слота
    return { pattern: escapeRe(prefix) + '(\\d)' };
  }
  return null;
}

function sniffFields(cell) {
  const raw = splitFields(cell);
  const keys = [];
  const n = Math.max(0, ...Object.keys(raw).map(Number));
  for (let i = 1; i <= n; i++) {
    const v = String(raw[i] ?? '');
    if (i === 1) keys.push('nick');
    else if (/dotabuff|opendota/i.test(v)) keys.push('dotabuff');
    else if (/steamcommunity/i.test(v)) keys.push('steam');
    else if (/https?:\/\//i.test(v)) keys.push('profile');
    else if (/\/\//.test(v) && /@/.test(v)) keys.push('contacts');
    else if (/^@/.test(v)) keys.push('telegram');
    else if (/^\d{3,5}$/.test(v)) keys.push('mmr');
    else if (/^([1-5]\s*pos|pos\s*[1-5])/i.test(v)) keys.push('position');
    else if (i === 2) keys.push('realName');
    else keys.push('discord');
  }
  return keys;
}

/* Эвристический черновик: человек подтверждает и кладёт файл в scripts/form-profiles/. */
export function suggestProfile(text, { delimiter } = {}) {
  const rows = parseDelimited(text, delimiter);
  const notes = [];
  if (rows.length < 2) return { profile: null, notes: ['нужен заголовок и хотя бы одна строка данных'] };
  const header = rows[0];
  const hs = header.map(hnorm);
  const first = re => header.findIndex((h, i) => re.test(hs[i]));

  const teamIdx = header.findIndex((h, i) => /команд|team/.test(hs[i]) && !/лого|logo|капитан|captain/.test(hs[i]));
  if (teamIdx < 0) notes.push('не нашёл колонку с названием команды');
  const timeIdx = first(/отметка времени|врем|timestamp|^time$/);
  const logoIdx = first(/лого|logo/);
  const capIdx = first(/капитан|captain|^tg$/);

  const players = slotSpec(header, /(игрок|player)\D*?(\d)/, /^p(\d)$/);
  const subs = slotSpec(header, /(замен|sub|reserve|запас)\D*?(\d)/, /^s(\d)$/);
  if (!players) notes.push('не нашёл колонки игроков (ожидаю несколько колонок вида «Игрок 1…5» или p1…p5)');

  let fields = [];
  if (players) {
    const idx = header.findIndex(h => matchSpec(players, h));
    for (const row of rows.slice(1)) {
      if (idx >= 0 && clean(row[idx])) { fields = sniffFields(row[idx]); break; }
    }
    if (!fields.length) notes.push('не смог определить порядок полей в ячейке игрока');
  }

  const columns = { players };
  if (teamIdx >= 0) columns.team = specFor(header[teamIdx]);
  if (timeIdx >= 0) columns.time = specFor(header[timeIdx]);
  if (logoIdx >= 0) columns.logo = specFor(header[logoIdx]);
  if (capIdx >= 0) columns.captain = specFor(header[capIdx]);
  if (subs) columns.subs = subs;
  if (!fields.includes('position')) notes.push('в ячейке нет поля позиции: позиция будет равна номеру слота игрока');

  const profile = {
    id: 'draft',
    description: 'Черновик, сгенерированный автоматически. Проверь и переименуй id.',
    detect: [columns.team, players].filter(Boolean),
    columns,
    cell: { fields },
  };
  return { profile, notes };
}
