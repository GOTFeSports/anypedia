// Anypedia — картинка-афиша турнира для Telegram и соцсетей. Рисуется в браузере на canvas, без внешних сервисов.
// Использование: downloadCard(ctx, 'landscape' | 'square' | 'story'), где ctx — данные страницы турнира.

const SIZES = { landscape: [1280, 720], square: [1080, 1080], story: [1080, 1920] };
const C = { bg: '#0d0f14', panel: '#151922', border: '#262d3d', text: '#eef0f5', muted: '#8d95a8', accent: '#34d27b', gold: '#f5c542', silver: '#c5ccda', bronze: '#d89a6a' };
const STATUS = { upcoming: 'Скоро', live: 'Идёт сейчас', finished: 'Итоги турнира' };
const EMOJI = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji"';

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
function initials(name) {
  const words = String(name || '').trim().split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w) && !(w.length === 1 && /\p{Ll}/u.test(w)));
  return (words.length >= 2 ? words[0][0] + words[1][0] : (words[0] || '?').slice(0, 2)).toUpperCase();
}
function hue(name) {
  let h = 0;
  for (const ch of String(name || '')) h = (h * 31 + ch.codePointAt(0)) % 360;
  return h;
}

const loadImg = (src) =>
  new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

function rr(g, x, y, w, h, r) {
  g.beginPath();
  g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h);
}
function wrap(g, text, maxW, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const t = cur ? `${cur} ${w}` : w;
    if (g.measureText(t).width <= maxW || !cur) cur = t;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    let l = lines[maxLines - 1];
    while (l.length > 1 && g.measureText(`${l}…`).width > maxW) l = l.slice(0, -1);
    lines[maxLines - 1] = `${l}…`;
  }
  return lines;
}
function fit(g, text, maxW, maxLines, from, to, weight, family) {
  for (let s = from; s >= to; s -= 2) {
    g.font = `${weight} ${s}px ${family}`;
    const lines = wrap(g, text, maxW, 99);
    if (lines.length <= maxLines && lines.every((l) => g.measureText(l).width <= maxW)) return { size: s, lines };
  }
  g.font = `${weight} ${to}px ${family}`;
  return { size: to, lines: wrap(g, text, maxW, maxLines) };
}
function ellipsis(g, text, maxW) {
  let t = String(text);
  if (g.measureText(t).width <= maxW) return t;
  while (t.length > 1 && g.measureText(`${t}…`).width > maxW) t = t.slice(0, -1);
  return `${t}…`;
}

function drawLogo(g, img, name, x, y, size) {
  const r = size * 0.18;
  g.save();
  rr(g, x, y, size, size, r);
  g.clip();
  if (img) {
    g.fillStyle = C.panel;
    g.fillRect(x, y, size, size);
    const k = Math.min(size / img.width, size / img.height);
    g.drawImage(img, x + (size - img.width * k) / 2, y + (size - img.height * k) / 2, img.width * k, img.height * k);
  } else {
    const h = hue(name);
    g.fillStyle = `hsl(${h} 45% 20%)`;
    g.fillRect(x, y, size, size);
  }
  g.restore();
  g.save();
  rr(g, x, y, size, size, r);
  g.lineWidth = Math.max(2, size / 90);
  g.strokeStyle = img ? C.border : `hsl(${hue(name)} 40% 32%)`;
  g.stroke();
  g.restore();
  if (!img) {
    g.fillStyle = `hsl(${hue(name)} 85% 72%)`;
    g.font = `800 ${Math.round(size * 0.4)}px ${FAMILY}`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(initials(name), x + size / 2, y + size / 2 + size * 0.02);
    g.textAlign = 'left';
  }
}

let FAMILY = 'system-ui, sans-serif';

function collect(ctx) {
  const i = ctx.info;
  const placements = [...(ctx.result?.placements || [])].sort((a, b) => a.place - b.place);
  const prizeFor = (place) => (i.prizes || []).find((x) => place >= x.place && place <= (x.place_to ?? x.place))?.prize || '';
  const podium = [];
  for (const p of placements) {
    if (podium.length >= 3) break;
    if (podium.some((x) => x.team === p.team)) continue;
    podium.push({ place: +p.place, team: p.team, prize: prizeFor(+p.place) });
  }
  const stats = [
    i.prize_pool ? ['Призовой фонд', String(i.prize_pool), true] : null,
    i.pts_cap ? ['Лимит ПТС', nfmt(i.pts_cap)] : null,
    ctx.roster?.teams?.length ? ['Команд', String(ctx.roster.teams.length)] : null,
  ].filter(Boolean);
  const meta = [i.series && i.series !== i.name ? i.series : i.organizer, dRange(i.date_start, i.date_end)].filter(Boolean);
  return { name: i.name, status: ctx.status, meta, stats, podium: ctx.status === 'finished' ? podium : [], host: `${location.host}/${ctx.slug}` };
}

