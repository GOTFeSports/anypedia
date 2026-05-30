/* ============================================================
   page-transition.js
   Убирает белый экран при переходах между страницами.
   Фон остаётся тёмным/светлым в зависимости от темы.
   ============================================================ */
(function () {
  /* Читаем тему из localStorage до рендера */
  const savedTheme = localStorage.getItem('ap-theme') || 'dark';
  const bg = savedTheme === 'light' ? '#f4f4f6' : '#0f0f10';

  /* Вставляем стиль в <head> максимально рано */
  const style = document.createElement('style');
  style.textContent = `
    html { background: ${bg} !important; }
    body { background: ${bg} !important; opacity: 0; transition: opacity .18s ease; }
    body.ap-ready { opacity: 1; }
  `;
  document.head.appendChild(style);

  /* Показываем страницу как только DOM готов */
  function show() { document.body.classList.add('ap-ready'); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', show);
  } else {
    show();
  }

  /* Убираем fade при возврате через кнопку «Назад» */
  window.addEventListener('pageshow', () => {
    document.body.classList.add('ap-ready');
  });
})();
