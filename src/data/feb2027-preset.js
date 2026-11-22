// User's Custom 16-Day Winter Snow & Early Sakura Itinerary (Feb 21 – Mar 8, 2027)
// Pre-seeded into savedCustomPresets on fresh boot and exportable as both .jptrip.json & .xlsx

window.buildUserFeb2027Preset = function() {
  const H = window.PRESET_HELPERS;
  const start = "2027-02-21"; // Sunday
  const daySpecs = [
    {
      regEn: "Tokyo", regJa: "東京",
      titleEn: "Arrive Tokyo (HND / NRT) → APA Hotel Shinjuku Kabukicho & Omoide Yokocho",
      titleJa: "東京到着（羽田/成田）→ アパホテル新宿歌舞伎町タワー＆思い出横丁",
      subEn: "Check in beside JR Shinjuku Station, pick up IC card & enjoy Tokyo Metropolitan Gov't Bldg night views",
      subJa: "空港アクセスで新宿へ移動。交通系ICカード準備後、都庁無料夜景展望＆新宿ディナー",
      stay: 15500, travelBase: 46500, travelActualAdd: 0, fun: 8500,
      hotelEn: "APA Hotel & Resort Shinjuku Kabukicho Tower", hotelJa: "アパホテル＆リゾート〈西新宿・新宿歌舞伎町タワー〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 1500, totalAllLegs: 1500,
      legsEn: ["Flight to Tokyo (¥45,000 est.)", "Haneda Monorail / N'EX / Yamanote to Shinjuku (¥1,500)"],
      legsJa: ["東京行き航空券（目安 ¥45,000）", "羽田空港 / 成田空港 → JR新宿駅（¥1,500）"],
      tipEn: "Add Apple Wallet Suica/PASMO before landing. Stay at APA Kabukicho Tower (public bath on top floor) steps from Shinjuku Bus & JR West Exit.",
      tipJa: "到着前にモバイルSuica準備が便利。大浴場完備の新宿アパホテルで初日の移動疲れを癒せます。",
      slotsEn: [
        { id: "f1_1", timeFrom: "13:30", timeTo: "15:15", locFrom: "Haneda / Narita", locTo: "Shinjuku", category: "travel", desc: "Airport train/monorail transfer to JR Shinjuku Station (Suica/PASMO)" },
        { id: "f1_2", timeFrom: "15:30", timeTo: "16:30", locFrom: "JR Shinjuku", locTo: "APA Kabukicho", category: "stay", desc: "Check in at APA Hotel Shinjuku Kabukicho Tower & unpack" },
        { id: "f1_3", timeFrom: "17:30", timeTo: "20:00", locFrom: "Shinjuku", locTo: "Omoide Yokocho", category: "meal", desc: "Evening view at Tokyo Metropolitan Gov't Bldg South Deck & yakitori dinner" }
      ],
      slotsJa: [
        { id: "f1_1", timeFrom: "13:30", timeTo: "15:15", locFrom: "羽田 / 成田空港", locTo: "新宿駅", category: "travel", desc: "モノレール・京急・JR乗り継ぎで新宿駅へ移動" },
        { id: "f1_2", timeFrom: "15:30", timeTo: "16:30", locFrom: "JR新宿駅", locTo: "新宿アパホテル", category: "stay", desc: "アパホテル〈新宿 歌舞伎町タワー〉チェックイン" },
        { id: "f1_3", timeFrom: "17:30", timeTo: "20:00", locFrom: "西新宿", locTo: "思い出横丁", category: "meal", desc: "東京都庁展望室から無料夜景鑑賞＆新宿思い出横丁で初日ディナー" }
      ]
    },
    {
      regEn: "Mt. Fuji", regJa: "富士山・河口湖",
      titleEn: "Tokyo ↔ Lake Kawaguchiko Winter Day Trip (Oishi Park, Ropeway & Hoto Fudo)",
      titleJa: "東京 ↔ 河口湖日帰り（大石公園・パノラマロープウェイ・ほうとう不動）",
      subEn: "Timed on Monday before Japan's Tue Feb 23 Emperor's Birthday holiday for clearer snow views & smaller crowds",
      subJa: "翌2/23(祝・天皇誕生日)の混雑を避けた月曜日に訪問！雪化粧の富士山＆ほうとうランチ",
      stay: 15500, travelBase: 8260, travelActualAdd: 1500, fun: 10000,
      hotelEn: "APA Hotel & Resort Shinjuku Kabukicho Tower", hotelJa: "アパホテル＆リゾート〈西新宿・新宿歌舞伎町タワー〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 4400, totalAllLegs: 9760,
      legsEn: ["Shinjuku ↔ Otsuki (JR Fuji Excursion Ltd Exp ¥4,400 RT)", "Otsuki ↔ Kawaguchiko (Fujikyuko Line ¥3,860 RT • Non-JR)", "Kawaguchiko Sightseeing Red Line Bus 1-Day Pass (¥1,500 • Non-JR)"],
      legsJa: ["新宿 ↔ 大月（JR特急富士回遊 往復 ¥4,400）", "大月 ↔ 河口湖（富士急行線 往復 ¥3,860 • JR以外）", "河口湖周遊バス レッドライン1日券（¥1,500 • JR以外）"],
      tipEn: "Reserve JR Fuji Excursion seats 1 month ahead (sold out fast); backup option is Keio Highway Bus from Busta Shinjuku (~¥4,400 RT). Lunch at Hoto Fudo (Tabelog ★3.57).",
      tipJa: "特急「富士回遊」は1ヶ月前10時に要予約（満席時はバスタ新宿発高速バス往復¥4,400も快適）。河口湖駅前の「ほうとう不動（食べログ★3.57）」が定番。",
      slotsEn: [
        { id: "f2_1", timeFrom: "07:30", timeTo: "09:25", locFrom: "JR Shinjuku", locTo: "Kawaguchiko Stn", category: "travel", desc: "Direct JR Fuji Excursion Limited Express to Kawaguchiko" },
        { id: "f2_2", timeFrom: "09:45", timeTo: "12:15", locFrom: "Kawaguchiko Stn", locTo: "Oishi Park", category: "sightseeing", desc: "Red Line Bus to Oishi Park northern shore & Mt. Fuji Panoramic Ropeway" },
        { id: "f2_3", timeFrom: "12:30", timeTo: "13:45", locFrom: "Kawaguchiko", locTo: "Hoto Fudo", category: "meal", desc: "Pumpkin miso Hoto noodles at Hoto Fudo (Tabelog ★3.57)" },
        { id: "f2_4", timeFrom: "16:45", timeTo: "18:45", locFrom: "Kawaguchiko Stn", locTo: "JR Shinjuku", category: "travel", desc: "Evening Fuji Excursion return train to Shinjuku APA Hotel" }
      ],
      slotsJa: [
        { id: "f2_1", timeFrom: "07:30", timeTo: "09:25", locFrom: "JR新宿駅", locTo: "河口湖駅", category: "travel", desc: "JR直通特急「富士回遊」で河口湖駅へ" },
        { id: "f2_2", timeFrom: "09:45", timeTo: "12:15", locFrom: "河口湖駅", locTo: "大石公園", category: "sightseeing", desc: "周遊バスで大石公園の富士山撮影＆富士山パノラマロープウェイ" },
        { id: "f2_3", timeFrom: "12:30", timeTo: "13:45", locFrom: "河口湖駅前", locTo: "ほうとう不動", category: "meal", desc: "名物かぼちゃ味噌ほうとう（ほうとう不動 • 食べログ★3.57）ランチ" },
        { id: "f2_4", timeFrom: "16:45", timeTo: "18:45", locFrom: "河口湖駅", locTo: "JR新宿駅", category: "travel", desc: "夕方の富士回遊で新宿アパホテルへ帰着" }
      ]
    },
    {
      regEn: "Tokyo", regJa: "東京",
      titleEn: "Tokyo Highlights (Holiday): Asakusa Senso-ji, Ueno Plum Blossoms & Shibuya Sky",
      titleJa: "東京満喫（祝）：浅草寺・上野公園の梅と寒桜・銀座＆渋谷スカイ夕景",
      subEn: "Catch late-Feb plum blossoms & early kanzakura in Ueno Park before Shibuya Sky sunset skyline",
      subJa: "天皇誕生日の祝日は都内周遊！上野の梅と早咲き寒桜を愛でた後、渋谷スカイへ",
      stay: 15500, travelBase: 900, travelActualAdd: 0, fun: 12000,
      hotelEn: "APA Hotel & Resort Shinjuku Kabukicho Tower", hotelJa: "アパホテル＆リゾート〈西新宿・新宿歌舞伎町タワー〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 400, totalAllLegs: 900,
      legsEn: ["Tokyo Metro 24-Hour Pass / IC Rides (¥900)"],
      legsJa: ["東京メトロ24時間券・都内JR移動（¥900）"],
      tipEn: "Book Shibuya Sky 16:40 sunset slot 4 weeks prior (~¥2,500). Try Unagi Irokawa / Hatsuogawa in Asakusa (Tabelog ★3.72).",
      tipJa: "渋谷スカイの16:40夕暮れ枠は4週間前に要予約。浅草で老舗うなぎ（色川・初小川 ★3.72）もおすすめ。",
      slotsEn: [
        { id: "f3_1", timeFrom: "09:00", timeTo: "11:30", locFrom: "Shinjuku", locTo: "Asakusa", category: "sightseeing", desc: "Asakusa Senso-ji Kaminarimon, Nakamise Street & early Sumida riverside blooms" },
        { id: "f3_2", timeFrom: "12:00", timeTo: "14:00", locFrom: "Asakusa", locTo: "Ueno Park", category: "meal", desc: "Asakusa Unagi lunch (★3.72), then Ueno Toshogu plum trees & kanzakura" },
        { id: "f3_3", timeFrom: "16:15", timeTo: "18:30", locFrom: "Ueno", locTo: "Shibuya Sky", category: "sightseeing", desc: "Sunset panorama from Shibuya Sky 46F rooftop over Tokyo & Mt. Fuji twilight" }
      ],
      slotsJa: [
        { id: "f3_1", timeFrom: "09:00", timeTo: "11:30", locFrom: "新宿", locTo: "浅草寺", category: "sightseeing", desc: "朝の浅草寺・仲見世通り＆隅田公園散策" },
        { id: "f3_2", timeFrom: "12:00", timeTo: "14:00", locFrom: "浅草", locTo: "上野公園", category: "meal", desc: "浅草老舗うなぎランチ（★3.72）後、上野公園の梅・寒桜鑑賞" },
        { id: "f3_3", timeFrom: "16:15", timeTo: "18:30", locFrom: "上野", locTo: "渋谷スカイ", category: "sightseeing", desc: "渋谷スカイ展望台から富士山のシルエットと東京夕景・夜景鑑賞" }
      ]
    },
    {
      regEn: "Atami & Kawazu", regJa: "熱海・河津（伊豆）",
      titleEn: "Tokyo → Atami Plum Garden & Peak Kawazu Sakura Festival → Shizuoka",
      titleJa: "東京 → 熱海梅園＆河津桜まつり（満開の早咲き桜）→ 静岡アパホテル泊",
      subEn: "Winter meets full spring! 460 plum trees at Atami Baien + 850 vivid pink Kawazu-zakura lining Kawazu River",
      subJa: "大きな荷物は京都へ宅配便！熱海梅園と河津川沿い約850本の濃いピンクの河津桜を1日で満喫",
      stay: 9200, travelBase: 9900, travelActualAdd: 920, fun: 11500,
      hotelEn: "APA Hotel Shizuoka-eki Kita", hotelJa: "アパホテル〈静岡駅北〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 7400, totalAllLegs: 10820,
      legsEn: ["Tokyo → Atami → Kawazu → Atami → Shizuoka (JR Odoriko + Ito Line ¥7,400 JR / ¥3,420 Izukyu Non-JR)"],
      legsJa: ["東京 → 熱海 → 河津 → 熱海 → 静岡（JR特急踊り子・伊東線 ¥7,400 ＋ 伊豆急行線 ¥3,420 • JR以外）"],
      tipEn: "Ship main luggage from Shinjuku APA to Kyoto APA via Yamato (~¥2,200 included in fun/logistics) and stash small packs in Atami Station coin lockers! Lunch at Atami Ginza Osakana Shokudo (Tabelog ★3.50).",
      tipJa: "大荷物は新宿アパから京都アパへ宅急便（約¥2,200）し、熱海駅コインロッカー利用で身軽に！昼食は熱海銀座おさかな食堂（★3.50）が人気。",
      slotsEn: [
        { id: "f4_1", timeFrom: "08:00", timeTo: "09:15", locFrom: "Tokyo Stn", locTo: "Atami", category: "travel", desc: "Drop bags at Atami coin lockers after morning Tokaido train; bus to Atami Baien" },
        { id: "f4_2", timeFrom: "09:30", timeTo: "12:15", locFrom: "Atami Baien", locTo: "Atami Ginza", category: "meal", desc: "Atami Plum Garden late-Feb blooms & seafood bowl lunch at Atami Ginza Osakana Shokudo (★3.50)" },
        { id: "f4_3", timeFrom: "12:40", timeTo: "17:15", locFrom: "Atami", locTo: "Kawazu River", category: "sightseeing", desc: "JR Odoriko/Izukyu down to Kawazu Cherry Blossom Festival (4km vibrant pink river tunnel)" },
        { id: "f4_4", timeFrom: "17:45", timeTo: "20:00", locFrom: "Kawazu", locTo: "APA Shizuoka", category: "stay", desc: "JR Tokaido Line back via Atami to Shizuoka & check in APA Hotel Shizuoka-eki Kita" }
      ],
      slotsJa: [
        { id: "f4_1", timeFrom: "08:00", timeTo: "09:15", locFrom: "東京駅", locTo: "熱海駅", category: "travel", desc: "熱海到着後コインロッカーに荷物を預け、バスで熱海梅園へ" },
        { id: "f4_2", timeFrom: "09:30", timeTo: "12:15", locFrom: "熱海梅園", locTo: "熱海銀座", category: "meal", desc: "熱海梅園梅まつり散策＆熱海銀座おさかな食堂（食べログ★3.50）で海鮮ランチ" },
        { id: "f4_3", timeFrom: "12:40", timeTo: "17:15", locFrom: "熱海", locTo: "河津桜並木", category: "sightseeing", desc: "伊豆急行・踊り子で河津へ！満開の河津桜川沿い遊歩道＆わさび丼散策" },
        { id: "f4_4", timeFrom: "17:45", timeTo: "20:00", locFrom: "河津駅", locTo: "アパホテル静岡駅北", category: "stay", desc: "熱海乗換・JR東海道線で静岡駅へ移動しアパホテル静岡駅北チェックイン" }
      ]
    },
    {
      regEn: "Shizuoka & Fujikawa", regJa: "静岡・富士川",
      titleEn: "Shizuoka ↔ Starbucks EXPASA Fujikawa (Morning Mt. Fuji 絶景) & Miho-no-Matsubara",
      titleJa: "静岡 ↔ 富士川SAスタバ（朝の富士山絶景カフェ）・日本平＆三保松原・静岡おでん",
      subEn: "07:15 AM clear sky Mt. Fuji coffee overlooking Fuji River, afternoon Nihondaira Ropeway & Shizuoka dark-broth oden",
      subJa: "雲の出にくい朝7時台にJR富士川駅＋タクシーでEXPASA富士川スタバへ！午後は日本平・三保松原、夜は静岡おでん",
      stay: 9200, travelBase: 2840, travelActualAdd: 1200, fun: 9500,
      hotelEn: "APA Hotel Shizuoka-eki Kita", hotelJa: "アパホテル〈静岡駅北〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 1440, totalAllLegs: 4040,
      legsEn: ["Shizuoka ↔ JR Fujikawa ↔ Shimizu (JR Tokaido Line ¥1,440)", "JR Fujikawa Stn → EXPASA Fujikawa SA Taxi (¥1,200 morning 絶景) + Bus Return (¥200)", "Shizuoka–Nihondaira–Miho Bus & Kunozan Ropeway Shuttle (¥1,200 • Non-JR)"],
      legsJa: ["静岡 ↔ 富士川 ↔ 清水（JR東海道線 ¥1,440）", "富士川駅 → 富士川楽座/SA 往路早朝タクシー（¥1,200 絶景優先）＋復路バス（¥200）", "日本平・三保松原バス移動（¥1,200 • JR以外）"],
      tipEn: "Because Fujikawa SA is on the Tomei Expressway, staying in Shizuoka cuts morning travel to just 28 min by JR! Take an early 5-min taxi uphill (~¥1,200) to Starbucks EXPASA Fujikawa before 08:30 while Mt. Fuji is cloud-free; take public Yamanashi Bus from 'Fujikawa Rakuza Mae' back down. Dinner at Aoba Oden Alley (Tabelog ★3.56).",
      tipJa: "静岡泊だからこそ朝7時前に出発して富士川駅＋タクシー約5分で晴天率最高の富士川SAスタバ（絶景テラス）へ直行可能！帰りは富士川楽座前の路線バス利用可。夜は青葉横丁の静岡おでん（食べログ★3.56）。",
      slotsEn: [
        { id: "f5_1", timeFrom: "06:45", timeTo: "09:15", locFrom: "JR Shizuoka", locTo: "EXPASA Fujikawa SA", category: "sightseeing", desc: "JR train to Fujikawa + 5-min uphill taxi for crisp 07:30 AM coffee & Mt. Fuji view at Starbucks terrace (local bus/25-min downhill walk back)" },
        { id: "f5_2", timeFrom: "10:45", timeTo: "16:30", locFrom: "Nihondaira", locTo: "Miho-no-Matsubara", category: "sightseeing", desc: "Nihondaira Yume Terrace, Kunozan Ropeway & UNESCO Miho Pine Grove overlooking Suruga Bay" },
        { id: "f5_3", timeFrom: "18:00", timeTo: "20:00", locFrom: "Shizuoka City", locTo: "Aoba Oden Alley", category: "meal", desc: "Shizuoka dark-broth oden skewers & grilled black hanpen at Aoba Oden Alley (★3.56)" }
      ],
      slotsJa: [
        { id: "f5_1", timeFrom: "06:45", timeTo: "09:15", locFrom: "JR静岡駅", locTo: "富士川SAスタバ", category: "sightseeing", desc: "JR富士川駅着後タクシー5分でEXPASA富士川へ。朝の晴天時に富士山一望のスタバ絶景タイム（帰りはバス利用）" },
        { id: "f5_2", timeFrom: "10:45", timeTo: "16:30", locFrom: "日本平夢テラス", locTo: "三保松原", category: "sightseeing", desc: "日本平夢テラス・久能山ロープウェイ＆世界遺産・三保の松原から富士山遠望" },
        { id: "f5_3", timeFrom: "18:00", timeTo: "20:00", locFrom: "静岡駅周辺", locTo: "青葉おでん街", category: "meal", desc: "青葉横丁・青葉おでん街で静岡おでん＆黒はんぺん夕食（食べログ★3.56）" }
      ]
    },
    {
      regEn: "Kyoto", regJa: "京都",
      titleEn: "Shizuoka → Kyoto (Hikari Shinkansen) & Dusk Fushimi Inari Shrine",
      titleJa: "静岡 → 東海道新幹線「ひかり」で京都へ＆夕暮れの伏見稲荷大社・千本鳥居",
      subEn: "Morning Shinkansen straight into Kyoto Station, check in at APA Kyoto Ekimae & sunset vermilion torii gates",
      subJa: "新幹線で京都駅へ直通！APA京都駅前チェックイン後、混雑の落ち着いた夕方の伏見稲荷へ",
      stay: 13500, travelBase: 10450, travelActualAdd: 300, fun: 10500,
      hotelEn: "APA Hotel Kyoto Ekimae", hotelJa: "アパホテル〈京都駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 10750, totalAllLegs: 10750,
      legsEn: ["Shizuoka → Kyoto (Tokaido Shinkansen Hikari ¥10,450)", "Kyoto ↔ Inari (JR Nara Line ¥300 RT)"],
      legsJa: ["静岡 → 京都（東海道新幹線ひかり ¥10,450）", "京都 ↔ 稲荷（JR奈良線 往復 ¥300）"],
      tipEn: "Sit on right-hand E seats from Shizuoka for Hamamatsu lake & Ibuki views. Your shipped luggage awaits at APA Hotel Kyoto Ekimae (3-min walk from JR Kyoto Central Exit). Dinner at Katsukura Kyoto Station Cube (Tabelog ★3.64).",
      tipJa: "新宿から送った大型荷物をアパホテル京都駅前で受取。夕方はJR奈良線5分の伏見稲荷へ。夕食は京都駅ビル「名代とんかつ かつくら（★3.64）」。",
      slotsEn: [
        { id: "f6_1", timeFrom: "09:10", timeTo: "11:00", locFrom: "Shizuoka", locTo: "Kyoto Stn", category: "travel", desc: "Direct Tokaido Shinkansen Hikari from Shizuoka to JR Kyoto Station" },
        { id: "f6_2", timeFrom: "11:15", timeTo: "15:00", locFrom: "APA Kyoto Ekimae", locTo: "Kyoto Station", category: "stay", desc: "Drop bags / retrieve Yamato luggage at APA Kyoto Ekimae & explore Nishikikouji / Station" },
        { id: "f6_3", timeFrom: "16:15", timeTo: "19:30", locFrom: "JR Inari", locTo: "Kyoto Station", category: "meal", desc: "Golden-hour Fushimi Inari Taisha climb, then crispy tonkatsu at Katsukura (★3.64)" }
      ],
      slotsJa: [
        { id: "f6_1", timeFrom: "09:10", timeTo: "11:00", locFrom: "静岡駅", locTo: "京都駅", category: "travel", desc: "東海道新幹線ひかりで京都駅へ直通移動" },
        { id: "f6_2", timeFrom: "11:15", timeTo: "15:00", locFrom: "アパ京都駅前", locTo: "京都駅周辺", category: "stay", desc: "宅急便荷物の受取＆アパホテル京都駅前周辺ランチ散策" },
        { id: "f6_3", timeFrom: "16:15", timeTo: "19:30", locFrom: "稲荷駅", locTo: "かつくら京都駅店", category: "meal", desc: "夕方の伏見稲荷大社・千本鳥居参拝後、名代とんかつ「かつくら（★3.64）」夕食" }
      ]
    },
    {
      regEn: "Kyoto", regJa: "京都",
      titleEn: "Kyoto Weekend Day 1 (Sat): Kiyomizu-dera, Kitano Tenmangu Plum Grove & Gion",
      titleJa: "京都週末1日目(土)：清水寺・二年坂・北野天満宮「梅苑」＆祇園・先斗町",
      subEn: "Beat weekend crowds at 07:30 Kiyomizu-dera, feast at Nishiki Market & enjoy peak late-Feb 1,500 plum blossoms at Kitano Tenmangu",
      subJa: "早朝の清水寺・産寧坂から錦市場食べ歩き、さらに2月下旬満開の北野天満宮梅苑＆夜の祇園花見小路",
      stay: 13500, travelBase: 0, travelActualAdd: 1100, fun: 13500,
      hotelEn: "APA Hotel Kyoto Ekimae", hotelJa: "アパホテル〈京都駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 0, totalAllLegs: 1100,
      legsEn: ["Kyoto City Subway & Bus 1-Day Pass (¥1,100 • Non-JR)"],
      legsJa: ["京都市地下鉄・バス1日券（¥1,100 • JR以外）"],
      tipEn: "Kitano Tenmangu's Baien Plum Garden peaks around Feb 25–early March with over 1,500 red & white blossoms! Try Kyoto obanzai & matcha treats at Nishiki Market (Tabelog ★3.75).",
      tipJa: "2月最終週末の北野天満宮「梅苑」は1,500本が満開の見頃！昼は錦市場、夕暮れは石塀小路・祇園散策。",
      slotsEn: [
        { id: "f7_1", timeFrom: "07:30", timeTo: "10:30", locFrom: "Kyoto Stn", locTo: "Kiyomizu-dera", category: "sightseeing", desc: "Early taxi/bus up to Kiyomizu-dera -> Sannenzaka -> Ninenzaka -> Yasaka Shrine" },
        { id: "f7_2", timeFrom: "11:30", timeTo: "13:15", locFrom: "Gion", locTo: "Nishiki Market", category: "meal", desc: "Kyoto Obanzai tasting & fresh yuba skewers at 400-year-old Nishiki Market" },
        { id: "f7_3", timeFrom: "14:00", timeTo: "17:00", locFrom: "Nishiki", locTo: "Kitano Tenmangu", category: "sightseeing", desc: "Subway/bus to Kitano Tenmangu Shrine's blooming 1,500-tree Plum Blossom Grove" },
        { id: "f7_4", timeFrom: "18:00", timeTo: "20:30", locFrom: "Pontocho", locTo: "Gion", category: "meal", desc: "Lantern-lit Gion Hanamikoji stroll & Pontocho alley dinner (duck ramen ★3.70)" }
      ],
      slotsJa: [
        { id: "f7_1", timeFrom: "07:30", timeTo: "10:30", locFrom: "京都駅前", locTo: "清水寺・産寧坂", category: "sightseeing", desc: "開門直後の清水寺〜産寧坂・二年坂〜八坂神社を静かな時間帯に散策" },
        { id: "f7_2", timeFrom: "11:30", timeTo: "13:15", locFrom: "祇園四条", locTo: "錦市場", category: "meal", desc: "京の台所・錦市場でおばんざいや生湯葉グルメ食べ歩き" },
        { id: "f7_3", timeFrom: "14:00", timeTo: "17:00", locFrom: "烏丸", locTo: "北野天満宮梅苑", category: "sightseeing", desc: "市バスで北野天満宮へ。見頃の紅白1,500本の梅苑鑑賞＆梅茶屋一服" },
        { id: "f7_4", timeFrom: "18:00", timeTo: "20:30", locFrom: "先斗町", locTo: "祇園花見小路", category: "meal", desc: "先斗町・花見小路の京情緒ある夜散歩＆祇園ダックヌードル等（★3.70）" }
      ]
    },
    {
      regEn: "Kyoto", regJa: "京都",
      titleEn: "Kyoto Weekend Day 2 (Sun): Arashiyama Bamboo Grove, Yudofu & Kinkaku-ji",
      titleJa: "京都週末2日目(日)：早朝の嵐山竹林・渡月橋・湯豆腐＆金閣寺・宇治抹茶パフェ",
      subEn: "Beat Sunday crowds at 07:30 Arashiyama Bamboo Grove & Tenryu-ji, silken yudofu lunch & afternoon Kinkaku-ji",
      subJa: "日曜朝の混雑前にJR嵯峨野線で嵐山竹林＆天龍寺へ！嵐山湯豆腐ランチと午後の金閣寺・京都駅抹茶スイーツ",
      stay: 13500, travelBase: 480, travelActualAdd: 700, fun: 12500,
      hotelEn: "APA Hotel Kyoto Ekimae", hotelJa: "アパホテル〈京都駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 480, totalAllLegs: 1180,
      legsEn: ["Kyoto ↔ Saga-Arashiyama (JR Sagano Line ¥480)", "Arashiyama → Kinkaku-ji → Kyoto Station (Randen Tram & City Bus ¥700 • Non-JR)"],
      legsJa: ["京都 ↔ 嵯峨嵐山（JR嵯峨野線 ¥480）", "嵐山 → 金閣寺 → 京都駅（嵐電＆京都市バス ¥700 • JR以外）"],
      tipEn: "Savor bamboo-basket Yudofu kaiseki at Sagano / Junsei (Tabelog ★3.68) and cap the afternoon with Nakamura Tokichi Uji Matcha parfait in Kyoto Station (★3.75).",
      tipJa: "ランチは名水仕込みの湯豆腐（嵐山嵯峨野 ★3.68）、夕方京都駅で中村藤吉本店（★3.75）の抹茶パフェ。",
      slotsEn: [
        { id: "f8_1", timeFrom: "07:30", timeTo: "11:00", locFrom: "JR Kyoto", locTo: "Arashiyama", category: "sightseeing", desc: "JR Sagano Line 16 min to Saga-Arashiyama: Bamboo Grove, Tenryu-ji Garden & Togetsukyo" },
        { id: "f8_2", timeFrom: "11:30", timeTo: "13:00", locFrom: "Arashiyama", locTo: "Yudofu Sagano", category: "meal", desc: "Simmered Kyoto Yudofu tofu lunch in Arashiyama (Tabelog ★3.68)" },
        { id: "f8_3", timeFrom: "13:30", timeTo: "17:00", locFrom: "Randen Arashiyama", locTo: "Kinkaku-ji", category: "sightseeing", desc: "Scenic Randen tram + bus to Kinkaku-ji Golden Pavilion & return to Kyoto Stn for Nakamura Tokichi matcha (★3.75)" }
      ],
      slotsJa: [
        { id: "f8_1", timeFrom: "07:30", timeTo: "11:00", locFrom: "JR京都駅", locTo: "嵐山・竹林", category: "sightseeing", desc: "JR嵯峨野線16分で朝イチの嵐山竹林の小径・天龍寺・渡月橋をゆったり鑑賞" },
        { id: "f8_2", timeFrom: "11:30", timeTo: "13:00", locFrom: "嵐山", locTo: "湯豆腐 嵯峨野", category: "meal", desc: "京都名物 伝統湯豆腐コースランチ（食べログ★3.68）" },
        { id: "f8_3", timeFrom: "13:30", timeTo: "17:00", locFrom: "嵐電嵐山駅", locTo: "金閣寺・京都駅", category: "sightseeing", desc: "嵐電＆バスで金閣寺（鹿苑寺）拝観後、京都駅伊勢丹3F・中村藤吉本店（★3.75）で抹茶パフェ" }
      ]
    },
    {
      regEn: "Kanazawa", regJa: "金沢・石川",
      titleEn: "Kyoto → Kanazawa (Thunderbird + Hokuriku Shinkansen) & Kenrokuen Snow Ropes",
      titleJa: "京都 → 金沢（サンダーバード＋北陸新幹線）・兼六園の雪吊り＆近江町市場海鮮",
      subEn: "Travel north to APA's birthplace city! Winter snow crabs at Omicho Market, Kenrokuen Yukitsuri & Higashi Chaya",
      subJa: "APA発祥の金沢へ！敦賀経由で北陸新幹線乗継。冬の加能ガニ・のどぐろ丼、兼六園の雪吊り、ひがし茶屋街",
      stay: 9500, travelBase: 6500, travelActualAdd: 800, fun: 13500,
      hotelEn: "APA Hotel Kanazawa Ekimae", hotelJa: "アパホテル〈金沢駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 6500, totalAllLegs: 7300,
      legsEn: ["Kyoto → Tsuruga (JR Thunderbird) → Kanazawa (Hokuriku Shinkansen • Tourist One-Way ¥6,500; Std ¥9,460)", "Kanazawa Loop Bus 1-Day Pass (¥800 • Non-JR)"],
      legsJa: ["京都 → 敦賀（サンダーバード）→ 金沢（北陸新幹線 • 訪日割引片道きっぷ¥6,500／通常¥9,460）", "金沢周遊バス1日券（¥800 • JR以外）"],
      tipEn: "Use JR West's foreign-visitor Hokuriku One-Way Ticket (¥6,500 vs ¥9,460 standard!). APA Hotel Kanazawa Ekimae (just outside East Exit) has natural onsen baths. Lunch at Omicho Market (Ikiiki-tei ★3.64) & dinner nodoguro/oden (Itaru/Kuroyuri ★3.71).",
      tipJa: "JR西日本の訪日向け割引「Hokuriku One-Way Ticket（¥6,500）」がお得。金沢駅前アパ（大浴場付）に荷物預け後、近江町市場海鮮丼（★3.64）＆兼六園雪吊り。",
      slotsEn: [
        { id: "f9_1", timeFrom: "08:40", timeTo: "11:00", locFrom: "JR Kyoto", locTo: "JR Kanazawa", category: "travel", desc: "Thunderbird Limited Express to Tsuruga + easy cross-platform Hokuriku Shinkansen to Kanazawa" },
        { id: "f9_2", timeFrom: "11:30", timeTo: "13:30", locFrom: "APA Kanazawa", locTo: "Omicho Market", category: "meal", desc: "Drop bags at APA Hotel Kanazawa Ekimae, then winter snow crab & nodoguro kaisen-don at Omicho Market (★3.64)" },
        { id: "f9_3", timeFrom: "14:00", timeTo: "18:00", locFrom: "Kenrokuen", locTo: "Higashi Chaya", category: "sightseeing", desc: "Walk Kenrokuen Garden under iconic winter yukitsuri pine ropes + Kanazawa Castle & Higashi Chaya gold-leaf soft serve (★3.55)" }
      ],
      slotsJa: [
        { id: "f9_1", timeFrom: "08:40", timeTo: "11:00", locFrom: "JR京都駅", locTo: "JR金沢駅", category: "travel", desc: "サンダーバードで敦賀駅へ、北陸新幹線に乗換えて金沢駅到着" },
        { id: "f9_2", timeFrom: "11:30", timeTo: "13:30", locFrom: "アパ金沢駅前", locTo: "近江町市場", category: "meal", desc: "アパホテル金沢駅前に荷物預け後、近江町市場で冬の香箱・加能ガニ＆のどぐろ海鮮丼（★3.64）" },
        { id: "f9_3", timeFrom: "14:00", timeTo: "18:00", locFrom: "兼六園", locTo: "ひがし茶屋街", category: "sightseeing", desc: "冬名物「雪吊り」の兼六園・金沢城公園＆ひがし茶屋街で金箔ソフト＆金沢おでん夕食（★3.71）" }
      ]
    },
    {
      regEn: "Shirakawa-go & Takayama", regJa: "白川郷・高山",
      titleEn: "Kanazawa → UNESCO Shirakawa-go Snow Village → Hida Takayama & A5 Hida Beef",
      titleJa: "金沢 → 雪の世界遺産「白川郷」合掌造り → 飛騨高山・A5飛騨牛焼肉",
      subEn: "Reserve Nohi Highway Bus through snow-blanketed thatched roofs & overnight in a central Hida Takayama hot-spring station hotel",
      subJa: "予約制高速バスで雪景色の白川郷展望台＆集落を巡り夕方に飛騨高山へ。夜は丸明でA5飛騨牛！",
      stay: 11500, travelBase: 5400, travelActualAdd: 0, fun: 12000,
      hotelEn: "Wat Hotel & Spa Hida Takayama (Closest APA-Tier Onsen Hotel)", hotelJa: "ワットホテル＆スパ飛騨高山（高山にAPA未展開のため駅近大浴場付）",
      hotelUrl: "https://www.wathotel.com/", jrOnly: 0, totalAllLegs: 5400,
      legsEn: ["Kanazawa Station → Shirakawa-go (Nohi/Hokutetsu Bus ¥2,600 • Non-JR)", "Shirakawa-go → Takayama Nohi Bus Center (¥2,800 • Non-JR)"],
      legsJa: ["金沢駅 → 白川郷（濃飛/北鉄高速バス ¥2,600 • JR以外）", "白川郷 → 高山濃飛バスセンター（¥2,800 • JR以外）"],
      tipEn: "Reserve Kanazawa→Shirakawa-go→Takayama highway bus 1 month early via JapanBusOnline / Willer (coin lockers available at Shirakawa-go Bus Terminal). Note: APA has no branch in Takayama, so Wat Hotel & Spa offers the same convenient station proximity + rooftop natural onsen. Dinner: Hidagyu Maruaki (Tabelog ★3.69).",
      tipJa: "金沢〜白川郷〜高山バスは全席予約制（1ヶ月前予約・白川郷BTに荷物預け可）。※高山市内にはAPAホテルがないため、駅近・天然温泉付のワットホテルを拠点に設定。夕食は飛騨牛丸明（★3.69）。",
      slotsEn: [
        { id: "f10_1", timeFrom: "08:40", timeTo: "10:05", locFrom: "Kanazawa Stn", locTo: "Shirakawa-go", category: "travel", desc: "Hokutetsu/Nohi Express Bus into snow-covered Shirakawa-go; store bags at terminal" },
        { id: "f10_2", timeFrom: "10:15", timeTo: "13:50", locFrom: "Ogimachi", locTo: "Shiroyama Deck", category: "sightseeing", desc: "Walk Gassho-zukuri thatched farmhouses, Shiroyama snowy viewpoint & hearth irori tofu lunch (★3.52)" },
        { id: "f10_3", timeFrom: "14:00", timeTo: "15:00", locFrom: "Shirakawa-go", locTo: "Takayama", category: "travel", desc: "Highway bus south to Takayama Nohi Bus Center & check into Wat Hotel & Spa Hida Takayama" },
        { id: "f10_4", timeFrom: "17:30", timeTo: "19:45", locFrom: "Takayama Stn", locTo: "Hidagyu Maruaki", category: "meal", desc: "Butcher-direct A5 Hida Wagyu grill & Hoba Miso dinner at Hidagyu Maruaki (Tabelog ★3.69)" }
      ],
      slotsJa: [
        { id: "f10_1", timeFrom: "08:40", timeTo: "10:05", locFrom: "金沢駅前", locTo: "白川郷", category: "travel", desc: "予約制高速バスで世界遺産・白川郷へ（バスターミナルに荷物ロッカー有）" },
        { id: "f10_2", timeFrom: "10:15", timeTo: "13:50", locFrom: "荻町合掌集落", locTo: "城山展望台", category: "sightseeing", desc: "雪化粧の合掌造り集落＆城山展望台絶景と囲炉裏グルメランチ（★3.52）" },
        { id: "f10_3", timeFrom: "14:00", timeTo: "15:00", locFrom: "白川郷", locTo: "高山駅前", category: "travel", desc: "濃飛バスで飛騨高山へ移動し、ワットホテル＆スパ飛騨高山チェックイン" },
        { id: "f10_4", timeFrom: "17:30", timeTo: "19:45", locFrom: "高山駅東口", locTo: "飛騨牛 丸明", category: "meal", desc: "飛騨牛専門店「丸明 飛騨高山店」（★3.69）でA5飛騨牛焼肉＆朴葉味噌ディナー" }
      ]
    },
    {
      regEn: "Takayama & Shinhotaka", regJa: "飛騨高山・新穂高",
      titleEn: "Takayama ↔ Shinhotaka Ropeway (2,156m Winter Snow Alps) & Sanmachi Old Town",
      titleJa: "飛騨高山 ↔ 新穂高ロープウェイ（標高2,156m冬の北アルプス雪景色）＆古い町並",
      subEn: "Ascend Japan's only double-decker gondola into 2,156m alpine winter peaks, plus Hirayu Onsen & Takayama ramen",
      subJa: "濃飛バスで日本唯一の2階建て新穂高ロープウェイへ！山頂の雪の回廊と夕方のさんまち通り・高山ラーメン",
      stay: 11500, travelBase: 4400, travelActualAdd: 0, fun: 11800,
      hotelEn: "Wat Hotel & Spa Hida Takayama", hotelJa: "ワットホテル＆スパ飛騨高山",
      hotelUrl: "https://www.wathotel.com/", jrOnly: 0, totalAllLegs: 4400,
      legsEn: ["Takayama ↔ Shinhotaka Ropeway via Hirayu Onsen (Nohi Bus 2-Day Open Pass ¥4,400 • Non-JR)"],
      legsJa: ["高山 ↔ 平湯温泉 ↔ 新穂高ロープウェイ（濃飛バス2日フリー乗車券 ¥4,400 • JR以外）"],
      tipEn: "Shinhotaka Ropeway Round-Trip (¥3,800 in Dining/Activities budget) climbs to 2,156m Nishihotakaguchi snow deck. Back in town by 15:30 for Sanmachi Old Town & soy-bonito ramen at Menya Shirakawa (Tabelog ★3.74).",
      tipJa: "新穂高ロープウェイ往復（¥3,800は食遊予算に含む）は標高2,156mの西穂高口雪の回廊が圧巻。15:30頃に高山へ戻り古い町並＆麺屋しらかわ（★3.74）。",
      slotsEn: [
        { id: "f11_1", timeFrom: "08:40", timeTo: "10:25", locFrom: "Takayama Bus Ctr", locTo: "Shinhotaka", category: "travel", desc: "Nohi Bus scenic mountain ride past Hirayu Onsen up to Shinhotaka Ropeway base" },
        { id: "f11_2", timeFrom: "10:30", timeTo: "13:30", locFrom: "Shinhotaka Base", locTo: "2,156m Summit", category: "sightseeing", desc: "Double-decker alpine gondola, Northern Alps 360° snow peaks & snow wall walk" },
        { id: "f11_3", timeFrom: "15:15", timeTo: "19:30", locFrom: "Sanmachi Suji", locTo: "Menya Shirakawa", category: "meal", desc: "Return to Takayama for historic merchant streets, Takayama Jinya & Chuka Soba dinner (★3.74)" }
      ],
      slotsJa: [
        { id: "f11_1", timeFrom: "08:40", timeTo: "10:25", locFrom: "高山濃飛バス", locTo: "新穂高温泉駅", category: "travel", desc: "濃飛バスで平湯温泉経由・新穂高ロープウェイへ（2日フリー券利用）" },
        { id: "f11_2", timeFrom: "10:30", timeTo: "13:30", locFrom: "しらかば平", locTo: "西穂高口展望台", category: "sightseeing", desc: "2階建てゴンドラで標高2,156mへ！白銀の笠ヶ岳・穂高連峰と雪の回廊散策" },
        { id: "f11_3", timeFrom: "15:15", timeTo: "19:30", locFrom: "さんまち通り", locTo: "麺屋しらかわ", category: "meal", desc: "高山に戻り古い町並散策・地酒試飲と「麺屋しらかわ」（★3.74）高山ラーメン" }
      ]
    },
    {
      regEn: "Matsumoto & Takasaki", regJa: "松本・高崎（群馬）",
      titleEn: "Takayama → Matsumoto Castle Snow Alps → JR to Takasaki (Gunma APA)",
      titleJa: "高山朝市 → 高速バスで国宝松本城＆手打ち蕎麦「野麦」→ 高崎アパホテル",
      subEn: "Direct trans-mountain bus via Abo Tunnel straight to snowy Matsumoto Castle, ★3.72 soba & Takasaki natural onsen base",
      subJa: "安房トンネル直通の横断山岳バスで松本へ！雪アルプス背景の松本城・そば名店「野麦」後、高崎APAへ",
      stay: 9000, travelBase: 11720, travelActualAdd: 0, fun: 9500,
      hotelEn: "APA Hotel Takasaki Ekimae", hotelJa: "アパホテル〈高崎駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 7320, totalAllLegs: 11720,
      legsEn: ["Takayama → Matsumoto Bus Terminal (Alpico/Nohi Bus ¥4,400 • Non-JR)", "Matsumoto → Nagano (JR Shinano Ltd Exp ¥2,370)", "Nagano → Takasaki (Hokuriku Shinkansen ¥4,950)"],
      legsJa: ["高山 → 松本バスターミナル（アルピコ/濃飛バス ¥4,400 • JR以外）", "松本 → 長野（JR特急しなの ¥2,370）", "長野 → 高崎（北陸新幹線 ¥4,950）"],
      tipEn: "Lunch at Matsumoto soba gem Nomugi (Tabelog ★3.72 — arrive before 12:30 as handmade kyuwari-soba sells out early!). APA Hotel Takasaki Ekimae connects directly to JR Takasaki Station & has natural hot spring baths.",
      tipJa: "松本ランチは百名店級の手打ちそば「野麦」（★3.72 • 売切れ注意で早め推奨）。アパホテル高崎駅前は駅直結＆天然温泉大浴場付で翌日草津への完璧な拠点。",
      slotsEn: [
        { id: "f12_1", timeFrom: "07:40", timeTo: "10:15", locFrom: "Miyagawa Market", locTo: "Matsumoto Stn", category: "travel", desc: "Stroll Takayama Miyagawa Morning Market, then 07:50 Alpico/Nohi Bus through Northern Alps to Matsumoto" },
        { id: "f12_2", timeFrom: "10:30", timeTo: "14:45", locFrom: "Matsumoto Castle", locTo: "Nomugi Soba", category: "meal", desc: "Store luggage at Matsumoto Stn; photograph Black Crow Castle against snow peaks + Nomugi soba lunch (★3.72) & Nawate Street" },
        { id: "f12_3", timeFrom: "15:10", timeTo: "18:05", locFrom: "JR Matsumoto", locTo: "APA Takasaki", category: "travel", desc: "JR Shinano to Nagano + Hokuriku Shinkansen to Takasaki & check in APA Hotel Takasaki Ekimae (Gunma Torimeshi dinner ★3.54)" }
      ],
      slotsJa: [
        { id: "f12_1", timeFrom: "07:40", timeTo: "10:15", locFrom: "宮川朝市", locTo: "松本駅", category: "travel", desc: "高山・宮川朝市散策後、安房トンネル直通の特急バスで松本バスターミナルへ" },
        { id: "f12_2", timeFrom: "10:30", timeTo: "14:45", locFrom: "国宝松本城", locTo: "野麦（手打ち蕎麦）", category: "meal", desc: "松本駅コインロッカー利用後、雪アルプス背景の松本城＆名店「御そば打処 野麦（★3.72）」ランチ" },
        { id: "f12_3", timeFrom: "15:10", timeTo: "18:05", locFrom: "JR松本駅", locTo: "アパ高崎駅前", category: "travel", desc: "JR特急しなの＋北陸新幹線で高崎へ移動しアパホテル高崎駅前泊（登利平 鳥めし等 ★3.54）" }
      ]
    },
    {
      regEn: "Gunma & Kusatsu Onsen", regJa: "群馬・草津温泉",
      titleEn: "Takasaki ↔ Kusatsu Onsen Snow Town (Yubatake, Yumomi & Sainokawara Bath)",
      titleJa: "高崎 ↔ 雪の草津温泉日帰り（湯畑の湯けむり・湯もみ・西の河原露天＆三国家そば）",
      subEn: "Easy JR Agatsuma Line + JR Bus up to steaming volcanic sulfur spring conduits in snow & top-rated stone-milled soba",
      subJa: "JR吾妻線＋JRバス関東で日本三名泉・草津へ！雪の中の湯畑、湯もみショー、石臼挽蕎麦「三国家」を満喫",
      stay: 9000, travelBase: 4020, travelActualAdd: 0, fun: 10500,
      hotelEn: "APA Hotel Takasaki Ekimae", hotelJa: "アパホテル〈高崎駅前〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 2460, totalAllLegs: 4020,
      legsEn: ["Takasaki ↔ Naganoharakusatsuguchi (JR Agatsuma Line ¥2,460 RT)", "Naganoharakusatsuguchi ↔ Kusatsu Onsen Bus Terminal (JR Bus Kanto ¥1,560 RT • Non-JR)"],
      legsJa: ["高崎 ↔ 長野原草津口（JR吾妻線 往復 ¥2,460）", "長野原草津口 ↔ 草津温泉バスターミナル（JRバス関東 往復 ¥1,560 • JR以外）"],
      tipEn: "Lunch at Ishiusubiki Soba Mikuniya (2 min from Yubatake, Tabelog ★3.49), enjoy warm steamed Matsumura Manju (★3.58), watch Netsunoyu Yumomi dance & soak in open-air Sainokawara Rotenburo surrounded by snow.",
      tipJa: "ランチは湯畑すぐ「石臼挽蕎麦 三国家」（★3.49）、おやつに松むら饅頭＆温泉卵（★3.58）。雪見の西の河原露天風呂入浴後に高崎アパへ帰着。",
      slotsEn: [
        { id: "f13_1", timeFrom: "08:20", timeTo: "10:25", locFrom: "JR Takasaki", locTo: "Kusatsu Bus Term", category: "travel", desc: "JR Agatsuma Line mountain train + seamless JR Bus transfer up into snowy Kusatsu" },
        { id: "f13_2", timeFrom: "10:35", timeTo: "13:30", locFrom: "Yubatake", locTo: "Mikuniya Soba", category: "meal", desc: "Steaming Yubatake sulfur field, Netsunoyu Yumomi stirring show & stone-milled soba at Mikuniya (★3.49)" },
        { id: "f13_3", timeFrom: "13:45", timeTo: "16:30", locFrom: "Sainokawara Park", locTo: "JR Bus / Takasaki", category: "sightseeing", desc: "Huge open-air Sainokawara snow hot spring soak, Yubatake dusk lights & return to Takasaki APA" }
      ],
      slotsJa: [
        { id: "f13_1", timeFrom: "08:20", timeTo: "10:25", locFrom: "JR高崎駅", locTo: "草津温泉", category: "travel", desc: "JR吾妻線〜長野原草津口駅乗換・JRバスで雪の草津温泉へ" },
        { id: "f13_2", timeFrom: "10:35", timeTo: "13:30", locFrom: "草津 湯畑", locTo: "三国家そば", category: "meal", desc: "湯畑散策＆熱乃湯湯もみ見学、「石臼挽蕎麦 三国家」（★3.49）ランチと湯畑温泉卵" },
        { id: "f13_3", timeFrom: "13:45", timeTo: "16:30", locFrom: "西の河原露天", locTo: "高崎駅", category: "sightseeing", desc: "開放感抜群の西の河原雪見露天風呂を堪能し夕方の列車・バスで高崎へ" }
      ]
    },
    {
      regEn: "Tokyo", regJa: "東京",
      titleEn: "Takasaki → Tokyo (Shinkansen): Meiji Jingu, Harajuku, Omotesando & Nakameguro",
      titleJa: "高崎 → 上越/北陸新幹線で東京帰着：明治神宮・原宿・表参道＆中目黒",
      subEn: "50-min bullet train back to Tokyo Day 4! Forested Meiji Jingu Shrine, Harajuku/Omotesando shopping & craft ramen",
      subJa: "新幹線50分で東京へ帰着！明治神宮の参道散歩から原宿・表参道・中目黒で都市型東京ステイ",
      stay: 15500, travelBase: 5500, travelActualAdd: 0, fun: 12000,
      hotelEn: "APA Hotel & Resort Nishishinjuku Gochome Eki Tower", hotelJa: "アパホテル＆リゾート〈西新宿五丁目駅タワー〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 4990, totalAllLegs: 5500,
      legsEn: ["Takasaki → Tokyo (Joetsu/Hokuriku Shinkansen ¥4,990)", "Tokyo Metro / Yamanote Line (¥510)"],
      legsJa: ["高崎 → 東京（上越/北陸新幹線 ¥4,990）", "山手線・都営大江戸線等（¥510）"],
      tipEn: "APA Nishishinjuku Gochome Eki Tower has an expansive outdoor/indoor onsen bath right beside Oedo Line. Try Ginza Hachigou or Shinjuku Fuunji ramen (Tabelog ★3.86) or Tonkatsu Maisen Omotesando (★3.68).",
      tipJa: "西新宿五丁目駅タワーのAPAは大江戸線徒歩1分・露天風呂付大浴場完備。夕食は原宿とんかつまい泉（★3.68）または新宿風雲児（★3.86）。",
      slotsEn: [
        { id: "f14_1", timeFrom: "09:15", timeTo: "10:10", locFrom: "JR Takasaki", locTo: "JR Tokyo", category: "travel", desc: "Morning Shinkansen Takasaki → Tokyo; hop Oedo Line to APA Nishishinjuku Gochome to drop bags" },
        { id: "f14_2", timeFrom: "11:30", timeTo: "16:30", locFrom: "Meiji Jingu", locTo: "Omotesando", category: "sightseeing", desc: "Meiji Jingu Shrine, Yoyogi Park plum blossoms, Omotesando architecture & Tonkatsu Maisen (★3.68)" },
        { id: "f14_3", timeFrom: "17:00", timeTo: "20:00", locFrom: "Shibuya", locTo: "Shinjuku", category: "meal", desc: "Shibuya / Nakameguro evening stroll & Shinjuku Fuunji tsukemen dinner (★3.86)" }
      ],
      slotsJa: [
        { id: "f14_1", timeFrom: "09:15", timeTo: "10:10", locFrom: "JR高崎駅", locTo: "西新宿五丁目APA", category: "travel", desc: "新幹線で東京着、大江戸線でアパホテル西新宿五丁目駅タワーへ荷物預け" },
        { id: "f14_2", timeFrom: "11:30", timeTo: "16:30", locFrom: "明治神宮", locTo: "表参道", category: "sightseeing", desc: "明治神宮参拝・代々木公園・表参道ショッピング＆とんかつまい泉青山（★3.68）" },
        { id: "f14_3", timeFrom: "17:00", timeTo: "20:00", locFrom: "中目黒・渋谷", locTo: "新宿駅", category: "meal", desc: "中目黒〜渋谷の夜散歩＆新宿の名店「風雲児」（★3.86）濃厚つけ麺" }
      ]
    },
    {
      regEn: "Tokyo", regJa: "東京",
      titleEn: "Tokyo Day 5 (Sun): Toyosu Market Sushi, Ginza, Akihabara & Farewell Feast",
      titleJa: "東京5日目(日)：豊洲市場寿司・築地場外・銀座＆秋葉原ショッピング",
      subEn: "Fresh Toyosu morning sushi (Sushi Dai / Daiwa ★3.78), Imperial East Gardens plum/sakura & Ginza/Akihabara Sunday pedestrian paradise",
      subJa: "朝の豊洲市場でおまかせ寿司（★3.78）、銀座歩行者天国＆秋葉原、皇居東御苑の冬花散歩",
      stay: 15500, travelBase: 900, travelActualAdd: 0, fun: 15000,
      hotelEn: "APA Hotel & Resort Nishishinjuku Gochome Eki Tower", hotelJa: "アパホテル＆リゾート〈西新宿五丁目駅タワー〉",
      hotelUrl: "https://www3.apahotel.com/", jrOnly: 300, totalAllLegs: 900,
      legsEn: ["Tokyo Metro / Yurikamome / JR Loop (¥900)"],
      legsJa: ["都営・東京メトロ・ゆりかもめ移動（¥900）"],
      tipEn: "Sundays turn Ginza Chuo-dori into a pedestrian promenade (Hokosha Tengoku). Enjoy Toyosu Market Edomae sushi (Tabelog ★3.78) in the morning and tax-free Ginza/Tokyo Station shopping in the afternoon!",
      tipJa: "日曜午後の銀座中央通りは歩行者天国！豊洲市場（大和寿司・寿司大 ★3.78）で早朝グルメ、午後は銀座〜秋葉原を回遊。",
      slotsEn: [
        { id: "f15_1", timeFrom: "07:30", timeTo: "10:15", locFrom: "Shinjuku", locTo: "Toyosu Market", category: "meal", desc: "Early sushi breakfast at Toyosu Market / Tsukiji Outer Market (Tabelog ★3.78)" },
        { id: "f15_2", timeFrom: "11:00", timeTo: "14:30", locFrom: "Tsukiji", locTo: "Ginza", category: "sightseeing", desc: "Imperial Palace East Gardens winter plum blossoms + Ginza Sunday pedestrian avenue" },
        { id: "f15_3", timeFrom: "15:00", timeTo: "19:30", locFrom: "Akihabara", locTo: "Tokyo Stn", category: "shopping", desc: "Akihabara electronics/pop-culture browsing & farewell Tokyo Station ramen street / Ginza Hachigou (★3.86)" }
      ],
      slotsJa: [
        { id: "f15_1", timeFrom: "07:30", timeTo: "10:15", locFrom: "新宿", locTo: "豊洲・築地", category: "meal", desc: "豊洲市場・築地場外で贅沢モーニング江戸前寿司（★3.78）" },
        { id: "f15_2", timeFrom: "11:00", timeTo: "14:30", locFrom: "皇居東御苑", locTo: "銀座歩行者天国", category: "sightseeing", desc: "皇居東御苑の冬花散策後、日曜の銀座中央通り歩行者天国を散歩" },
        { id: "f15_3", timeFrom: "15:00", timeTo: "19:30", locFrom: "秋葉原", locTo: "東京駅・銀座", category: "shopping", desc: "秋葉原＆東京駅周辺でショッピング、最終夜ラーメン・銀座八五（★3.86）等" }
      ]
    },
    {
      regEn: "Tokyo", regJa: "東京",
      titleEn: "Tokyo Last Morning Shopping → Haneda / Narita Airport (HND / NRT) Departure",
      titleJa: "東京最終日：新宿・東京駅お土産購入 → 羽田 / 成田空港 出発帰国",
      subEn: "Check out at 10:00, final Tokyo Station souvenir sweets & seamless express train to airport",
      subJa: "10時チェックアウト後、東京駅構内で最後の土産購入をして空港特急で帰国便へ",
      stay: 0, travelBase: 48070, travelActualAdd: 0, fun: 8000,
      hotelEn: "Departure Day (Tokyo Airport)", hotelJa: "帰国・出発日（東京空港）",
      hotelUrl: "", jrOnly: 3070, totalAllLegs: 3070,
      legsEn: ["Tokyo / Shinjuku → Narita Express or Haneda Monorail (¥3,070 + Return Flight ¥45,000 est.)"],
      legsJa: ["東京・新宿 → 成田エクスプレス / 羽田空港（¥3,070 ＋ 帰国便 ¥45,000目安）"],
      tipEn: "Tab 5 Pass Audit: Across this 16-day multi-company corridor (Fujikyu, Izukyu, Nohi Bus, Alpico Bus, Thunderbird/Shinkansen), total JR fares (~¥45k–¥49k) sit far below the 14-day Nationwide JR Pass (¥80,000), so paying point-to-point + the ¥6,500 Hokuriku One-Way Ticket saves >¥30,000!",
      tipJa: "タブ5検証：JR以外（富士急・伊豆急・濃飛/アルピコバス）を多く活用する周遊のため、全国JRパス(¥80,000)より「区間都度払い＋北陸片道きっぷ」が3万円以上お得！",
      slotsEn: [
        { id: "f16_1", timeFrom: "09:30", timeTo: "11:45", locFrom: "APA Nishishinjuku", locTo: "Tokyo Station", category: "shopping", desc: "Check out & pick up final packaged omiyage sweets inside JR Tokyo Station" },
        { id: "f16_2", timeFrom: "12:15", timeTo: "14:00", locFrom: "JR Tokyo", locTo: "HND / NRT Airport", category: "travel", desc: "Airport express train transfer & international flight home" }
      ],
      slotsJa: [
        { id: "f16_1", timeFrom: "09:30", timeTo: "11:45", locFrom: "西新宿APA", locTo: "東京駅", category: "shopping", desc: "チェックアウト後、東京駅ギフトキヨスク等でお土産最終購入" },
        { id: "f16_2", timeFrom: "12:15", timeTo: "14:00", locFrom: "東京駅", locTo: "羽田/成田空港", category: "travel", desc: "空港アクセス特急で空港へ移動・チェックイン後帰国" }
      ]
    }
  ];

  const { enDays, jaDays } = H.buildBilingualDays(start, daySpecs);
  daySpecs.forEach((s, i) => {
    enDays[i].timeSlots = s.slotsEn.slice();
    jaDays[i].timeSlots = s.slotsJa.slice();
  });

  const { enHotels, jaHotels } = H.buildBilingualHotels(start, [
    { startDay: 1, nights: 3, rate: 15500, nameEn: "APA Hotel & Resort Shinjuku Kabukicho Tower", nameJa: "アパホテル＆リゾート〈新宿歌舞伎町タワー〉", regEn: "Tokyo", regJa: "東京", url: "https://www3.apahotel.com/", accEn: "6-min walk from JR Shinjuku Station East/West Exits & Seibu Shinjuku Stn", accJa: "JR新宿駅・西武新宿駅至近・大浴場完備", hiEn: "Ideal West-Tokyo APA base with top-floor public bath & easy walking access to Shinjuku Fuji Excursion / Busta Shinjuku.", hiJa: "バスタ新宿・特急富士回遊乗り場へ徒歩圏内！最上階大浴場付で東京観光・河口湖日帰りに最適。" },
    { startDay: 4, nights: 2, rate: 9200, nameEn: "APA Hotel Shizuoka-eki Kita", nameJa: "アパホテル〈静岡駅北〉", regEn: "Shizuoka", regJa: "静岡", url: "https://www3.apahotel.com/", accEn: "5-min walk from JR Shizuoka Station North Exit", accJa: "JR静岡駅 北口徒歩5分", hiEn: "High-value Shizuoka hub just 28 min by JR Tokaido Line from Fujikawa Stn (EXPASA Starbucks) & direct Shinkansen to Kyoto.", hiJa: "富士川SAスタバ（JR富士川駅28分）＆静岡おでん青葉横丁、翌日の京都新幹線移動に抜群。" },
    { startDay: 6, nights: 3, rate: 13500, nameEn: "APA Hotel Kyoto Ekimae", nameJa: "アパホテル〈京都駅前〉", regEn: "Kyoto", regJa: "京都", url: "https://www3.apahotel.com/", accEn: "3-min walk from JR Kyoto Station Central Exit", accJa: "JR京都駅 中央口より徒歩3分", hiEn: "Weekend Kyoto base steps from Shinkansen, JR Inari/Arashiyama lines & City Bus hub.", hiJa: "週末の清水・北野天満宮梅苑・嵐山＆月曜朝サンダーバード金沢行きに最適な駅正面アパ。" },
    { startDay: 9, nights: 1, rate: 9500, nameEn: "APA Hotel Kanazawa Ekimae", nameJa: "アパホテル〈金沢駅前〉", regEn: "Kanazawa", regJa: "金沢", url: "https://www3.apahotel.com/", accEn: "1-min walk from JR Kanazawa Station West Exit", accJa: "JR金沢駅 金沢港口徒歩1分・天然温泉大浴場", hiEn: "Flagship hotel in APA's founding city featuring natural spa baths & instant access to Shirakawa-go bus terminal.", hiJa: "APA創業の地・金沢の駅直近ホテル！天然温泉大浴場＆白川郷バス停目の前。" },
    { startDay: 10, nights: 2, rate: 11500, nameEn: "Wat Hotel & Spa Hida Takayama (Closest APA-Tier Onsen Hotel)", nameJa: "ワットホテル＆スパ飛騨高山（高山にAPA未展開のため駅近同格宿）", regEn: "Takayama", regJa: "飛騨高山", url: "https://www.wathotel.com/", accEn: "7-min walk from JR Takayama & Nohi Bus Center", accJa: "JR高山駅・濃飛バスセンター徒歩7分・屋上貸切/大浴場天然温泉", hiEn: "APA operates no branch in Takayama proper; Wat Hotel & Spa mirrors APA's compact station-front convenience with rooftop hot springs for Shinhotaka & Shirakawa-go.", hiJa: "高山市内にAPA店舗がないため選定した駅近・天然温泉完備の同価格帯モダンホテル。" },
    { startDay: 12, nights: 2, rate: 9000, nameEn: "APA Hotel Takasaki Ekimae", nameJa: "アパホテル〈高崎駅前〉", regEn: "Gunma", regJa: "群馬・高崎", url: "https://www3.apahotel.com/", accEn: "Directly connected to JR Takasaki Station West Exit (pedestrian deck)", accJa: "JR高崎駅 西口直結・天然温泉大浴場完備", hiEn: "Zero-hassle Gunma rail hub with natural hot spring bath & morning JR Agatsuma Line access to snowy Kusatsu Onsen.", hiJa: "高崎駅ペデストリアンデッキ直結＆大浴場付。翌朝の草津温泉日帰りに最高。" },
    { startDay: 14, nights: 2, rate: 15500, nameEn: "APA Hotel & Resort Nishishinjuku Gochome Eki Tower", nameJa: "アパホテル＆リゾート〈西新宿五丁目駅タワー〉", regEn: "Tokyo", regJa: "東京", url: "https://www3.apahotel.com/", accEn: "1-min walk from Toei Oedo Nishishinjuku-gochome Stn (4 min to Shinjuku)", accJa: "都営大江戸線 西新宿五丁目駅 徒歩1分・大浴場/露天完備", hiEn: "Spacious large-bath APA Tower for your final two nights in West Tokyo before airport departure.", hiJa: "最終2泊は露天風呂・大浴場完備の大型アパタワーで東京ショッピングを締めくくり。" }
  ]);

  const gList = window.buildGourmetListFromLocations(["Tokyo", "Hakone", "IzuShizuoka", "Kyoto", "Kanazawa", "Takayama", "GunmaAlps"]);
  const aList = window.buildAccessListFromKeys(["Tokyo", "Onsen", "IzuShizuoka", "Kansai", "Kanazawa", "GunmaAlps"]);
  const gdList = window.buildGuidesListFromKeys(["Tokyo", "Onsen", "IzuShizuoka", "Kyoto", "Kanazawa", "Takayama", "GunmaAlps"]);
  const prep = H.buildPrep({
    en: [
      { id: "feb1", title: "Book 1 Month Early (Jan 21–24, 2027 at 10:00 JST): JR Fuji Excursion & JR Odoriko", sub: "Feb 23 is Emperor's Birthday holiday in Japan & late-Feb Kawazu-zakura sells out fast" },
      { id: "feb2", title: "Reserve Highway Buses: Kanazawa → Shirakawa-go → Takayama & Takayama → Matsumoto", sub: "Mandatory seat reservations open 1 month before travel via Nohi/Alpico Bus portals" },
      { id: "feb3", title: "Reserve Shibuya Sky Sunset Slot (4 Weeks Prior) & Plan Yamato Luggage Forwarding", sub: "Forward big suitcases from Shinjuku APA to Kyoto APA on Day 4 morning (~¥2,200) for stress-free Atami/Kawazu sightseeing" }
    ],
    ja: [
      { id: "feb1", title: "1ヶ月前10時予約（1/21〜24）：特急富士回遊・特急踊り子指定席", sub: "2/23(祝)前後＆河津桜ピークのため早め手配必須" },
      { id: "feb2", title: "高速バス座席予約（金沢〜白川郷〜高山・高山〜松本）", sub: "濃飛バス・アルピコ交通は全席予約制（乗車1ヶ月前発売）" },
      { id: "feb3", title: "渋谷スカイ4週間前予約＆宅急便手配（新宿APA→京都APA）", sub: "Day 4朝に大荷物を京都へ送ると熱海梅園・河津・富士川移動が極めて快適" }
    ]
  });

  const endStr = H.addDaysYmd(start, daySpecs.length - 1).ymd;
  return {
    id: "userpreset_feb2027_16d",
    labelEn: "[Winter] Tokyo, Kawazu Sakura, Fujikawa, Kyoto, Kanazawa, Takayama & Kusatsu (16 days)",
    labelJa: "[冬] 東京・河津桜・富士川SA・京都・金沢・飛騨高山＆草津温泉 (16日間)",
    startDate: start,
    endDate: endStr,
    customTitleEn: "Tokyo, Kawazu Sakura, Fujikawa SA, Kyoto, Kanazawa, Takayama & Kusatsu",
    customTitleJa: "東京・河津桜・富士川SA・京都・金沢・飛騨高山＆草津温泉",
    customSubtitleEn: "Feb 21 – Mar 8, 2027 • 16 Days / 15 Nights • Early Sakura + Winter Snow Alps • APA Hotel Focus",
    customSubtitleJa: "2027年2月21日(日)〜3月8日(月) • 16日間15泊 • 早咲き河津桜＆雪アルプス・温泉周遊（APAホテル拠点）",
    selectedPassId: "none",
    passStartDay: 1,
    customPassPrice: null,
    currencyCode: "SGD",
    fxRate: 122,
    paxCount: 1,
    budgetMode: "group",
    shareHotelRoom: true,
    taxFreeEnabled: false,
    dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
    dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} },
    shoppingList: []
  };
};
