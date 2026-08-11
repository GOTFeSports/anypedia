// =============================================
//  Anypedia — Team Data  (teams.js)
//
//  name    — актуальное название команды (заголовок страницы).
//  aliases — старые названия / варианты написания.
//            Если в data.js турнир записан со старым названием,
//            сайт всё равно сделает ссылку на эту команду.
//            Можно массивом: ["HATE RELATE", "Fast and Furious 4"]
//            Или строкой:    "HATE RELATE, Fast and Furious 4"
//
//  КАК ДОБАВИТЬ ТУРНИРЫ КОМАНДЫ:
//  Заполните поле tournaments вручную.
//  team.js найдёт турнир в data.js по названию (title) и
//  автоматически сделает кликабельную ссылку.
//  Название в title должно совпадать с полем title в data.js.
//
//  ПРИМЕР:
//  { title: "Bedlam Battles Season 1", date: "2025-08-23", place: "1", prize: "3000₽", limit: "До Божество 5" }
//
//  АКТИВНЫЙ СОСТАВ (activeRoster) — карточки с фото.
//  У каждого игрока, помимо nick/pos/joined, можно добавить:
//    photo   — имя файла фото в корне сайта, например "aik.jpg".
//              По умолчанию стоит "image.png" — серый плейсхолдер.
//              Просто замените "image.png" на своё имя файла,
//              когда появится реальное фото игрока.
//    country — двухбуквенный код страны (ISO 3166-1 alpha-2),
//              например "ua", "ru", "kz" — соберёт эмодзи-флаг
//              сам, картинку заливать не надо. Поле необязательное,
//              если не указано — флаг просто не показывается.
//  Роль (Carry/Mid/Offlaner/Soft Support/Hard Support) и иконка
//  берутся автоматически из pos (1-5) — отдельно указывать не надо.
// =============================================

