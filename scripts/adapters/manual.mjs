// scripts/adapters/manual.mjs — результаты, вставленные текстом (пост оператора в Telegram, Google Sheets и т.п.).
//
// Понимает строки вида:
//   1. EGOISTO Team
//   2 - Neki4+4
//   3-4. Gitlz, Kaijo        ← диапазон и перечисление через запятую или «;»
//   5-8 место: A; B; C; D
//   3. Команда с запятой, внутри    ← если в названии запятая, пиши каждую команду отдельной строкой
// Пустые строки и строки с «#» в начале игнорируются.
//
// Возвращает { placements: [{ name, place, placeTo? }], warnings }.

const LINE = /^\s*(\d{1,3})(?:\s*[-–—]\s*(\d{1,3}))?\s*(?:-?\s*(?:место|м\.?))?\s*[.):\-–—]\s*(.+?)\s*$/i;

export function parseManualResults(text) {
  const placements = [];
  const warnings = [];

  String(text ?? '').split(/\r?\n/).forEach((line, i) => {
    if (!line.trim() || line.trim().startsWith('#')) return;
    const m = LINE.exec(line);
    if (!m) { warnings.push(`строка ${i + 1} не распознана: «${line.trim()}»`); return; }

    const place = Number(m[1]);
    const placeTo = m[2] ? Number(m[2]) : undefined;
    if (placeTo !== undefined && placeTo < place) {
      warnings.push(`строка ${i + 1}: диапазон ${place}–${placeTo} задан наоборот`);
      return;
    }
    const names = m[3].split(/\s*[,;]\s*/).map(s => s.trim()).filter(Boolean);
    for (const name of names) {
      placements.push(placeTo === undefined ? { name, place } : { name, place, placeTo });
    }
  });

  return { placements, warnings };
}
