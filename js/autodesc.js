// Автоописание турнира: если в information.json пустое поле description,
// сайт собирает короткий текст из остальных полей. Чистая функция — без DOM, проверяется в npm test.
import { limits } from './limits.js';

const fmt = (n) => Number(n).toLocaleString('ru-RU');
const KIND = { online: 'онлайн-турнир', lan: 'LAN-турнир', hybrid: 'турнир в формате онлайн + LAN' };
const VERB = { upcoming: 'Пройдёт', live: 'Проходит', finished: 'Прошёл' };
const clean = (v) => String(v ?? '').replace(/\s+/g, ' ').trim();
const dot = (s) => (/[.!?…]$/.test(s) ? s : `${s}.`);

/**
 * @param {object} p
 * @param {object} p.info     information.json
 * @param {string} p.status   upcoming | live | finished
 * @param {string} [p.dates]  уже отформатированные даты («14–15 ноября 2026»)
 * @param {number} [p.teams]  число команд
 * @param {string} [p.winner] 1 место
 * @param {string} [p.second] 2 место
 */
export function autoDescription({ info = {}, status = 'upcoming', dates = '', teams = 0, winner = '', second = '' }) {
  const name = clean(info.name) || 'Турнир';
  const kind = KIND[info.type] || 'турнир';
  const series = clean(info.series);
  const org = clean(info.organizer);

  let first = `${name} — ${kind} по ${clean(info.game) || 'Dota 2'}`;
  if (series && series !== name) first += ` из серии ${series}`;
  first += ' с ограничением по ПТС';
  const lim = limits(info).map((l) => (l.key === 'team' ? `до ${fmt(l.value)} на команду` : l.key === 'player' ? `до ${fmt(l.value)} на игрока` : `лимит ${fmt(l.value)}`));
  if (lim.length) first += ` (${lim.join(', ')})`;
  if (org) first += `. Организатор — ${org}`;

  const out = [dot(first)];
  const when = [];
  if (dates) when.push(`${VERB[status] || VERB.upcoming} ${dates}`);
  if (teams > 0) when.push(`${status === 'finished' ? 'участвовали' : 'участвуют'} ${teams} ${plural(teams, 'команда', 'команды', 'команд')}`);
  if (when.length) out.push(dot(when.join(', ').replace(/^./, (c) => c.toUpperCase())));
  if (clean(info.prize_pool)) out.push(`Призовой фонд — ${clean(info.prize_pool)}.`);
  const fmtLine = clean([].concat(info.format || [])[0]);
  if (fmtLine) out.push(dot(`Формат: ${fmtLine.replace(/^[А-ЯЁ]/, (c) => c.toLowerCase())}`));
  if (status === 'finished' && winner) out.push(dot(`Победитель — ${winner}${second ? `, второе место — ${second}` : ''}`));
  return out.join(' ');
}

function plural(n, a, b, c) {
  const m = Math.abs(n) % 100, d = m % 10;
  return m > 10 && m < 20 ? c : d > 1 && d < 5 ? b : d === 1 ? a : c;
}
