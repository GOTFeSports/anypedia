/* ============================================================
   team.js — Anypedia Team Page Logic
   ============================================================ */

/* ---------- THEME ---------- */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const MOON = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const SUN  = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  themeIcon.innerHTML = t === 'dark' ? MOON : SUN;
  localStorage.setItem('ap-theme', t);
}
applyTheme(localStorage.getItem('ap-theme') || 'dark');
themeBtn.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ---------- BACK TO TOP ---------- */
const toTopBtn = document.getElementById('toTopBtn');
window.addEventListener('scroll', () =>
  toTopBtn.classList.toggle('visible', window.scrollY > 300));
toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================================
   HELPERS
   ============================================================ */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

/* Нормализация строки для сравнения названий */
function normTitle(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/* Получить aliases команды как массив строк */
function teamAliases(team) {
  const aliases = team.aliases || [];
  if (Array.isArray(aliases)) return aliases;
  return String(aliases).split(',').map(s => s.trim()).filter(Boolean);
}

/* Все имена команды (актуальное + алиасы), нормализованные */
function teamAllNames(team) {
  return [team.name, ...teamAliases(team)].filter(Boolean).map(normTitle);
}

function slugify(value) {
  return String(value || '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'team';
}

function teamId(team) {
  return team.id || slugify(team.name);
}

function allTeams() {
  return typeof teams !== 'undefined' && Array.isArray(teams) ? teams : [];
}

function allTournaments() {
  return typeof tournaments !== 'undefined' && Array.isArray(tournaments) ? tournaments : [];
}

/* ============================================================
   URL HELPERS
   ============================================================ */
function getTeamIdFromUrl() {
  const paramsId = new URLSearchParams(window.location.search).get('id');
  if (paramsId) return paramsId;

  const parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const teamIndex = parts.indexOf('team');
  if (teamIndex >= 0 && parts[teamIndex + 1]) {
    return decodeURIComponent(parts[teamIndex + 1]);
  }

  const last = decodeURIComponent(parts.pop() || '');
  return last && last !== 'team.html' && last !== 'index.html' ? last : '';
}

function getSiteBasePath(id) {
  const path = location.pathname;
  if (path.endsWith('/team.html') || path.endsWith('/index.html')) {
    return path.slice(0, path.lastIndexOf('/') + 1);
  }
  const clean = path.replace(/\/+$/, '');
  const suffix = `/team/${encodeURIComponent(id)}`;
  if (clean.endsWith(suffix)) return clean.slice(0, -suffix.length + 1);
  const teamIndex = clean.lastIndexOf('/team/');
  if (teamIndex >= 0) return clean.slice(0, teamIndex + 1);
  return '/';
}

function tournamentPageLink(tournamentId) {
  return `${getSiteBasePath(getTeamIdFromUrl())}${encodeURIComponent(tournamentId)}`;
}

/* ============================================================
   ПОИСК ТУРНИРА ПО НАЗВАНИЮ в data.js
   Ищет точное совпадение по нормализованному названию.
   Возвращает объект турнира или null.
   ============================================================ */
function findTournamentByTitle(title) {
  const key = normTitle(title);
  if (!key) return null;
  return allTournaments().find(t => normTitle(t.title) === key) || null;
}

/* ============================================================
   ПОИСК КОМАНДЫ в data.js по имени (учитывает aliases)
   Используется чтобы в турнирах находить команду даже если
   там записано старое название / алиас.
   ============================================================ */
function findTeamByName(name) {
  const key = normTitle(name);
  if (!key) return null;
  return allTeams().find(team => teamAllNames(team).includes(key)) || null;
}

/* ============================================================
   DATE HELPERS
   ============================================================ */
function formatDate(value) {
  if (!value) return '—';
  const parts = String(value).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return escapeHtml(value);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
}

function formatDateShort(value) {
  if (!value) return '—';
  const parts = String(value).split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return escapeHtml(value);
  return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

/* ============================================================
   BUILD TOURNAMENT ROWS
   Вы вручную задаёте список турниров в teams.js:
     tournaments: [
       { title: "Название турнира", date: "YYYY-MM-DD", place: "1", prize: "1000₽", limit: "..." },
       ...
     ]
   team.js ищет турнир с таким же названием в data.js и
   автоматически добавляет кликабельную ссылку.
   Если турнир не найден в data.js — строка отображается без ссылки.
   ============================================================ */
function buildTournamentRows(team) {
  const rows = (team.tournaments || []).map(item => {
    const found = findTournamentByTitle(item.title);
    return {
      date:      item.date || (found ? found.start : ''),
      dateLabel: item.date
        ? formatDateShort(item.date)
        : (found ? formatDateShort(found.start) : '—'),
      place:         item.place || '—',
      title:         item.title || '—',
      tournamentId:  found ? found.id : null,
      // Призовые — только из ручной записи, прочерк если не указано
      prize:         item.prize || '—',
      limit:         item.limit || (found ? (found.limit || '—') : '—'),
    };
  });

  rows.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  return rows;
}

/* ============================================================
   RENDER FUNCTIONS
   ============================================================ */
function renderRoster(rows, former = false) {
  if (!rows.length) return `<div class="empty-state">Нет данных</div>`;
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Никнейм</th>
          <th>Позиция</th>
          <th>Присоединился</th>
          ${former ? '<th>Покинул</th>' : ''}
        </tr>
      </thead>
      <tbody>
        ${rows.map(player => `
          <tr class="searchable-row">
            <td data-label="Никнейм">${escapeHtml(player.nick || '—')}</td>
            <td data-label="Позиция"><span class="pos-pill">${escapeHtml(player.pos ?? '—')}</span></td>
            <td data-label="Присоединился">${formatDate(player.joined)}</td>
            ${former ? `<td data-label="Покинул">${formatDate(player.left)}</td>` : ''}
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function renderTournaments(rows) {
  if (!rows.length) return `<div class="empty-state">Турниры не указаны</div>`;

  // Определяем класс медали по месту
  function medalClass(place) {
    const p = String(place).trim();
    if (p === '1') return 'place-gold';
    if (p === '2') return 'place-silver';
    if (p === '3') return 'place-bronze';
    return '';
  }

  function placeLabel(place) {
    return escapeHtml(String(place || '—'));
  }

  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Дата</th>
          <th>Место</th>
          <th>Турнир</th>
          <th>Призовые</th>
          <th>Ограничения</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => {
          const titleHtml = row.tournamentId
            ? `<a href="${tournamentPageLink(row.tournamentId)}">${escapeHtml(row.title)}</a>`
            : escapeHtml(row.title || '—');
          const cls = medalClass(row.place);
          return `
            <tr class="searchable-row ${cls}">
              <td data-label="Дата">${escapeHtml(row.dateLabel)}</td>
              <td data-label="Место" class="place-cell">${placeLabel(row.place)}</td>
              <td data-label="Турнир">${titleHtml}</td>
              <td data-label="Призовые">${escapeHtml(row.prize)}</td>
              <td data-label="Ограничения">${escapeHtml(row.limit || '—')}</td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

/* ============================================================
   MAIN — FIND TEAM & RENDER
   ============================================================ */
const requestedId = getTeamIdFromUrl();
const team = allTeams().find(item =>
  teamId(item) === requestedId || slugify(item.name) === requestedId
);

if (!team) {
  document.body.innerHTML = `
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;
                background:var(--bg);font-family:'Inter',sans-serif;text-align:center;color:var(--text)">
      <div>
        <h1 style="font-size:22px;margin-bottom:10px">Команда не найдена</h1>
        <p style="color:var(--text-muted);margin-bottom:20px">Проверьте ссылку или вернитесь на главную</p>
        <a href="${getSiteBasePath(requestedId)}"
           style="padding:10px 18px;background:var(--bg3);border:1px solid var(--border);
                  border-radius:10px;display:inline-block;color:var(--accent)">← Назад</a>
      </div>
    </div>`;
  throw new Error('Team not found');
}

/* Чистим URL (убираем ?id=...) */
const currentId = teamId(team);
if (!location.pathname.includes('/team/') || new URLSearchParams(window.location.search).has('id')) {
  history.replaceState(null, '', `${getSiteBasePath(currentId)}team/${encodeURIComponent(currentId)}`);
}

document.title = `${team.name} · Anypedia`;
document.getElementById('pageBody').style.display = 'grid';

/* basePath нужен чтобы логотип и ссылки находились правильно независимо от URL */
const basePath = getSiteBasePath(currentId);

/* Фиксим ссылку «Anypedia» в шапке — она должна вести на корень, не на index.html */
const homeLink = document.getElementById('homeLink');
if (homeLink) homeLink.href = basePath || '/';

/* Инфобокс */
document.getElementById('teamInfobox').innerHTML = `
  <img class="team-logo"
       src="${basePath}${escapeHtml(team.logo || 'dota2.png')}"
       alt="${escapeHtml(team.name)}"
       onerror="this.style.display='none'">
  <h1>${escapeHtml(team.name)}</h1>
  <div class="info-row">
    <span class="info-label">Регион</span>
    <span class="info-val">${escapeHtml(team.region || '—')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Призовые</span>
    <span class="info-val" style="color:var(--accent);font-weight:700">
      ${escapeHtml(team.prize || '—')}
    </span>
  </div>
  <a class="btn btn-tg ${team.telegramLink ? '' : 'is-disabled'}"
     href="${escapeHtml(team.telegramLink || '#')}" target="_blank" rel="noopener">
    ✈️ Telegram
  </a>
  <a class="btn btn-captain ${team.captainLink ? '' : 'is-disabled'}"
     href="${escapeHtml(team.captainLink || '#')}" target="_blank" rel="noopener">
    👤 Связаться с капитаном
  </a>
`;

/* Описание */
document.getElementById('summaryBlock').innerHTML = `
  <h1 class="page-title">${escapeHtml(team.name)}</h1>
  <p class="desc-text">${escapeHtml(team.description || 'Описание команды пока не добавлено.')}</p>
`;

/* Составы */
document.getElementById('activeRoster').innerHTML  = renderRoster(team.activeRoster || team.roster || []);
document.getElementById('formerPlayers').innerHTML = renderRoster(team.formerPlayers || [], true);

/* Турниры — ручной список + автоматический поиск ссылок */
document.getElementById('teamTournaments').innerHTML = renderTournaments(buildTournamentRows(team));
