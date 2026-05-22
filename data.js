// =============================================
//  Anypedia — Tournament Data
//  Добавьте startTime в формате "HH:MM" для
//  отображения таймера обратного отсчёта.
// =============================================

const tournaments = [
    {
    id: "AnyLvL-GOTF-Special-1",
    title: "AnyLvL x GOTF eSports: Special 1",
    limit: "Без лимита MMR",
    start: "2025-05-16",
    end: "2025-05-18",
    startTime: "20:00",
    prize: "1.000₽",
    location: "СНГ",
    teams: 8,
    winner: "Eaters of Fear",
    format: "Group Stage + Playoffs",
    organizer: "AnyLvL Community x GOTF eSports",
    
    teamsList: [
        { name: "Eaters of Fear", logo: "dota2.png", roster: [ { nick: "Mangekyo", pos: 1 }, { nick: "sochnik", pos: 2 }, { nick: "5letvmesto4", pos: 3 }, { nick: "Ya бубуин", pos: 4 }, { nick: "Nikitos99610", pos: 5 } ] },
        { name: "ЧВК Литэнерджи", logo: "dota2.png", roster: [ { nick: "XKSilens", pos: 1 }, { nick: "pirozhok", pos: 2 }, { nick: "Rodidjan", pos: 3 }, { nick: "РОМАНТАЙГЕР", pos: 4 }, { nick: "Voronltf", pos: 5 } ] },
        { name: "GOTF Junior", logo: "dota2.png", roster: [ { nick: "Wakai_oji", pos: 1 }, { nick: "radortep", pos: 2 }, { nick: "leha_shellby", pos: 3 }, { nick: "chernisvin", pos: 4 }, { nick: "navernopystoi", pos: 5 } ] },
        { name: "Teiko", logo: "dota2.png", roster: [ { nick: "Merlinz", pos: 1 }, { nick: "gibkiy48", pos: 2 }, { nick: "workwap", pos: 3 }, { nick: "Импульсивный", pos: 4 }, { nick: "furer1488", pos: 5 } ] },
        { name: "HATE RELATE", logo: "dota2.png", roster: [ { nick: "₣άℓℓℯℕ_ȴø℣e", pos: 1 }, { nick: "azutive", pos: 2 }, { nick: "ewik__01", pos: 3 }, { nick: "osmann_osmanov", pos: 4 }, { nick: "Parasiu", pos: 5 } ] },
        { name: "Feed & Win", logo: "dota2.png", roster: [ { nick: "holger9325", pos: 1 }, { nick: "diphenhydramine_", pos: 2 }, { nick: "duffmen", pos: 3 }, { nick: "pomudorca", pos: 4 }, { nick: "danillllllllll", pos: 5 } ] },
        { name: "Ouroboros team", logo: "dota2.png", roster: [ { nick: "karozia", pos: 1 }, { nick: "MADRIDMOSKOW", pos: 2 }, { nick: "kyrome", pos: 3 }, { nick: "tepji13", pos: 4 }, { nick: "Vortexsssxd", pos: 5 } ] },
        { name: "Team Recruits", logo: "dota2.png", roster: [ { nick: "roman_zach", pos: 1 }, { nick: "человек", pos: 2 }, { nick: "yamaxaebal", pos: 3 }, { nick: "REL", pos: 4 }, { nick: "Viges?", pos: 5 } ] }
    ],
    
    casters: [
        { name: "Paradox Pog", link: "https://www.twitch.tv/paradox_pog" }
    ],
    
    bracketEmbed: "https://docs.google.com/spreadsheets/d/1OdmXDorvwPrqbXUpgeu5jzhlHHmomla5OWa3R2V3TnI/edit?gid=315794023#gid=315794023",
    registrationLink: "",
    telegramLink: "https://t.me/gotf_dota",
    
    description: "AnyLvL x GOTF eSports: Special №1 — пригласительный турнир 8 команд. Формат: Elimination Draft (нельзя повторять героев в рамках одной серии). Даты: 16–18 мая 2025. Групповой этап + плей-офф.",
    
    prizePool: [
        { place: 1, amount: "1.000₽", team: "Eaters of Fear" },
    ]
},
    {
    id: "AnyLvL-GOTF-Special-2",
    title: "AnyLvL x GOTF eSports: Special 2",
    limit: "Без лимита MMR",
    start: "2025-07-18",
    end: "2025-07-20",
    startTime: "18:00",
    prize: "3.000₽",
    location: "СНГ",
    teams: 8,
    winner: "TEIKO",
    format: "Swiss Stage + Playoffs",
    organizer: "AnyLvL Community x GOTF eSports",
    
    teamsList: [
        { name: "TEIKO", logo: "dota2.png", roster: [ { nick: "Rinkuxa", pos: 5 }, { nick: "sooqa", pos: 2 }, { nick: "kriptt", pos: 3 }, { nick: "Teenwave", pos: 1 }, { nick: "El Tivke", pos: 4 } ] },
        { name: "ЧВК \"ЛитЭнерджи\"", logo: "dota2.png", roster: [ { nick: "-_-VITALIK-_-2-2-8", pos: 1 }, { nick: "ананист2009", pos: 2 }, { nick: "0_0 SHERIF 0_0", pos: 3 }, { nick: "Дядя Вова", pos: 4 }, { nick: "VoronLTF", pos: 5 } ] },
        { name: "GOTF junior", logo: "dota2.png", roster: [ { nick: "Паджик", pos: 5 }, { nick: "Shadow4ik", pos: 2 }, { nick: "Wakai_ōji", pos: 1 }, { nick: "accumulation", pos: 3 }, { nick: "xxelts", pos: 4 } ] },
        { name: "Feed & Win", logo: "dota2.png", roster: [ { nick: "Duffmen", pos: 3 }, { nick: "ПРОСТО КНЯЗЬ", pos: 5 }, { nick: "Qqold", pos: 2 }, { nick: "BETman", pos: 1 }, { nick: "33kid", pos: 4 } ] },
        { name: "team sexy", logo: "dota2.png", roster: [ { nick: "danyok", pos: 2 }, { nick: "icememory<3", pos: 3 }, { nick: "Drim", pos: 4 }, { nick: "Face Your Fate", pos: 1 }, { nick: "21blessed", pos: 5 } ] },
        { name: "Fast & Furious 4", logo: "dota2.png", roster: [ { nick: "haginsson", pos: 1 }, { nick: "azutive", pos: 2 }, { nick: "leha_shellby", pos: 3 }, { nick: "saviorofgothxm", pos: 4 }, { nick: "gold1ck", pos: 5 } ] },
        { name: "99problems", logo: "dota2.png", roster: [ { nick: "HblTuK_", pos: 2 }, { nick: "MantiCForev", pos: 1 }, { nick: "Shari’s", pos: 3 }, { nick: "ovvllvks", pos: 4 }, { nick: "TANK", pos: 5 } ] },
        { name: "fractal hornes", logo: "dota2.png", roster: [ { nick: "shard", pos: 1 }, { nick: "m1ffics", pos: 5 }, { nick: "Jesuz", pos: 3 }, { nick: "Watashi", pos: 2 }, { nick: "Виталик Ухылант", pos: 4 } ] }
    ],
    
    casters: [
        { name: "Paradox Pog", link: "https://www.twitch.tv/paradox_pog" }
    ],
    
    bracketEmbed: "",
    registrationLink: "",
    telegramLink: "https://t.me/gotf_dota",
    
    description: "AnyLvL x GOTF eSports: Special 2 — пригласительный турнир 8 команд. Формат: Elimination Draft (в одной серии нельзя повторять героев). Призовой фонд 3000₽. Даты проведения: 18–20 июля 2025.",
    
    prizePool: [
        { place: 1, amount: "2.000₽", team: "TEIKO" },
        { place: 2, amount: "1.000₽", team: "ЧВК \"ЛитЭнерджи\"" }
    ]
},

  {
    id: "SkewerEsports-Season-2",
    title: "SkewerEsports Season 2",
    limit: "До 8.500 на игрока",
    start: "2026-05-29",
    end: "2026-05-31",
    startTime: "18:00", // МСК — время старта для таймера
    prize: "6.500₽",
    location: "СНГ",
    teams: 16,
    winner: "TBD",
    format: "Swiss",
    organizer: "SkewerEsports",
    teamsList: [
      {
        name: "DRAGFIRE ASCENT",
        logo: "dota2.png",
        roster: [
          { nick: "Akame",       pos: 1 },
          { nick: "Shima~",      pos: 2 },
          { nick: "CollapseMini",pos: 3 },
          { nick: "splitta",     pos: 4 },
          { nick: "LegasY221",   pos: 5 }
        ]
      }
    ],
    casters: [
      { name: "TBD", link: "" }
    ],
    bracketEmbed: "",
    registrationLink: "https://docs.google.com/forms/d/1AOPnhM_jFYUyFw3BUeo6k9FE_l-VBqVLXns_P8DtVpY/edit",
    telegramLink: "https://t.me/SkewerEsports",
    description: "SkewerEsports Dota 2 — онлайн-турнир, 5×5, Swiss system (bo1, финал bo3), лимит 8500 MMR, призовой фонд 6500₽ (1 место — 4500₽, 2 место — 2000₽). Даты: 29–31 мая. Взнос 500₽ с команды, макс. 16 команд (при <14 команд турнир отменяется). Требуется регистрация, регламент, подписка на Telegram и присутствие на Discord-сервере.",
    prizePool: [
      { place: 1, amount: "4.500₽", team: "TBD" },
      { place: 2, amount: "2.000₽", team: "TBD" }
    ]
  },

  {
    id: "SkewerEsports-Season-1",
    title: "SkewerEsports Season 1",
    limit: "До 35.000 на команду",
    start: "2026-05-07",
    end: "2026-05-08",
    startTime: "18:00",
    prize: "4.000₽",
    location: "СНГ",
    teams: 16,
    winner: "Podosinoviki",
    format: "Single Elimination",
    organizer: "SkewerEsports",
    teamsList: [
      { name: "DRAGFIRE ASCENT",   logo: "dota2.png", roster: [ { nick: "heatolonq", pos: 1 }, { nick: "Shima~", pos: 2 }, { nick: "CollapseMini", pos: 3 }, { nick: "splitta", pos: 4 }, { nick: "LegasY221", pos: 5 } ] },
      { name: "Вятские Соколы",    logo: "dota2.png", roster: [ { nick: "Mandarin", pos: 1 }, { nick: "Shinra-bansho", pos: 2 }, { nick: "True", pos: 3 }, { nick: "аввацафца", pos: 4 }, { nick: "Ostrye lezviya", pos: 5 } ] },
      { name: "OASIS KNRTU 2",     logo: "dota2.png", roster: [ { nick: "Rimma", pos: 1 }, { nick: "2016", pos: 2 }, { nick: "321", pos: 3 }, { nick: "86", pos: 4 }, { nick: "NEGIBATOR", pos: 5 } ] },
      { name: "Utilsbore Team",    logo: "dota2.png", roster: [ { nick: "Hello_pippo", pos: 1 }, { nick: "ДЯДЯ КОЛЯ66б", pos: 2 }, { nick: "Сабилька", pos: 3 }, { nick: "Farzca777", pos: 4 }, { nick: "Dessay", pos: 5 } ] },
      { name: "ANTISOCIAL",        logo: "dota2.png", roster: [ { nick: "ap4t1ya", pos: 1 }, { nick: "cxcxcxcx", pos: 2 }, { nick: "Cl0wn", pos: 3 }, { nick: "Fnu4", pos: 4 }, { nick: "Ａｆａｒｉl", pos: 5 } ] },
      { name: "Barracuda Team",    logo: "dota2.png", roster: [ { nick: "goth angel", pos: 1 }, { nick: "DanilkaAbed", pos: 2 }, { nick: "Jealous", pos: 3 }, { nick: "yltra", pos: 4 }, { nick: "zobaa", pos: 5 } ] },
      { name: "Рыбаки",            logo: "dota2.png", roster: [ { nick: "Подберезовик", pos: 1 }, { nick: "вашего叔父", pos: 2 }, { nick: "apathy2k", pos: 3 }, { nick: "Honiatu", pos: 4 }, { nick: "Prime", pos: 5 } ] },
      { name: "zxc players",       logo: "dota2.png", roster: [ { nick: "absolut", pos: 1 }, { nick: "ягодичный парикм", pos: 2 }, { nick: "-_-", pos: 3 }, { nick: "Dima Kulak Bicuha", pos: 4 }, { nick: "NotChag", pos: 5 } ] },
      { name: "VHS Team",          logo: "dota2.png", roster: [ { nick: "Саша Белый Prime", pos: 1 }, { nick: "MIA", pos: 2 }, { nick: "Raikiri-", pos: 3 }, { nick: "Weekend", pos: 4 }, { nick: "yleuvyu", pos: 5 } ] },
      { name: "LETO jr",           logo: "dota2.png", roster: [ { nick: "Teenwave", pos: 1 }, { nick: "Alisa", pos: 2 }, { nick: "popi", pos: 3 }, { nick: "el tivke", pos: 4 }, { nick: "UZBEKSILA", pos: 5 } ] },
      { name: "Never Back Down",   logo: "dota2.png", roster: [ { nick: "Лысый", pos: 1 }, { nick: "Baby, Nice Try", pos: 2 }, { nick: "Кэп", pos: 3 }, { nick: "Rose", pos: 4 }, { nick: "Błyskawica", pos: 5 } ] },
      { name: "Primal Dance",      logo: "dota2.png", roster: [ { nick: "cotsu", pos: 1 }, { nick: "m33pmap", pos: 2 }, { nick: "m1nd1", pos: 3 }, { nick: "darklight", pos: 4 }, { nick: "Freak", pos: 5 } ] },
      { name: "Podosinoviki",      logo: "dota2.png", roster: [ { nick: "Ростовский Богатырь", pos: 1 }, { nick: "зато уютно умирать", pos: 2 }, { nick: "МИШКА МОРГЕН", pos: 3 }, { nick: "El Oreshniko del Perú", pos: 4 }, { nick: "аурная зараза", pos: 5 } ] },
      { name: "James & Jeremy",    logo: "dota2.png", roster: [ { nick: "ihatekirk", pos: 1 }, { nick: "wannafeels", pos: 2 }, { nick: "Голубчик", pos: 3 }, { nick: "king bob", pos: 4 }, { nick: "CocsmeN", pos: 5 } ] },
      { name: "BandaWidst",        logo: "dota2.png", roster: [ { nick: "orgasm donor+", pos: 1 }, { nick: "hikari", pos: 2 }, { nick: "hornet", pos: 3 }, { nick: "最酷的", pos: 4 }, { nick: "west", pos: 5 } ] },
      { name: "MonKs team",        logo: "dota2.png", roster: [ { nick: "keeps", pos: 1 }, { nick: "Иван лон друид", pos: 2 }, { nick: "Kaban", pos: 3 }, { nick: "tierblade", pos: 4 }, { nick: "RemoRi", pos: 5 } ] }
    ],
    casters: [
      { name: "TBD", link: "" }
    ],
    bracketEmbed: "https://challonge.com/ru/g4aub1b4/module",
    registrationLink: "https://docs.google.com/forms/d/1enASbjmlEUqkB8977LhUoBGrmVHD0WyoOi4Xuq7NiXA/edit",
    telegramLink: "https://t.me/SkewerEsports",
    description: "Skewer Esports Season 1 — онлайн-турнир Dota 2, 5×5, bo1 (финал bo3), лимит суммарного MMR команды — 35.000, призовой фонд — 4000₽ (1 место — 3500₽, MVP турнира — 500₽). Взнос 200₽ с команды, минимально 10 команд. Победитель: Podosinoviki (2:1 против NDB). MVP: Мишка Морген (Podosinoviki). Турнир завершён.",
    prizePool: [
      { place: 1, amount: "3.500₽ + 500₽ MVP", team: "Podosinoviki" }
    ]
  },

  {
    id: "AnyLvL-x-GOTF-eSports-Tournament-1",
    title: "AnyLvL x GOTF eSports Tournament #1",
    limit: "До 35.000 на команду",
    start: "2026-04-19",
    end: "2026-04-19",
    startTime: "13:00",
    prize: "13.500₽",
    location: "СНГ",
    teams: 18,
    winner: "EGOISTO Team",
    format: "Single Elimination",
    organizer: "AnyLvL x GOTF",
    teamsList: [
      { name: "Pulse Team",            logo: "dota2.png", roster: [ { nick: "hiori", pos: 1 }, { nick: "redrose", pos: 2 }, { nick: "Yanegi", pos: 3 }, { nick: "drim", pos: 4 }, { nick: "Toshnota", pos: 5 } ] },
      { name: "Dark Reef",             logo: "dota2.png", roster: [ { nick: "Oketra", pos: 4 }, { nick: "DanilkaAbed", pos: 2 }, { nick: "DTI", pos: 3 }, { nick: "666х9", pos: 1 }, { nick: "S1n1ster", pos: 5 } ] },
      { name: "GLHF",                  logo: "dota2.png", roster: [ { nick: "flasko", pos: 1 }, { nick: "Divan prime", pos: 2 }, { nick: "road домой", pos: 3 }, { nick: "НИКОЛАША ПРАЙМ", pos: 4 }, { nick: "heb", pos: 5 } ] },
      { name: "Prodigy",               logo: "dota2.png", roster: [ { nick: "Raynor", pos: 1 }, { nick: "F4cker", pos: 2 }, { nick: "Аджара Гуджу", pos: 3 }, { nick: "Malutka", pos: 4 }, { nick: "Dasigty", pos: 5 } ] },
      { name: "SkyDrifters",           logo: "dota2.png", roster: [ { nick: "Hollow_skies37", pos: 2 }, { nick: "Vnt", pos: 5 }, { nick: "gorilla", pos: 3 }, { nick: "AliceStyle", pos: 4 }, { nick: "dancer", pos: 1 } ] },
      { name: "Barracuda jnr",         logo: "dota2.png", roster: [ { nick: "366roten", pos: 1 }, { nick: "Gosha787898", pos: 2 }, { nick: "BlueDolphin", pos: 3 }, { nick: "Blintlbeis", pos: 4 }, { nick: "5HaZaM", pos: 5 } ] },
      { name: "LETO jr",               logo: "dota2.png", roster: [ { nick: "Teenwave", pos: 1 }, { nick: "Alisa", pos: 2 }, { nick: "popi", pos: 3 }, { nick: "el tivke", pos: 4 }, { nick: "HSMG", pos: 5 } ] },
      { name: "Generation of Miracles",logo: "dota2.png", roster: [ { nick: "XTR666", pos: 1 }, { nick: "The first", pos: 2 }, { nick: "The Prodigy", pos: 3 }, { nick: "Sunset Flower", pos: 4 }, { nick: "Antuano Baobabo", pos: 5 } ] },
      { name: "Team Zachem??? :(",     logo: "dota2.png", roster: [ { nick: "KiddTheAngel", pos: 1 }, { nick: "Делаем грязь (ради неё)", pos: 2 }, { nick: "Rinrin", pos: 3 }, { nick: "Адун", pos: 4 }, { nick: "yleuvyu", pos: 5 } ] },
      { name: "EGOISTO Team",          logo: "dota2.png", roster: [ { nick: "never try #ЧСВ", pos: 1 }, { nick: "Xine", pos: 2 }, { nick: "m1nd1", pos: 3 }, { nick: "Darklight", pos: 4 }, { nick: "☆vsplesk☆", pos: 5 } ] },
      { name: "DVEPO20",               logo: "dota2.png", roster: [ { nick: "Hiroshi", pos: 1 }, { nick: "desnake-", pos: 2 }, { nick: "Yskoglaziy paren'", pos: 3 }, { nick: "consume", pos: 4 }, { nick: "katarsis", pos: 5 } ] },
      { name: "Ouroboros team",        logo: "dota2.png", roster: [ { nick: "SuSOs", pos: 1 }, { nick: "Exorcism", pos: 2 }, { nick: "icno", pos: 3 }, { nick: "arata", pos: 4 }, { nick: "wmmmaaaaa", pos: 5 } ] },
      { name: "Neki4 +4",              logo: "dota2.png", roster: [ { nick: "Oketra", pos: 2 }, { nick: "squalor", pos: 1 }, { nick: "mdk", pos: 3 }, { nick: "all eyes on me", pos: 4 }, { nick: "come around", pos: 5 } ] },
      { name: "Antagonist",            logo: "dota2.png", roster: [ { nick: "пустота", pos: 1 }, { nick: "Semich", pos: 2 }, { nick: "Darkled", pos: 3 }, { nick: "Antagonist", pos: 4 }, { nick: "Gummi_bear", pos: 5 } ] },
      { name: "Tatsinskay Team",       logo: "dota2.png", roster: [ { nick: "Iny", pos: 1 }, { nick: "gleblixo", pos: 2 }, { nick: "Sorry", pos: 3 }, { nick: "Elmisho", pos: 4 }, { nick: "Poga", pos: 5 } ] },
      { name: "Bedlam battle team",    logo: "dota2.png", roster: [ { nick: "cotsu", pos: 1 }, { nick: "imortall_boy", pos: 2 }, { nick: "edsaiii", pos: 3 }, { nick: "marty", pos: 4 }, { nick: "Ariurn", pos: 5 } ] },
      { name: "Team Sexy",             logo: "dota2.png", roster: [ { nick: "hosh1no愛", pos: 1 }, { nick: "fff", pos: 2 }, { nick: "kushinada.", pos: 3 }, { nick: "icememory<3", pos: 4 }, { nick: "Лысый Очколом", pos: 5 } ] },
      { name: "Gitlz",                 logo: "dota2.png", roster: [ { nick: "breaoutlik", pos: 1 }, { nick: "AstarOtzio", pos: 2 }, { nick: "moody", pos: 3 }, { nick: "Shiroyami", pos: 4 }, { nick: "Akama", pos: 5 } ] },
      { name: "стул и 4 ножки",        logo: "dota2.png", roster: [ { nick: "Miracle-", pos: 1 }, { nick: "rain,", pos: 2 }, { nick: "MAB1K", pos: 3 }, { nick: "yomyko.", pos: 4 }, { nick: "El Gato Negro", pos: 5 } ] }
    ],
    casters: [
      { name: "Paradox_Pog", link: "https://www.twitch.tv/paradox_pog" }
    ],
    bracketEmbed: "https://challonge.com/ru/v3pd6qg4/module",
    registrationLink: "https://forms.gle/cyRVFUPrugiTeo7w6",
    telegramLink: "https://t.me/anylvlcommunity",
    description: "AnyLvL x GOTF eSports Tournament #1 — онлайн-турнир Dota 2, Single Elimination, Captains Mode, BO1 (финал BO3), лимит суммарного MMR команды — 35.000 (до 10.000 на игрока). Призовой фонд — 13.500₽. Дата: 19 апреля. Взнос 750₽ с команды, 18 команд. Победитель: EGOISTO Team (2:0 против Neki4+4). Турнир завершён.",
    prizePool: [
      { place: 1, amount: "9.000₽",  team: "EGOISTO Team" },
      { place: 2, amount: "4.500₽",  team: "Neki4+4" }
    ]
  }
];
