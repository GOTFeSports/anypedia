/* ============================================================
   site-lib.js — общие функции для страниц.
   Данные (tournaments, teams, organizers, playersData) приходят из
   /data/site.js, который собирает `npm run build`. Здесь данных нет.
   ============================================================ */

function normPlayerStr(v) {
  return String(v || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function slugifyPlayer(nick) {
  return String(nick || '').normalize('NFKC').trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'player';
}

/* Игроки приходят готовыми (playersData). Здесь только подставляем
   объект команды вместо teamId — страницы читают h.team.name / h.team.id. */
let _игрокиКэш = null;
function getAllPlayers() {
  if (_игрокиКэш) return _игрокиКэш;
  const командыПоId = new Map((typeof teams !== 'undefined' ? teams : []).map(t => [t.id, t]));
  _игрокиКэш = (typeof playersData !== 'undefined' ? playersData : []).map(p => ({
    ...p,
    history: (p.history || []).map(h => ({ ...h, team: командыПоId.get(h.teamId) || { id: h.teamId, name: h.teamId } })),
    _турниры: (p.tournaments || []).map(t => ({ ...t, team: командыПоId.get(t.teamId) || { id: t.teamId, name: t.teamId } })),
  }));
  return _игрокиКэш;
}

function getPlayerId(player) {
  return player.id || slugifyPlayer(player.nick);
}

function findPlayerById(id) {
  if (!id) return null;
  return getAllPlayers().find(p => {
    if (p.id === id || slugifyPlayer(p.nick) === id) return true;
    return (p.aliases || []).some(a => slugifyPlayer(a) === id);
  }) || null;
}

/* Турниры игрока уже посчитаны при сборке (из ростеров турниров). */
function getPlayerTournaments(player) {
  return player._турниры || [];
}

const РОЛЬ_ПО_ПОЗИЦИИ = {
  1: { icon: 'carry.png',        label: 'Carry' },
  2: { icon: 'mid.png',          label: 'Mid' },
  3: { icon: 'offlane.png',      label: 'Offlaner' },
  4: { icon: 'support.png',      label: 'Soft Support' },
  5: { icon: 'fullsupport.png',  label: 'Hard Support' },
};

function флагСтраны(код) {
  if (!код || String(код).length !== 2) return '';
  const буквы = String(код).toUpperCase();
  if (!/^[A-Z]{2}$/.test(буквы)) return '';
  return String.fromCodePoint(...[...буквы].map(ch => 127397 + ch.charCodeAt(0)));
}

/* ============================================================
   ОРГАНИЗАТОРЫ
   ============================================================ */

function normOrgStr(v) {
  return String(v || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function slugifyOrganizer(value) {
  return String(value || '').normalize('NFKC').trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'organizer';
}

function getOrganizerId(org) {
  return org.id || slugifyOrganizer(org.name);
}

function organizerAllNames(org) {
  const aliases = org.aliases || [];
  const list = Array.isArray(aliases)
    ? aliases
    : String(aliases).split(',').map(s => s.trim()).filter(Boolean);
  return [org.name, ...list].filter(Boolean).map(normOrgStr);
}

/* Разбивает строку организатора на отдельные "куски" —
   на случай коллабораций вида "ECHO Rapture & RAMPAGE Tournaments",
   "Organizer1 x Organizer2", "A, B" и т.д. */
function splitOrganizerName(name) {
  return String(name || '')
    .split(/\s*(?:&|\+|,|\/|×| x | X | vs | VS | и )\s*/)
    .map(s => s.trim())
    .filter(Boolean);
}

/* Найти организатора по строке из поля tournament.organizer.
   Сначала пробуем точное совпадение всей строки, затем —
   совпадение по отдельным частям (для коллабораций). */
function findOrganizerByName(name) {
  if (!name) return null;
  const list = typeof organizers !== 'undefined' ? organizers : [];

  const key = normOrgStr(name);
  let found = list.find(o => organizerAllNames(o).includes(key));
  if (found) return found;

  for (const part of splitOrganizerName(name)) {
    const partKey = normOrgStr(part);
    if (!partKey) continue;
    found = list.find(o => organizerAllNames(o).includes(partKey));
    if (found) return found;
  }

  return null;
}

/* Найти ВСЕХ организаторов, упомянутых в строке (для коллабораций) */
function findAllOrganizersByName(name) {
  if (!name) return [];
  const list = typeof organizers !== 'undefined' ? organizers : [];
  const result = [];
  const seen = new Set();

  const tryAdd = (key) => {
    const found = list.find(o => organizerAllNames(o).includes(key));
    if (found) {
      const id = getOrganizerId(found);
      if (!seen.has(id)) { seen.add(id); result.push(found); }
    }
  };

  tryAdd(normOrgStr(name));
  for (const part of splitOrganizerName(name)) {
    tryAdd(normOrgStr(part));
  }

  return result;
}

/* Получить все турниры конкретного организатора (с учётом коллабораций —
   турнир засчитывается организатору, если он упомянут где-либо в поле organizer) */

/* Автоматический подсчёт суммарного призового фонда организатора
   на основе всех его турниров (числовое поле prizeRub) */
function calcOrganizerPrize(org) {
  if (!org) return null;
  const myT = getOrganizerTournaments(org);

  const total = myT.reduce((sum, t) => sum + (t.prizeRub || 0), 0);
  if (!total) return null;
  return total.toLocaleString('ru-RU') + '₽';
}

/* Турниры организатора: по id организаторов, которые записаны в турнир при сборке. */
function getOrganizerTournaments(org) {
  if (!org) return [];
  const oid = getOrganizerId(org);
  return (typeof tournaments !== 'undefined' ? tournaments : []).filter(t => (t.organizerIds || []).includes(oid));
}
