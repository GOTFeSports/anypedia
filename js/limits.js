// Лимиты ПТС турнира. Общий модуль: его используют сайт, генератор картинок (card.js),
// сборка (build-index.mjs) и og-карточки (og.mjs).
//
//   pts_cap_team    — лимит ПТС на команду (сумма по составу)
//   pts_cap_player  — лимит ПТС на игрока
//   pts_cap         — «общий» лимит из старых турниров; работает как раньше и показывается как «Лимит»
//
// Возвращает только заполненные лимиты в порядке: команда, игрок, общий.
const ok = (v) => v != null && v !== '' && !isNaN(Number(v)) && Number(v) > 0;

export function limits(t = {}) {
  const out = [];
  if (ok(t.pts_cap_team)) out.push({ key: 'team', label: 'Лимит команды', short: 'ПТС команды', value: Number(t.pts_cap_team) });
  if (ok(t.pts_cap_player)) out.push({ key: 'player', label: 'Лимит игрока', short: 'ПТС игрока', value: Number(t.pts_cap_player) });
  if (ok(t.pts_cap)) out.push({ key: 'cap', label: 'Лимит', short: 'Лимит ПТС', value: Number(t.pts_cap) });
  return out;
}
