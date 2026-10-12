// schema/index.mjs — единые схемы сущностей Anypedia (Zod).
// content/*.json проходит через них при каждой сборке: опечатки и битые ссылки
// ловятся до публикации, а не на странице у посетителя.
import { z } from 'zod';

/* id: нижний регистр, буквы/цифры любого алфавита, дефисы между ними (как выдаёт slugify). */
export const Slug = z.string().min(1).regex(/^[\p{L}\p{N}]+(-[\p{L}\p{N}]+)*$/u,
  'id: только строчные буквы/цифры и дефисы, например "bedlam-october-fest"');

export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'дата в формате ГГГГ-ММ-ДД')
  .refine(s => {
    const d = new Date(`${s}T00:00:00Z`);
    return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
  }, 'несуществующая дата');

const Url = z.string().url();
const Pos = z.number().int().min(1).max(5);
const Place = z.number().int().positive();
const Aliases = z.array(z.string().min(1)).default([]);

export const Organizer = z.object({
  id: Slug,
  name: z.string().min(1),
  aliases: Aliases,
  logo: z.string().optional(),
  region: z.string().default('СНГ'),
  description: z.string().optional(),
  telegram: Url.optional(),
  discord: z.string().optional(),            // ссылки discord.gg/... иногда без схемы — не валидируем как URL
  website: Url.optional(),
  youtube: Url.optional(),
}).strict();

export const Team = z.object({
  id: Slug,
  name: z.string().min(1),
  aliases: Aliases,
  logo: z.string().optional(),
  region: z.string().default('СНГ'),
  description: z.string().optional(),
  telegram: Url.optional(),
  captain: z.string().optional(),            // публичная ссылка капитана, только если он сам согласен
  staff: z.array(z.object({                  // персонал команды (менеджер, тренер…) — не игроки
    nick: z.string().min(1), role: z.string().min(1), joined: IsoDate.optional(),
  }).strict()).default([]),
}).strict();

export const Ban = z.object({ league: z.string().min(1), reason: z.string().optional() }).strict();

/* Игрок. Связь с Dota account id хранится ОТДЕЛЬНО и приватно (private/identity.json),
   поэтому в публичном профиле account id нет. */
export const Player = z.object({
  id: Slug,
  nick: z.string().min(1),
  aliases: Aliases,
  country: z.string().length(2).optional(),
  photo: z.string().optional(),
  banned: z.array(Ban).default([]),
}).strict();

export const Tier = z.enum(['S', 'A', 'B', 'C']);

export const Source = z.discriminatedUnion('type', [
  z.object({ type: z.literal('challonge'), url: Url }).strict(),
  z.object({ type: z.literal('manual') }).strict(),
]);

export const Tournament = z.object({
  id: Slug,
  title: z.string().min(1),
  organizer: z.array(Slug).min(1),           // коллаб = несколько id, а не строка «A & B»
  start: IsoDate,
  end: IsoDate,
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  registrationStart: IsoDate.optional(),
  registrationEnd: IsoDate.optional(),
  location: z.string().default('Online'),
  format: z.string().optional(),             // Single Elimination, Double Elimination, …
  gameFormat: z.string().optional(),         // Captains Mode, …
  limit: z.string().optional(),              // «До 6.000 MMR на игрока»
  tier: Tier.optional(),
  teamsLimit: z.number().int().positive().optional(),
  prizePool: z.array(z.object({
    place: Place, amountRub: z.number().int().nonnegative(), note: z.string().optional(),
  }).strict()).default([]),
  prizeNote: z.string().optional(),          // «Слот в CQ», «Подарки» — то, что нельзя выразить числом
  description: z.string().optional(),
  links: z.object({
    registration: Url.optional(), telegram: Url.optional(), discord: z.string().optional(),
    rules: Url.optional(), bracket: Url.optional(), dotabuff: Url.optional(),
  }).strict().default({}),
  bracketEmbed: Url.optional(),              // адрес для iframe сетки; для Challonge выводится из source
  casters: z.array(z.object({ name: z.string().min(1), link: Url.optional() }).strict()).default([]),
  source: Source.default({ type: 'manual' }),
  form: z.string().optional(),               // id профиля формы регистрации (scripts/form-profiles)
}).strict().refine(t => t.end >= t.start, { message: 'end раньше start', path: ['end'] })
  .refine(t => new Set(t.prizePool.map(p => p.place)).size === t.prizePool.length,
    { message: 'в prizePool повторяется место', path: ['prizePool'] });

/* Участие команды в турнире: итоговое место и ростер НА ЭТОТ турнир.
   Место и ростер хранятся только здесь — страницы команды, игрока и победитель
   турнира выводятся из этих данных при сборке. */
export const Entry = z.object({
  team: Slug,
  place: Place.optional(),                   // нет, если итог неизвестен
  placeTo: Place.optional(),                 // конец диапазона для «5–8 место»
  roster: z.array(z.object({ player: Slug, pos: Pos }).strict()).max(5).default([]),
  subs: z.array(Slug).default([]),
}).strict().refine(e => e.placeTo === undefined || (e.place !== undefined && e.placeTo >= e.place),
  { message: 'placeTo без place или меньше place', path: ['placeTo'] });

export const Match = z.object({
  bracket: z.enum(['upper', 'lower']).default('upper'),
  round: z.number().int().positive(),
  a: Slug,
  b: Slug,
  score: z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]).nullable().default(null),
  winner: z.enum(['a', 'b']).nullable().default(null),
}).strict();

export const Results = z.object({
  entries: z.array(Entry).default([]),
  matches: z.array(Match).default([]),
}).strict();

export const Identity = z.object({
  accounts: z.record(z.string().regex(/^\d+$/), Slug).default({}),
}).strict();