export async function renderCard(ctx, kind = 'landscape') {
  const [W, H] = SIZES[kind] || SIZES.landscape;
  const d = collect(ctx);
  FAMILY = `${getComputedStyle(document.body).fontFamily || 'system-ui'}, ${EMOJI}`;
  if (document.fonts?.ready) await document.fonts.ready;

  const asset = (p) => (!p ? null : /^https?:\/\//i.test(p) ? p : `${ctx.base}${p}`);
  const logo = await loadImg(asset(ctx.info.logo));
  const teamImgs = new Map();
  await Promise.all(d.podium.map(async (p) => teamImgs.set(p.team, await loadImg(asset(ctx.teams.get(p.team)?.logo)))));

  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const wide = kind === 'landscape';
  const pad = wide ? 64 : 72;
  const u = wide ? 1 : 1.08;

  // фон
  g.fillStyle = C.bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * 0.95, -H * 0.05, 0, W * 0.95, -H * 0.05, Math.max(W, H) * 0.7);
  glow.addColorStop(0, 'rgba(52,210,123,.22)'); glow.addColorStop(1, 'rgba(52,210,123,0)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.textBaseline = 'alphabetic';

  // шапка
  const bs = 32 * u;
  g.font = `800 ${bs}px ${FAMILY}`;
  g.fillStyle = C.text; g.fillText('Any', pad, pad + bs * 0.8);
  const aw = g.measureText('Any').width;
  g.fillStyle = C.accent; g.fillText('pedia', pad + aw, pad + bs * 0.8);

  const chip = STATUS[d.status] || '';
  const drawChip = (x, y) => {
    g.font = `800 ${19 * u}px ${FAMILY}`;
    const label = chip.toUpperCase();
    const tw = g.measureText(label).width + label.length * 2;
    const w = tw + 36 * u, h = 40 * u;
    rr(g, x, y, w, h, h / 2);
    g.lineWidth = 2; g.strokeStyle = d.status === 'finished' ? C.gold : C.accent; g.stroke();
    g.fillStyle = d.status === 'finished' ? C.gold : C.accent;
    g.textBaseline = 'middle';
    if ('letterSpacing' in g) g.letterSpacing = '2px';
    g.fillText(label, x + 18 * u, y + h / 2 + 1);
    if ('letterSpacing' in g) g.letterSpacing = '0px';
    g.textBaseline = 'alphabetic';
    return h;
  };

  // нижний блок: призёры или статистика (рисуем снизу вверх, чтобы знать высоту)
  const bottomY = H - pad - (wide ? 6 : 0);
  const footH = wide ? 0 : 56;
  let blockTop = bottomY - footH;

  if (d.podium.length) {
    const rowH = (wide ? 72 : 96) * (kind === 'story' ? 1.1 : 1), gap = 12;
    const total = d.podium.length * rowH + (d.podium.length - 1) * gap;
    blockTop = bottomY - footH - total;
    d.podium.forEach((p, k) => {
      const y = blockTop + k * (rowH + gap);
      const col = [C.gold, C.silver, C.bronze][p.place - 1] || C.muted;
      rr(g, pad, y, W - pad * 2, rowH, 18); g.fillStyle = C.panel; g.fill();
      g.lineWidth = 2; g.strokeStyle = p.place === 1 ? 'rgba(245,197,66,.5)' : C.border; g.stroke();
      const ls = rowH - 24;
      g.font = `800 ${rowH * 0.42}px ${FAMILY}`; g.fillStyle = col; g.textBaseline = 'middle';
      g.fillText(p.place === 1 ? '🏆' : `${p.place}`, pad + 26, y + rowH / 2 + 2);
      drawLogo(g, teamImgs.get(p.team), p.team, pad + 26 + rowH * 0.8, y + 12, ls);
      g.textBaseline = 'middle';
      const nameX = pad + 26 + rowH * 0.8 + ls + 22;
      const prizeW = p.prize ? (g.font = `800 ${rowH * 0.34}px ${FAMILY}`, g.measureText(p.prize).width + 30) : 0;
      g.font = `800 ${rowH * 0.4}px ${FAMILY}`; g.fillStyle = p.place === 1 ? C.gold : C.text;
      g.fillText(ellipsis(g, p.team, W - pad - 26 - nameX - prizeW), nameX, y + rowH / 2 + 2);
      if (p.prize) { g.font = `800 ${rowH * 0.34}px ${FAMILY}`; g.fillStyle = C.accent; g.textAlign = 'right'; g.fillText(p.prize, W - pad - 26, y + rowH / 2 + 2); g.textAlign = 'left'; }
      g.textBaseline = 'alphabetic';
    });
  } else if (d.stats.length) {
    const cols = wide || d.stats.length <= 3 && kind === 'square' ? d.stats.length : 1;
    const boxH = wide ? 104 : kind === 'story' ? 128 : 112;
    const gap = 18;
    const rows = Math.ceil(d.stats.length / cols);
    const boxW = (W - pad * 2 - gap * (cols - 1)) / cols;
    blockTop = bottomY - footH - (rows * boxH + (rows - 1) * gap);
    d.stats.forEach(([k, v, accent], n) => {
      const x = pad + (n % cols) * (boxW + gap), y = blockTop + Math.floor(n / cols) * (boxH + gap);
      rr(g, x, y, boxW, boxH, 20); g.fillStyle = C.panel; g.fill(); g.lineWidth = 2; g.strokeStyle = C.border; g.stroke();
      g.font = `600 ${19 * u}px ${FAMILY}`; g.fillStyle = C.muted;
      if ('letterSpacing' in g) g.letterSpacing = '1.5px';
      g.fillText(k.toUpperCase(), x + 26, y + boxH * 0.34);
      if ('letterSpacing' in g) g.letterSpacing = '0px';
      g.font = `800 ${(boxH > 110 ? 44 : 40)}px ${FAMILY}`; g.fillStyle = accent ? C.accent : C.text;
      g.fillText(ellipsis(g, v, boxW - 52), x + 26, y + boxH * 0.78);
    });
  } else blockTop = bottomY - footH;

  // подпись-адрес (только вертикальные форматы — в горизонтальном адрес в шапке)
  if (wide) {
    g.font = `500 22px ${FAMILY}`; g.fillStyle = C.muted; g.textAlign = 'right';
    g.fillText(d.host, W - pad, pad + bs * 0.8); g.textAlign = 'left';
  } else {
    g.font = `500 ${26}px ${FAMILY}`; g.fillStyle = C.muted; g.textAlign = 'center';
    g.fillText(d.host, W / 2, H - pad + 6); g.textAlign = 'left';
  }

  // основная часть: логотип + название
  const topEdge = pad + bs + (wide ? 28 : 44);
  const area = blockTop - (wide ? 40 : 28) - topEdge;
  const nameFam = FAMILY;
  if (wide) {
    const ls = Math.min(190, Math.max(120, area - 20));
    const textX = pad + ls + 40, maxW = W - pad - textX;
    const f = fit(g, d.name, maxW, 2, 84, 44, 800, nameFam);
    const metaH = d.meta.length ? 46 : 0;
    const blockH = 40 * u + 20 + f.lines.length * f.size * 1.08 + metaH;
    const y0 = topEdge + Math.max(0, (area - blockH) / 2);
    drawLogo(g, logo, d.name, pad, topEdge + (area - ls) / 2, ls);
    drawChip(textX, y0);
    g.font = `800 ${f.size}px ${nameFam}`; g.fillStyle = C.text;
    let y = y0 + 40 * u + 20 + f.size * 0.88;
    for (const l of f.lines) { g.fillText(l, textX, y); y += f.size * 1.08; }
    if (d.meta.length) { g.font = `500 27px ${FAMILY}`; g.fillStyle = C.muted; g.fillText(ellipsis(g, d.meta.join('   ·   '), maxW), textX, y + 10); }
  } else {
    const ls = kind === 'story' ? 260 : 200, maxW = W - pad * 2;
    const f = fit(g, d.name, maxW, 3, kind === 'story' ? 104 : 92, 50, 800, nameFam);
    const metaLines = d.meta.length ? 1 : 0;
    const blockH = ls + 36 + 40 * u + 24 + f.lines.length * f.size * 1.08 + metaLines * 52;
    const y0 = topEdge + Math.max(0, (area - blockH) * (kind === 'story' ? 0.3 : 0.5));
    drawLogo(g, logo, d.name, pad, y0, ls);
    drawChip(pad, y0 + ls + 36);
    g.font = `800 ${f.size}px ${nameFam}`; g.fillStyle = C.text;
    let y = y0 + ls + 36 + 40 * u + 24 + f.size * 0.88;
    for (const l of f.lines) { g.fillText(l, pad, y); y += f.size * 1.08; }
    if (d.meta.length) { g.font = `500 ${30}px ${FAMILY}`; g.fillStyle = C.muted; g.fillText(ellipsis(g, d.meta.join('   ·   '), maxW), pad, y + 12); }
  }
  return cv;
}

export async function downloadCard(ctx, kind) {
  const cv = await renderCard(ctx, kind);
  const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
  if (!blob) throw new Error('canvas');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${ctx.slug}-${kind}.png`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
