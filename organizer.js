/* ============================================================
   organizer.js — Логика страницы организатора
   ============================================================ */

/* ---------- THEME ---------- */
const html      = document.documentElement;
const themeBtn  = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const MOON_SVG = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
const SUN_SVG  = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.innerHTML = theme === 'dark' ? MOON_SVG : SUN_SVG;
  localStorage.setItem('ap-theme', theme);
}
applyTheme(localStorage.getItem('ap-theme') || 'dark');
themeBtn.addEventListener('click', () =>
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* ---------- BACK TO TOP ---------- */
const toTopBtn = document.getElementById('toTopBtn');
window.addEventListener('scroll', () =>
  toTopBtn.classList.toggle('visible', window.scrollY > 300));
toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- HELPERS ---------- */
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

function toLocalDate(s) {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(s) {
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
}

const today = (() => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
function getStatus(t) {
  const s = toLocalDate(t.start), e = toLocalDate(t.end);
  if (today < s) return 'upcoming';
  if (today > e) return 'finished';
  return 'live';
}
const statusLabel = { upcoming: 'Будущий', live: 'Текущий', finished: 'Завершён' };
const statusClass = { upcoming: 'upcoming-tag', live: 'live-tag', finished: 'finished-tag' };

/* ---------- URL HELPERS ---------- */
function getIdFromUrl() {
  const paramsId = new URLSearchParams(window.location.search).get('id');
  if (paramsId) return paramsId;
  const parts = location.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const idx = parts.indexOf('organizer');
  if (idx >= 0 && parts[idx + 1]) return decodeURIComponent(parts[idx + 1]);
  const last = decodeURIComponent(parts.pop() || '');
  return last && last !== 'organizer.html' ? last : '';
}

function getBasePath(id) {
  const path = location.pathname;
  if (path.endsWith('/organizer.html')) return path.slice(0, path.lastIndexOf('/') + 1);
  const clean = path.replace(/\/+$/, '');
  const suffix = `/organizer/${encodeURIComponent(id)}`;
  if (clean.endsWith(suffix)) return clean.slice(0, -suffix.length + 1);
  const idx = clean.lastIndexOf('/organizer/');
  if (idx >= 0) return clean.slice(0, idx + 1);
  return '/';
}

function siteRoot() {
  const p = location.pathname;
  if (/\/[^/]+\.html$/.test(p)) return location.origin + p.slice(0, p.lastIndexOf('/') + 1);
  const parts = p.replace(/\/+$/, '').split('/').filter(Boolean);
  if (!parts.length || parts[0] === 'organizer' || parts[0] === 'team') return location.origin + '/';
  if (parts.length === 1) return location.origin + '/';
  return location.origin + '/' + parts.slice(0, -1).join('/') + '/';
}

/* ============================================================
   ГЛАВНАЯ ЛОГИКА
   ============================================================ */
const requestedId = getIdFromUrl();
const org = (typeof organizers !== 'undefined' ? organizers : []).find(o =>
  getOrganizerId(o) === requestedId || slugifyOrganizer(o.name) === requestedId
);

if (!org) {
  document.body.innerHTML = `
    <div style="height:100vh;display:flex;align-items:center;justify-content:center;
                background:var(--bg);font-family:'Inter',sans-serif;text-align:center;color:var(--text)">
      <div>
        <h1 style="font-size:22px;margin-bottom:10px">Организатор не найден</h1>
        <p style="color:var(--text-muted);margin-bottom:20px">Проверьте ссылку или вернитесь на главную</p>
        <a href="/" style="padding:10px 18px;background:var(--bg3);border:1px solid var(--border);
           border-radius:10px;display:inline-block;color:var(--accent)">← Назад</a>
      </div>
    </div>`;
  initSearch();
  throw new Error('Организатор не найден');
}

/* Чистим URL → /organizer/<id> */
const currentId = getOrganizerId(org);
if (!location.pathname.includes('/organizer/') || new URLSearchParams(window.location.search).has('id')) {
  const base = getBasePath(currentId);
  history.replaceState(null, '', `${base}organizer/${encodeURIComponent(currentId)}`);
}

document.title = `${org.name} · Anypedia`;
document.getElementById('pageBody').style.display = 'grid';

const basePath = getBasePath(currentId);

const homeLink = document.getElementById('homeLink');
if (homeLink) homeLink.href = `${basePath || '/'}index.html`;

/* ---------- INFOBOX ---------- */
const links = org.links || {};
document.getElementById('orgInfobox').innerHTML = `
  <img class="team-logo"
       src="${basePath}${escapeHtml(org.logo || 'dota2.png')}"
       alt="${escapeHtml(org.name)}"
       onerror="this.style.display='none'">
  <h1>${escapeHtml(org.name)}</h1>
  <div class="info-row">
    <span class="info-label">Регион</span>
    <span class="info-val">${escapeHtml(org.region || '—')}</span>
  </div>
  <a class="btn btn-tg ${org.telegramLink ? '' : 'is-disabled'}"
     href="${escapeHtml(org.telegramLink || '#')}" target="_blank" rel="noopener">
    ✈️ Telegram
  </a>
  <a class="btn btn-captain ${org.discordLink ? '' : 'is-disabled'}"
     href="${escapeHtml(org.discordLink || '#')}" target="_blank" rel="noopener">
    💬 Discord
  </a>
  ${links.website ? `
  <a class="btn btn-captain" href="${escapeHtml(links.website)}" target="_blank" rel="noopener">
    🌐 Сайт
  </a>` : ''}
`;

/* ---------- DESCRIPTION ---------- */
document.getElementById('summaryBlock').innerHTML = `
  <h1 class="page-title">${escapeHtml(org.name)}</h1>
  <p class="desc-text">${escapeHtml(org.description || 'Описание организатора пока не добавлено.')}</p>
`;

/* ---------- ТУРНИРЫ ОРГАНИЗАТОРА ---------- */
function buildOrgTournamentsTable() {
  const list = (typeof tournaments !== 'undefined' ? tournaments : [])
    .filter(t => {
      const found = findOrganizerByName(t.organizer);
      return found && getOrganizerId(found) === currentId;
    });

  if (!list.length) return `<div class="empty-state">Турниры не найдены</div>`;

  list.sort((a, b) => toLocalDate(b.start) - toLocalDate(a.start));

  const rows = list.map(t => {
    const st = getStatus(t);
    const dateText = t.start === t.end ? formatDate(t.start) : `${formatDate(t.start)} — ${formatDate(t.end)}`;
    const link = `${siteRoot()}${encodeURIComponent(t.id)}`;
    return `
      <tr class="searchable-row" onclick="location.href='${link}'" style="cursor:pointer">
        <td data-label="Дата">${dateText}</td>
        <td data-label="Турнир"><a href="${link}" style="font-weight:600">${escapeHtml(t.title)}</a></td>
        <td data-label="Статус"><span class="tag ${statusClass[st]}">${statusLabel[st]}</span></td>
        <td data-label="Приз" style="font-weight:600">${escapeHtml(t.prize || '—')}</td>
        <td data-label="Команд">${t.teams ?? '—'}</td>
      </tr>`;
  }).join('');

  return `
    <table class="data-table">
      <thead><tr><th>Дата</th><th>Турнир</th><th>Статус</th><th>Приз</th><th>Команд</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

document.getElementById('organizerTournaments').innerHTML = buildOrgTournamentsTable();

/* ============================================================
   ПОИСК — турниры + команды + организаторы
   ============================================================ */
function initSearch() {
  const input    = document.getElementById('search');
  const dropdown = document.getElementById('searchDropdown');
  const wrap     = document.getElementById('searchWrap');
  if (!input || !dropdown || !wrap) return;

  const allTournaments = typeof tournaments !== 'undefined' ? tournaments : [];
  const allTeams       = typeof teams !== 'undefined' ? teams : [];
  const allOrganizers  = typeof organizers !== 'undefined' ? organizers : [];

  let activeIdx = -1;

  function close() {
    dropdown.classList.remove('visible');
    activeIdx = -1;
  }

  function teamSlug(team) {
    return team.id || String(team.name || '').normalize('NFKC').trim()
      .replace(/\s+/g, '-').replace(/[^\p{L}\p{N}_-]+/gu, '')
      .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'team';
  }
  function teamNames(team) {
    const a = team.aliases || [];
    const aliases = Array.isArray(a) ? a : String(a).split(',').map(s => s.trim()).filter(Boolean);
    return [team.name, ...aliases].filter(Boolean).map(normOrgStr);
  }

  function render(q) {
    if (!q) { close(); return; }
    const base = siteRoot();

    const matchT = allTournaments.filter(t => normOrgStr(t.title).includes(q)).slice(0, 6);
    const matchK = allTeams.filter(team => teamNames(team).some(n => n.includes(q))).slice(0, 5);
    const matchO = allOrganizers.filter(o => organizerAllNames(o).some(n => n.includes(q))).slice(0, 5);

    if (!matchT.length && !matchK.length && !matchO.length) {
      dropdown.innerHTML = `<div class="sd-empty">Ничего не найдено</div>`;
      dropdown.classList.add('visible');
      return;
    }

    let out = '';

    if (matchT.length) {
      out += `<div class="sd-group-label">🏆 Турниры</div>`;
      matchT.forEach(t => {
        const link = `${base}${encodeURIComponent(t.id)}`;
        out += `
          <a class="sd-item" href="${link}">
            <div class="sd-icon">🏆</div>
            <div class="sd-info">
              <div class="sd-title">${escapeHtml(t.title)}</div>
              <div class="sd-meta">${escapeHtml(t.prize || '—')} · ${escapeHtml(t.location || '—')}</div>
            </div>
            <span class="sd-badge">${statusLabel[getStatus(t)] || ''}</span>
          </a>`;
      });
    }

    if (matchK.length) {
      out += `<div class="sd-group-label">👥 Команды</div>`;
      matchK.forEach(team => {
        const tid = teamSlug(team);
        const link = `${base}team/${encodeURIComponent(tid)}`;
        out += `
          <a class="sd-item" href="${link}">
            <img class="sd-logo" src="${base}${team.logo || 'dota2.png'}"
                 alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="sd-icon" style="display:none">👥</div>
            <div class="sd-info">
              <div class="sd-title">${escapeHtml(team.name)}</div>
              <div class="sd-meta">${escapeHtml(team.region || '—')}${team.prize ? ' · ' + escapeHtml(team.prize) : ''}</div>
            </div>
            <span class="sd-badge">Команда</span>
          </a>`;
      });
    }

    if (matchO.length) {
      out += `<div class="sd-group-label">🛡️ Организаторы</div>`;
      matchO.forEach(o => {
        const oid = getOrganizerId(o);
        const link = `${base}organizer/${encodeURIComponent(oid)}`;
        out += `
          <a class="sd-item" href="${link}">
            <img class="sd-logo" src="${base}${o.logo || 'dota2.png'}"
                 alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="sd-icon" style="display:none">🛡️</div>
            <div class="sd-info">
              <div class="sd-title">${escapeHtml(o.name)}</div>
              <div class="sd-meta">${escapeHtml(o.region || '—')}</div>
            </div>
            <span class="sd-badge">Организатор</span>
          </a>`;
      });
    }

    dropdown.innerHTML = out;
    dropdown.classList.add('visible');
    activeIdx = -1;
  }

  input.addEventListener('input', e => render(normOrgStr(e.target.value)));

  input.addEventListener('keydown', e => {
    const items = dropdown.querySelectorAll('.sd-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeIdx = Math.max(activeIdx - 1, 0); }
    else if (e.key === 'Enter' && activeIdx >= 0) { e.preventDefault(); items[activeIdx].click(); return; }
    else if (e.key === 'Escape') { close(); input.blur(); return; }
    else return;
    items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
    items[activeIdx]?.scrollIntoView({ block: 'nearest' });
  });

  input.addEventListener('focus', () => { if (input.value.trim()) render(normOrgStr(input.value)); });
  document.addEventListener('click', e => { if (!wrap.contains(e.target)) close(); });
}

initSearch();
