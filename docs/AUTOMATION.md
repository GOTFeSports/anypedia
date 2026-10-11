# Anypedia: как добавлять турниры (автоматизация)

Один источник правды — `content/`. Всё остальное (`data/*.json`, `sitemap.xml`) собирается само. Руками их не править.

```
content/
  organizers/<id>.json     профиль организатора
  tournaments/<id>.json    метаданные турнира + откуда брать результаты (source)
  results/<id>.json        СГЕНЕРИРОВАНО импортом: команды, места, ростеры, матчи
  teams/<id>.json          профиль команды (имя, aliases, лого)
  players/<id>.json        профиль игрока (ник, aliases, страна, фото)
  inputs/<id>.txt          результаты текстом, если нет Challonge
private/                   НЕ в git: выгрузки регистраций и связь ник ↔ Dota account id
scripts/form-profiles/    описание форм регистрации операторов (по одному JSON на форму)
```

## Новый турнир: 3 шага

```bash
# 1. создать (организатор должен существовать, либо добавь --organizer-name "Название")
npm run new-tournament -- --title "Bedlam: October Fest" --organizer bedlam \
  --start 2026-10-03 --end 2026-10-04 --tier A --prize 15000,10000,5000 \
  --challonge https://challonge.com/ru/XXXX          # без --challonge источник = manual

# 2. положить выгрузку регистрации в private/registrations/<id-турнира>.csv
#    (если регистрации нет — пропусти, ростеры будут пустыми)

# 3. когда турнир закончился
npm run import -- bedlam-october-fest
git add content data sitemap.xml && git commit -m "Bedlam October Fest" && git push
```

Импорт сам: определяет форму регистрации по заголовку, создаёт новые команды и игроков, склеивает игроков по
Dota account id (смена ника не создаёт дубль), сверяет схему и ссылки, пересобирает `data/` и `sitemap.xml`.
Запись идёт «всё или ничего»: при проблеме ничего не меняется.

Полезные флаги: `--dry-run` (показать, что будет), `--reg файл.csv`, `--form <профиль>`.

## Результаты без Challonge

Впиши итоги в `content/inputs/<id>.txt` (так, как опубликовал оператор):

```
1. EGOISTO Team
2. Neki4+4
3-4. Gitlz, Kaijo
5-8. Team A, Team B, Team C, Team D
```

Матчей в этом режиме нет, и это нормально: сайт покажет места и ростеры, а сетку оператора — ссылкой (`links.bracket`).

## Единственное, что иногда требует человека

Импорт не угадывает, когда название **похоже на существующую команду, но не совпадает** («Test Alpa» против «Test Alpha»).
Он остановится и подскажет команду:

```bash
npm run import -- <id> --alias "Test Alpa=test-alpha"   # это та же команда (имя запомнится как alias)
npm run import -- <id> --new "Test Alpa"                # это новая команда
```

## Новая форма регистрации у другого оператора

```bash
npm run suggest-profile -- private/registrations/<выгрузка>.csv > scripts/form-profiles/<оператор>.json
```

Открой файл, поменяй `id`, проверь `cell.fields` (порядок полей в ячейке игрока) и положи в репозиторий.
Дальше эта форма распознаётся сама. В турнире можно закрепить профиль полем `"form": "<id>"`.

## Challonge

- Ключ только в переменной окружения: `export CHALLONGE_KEY=...` (в файлы и git не попадает).
- Без сети/ключа: сохрани JSON ответа Challonge в файл и запусти `npm run import -- <id> --challonge-json файл.json`.
- **Предположение:** адрес `https://api.challonge.com/v1/tournaments/<id>.json` с параметрами `include_participants`/`include_matches`
  и авторизация ключом по v1 не проверены по официальной документации. Если запрос не работает, правится одна функция
  `fetchChallonge()` в `scripts/adapters/challonge.mjs`. Имена полей (`final_rank`, `player1_id`, `scores_csv`…) соответствуют v1.

## Приватность

Выгрузки регистраций содержат e-mail, настоящие имена, Telegram, Discord и Steam. Они живут только в `private/`
(в `.gitignore`). В публичные папки попадают только ник, позиция и результат. Связь «ник ↔ account id»
лежит в `private/identity.json` — **сделай его резервную копию** (вне git): без него новые импорты перестанут
узнавать прежних игроков по account id и будут сопоставлять их по нику.

## Команды

| Команда | Что делает |
|---|---|
| `npm test` | все тесты |
| `npm run validate` | проверка схем и ссылок в `content/` |
| `npm run build` | валидация + пересборка `data/` и `sitemap.xml` |
| `npm run new-tournament -- …` | создать турнир |
| `npm run import -- <id> […]` | импорт регистрации и результатов |
| `npm run suggest-profile -- файл.csv` | черновик профиля новой формы |

Адрес сайта для `sitemap.xml` берётся из `site.json` (сейчас `https://anypedia.vercel.app`), если файла нет, то из `CNAME`. Переменная `SITE_URL` важнее обоих.
