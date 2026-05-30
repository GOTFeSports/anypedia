(function () {
  const bg = '#0f0f10';
  let armed = false;

  function ensureOverlay() {
    if (document.getElementById('pageTransitionOverlay')) return;

    const style = document.createElement('style');
    style.textContent = `
      html, body { background: ${bg} !important; }
      #pageTransitionOverlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        background: ${bg};
        opacity: 0;
        pointer-events: none;
        transition: opacity .12s ease;
      }
      body.is-page-leaving #pageTransitionOverlay { opacity: 1; }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
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
    return true;
  }

  function leaveTo(href) {
    if (armed) return;
    armed = true;
    ensureOverlay();
    document.body.classList.add('is-page-leaving');
    setTimeout(() => { location.href = href; }, 90);
  }

  window.apNavigate = leaveTo;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureOverlay, { once: true });
  } else {
    ensureOverlay();
  }

  document.addEventListener('click', event => {
    if (!isPlainLeftClick(event)) return;

    const anchor = event.target.closest('a[href]');
    if (!anchor) return;

    const url = new URL(anchor.getAttribute('href'), location.href);
    if (!shouldHandle(anchor, url)) return;

    event.preventDefault();
    leaveTo(url.href);
  }, true);

  window.addEventListener('beforeunload', () => {
    ensureOverlay();
    document.body.classList.add('is-page-leaving');
  });

  window.addEventListener('pageshow', () => {
    armed = false;
    document.body.classList.remove('is-page-leaving');
  });
})();
