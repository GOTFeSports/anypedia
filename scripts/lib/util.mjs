// scripts/lib/util.mjs — общие мелочи: нормализация имён, slug, JSON-файлы.
import fs from 'node:fs';
import path from 'node:path';

/* Ключ для сравнения имён: оставляет только буквы и цифры, регистр и пробелы не важны.
   «Neki4 +4» и «Neki4+4», «HATER ZDES'» и «HATER ZDES`» дают один ключ. */
export function normKey(s) {
  const raw = String(s ?? '').normalize('NFKC').toLowerCase();
  const key = raw.replace(/[^\p{L}\p{N}]+/gu, '');
  return key || raw.trim();
}

/* Читаемый идентификатор для URL и имён файлов (юникод разрешён: «海-常-kaijo»). */
export function slugify(s) {
  const base = String(s ?? '').normalize('NFKC').trim().toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'x';
}

/* slug, который не совпадает ни с одним id из `taken` (Set). */
export function uniqueSlug(s, taken) {
  const base = slugify(s);
  let id = base;
  for (let i = 2; taken.has(id); i++) id = `${base}-${i}`;
  return id;
}

export function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

export function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (e) {
    if (e.code === 'ENOENT' && fallback !== undefined) return fallback;
    throw new Error(`${file}: ${e.message}`);
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

/* Все *.json из папки → [{ file, id (имя файла без .json), data }], отсортировано по имени. */
export function listJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => ({ file: path.join(dir, f), id: f.slice(0, -5), data: readJson(path.join(dir, f)) }));
}
