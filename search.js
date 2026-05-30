/* ============================================================
   search.js — Глобальный поиск по турнирам и командам
   Подключается на всех страницах сайта после data.js и teams.js
   ============================================================ */

(function() {

/* ---------- HELPERS ---------- */
function normStr(v) {
  return String(v || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function slugifyTeam(value) {
  return String(value || '').normalize('NFKC').trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-').replace(/^-|-$/g, '') || 'team';
}

function getTeamId(team) {
  return team.id || slugifyTeam(team.name);
}

function teamAllNames(team) {
  const a = team.aliases || [];
  const list = Array.isArray(a) ? a : String(a).split(',').map(s => s.trim()).filter(Boolean);
  return [team.name, ...list].filter(Boolean).map(normStr);
}

function teamMatchesQuery(team, q) {
  return teamAllNames(team).some(n => n.includes(q));
}

function toLocalDate(s) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function getTournamentStatus(t) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = toLocalDate(t.start);
  const e = toLocalDate(t.end);
  if (today < s) return 'upcoming';
  if (today > e) return 'finished';
  return 'live';
}

/* ---------- BASE PATH ---------- */
// Вычисляем корень сайта абсолютно — работает с любого URL
function getSiteBase() {
  const p = location.pathname.replace(/index\.html$/, '').replace(/\/[^/]*\.html$/, '/');
  // Убираем /team/... и другие сегменты, оставляем только корень
  const teamIdx = p.indexOf('/team/');
  if (teamIdx >= 0) return location.origin + p.slice(0, teamIdx + 1);
  return location.origin + p;
}

/* ---------- INIT ---------- */
// Ждём DOM
function init() {
  const searchInput    = document.getElementById('search');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchWrap     = document.getElementById('searchWrap');

  if (!searchInput || !searchDropdown || !searchWrap) return;

  const allTournaments = typeof tournaments !== 'undefined' ? tournaments : [];
  const allTeams       = typeof teams       !== 'undefined' ? teams       : [];

  const statusLabel = { upcoming: 'Будущий', live: 'Текущий', finished: 'Завершён' };

  let activeIdx = -1;

  function closeDropdown() {
    searchDropdown.classList.remove('visible');
    activeIdx = -1;
  }

  function renderDropdown(q) {
    if (!q) { closeDropdown(); return; }

    const siteBase = getSiteBase();

    const matchedTournaments = allTournaments.filter(t =>
      t.title.toLowerCase().includes(q)
    ).slice(0, 6);

    const matchedTeams = allTeams.filter(t =>
      teamMatchesQuery(t, q)
    ).slice(0, 5);

    if (!matchedTournaments.length && !matchedTeams.length) {
      searchDropdown.innerHTML = `<div class="sd-empty">Ничего не найдено</div>`;
      searchDropdown.classList.add('visible');
      return;
    }

    let html = '';

    if (matchedTournaments.length) {
      html += `<div class="sd-group-label">🏆 Турниры</div>`;
      matchedTournaments.forEach(t => {
        const st = getTournamentStatus(t);
        const badge = statusLabel[st] || '';
        const link = `${siteBase}tournament.html?id=${encodeURIComponent(t.id)}`;
        html += `
          <a class="sd-item" href="${link}">
            <div class="sd-icon">🏆</div>
            <div class="sd-info">
              <div class="sd-title">${t.title}</div>
              <div class="sd-meta">${t.prize || '—'} · ${t.location || '—'}</div>
            </div>
            <span class="sd-badge">${badge}</span>
          </a>`;
      });
    }

    if (matchedTeams.length) {
      html += `<div class="sd-group-label">👥 Команды</div>`;
      matchedTeams.forEach(team => {
        const tid = getTeamId(team);
        const link = `${siteBase}team.html?id=${encodeURIComponent(tid)}`;
        html += `
          <a class="sd-item" href="${link}">
            <img class="sd-logo" src="${siteBase}${team.logo || 'dota2.png'}"
                 alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
            <div class="sd-icon" style="display:none">👥</div>
            <div class="sd-info">
              <div class="sd-title">${team.name}</div>
              <div class="sd-meta">${team.region || '—'}${team.prize ? ' · ' + team.prize : ''}</div>
            </div>
            <span class="sd-badge">Команда</span>
          </a>`;
      });
    }

    searchDropdown.innerHTML = html;
    searchDropdown.classList.add('visible');
    activeIdx = -1;
  }

  searchInput.addEventListener('input', e => {
    renderDropdown(e.target.value.toLowerCase().trim());
  });

  /* Клавиатурная навигация */
  searchInput.addEventListener('keydown', e => {
    const items = searchDropdown.querySelectorAll('.sd-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      items[activeIdx].click();
      return;
    } else if (e.key === 'Escape') {
      closeDropdown();
      searchInput.blur();
      return;
    }

    items.forEach((el, i) => el.classList.toggle('active', i === activeIdx));
    if (activeIdx >= 0) items[activeIdx].scrollIntoView({ block: 'nearest' });
  });

  /* Открыть снова при фокусе если есть текст */
  searchInput.addEventListener('focus', () => {
    const q = searchInput.value.toLowerCase().trim();
    if (q) renderDropdown(q);
  });

  /* Закрыть при клике вне */
  document.addEventListener('click', e => {
    if (!searchWrap.contains(e.target)) closeDropdown();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  /* Откладываем на следующий тик — гарантируем что основной скрипт страницы
     уже выполнился и переменные tournaments / teams доступны */
  setTimeout(init, 0);
}

})();