const teams = [
    {
    id: "team-sexy",
    name: "Team Sexy",
    aliases: ["Team Sexy", "team sexy", "Team sexy"],
    logo: "teamsexy.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/teamsexy1",
    captainLink: "https://t.me/aokee1",
    description: "Одна из наиболее известных любительских команд СНГ-сцены своего уровня. Основана в апреле 2025 года и за время существования стала победителем и призёром множества турниров, включая соревнования серий AnyLvL, Twin и Enrage. В январе 2026 года коллектив временно выступал под тегом GOTF Next, однако позже вернулся к своему основному названию. Team Sexy сохраняет статус опытной команды с богатой турнирной историей и стабильными результатами.",

    activeRoster: [
      { nick: "danyok", pos: 2, joined: "2025-04-21", photo: "image.png", country: "ru"  }, 
      { nick: "icememory<3", pos: 3, joined: "2025-04-21" , photo: "image.png", country: "ru" },
      { nick: "never", pos: 4, joined: "2026-08-10", photo: "image.png", country: "ru" },
      { nick: "Soer", pos: 5, joined: "2026-08-10", photo: "image.png", country: "ru" }
    ],

    formerPlayers: [
      { nick: "hosh1no愛", pos: 1, joined: "2026-04-21" , left: "2026-06-15" },
      { nick: "Gigo",   pos: 2, joined: "2026-05-18", left: "2026-06-15" },
      { nick: "danilK",    pos: 4, joined: "2026-05-18" , left: "2026-06-15" },
      { nick: "drim", pos: 4, joined: "2025-04-21", left: "2026-01-18" },
     { nick: "escapist",   pos: 5, joined: "2026-04-21" , left: "2026-06-15" },
    ],

    // Добавляйте турниры вручную.
    // Поле title должно совпадать с названием в data.js — ссылка появится автоматически.
    tournaments: [
      {
        title: "Special 3: Closed Qualification",
        date:  "2026-07-05",
        place: "5-8",
        prize: "—",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 2",
        date:  "2025-07-20",
        place: "3",
        prize: "—",
        limit: "Без лимита MMR"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date:  "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
    ]
  },
  {
    id: "gitlz",
    name: "Gitlz",
    aliases: ["Gitlz", "Glitz"],
    logo: "gitlz.png",
    region: "СНГ",
    prize: "15.000₽",
    telegramLink: "",
    captainLink: "https://t.me/puziblinchik96",
    description: "Состав был распущен ориентировочно 9 августа.",
    activeRoster:  [
    ],
    formerPlayers: [
  { nick: "Shiroyami",  pos: 4, joined: "2026-02-21", left: "2024-04-24", newTeam: "" },
  { nick: "breaoutlik", pos: 1, joined: "2026-02-10", left: "2026-08-09", newTeam: "" },
  { nick: "Akama",      pos: 2, joined: "2026-02-21", left: "2026-08-09", newTeam: "" },
  { nick: "Moody",      pos: 3, joined: "2026-01-14", left: "2026-08-09", newTeam: "" },
  { nick: "AstarOtzio", pos: 4, joined: "2026-01-14", left: "2026-08-09", newTeam: "" },
  { nick: "Nico",       pos: 5, joined: "2026-04-24", left: "2026-08-09", newTeam: "" }
],
    tournaments: [
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date:  "2026-07-12",
        place: "7-8",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Swamp Wars",
        date:  "2026-03-29",
        place: "1",
        prize: "5.000₽",
        limit: "До 7.500 MMR на игрока"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date:  "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Spring Cup",
        date:  "2026-04-26",
        place: "8-12",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date:  "2026-05-31",
        place: "1",
        prize: "10.000₽",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "SkewerEsports Season 3",
        date:  "2026-06-21",
        place: "3",
        prize: "—",
        limit: "До 36.500 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "9-12",
        prize: "—",
        limit: "До 9.000 MMR на игрока"
      },
    ]
  },
  {
    id: "leto-junior",
    name: "LETO Junior",
    aliases: ["LETO Junior", "LETO jr", "LETO junior", "Teiko", "TEIKO"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "37.500₽",
    telegramLink: "https://t.me/hakiavota",
    captainLink: "https://t.me/Mikhael16",
    description: "СНГ-команда, ведущая свою историю с 2025 года. Коллектив неоднократно показывает достойные результаты на региональных турнирах и имеет в активе чемпионский титул на AnyLvL x GOTF eSports: Special 2. LETO Junior является одной из заметных молодых команд своей сцены.",
    activeRoster: [
      { nick: "cotsu", pos: 1, joined: "2026-05-31" , photo: "image.png" },
      { nick: "Alisa", pos: 2, joined: "2025-05-14" , photo: "image.png" },
      { nick: "popi", pos: 3, joined: "2025-05-14" , photo: "image.png" },
      { nick: "DarkLight", pos: 4, joined: "2026-05-31" , photo: "image.png" },
      { nick: "ManjaLord", pos: 5, joined: "2026-07-28" , photo: "image.png" },
    ],
      staff: [
          { nick: "el tivke", role: "Manager", joined: "2026-05-31" }
],
    formerPlayers: [
      { nick: "Teenwave", pos: 1, joined: "2025-05-14", left: "2026-05-31", newTeam: "Barracuda Team"    },
      { nick: "el tivke", pos: 4, joined: "2025-05-14", left: "2026-05-31", newTeam: "LETO Junior (Manager)"    },
      { nick: "Freak", pos: 5, joined: "2025-05-14", left: "2026-07-28", newTeam: ""    },
    ],
    tournaments: [
        {
        title: "Bedlam: First Anniversary Cup",
        date:  "2026-08-09",
        place: "3",
        prize: "5.000₽",
        limit: "До 6.700 MMR на игрока"
      },
        {
        title: "SkewerEsports Season 6",
        date:  "2026-08-07",
        place: "3",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
        {
        title: "The Trial of Immortality 7",
        date:  "2026-07-26",
        place: "2",
        prize: "6.000₽",
        limit: "До 35.000 MMR на команду"
      },
        {
        title: "SkewerEsports Season 5",
        date:  "2026-07-24",
        place: "3",
        prize: "",
        limit: "До 38.000 MMR на команду"
      },
      {
        title: "CL: Rivals",
        date:  "2026-07-19",
        place: "1",
        prize: "Подарки от Collector's Shop",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date:  "2026-07-12",
        place: "1",
        prize: "5.000₽",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "SkewerEsports Season 4",
        date:  "2026-07-10",
        place: "1",
        prize: "10.000₽",
        limit: "До 9.000 MMR на игрока"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "2",
        prize: "7.500₽",
        limit: "До 8.000 MMR на игрока"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 2",
        date:  "2025-07-20",
        place: "1",
        prize: "2.000₽",
        limit: "Без лимита"
      },
      {
        title: "Bedlam Swamp Wars",
        date:  "2026-03-29",
        place: "3",
        prize: "2.000₽",
        limit: "До 7.500 MMR на игрока"
      },
      {
        title: "Bedlam Spring Cup",
        date:  "2026-04-26",
        place: "5-6",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Winter Cup: Division 1",
        date:  "2026-02-22",
        place: "5-6",
        prize: "—",
        limit: "До 8500 MMR на игрока"
      },
      {
        title: "Reflection League 4",
        date:  "2026-02-21",
        place: "5-8",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "Reflection League 5",
        date:  "2026-03-22",
        place: "9",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "SkewerEsports Season 1",
        date:  "2026-05-08",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date:  "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Reflection League 1",
        date:  "2026-01-31",
        place: "17-27",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date:  "2026-05-31",
        place: "5-8",
        prize: "",
        limit: "До 35.000 MMR на команду"
      },
    ]
  },
  {
    id: "bedlam-orange",
    name: "Bedlam Battle Team Orange",
    aliases: ["Podosinovik team", "Podosinovik", "Подосиновик", "Podosinoviki", "Bedlam Orange"],
    logo: "bbtorange.png",
    region: "СНГ",
    prize: "8.500₽",
    telegramLink: "https://t.me/podosinovik_dota",
    captainLink: "https://t.me/prokazz_a",
    description: "Команда СНГ-региона, основанная 3 января 2026 года. С момента создания коллектив практически не менял основной состав, что позволило игрокам выстроить хорошее взаимопонимание и командную игру. Наиболее значимым достижением команды стала победа на SkewerEsports Season 1. Podosinovik известна своей стабильностью, сыгранностью и активным участием в региональных турнирах.",
    activeRoster: [
      { nick: "Teenwave",                      pos: 1, joined: "2026-07-17" , photo: "image.png" },
      { nick: "Stimsly",                       pos: 2, joined: "2026-01-03" , photo: "image.png" },
      { nick: "МИШКА МОРГЕН",                  pos: 3, joined: "2026-01-03" , photo: "image.png" },
      { nick: "El Oreshniko del Perú",         pos: 4, joined: "2026-01-03" , photo: "image.png" },
      { nick: "N9lwkA",                        pos: 5, joined: "2026-01-03" , photo: "image.png" },
    ],
    formerPlayers: [
        { nick: "Woods", pos: 1, joined: "2026-06-09", left: "2026-07-13" },
    ],
    tournaments: [
        {
        title: "Bedlam: First Anniversary Cup",
        date:  "2026-08-09",
        place: "9-12",
        prize: "",
        limit: "До 6.700 MMR на игрока"
      },
       {
        title: "CL: Rivals",
        date:  "2026-07-19",
        place: "9-12",
        prize: "",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date:  "2026-07-12",
        place: "5-6",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "3-4",
        prize: "",
        limit: "До 8.000 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 1",
        date:  "2026-05-08",
        place: "1",
        prize: "3.500₽",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Spring Cup",
        date:  "2026-04-26",
        place: "4",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date:  "2026-05-31",
        place: "2",
        prize: "5.000₽",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "SkewerEsports Season 3",
        date:  "2026-06-21",
        place: "3",
        prize: "—",
        limit: "До 36.500 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "9-12",
        prize: "—",
        limit: "До 9.000 MMR на игрока"
      },
    ]
  },
  {
    id: "bedlam-red",
    name: "Bedlam Battle Team Red",
    aliases: ["Bedlam Battle Team", "Bedlam Red", "Bedlam Battle Team Red"],
    logo: "bedlamred.png",
    region: "СНГ",
    prize: "22.500₽",
    telegramLink: "https://t.me/bedlambattlesteam",   // ссылка на группу/канал команды
    captainLink:  "https://t.me/ehevbrfypfrb",   // личный TG капитана для связи
    description: "Bedlam Battle Team Red (сокращённо — Bedlam Red) — коллектив из СНГ-региона. Состав дебютировал 18 апреля 2026 года на турнире Bedlam Spring Cup, где завоевал первое место, не проиграв ни одного матча. Команда регулярно принимает участие в любительских и полупрофессиональных соревнованиях, постепенно набирая опыт и укрепляя игровой почерк. Bedlam Red объединяет игроков, стремящихся к стабильному прогрессу и новым результатам на региональной сцене.",

    activeRoster: [
      { nick: "lonixx",  pos: 1, joined: "2026-05-30" , photo: "image.png" },
      { nick: "imortall_boy",  pos: 2, joined: "2026-04-18" , photo: "image.png" },
      { nick: "relax",  pos: 3, joined: "2026-04-18" , photo: "image.png" },
      { nick: "drim.XVI",  pos: 4, joined: "2026-05-30" , photo: "image.png" },
      { nick: "Ariurn",  pos: 5, joined: "2026-04-18" , photo: "image.png" },
    ],

    formerPlayers: [
      { nick: "cotsu", pos: 1, joined: "2026-04-18", left: "2026-05-29", newTeam: "LASTDANCE"     },
      { nick: "marty", pos: 4, joined: "2026-04-19", left: "2026-05-29", newTeam: ""     },
      { nick: "yomyKo", pos: 4, joined: "2026-04-18", left: "2026-04-19", newTeam: ""     },
    ],

    tournaments: [
        {
        title: "Bedlam: First Anniversary Cup",
        date:  "2026-08-07",
        place: "2",
        prize: "10.000₽",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "CL: Rivals",
        date:  "2026-07-19",
        place: "9-12",
        prize: "",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date:  "2026-07-12",
        place: "7-8",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Spring Cup",
        date:  "2026-04-18",
        place: "1",
        prize: "12.500₽",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date:  "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date:  "2026-05-31",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "13-16",
        prize: "—",
        limit: "До 9.000 MMR на игрока"
      },
    ]
  },
  {
    id: "never-back-down",
    name: "Never Back Down",
    aliases: ["Never Back Down"],
    logo: "nbdteam.png",
    region: "СНГ",
    prize: "32.500₽",
    telegramLink: "",   // ссылка на группу/канал команды
    captainLink:  "https://t.me/roseofficial_26",   // личный TG капитана для связи
    description: "Киберспортивный коллектив из Восточной Европы. Был основан в 2025 году.",

    activeRoster: [
      { nick: "Baby, Nice Try",   pos: 2, joined: "2025-11-01" , photo: "image.png" },
      { nick: "m1nd1",   pos: 3, joined: "2026-05-31" , photo: "image.png" },
    ],

    formerPlayers: [
      
    ],
    tournaments: [
        {
        title: "HATER ZDES` Dota Cup: Season 3 Division 1",
        date:  "2026-08-04",
        place: "7-8",
        prize: "",
        limit: "До 30.000 MMR на команду"
      },
        {
        title: "Bedlam: First Anniversary Cup",
        date:  "2026-08-07",
        place: "1",
        prize: "15.000₽",
        limit: "До 6.700 MMR на игрока"
      },
        {
        title: "SkewerEsports Season 6",
        date:  "2026-08-07",
        place: "1",
        prize: "6.000₽",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "CL: Rivals",
        date:  "2026-07-19",
        place: "13-16",
        prize: "",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date:  "2026-07-12",
        place: "2",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date:  "2026-06-28",
        place: "3-4",
        prize: "",
        limit: "До 8.000 MMR на игрока"
      },
      {
        title: "Bedlam Battles Season 3",
        date:  "2025-11-09",
        place: "1",
        prize: "7.500₽",
        limit: "До 7.000 MMR на игрока"
      },
      {
        title: "Bedlam Winter Cup: Division 1",
        date:  "2026-02-22",
        place: "7-8",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Swamp Wars",
        date:  "2026-03-29",
        place: "5-8",
        prize: "—",
        limit: "До 7.500 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 1",
        date:  "2026-05-08",
        place: "2",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date:  "2026-05-31",
        place: "3",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Christmas Cup",
        date:  "2025-12-14",
        place: "3",
        prize: "4.000₽",
        limit: "До 7.000 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 3",
        date:  "2026-06-21",
        place: "2",
        prize: "—",
        limit: "До 36.500 MMR на команду"
      },
    ]
  },
];
