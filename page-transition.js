/* ============================================================
   page-transition.js
   1. Устанавливает фон сразу при загрузке (до CSS) — нет вспышки
   2. Обновляет фон синхронно при смене темы
   ============================================================ */
(function () {
  const DARK_BG  = '#0f0f10';
  const LIGHT_BG = '#f4f4f6';

  function getBg(theme) {
    return theme === 'light' ? LIGHT_BG : DARK_BG;
  }

  /* Применяем фон немедленно через инлайн-стиль на <html> */
  function applyBg(theme) {
    const bg = getBg(theme);
    document.documentElement.style.background = bg;
    /* body может ещё не существовать при первом вызове */
    if (document.body) document.body.style.background = bg;
  }

  /* Первый запуск — до рендера */
  applyBg(localStorage.getItem('ap-theme') || 'dark');

  /* Слушаем смену темы — applyTheme() во всех файлах пишет в localStorage
     и ставит data-theme на <html>. Перехватываем через MutationObserver. */
  const observer = new MutationObserver(() => {
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    applyBg(theme);
  });

  function startObserver() {
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      /* Снова применяем — теперь body точно есть */
      applyBg(localStorage.getItem('ap-theme') || 'dark');
      startObserver();
    });
  } else {
    startObserver();
  }
})();
