#!/usr/bin/env node
// Картинки для превью ссылок: по одной на турнир → assets/og/<slug>.png (1200×630).
// Читает tournaments/index.json (его создаёт `npm run build`), рисует карточку в Chrome/Chromium и сохраняет PNG.
// Нужен установленный Chrome или Chromium (на GitHub Actions он уже есть). Свой путь: CHROME_PATH=/путь/к/chrome
// Дальше: OG_IMAGES=1 npm run build — страницы турниров начнут ссылаться на эти картинки.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TOURNAMENTS = process.env.ANYPEDIA_TOURNAMENTS ? path.resolve(process.env.ANYPEDIA_TOURNAMENTS) : path.join(ROOT, 'tournaments');
const OUT = process.env.ANYPEDIA_OUT ? path.resolve(process.env.ANYPEDIA_OUT) : ROOT;
const OG_DIR = path.join(OUT, 'assets', 'og');

const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const index = readJson(path.join(TOURNAMENTS, 'index.json'));
if (!index?.tournaments) { console.error('✖ нет tournaments/index.json — сначала запустите npm run build'); process.exit(1); }
const pkg = readJson(path.join(ROOT, 'package.json')) || {};
const host = String(process.env.SITE_URL || pkg.homepage || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');

// ---------- поиск браузера ----------
function findChrome() {
  const cands = [process.env.CHROME_PATH, 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'chrome'].filter(Boolean);
  for (const c of cands) {
    if (c.includes('/') ? fs.existsSync(c) : spawnSync('which', [c]).status === 0) return c.includes('/') ? c : spawnSync('which', [c]).stdout.toString().trim();
  }
  const pw = path.join(os.homedir(), '.cache', 'ms-playwright');
  if (fs.existsSync(pw)) {
    for (const d of fs.readdirSync(pw).filter((x) => x.startsWith('chromium')).sort().reverse()) {
      for (const sub of ['chrome-linux/chrome', 'chrome-linux64/chrome']) {
        const p = path.join(pw, d, sub);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return null;
}
const chrome = findChrome();
if (!chrome) { console.error('✖ не найден Chrome/Chromium — укажите путь в CHROME_PATH'); process.exit(1); }

// ---------- форматирование ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nfmt = (n) => Number(n).toLocaleString('ru-RU').replace(/[  ]/g, ' ');
const dfmt = (iso) => {
  const x = new Date(`${iso}T00:00:00`);
  return isNaN(x) ? '' : x.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(/ г\.$/, '');
};
function dRange(a, b) {
  if (!a && !b) return '';
  if (!a || !b || a === b) return dfmt(a || b);
  const x = new Date(`${a}T00:00:00`), y = new Date(`${b}T00:00:00`);
  if (!isNaN(x) && !isNaN(y) && x.getMonth() === y.getMonth() && x.getFullYear() === y.getFullYear()) return `${x.getDate()}–${dfmt(b)}`;
  return `${dfmt(a)} — ${dfmt(b)}`;
}
function statusOf(t) {
  if (t.winner) return 'finished';
  if (t.status === 'live' || t.status === 'finished') return t.status;
  const today = new Date().toISOString().slice(0, 10);
  const end = t.date_end || t.date_start, start = t.date_start || t.date_end;
  if (end && end < today) return 'finished';
  if (start && start <= today) return 'live';
  return 'upcoming';
}
const STATUS = { upcoming: 'Скоро', live: 'Идёт сейчас', finished: 'Завершён' };

// Монограмма — та же логика, что на сайте
function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w) && !(w.length === 1 && /\p{Ll}/u.test(w)));
  return (words.length >= 2 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)).toUpperCase();
}
function hue(name) {
  let h = 0;
  for (const ch of String(name || '')) h = (h * 31 + ch.codePointAt(0)) % 360;
  return h;
}
const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif' };
function logoData(t) {
  if (!t.logo || /^https?:\/\//i.test(t.logo)) return null;
  const p = path.join(TOURNAMENTS, t.slug, t.logo);
  const mime = MIME[path.extname(p).toLowerCase()];
  if (!mime || !fs.existsSync(p)) return null;
  return `data:${mime};base64,${fs.readFileSync(p).toString('base64')}`;
}

// ---------- карточка ----------
function cardHtml(t) {
  const st = statusOf(t);
  const h = hue(t.name);
  const img = logoData(t);
  const logo = img
    ? `<img class="logo" src="${img}" alt="">`
    : `<div class="logo mono" style="background:hsl(${h} 45% 20%);color:hsl(${h} 85% 72%);border-color:hsl(${h} 40% 32%)">${esc(initials(t.name))}</div>`;
  const len = String(t.name).length;
  const size = len <= 18 ? 84 : len <= 28 ? 70 : len <= 40 ? 58 : 48;
  const stats = [
    t.prize_pool ? ['Призовой фонд', t.prize_pool] : null,
    t.pts_cap ? ['Лимит ПТС', nfmt(t.pts_cap)] : null,
    t.teams_count ? ['Команд', String(t.teams_count)] : null,
  ].filter(Boolean);
  const bottom = t.winner
    ? `<div class="winner"><span class="cup">🏆</span><div><small>Победитель</small><b>${esc(t.winner)}</b></div></div>`
    : stats.length
      ? `<div class="stats">${stats.map(([k, v]) => `<div><small>${esc(k)}</small><b>${esc(v)}</b></div>`).join('')}</div>`
      : '';
  const meta = [t.series && t.series !== t.name ? t.series : t.organizer, dRange(t.date_start, t.date_end)].filter(Boolean).join('  ·  ');
  return `<!doctype html><meta charset="utf-8"><style>
:root{--bg:#0d0f14;--panel:#151922;--border:#262d3d;--text:#eef0f5;--muted:#8d95a8;--accent:#34d27b;--gold:#f5c542}
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:radial-gradient(820px 460px at 100% -8%,rgba(52,210,123,.20),transparent 62%),var(--bg);color:var(--text);
 font-family:Inter,"Segoe UI","Noto Sans","DejaVu Sans","Liberation Sans",Arial,sans-serif;padding:48px 64px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.brand{font-weight:800;font-size:32px;letter-spacing:-.02em}.brand span{color:var(--accent)}
.host{color:var(--muted);font-size:22px}
.main{flex:1;display:flex;align-items:center;gap:40px;min-height:0}
.logo{flex:none;width:176px;height:176px;border-radius:32px;object-fit:cover;background:var(--panel);border:2px solid var(--border)}
.mono{display:grid;place-items:center;font-weight:800;font-size:72px;letter-spacing:-.03em;border:2px solid}
.txt{min-width:0}
.chip{display:inline-block;font-size:18px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);border:2px solid var(--accent);border-radius:999px;padding:4px 16px;margin-bottom:18px}
.chip.finished{color:var(--muted);border-color:var(--border)}
h1{font-size:${size}px;line-height:1.05;font-weight:800;letter-spacing:-.02em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.meta{margin-top:16px;color:var(--muted);font-size:27px;white-space:pre}
.stats{display:flex;gap:18px;align-self:flex-start}
.stats>div,.winner{background:var(--panel);border:2px solid var(--border);border-radius:20px;padding:16px 26px}
.stats>div{min-width:230px}
small{display:block;color:var(--muted);font-size:19px;letter-spacing:.06em;text-transform:uppercase;margin-bottom:4px}
.stats b,.winner b{font-size:38px;font-weight:800}
.stats>div:first-child b{color:var(--accent)}
.winner{align-self:flex-start;display:inline-flex;align-items:center;gap:20px;border-color:rgba(245,197,66,.45)}
.winner b{color:var(--gold)}.cup{font-size:50px}
</style>
<div class="top"><div class="brand">Any<span>pedia</span></div><div class="host">${esc(host)}</div></div>
<div class="main">${logo}<div class="txt"><div class="chip ${st}">${STATUS[st]}</div><h1>${esc(t.name)}</h1><div class="meta">${esc(meta)}</div></div></div>
${bottom}`;
}

// ---------- рендер ----------
fs.mkdirSync(OG_DIR, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'anypedia-og-'));
const slugs = new Set();
let ok = 0, fail = 0;
for (const t of index.tournaments) {
  if (!/^[a-z0-9][a-z0-9_-]*$/i.test(t.slug)) continue;
  slugs.add(`${t.slug}.png`);
  const html = path.join(tmp, `${t.slug}.html`);
  const png = path.join(OG_DIR, `${t.slug}.png`);
  fs.writeFileSync(html, cardHtml(t));
  const r = spawnSync(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--window-size=1200,630', '--virtual-time-budget=2000', `--screenshot=${png}`, `file://${html}`], { encoding: 'utf8', timeout: 60000 });
  if (fs.existsSync(png) && fs.statSync(png).size > 1000) ok++;
  else { fail++; console.warn(`⚠ ${t.slug}: картинка не создана ${r.stderr ? '— ' + r.stderr.split('\n').find((l) => /error|fail/i.test(l)) : ''}`); }
}
fs.rmSync(tmp, { recursive: true, force: true });
// удаляем картинки удалённых турниров
for (const f of fs.readdirSync(OG_DIR)) if (f.endsWith('.png') && !slugs.has(f)) fs.unlinkSync(path.join(OG_DIR, f));
console.log(`✔ картинки для превью: ${ok}${fail ? `, не создано: ${fail}` : ''} → assets/og/`);
process.exit(fail ? 1 : 0);
