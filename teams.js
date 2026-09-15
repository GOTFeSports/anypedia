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
    id: "dragon-blood",
    name: "Dragon Blood",
    aliases: [
      "Dragon Blood",
      "dragon blood",
      "DragonBlood"
    ],
    logo: "dragonblood.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/CatsWinner1",
    captainLink: "https://t.me/Lexa_Krutoii",
    description: "Основана 23 мая 2026 года. Dragon Blood является переформированием и взятием нового направления другой команды, не связанной с датой, но в краткие сроки коллектив показал свои возможности, и весь фокус сместился на Dota 2, а команда получила нынешнее название.",

    activeRoster: [
      { nick: "WHAT IS LOVE", pos: 1, joined: "2026-06-16", photo: "whatislove.png", country: "ru" },
      { nick: "Sopelk_i", pos: 2, joined: "2026-06-01", photo: "sopelki.png", country: "by" },
      { nick: "hvloh", pos: 3, joined: "2026-07-23", photo: "hvloh.png", country: "ru" },
      { nick: "Last Pick Tears", pos: 4, joined: "2026-08-02", photo: "lastpicktears.png", country: "ru" },
      { nick: "matbym2", pos: 5, joined: "2026-08-01", photo: "matbym2.png", country: "ru" }
    ],

    staff: [
      { nick: "FraNhesko", role: "Гендиректор", joined: "2026-05-23" },
      { nick: "rwkyy", role: "SMM", joined: "2026-07-15" },
      { nick: "blazzerez", role: "Дизайнер", joined: "2026-07-17" },
      { nick: "Luwak", role: "Монтажер", joined: "2026-05-23" }
    ],

    formerPlayers: [],

    tournaments: []
  },

  {
    id: "emokidy",
    name: "эмокиды",
    aliases: [
      "эмокиды"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "arsenkaban", pos: 1, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [
      { nick: "all eyes on me", pos: 2, joined: "2026-08-30", left: "2026-09-12", newTeam: "" },
      { nick: "mdk", pos: 3, joined: "2026-08-30", left: "2026-09-12", newTeam: "" },
      { nick: "Yooku", pos: 4, joined: "2026-08-30", left: "2026-09-12", newTeam: "" },
      { nick: "дробовиктор", pos: 5, joined: "2026-08-30", left: "2026-09-12", newTeam: "" }
    ],

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
    aliases: [
      "DarkHorse"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "5000₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "Саша Белый Prime", pos: 1, joined: "2026-08-30", photo: "image.png" },
      { nick: "squalor", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "RAXMED", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "all eyes on me", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Traher", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [
      { nick: "smith & wesson", pos: 2, joined: "2026-08-30", left: "2026-09-12", newTeam: "" }
    ],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "13",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
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
    aliases: [
      "Team Horizon Event"
    ],
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
    aliases: [
      "Inquisitor's"
    ],
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
      { nick: "zeo", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Chesign", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [
      { nick: "thorzues", pos: 4, joined: "2026-08-30", left: "2026-09-12", newTeam: "" }
    ],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
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
    id: "team-bedlam-battles",
    name: "Team Bedlam Battles",
    aliases: [
      "Team Bedlam Battles"
    ],
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
      { nick: "pase4n1k", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "Glamdring〩", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
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
    aliases: [
      "Rakuzan"
    ],
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
    aliases: [
      "XXXSonic"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "",
    captainLink: "",
    description: "",

    activeRoster: [
      { nick: "noletmedaem", pos: 2, joined: "2026-08-30", photo: "image.png" },
      { nick: "skitzofrenia simulation", pos: 3, joined: "2026-08-30", photo: "image.png" },
      { nick: "XXXSonic", pos: 4, joined: "2026-08-30", photo: "image.png" },
      { nick: "jlcee", pos: 5, joined: "2026-08-30", photo: "image.png" }
    ],

    formerPlayers: [
      { nick: "bla", pos: 1, joined: "2026-08-30", left: "2026-09-12", newTeam: "" }
    ],

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
    aliases: [
      "Veni vidi vici"
    ],
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
    aliases: [
      "Immortal Dragons"
    ],
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
    aliases: [
      "Team Sexy",
      "team sexy",
      "Team sexy"
    ],
    logo: "teamsexy.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/teamsexy1",
    captainLink: "https://t.me/aokee1",
    description: "Основана в апреле 2025 года. В январе 2026 года коллектив временно выступал под тегом GOTF Next, однако позже вернулся к своему основному названию.",

    activeRoster: [
      { nick: "danyok", pos: 2, joined: "2025-04-21", photo: "image.png", country: "ru" },
      { nick: "never", pos: 4, joined: "2026-08-10", photo: "image.png", country: "ru" },
      { nick: "Soer", pos: 5, joined: "2026-08-10", photo: "image.png", country: "ru" }
    ],

    formerPlayers: [
      { nick: "hosh1no愛", pos: 1, joined: "2026-04-21", left: "2026-06-15", country: "ua" },
      { nick: "Gigo", pos: 2, joined: "2026-05-18", left: "2026-06-15" },
      { nick: "danilK", pos: 4, joined: "2026-05-18", left: "2026-06-15" },
      { nick: "drim", pos: 4, joined: "2025-04-21", left: "2026-01-18", country: "ru" },
      { nick: "escapist", pos: 5, joined: "2026-04-21", left: "2026-06-15" },
      { nick: "icememory<3", pos: 3, joined: "2025-04-21", left: "2026-09-12", newTeam: "" }
    ],

    tournaments: [
      {
        title: "AnyLvL x GOTF eSports Tournament #2",
        date: "2026-08-22",
        place: "9-11",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "Special 3: Closed Qualification",
        date: "2026-07-05",
        place: "5-8",
        prize: "—",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 2",
        date: "2025-07-20",
        place: "3",
        prize: "—",
        limit: "Без лимита MMR"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date: "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      }
    ]
  },

  {
    id: "leto-junior",
    name: "LETO Junior",
    aliases: [
      "LETO Junior",
      "LETO jr",
      "LETO junior",
      "Teiko",
      "TEIKO"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "37.500₽",
    telegramLink: "https://t.me/hakiavota",
    captainLink: "https://t.me/Mikhael16",
    description: "СНГ-команда, ведущая свою историю с 2025 года. Коллектив неоднократно показывает достойные результаты на региональных турнирах и имеет в активе чемпионский титул на AnyLvL x GOTF eSports: Special 2. LETO Junior является одной из заметных молодых команд своей сцены.",

    activeRoster: [
      { nick: "Alisa", pos: 2, joined: "2025-05-14", photo: "image.png", country: "ru", banned: {
        league: "AnyLvL Community",
        reason: "Систематические оскорбления и уничижительные высказывания в адрес организаторов турнира."
      } },
      { nick: "popi", pos: 3, joined: "2025-05-14", photo: "image.png", country: "ru" },
      { nick: "DarkLight", pos: 4, joined: "2026-05-31", photo: "image.png", country: "ru" }
    ],

    staff: [
      { nick: "el tivke", role: "Manager", joined: "2026-05-31" }
    ],

    formerPlayers: [
      { nick: "Teenwave", pos: 1, joined: "2025-05-14", left: "2026-05-31", newTeam: "Barracuda Team" },
      { nick: "el tivke", pos: 4, joined: "2025-05-14", left: "2026-05-31", newTeam: "LETO Junior (Manager)", country: "uz" },
      { nick: "Freak", pos: 5, joined: "2025-05-14", left: "2026-07-28", newTeam: "" },
      { nick: "ManjaLord", pos: 5, joined: "2025-07-28", left: "2026-09-10", country: "by" },
      { nick: "cotsu", pos: 1, joined: "2026-05-31", left: "2026-09-12", newTeam: "" },
      { nick: "detox", pos: 5, joined: "2026-08-10", left: "2026-09-12", newTeam: "" }
    ],

    tournaments: [
      {
        title: "AnyLvL x GOTF eSports Tournament #2",
        date: "2026-08-22",
        place: "5-8",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "SkewerEsports Season 7",
        date: "2026-08-21",
        place: "3",
        prize: "",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "Bedlam: First Anniversary Cup",
        date: "2026-08-09",
        place: "3",
        prize: "5.000₽",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 6",
        date: "2026-08-07",
        place: "3",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "The Trial of Immortality 7",
        date: "2026-07-26",
        place: "2",
        prize: "6.000₽",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "SkewerEsports Season 5",
        date: "2026-07-24",
        place: "3",
        prize: "",
        limit: "До 38.000 MMR на команду"
      },
      {
        title: "CL: Rivals",
        date: "2026-07-19",
        place: "1",
        prize: "Подарки от Collector's Shop",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date: "2026-07-12",
        place: "1",
        prize: "5.000₽",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "SkewerEsports Season 4",
        date: "2026-07-10",
        place: "1",
        prize: "10.000₽",
        limit: "До 9.000 MMR на игрока"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date: "2026-06-28",
        place: "2",
        prize: "7.500₽",
        limit: "До 8.000 MMR на игрока"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 2",
        date: "2025-07-20",
        place: "1",
        prize: "2.000₽",
        limit: "Без лимита"
      },
      {
        title: "Bedlam Swamp Wars",
        date: "2026-03-29",
        place: "3",
        prize: "2.000₽",
        limit: "До 7.500 MMR на игрока"
      },
      {
        title: "Bedlam Spring Cup",
        date: "2026-04-26",
        place: "5-6",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Winter Cup: Division 1",
        date: "2026-02-22",
        place: "5-6",
        prize: "—",
        limit: "До 8500 MMR на игрока"
      },
      {
        title: "Reflection League 4",
        date: "2026-02-21",
        place: "5-8",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "Reflection League 5",
        date: "2026-03-22",
        place: "9",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "SkewerEsports Season 1",
        date: "2026-05-08",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date: "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Reflection League 1",
        date: "2026-01-31",
        place: "17-27",
        prize: "—",
        limit: "Без лимита"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date: "2026-05-31",
        place: "5-8",
        prize: "",
        limit: "До 35.000 MMR на команду"
      }
    ]
  },

  {
    id: "bedlam-red",
    name: "Bedlam Battle Team Red",
    aliases: [
      "Bedlam Battle Team",
      "Bedlam Red",
      "Bedlam Battle Team Red"
    ],
    logo: "bedlamred.png",
    region: "СНГ",
    prize: "22.500₽",
    telegramLink: "https://t.me/bedlambattlesteam",
    captainLink: "https://t.me/ehevbrfypfrb",
    description: "Bedlam Battle Team Red (сокращённо — Bedlam Red) — коллектив из СНГ-региона. Состав дебютировал 18 апреля 2026 года на турнире Bedlam Spring Cup, где завоевал первое место, не проиграв ни одного матча. Команда регулярно принимает участие в любительских и полупрофессиональных соревнованиях, постепенно набирая опыт и укрепляя игровой почерк. Bedlam Red объединяет игроков, стремящихся к стабильному прогрессу и новым результатам на региональной сцене.",

    activeRoster: [
      { nick: "lon1xx", pos: 1, joined: "2026-05-30", photo: "image.png", country: "ua" },
      { nick: "imortall_boy", pos: 2, joined: "2026-04-18", photo: "image.png", country: "ru" },
      { nick: "pǝsɹǝʌǝɹ", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "crew", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Purp1e", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    staff: [
      { nick: "magikeye", role: "CEO", joined: "2026-03-01" },
      { nick: "edsa1?", role: "Manager", joined: "2026-07-15" }
    ],

    formerPlayers: [
      { nick: "cotsu", pos: 1, joined: "2026-04-18", left: "2026-05-29", newTeam: "" },
      { nick: "marty", pos: 4, joined: "2026-04-19", left: "2026-05-29", newTeam: "" },
      { nick: "yomyKo", pos: 4, joined: "2026-04-18", left: "2026-04-19", newTeam: "" },
      { nick: "edsa1?", pos: 3, joined: "2026-04-18", left: "2026-09-12", newTeam: "" },
      { nick: "drim", pos: 4, joined: "2026-05-30", left: "2026-09-12", newTeam: "" },
      { nick: "Ariurn", pos: 5, joined: "2026-04-18", left: "2026-09-12", newTeam: "" }
    ],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "Bedlam: First Anniversary Cup",
        date: "2026-08-07",
        place: "2",
        prize: "10.000₽",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "CL: Rivals",
        date: "2026-07-19",
        place: "9-12",
        prize: "",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date: "2026-07-12",
        place: "7-8",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Spring Cup",
        date: "2026-04-18",
        place: "1",
        prize: "12.500₽",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "AnyLvL x GOTF eSports Tournament #1",
        date: "2026-04-19",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date: "2026-05-31",
        place: "9-16",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date: "2026-06-28",
        place: "13-16",
        prize: "—",
        limit: "До 9.000 MMR на игрока"
      }
    ]
  },

  {
    id: "never-back-down",
    name: "Never Back Down",
    aliases: [
      "Never Back Down"
    ],
    logo: "nbdteam.png",
    region: "СНГ",
    prize: "50.500₽",
    telegramLink: "",
    captainLink: "https://t.me/roseofficial_26",
    description: "Киберспортивный коллектив из Восточной Европы. Был основан в 2025 году.",

    activeRoster: [
      { nick: "Kengama", pos: 1, joined: "2026-08-06", photo: "image.png", country: "ua" },
      { nick: "Baby, Nice Try", pos: 2, joined: "2025-11-01", photo: "image.png", country: "ru" },
      { nick: "Scorp", pos: 4, joined: "2026-08-03", photo: "image.png", country: "ua" },
      { nick: "MakeSense", pos: 4, joined: "2026-08-22", photo: "image.png", country: "ru" }
    ],

    formerPlayers: [
      { nick: "Rose", pos: 2, joined: "2025-11-01", left: "2026-08-06", photo: "image.png", country: "ru" },
      { nick: "m1nd1", pos: 3, joined: "2026-08-06", left: "2026-09-12", newTeam: "" }
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
        date: "2026-08-22",
        place: "1",
        prize: "10.000₽",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "SkewerEsports Season 7",
        date: "2026-08-21",
        place: "1",
        prize: "8.000₽",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "HATER ZDES` Dota Cup: Season 3 Division 1",
        date: "2026-08-04",
        place: "7-8",
        prize: "",
        limit: "До 30.000 MMR на команду"
      },
      {
        title: "Bedlam: First Anniversary Cup",
        date: "2026-08-07",
        place: "1",
        prize: "15.000₽",
        limit: "До 6.700 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 6",
        date: "2026-08-07",
        place: "1",
        prize: "6.000₽",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "CL: Rivals",
        date: "2026-07-19",
        place: "13-16",
        prize: "",
        limit: "До 40.000 MMR на команду"
      },
      {
        title: "AnyLvL x GOTF eSports: Special 3",
        date: "2026-07-12",
        place: "2",
        prize: "",
        limit: "До 37.500 MMR на команду"
      },
      {
        title: "Bedlam Season 4 Division 1",
        date: "2026-06-28",
        place: "3",
        prize: "",
        limit: "До 8.000 MMR на игрока"
      },
      {
        title: "Bedlam Battles Season 3",
        date: "2025-11-09",
        place: "1",
        prize: "7.500₽",
        limit: "До 7.000 MMR на игрока"
      },
      {
        title: "Bedlam Winter Cup: Division 1",
        date: "2026-02-22",
        place: "7-8",
        prize: "—",
        limit: "До 8.500 MMR на игрока"
      },
      {
        title: "Bedlam Swamp Wars",
        date: "2026-03-29",
        place: "5-8",
        prize: "—",
        limit: "До 7.500 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 1",
        date: "2026-05-08",
        place: "2",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Waiting For Summer Cup",
        date: "2026-05-31",
        place: "3",
        prize: "—",
        limit: "До 35.000 MMR на команду"
      },
      {
        title: "Bedlam Christmas Cup",
        date: "2025-12-14",
        place: "3",
        prize: "4.000₽",
        limit: "До 7.000 MMR на игрока"
      },
      {
        title: "SkewerEsports Season 3",
        date: "2026-06-21",
        place: "2",
        prize: "—",
        limit: "До 36.500 MMR на команду"
      }
    ]
  },

  {
    id: "team-helix",
    name: "Team Helix",
    aliases: [
      "Team Helix",
      "team helix",
      "helix"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/notjoke00",
    captainLink: "https://t.me/notjoke00",
    description: "",

    activeRoster: [
      { nick: "remisshka♫♫", pos: 1, joined: "2026-09-04", photo: "image.png" },
      { nick: "Veyro", pos: 2, joined: "2026-09-04", photo: "image.png" },
      { nick: "svamm", pos: 3, joined: "2026-09-04", photo: "image.png" },
      { nick: "?", pos: 4, joined: "2026-09-04", photo: "image.png" },
      { nick: "Look who lost their soul", pos: 5, joined: "2026-09-04", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "1",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "moondie",
    name: "MoonDie",
    aliases: [
      "MoonDie",
      "moondie",
      "Moonlight Temporarily"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/jester_2233",
    captainLink: "https://t.me/jester_2233",
    description: "",

    activeRoster: [
      { nick: "Jester", pos: 1, joined: "2026-09-02", photo: "image.png" },
      { nick: "Nepogreshim", pos: 2, joined: "2026-09-02", photo: "image.png" },
      { nick: "Mode:Кунилингус", pos: 3, joined: "2026-09-02", photo: "image.png" },
      { nick: "Matie", pos: 4, joined: "2026-09-02", photo: "image.png" },
      { nick: "Always be learning", pos: 5, joined: "2026-09-02", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "2",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "shabashka",
    name: "shabashka",
    aliases: [
      "shabashka",
      "Shabashka"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/mindsetduraka",
    captainLink: "https://t.me/mindsetduraka",
    description: "",

    activeRoster: [
      { nick: "k3zo_0", pos: 1, joined: "2026-09-04", photo: "image.png" },
      { nick: "asd", pos: 2, joined: "2026-09-04", photo: "image.png" },
      { nick: "ПК-Боярин", pos: 3, joined: "2026-09-04", photo: "image.png" },
      { nick: "Agression Mode", pos: 4, joined: "2026-09-04", photo: "image.png" },
      { nick: "asmartl", pos: 5, joined: "2026-09-04", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "3",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "low-cortisol",
    name: "low cortisol",
    aliases: [
      "low cortisol",
      "Low Cortisol"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/manshinee",
    captainLink: "https://t.me/manshinee",
    description: "",

    activeRoster: [
      { nick: "enight", pos: 1, joined: "2026-09-04", photo: "image.png" },
      { nick: "курю колосок", pos: 2, joined: "2026-09-04", photo: "image.png" },
      { nick: "@рбу3", pos: 3, joined: "2026-09-04", photo: "image.png" },
      { nick: "demuyo imiru", pos: 4, joined: "2026-09-04", photo: "image.png" },
      { nick: "стас", pos: 5, joined: "2026-09-04", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "4",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "mosquito-gang",
    name: "Mosquito Gang",
    aliases: [
      "Mosquito Gang",
      "mosquito gang",
      "MosquitoGang"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/TrblgodXD",
    captainLink: "https://t.me/TrblgodXD",
    description: "",

    activeRoster: [
      { nick: "opiat", pos: 1, joined: "2026-09-04", photo: "image.png" },
      { nick: "Terriblexd", pos: 2, joined: "2026-09-04", photo: "image.png" },
      { nick: "1gorëkgolodny'", pos: 3, joined: "2026-09-04", photo: "image.png" },
      { nick: "isliks", pos: 4, joined: "2026-09-04", photo: "image.png" },
      { nick: "Miposhika", pos: 5, joined: "2026-09-04", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "5",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "123team",
    name: "123TEAM",
    aliases: [
      "123TEAM",
      "123team",
      "123 Team"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Zxcviperr342",
    captainLink: "https://t.me/Zxcviperr342",
    description: "",

    activeRoster: [
      { nick: "Sunlight", pos: 1, joined: "2026-09-01", photo: "image.png" },
      { nick: "Asma", pos: 2, joined: "2026-09-01", photo: "image.png" },
      { nick: "zxcviperr123", pos: 3, joined: "2026-09-01", photo: "image.png" },
      { nick: "Sarushibai", pos: 4, joined: "2026-09-01", photo: "image.png" },
      { nick: "Mira333", pos: 5, joined: "2026-09-01", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "Yarf Cup x Rampage Championship 1",
        date: "2026-08-13",
        place: "6",
        prize: "",
        limit: "До 5.000 MMR на игрока."
      }
    ]
  },

  {
    id: "kaijo",
    name: "海 常 Kaijo",
    aliases: [
      "海 常 Kaijo"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/dark_light666",
    captainLink: "https://t.me/dark_light666",
    description: "",

    activeRoster: [
      { nick: "dissolved", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "0% Win rate", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "effume", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "darklight", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "zobaa", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "SkewerEsports Season 8",
        date: "2026-08-31",
        place: "1",
        prize: "10.000₽",
        limit: "До 32.500 MMR на команду"
      },
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "13",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "fallen-angels",
    name: "Fallen Angels",
    aliases: [
      "Fallen Angels"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/adragg",
    captainLink: "https://t.me/adragg",
    description: "",

    activeRoster: [
      { nick: "добряк", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "спокойный", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Михаил Галустян", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "KoS", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Pastushok", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "5",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "igroki",
    name: "IGROKI",
    aliases: [
      "IGROKI"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "5.000₽",
    telegramLink: "https://t.me/kftudrkb",
    captainLink: "https://t.me/kftudrkb",
    description: "",

    activeRoster: [
      { nick: "fancul", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Gibson", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "ataraxia", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "mevar", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Abrikos", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "3",
        prize: "5.000₽",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "nemesis-team",
    name: "Nemesis team",
    aliases: [
      "Nemesis team"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/firstdovakin",
    captainLink: "https://t.me/firstdovakin",
    description: "",

    activeRoster: [
      { nick: "Nm", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Exorcism", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Colonel", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "fractal dissonance", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Dovakin-", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "ritashidog",
    name: "ritashidog",
    aliases: [
      "ritashidog"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/ritashi666",
    captainLink: "https://t.me/ritashi666",
    description: "",

    activeRoster: [
      { nick: "OYANARO", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "zxcursed", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "ritashi", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "narasunq", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "дорадура", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "bad-bees-academy",
    name: "Bad Bees Academy",
    aliases: [
      "Bad Bees Academy"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/qxwater",
    captainLink: "https://t.me/qxwater",
    description: "",

    activeRoster: [
      { nick: "anya", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "waterflow", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "prosnulsya", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "gmd", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "CocsmeN", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "team-hqd",
    name: "team HQD",
    aliases: [
      "team HQD"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Yookich1337",
    captainLink: "https://t.me/Yookich1337",
    description: "",

    activeRoster: [
      { nick: "akiyanora", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "kesoshi", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Dima all in", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Yooku", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Origami", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "pylya-team",
    name: "Pylya team",
    aliases: [
      "Pylya team"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Pylya999",
    captainLink: "https://t.me/Pylya999",
    description: "",

    activeRoster: [
      { nick: "dEmon_Grig(Митяй)", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "мозговые заболев", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "hue", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Blooddrunk", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Pylya", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "primal-dance",
    name: "Primal Dance",
    aliases: [
      "Primal Dance"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Racotsu",
    captainLink: "https://t.me/Racotsu",
    description: "",

    activeRoster: [
      { nick: "Cotsu", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "trypak", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "crazy panda", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "detox", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Freak", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "team-zei",
    name: "Team Zei",
    aliases: [
      "Team Zei"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/wata34",
    captainLink: "https://t.me/wata34",
    description: "",

    activeRoster: [
      { nick: "klim", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Бебе", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "английская знать", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "лалеби", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "emostar", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "my",
    name: "МЫ",
    aliases: [
      "МЫ"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/akkamy10",
    captainLink: "https://t.me/akkamy10",
    description: "",

    activeRoster: [
      { nick: "Wallyfoo", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "akkamy", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "mognus", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Qék$Iq", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "legasy", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "my-dear-team",
    name: "my dear team",
    aliases: [
      "my dear team"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/kingofthedarkness1",
    captainLink: "https://t.me/kingofthedarkness1",
    description: "",

    activeRoster: [
      { nick: "Wallyfoo", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "PUSHINKA", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "купитман талант", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Paradox", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "nikdorbaz", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "ka-chow",
    name: "Ka-Chow",
    aliases: [
      "Ka-Chow"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/vanjke",
    captainLink: "https://t.me/vanjke",
    description: "",

    activeRoster: [
      { nick: "бибо", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "ysm~", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "protivniwreqx", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "lancelot", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Hashirama", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "9",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "300-spartancev",
    name: "300 спартанцев",
    aliases: [
      "300 спартанцев"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/okeanmoeynadezhdy",
    captainLink: "https://t.me/okeanmoeynadezhdy",
    description: "",

    activeRoster: [
      { nick: "rain", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "qqs", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "mdk", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "stefanieschoolie", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "дробовиктор", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "bstu-too",
    name: "BSTU_TOO",
    aliases: [
      "BSTU_TOO"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/dsquarel",
    captainLink: "https://t.me/dsquarel",
    description: "",

    activeRoster: [
      { nick: "m0nfreak", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "melody", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "ПИРДУХА", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "ЛАСКАНИЕ БЕЛЬЯ", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "snowflake雪", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "egoisto",
    name: "egoisto",
    aliases: [
      "egoisto"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/m1nd1q",
    captainLink: "https://t.me/m1nd1q",
    description: "",

    activeRoster: [
      { nick: "Bob", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "cnioc", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "M1nd1", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Bedrock", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Krabik", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "5",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "djumanovforever",
    name: "DjumanovForever",
    aliases: [
      "DjumanovForever"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/emelyan221",
    captainLink: "https://t.me/emelyan221",
    description: "",

    activeRoster: [
      { nick: "box", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Sugar Daddy", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "владик чемп", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "son", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "pushin P", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "bociarnia-junior",
    name: "Bociarnia Junior",
    aliases: [
      "Bociarnia Junior"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/ytsuqen",
    captainLink: "https://t.me/ytsuqen",
    description: "",

    activeRoster: [
      { nick: "Saint", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Duel Maister", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Obstacle", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "TheHeroOfLegend", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kapik_pl", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "screenshot-3",
    name: "Screenshot#3",
    aliases: [
      "Screenshot#3"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/kaelsunstride",
    captainLink: "https://t.me/kaelsunstride",
    description: "",

    activeRoster: [
      { nick: "avice mindset", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "KaSu (M Luna)", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kuroi", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Ogre Mogg", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "WASSUPDAWG", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "teambersprout",
    name: "TeamBerSprout",
    aliases: [
      "TeamBerSprout"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/nikdefff",
    captainLink: "https://t.me/nikdefff",
    description: "",

    activeRoster: [
      { nick: "NikDef", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "middiff", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "icememory<3", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "drim", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Komfort1ck", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "7",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "bedlam-blue",
    name: "Bedlam blue",
    aliases: [
      "Bedlam blue"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/tiltexsad",
    captainLink: "https://t.me/tiltexsad",
    description: "",

    activeRoster: [
      { nick: "tiltexs", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "SEMEN_(е)BAKIN", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Edsa1?", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "yomyKo", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "dushn1lych", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "gygy",
    name: "GYGY",
    aliases: [
      "GYGY"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Kashiroox",
    captainLink: "https://t.me/Kashiroox",
    description: "",

    activeRoster: [
      { nick: "психоиспытуемыйгульчеловек№666", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kaplia Malovita", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "sh1dou", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "sumimasen", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Рок-н-роллер", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "13",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "dragfire-ascent",
    name: "DRAGFIRE ASCENT",
    aliases: [
      "DRAGFIRE ASCENT"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/sfgmq",
    captainLink: "https://t.me/sfgmq",
    description: "",

    activeRoster: [
      { nick: "sfg", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "surf粪", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "YERIK", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Rinkakyu", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Denzer", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "mambich-i-4good-igroka",
    name: "mambich и 4good игрока",
    aliases: [
      "mambich и 4good игрока"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/SashokMalishok123",
    captainLink: "https://t.me/SashokMalishok123",
    description: "",

    activeRoster: [
      { nick: "vichiT2800", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Adorise", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "奔跑的狼", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "mambich", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "вампiр ♡", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "blackpink",
    name: "blackpink",
    aliases: [
      "blackpink"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/wieldfm",
    captainLink: "https://t.me/wieldfm",
    description: "",

    activeRoster: [
      { nick: "bla", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "DollBluesVanus", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "FriendlyMatvey52", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "mode 1%", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "it happens", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "argentfive",
    name: "Argentfive",
    aliases: [
      "Argentfive"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/twenty45",
    captainLink: "https://t.me/twenty45",
    description: "",

    activeRoster: [
      { nick: "Twenty", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Arjent_999", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "засланный казачок", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Darkme", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Piupi", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "4",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "newmasterminds",
    name: "NewMasterMinds",
    aliases: [
      "NewMasterMinds"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/blz1k",
    captainLink: "https://t.me/blz1k",
    description: "",

    activeRoster: [
      { nick: "NightKing", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "ZhakentiGod", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Colpaxe", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "yma_", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "BlazeR", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "barni",
    name: "Barni",
    aliases: [
      "Barni"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/core_kira",
    captainLink: "https://t.me/core_kira",
    description: "",

    activeRoster: [
      { nick: "папа доты", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "KoTuk 100kg", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kiyoshi prime", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "мусор", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Гематоген Аптечный", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "mambastiks",
    name: "Mambastiks",
    aliases: [
      "Mambastiks"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/lerc0re",
    captainLink: "https://t.me/lerc0re",
    description: "",

    activeRoster: [
      { nick: "lerc0re", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "flopson", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Sensitive", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "ble$$ed", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kpacka", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "just-chill",
    name: "Just Chill",
    aliases: [
      "Just Chill"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/iamgwm",
    captainLink: "https://t.me/iamgwm",
    description: "",

    activeRoster: [
      { nick: "endWhy?", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "gwm", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Exenity", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "iFruTer", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "L1nr", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "team-spirt",
    name: "team spirt",
    aliases: [
      "team spirt"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/oleg133331",
    captainLink: "https://t.me/oleg133331",
    description: "",

    activeRoster: [
      { nick: "rtd", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "tvty", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "trappin out da war my wrist", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "wsw", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "あなたはすでに死んで", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "team-minion",
    name: "Team Minion",
    aliases: [
      "Team Minion"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/D0nem",
    captainLink: "https://t.me/D0nem",
    description: "",

    activeRoster: [
      { nick: "демон", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Shima~", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Stellar", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Undertacker", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "k-k", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "13",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "gitlz",
    name: "Gitlz",
    aliases: [
      "Gitlz"
    ],
    logo: "gitlz.png",
    region: "СНГ",
    prize: "20.000₽",
    telegramLink: "https://t.me/puziblinchik96",
    captainLink: "https://t.me/puziblinchik96",
    description: "",

    activeRoster: [
      { nick: "E-sim", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Kawasaki", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "xluiss", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Alibi", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Akama", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "1",
        prize: "20.000₽",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "fish-sticks",
    name: "Fish Sticks",
    aliases: [
      "Fish Sticks"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/Pojilaya",
    captainLink: "https://t.me/Pojilaya",
    description: "",

    activeRoster: [
      { nick: "витебаУ", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Tinraz", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "Takini_kun", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Пушистый хвост", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "АндатрА", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "7",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "outsiders",
    name: "Outsiders",
    aliases: [
      "Outsiders"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "10.000₽",
    telegramLink: "https://t.me/comebackisreaI",
    captainLink: "https://t.me/comebackisreaI",
    description: "",

    activeRoster: [
      { nick: "Dest1n_y7", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "Yaggodl", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "D1plodock", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "chervyachok", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "Runninglow17", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "2",
        prize: "10.000₽",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "vmyaso-team",
    name: "VMYASO TEAM",
    aliases: [
      "VMYASO TEAM"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/maloy167",
    captainLink: "https://t.me/maloy167",
    description: "",

    activeRoster: [
      { nick: "Another-", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "~Amore", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "МИСНОЙ ПСЕХОПАТ", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "I look at the stars-私は星を", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "YoungHumancy", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "p1skun4iki",
    name: "p1skun4iki",
    aliases: [
      "p1skun4iki"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/vsevolodk1",
    captainLink: "https://t.me/vsevolodk1",
    description: "",

    activeRoster: [
      { nick: "Жорик", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "ssswag", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "darkmaga", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "qwe", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "arkes", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  },

  {
    id: "rozen",
    name: "rozen",
    aliases: [
      "rozen"
    ],
    logo: "dota2.png",
    region: "СНГ",
    prize: "0₽",
    telegramLink: "https://t.me/emohaise",
    captainLink: "https://t.me/emohaise",
    description: "",

    activeRoster: [
      { nick: "haise", pos: 1, joined: "2026-09-12", photo: "image.png" },
      { nick: "GGlimmie", pos: 2, joined: "2026-09-12", photo: "image.png" },
      { nick: "foidslayer333", pos: 3, joined: "2026-09-12", photo: "image.png" },
      { nick: "Arlekin", pos: 4, joined: "2026-09-12", photo: "image.png" },
      { nick: "rei", pos: 5, joined: "2026-09-12", photo: "image.png" }
    ],

    formerPlayers: [],

    tournaments: [
      {
        title: "AnyLvL × Bedlam: COLLISION",
        date: "2026-09-13",
        place: "",
        prize: "",
        limit: "До 32.500 MMR на команду"
      }
    ]
  }
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
