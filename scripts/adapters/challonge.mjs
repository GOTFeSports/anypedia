// scripts/adapters/challonge.mjs — турнир Challonge → { placements, matches, warnings }.
//
// ВАЖНО (проверено частично): имена полей участников и матчей (name, final_rank, player1_id,
// player2_id, winner_id, scores_csv, round, state) подтверждены по документации библиотеки achallonge,
// которая работает с API v1. Сам адрес запроса, параметры include_* и способ авторизации ключом
// ниже — ПРЕДПОЛОЖЕНИЕ по v1 API: я не смог открыть официальную документацию. Если Challonge
// закрыл v1 или изменил ответ, поправить нужно только fetchChallonge(). Запасной путь без сети:
// сохрани JSON ответа в файл и запускай импорт с --challonge-json.

export function challongeIdFromUrl(url) {
  let u;
  try { u = new URL(url); } catch { return null; }
  if (!/(^|\.)challonge\.com$/i.test(u.hostname)) return null;
  const sub = u.hostname.toLowerCase().replace(/\.?challonge\.com$/, '');
  const parts = u.pathname.split('/').filter(Boolean);
  if (parts.length > 1 && /^[a-z]{2}(-[A-Za-z]{2})?$/.test(parts[0])) parts.shift();   // языковой префикс «/ru/»
  const slug = parts.find(p => !['module', 'standings', 'participants'].includes(p));
  if (!slug) return null;
  return sub && sub !== 'www' ? `${sub}-${slug}` : slug;
}

/* ПРЕДПОЛОЖЕНИЕ: v1-эндпоинт. Ключ передаётся только из окружения, в файлы и логи не пишется. */
export async function fetchChallonge(url, { apiKey, fetchImpl = fetch } = {}) {
  const id = challongeIdFromUrl(url);
  if (!id) throw new Error(`не смог получить id турнира из ссылки: ${url}`);
  if (!apiKey) throw new Error('нет ключа: задай переменную окружения CHALLONGE_KEY (или используй --challonge-json)');
  const endpoint = `https://api.challonge.com/v1/tournaments/${encodeURIComponent(id)}.json`
    + `?api_key=${encodeURIComponent(apiKey)}&include_participants=1&include_matches=1`;
  const res = await fetchImpl(endpoint);
  if (!res.ok) throw new Error(`Challonge ответил ${res.status} ${res.statusText}`);
  return res.json();
}

/* Ответ v1 оборачивает каждый объект: participants: [{ participant: {...} }]. Принимаем и плоский вариант. */
const unwrap = (item, key) => (item && typeof item === 'object' && item[key] && typeof item[key] === 'object' ? item[key] : item);

/* scores_csv: «2-1» → [2,1]; несколько сетов «1-0,0-1,1-0» → считаем выигранные сеты (ПРЕДПОЛОЖЕНИЕ). */
export function parseScores(csv) {
  const sets = String(csv ?? '').split(',').map(s => s.trim()).filter(Boolean)
    .map(s => s.match(/^(\d+)\s*-\s*(\d+)$/)).filter(Boolean).map(m => [Number(m[1]), Number(m[2])]);
  if (!sets.length) return null;
  if (sets.length === 1) return sets[0];
  let a = 0, b = 0;
  for (const [x, y] of sets) { if (x > y) a++; else if (y > x) b++; }
  return [a, b];
}

export function normalizeChallonge(json) {
  const t = unwrap(json, 'tournament') || {};
  const warnings = [];
  const participants = (t.participants || []).map(p => unwrap(p, 'participant')).filter(Boolean);
  const names = new Map(participants.map(p => [p.id, String(p.name ?? '').trim()]));

  const placements = [];
  for (const p of participants) {
    const name = String(p.name ?? '').trim();
    if (!name) { warnings.push(`участник id=${p.id} без названия`); continue; }
    if (Number.isInteger(p.final_rank) && p.final_rank > 0) placements.push({ name, place: p.final_rank });
  }
  if (!placements.length && participants.length) warnings.push('у участников нет final_rank — турнир ещё идёт или не завершён');

  const matches = [];
  let skipped = 0;
  for (const raw of t.matches || []) {
    const m = unwrap(raw, 'match');
    const a = names.get(m.player1_id), b = names.get(m.player2_id);
    if (m.state !== 'complete' || !a || !b || !Number.isInteger(m.round) || m.round === 0) { skipped++; continue; }
    const score = parseScores(m.scores_csv);
    let winner = null;
    if (m.winner_id === m.player1_id) winner = 'a';
    else if (m.winner_id === m.player2_id) winner = 'b';
    matches.push({
      bracket: m.round < 0 ? 'lower' : 'upper',
      round: Math.abs(m.round),
      a, b, score, winner,
    });
  }
  if (skipped) warnings.push(`пропущено матчей: ${skipped} (не завершены или без двух участников)`);

  matches.sort((x, y) => (x.bracket === y.bracket ? x.round - y.round : x.bracket === 'upper' ? -1 : 1));
  const participantNames = [...names.values()].filter(Boolean);
  return { placements, matches, participants: participantNames, warnings, state: t.state ?? null };
}
