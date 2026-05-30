<script>
// =============================================
//  page-transition.js — улучшенная версия
//  Без белого экрана при переходах
// =============================================

(function () {
  const bg = '#0f0f10';
  let armed = false;

  function ensureOverlay() {
    if (document.getElementById('pageTransitionOverlay')) return;

    const style = document.createElement('style');
    style.textContent = `
      html, body { 
        background: ${bg} !important; 
        transition: background .1s;
      }
      #pageTransitionOverlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: ${bg};
        opacity: 0;
        pointer-events: none;
        transition: opacity .12s ease;
      }
      body.is-page-leaving #pageTransitionOverlay { 
        opacity: 1; 
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  }

  function isPlainLeftClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function shouldHandle(anchor, url) {
    if (!anchor || !url) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;
    if (url.origin !== location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return true;
  }

  function leaveTo(href) {
    if (armed) return;
    armed = true;
    ensureOverlay();
    document.body.classList.add('is-page-leaving');
    
    // Увеличили задержку чуть-чуть для стабильности
    window.setTimeout(() => {
      location.href = href;
    }, 95);
  }

  window.apNavigate = leaveTo;

  // Инициализация
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureOverlay, { once: true });
  } else {
    ensureOverlay();
  }

  // Перехват кликов
  document.addEventListener('click', event => {
    if (!isPlainLeftClick(event)) return;

    const anchor = event.target.closest && event.target.closest('a[href]');
    if (!anchor) return;

    const url = new URL(anchor.getAttribute('href'), location.href);
    if (!shouldHandle(anchor, url)) return;

    event.preventDefault();
    leaveTo(url.href);
  }, true);

  // Перед уходом со страницы
  window.addEventListener('beforeunload', () => {
    ensureOverlay();
    document.body.classList.add('is-page-leaving');
  });

  // После возвращения на страницу
  window.addEventListener('pageshow', () => {
    armed = false;
    document.body.classList.remove('is-page-leaving');
  });
})();
</script>
