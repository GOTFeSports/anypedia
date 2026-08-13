/* ============================================================
   player.js — Логика страницы игрока
   Все данные берутся из teams.js (getAllPlayers/findPlayerById/
   getPlayerTournaments) — отдельного источника данных для игроков
   нет и не нужно.
   ============================================================ */

/* ============================================================
   ТЕМА
   ============================================================ */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const ИКОНКА_ЛУНЫ   = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const ИКОНКА_СОЛНЦА = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

function применитьТему(тема) {
  html.setAttribute('data-theme', тема);
  themeIcon.innerHTML = тема === 'dark' ? ИКОНКА_ЛУНЫ : ИКОНКА_СОЛНЦА;
  localStorage.setItem('ap-theme', тема);
}
применитьТему(localStorage.getItem('ap-theme') || 'dark');
themeBtn.addEventListener('click', () =>
  применитьТему(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ============================================================
   КНОПКА «НАВЕРХ»
   ============================================================ */
const toTopBtn = document.getElementById('toTopBtn');
window.addEventListener('scroll', () =>
  toTopBtn.classList.toggle('visible', window.scrollY > 300));
toTopBtn.addEventListener('click', () =>
  window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
   ============================================================ */
function экранировать(значение) {
  return String(значение ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function форматДата(значение) {
  if (!значение) return '—';
  const части = String(значение).split('-').map(Number);
  if (части.length !== 3 || части.some(Number.isNaN)) return экранировать(значение);
  return new Date(части[0], части[1] - 1, части[2]).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function форматДатаКраткая(значение) {
  if (!значение) return '—';
  const части = String(значение).split('-').map(Number);
  if (части.length !== 3 || части.some(Number.isNaN)) return экранировать(значение);
  return new Date(части[0], части[1] - 1, части[2]).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

function нормализовать(значение) {
  return String(значение || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

/* Ищем реальный турнир в data.js по названию — чтобы название в
   таблице турниров игрока стало кликабельной ссылкой. */
function найтиТурнирПоНазванию(название) {
  const ключ = нормализовать(название);
  if (!ключ) return null;
  const список = typeof tournaments !== 'undefined' ? tournaments : [];
  return список.find(t => нормализовать(t.title) === ключ) || null;
}

/* ============================================================
   URL-ХЕЛПЕРЫ
   ============================================================ */
function получитьIdИзUrl() {
  const paramsId = new URLSearchParams(window.location.search).get('id');
  if (paramsId) return paramsId;
  const части = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const индекс = части.indexOf('player');
  if (индекс >= 0 && части[индекс + 1]) return decodeURIComponent(части[индекс + 1]);
  const последний = decodeURIComponent(части.pop() || '');
  return последний && последний !== 'player.html' ? последний : '';
}

function получитьБазовыйПуть(id) {
  const путь = location.pathname;
  if (путь.endsWith('/player.html')) return путь.slice(0, путь.lastIndexOf('/') + 1);
  const чистый = путь.replace(/\/+$/, '');
  const суффикс = `/player/${encodeURIComponent(id)}`;
  if (чистый.endsWith(суффикс)) return чистый.slice(0, -суффикс.length + 1);
  const индекс = чистый.lastIndexOf('/player/');
  if (индекс >= 0) return чистый.slice(0, индекс + 1);
  return '/';
}

function корньСайта() {
  const p = location.pathname;
  if (/\/[^/]+\.html$/.test(p)) return location.origin + p.slice(0, p.lastIndexOf('/') + 1);
  const части = p.replace(/\/+$/, '').split('/').filter(Boolean);
  if (части[0] === 'player') return location.origin + '/';
  if (части.length <= 1)     return location.origin + '/';
  return location.origin + '/' + части.slice(0, -1).join('/') + '/';
}

/* ============================================================
   РЕНДЕР: ИСТОРИЯ В КОМАНДАХ
   ============================================================ */
function рендерИсторию(игрок) {
  const история = игрок.history || [];
  if (!история.length) return `<div class="empty-state">Нет данных</div>`;

  const строки = [...история].reverse(); // свежее — сверху

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Команда</th>
          <th>Роль</th>
          <th>Период</th>
        </tr>
      </thead>
      <tbody>
        ${строки.map(h => {
          const роль = РОЛЬ_ПО_ПОЗИЦИИ[h.pos];
          const teamId = h.team.id;
          const период = h.active
            ? `${форматДатаКраткая(h.joined)} — по н.в.`
            : `${форматДатаКраткая(h.joined)} — ${форматДатаКраткая(h.left)}`;
          return `
            <tr class="searchable-row">
              <td data-label="Команда"><a href="${корньСайта()}team/${encodeURIComponent(teamId)}" style="font-weight:600">${экранировать(h.team.name)}</a></td>
              <td data-label="Роль">${роль ? экранировать(роль.label) : '—'}</td>
              <td data-label="Период">${период}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   РЕНДЕР: ТУРНИРЫ ИГРОКА
   ============================================================ */
function рендерТурнирыИгрока(игрок) {
  const список = getPlayerTournaments(игрок);
  if (!список.length) return `<div class="empty-state">Турниры не найдены</div>`;

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Турнир</th>
          <th>Команда</th>
          <th>Место</th>
          <th>Призовые</th>
        </tr>
      </thead>
      <tbody>
        ${список.map(t => {
          const teamId = t.team.id;
          const найденныйТурнир = найтиТурнирПоНазванию(t.title);
          const турнирСсылка = найденныйТурнир
            ? `<a href="${корньСайта()}${encodeURIComponent(найденныйТурнир.id)}">${экранировать(t.title || '—')}</a>`
            : экранировать(t.title || '—');
          return `
            <tr class="searchable-row">
              <td data-label="Дата">${форматДатаКраткая(t.date)}</td>
              <td data-label="Турнир">${турнирСсылка}</td>
              <td data-label="Команда"><a href="${корньСайта()}team/${encodeURIComponent(teamId)}">${экранировать(t.team.name)}</a></td>
              <td data-label="Место">${экранировать(String(t.place ?? '—'))}</td>
              <td data-label="Призовые">${экранировать(t.prize || '—')}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   ГЛАВНАЯ ЛОГИКА
   ============================================================ */
const запрошенныйId = получитьIdИзUrl();
const игрок = typeof findPlayerById === 'function' ? findPlayerById(запрошенныйId) : null;

if (!игрок) {
  document.body.innerHTML = `
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;
                background:var(--bg);font-family:'Inter',sans-serif;text-align:center;color:var(--text)">
      <div>
        <h1 style="font-size:22px;margin-bottom:10px">Игрок не найден</h1>
        <p style="color:var(--text-muted);margin-bottom:20px">Проверьте ссылку или вернитесь на главную</p>
        <a href="/" style="padding:10px 18px;background:var(--bg3);border:1px solid var(--border);
           border-radius:10px;display:inline-block;color:var(--accent)">← Назад</a>
      </div>
    </div>`;
  throw new Error('Игрок не найден');
}

/* Чистим URL → /player/<id> */
const текущийId = getPlayerId(игрок);
if (!location.pathname.includes('/player/') || new URLSearchParams(window.location.search).has('id')) {
  const база = получитьБазовыйПуть(текущийId);
  history.replaceState(null, '', `${база}player/${encodeURIComponent(текущийId)}`);
}

document.title = `${игрок.nick} · Anypedia`;
document.getElementById('pageBody').style.display = 'grid';

const базаПути = получитьБазовыйПуть(текущийId);
const homeLink = document.getElementById('homeLink');
if (homeLink) homeLink.href = `${базаПути || '/'}index.html`;

/* Текущая (или последняя) команда и роль — из самой свежей записи истории */
const последняяЗапись = игрок.history[игрок.history.length - 1] || null;
const текущаяКоманда = последняяЗапись ? последняяЗапись.team : null;
const роль = РОЛЬ_ПО_ПОЗИЦИИ[игрок.pos] || null;
const флаг = флагСтраны(игрок.country);

/* ---------- INFOBOX ---------- */
document.getElementById('playerInfobox').innerHTML = `
  <img class="team-logo"
       src="/${экранировать(игрок.photo || 'image.png')}"
       alt="${экранировать(игрок.nick)}"
       onerror="this.onerror=null;this.src='/image.png'">
  <h1>${экранировать(игрок.nick)}</h1>
  ${флаг ? `
  <div class="info-row">
    <span class="info-label">Страна</span>
    <span class="info-val">${флаг}</span>
  </div>` : ''}
  ${роль ? `
  <div class="info-row">
    <span class="info-label">Роль</span>
    <span class="info-val">${экранировать(роль.label)}</span>
  </div>` : ''}
  ${текущаяКоманда ? `
  <div class="info-row">
    <span class="info-label">${последняяЗапись.active ? 'Команда' : 'Последняя команда'}</span>
    <span class="info-val"><a href="${корньСайта()}team/${encodeURIComponent(текущаяКоманда.id)}" style="color:var(--accent);font-weight:600">${экранировать(текущаяКоманда.name)}</a></span>
  </div>` : ''}
`;

/* ---------- ОПИСАНИЕ ---------- */
document.getElementById('summaryBlock').innerHTML = `
  <h1 class="page-title">${экранировать(игрок.nick)}</h1>
  <p class="desc-text">${текущаяКоманда
    ? (последняяЗапись.active
        ? `Играет за <a href="${корньСайта()}team/${encodeURIComponent(текущаяКоманда.id)}">${экранировать(текущаяКоманда.name)}</a>${роль ? ' на позиции ' + экранировать(роль.label) : ''}.`
        : `Ранее играл за <a href="${корньСайта()}team/${encodeURIComponent(текущаяКоманда.id)}">${экранировать(текущаяКоманда.name)}</a>.`)
    : 'Данные о текущей команде отсутствуют.'}</p>
`;

/* ---------- ИСТОРИЯ + ТУРНИРЫ ---------- */
document.getElementById('playerHistory').innerHTML = рендерИсторию(игрок);
document.getElementById('playerTournaments').innerHTML = рендерТурнирыИгрока(игрок);

if (window.Favorites) Favorites.initStars();
