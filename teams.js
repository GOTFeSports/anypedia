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
    id: "emokidy",
    name: "эмокиды",
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
    id: "sigma-aura",
    name: "sigma aura",
    aliases: ["DarkHorse"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "5000₽",
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
    telegramLink: "",
    captainLink:  "https://t.me/roseofficial_26",
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

  /* ============================================================
     НОВЫЕ КОМАНДЫ — Yarf Cup x RAMPAGE 5x5 (регистрация из Excel)
     Дата турнира: 2026-08-13
     ============================================================ */

  {
    id: "elpatron-team",
    name: "ElPatron Team",
    aliases: ["ElPatron Team", "ElPatron"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/asxab777ko",
    description: "",
    activeRoster: [
      { nick: "den4ik6070", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "dxilz322", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "kritomaev812", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "1hatefoids333", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "cvxsd", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "btv-kstati",
    name: "бтв кстати",
    aliases: ["бтв кстати"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/mozaratell",
    description: "",
    activeRoster: [
      { nick: "skimo", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "kLen", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "mozaratell", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Yui", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "R0z3tk4", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "lowskillsteam",
    name: "LowSkillsTeam",
    aliases: ["LowSkillsTeam", "LowSkills"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/DolbilaPL",
    description: "",
    activeRoster: [
      { nick: "Iseedeadp3ople雨1337<3", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "shapaclyack", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "akvariz", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Karma", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "из вращенец", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "17",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "halalteam",
    name: "HalalTeam",
    aliases: ["HalalTeam", "Halal Team"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/kitem_s",
    description: "",
    activeRoster: [
      { nick: "мыколайчик", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Сургутский зверь", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "КР0В0ЖАДНАЯ ПNЯВКА", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "брабус", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "﷽﷽﷽", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "9",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "m5-team",
    name: "M5 Team",
    aliases: ["M5 Team", "M5"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/SypermegaJestkiy",
    description: "",
    activeRoster: [
      { nick: "Hik1kamori", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Fustizee", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Foxik Toxic:3", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Insone", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Vinchaizeee", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [
      { nick: "VSG", pos: 5, joined: "2026-08-13", left: "2026-08-13" }
    ],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "21",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "bugoyatnik",
    name: "BUGOYATNIK",
    aliases: ["BUGOYATNIK"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/SaidRU1378",
    description: "",
    activeRoster: [
      { nick: "zverrrina", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "karmnxy", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "said_aliev", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "skatovan", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "momiko2", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "33",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-netix",
    name: "TEAM NETIX",
    aliases: ["TEAM NETIX", "Team Netix", "NETIX"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/watashi92",
    description: "",
    activeRoster: [
      { nick: "WatashiGOAT", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Usomiya", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Crazy_Meat", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "WEIZZ", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "NTX-H5R854", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "13",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "expo",
    name: "Expo",
    aliases: ["Expo"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/TOPOHTOTOKYO",
    description: "",
    activeRoster: [
      { nick: "Yatorodog812", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "rouusahh", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "motik", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "morf", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "hamatowi", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "37",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-barni",
    name: "Team Барни",
    aliases: ["Team Барни", "Team Barni", "Барни"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/cvvqwrw",
    description: "",
    activeRoster: [
      { nick: "worthless", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Seneck", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Koner_66", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Hadouken", pos: 5, joined: "2026-08-13", photo: "image.png" },
      { nick: "Veyro", pos: 6, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [
      { nick: "ars1k", pos: 2, joined: "2026-08-13", left: "2026-08-13", newTeam: "Моggilev" },
      { nick: "D1rector", pos: 3, joined: "2026-08-13", left: "2026-08-13" }
    ],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "37",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "123team",
    name: "123TEAM",
    aliases: ["123TEAM", "123 Team"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Zxcviperr342",
    description: "",
    activeRoster: [
      { nick: "Sunlight", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Asma", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "zxcviperr123", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Sarushibai", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Mira333", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-feeders",
    name: "Team Feeders",
    aliases: ["Team Feeders", "Feeders"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/bombaclatnaruto",
    description: "",
    activeRoster: [
      { nick: "алим", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Jopa", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "halal gangsta", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "hawai", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "перега пират", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "9",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "popka",
    name: "popka",
    aliases: ["popka"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/emilkleaplse",
    description: "",
    activeRoster: [
      { nick: "ilussion666", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "arturka", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Py", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "fek", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Вселенный Ебатель", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "21",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-pomar",
    name: "Team Pomar",
    aliases: ["Team Pomar", "Pomar"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/wehety",
    description: "",
    activeRoster: [
      { nick: "wehety", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "ICE7ifz", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Messmer", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "мішаня лізун", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Прохор", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "33",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "moondie",
    name: "MoonDie",
    aliases: ["MoonDie", "Moonlight Temporarily", "Moonlight"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/jester_2233",
    description: "",
    activeRoster: [
      { nick: "Jester", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Nepogreshim", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Mode:Кунилингус", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Matie", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Always be learning", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "true-form",
    name: "True Form",
    aliases: ["True Form"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/etanarutsukuyomi",
    description: "",
    activeRoster: [
      { nick: "yatoro mode all mute 1x9", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "1x9 all muted ghoul mode//", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Hakuro", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "13kaiser mode37", pos: 4, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [
      { nick: "Miposhika", pos: 5, joined: "2026-08-13", left: "2026-08-13", newTeam: "Mosquito Gang" }
    ],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "13",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-spirt",
    name: "team spirt",
    aliases: ["team spirt", "Team Spirt"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/unquaru",
    description: "",
    activeRoster: [
      { nick: "unquaru", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "gothviolence", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "МясноеБезумие35см", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "wwwdnsf", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "shailiges", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "37",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-spilis",
    name: "Team Spilis",
    aliases: ["Team Spilis", "Spilis"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/extandworldwidewanted",
    description: "",
    activeRoster: [
      { nick: "Heilrake", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "idontwannawakeupinkai", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "sex n words ex", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Кормящий папа", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Cruestaxx^^", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "17",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "l2-hunters",
    name: "l2 hunters",
    aliases: ["l2 hunters", "L2 Hunters"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/fujinoyamaa",
    description: "",
    activeRoster: [
      { nick: "forkids", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "effondre", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "zodiak", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "fujinoyama", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "nov", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "29",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "wb-team",
    name: "WB Team",
    aliases: ["WB Team", "WB"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/DurckA79",
    description: "",
    activeRoster: [
      { nick: "0 mistakes", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "h.hoshii", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Kyretexx", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "DurckA79", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Api", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "uncrowned-kings",
    name: "Uncrowned Kings",
    aliases: ["Uncrowned Kings", "Uncrowned"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/inscpector",
    description: "",
    activeRoster: [
      { nick: "parker", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "animegirl666", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Acne", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "zxc дальнобойщик♥", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Вовчик", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-hbi",
    name: "Team HBI",
    aliases: ["Team HBI", "HBI"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/N1ghtSoul89",
    description: "",
    activeRoster: [
      { nick: "Yurnex", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "N1ghtSoul", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Borik", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "no_name", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Really?", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "29",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-ykb",
    name: "Team YKB",
    aliases: ["Team YKB", "YKB"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/in333dw333d",
    description: "",
    activeRoster: [
      { nick: "badabam0", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Young~", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "кучерявый", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "achiles blake", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "KuniMaster", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "17",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "shabashka",
    name: "shabashka",
    aliases: ["shabashka"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/mindsetduraka",
    description: "",
    activeRoster: [
      { nick: "k3zo_0", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "asd", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "ПК-Боярин", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Agression Mode", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "asmartl", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "mosquito-gang",
    name: "Mosquito Gang",
    aliases: ["Mosquito Gang", "Mosquito"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/TrblgodXD",
    description: "",
    activeRoster: [
      { nick: "opiat", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Terriblexd", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "1gorëkgolodny'", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "isliks", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Miposhika", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "openai-team",
    name: "OpenAI Team",
    aliases: ["OpenAI Team", "OpenAI"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/idealichh",
    description: "",
    activeRoster: [
      { nick: "Will Smith", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "vc", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "пуллапнул+профитнул", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "OpenAI (Bot 3)", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "semka71", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "25",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "moggilev",
    name: "Моggilev",
    aliases: ["Моggilev", "Moggilev", "Могилев"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Iszoox1",
    description: "",
    activeRoster: [
      { nick: "loser", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "1szoox1", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "monster", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "cheesecake", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "мен падышамын", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "33",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "team-helix",
    name: "Team Helix",
    aliases: ["Team Helix", "Helix"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/notjoke00",
    description: "",
    activeRoster: [
      { nick: "remisshka♫♫", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Veyro", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "svamm", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "?", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Look who lost their soul", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "cp-esportz-j",
    name: "CP_EsportZ.J",
    aliases: ["CP_EsportZ.J", "CP EsportZ"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Pokorutel",
    description: "",
    activeRoster: [
      { nick: "poopeater", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Шu6аPu_Nз_ВеН", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "Necromaster", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "отсоси мне дура", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Pokorutel", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "21",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "poluostrov-taymyr",
    name: "Полуостров Таймыр",
    aliases: ["Полуостров Таймыр", "Таймыр"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/trykn_tanic",
    description: "",
    activeRoster: [
      { nick: "Бабушкина ерунда", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "afraid", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "(PT)Ради Сахарка", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Будильник", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "SDeLaL_Sam66", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "25",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "pantera-team",
    name: "pantera team",
    aliases: ["pantera team", "Pantera Team"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/internetgodf0",
    description: "",
    activeRoster: [
      { nick: "Case7r", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "internetgodf", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "2016", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "pivo", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "нюша", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "21",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "ochen-bolshaya-igra",
    name: "очень большая игра",
    aliases: ["очень большая игра", "Большая игра"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/F4SCINAT0R",
    description: "",
    activeRoster: [
      { nick: "СЕРЁГА ПИСКАРЬ", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "mybloodyvalentine", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "большая игра", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Lorenof mindset", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "ЖOПOЛИЗ CEMИKЛACCHИKOB", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "13",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "meowwknight",
    name: "meowwknight",
    aliases: ["meowwknight"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/hdhdjeksj223",
    description: "",
    activeRoster: [
      { nick: "noawakemonkey", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "vertigaa", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "JETIX", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "b3br1na", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "xxxumera", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "33",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "1kmonsters",
    name: "1KMONSTERS",
    aliases: ["1KMONSTERS", "1K Monsters"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Costolet",
    description: "",
    activeRoster: [
      { nick: "kaoru", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Kirya", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "wWalter", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "лабуба", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "охота крепкая", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "29",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "silent-gaming",
    name: "Silent gaming",
    aliases: ["Silent gaming", "Silent Gaming"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/fric1489",
    description: "",
    activeRoster: [
      { nick: "totalfoiddestraction", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "nikushimi", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "сучара2010", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "ананасы ем", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "Archkazar", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "17",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "denis-dobryy",
    name: "Денис Добрый",
    aliases: ["Денис Добрый", "Denis Dobry"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/newermore01",
    description: "",
    activeRoster: [
      { nick: "1788014697", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "1465768727", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "729179835", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "772894849", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "1914837124", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "moonlight",
    name: "Moonlight",
    aliases: ["Moonlight"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Ya_Vas_Pon372",
    description: "",
    activeRoster: [
      { nick: "pamedor", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "Nikrón", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "3000 миль дo рaя.", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "yes, i deimos", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "</tatsumi>", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "13",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "kilka-squad",
    name: "Kilka_squad",
    aliases: ["Kilka_squad", "Kilka Squad"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/Nzxcay",
    description: "",
    activeRoster: [
      { nick: "hoshi basisya", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "kilka", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "kaneki ken", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "Целуй ножки", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "имбирь", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "29",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },
  {
    id: "low-cortisol",
    name: "low cortisol",
    aliases: ["low cortisol"],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "https://t.me/manshinee",
    description: "",
    activeRoster: [
      { nick: "enight", pos: 1, joined: "2026-08-13", photo: "image.png" },
      { nick: "курю колосок", pos: 2, joined: "2026-08-13", photo: "image.png" },
      { nick: "@рбу3", pos: 3, joined: "2026-08-13", photo: "image.png" },
      { nick: "demuyo imiru", pos: 4, joined: "2026-08-13", photo: "image.png" },
      { nick: "стас", pos: 5, joined: "2026-08-13", photo: "image.png" }
    ],
    formerPlayers: [],
    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
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
const РОЛЬ_ПО_ПОЗИЦИИ = {
  1: { icon: 'carry.png',        label: 'Carry' },
  2: { icon: 'mid.png',          label: 'Mid' },
  3: { icon: 'offlane.png',      label: 'Offlaner' },
  4: { icon: 'support.png',      label: 'Soft Support' },
  5: { icon: 'fullsupport.png',  label: 'Hard Support' },
};

function флагСтраны(код) {
  if (!код || String(код).length !== 2) return '';
  const буквы = String(код).toUpperCase();
  if (!/^[A-Z]{2}$/.test(буквы)) return '';
  return String.fromCodePoint(...[...буквы].map(ch => 127397 + ch.charCodeAt(0)));
}

/* ============================================================
   РЕЙТИНГ КОМАНД
   ============================================================ */
const ТИР_ВЕС = { S: 3, A: 2, B: 1.5, C: 1 };

function весТира(tier) {
  const ключ = String(tier || '').trim().toUpperCase();
  return ТИР_ВЕС[ключ] || 0;
}

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
    if (!вес) return;
    сумма += очки * вес;
  });

  return Math.round(сумма);
}

function getTeamsRating() {
  return (typeof teams !== 'undefined' ? teams : [])
    .map(team => ({ team, points: рассчитатьРейтингКоманды(team) }))
    .sort((a, b) => b.points - a.points);
}
