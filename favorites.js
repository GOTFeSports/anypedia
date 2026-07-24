/* ============================================================
   favorites.js — «Избранное»: турниры и команды в localStorage.
   Общий модуль для всех страниц:
     - хранит { tournaments: [...id], teams: [...id] }
     - любая кнопка с data-fav-type + data-fav-id становится
       переключателем избранного (делегирование на document —
       работает и для карточек, отрисованных JS уже после
       загрузки этого файла)
     - Favorites.initStars() — проставить текущее визуальное
       состояние (⭐/☆) после того как страница отрисовала карточки
   ============================================================ */
(function () {
  const KEY = 'ap-favorites';

  function read() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return {
        tournaments: Array.isArray(raw.tournaments) ? raw.tournaments : [],
        teams: Array.isArray(raw.teams) ? raw.teams : [],
      };
    } catch {
      return { tournaments: [], teams: [] };
    }
  }

  function write(favs) {
    try { localStorage.setItem(KEY, JSON.stringify(favs)); } catch {}
  }

  function listFor(favs, type) {
    return type === 'team' ? favs.teams : favs.tournaments;
  }

  function isFavorite(type, id) {
    return listFor(read(), type).includes(id);
  }

  function toggleFavorite(type, id) {
    const favs = read();
    const list = listFor(favs, type);
    const idx = list.indexOf(id);
    if (idx >= 0) list.splice(idx, 1); else list.push(id);
    write(favs);
    return idx < 0; // true, если теперь в избранном
  }

  function syncButton(el, active) {
    el.classList.toggle('is-fav', active);
    el.setAttribute('aria-pressed', String(active));
    if (el.dataset.labelOff) {
      const label = el.querySelector('.fav-label');
      if (label) label.textContent = active ? (el.dataset.labelOn || el.dataset.labelOff) : el.dataset.labelOff;
    }
  }

  function initStars(root) {
    (root || document).querySelectorAll('[data-fav-type][data-fav-id]').forEach(el => {
      syncButton(el, isFavorite(el.dataset.favType, el.dataset.favId));
    });
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-fav-type][data-fav-id]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const active = toggleFavorite(btn.dataset.favType, btn.dataset.favId);
    document.querySelectorAll(
      `[data-fav-type="${btn.dataset.favType}"][data-fav-id="${CSS.escape(btn.dataset.favId)}"]`
    ).forEach(el => syncButton(el, active));
    document.dispatchEvent(new CustomEvent('favorites-changed'));
  }, true); // capture: должен сработать раньше, чем onclick строки/карточки, на которой лежит звезда

  window.Favorites = { read, isFavorite, toggleFavorite, initStars };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initStars());
  } else {
    initStars();
  }
})();
