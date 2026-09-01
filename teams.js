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
//    banned  — необязательное поле: если у игрока есть бан от
//              турнирного оператора, укажите лигу и (по желанию) причину:
//                banned: { league: "AnyLvL Community", reason: "Читерство" }
//              Причину можно не указывать — просто league без reason:
//                banned: { league: "AnyLvL Community" }
//              Или совсем коротко, без причины (старый формат тоже работает):
//                banned: "AnyLvL Community"
//              Несколько банов — массивом (можно мешать форматы):
//                banned: [
//                  { league: "AnyLvL Community", reason: "Читерство" },
//                  { league: "Enrage", reason: "Токсичное поведение" },
//                ]
//              На странице игрока появится предупреждение об этом.
//              Если банов нет — поле просто не добавлять.
//  Роль (Carry/Mid/Offlaner/Soft Support/Hard Support) и иконка
//  берутся автоматически из pos (1-5) — отдельно указывать не надо.
// =============================================

const teams = [
    {
  "id": "dragon-blood",
  "name": "Dragon Blood",
  "aliases": ["Dragon Blood", "dragon blood", "DragonBlood"],
  "logo": "dragonblood.png",
  "region": "СНГ",
  "prize": "0₽",
  "telegramLink": "https://t.me/CatsWinner1",
  "captainLink": "https://t.me/Lexa_Krutoii",
  "description": "Основана 23 мая 2026 года. Dragon Blood является переформированием и взятием нового направления другой команды, не связанной с датой, но в краткие сроки коллектив показал свои возможности, и весь фокус сместился на Dota 2, а команда получила нынешнее название.",
  "activeRoster": [
    { "nick": "WHAT IS LOVE", "pos": 1, "joined": "2026-06-16", "photo": "whatislove.png", "country": "ru" },
    { "nick": "Sopelk_i", "pos": 2, "joined": "2026-06-01", "photo": "sopelki.png", "country": "by" },
    { "nick": "hvloh", "pos": 3, "joined": "2026-07-23", "photo": "hvloh.png", "country": "ru" },
    { "nick": "Last Pick Tears", "pos": 4, "joined": "2026-08-02", "photo": "lastpicktears.png", "country": "ru" },
    { "nick": "matbym2", "pos": 5, "joined": "2026-08-01", "photo": "matbym2.png", "country": "ru" }
  ],
  "staff": [
    { "nick": "FraNhesko", "role": "Гендиректор", "joined": "2026-05-23" },
    { "nick": "rwkyy", "role": "SMM", "joined": "2026-07-15" },
    { "nick": "blazzerez", "role": "Дизайнер", "joined": "2026-07-17" },
    { "nick": "Luwak", "role": "Монтажер", "joined": "2026-05-23" }
  ],
  "formerPlayers": [],
  "tournaments": []
},
    {
    id: "sigma-aura",
    name: "sigma aura",
    aliases: ["эмокиды"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "arsenkaban", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "all eyes on me", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "mdk", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "Yooku", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "дробовиктор", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "darkhorse",
    name: "DarkHorse",
    aliases: ["DarkHorse"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "5000₽₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Саша белый prime", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "smith & wesson", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "RAXMED", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "squalor", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "traher", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "2",
        prize: "5.000₽",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "team-horizon-event",
    name: "Team Horizon Event",
    aliases: ["Team Horizon Event"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Дмитрий SWAGBless", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "013DOSTUM", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "german333masochismlnrjbgtfddnrrd", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "Women's kill dota", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "zxcVa", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "inquisitors",
    name: "Inquisitor's",
    aliases: ["Inquisitor's"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Veroi", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "JaDiX", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "iwepgg", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "thorzues", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "Chesign", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "7",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "team-teiko",
    name: "TEIKO",
    aliases: ["TEIKO"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "10000₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Teenwave", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "14.1", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "dissolved", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "darklight", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "zobaa", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "1",
        prize: "10.000₽",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "team-bedlam-battles",
    name: "Team Bedlam Battles",
    aliases: ["Team Bedlam Battles"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "heatolonq", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "Wizard", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "cherepashka", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "p4sechn1k", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "Glamdring〩", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "rakuzan",
    name: "Rakuzan",
    aliases: ["Rakuzan"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "UshirOo", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "4or2na-", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "EgorKing", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "Shiroyami", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "five more hours", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "5",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "xxsonic",
    name: "XXXSonic",
    aliases: ["XXXSonic"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "bla", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "noletmedaem", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "skitzofrenia simulation", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "XXXSonic", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "jlcee", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "5",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "veni-vidi-vici",
    name: "Veni vidi vici",
    aliases: ["Veni vidi vici"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "1tsuyoi1", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "My name is..", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "Pont1k", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "Refwq", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "Soer", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "4",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
  {
    id: "immortal-dragons",
    name: "Immortal Dragons",
    aliases: ["Immortal Dragons"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Dragonay", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "Ruben The Cruel", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "MjejRin", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "Rubistan", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "victory lap", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },
    {
    id: "team-sexy",
    name: "Team Sexy",
    aliases: ["Team Sexy", "team sexy", "Team sexy"],
    logo: "teamsexy.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/teamsexy1",
    captainLink: "https://t.me/aokee1",
    description: "Основана в апреле 2025 года. В январе 2026 года коллектив временно выступал под тегом GOTF Next, однако позже вернулся к своему основному названию.",

    activeRoster: [
      { nick: "danyok", pos: 2, joined: "2025-04-21", photo: "image.png", country: "ru"  }, 
      { nick: "icememory<3", pos: 3, joined: "2025-04-21" , photo: "image.png", country: "ru" },
      { nick: "never", pos: 4, joined: "2026-08-10", photo: "image.png", country: "ru" },
      { nick: "Soer", pos: 5, joined: "2026-08-10", photo: "image.png", country: "ru" }
    ],

    formerPlayers: [
      { nick: "hosh1no愛", pos: 1, joined: "2026-04-21" , left: "2026-06-15", country: "ua" },
      { nick: "Gigo",   pos: 2, joined: "2026-05-18", left: "2026-06-15" },
      { nick: "danilK",    pos: 4, joined: "2026-05-18" , left: "2026-06-15" },
      { nick: "drim", pos: 4, joined: "2025-04-21", left: "2026-01-18", country: "ru"  },
     { nick: "escapist",   pos: 5, joined: "2026-04-21" , left: "2026-06-15" },
    ],

    // Добавляйте турниры вручную.
    // Поле title должно совпадать с названием в data.js — ссылка появится автоматически.
    tournaments: [
        {
        title: "AnyLvL x GOTF eSports Tournament #2",
        date:  "2026-08-22",
        place: "9-11",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
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
      { nick: "cotsu", pos: 1, joined: "2026-05-31" , photo: "image.png", "country": "ru" },
      { nick: "Alisa", pos: 2, joined: "2025-05-14" , photo: "image.png", "country": "ru", banned: { league: "AnyLvL Community", reason: "Систематические оскорбления и уничижительные высказывания в адрес организаторов турнира." } },
      { nick: "popi", pos: 3, joined: "2025-05-14" , photo: "image.png", "country": "ru" },
      { nick: "DarkLight", pos: 4, joined: "2026-05-31" , photo: "image.png", "country": "ru" },
      { nick: "detox", pos: 5, joined: "2026-08-10" , photo: "image.png", "country": "ru" },
    ],
      staff: [
          { nick: "el tivke", role: "Manager", joined: "2026-05-31" }
],
    formerPlayers: [
      { nick: "Teenwave", pos: 1, joined: "2025-05-14", left: "2026-05-31", newTeam: "Barracuda Team"    },
      { nick: "el tivke", pos: 4, joined: "2025-05-14", left: "2026-05-31", newTeam: "LETO Junior (Manager)", "country": "uz"    },
      { nick: "Freak", pos: 5, joined: "2025-05-14", left: "2026-07-28", newTeam: ""    },
      { nick: "ManjaLord", pos: 5, joined: "2025-07-28", left: "2026-09-10", "country": "by"      },
    ],
    tournaments: [
        {
        title: "AnyLvL x GOTF eSports Tournament #2",
        date:  "2026-08-22",
        place: "5-8",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
        {
        title: "SkewerEsports Season 7",
        date:  "2026-08-21",
        place: "3",
        prize: "",
        limit: "До 6.700 MMR на игрока"
      },
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
  "id": "bedlam-red",
  "name": "Bedlam Battle Team Red",
  "aliases": ["Bedlam Battle Team", "Bedlam Red", "Bedlam Battle Team Red"],
  "logo": "bedlamred.png",
  "region": "СНГ",
  "prize": "22.500₽",
  "telegramLink": "https://t.me/bedlambattlesteam",
  "captainLink": "https://t.me/ehevbrfypfrb",
  "description": "Bedlam Battle Team Red (сокращённо — Bedlam Red) — коллектив из СНГ-региона. Состав дебютировал 18 апреля 2026 года на турнире Bedlam Spring Cup, где завоевал первое место, не проиграв ни одного матча. Команда регулярно принимает участие в любительских и полупрофессиональных соревнованиях, постепенно набирая опыт и укрепляя игровой почерк. Bedlam Red объединяет игроков, стремящихся к стабильному прогрессу и новым результатам на региональной сцене.",
  "activeRoster": [
    { "nick": "lonixx", "pos": 1, "joined": "2026-05-30", "photo": "image.png", "country": "ua" },
    { "nick": "imortall_boy", "pos": 2, "joined": "2026-04-18", "photo": "image.png", "country": "ru" },
    { "nick": "edsa1?", "pos": 3, "joined": "2026-04-18", "photo": "image.png", "country": "ru" },
    { "nick": "drim", "pos": 4, "joined": "2026-05-30", "photo": "image.png", "country": "ru" },
    { "nick": "Ariurn", "pos": 5, "joined": "2026-04-18", "photo": "image.png", "country": "ru" }
  ],
  "staff": [
    { "nick": "magikeye", "role": "CEO", "joined": "2026-03-01" },
    { "nick": "edsa1?", "role": "Manager", "joined": "2026-07-15" }
  ],
  "formerPlayers": [
    { "nick": "cotsu", "pos": 1, "joined": "2026-04-18", "left": "2026-05-29", "newTeam": "" },
    { "nick": "marty", "pos": 4, "joined": "2026-04-19", "left": "2026-05-29", "newTeam": "" },
    { "nick": "yomyKo", "pos": 4, "joined": "2026-04-18", "left": "2026-04-19", "newTeam": "" }
  ],
  "tournaments": [
    {
      "title": "Bedlam: First Anniversary Cup",
      "date": "2026-08-07",
      "place": "2",
      "prize": "10.000₽",
      "limit": "До 6.700 MMR на игрока"
    },
    {
      "title": "CL: Rivals",
      "date": "2026-07-19",
      "place": "9-12",
      "prize": "",
      "limit": "До 40.000 MMR на команду"
    },
    {
      "title": "AnyLvL x GOTF eSports: Special 3",
      "date": "2026-07-12",
      "place": "7-8",
      "prize": "",
      "limit": "До 37.500 MMR на команду"
    },
    {
      "title": "Bedlam Spring Cup",
      "date": "2026-04-18",
      "place": "1",
      "prize": "12.500₽",
      "limit": "До 8.500 MMR на игрока"
    },
    {
      "title": "AnyLvL x GOTF eSports Tournament #1",
      "date": "2026-04-19",
      "place": "9-16",
      "prize": "—",
      "limit": "До 35.000 MMR на команду"
    },
    {
      "title": "Bedlam Waiting For Summer Cup",
      "date": "2026-05-31",
      "place": "9-16",
      "prize": "—",
      "limit": "До 35.000 MMR на команду"
    },
    {
      "title": "Bedlam Season 4 Division 1",
      "date": "2026-06-28",
      "place": "13-16",
      "prize": "—",
      "limit": "До 9.000 MMR на игрока"
    }
  ]
},
  {
    id: "never-back-down",
    name: "Never Back Down",
    aliases: ["Never Back Down"],
    logo: "nbdteam.png",
    region: "СНГ",
    prize: "50.500₽",
    telegramLink: "",   // ссылка на группу/канал команды
    captainLink:  "https://t.me/roseofficial_26",   // личный TG капитана для связи
    description: "Киберспортивный коллектив из Восточной Европы. Был основан в 2025 году.",

    activeRoster: [
      { nick: "Kengama",   pos: 1, joined: "2026-08-06" , photo: "image.png", country: "ua" },
      { nick: "Baby, Nice Try",   pos: 2, joined: "2025-11-01" , photo: "image.png", country: "ru" },
      { nick: "m1nd1",   pos: 3, joined: "2026-08-06" , photo: "image.png", country: "ru"  },
      { nick: "Scorp",   pos: 4, joined: "2026-08-03" , photo: "image.png", country: "ua" },
      { nick: "MakeSense",   pos: 4, joined: "2026-08-22" , photo: "image.png", country: "ru" }
    ],

    formerPlayers: [
      { nick: "Rose",   pos: 2, joined: "2025-11-01" , photo: "image.png", country: "ru", left: "2026-08-06"  },
    ],
    tournaments: [
        {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "7",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
        {
        title: "AnyLvL x GOTF eSports Tournament #2",
        date:  "2026-08-22",
        place: "1",
        prize: "10.000₽",
        limit: "До 32.500 MMR на команду"
      },
        {
        title: "SkewerEsports Season 7",
        date:  "2026-08-21",
        place: "1",
        prize: "8.000₽",
        limit: "До 6.700 MMR на игрока"
      },
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
        place: "3",
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

/* ============================================================
   ИГРОКИ — автосборка профилей из activeRoster/formerPlayers
   всех команд выше. Отдельного списка игроков заполнять не нужно —
   страница /player/<id> собирается из тех же данных, что уже есть
   в составах команд.

   Опционально у любого игрока в составе можно добавить aliases,
   если он играл под другими никами — тогда его страница найдётся
   и по старому нику тоже:
     { nick: "aik", pos: 1, joined: "...", aliases: ["Alim", "aikbsp"] }

   Важно: если два РАЗНЫХ реальных человека в разных командах имеют
   ОДИНАКОВЫЙ ник — система схлопнет их в один профиль (совпадение
   по нику = один и тот же игрок). Для дота-ников это редкость, но
   если знаете о таком случае — дайте одному из них уникальный ник
   или используйте aliases, чтобы развести их.
   ============================================================ */

function normPlayerStr(v) {
  return String(v || '').normalize('NFKC').replace(/\s+/g, ' ').trim().toLowerCase();
}

function slugifyPlayer(nick) {
  return String(nick || '').normalize('NFKC').trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'player';
}

/* Собирает единый список игроков по всем командам: одна и та же
   персона (по нику/алиасу) со всех команд схлопывается в один
   профиль с несколькими записями истории (history). */
function getAllPlayers() {
  const byKey = new Map();

  (typeof teams !== 'undefined' ? teams : []).forEach(team => {
    const seasons = [
      { list: team.activeRoster || team.roster || [], active: true },
      { list: team.formerPlayers || [], active: false },
    ];

    seasons.forEach(({ list, active }) => {
      list.forEach(entry => {
        if (!entry.nick) return;
        const key = normPlayerStr(entry.nick);

        if (!byKey.has(key)) {
          byKey.set(key, {
            nick: entry.nick,
            aliases: entry.aliases || [],
            photo: entry.photo || null,
            country: entry.country || null,
            pos: entry.pos,
            banned: [],
            history: [],
          });
        }

        const player = byKey.get(key);
        // Приоритет данным из активных записей — считаем их самыми свежими
        if (active || !player.photo) player.photo = entry.photo || player.photo;
        if (active || !player.country) player.country = entry.country || player.country;
        if (active) player.pos = entry.pos;
        if (entry.aliases && entry.aliases.length) player.aliases = entry.aliases;

        if (entry.banned) {
          const списокБанов = Array.isArray(entry.banned) ? entry.banned : [entry.banned];
          списокБанов.forEach(запись => {
            const бан = typeof запись === 'string'
              ? { league: запись, reason: null }
              : (запись && typeof запись === 'object'
                  ? { league: запись.league || запись.name || '', reason: запись.reason || null }
                  : null);
            if (бан && бан.league && !player.banned.some(b => b.league === бан.league)) {
              player.banned.push(бан);
            }
          });
        }

        player.history.push({
          team,
          pos: entry.pos,
          joined: entry.joined || null,
          left: entry.left || null,
          active,
        });
      });
    });
  });

  byKey.forEach(p => p.history.sort((a, b) => String(a.joined || '').localeCompare(String(b.joined || ''))));

  return [...byKey.values()];
}

function getPlayerId(player) {
  return slugifyPlayer(player.nick);
}

function findPlayerById(id) {
  if (!id) return null;
  return getAllPlayers().find(p => {
    if (slugifyPlayer(p.nick) === id) return true;
    return (p.aliases || []).some(a => slugifyPlayer(a) === id);
  }) || null;
}

/* Турниры игрока — берутся из tournaments КАЖДОЙ команды, за которую
   он играл, отфильтрованные по датам его пребывания в этой команде
   (joined/left). Отдельно вести список турниров на игрока не нужно. */
function getPlayerTournaments(player) {
  const rows = [];
  (player.history || []).forEach(h => {
    (h.team.tournaments || []).forEach(t => {
      const date = t.date || '';
      if (h.joined && date < h.joined) return;
      if (h.left && date > h.left) return;
      rows.push({ ...t, team: h.team, playerPos: h.pos });
    });
  });
  rows.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return rows;
}

/* ============================================================
   РОЛИ И ФЛАГИ — общие для team.js и player.js
   ============================================================ */
/* Роль выводится из позиции (pos), которая уже есть у каждого игрока —
   отдельное поле "role" не нужно. Иконки — свои файлы в корне сайта. */
const РОЛЬ_ПО_ПОЗИЦИИ = {
  1: { icon: 'carry.png',        label: 'Carry' },
  2: { icon: 'mid.png',          label: 'Mid' },
  3: { icon: 'offlane.png',      label: 'Offlaner' },
  4: { icon: 'support.png',      label: 'Soft Support' },
  5: { icon: 'fullsupport.png',  label: 'Hard Support' },
};

/* Флаг из двухбуквенного кода страны (ISO 3166-1 alpha-2): "ua" -> 🇺🇦.
   Ничего не хранить кроме кода — эмодзи-флаг собирается на лету. */
function флагСтраны(код) {
  if (!код || String(код).length !== 2) return '';
  const буквы = String(код).toUpperCase();
  if (!/^[A-Z]{2}$/.test(буквы)) return '';
  return String.fromCodePoint(...[...буквы].map(ch => 127397 + ch.charCodeAt(0)));
}

/* ============================================================
   РЕЙТИНГ КОМАНД — очки за место в турнире, умноженные на вес
   Tier турнира (S/A/B/C из data.js). Ничего заполнять отдельно
   не нужно — считается на лету из team.tournaments + data.js.
   ============================================================ */
const ТИР_ВЕС = { S: 3, A: 2, B: 1.5, C: 1 };

function весТира(tier) {
  const ключ = String(tier || '').trim().toUpperCase();
  return ТИР_ВЕС[ключ] || 0; // без Tier / неизвестный Tier — турнир не учитывается
}

/* "1" -> 100, "5-8" -> берём первое число диапазона (лучший случай) */
function очкиЗаМесто(place) {
  const первое = parseInt(String(place ?? '').split(/[-–]/)[0], 10);
  if (!первое || Number.isNaN(первое)) return 0;
  if (первое === 1) return 100;
  if (первое === 2) return 70;
  if (первое === 3) return 50;
  if (первое === 4) return 35;
  if (первое <= 8) return 20;
  if (первое <= 16) return 10;
  return 5;
}

function рассчитатьРейтингКоманды(team) {
  const списокТурниров = typeof tournaments !== 'undefined' ? tournaments : [];
  let сумма = 0;

  (team.tournaments || []).forEach(запись => {
    const очки = очкиЗаМесто(запись.place);
    if (!очки) return;
    const найденный = списокТурниров.find(t => normPlayerStr(t.title) === normPlayerStr(запись.title));
    const вес = весТира(найденный ? найденный.tier : null);
    if (!вес) return; // без Tier — турнир в рейтинг не идёт
    сумма += очки * вес;
  });

  return Math.round(сумма);
}

/* Все команды с очками, отсортированные по убыванию рейтинга */
function getTeamsRating() {
  return (typeof teams !== 'undefined' ? teams : [])
    .map(team => ({ team, points: рассчитатьРейтингКоманды(team) }))
    .sort((a, b) => b.points - a.points);
}

