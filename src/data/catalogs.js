// Currencies, Rail/Transit Pass Catalog, Curated Gourmet, Official Transit PDFs & Guides

window.CURRENCY_META = {
  SGD: { symbol: "S$", defaultRate: 122, name: "SGD" },
  USD: { symbol: "$", defaultRate: 155, name: "USD" },
  EUR: { symbol: "€", defaultRate: 168, name: "EUR" },
  GBP: { symbol: "£", defaultRate: 196, name: "GBP" },
  AUD: { symbol: "A$", defaultRate: 101, name: "AUD" },
  MYR: { symbol: "RM", defaultRate: 35, name: "MYR" },
  HKD: { symbol: "HK$", defaultRate: 20, name: "HKD" },
  TWD: { symbol: "NT$", defaultRate: 4.8, name: "TWD" },
  KRW: { symbol: "₩", defaultRate: 0.11, name: "KRW" }
};

window.JR_PASS_CATALOG = [
  { id: "none", nameEn: "No Rail Pass (Point-to-Point / IC Card Only)", nameJa: "鉄道パスなし（区間きっぷ・ICカード）", days: 0, price: 0, coversJr: false, nonJr: false },
  {
    id: "jreast10",
    nameEn: "JR East Pass (Tohoku Area • 10 Days)",
    nameJa: "JR EAST PASS（東北エリア・10日間）",
    days: 10,
    price: 48000,
    eligibleRegions: ["Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki", "Saitama", "Gunma", "Tokyo"],
    requiresRegions: ["Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki"]
  },
  {
    id: "jreast5",
    nameEn: "JR East Pass (Tohoku Area • 5 Days)",
    nameJa: "JR EAST PASS（東北エリア・5日間）",
    days: 5,
    price: 30000,
    eligibleRegions: ["Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki", "Saitama", "Gunma", "Tokyo"],
    requiresRegions: ["Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki"]
  },
  {
    id: "jrall7",
    nameEn: "Japan Rail Pass (Nationwide • 7 Days)",
    nameJa: "ジャパン・レール・パス（全国版・7日間）",
    days: 7,
    price: 50000,
    eligibleRegions: ["Hokkaido", "Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki", "Saitama", "Gunma", "Tokyo", "Chubu", "Kansai", "Chugoku", "Shikoku", "Kyushu"]
  },
  {
    id: "jrall14",
    nameEn: "Japan Rail Pass (Nationwide • 14 Days)",
    nameJa: "ジャパン・レール・パス（全国版・14日間）",
    days: 14,
    price: 80000,
    eligibleRegions: ["Hokkaido", "Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki", "Saitama", "Gunma", "Tokyo", "Chubu", "Kansai", "Chugoku", "Shikoku", "Kyushu"]
  },
  {
    id: "jrall21",
    nameEn: "Japan Rail Pass (Nationwide • 21 Days)",
    nameJa: "ジャパン・レール・パス（全国版・21日間）",
    days: 21,
    price: 100000,
    eligibleRegions: ["Hokkaido", "Tohoku", "Iwate-Aomori", "Aomori", "Miyagi", "Yamagata", "Tochigi-Ibaraki", "Saitama", "Gunma", "Tokyo", "Chubu", "Kansai", "Chugoku", "Shikoku", "Kyushu"]
  },
  {
    id: "hokuriku7",
    nameEn: "Hokuriku Arch Pass (Tokyo–Kanazawa–Kyoto–Osaka • 7d)",
    nameJa: "北陸アーチパス（東京〜金沢〜京都・大阪 7日間）",
    days: 7,
    price: 30000,
    eligibleRegions: ["Tokyo", "Chubu", "Kansai"],
    requiresRegions: ["Chubu"]
  },
  {
    id: "kansaiHiroshima5",
    nameEn: "JR West Kansai-Hiroshima Area Pass (5 Days)",
    nameJa: "JR西日本 関西・広島エリアパス（5日間）",
    days: 5,
    price: 17000,
    eligibleRegions: ["Kansai", "Chugoku"],
    requiresRegions: ["Kansai", "Chugoku"],
    excludeKeywords: ["tokaido shinkansen", "東海道新幹線"]
  },
  {
    id: "kansai5",
    nameEn: "JR West Kansai Wide Area Pass (5 Days)",
    nameJa: "JR西日本 関西ワイドエリアパス（5日間）",
    days: 5,
    price: 12000,
    eligibleRegions: ["Kansai"],
    requiresRegions: ["Kansai"],
    excludeKeywords: ["tokaido shinkansen", "東海道新幹線"]
  },
  {
    id: "kyushu7",
    nameEn: "JR Kyushu Rail Pass (All Kyushu • 7 Days)",
    nameJa: "JR九州レールパス（全九州・7日間）",
    days: 7,
    price: 25000,
    eligibleRegions: ["Kyushu"],
    requiresRegions: ["Kyushu"]
  },
  {
    id: "hokkaido7",
    nameEn: "JR Hokkaido Rail Pass (7 Days)",
    nameJa: "北海道レールパス（7日間）",
    days: 7,
    price: 26000,
    eligibleRegions: ["Hokkaido"],
    requiresRegions: ["Hokkaido"]
  },
  {
    id: "tokyosub3",
    nameEn: "Tokyo Subway 72-Hour Ticket (3 Days)",
    nameJa: "Tokyo Subway 72-hour Ticket（3日間）",
    days: 3,
    price: 1500,
    coversJr: false,
    nonJr: true,
    eligibleRegions: ["Tokyo"],
    requiresRegions: ["Tokyo"],
    nonJrKeywords: ["metro", "subway", "メトロ", "地下鉄", "都営"],
    maxDailyCovered: 1000
  },
  {
    id: "okinawaYui2",
    nameEn: "Okinawa Yui Rail 48-Hour Pass (2 Days • Naha)",
    nameJa: "沖縄ゆいレール 2日フリー乗車券（那覇市内）",
    days: 2,
    price: 1400,
    coversJr: false,
    nonJr: true,
    eligibleRegions: ["Okinawa"],
    requiresRegions: ["Okinawa"],
    nonJrKeywords: ["yui rail", "monorail", "ゆいレール"],
    maxDailyCovered: 1000
  }
];

window.GOURMET_BY_LOC = {
  Tokyo: [
    { regionEn: "Tokyo", regionJa: "東京", dishEn: "Edomae Omakase & Toyosu Market Sushi", dishJa: "江戸前寿司・豊洲市場おまかせ寿司", placeEn: "Sushi Dai / Daiwa Sushi (Toyosu Market)", placeJa: "寿司大・大和寿司（豊洲市場）", url: "https://www.toyosu-market.or.jp/en/", score: "★ 3.78", transitLevel: "easy", transitEn: "🟢 Station Walkable: 2-min walk from Yurikamome Shijomae Station", transitJa: "🟢 駅チカ：ゆりかもめ「市場前駅」徒歩2分", tagEn: "Must-Try (Tokyo)", tagJa: "厳選必食 (東京)", noteEn: "Fresh morning sushi flight featuring seasonal tuna, sea urchin, and conger eel right at Toyosu Market.", noteJa: "豊洲市場の新鮮な本マグロ・ウニ・穴子を味わう江戸前寿司の王道。" },
    { regionEn: "Tokyo", regionJa: "東京", dishEn: "Asakusa Unagi Hitsumabushi & Kabayaki", dishJa: "浅草 老舗うなぎ蒲焼・ひつまぶし", placeEn: "Unagi Irokawa / Hatsuogawa (Asakusa)", placeJa: "うなぎ色川・初小川（浅草）", url: "https://www.gotokyo.org/en/spot/41/index.html", score: "★ 3.72", transitLevel: "easy", transitEn: "🟢 Station Walkable: 4-min walk from Tokyo Metro Asakusa Station", transitJa: "🟢 駅チカ：東京メトロ「浅草駅」徒歩4分", tagEn: "Must-Try (Tokyo)", tagJa: "厳選必食 (東京)", noteEn: "Charcoal-broiled eel glazed in decades-old tare sauce near Senso-ji Kaminarimon.", noteJa: "浅草雷門近くで味わう秘伝ダレの炭火焼うなぎ。" },
    { regionEn: "Tokyo", regionJa: "東京", dishEn: "Artisanal Truffle Shoyu Ramen", dishJa: "特製トリュフ醤油ラーメン", placeEn: "Ginza Hachigou / Shinjuku Fuunji", placeJa: "銀座 八五／新宿 風雲児", url: "https://www.gotokyo.org/en/story/guide/ramen-guide/index.html", score: "★ 3.86", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from Higashi-Ginza / Shinjuku Station", transitJa: "🟢 駅チカ：東銀座駅・新宿駅 徒歩3分", tagEn: "Top Pick (Tokyo)", tagJa: "名店おすすめ (東京)", noteEn: "Golden duck-and-prosciutto dashi broth or ultra-rich tsukemen dipping noodles.", noteJa: "ミシュラン掲載の黄金スープ中華そばや濃厚魚介豚骨つけ麺。" },
    { regionEn: "Tokyo", regionJa: "東京", dishEn: "Aged Pork Tonkatsu (Hire & Rosu Cutlet)", dishJa: "低温熟成 とんかつ（特上ヒレ・ロース）", placeEn: "Tonkatsu Maisen Aoyama / Narikura", placeJa: "とんかつ まい泉 青山本店／成蔵", url: "https://mai-sen.com/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from Tokyo Metro Omotesando Station", transitJa: "🟢 駅チカ：表参道駅 徒歩3分", tagEn: "Top Pick (Tokyo)", tagJa: "名店おすすめ (東京)", noteEn: "Melt-in-your-mouth breaded pork cutlet served with freshly shredded cabbage and sweet tonkatsu sauce.", noteJa: "お箸で切れるほど柔らかい熟成豚のとんかつ。" }
  ],
  Kanazawa: [
    { regionEn: "Kanazawa & Kaga", regionJa: "金沢・加賀", dishEn: "Kaisen-don (Winter Snow Crab & Nodoguro Bowl)", dishJa: "近江町市場 海鮮丼（加能ガニ・のどぐろ・甘えび）", placeEn: "Omicho Market (Yamasho / Ikiiki-tei)", placeJa: "近江町市場（山さん寿司・いきいき亭）", url: "https://ohmicho-ichiba.com/", score: "★ 3.64", transitLevel: "easy", transitEn: "🟢 Walk / Loop Bus: 12-min walk or 5-min bus from JR Kanazawa Station", transitJa: "🟢 駅徒歩・バス：JR金沢駅から徒歩12分またはバス5分", tagEn: "Must-Try (Kanazawa)", tagJa: "厳選必食 (金沢)", noteEn: "Kanazawa's kitchen for 300 years—famous for Kano snow crab, fatty blackthroat seaperch (nodoguro), and sweet shrimp.", noteJa: "金沢の台所・近江町市場で味わう冬のズワイガニとのどぐろ海鮮丼。" },
    { regionEn: "Kanazawa & Kaga", regionJa: "金沢・加賀", dishEn: "Charcoal-Grilled Nodoguro & Kanazawa Oden", dishJa: "のどぐろ原始焼き・金沢おでん（車麩・カニ面）", placeEn: "Itaru Honten / Kuroyuri (Kanazawa Station)", placeJa: "いたる本店／黒百合（金沢駅百番街）", url: "https://visitkanazawa.jp/en/", score: "★ 3.71", transitLevel: "easy", transitEn: "🟢 Inside Station: Kuroyuri is inside JR Kanazawa Station Anto", transitJa: "🟢 駅直結：黒百合はJR金沢駅構内「あんと」直結", tagEn: "Must-Try (Kanazawa)", tagJa: "厳選必食 (金沢)", noteEn: "Dashi-soaked kurumafu (wheel gluten), baikai sea snails, and winter crab-shell Kanimen oden.", noteJa: "車麩やバイ貝、冬のカニ面など上品な出汁が染みた金沢おでん。" },
    { regionEn: "Kanazawa & Kaga", regionJa: "金沢・加賀", dishEn: "Hanton Rice & Champion Kanazawa Curry", dishJa: "金沢名物 ハントンライス＆金沢カレー", placeEn: "Grill Otsuka (Katamachi) / Turban Curry", placeJa: "グリルオーツカ（片町）／ターバンカレー", url: "https://visitkanazawa.jp/en/", score: "★ 3.59", transitLevel: "bus", transitEn: "🟡 Loop Bus: 10 min on Kanazawa Loop Bus to Korinbo, then 5-min walk", transitJa: "🟡 周遊バス：香林坊バス停より徒歩5分", tagEn: "Local Classic (Kanazawa)", tagJa: "ご当地名物 (金沢)", noteEn: "Ketchup-buttered rice topped with creamy soft-boiled egg, fried whitefish, shrimp, and house tartar sauce.", noteJa: "ふわとろ卵に白身魚フライとタルタルソースを添えた洋食名物。" },
    { regionEn: "Kanazawa & Kaga", regionJa: "金沢・加賀", dishEn: "Gold-Leaf Soft Serve & Matcha Parfait", dishJa: "金箔ソフトクリーム・加賀棒茶パフェ", placeEn: "Hakuichi Higashi Chaya District", placeJa: "箔一 東山店（ひがし茶屋街）", url: "https://kanazawa.hakuichi.co.jp/", score: "★ 3.55", transitLevel: "bus", transitEn: "🟡 Loop Bus: 10 min on Kanazawa Loop Bus to Hashibacho (Higashi Chaya)", transitJa: "🟡 周遊バス：橋場町バス停（ひがし茶屋街）徒歩3分", tagEn: "Must-Try (Kanazawa)", tagJa: "厳選必食 (金沢)", noteEn: "Rich milk soft-serve wrapped in a whole sheet of artisan Kanazawa edible gold leaf.", noteJa: "金沢伝統の食用金箔をまるごと1枚まとった華やかなソフトクリーム。" }
  ],
  Takayama: [
    { regionEn: "Takayama & Shirakawa-go", regionJa: "高山・白川郷", dishEn: "A5 Hida Beef Hoba Miso & Nigiri Sushi", dishJa: "飛騨牛 朴葉味噌焼き＆飛騨牛にぎり寿司", placeEn: "Hidagyu Maruaki / Kotteushi (Sanmachi Suji)", placeJa: "飛騨牛 丸明 飛騨高山店／こって牛", url: "https://www.hidagyu-maruaki.co.jp/", score: "★ 3.69", transitLevel: "easy", transitEn: "🟢 Station Walkable: 5-min walk from JR Takayama Station East Exit", transitJa: "🟢 駅チカ：JR高山駅 東口より徒歩5分", tagEn: "Must-Try (Takayama)", tagJa: "厳選必食 (高山)", noteEn: "Marbled Hida wagyu grilled over a dried magnolia leaf (hoba) with sweet mountain miso, plus seared wagyu sushi on crisp senbei.", noteJa: "香ばしい朴葉味噌と絡めるA5飛騨牛と、古い町並みの飛騨牛握り。" },
    { regionEn: "Takayama & Shirakawa-go", regionJa: "高山・白川郷", dishEn: "Takayama Chuka Soba (Soy-Bonito Ramen)", dishJa: "高山ラーメン（飛騨中華そば）", placeEn: "Menya Shirakawa / Masago Soba", placeJa: "麺屋しらかわ／まさごそば", url: "https://www.hida.jp/english/", score: "★ 3.74", transitLevel: "easy", transitEn: "🟢 Station Walkable: 8-min walk from JR Takayama Station", transitJa: "🟢 駅チカ：JR高山駅より徒歩8分", tagEn: "Must-Try (Takayama)", tagJa: "厳選必食 (高山)", noteEn: "Fine curly noodles simmered in a clear, aromatic soy-and-bonito broth.", noteJa: "鰹と醤油の深い旨みが広がる飛騨高山伝統の中華そば。" },
    { regionEn: "Takayama & Shirakawa-go", regionJa: "高山・白川郷", dishEn: "Shirakawa-go Irori Hearth Tofu & Gohei Mochi", dishJa: "白川郷 石豆腐・五平餅・飛騨牛朴葉定食", placeEn: "Irori / Shirakawago Gassho-zukuri Teahouses", placeJa: "いろり（白川郷合掌造り集落）", url: "https://shirakawa-go.gr.jp/en/", score: "★ 3.52", transitLevel: "bus", transitEn: "🟡 Bus Stop Walkable: 3-min walk from Shirakawa-go Bus Terminal", transitJa: "🟡 バス停すぐ：白川郷バスターミナル徒歩3分", tagEn: "Local Classic (Shirakawa-go)", tagJa: "厳選必食 (白川郷)", noteEn: "Firm mountain 'rope tofu' and walnut-miso Gohei rice skewers grilled beside a traditional thatched-roof hearth.", noteJa: "合掌造りの囲炉裏端で味わう堅豆腐と香ばしい五平餅。" },
    { regionEn: "Takayama & Shirakawa-go", regionJa: "高山・白川郷", dishEn: "Mitarashi Dango (Savory Soy-Grilled Rice Skewers)", dishJa: "飛騨高山 みたらし団子（香ばしい醤油焼き）", placeEn: "Jinya-dori & Miyagawa Morning Market Stalls", placeJa: "陣屋前・宮川朝市のだんご屋台", url: "https://www.asaichi.net/", score: "★ 3.50", transitLevel: "easy", transitEn: "🟢 Station Walkable: 10-min walk from JR Takayama Station", transitJa: "🟢 駅徒歩圏：JR高山駅より徒歩10分", tagEn: "Street Snack (Takayama)", tagJa: "食べ歩き (高山)", noteEn: "Unlike sweet mitarashi elsewhere, Takayama's skewers are brushed with pure aged tamari soy sauce and toasted over charcoal.", noteJa: "砂糖を使わず香ばしい醤油ダレで焼き上げる飛騨高山の名物団子。" }
  ],
  Sapporo: [
    { regionEn: "Sapporo & Otaru", regionJa: "札幌・小樽", dishEn: "Sapporo Rich Miso Ramen with Corn & Butter", dishJa: "札幌濃厚味噌ラーメン（バターコーン）", placeEn: "Sapporo Sumire / Ganso Ramen Yokocho (Susukino)", placeJa: "すみれ 札幌すすきの店／元祖さっぽろラーメン横丁", url: "https://www.sumireya.com/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 3-min walk from Subway Susukino Station", transitJa: "🟢 駅チカ：地下鉄南北線「すすきの駅」徒歩3分", tagEn: "Must-Try (Sapporo)", tagJa: "厳選必食 (札幌)", noteEn: "Piping-hot wok-seared miso broth sealed with a layer of savory lard over golden egg noodles.", noteJa: "ラードが蓋をする熱々の濃厚味噌スープと熟成ちぢれ麺。" },
    { regionEn: "Sapporo & Otaru", regionJa: "札幌・小樽", dishEn: "Jingisukan (Charcoal-Grilled Hokkaido Lamb)", dishJa: "北海道名物 成吉思汗（生ラムジンギスカン）", placeEn: "Daruma Honten (Susukino)", placeJa: "成吉思汗だるま 本店（すすきの）", url: "https://sapporo-jingisukan.info/", score: "★ 3.71", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 4-min walk from Subway Susukino Station", transitJa: "🟢 駅チカ：地下鉄「すすきの駅」徒歩4分", tagEn: "Must-Try (Sapporo)", tagJa: "厳選必食 (札幌)", noteEn: "Founded 1954—fresh, never-frozen mutton and lamb grilled on a slotted cast-iron dome with sweet onions.", noteJa: "1954年創業、スリット入り兜鍋で焼く臭みのない新鮮生ラム。" },
    { regionEn: "Sapporo & Otaru", regionJa: "札幌・小樽", dishEn: "Sapporo Soup Curry with Crispy Chicken Leg & Hokkaido Veggies", dishJa: "札幌スープカレー（パリパリ知床鶏＆彩り道産野菜）", placeEn: "Garaku / Suage+ (Odori & Susukino)", placeJa: "スープカレー GARAKU／Suage+（大通・すすきの）", url: "https://s-garaku.com/", score: "★ 3.74", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 3-min walk from Odori / Susukino Station", transitJa: "🟢 駅チカ：地下鉄「大通駅」「すすきの駅」徒歩3分", tagEn: "Must-Try (Sapporo)", tagJa: "厳選必食 (札幌)", noteEn: "Aromatic spiced curry broth infused with Japanese bonito dashi and loaded with sweet Hokkaido pumpkin, lotus root, and potato.", noteJa: "和風出汁とスパイスが香るスープに素揚げ道産野菜がたっぷり。" },
    { regionEn: "Sapporo & Otaru", regionJa: "札幌・小樽", dishEn: "Otaru Canal Sushi & Sankaku Market King Crab Bowl", dishJa: "小樽寿司屋通り 旬握り＆三角市場 カニ・ウニ海鮮丼", placeEn: "Otaru Masazushi Honten / Takinami Shokudo", placeJa: "おたる政寿司 本店／小樽三角市場 滝波食堂", url: "https://www.masazushi.co.jp/", score: "★ 3.62", transitLevel: "easy", transitEn: "🟢 Station Walkable: Sankaku Market is a 1-min walk from JR Otaru Station", transitJa: "🟢 駅すぐ：三角市場はJR小樽駅徒歩1分・政寿司は徒歩10分", tagEn: "Must-Try (Otaru)", tagJa: "厳選必食 (小樽)", noteEn: "Shakotan sea urchin, herring, sweet botan shrimp, and snow crab right beside Otaru Station and Otaru Canal.", noteJa: "JR小樽駅すぐの三角市場や寿司屋通りで味わうウニ・ボタンエビ。" },
    { regionEn: "Sapporo & Otaru", regionJa: "札幌・小樽", dishEn: "LeTAO Double Fromage Cheesecake (Otaru Main Shop)", dishJa: "ルタオ ドゥーブルフロマージュ（小樽本店）", placeEn: "LeTAO Pathos / Main Shop (Sakaimachi Street)", placeJa: "小樽洋菓子舗ルタオ 本店（堺町通り）", url: "https://www.letao.jp/", score: "★ 3.65", transitLevel: "easy", transitEn: "🟢 Station Walkable: 7-min walk from JR Minami-Otaru Station", transitJa: "🟢 駅チカ：JR南小樽駅より徒歩7分", tagEn: "Sweet Pick (Otaru)", tagJa: "スイーツ必食 (小樽)", noteEn: "Two-layer baked and mascarpone no-bake Hokkaido cheesecake served fresh in the nostalgic Sakaimachi bell-tower salon.", noteJa: "北海道産生クリームとマスカルポーネがとろける二層チーズケーキ。" }
  ],
  Noboribetsu: [
    { regionEn: "Furano & Noboribetsu", regionJa: "富良野・登別", dishEn: "Noboribetsu Enma Yakisoba (Spicy Sesame Flat Noodles)", dishJa: "登別閻魔やきそば（ピリ辛ゴマ風味平打ち麺）", placeEn: "Onsen Ichiba / Sobadokoro Fukuan (Gokuraku Street)", placeJa: "温泉市場／そば処 福庵（登別温泉 極楽通り）", url: "https://noboribetsu-spa.jp/en/", score: "★ 3.49", transitLevel: "bus", transitEn: "🟡 Direct Bus: 15 min on Donan Bus from JR Noboribetsu Station to Onsen Terminal", transitJa: "🟡 バス直結：JR登別駅から道南バス15分「登別温泉」徒歩3分", tagEn: "Must-Try (Noboribetsu)", tagJa: "厳選必食 (登別)", noteEn: "Hokkaido wheat flat noodles tossed in a fiery sesame-chili 'Demon King' sauce with local seafood.", noteJa: "登別温泉街の名物！北海道産小麦の平打ち麺に特製ピリ辛ゴマダレ。" },
    { regionEn: "Furano & Noboribetsu", regionJa: "富良野・登別", dishEn: "Hell Valley Steamed Seafood & Noboribetsu Dairy Pudding", dishJa: "地獄蒸し海鮮・のぼりべつ酪農館プリン", placeEn: "Onsen Ichiba & Dosanko Pudding (Jigokudani Walk)", placeJa: "温泉市場＆道産子ぷりん（地獄谷歩道入口）", url: "https://noboribetsu-spa.jp/en/", score: "★ 3.51", transitLevel: "bus", transitEn: "🟡 Onsen Walkable: 3-min walk along Gokuraku Shopping Street", transitJa: "🟡 温泉街徒歩圏：極楽通り沿い徒歩3分", tagEn: "Onsen Treat", tagJa: "温泉街グルメ", noteEn: "Volcano-shore scallops and silky milk pudding crafted from Noboribetsu pasture cream.", noteJa: "噴火湾産の活ホタテ焼きと濃厚な登別牛乳プリン。" },
    { regionEn: "Furano & Noboribetsu", regionJa: "富良野・登別", dishEn: "Furano Omelet Curry & Lavender Soft Serve", dishJa: "富良野オムカレー＆ファーム富田 ラベンダーソフト", placeEn: "Yuiga Doxon / Farm Tomita (Nakafurano)", placeJa: "唯我独尊／ファーム富田（中富良野）", url: "https://www.farm-tomita.co.jp/en/", score: "★ 3.66", transitLevel: "easy", transitEn: "🟢 Station Walkable: Yuiga Doxon is a 3-min walk from JR Furano Station", transitJa: "🟢 駅チカ：唯我独尊はJR富良野駅徒歩3分・ファーム富田はラベンダー畑駅徒歩7分", tagEn: "Must-Try (Furano)", tagJa: "厳選必食 (富良野)", noteEn: "Rich dark curry with homemade smoked sausage and fluffy Furano egg, followed by lavender-infused soft serve.", noteJa: "自家製ソーセージと富良野産卵のオムカレー＆名物ラベンダーソフト。" },
    { regionEn: "Furano & Noboribetsu", regionJa: "富良野・登別", dishEn: "Shiraoi Wagyu Beef & Snow Crab Kaiseki Buffet", dishJa: "白老牛・ズワイガニ温泉会席＆ビュッフェ", placeEn: "Dai-ichi Takimotokan Dining (Noboribetsu)", placeJa: "第一滝本館 ダイニング（登別温泉）", url: "https://takimotokan.co.jp/en/", score: "★ 3.60", transitLevel: "bus", transitEn: "🟡 Inside Onsen Hotel: Right across from Jigokudani Hell Valley", transitJa: "🟡 宿直結：地獄谷目の前の第一滝本館内", tagEn: "Onsen Feast", tagJa: "温泉美食", noteEn: "Enjoy Hokkaido snow crab legs and seared Shiraoi wagyu after soaking in 5 different mineral hot spring waters.", noteJa: "5つの泉質の硫黄泉・大浴場を満喫した後に味わうズワイガニと白老牛。" }
  ],
  Hakodate: [
    { regionEn: "Hakodate", regionJa: "函館", dishEn: "Hakodate Morning Market Live Dancing Squid & Uni-Ikura Bowl", dishJa: "函館朝市 活イカ踊り丼＆三色うに・いくら丼", placeEn: "Kikuyo Shokudo / Ekini Market (Hakodate Asaichi)", placeJa: "きくよ食堂 本店／駅二市場（函館朝市）", url: "https://www.hakodate-asaichi.com/", score: "★ 3.64", transitLevel: "easy", transitEn: "🟢 Right Outside Station: 2-min walk from JR Hakodate Station West Exit", transitJa: "🟢 駅前すぐ：JR函館駅 西口より徒歩2分", tagEn: "Must-Try (Hakodate)", tagJa: "厳選必食 (函館)", noteEn: "Translucent freshly caught Tsugaru Strait squid and Bafun sea urchin served over steamed rice.", noteJa: "JR函館駅すぐの朝市で味わう透き通った活イカと無添加生ウニ丼。" },
    { regionEn: "Hakodate", regionJa: "函館", dishEn: "Crystal-Clear Hakodate Shio (Salt) Ramen", dishJa: "函館名物 黄金澄まし塩ラーメン", placeEn: "Ajisai Honten / Shinano (Hakodate Station)", placeJa: "函館麺厨房 あじさい 本店／滋養軒（函館駅前）", url: "https://www.ajisai.tv/", score: "★ 3.67", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from JR Hakodate Station; Ajisai at Goryokaku", transitJa: "🟢 駅チカ：滋養軒はJR函館駅徒歩3分・あじさいは五稜郭公園前", tagEn: "Must-Try (Hakodate)", tagJa: "厳選必食 (函館)", noteEn: "Delicate kelp-and-pork clear salt broth with straight noodles—the pride of southern Hokkaido.", noteJa: "道南昆布と豚骨・鶏ガラの澄み切った黄金塩スープ。" },
    { regionEn: "Hakodate", regionJa: "函館", dishEn: "Chinese Chicken Burger & Lucky Egg Burger", dishJa: "ラッキーピエロ チャイニーズチキンバーガー", placeEn: "Lucky Pierrot Bay Area Main Shop", placeJa: "ラッキーピエロ ベイエリア本店（金森赤レンガ倉庫）", url: "https://luckypierrot.jp/", score: "★ 3.56", transitLevel: "easy", transitEn: "🟢 Tram Walkable: 3-min walk from Jujigai Tram Stop (Kanemori Red Brick Warehouse)", transitJa: "🟢 市電すぐ：市電「十字街」電停より徒歩3分", tagEn: "Local Icon (Hakodate)", tagJa: "ご当地必食 (函館)", noteEn: "Found only in Hakodate! Sweet-and-tangy fried chicken pieces with crisp lettuce and mayo on a sesame bun.", noteJa: "函館限定の超人気ご当地バーガー！甘辛唐揚げが絶品。" },
    { regionEn: "Hakodate", regionJa: "函館", dishEn: "Hasegawa Store Yakitori Bento (Pork Skewers on Seaweed Rice)", dishJa: "ハセガワストア やきとり弁当（道南流・豚精肉串）", placeEn: "Hasegawa Store Bay Area Branch", placeJa: "ハセガワストア ベイエリア店（金森倉庫隣）", url: "https://www.hasesto.jp/", score: "★ 3.53", transitLevel: "easy", transitEn: "🟢 Tram Walkable: 3-min walk from Jujigai Tram Stop (next to Lucky Pierrot)", transitJa: "🟢 市電すぐ：ラッキーピエロ隣のベイエリア店", tagEn: "Soul Food (Hakodate)", tagJa: "ソウルフード (函館)", noteEn: "In southern Hokkaido, 'yakitori' means juicy Hakodate-wine-sprayed pork skewers grilled over nori rice.", noteJa: "注文後に隠し味の函館ワインを吹きかけて炭火焼きにする豚串弁当。" }
  ],
  Fukuoka: [
    { regionEn: "Fukuoka & Hakata", regionJa: "福岡・博多", dishEn: "Creamy Hakata Tonkotsu Ramen (with Kaedama Refill)", dishJa: "本場 博多豚骨ラーメン（極細麺・替玉）", placeEn: "Hakata Issou / ShinShin / Ichiran Main Shop", placeJa: "博多一双 博多駅東本店／博多らーめん ShinShin", url: "https://www.hakata-issou.com/", score: "★ 3.74", transitLevel: "easy", transitEn: "🟢 Station Walkable: 5-min walk from JR Hakata Station Chikushi Exit", transitJa: "🟢 駅チカ：JR博多駅 筑紫口より徒歩5分", tagEn: "Must-Try (Fukuoka)", tagJa: "厳選必食 (福岡)", noteEn: "Frothy 'pork-bone cappuccino' broth simmered for hours and paired with ultra-thin al dente wheat noodles.", noteJa: "泡立つ濃厚『豚骨カプチーノ』スープと極細ストレート麺。" },
    { regionEn: "Fukuoka & Hakata", regionJa: "福岡・博多", dishEn: "Hakata Motsunabe (Beef Tripe Hotpot in Miso/Soy Garlic Broth)", dishJa: "博多もつ鍋（濃厚味噌・醤油にんにく仕立て）", placeEn: "Hakata Motsunabe Yamanaka / Oyama (Hakata Station)", placeJa: "博多もつ鍋 やま中／おおやま（博多駅直結）", url: "https://www.motu-ooyama.com/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Inside Station: KITTE Hakata & JR Hakata City dining floors", transitJa: "🟢 駅直結：KITTE博多・JR博多シティ直結", tagEn: "Must-Try (Fukuoka)", tagJa: "厳選必食 (福岡)", noteEn: "Plump Wagyu small-intestine simmered with mounds of chives, cabbage, burdock, and Kyushu miso—finished with champon noodles.", noteJa: "ぷりぷりの国産牛もつとニラ・キャベツを特製味噌スープで。" },
    { regionEn: "Fukuoka & Hakata", regionJa: "福岡・博多", dishEn: "Hakata Mizutaki (Milky Rich Chicken Collagen Hotpot)", dishJa: "博多水炊き（白濁鶏コラーゲンスープ）", placeEn: "Hakata Hanamidori / Toriden", placeJa: "博多華味鳥 博多駅前店／水たき長野", url: "https://www.hanamidori.net/", score: "★ 3.63", transitLevel: "easy", transitEn: "🟢 Station Walkable: 4-min walk from JR Hakata Station", transitJa: "🟢 駅チカ：JR博多駅より徒歩4分", tagEn: "Must-Try (Fukuoka)", tagJa: "厳選必食 (福岡)", noteEn: "Start with golden chicken bone consommé, then dip tender Kyushu chicken and minced tsukune in citrus ponzu.", noteJa: "濃厚な白濁鶏スープをまず湯呑みで味わい、自家製ポン酢でいただく伝統鍋。" },
    { regionEn: "Fukuoka & Hakata", regionJa: "福岡・博多", dishEn: "Nakasu & Tenjin Open-Air Yatai Stalls (Grilled Ramen & Oden)", dishJa: "中洲・天神 屋台めぐり（焼きラーメン・博多一口餃子）", placeEn: "Kokinchan / Nakasu Riverbank Yatai", placeJa: "屋台 小金ちゃん（天神）／中洲那珂川沿い屋台群", url: "https://gofukuoka.jp/", score: "★ 3.60", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 3-min walk from Subway Tenjin or Nakasu-Kawabata Station", transitJa: "🟢 駅チカ：地下鉄「天神駅」「中洲川端駅」徒歩3分", tagEn: "Night Icon (Fukuoka)", tagJa: "名物屋台 (福岡)", noteEn: "Sizzling tonkotsu-sauce 'Yaki-Ramen', bite-sized crispy gyoza, and mentaiko tamagoyaki at Fukuoka's iconic street stalls.", noteJa: "発祥の『焼きラーメン』や博多一口餃子を屋台の活気とともに。" },
    { regionEn: "Fukuoka & Hakata", regionJa: "福岡・博多", dishEn: "Ganso Hakata Mentaiju (Whole Spicy Cod Roe on Kelp-Wrapped Rice)", dishJa: "元祖博多めんたい重（昆布巻き明太子一腹乗せ）", placeEn: "Ganso Hakata Mentaiju (Nishinakasu)", placeJa: "元祖博多めんたい重（西中洲）", url: "https://www.mentaiju.com/", score: "★ 3.66", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 5-min walk from Subway Nakasu-Kawabata or Tenjin Station", transitJa: "🟢 駅チカ：地下鉄「中洲川端駅」「天神駅」徒歩5分", tagEn: "Top Pick (Fukuoka)", tagJa: "名店おすすめ (福岡)", noteEn: "A whole kelp-wrapped marinated pollack roe over hot nori rice with special umami sauce.", noteJa: "昆布巻き明太子をまるごと1本乗せた贅沢なお重。" }
  ],
  Beppu: [
    { regionEn: "Beppu, Yufuin & Kurokawa", regionJa: "別府・由布院・黒川温泉", dishEn: "Beppu Jigoku-Mushi (Natural Geothermal Hot Spring Steam Cooking)", dishJa: "別府 鉄輪温泉 地獄蒸し工房（天然温泉蒸気蒸し）", placeEn: "Jigoku Mushi Kobo Kannawa (Beppu Hells)", placeJa: "地獄蒸し工房 鉄輪（別府海地獄・かまど地獄近く）", url: "https://www.city.beppu.oita.jp/", score: "★ 3.58", transitLevel: "bus", transitEn: "🟡 Direct Bus: 20 min on Kamenoi Bus #5/#7 from JR Beppu Station to Kannawa", transitJa: "🟡 バス直結：JR別府駅から亀の井バス20分「鉄輪」バス停徒歩2分", tagEn: "Must-Try (Beppu)", tagJa: "厳選必食 (別府)", noteEn: "Cook Bungo seafood, sweet potatoes, dim sum, and eggs in 98°C natural volcanic steam vents.", noteJa: "摂氏98度の天然温泉噴気で魚介や野菜を一気に蒸し上げる別府体験。" },
    { regionEn: "Beppu, Yufuin & Kurokawa", regionJa: "別府・由布院・黒川温泉", dishEn: "Oita Toriten (Citrus-Ponzu Chicken Tempura) & Dango-jiru", dishJa: "大分名物 元祖とり天＆だんご汁", placeEn: "Toyotsune Honten (Beppu Ekimae)", placeJa: "とよ常 別府駅前店／東洋軒", url: "https://www.toyotsune.com/", score: "★ 3.65", transitLevel: "easy", transitEn: "🟢 Station Walkable: 2-min walk from JR Beppu Station East Exit", transitJa: "🟢 駅すぐ：JR別府駅 東口より徒歩2分", tagEn: "Must-Try (Beppu)", tagJa: "厳選必食 (別府)", noteEn: "Crisp tempura-battered chicken tenders dipped in kabosu citrus soy sauce with hot mustard.", noteJa: "サクサク衣にカボス酢醤油と辛子をつけて味わう大分のソウルフード。" },
    { regionEn: "Beppu, Yufuin & Kurokawa", regionJa: "別府・由布院・黒川温泉", dishEn: "Yufuin Bungo Beef Mabushi (Claypot Charcoal Wagyu Rice)", dishJa: "由布院名物 豊後牛まぶし（炭火焼土鍋ご飯）", placeEn: "Yufu Mabushi Shin (Ekimae / Kinrinko Branch)", placeJa: "由布まぶし 心（由布院駅前支店・金鱗湖本店）", url: "https://www.yufuin.gr.jp/", score: "★ 3.69", transitLevel: "easy", transitEn: "🟢 Right Outside Station: 1-min walk from JR Yufuin Station", transitJa: "🟢 駅前すぐ：JR由布院駅より徒歩1分（金鱗湖本店もあり）", tagEn: "Must-Try (Yufuin)", tagJa: "厳選必食 (由布院)", noteEn: "Claypot rice topped with charcoal-seared Oita Bungo Wagyu enjoyed three ways.", noteJa: "炭火で焼き上げた豊後牛を一人前ずつの土鍋ご飯で3通りに味わう逸品。" },
    { regionEn: "Beppu, Yufuin & Kurokawa", regionJa: "別府・由布院・黒川温泉", dishEn: "Kurokawa Onsen Patisserie Roku Cream Puff & Akaushi Croquette", dishJa: "黒川温泉 パティスリー麓の塩麹シュー＆あか牛コロッケ", placeEn: "Patisserie Roku (Kurokawa Onsen Kawabata Street)", placeJa: "パティスリー麓（黒川温泉 いご坂・川端通り）", url: "https://www.kurokawaonsen.or.jp/free/engo", score: "★ 3.59", transitLevel: "bus", transitEn: "🟡 Onsen Walkable: Center of Kurokawa Onsen village (5-min walk from bus stop)", transitJa: "🟡 温泉街中心：黒川温泉バス停より徒歩5分", tagEn: "Onsen Stroll (Kurokawa)", tagJa: "湯めぐり食べ歩き (黒川)", noteEn: "Freshly piped Oguni Jersey milk custard cream puffs while hopping open-air baths with a Nyuto Tegata pass.", noteJa: "入湯手形で露天風呂めぐりをしながら味わう小国ジャージー牛乳シュー。" }
  ],
  Kumamoto: [
    { regionEn: "Kumamoto & Mt. Aso", regionJa: "熊本・阿蘇", dishEn: "Aso Akaushi Don (Seared Red Wagyu Steak Bowl with Onsen Egg)", dishJa: "阿蘇名物 あか牛丼（レアステーキ＆温泉卵）", placeEn: "Imakin Shokudo (Uchinomaki) / Yoka-Yoka (Kumamoto Stn)", placeJa: "いまきん食堂（阿蘇内牧）／あか牛ダイニング yoka-yoka（熊本駅）", url: "https://kumamoto.guide/en/", score: "★ 3.71", transitLevel: "easy", transitEn: "🟢 Station Connected: Yoka-Yoka is inside JR Kumamoto Station Amu Plaza", transitJa: "🟢 駅直結：yoka-yokaはJR熊本駅ビル・桜町バスターミナル直結", tagEn: "Must-Try (Kumamoto)", tagJa: "厳選必食 (熊本)", noteEn: "Grass-fed Aso brown cattle seared medium-rare and crowned with an onsen egg and miso glaze.", noteJa: "阿蘇の草原で育ったヘルシーで旨み濃厚な『あか牛』のレアステーキ丼。" },
    { regionEn: "Kumamoto & Mt. Aso", regionJa: "熊本・阿蘇", dishEn: "Kumamoto Black-Garlic Ma-yu Tonkotsu Ramen", dishJa: "熊本ラーメン（焦がしニンニク黒マー油豚骨）", placeEn: "Kokutei / Keika Ramen Honten", placeJa: "熊本ラーメン 黒亭／桂花ラーメン 本店", url: "https://www.kokutei.co.jp/", score: "★ 3.67", transitLevel: "easy", transitEn: "🟢 Station Connected: Kokutei has a branch directly inside JR Kumamoto Station", transitJa: "🟢 駅直結：黒亭はJR熊本駅構内よかモン市場にも店舗あり", tagEn: "Must-Try (Kumamoto)", tagJa: "厳選必食 (熊本)", noteEn: "Rich pork-and-chicken broth drizzled with fragrant roasted black garlic oil (ma-yu) and twin egg yolks.", noteJa: "香ばしい焦がしニンニク油（マー油）と卵黄入りがトレードマークの熊本豚骨。" },
    { regionEn: "Kumamoto & Mt. Aso", regionJa: "熊本・阿蘇", dishEn: "Premium Kumamoto Basashi (Marbled Horsemeat Sashimi & Grill)", dishJa: "本場 熊本馬刺し（霜降り・たてがみ・桜焼肉）", placeEn: "Suganoya (Shimotori / Kumamoto Station)", placeJa: "馬肉料理 菅乃屋（下通店・JR熊本駅店）", url: "https://service.suganoya.com/", score: "★ 3.69", transitLevel: "easy", transitEn: "🟢 Station / Tram Walkable: Inside JR Kumamoto Station or Torichosuji Tram Stop", transitJa: "🟢 駅直結・市電すぐ：JR熊本駅または市電「通町筋」徒歩2分", tagEn: "Must-Try (Kumamoto)", tagJa: "厳選必食 (熊本)", noteEn: "Kumamoto's signature delicacy served with sweet Kyushu soy sauce, grated ginger, and garlic.", noteJa: "熊本城観光の夜に欠かせない、とろける霜降り馬刺しと桜鍋。" },
    { regionEn: "Kumamoto & Mt. Aso", regionJa: "熊本・阿蘇", dishEn: "Ikinari Dango (Steamed Sweet Potato & Red Bean Mochi Bun)", dishJa: "熊本銘菓 いきなり団子（蒸したてサツマイモ＆粒あん）", placeEn: "Kouzakai / Josaien Castle Town (Kumamoto Castle)", placeJa: "くま純／熊本城 桜の馬場 城彩苑", url: "https://www.sakuranobaba-johsaien.jp/", score: "★ 3.52", transitLevel: "easy", transitEn: "🟢 Castle Walkable: Right at the foot of Kumamoto Castle (Josaien)", transitJa: "🟢 城下・駅直結：熊本城ふもと「城彩苑」およびJR熊本駅構内", tagEn: "Sweet Classic (Kumamoto)", tagJa: "名物甘味 (熊本)", noteEn: "Thick slice of sweet Kumamoto sweet potato topped with azuki bean paste, wrapped in salted mochi dough.", noteJa: "ホクホクの厚切りサツマイモと粒あんを塩味の効いた生地で包んで蒸した郷土菓子。" }
  ],
  Kyoto: [
    { regionEn: "Kyoto", regionJa: "京都", dishEn: "Arashiyama Yudofu (Silky Bamboo-Basket Simmered Tofu Kaiseki)", dishJa: "嵐山・南禅寺 伝統湯豆腐会席", placeEn: "Yudofu Sagano / Nanzenji Junsei", placeJa: "湯豆腐 嵯峨野（嵐山）／南禅寺 順正", url: "https://www.tofu-junsei.co.jp/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Station Walkable: 6-min walk from Randen/JR Arashiyama or Subway Keage Station", transitJa: "🟢 駅チカ：嵐電「嵐山駅」または地下鉄東西線「蹴上駅」徒歩6分", tagEn: "Must-Try (Kyoto)", tagJa: "厳選必食 (京都)", noteEn: "Silken Kyoto spring-water tofu simmered gently in kelp broth inside a historic stroll garden.", noteJa: "名水で仕込んだなめらかな京豆腐を日本庭園を眺めながら味わう伝統料理。" },
    { regionEn: "Kyoto", regionJa: "京都", dishEn: "Kyoto Obanzai Seasonal Home-Style Platter & Matcha Parfait", dishJa: "京のおばんざい御膳＆宇治抹茶パフェ", placeEn: "Nishiki Market & Nakamura Tokichi Kyoto Station", placeJa: "錦市場（京のおばんざい）＆中村藤吉本店 京都駅店", url: "https://tokichi.jp/", score: "★ 3.75", transitLevel: "easy", transitEn: "🟢 Inside Station: Nakamura Tokichi is inside JR Kyoto Station Isetan 3F", transitJa: "🟢 駅直結：中村藤吉はJR京都駅伊勢丹3F直結・錦市場は四条駅徒歩3分", tagEn: "Must-Try (Kyoto)", tagJa: "厳選必食 (京都)", noteEn: "Sample Kyoto vegetables and yuba at 400-year-old Nishiki Market, and savor Uji matcha jelly parfaits.", noteJa: "400年の歴史ある錦市場の食べ歩きと、竹筒に入った濃厚宇治抹茶パフェ。" },
    { regionEn: "Kyoto", regionJa: "京都", dishEn: "Katsukura Kyoto Sanjo Tonkatsu & Sesame-Ground Sauce", dishJa: "名代とんかつ かつくら 三条本店（京野菜・すり胡麻ソース）", placeEn: "Katsukura Sanjo Main Shop / Kyoto Station Cube", placeJa: "名代とんかつ かつくら 三条本店／京都駅ザ・キューブ店", url: "https://www.katsukura.jp/", score: "★ 3.64", transitLevel: "easy", transitEn: "🟢 Station Connected: Directly inside JR Kyoto Station Building 11F", transitJa: "🟢 駅直結：JR京都駅ビル11Fまたは三条河原町", tagEn: "Top Pick (Kyoto)", tagJa: "名店おすすめ (京都)", noteEn: "Crispy Kyoto-style tonkatsu paired with freshly toasted sesame you grind yourself, yuzu dressing, and white miso soup.", noteJa: "すりたての香ばしい胡麻と赤ワイン仕立ての濃厚ソース、白味噌汁が絶品。" },
    { regionEn: "Kyoto", regionJa: "京都", dishEn: "Fushimi Inari Kitsune Udon & Inari Sushi", dishJa: "伏見稲荷 名物きつねうどん＆いなり寿司", placeEn: "Kendonya / Nezameya (Fushimi Inari Gate)", placeJa: "手打ちうどん けんどん屋／祢ざめ家（伏見稲荷大社門前）", url: "https://inari.jp/en/", score: "★ 3.66", transitLevel: "easy", transitEn: "🟢 Right Outside Station: 2-min walk from JR Inari Station / Keihan Fushimi-Inari", transitJa: "🟢 駅前すぐ：JR稲荷駅・京阪伏見稲荷駅より徒歩2分", tagEn: "Must-Try (Kyoto)", tagJa: "厳選必食 (京都)", noteEn: "Founded in 1540 right at the gate of Fushimi Inari Taisha—sweet simmered fried tofu 'kitsune' udon and inazushi.", noteJa: "千本鳥居の参拝前後に味わう、門前老舗のお稲荷さんと手打ちきつねうどん。" },
    { regionEn: "Kyoto", regionJa: "京都", dishEn: "Gion Duck Noodles (French-Inspired Duck Ramen)", dishJa: "祇園 ダックヌードル（合鴨フレンチラーメン）", placeEn: "Gion Duck Noodles (Near Yasaka Shrine)", placeJa: "Gion Duck Noodles（祇園北側）", url: "https://kyoto.travel/en/", score: "★ 3.70", transitLevel: "easy", transitEn: "🟢 Station Walkable: 4-min walk from Keihan Gion-Shijo Station", transitJa: "🟢 駅チカ：京阪「祇園四条駅」より徒歩4分", tagEn: "Top Pick (Kyoto)", tagJa: "名店おすすめ (京都)", noteEn: "Tucked in a secret Gion alleyway—velvety slow-simmered Wakayama duck broth served with rose-pink roasted duck slices.", noteJa: "祇園の路地裏に佇む、紀州鴨の旨みを凝縮したフレンチ仕立ての鴨ラーメン。" }
  ],
  Osaka: [
    { regionEn: "Osaka", regionJa: "大阪", dishEn: "Dotonbori Okonomiyaki & Yakisoba (Mizuno / Chibo)", dishJa: "道頓堀 本場お好み焼き（山芋焼・美津の焼）", placeEn: "Okonomiyaki Mizuno / Kiji Umeda Sky Building", placeJa: "お好み焼 美津の（道頓堀）／きじ 梅田スカイビル店", url: "https://www.mizuno-osaka.com/", score: "★ 3.73", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 4-min walk from Osaka Metro Namba Station Exit 14", transitJa: "🟢 駅チカ：大阪メトロ「なんば駅」14番出口徒歩4分", tagEn: "Must-Try (Osaka)", tagJa: "厳選必食 (大阪)", noteEn: "Michelin Bib Gourmand Osaka staple—100% grated mountain yam 'Yamaimo-yaki' grilled right on the teppan.", noteJa: "ミシュラン・ビブグルマン選出！山芋100%で焼き上げる名物山芋焼。" },
    { regionEn: "Osaka", regionJa: "大阪", dishEn: "Melty Dotonbori Takoyaki (Octopus Balls in Dashi)", dishJa: "道頓堀 とろとろ大だこ たこ焼き", placeEn: "Takoyaki Wanaka / Kukuru Dotonbori", placeJa: "たこ焼道楽 わなか 千日前本店／たこ家道頓堀くくる", url: "http://takoyaki-wanaka.com/", score: "★ 3.66", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 3-min walk from Namba / Nipponbashi Station", transitJa: "🟢 駅チカ：なんば駅・日本橋駅より徒歩3分", tagEn: "Must-Try (Osaka)", tagJa: "厳選必食 (大阪)", noteEn: "Crisp outside, molten dashi custard inside—try the 4-flavor O-iri sampler.", noteJa: "外はカリッ、中はとろりとした銅板焼き。4種の味が楽しめる『おおいり』が人気。" },
    { regionEn: "Osaka", regionJa: "大阪", dishEn: "Shinsekai & Namba Kushikatsu (Deep-Fried Skewers)", dishJa: "大阪名物 串かつ（牛串・紅しょうが・アスパラ）", placeEn: "Kushikatsu Daruma Dotonbori / Matsubaya", placeJa: "串かつだるま 道頓堀店／松葉総本店", url: "https://www.kushikatu-daruma.com/", score: "★ 3.55", transitLevel: "easy", transitEn: "🟢 Subway Walkable: 4-min walk from Namba or Dobutsuen-mae Station", transitJa: "🟢 駅チカ：なんば駅・動物園前駅より徒歩4分", tagEn: "Must-Try (Osaka)", tagJa: "厳選必食 (大阪)", noteEn: "Golden-fried beef, lotus root, quail egg, and pickled red ginger skewers with tangy sauce.", noteJa: "キメ細かな衣でサクッと揚げた牛串や紅生姜串を秘伝ソースで。" },
    { regionEn: "Osaka", regionJa: "大阪", dishEn: "551 Horai Freshly Steamed Pork Buns (Butaman)", dishJa: "551蓬莱 できたて豚まん＆焼売", placeEn: "551 Horai Main Shop (Namba)", placeJa: "551蓬莱 本店（なんば戎橋筋）", url: "https://www.551horai.co.jp/", score: "★ 3.69", transitLevel: "easy", transitEn: "🟢 Station Connected: 2-min walk from Namba Station", transitJa: "🟢 駅すぐ：各線「なんば駅」徒歩2分", tagEn: "Soul Food (Osaka)", tagJa: "大阪の看板味", noteEn: "Over 170,000 buns handmade daily in Osaka—sweet diced onions and juicy pork in slightly sweet steamed dough.", noteJa: "1日17万個売れる大阪名物！ジューシーな豚肉と甘い玉ねぎがたっぷり。" }
  ],
  Kobe: [
    { regionEn: "Kobe & Arima Onsen", regionJa: "神戸・有馬温泉", dishEn: "Certified A5 Kobe Beef Teppanyaki Steak", dishJa: "本場 A5等級 神戸ビーフ鉄板焼ステーキ", placeEn: "Kobe Plaisir / Steakland Kobe-kan (Sannomiya)", placeJa: "ステーキランド神戸館／神戸プレジール（三宮）", url: "https://steakland.jp/", score: "★ 3.65", transitLevel: "easy", transitEn: "🟢 Right Outside Station: 2-min walk from JR / Hankyu Sannomiya Station", transitJa: "🟢 駅前すぐ：JR・阪急「三宮駅」西口より徒歩2分", tagEn: "Must-Try (Kobe)", tagJa: "厳選必食 (神戸)", noteEn: "Hyogo Tajima-strain Kobe Beef tenderloin & sirloin seared with crispy garlic chips by a master teppan chef.", noteJa: "三宮駅すぐで味わう本場・兵庫県産神戸ビーフの鉄板焼きランチ＆ディナー。" },
    { regionEn: "Kobe & Arima Onsen", regionJa: "神戸・有馬温泉", dishEn: "Nankinmachi Chinatown Steamed Pork Buns & Kobe Beef Croquette", dishJa: "神戸南京町 老祥記の元祖豚饅頭＆森谷商店コロッケ", placeEn: "Roushouki & Moriya Shoten (Motomachi / Nankinmachi)", placeJa: "老祥記（南京町広場）＆本神戸肉森谷商店（元町）", url: "https://www.nankinmachi.or.jp/", score: "★ 3.74", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from JR / Hanshin Motomachi Station", transitJa: "🟢 駅チカ：JR・阪神「元町駅」より徒歩3分", tagEn: "Must-Try (Kobe)", tagJa: "厳選必食 (神戸)", noteEn: "Founded in 1915—bite-sized fermented-dough pork buns right next to Moriya's crispy Kobe beef potato croquettes.", noteJa: "大正4年創業の元祖豚饅頭と、行列必至の神戸牛入り揚げたてコロッケ。" },
    { regionEn: "Kobe & Arima Onsen", regionJa: "神戸・有馬温泉", dishEn: "Kobe Akashiyaki (Fluffy Egg-Batter Octopus Dumplings in Hot Dashi)", dishJa: "明石焼（玉子焼・お出汁で食べるふわふわタコ焼）", placeEn: "Takoyaki Tachibana (Sannomiya Center Street)", placeJa: "たこ焼 たちばな（三宮センター街）", url: "https://www.feel-kobe.jp/en/", score: "★ 3.59", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from Sannomiya Station", transitJa: "🟢 駅チカ：各線「三宮駅」より徒歩3分", tagEn: "Local Classic (Kobe)", tagJa: "ご当地名物 (神戸)", noteEn: "Served on a slanted wooden board—dip golden egg-rich octopus dumplings into fragrant Mitsuba-parsley kelp dashi.", noteJa: "赤いまな板に並んだふわふわの明石焼を三つ葉入りの温かいお出汁につけて。" },
    { regionEn: "Kobe & Arima Onsen", regionJa: "神戸・有馬温泉", dishEn: "Arima Onsen Freshly Baked Tansan Senbei (Carbonated Spring Wafer)", dishJa: "有馬温泉 賞味期限5秒の生炭酸せんべい＆有馬サイダー", placeEn: "Yunohana Honpo (Arima Onsen Yumotozaka Street)", placeJa: "湯の花堂本舗 太閤通り店（有馬温泉）", url: "https://www.arima-onsen.com/", score: "★ 3.54", transitLevel: "bus", transitEn: "🟡 Station Walkable: 2-min walk from Kobe Electric Railway Arima-Onsen Station", transitJa: "🟡 駅すぐ：神戸電鉄「有馬温泉駅」より徒歩2分", tagEn: "Onsen Snack (Arima)", tagJa: "温泉街名物 (有馬)", noteEn: "Made with Arima's natural carbonated spring water—still soft for the first 5 seconds off the press!", noteJa: "焼き立てわずか5秒間だけ柔らかい『なま炭酸せんべい』は有馬散策の必食。" }
  ],
  Hiroshima: [
    { regionEn: "Hiroshima & Miyajima", regionJa: "広島・宮島", dishEn: "Hiroshima-Style Layered Okonomiyaki with Crispy Yakisoba & Oysters", dishJa: "本場 広島お好み焼き（そば肉玉・牡蠣トッピング）", placeEn: "Nagataya (Near Peace Park) / Mitchan Sohonten", placeJa: "お好み焼 長田屋（平和記念公園前）／みっちゃん総本店", url: "https://www.nagataya-okonomi.com/en/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Tram / Station Walkable: 2-min walk from Genbaku-Dome-mae Tram Stop or Hiroshima Stn ekie", transitJa: "🟢 駅直結・電停すぐ：原爆ドーム前電停徒歩2分またはJR広島駅ekie直結", tagEn: "Must-Try (Hiroshima)", tagJa: "厳選必食 (広島)", noteEn: "Thin crepe base layered with sweet steamed cabbage, pork belly, crispy yakisoba noodles, egg, and Carp sauce.", noteJa: "たっぷりの甘い蒸らしキャベツとパリパリ中華麺を重ねて焼く広島のソウルフード。" },
    { regionEn: "Hiroshima & Miyajima", regionJa: "広島・宮島", dishEn: "Miyajima Original Anagomeshi (Charcoal-Broiled Conger Eel Rice)", dishJa: "宮島名物 あなごめし（炭火焼き穴子重）", placeEn: "Anagomeshi Ueno (Miyajimaguchi) / Fujitaya", placeJa: "あなごめし うえの（宮島口）／ふじたや（宮島島内）", url: "https://www.anagomeshi.com/", score: "★ 3.79", transitLevel: "easy", transitEn: "🟢 Right at Ferry Terminal: Ueno is a 2-min walk from JR Miyajimaguchi Station", transitJa: "🟢 駅・桟橋すぐ：JR宮島口駅より徒歩2分", tagEn: "Must-Try (Miyajima)", tagJa: "厳選必食 (宮島)", noteEn: "Founded in 1901—wild Seto Inland Sea conger eel grilled fragrant over charcoal over rice cooked in eel-bone broth.", noteJa: "明治34年創業、穴子のアラ出汁で炊いたご飯に香ばしい炭火焼き穴子を敷き詰めた名品。" },
    { regionEn: "Hiroshima & Miyajima", regionJa: "広島・宮島", dishEn: "Charcoal-Grilled Miyajima Giant Oysters (Yaki-Gaki)", dishJa: "宮島 焼き牡蠣・牡蠣フライ（瀬戸内産大粒牡蠣）", placeEn: "Kakiya / Yakigaki no Hayashi (Miyajima Omotesando)", placeJa: "牡蠣屋／焼がきのはやし（宮島表参道商店街）", url: "https://www.kaki-ya.jp/", score: "★ 3.69", transitLevel: "easy", transitEn: "🟢 Ferry Walkable: 7-min walk from Miyajima Ferry Pier along Omotesando", transitJa: "🟢 桟橋徒歩圏：宮島フェリー桟橋から表参道商店街へ徒歩7分", tagEn: "Must-Try (Miyajima)", tagJa: "厳選必食 (宮島)", noteEn: "Plump Seto Inland Sea oysters grilled over coals with Hiroshima lemon or oil-marinated.", noteJa: "発祥店『はやし』や専門店『牡蠣屋』で味わうプリプリの焼き牡蠣定食。" },
    { regionEn: "Hiroshima & Miyajima", regionJa: "広島・宮島", dishEn: "Age-Momiji (Crispy Deep-Fried Momiji Manju Maple Cakes)", dishJa: "宮島名物 揚げもみじ（あんこ・クリーム・瀬戸内レモン）", placeEn: "Momijido Honten (Miyajima Omotesando Street)", placeJa: "紅葉堂 本店（宮島表参道商店街）", url: "https://momijido.com/", score: "★ 3.59", transitLevel: "easy", transitEn: "🟢 Ferry Walkable: 8-min walk from Miyajima Ferry Terminal", transitJa: "🟢 桟橋徒歩圏：宮島桟橋より徒歩8分", tagEn: "Street Snack (Miyajima)", tagJa: "食べ歩き必食 (宮島)", noteEn: "Maple-leaf sponge cake filled with red bean, custard, or Setouchi lemon curd and fried crispy on a skewer!", noteJa: "もみじ饅頭に特製衣をつけてサクッと揚げた宮島食べ歩き人気No.1スイーツ。" }
  ],
  Okinawa: [
    { regionEn: "Okinawa Main Island", regionJa: "沖縄本島（那覇・恩納）", dishEn: "Okinawa Soba with Braised Soki Pork Ribs in Bonito-Pork Broth", dishJa: "本場 沖縄そば・ソーキそば（軟骨ソーキ・三枚肉）", placeEn: "Shuri Soba / Eibun (Naha Tsuboya)", placeJa: "首里そば／OKINAWA SOBA EIBUN（那覇・壺屋）", url: "https://visitokinawa.jp/", score: "★ 3.70", transitLevel: "easy", transitEn: "🟢 Monorail Walkable: 6-min walk from Yui Rail Makishi or Shuri Station", transitJa: "🟢 モノレール徒歩圏：ゆいレール「牧志駅」または「首里駅」徒歩6分", tagEn: "Must-Try (Okinawa)", tagJa: "厳選必食 (沖縄)", noteEn: "Wood-ash kneaded wheat noodles in crystal-clear katsuo-pork dashi topped with tender braised soki ribs.", noteJa: "鰹と豚出汁の澄んだスープにトロトロの軟骨ソーキが乗った沖縄の魂の一杯。" },
    { regionEn: "Okinawa Main Island", regionJa: "沖縄本島（那覇・恩納）", dishEn: "Agu Pork Shabu-Shabu & Sea Grapes (Umi-budo)", dishJa: "沖縄ブランド豚 アグー豚しゃぶしゃぶ＆海ぶどう", placeEn: "Matsumoto / Shima Shabu-Shabu Nakama (Naha / Onna-son)", placeJa: "まつもと／島しゃぶしゃぶNAKAMA（那覇・恩納村）", url: "https://visitokinawa.jp/", score: "★ 3.68", transitLevel: "easy", transitEn: "🟢 Monorail / Resort: 5-min walk from Yui Rail Kenchomae Stn (or Onna-son Route 58)", transitJa: "🟢 駅チカ・リゾート：ゆいレール「県庁前駅」徒歩5分（恩納村にも名店多数）", tagEn: "Must-Try (Okinawa)", tagJa: "厳選必食 (沖縄)", noteEn: "Sweet native Okinawan black Agu pork swished in kelp dashi with crisp sea grapes and island tofu.", noteJa: "甘みのある脂と旨みが特徴の希少な琉球在来豚アグーのしゃぶしゃぶ。" },
    { regionEn: "Okinawa Main Island", regionJa: "沖縄本島（那覇・恩納）", dishEn: "Okinawa Taco Rice (Spiced Beef, Cheddar & Omelet Rice)", dishJa: "沖縄発祥 タコライス（チーズ野菜＆ふわとろオムタコ）", placeEn: "King Tacos / Kijimuna (Chatan & Onna-son)", placeJa: "キングタコス／タコライスCafe きじむなぁ（恩納村・北谷）", url: "https://www.omutaco.com/", score: "★ 3.55", transitLevel: "bus", transitEn: "🟡 Bus / Drive: Along Onna-son coast & Chatan American Village", transitJa: "🟡 リゾート直結：恩納村・北谷アメリカンビレッジ・国際通り", tagEn: "Soul Food (Okinawa)", tagJa: "ご当地必食 (沖縄)", noteEn: "Savory taco meat, melted cheese, crisp lettuce, salsa, and fluffy omelet over hot rice.", noteJa: "スパイシーなタコミートとチーズ・ふわとろ卵が絡む沖縄名物『オムタコ』。" },
    { regionEn: "Okinawa Main Island", regionJa: "沖縄本島（那覇・恩納）", dishEn: "Makishi Public Market Reef Fish & Blue Seal Beni-imo Ice Cream", dishJa: "第一牧志公設市場 持ち上げ海鮮料理＆ブルーシール紅イモアイス", placeEn: "First Makishi Public Market & Blue Seal Kokusai Dori", placeJa: "第一牧志公設市場＆ブルーシール 国際通り店", url: "https://kosetsu-ichiba.com/en/", score: "★ 3.58", transitLevel: "easy", transitEn: "🟢 Monorail Walkable: 5-min walk from Yui Rail Makishi Station", transitJa: "🟢 駅チカ：ゆいレール「牧志駅」より徒歩5分", tagEn: "Must-Try (Naha)", tagJa: "厳選必食 (那覇)", noteEn: "Select tropical fish and tiger prawns on 1F, have them cooked upstairs on 2F, and finish with purple yam gelato!", noteJa: "1階で買った南国魚や夜光貝を2階食堂で調理してもらい、食後は紅イモアイス！" }
  ],
  Ishigaki: [
    { regionEn: "Ishigaki & Taketomi", regionJa: "石垣島・竹富島", dishEn: "A5 Ishigaki Beef Yakiniku Charcoal Grill & Sushi", dishJa: "幻のブランド牛 石垣牛 炭火焼肉＆石垣牛握り", placeEn: "Sumibi Yakiniku Yamamoto / Ishigakiya", placeJa: "炭火焼肉 やまもと／石垣屋（石垣市街）", url: "https://www.ishigaki-yamamoto.com/", score: "★ 3.74", transitLevel: "easy", transitEn: "🟢 Port Walkable: 8-min walk from Ishigaki Port Remote Island Terminal", transitJa: "🟢 離島ターミナル徒歩圏：石垣港離島ターミナルから徒歩8分", tagEn: "Must-Try (Ishigaki)", tagJa: "厳選必食 (石垣島)", noteEn: "Raised on subtropical island pastures—reserve weeks ahead for Yamamoto's grilled roast and beef nigiri!", noteJa: "八重山の海風で育った希少な石垣牛。超人気店「やまもと」は事前予約推奨！" },
    { regionEn: "Ishigaki & Taketomi", regionJa: "石垣島・竹富島", dishEn: "Yaeyama Soba with Thin Round Noodles & Pipachi Pepper", dishJa: "八重山そば（島胡椒ヒバーチ＆細丸麺）", placeEn: "Kunatsuyu / Akashi Shokudo (Ishigaki) / Takenoko (Taketomi)", placeJa: "来夏世（くなつゆ）／明石食堂（石垣島）／そば処 竹の子（竹富島）", url: "https://visitokinawajapan.com/destinations/yaeyama-islands/ishigaki-island/", score: "★ 3.66", transitLevel: "easy", transitEn: "🟢 Town Walkable: Kunatsuyu is a 10-min walk from Ishigaki Port Terminal", transitJa: "🟢 市街徒歩圏：来夏世は石垣港ターミナルから徒歩10分（竹の子は竹富集落内）", tagEn: "Must-Try (Yaeyama)", tagJa: "厳選必食 (八重山)", noteEn: "Lighter pork-bonito broth than Naha soba, with thin julienned pork belly, kamaboko, and aromatic island long-pepper.", noteJa: "豚と鰹の澄んだ出汁に細切り豚肉とカマボコ、香ばしい島胡椒ヒバーチが絶妙。" },
    { regionEn: "Ishigaki & Taketomi", regionJa: "石垣島・竹富島", dishEn: "Mirumiru Honpo Island Milk & Mango Gelato (Ocean Hilltop)", dishJa: "ミルミル本舗 本店の島ミルク＆完熟マンゴージェラート", placeEn: "Mirumiru Honpo Main Shop (Nagura Bay)", placeJa: "ミルミル本舗 本店（石垣島・名蔵湾高台）", url: "https://mirumiru1583.com/", score: "★ 3.57", transitLevel: "bus", transitEn: "🟡 Coastal Drive / Bus: 15 min west of Ishigaki City overlooking Nagura Bay", transitJa: "🟡 車・路線バス：石垣市街から名蔵湾方面へ約15分（絶景サンセット丘）", tagEn: "Sunset Treat (Ishigaki)", tagJa: "絶景スイーツ (石垣島)", noteEn: "Farm-fresh island dairy gelato with fresh Ishigaki mango, brown sugar, and passionfruit overlooking Taketomi Island.", noteJa: "自社牧場の濃厚ミルクと島マンゴー・紅イモジェラートを竹富島を望む高台で。" },
    { regionEn: "Ishigaki & Taketomi", regionJa: "石垣島・竹富島", dishEn: "Fresh Island Tuna Sashimi (Maguro) & Seaweed Tempura", dishJa: "石垣島産 生本マグロ刺＆もずく・アーサ天ぷら", placeEn: "Hitoshi Main / Ishigaki Branch (Izakaya)", placeJa: "まぐろ専門居酒屋 ひとし 本店・石敢當店", url: "https://www.ishigaki-hitoshi.com/", score: "★ 3.71", transitLevel: "easy", transitEn: "🟢 Port Walkable: 5-min walk from Ishigaki Port / Euglena Mall", transitJa: "🟢 中心街すぐ：ユーグレナモール・離島ターミナルから徒歩5分", tagEn: "Top Pick (Ishigaki)", tagJa: "名店おすすめ (石垣島)", noteEn: "Ishigaki's legendary seafood izakaya famous for never-frozen local tuna, Ishigaki beef sushi, and sea urchin somen.", noteJa: "石垣近海の生マグロと石垣牛にぎり、ウニソーメンチャンプルーが絶品の名店。" }
  ],
  Hakone: [
    { regionEn: "Hakone & Mt. Fuji", regionJa: "箱根・富士山", dishEn: "Kawaguchiko Hoto (Flat Wheat Noodles in Pumpkin Miso Iron Pot)", dishJa: "山梨・河口湖名物 ほうとう不動（かぼちゃ味噌鉄鍋）", placeEn: "Hoto Fudo Kawaguchiko Ekimae / Higashikoiji", placeJa: "ほうとう不動 河口湖駅前店／東恋路店", url: "https://www.houtou-fudou.jp/english.html", score: "★ 3.57", transitLevel: "easy", transitEn: "🟢 Right Outside Station: 1-min walk across from Fujikyuko Kawaguchiko Station", transitJa: "🟢 駅前すぐ：富士急行「河口湖駅」目の前徒歩1分", tagEn: "Must-Try (Mt. Fuji)", tagJa: "厳選必食 (河口湖)", noteEn: "Chewy handmade flat noodles simmered in an iron cauldron with sweet kabocha pumpkin and mountain vegetables.", noteJa: "河口湖駅目の前！カボチャや山菜たっぷりの味噌仕立て鉄鍋ほうとう。" },
    { regionEn: "Hakone & Mt. Fuji", regionJa: "箱根・富士山", dishEn: "Hakone Yuba-don (Simmered Tofu Skin in Spring Water Dashi)", dishJa: "箱根湯本 直吉の湯葉丼（箱根銘水仕立て）", placeEn: "Yubadon Naokichi (Hakone-Yumoto)", placeJa: "湯葉丼 直吉（箱根湯本駅前通り）", url: "https://www.hakoneyumoto.com/", score: "★ 3.59", transitLevel: "easy", transitEn: "🟢 Station Walkable: 3-min walk from Odakyu Hakone-Yumoto Station", transitJa: "🟢 駅チカ：箱根登山鉄道「箱根湯本駅」より徒歩3分", tagEn: "Must-Try (Hakone)", tagJa: "厳選必食 (箱根)", noteEn: "Silky soy-milk yuba simmered with egg in a personal earthenware pot beside the Hayakawa River.", noteJa: "箱根の湧水で汲み上げた生湯葉をカツオ出汁と卵でとじた熱々土鍋。" },
    { regionEn: "Hakone & Mt. Fuji", regionJa: "箱根・富士山", dishEn: "Owakudani Black Eggs (Kuro-Tamago Boiled in Volcanic Sulfuric Springs)", dishJa: "箱根・大涌谷名物 黒たまご（温泉池茹で）", placeEn: "Owakudani Kurotamago-kan (Hakone Ropeway)", placeJa: "大涌谷くろたまご館（箱根ロープウェイ大涌谷駅）", url: "https://owakudani.com/", score: "★ 3.50", transitLevel: "bus", transitEn: "🟡 Ropeway Station Connected: Directly at Hakone Ropeway Owakudani Station", transitJa: "🟡 駅直結：箱根ロープウェイ「大涌谷駅」すぐ", tagEn: "Onsen Icon (Hakone)", tagJa: "名物食べ歩き (箱根)", noteEn: "Boiled in 80°C volcanic hot spring pools—legend says eating one adds 7 years to your life!", noteJa: "1個食べると7年寿命が延びると伝わる、大涌谷の温泉池で茹でた黒たまご。" },
    { regionEn: "Hakone & Mt. Fuji", regionJa: "箱根・富士山", dishEn: "Gotemba & Fuji Highland Craft Soba / Matcha", dishJa: "忍野八海 手打ち富士湧水そば＆抹茶甘味", placeEn: "Oshino Hakkai & Kawaguchiko Lakeside Tea Houses", placeJa: "忍野八海 湧水手打ちそば処／河口湖畔カフェ", url: "https://fujisan.ne.jp/en/", score: "★ 3.56", transitLevel: "bus", transitEn: "🟡 Sightseeing Bus: Fujikyuko Red/Blue Line Bus around Kawaguchiko", transitJa: "🟡 周遊バス：河口湖周遊バス・忍野八海バス停", tagEn: "Local Specialty", tagJa: "ご当地名物", noteEn: "Cold buckwheat soba made with crystal-clear Mt. Fuji snowmelt spring water.", noteJa: "富士山の雪解け湧水で打ち上げる香り高い手打ちそば。" }
  ],
  IzuShizuoka: [
    { regionEn: "Atami, Kawazu & Shizuoka", regionJa: "熱海・河津・静岡", dishEn: "Sagami Bay Seafood Bowl & Kinmedai Golden-Eye Snapper", dishJa: "熱海銀座おさかな食堂（海の幸海鮮丼・金目鯛）", placeEn: "Atami Ginza Osakana Shokudo", placeJa: "熱海銀座おさかな食堂", url: "https://www.osakana-atami.com/", score: "★ 3.50", transitLevel: "easy", transitEn: "🟢 Station Walkable: 12-min downhill stroll from JR Atami Station (5-min bus to Ginza stop)", transitJa: "🟢 駅徒歩・バス：JR熱海駅から徒歩約12分または銀座バス停すぐ", tagEn: "Must-Try (Atami)", tagJa: "厳選必食 (熱海)", noteEn: "Famous Sagami Bay seafood donburi loaded with Suruga whitebait (shirasu), sea bream, and red-braised Izu kinmedai.", noteJa: "相模湾の地魚・駿河湾しらす・伊豆名物の金目鯛がたっぷり盛られた大人気海鮮丼。" },
    { regionEn: "Atami, Kawazu & Shizuoka", regionJa: "熱海・河津・静岡", dishEn: "Kawazu Fresh Mountain Wasabi-don & Izu Kinmedai", dishJa: "河津名物 生わさび丼（かどや）", placeEn: "Wasabi-en Kadoya (Kawazu Nanadaru)", placeJa: "わさび園 かどや（河津七滝）", url: "https://www.kawazu-onsen.com/eng/", score: "★ 3.55", transitLevel: "bus", transitEn: "🟡 Local Bus: 20 min via Tokai Bus from Izukyu Kawazu Station to Nanadaru (or central Kawazu stalls)", transitJa: "🟡 バス・駅周辺：伊豆急「河津駅」から東海バス約20分（桜まつり会場屋台も充実）", tagEn: "Local Classic (Kawazu)", tagJa: "ご当地名物 (河津)", noteEn: "Grate fresh Amagi spring-water wasabi root yourself over steaming rice topped with bonito flakes and aged soy sauce.", noteJa: "天城の清流で育った本わさびを自分ですりおろし、鰹節ごはんにのせて味わう絶品丼。" },
    { regionEn: "Atami, Kawazu & Shizuoka", regionJa: "熱海・河津・静岡", dishEn: "Starbucks Coffee with Direct Mt. Fuji Overlook (Fujikawa SA)", dishJa: "スターバックス EXPASA富士川上り/下り（富士山絶景テラス）", placeEn: "Starbucks EXPASA Fujikawa / Fujikawa Rakuza", placeJa: "スターバックスコーヒー EXPASA富士川（富士川楽座隣接）", url: "https://www.fujikawarakuza.co.jp/", score: "★ 3.40", transitLevel: "bus", transitEn: "🟡 Train + 5-min Taxi / Bus: JR Fujikawa Stn West Exit -> Fujikawa Rakuza Mae Bus (or 5-min taxi)", transitJa: "🟡 駅＋バス/タクシー：JR富士川駅西口からバス「富士川楽座前」またはタクシー約5分", tagEn: "Mt. Fuji Zekkei", tagJa: "富士山絶景カフェ", noteEn: "Best at 07:00–09:30 AM on winter mornings: floor-to-ceiling glass & terrace overlooking the Fuji River valley and snow-capped Mt. Fuji.", noteJa: "冬の澄んだ朝7時〜9時台が最高！富士川と雪化粧の富士山を一望する特等席テラス。" },
    { regionEn: "Atami, Kawazu & Shizuoka", regionJa: "熱海・河津・静岡", dishEn: "Shizuoka Dark-Broth Oden Skewers & Sakura Shrimp", dishJa: "静岡おでん（青葉横丁・青葉おでん街 黒はんぺん）", placeEn: "Aoba Oden Alley / Miho-ya (Shizuoka City)", placeJa: "青葉おでん街・青葉横丁「三保屋」ほか（静岡駅徒歩圏）", url: "https://www.visit-shizuoka.com/en/", score: "★ 3.56", transitLevel: "easy", transitEn: "🟢 Station Walkable: 10-min walk from JR Shizuoka Station North Exit", transitJa: "🟢 駅チカ：JR静岡駅 北口より徒歩約10分", tagEn: "Must-Try (Shizuoka)", tagJa: "厳選必食 (静岡)", noteEn: "Simmered in rich dark beef-tendon & soy dashi on wooden skewers, dusted with sardine dashi powder and green nori flakes.", noteJa: "濃い口醤油と牛すじの真っ黒出汁が染みた黒はんぺん・牛すじに、だし粉と青海苔をかけて味わう静岡夜グルメ。" }
  ],
  GunmaAlps: [
    { regionEn: "Matsumoto & Northern Alps", regionJa: "松本・信州", dishEn: "Kyuwari Stone-Milled Matsumoto Shinshu Soba", dishJa: "信州松本 名店手打ち蕎麦「御そば打処 野麦」", placeEn: "Osobauchidokoro Nomugi (Matsumoto)", placeJa: "御そば打処 野麦（松本）", url: "https://matsumoto-experience.com/", score: "★ 3.72", transitLevel: "easy", transitEn: "🟢 Castle Walkable: 6-min walk southeast of Matsumoto Castle, ~15 min from JR Matsumoto Stn", transitJa: "🟢 駅・城徒歩圏：松本城から徒歩約6分・JR松本駅から徒歩約15分", tagEn: "Top Tabelog (Matsumoto)", tagJa: "百名店級 (松本)", noteEn: "Renowned 90%-buckwheat handmade soba prized for clean aroma and al-dente chewiness; open lunchtime until sold out.", noteJa: "香り高い九割手打ちそばの名店。売切れ次第終了のため昼前〜ランチ早めの訪問が安心。" },
    { regionEn: "Kusatsu Onsen & Takasaki", regionJa: "草津温泉・高崎", dishEn: "Kusatsu Ishiusubiki Soba (Duck & Maitake Mushroom Broth)", dishJa: "草津温泉 石臼挽蕎麦「三国家」（都汁・三國そば）", placeEn: "Ishiusubiki Soba Mikuniya (2 min from Yubatake)", placeJa: "石臼挽蕎麦 三国家（湯畑から徒歩2分）", url: "https://www.kusatsu-onsen.ne.jp/guide/en/", score: "★ 3.49", transitLevel: "easy", transitEn: "🟢 Yubatake Walkable: 2-min walk from Kusatsu Yubatake (5 min from Bus Terminal)", transitJa: "🟢 湯畑すぐ：草津湯畑から徒歩2分・草津温泉バスターミナルから徒歩5分", tagEn: "Must-Try (Kusatsu)", tagJa: "厳選必食 (草津)", noteEn: "In-house stone-ground soba served over bamboo sieves with rich hot duck, pork, or Gunma maitake-mushroom dipping soup.", noteJa: "店内の石臼で挽く自家製蕎麦を、特製の濃厚な鴨汁・豚肉都汁などでいただく草津の行列店。" },
    { regionEn: "Kusatsu Onsen & Takasaki", regionJa: "草津温泉・高崎", dishEn: "Kusatsu Onsen Tamago & Hot Steamed Onsen Manju", dishJa: "草津湯畑 温泉たまご＆松むら饅頭（出来立て黒糖まんじゅう）", placeEn: "Matsumura Manju / Raiun-tei by Yubatake", placeJa: "松むら饅頭＆湯畑前「頼朝」（温泉たまご）", url: "https://www.kusatsu-onsen.ne.jp/guide/en/", score: "★ 3.58", transitLevel: "easy", transitEn: "🟢 Yubatake Walkable: Directly along the Yubatake wooden boardwalk", transitJa: "🟢 湯畑直結：湯畑の足湯すぐ横・西の河原通り入口", tagEn: "Onsen Snack (Kusatsu)", tagJa: "食べ歩き必食 (草津)", noteEn: "Silky mineral-spring poached egg and pillow-soft brown-sugar azuki manju served piping hot in snowy winter air.", noteJa: "雪見散策のお供に欠かせない、湯畑名物のトロトロ温泉玉子と蒸したて黒糖薄皮まんじゅう。" },
    { regionEn: "Kusatsu Onsen & Takasaki", regionJa: "草津温泉・高崎", dishEn: "Takasaki Daruma Bento, Torimeshi & Joshu Wagyu", dishJa: "高崎駅「だるま弁当」・登利平「上州御用鳥めし」＆上州牛", placeEn: "Torihei Takasaki Montres / Takasaki Ekiben", placeJa: "登利平 高崎モントレー店＆高崎弁当だるま弁当（駅直結）", url: "https://www.torihei.co.jp/", score: "★ 3.54", transitLevel: "easy", transitEn: "🟢 Inside Station: Inside JR Takasaki Station Building / Montres 5F", transitJa: "🟢 駅直結：JR高崎駅ビル「高崎モントレー」＆駅構内売店", tagEn: "Gunma Classic", tagJa: "群馬ソウルフード", noteEn: "Gunma's beloved sweet soy-glazed chicken rice box (Torimeshi) or iconic red lucky Daruma bento inside JR Takasaki Station.", noteJa: "群馬県民のソウルフード「登利平の鳥めし」や、記念に持ち帰れる赤い縁起物「だるま弁当」。" }
  ]
};

window.buildGourmetListFromLocations = function(locKeys) {
  let idCounter = 1;
  const enArr = [];
  const jaArr = [];
  locKeys.forEach(k => {
    (window.GOURMET_BY_LOC[k] || []).forEach(it => {
      const id = idCounter++;
      enArr.push({
        id, region: it.regionEn, dish: it.dishEn, place: it.placeEn, url: it.url,
        tabelogScore: it.score, tabelogUrl: it.url, transitLevel: it.transitLevel,
        transitText: it.transitEn, sourceTag: it.tagEn, note: it.noteEn, tried: false
      });
      jaArr.push({
        id, region: it.regionJa, dish: it.dishJa, place: it.placeJa, url: it.url,
        tabelogScore: it.score, tabelogUrl: it.url, transitLevel: it.transitLevel,
        transitText: it.transitJa, sourceTag: it.tagJa, note: it.noteJa, tried: false
      });
    });
  });
  return { en: enArr, ja: jaArr };
};

window.METRO_ACCESS_BY_LOC = {
  Tokyo: [
    { areaEn: "Tokyo Metropolitan Area", areaJa: "東京・首都圏", dayEn: "All Tokyo Days", dayJa: "東京滞在日", placeEn: "Tokyo Subway Official Route Map PDF (Tokyo Metro & Toei Subway All 13 Lines)", placeJa: "東京メトロ・都営地下鉄 公式路線図PDF（全13路線・駅番号付）", url: "https://www.tokyometro.jp/station/pdf/202305/202305_number_en.pdf", noteEn: "Official downloadable PDF metro map covering all Tokyo Metro and Toei Subway lines with station numbers.", noteJa: "東京都内の移動は地下鉄が最も便利！駅ナンバリング付きの公式地下鉄路線図PDFです。", isExisting: true },
    { areaEn: "Tokyo Metropolitan Area", areaJa: "東京・首都圏", dayEn: "Airport & JR Lines", dayJa: "空港・JR首都圏", placeEn: "JR East Major Railway & Subway Route Map PDF (Yamanote, N'EX & Shinkansen)", placeJa: "JR東日本 首都圏主要鉄道路線図PDF（山手線・成田エクスプレス・新幹線）", url: "https://www.jreast.co.jp/en/multi/downloads/", noteEn: "Official JR East metropolitan route map PDF covering Haneda/Narita airport access, Yamanote Line, and Shinkansen hubs.", noteJa: "山手線・中央線・空港アクセス特急と新幹線の乗換が一目でわかるJR東日本公式路線図。", isExisting: true }
  ],
  Kanazawa: [
    { areaEn: "Kanazawa & Hokuriku", areaJa: "金沢・北陸", dayEn: "Kanazawa Stay", dayJa: "金沢滞在日", placeEn: "Kanazawa Loop Bus & Flat Bus Official 1-Day Pass Route Map PDF", placeJa: "金沢周遊バス・ふらっとバス 公式1日フリー乗車券 路線図PDF", url: "https://www.hokutetsu.co.jp/_wp/wp-content/uploads/2026/01/ONE-DAY-PASS-Kanazawa-Bus-Route-Map-February-2026.pdf", noteEn: "Official Hokutetsu PDF map for navigating Kenrokuen Garden, Omicho Market, Higashi Chaya, and 21st Century Museum.", noteJa: "兼六園・近江町市場・ひがし茶屋街・21世紀美術館を巡る金沢周遊バス公式路線図PDF。", isExisting: true },
    { areaEn: "Kanazawa & Hokuriku", areaJa: "金沢・北陸", dayEn: "Shirakawa-go & Ainokura", dayJa: "白川郷・五箇山・高山", placeEn: "Kanazawa ↔ Shirakawa-go / Gokayama Ainokura ↔ Takayama (Nohi Bus & Hokutetsu)", placeJa: "金沢駅 ↔ 五箇山（相倉合掌造り）・白川郷 ↔ 高山濃飛バスセンター 公式案内PDF", url: "https://visitkanazawa.jp/lsc/upfile/pamphlet/0000/0014/14_201_file.pdf", noteEn: "Official Visit Kanazawa PDF bus & rail access guide for Shirakawa-go, Gokayama Ainokura, and Takayama.", noteJa: "金沢から五箇山・白川郷・飛騨高山への高速バス・加賀温泉郷アクセス案内PDF。", isExisting: false }
  ],
  Hokkaido: [
    { areaEn: "Sapporo & Hokkaido", areaJa: "札幌・北海道", dayEn: "Sapporo Stay", dayJa: "札幌滞在日", placeEn: "Sapporo Municipal Subway Official Route Map PDF (Namboku, Tozai & Toho Lines)", placeJa: "札幌市営地下鉄 公式路線図PDF（南北線・東西線・東豊線）", url: "https://www.city.sapporo.jp/st/english/documents/rosenzu_e.pdf", noteEn: "Official PDF metro map for Sapporo Station, Odori Park, Susukino, and Maruyama Koen.", noteJa: "札幌駅・大通・すすきの間の移動に必須の札幌市営地下鉄公式路線図PDF。", isExisting: true },
    { areaEn: "Sapporo & Hokkaido", areaJa: "札幌・北海道", dayEn: "All Hokkaido Days", dayJa: "北海道周遊", placeEn: "JR Hokkaido Official Railway Route Map PDF (Sapporo–Otaru–Noboribetsu–Hakodate)", placeJa: "JR北海道 公式鉄道路線図PDF（新千歳空港・小樽・登別・富良野・函館）", url: "https://www.jrhokkaido.co.jp/global/pdf/route_map.pdf", noteEn: "Official JR Hokkaido PDF route map covering Airport Rapid, Limited Express Hokuto, and Furano/Otaru lines.", noteJa: "快速エアポートや特急北斗（登別・函館方面）、富良野方面を網羅するJR北海道公式PDF。", isExisting: true }
  ],
  Kyushu: [
    { areaEn: "Fukuoka & Kyushu", areaJa: "福岡・九州", dayEn: "Fukuoka Stay", dayJa: "福岡滞在日", placeEn: "Fukuoka City Subway Official Route Map PDF (Airport–Hakata–Tenjin)", placeJa: "福岡市地下鉄 公式路線図PDF（福岡空港〜博多〜天神〜七隈線）", url: "https://subway.city.fukuoka.lg.jp/eng/route/deta/map.pdf", noteEn: "Fukuoka Airport is just 5 minutes by subway to Hakata Station and 11 minutes to Tenjin.", noteJa: "福岡空港から博多駅まで地下鉄5分、天神まで11分！福岡市地下鉄の公式路線図PDF。", isExisting: true },
    { areaEn: "Fukuoka & Kyushu", areaJa: "福岡・九州", dayEn: "Kyushu Rail", dayJa: "九州鉄道", placeEn: "JR Kyushu Fukuoka & Northern Kyushu Official Route Map PDF", placeJa: "JR九州 福岡・北部九州エリア公式路線図PDF", url: "https://www.jrkyushu.co.jp/english/pdf/fukuoka_area_map.pdf", noteEn: "Official JR Kyushu PDF map covering Yufuin, Beppu, Kumamoto, and Hakata connections.", noteJa: "JR九州の路線網と由布院・別府・熊本方面への鉄道ネットワーク公式PDF。", isExisting: true },
    { areaEn: "Fukuoka & Kyushu", areaJa: "福岡・九州", dayEn: "Beppu–Yufuin–Kurokawa", dayJa: "別府・由布院・黒川温泉", placeEn: "Kyushu Hot Spring Corridor Guide Map PDF (Beppu, Yufuin, Kurokawa & Mt. Aso)", placeJa: "九州横断・温泉めぐり公式ガイドマップPDF（別府・由布院・黒川温泉・阿蘇）", url: "https://www.welcomekyushu.com/pamphlets/document/pamph_driving_kyushu.pdf", noteEn: "Official Kyushu Tourism Organization PDF map linking Beppu, Yufuin, Kurokawa Onsen, and Aso.", noteJa: "九州観光機構公式の別府・由布院・黒川温泉・阿蘇ルートマップPDF。", isExisting: false }
  ],
  Kansai: [
    { areaEn: "Kyoto, Osaka, Kobe & Hiroshima", areaJa: "京都・大阪・神戸・広島", dayEn: "Kyoto Days", dayJa: "京都滞在日", placeEn: "Kyoto City Bus & Subway Official Navi Route Map PDF", placeJa: "京都市バス・地下鉄 公式路線図「バス・鉄道なび」PDF", url: "https://www.city.kyoto.lg.jp/kotsu/cmsfiles/contents/0000019/19770/ENG202503(map)WEB.pdf", noteEn: "Official Kyoto Municipal Transportation Bureau PDF map covering subways and city buses.", noteJa: "清水寺・金閣寺・嵐山・祇園への地下鉄＆市バス乗換が一目でわかる京都市交通局公式PDF。", isExisting: true },
    { areaEn: "Kyoto, Osaka, Kobe & Hiroshima", areaJa: "京都・大阪・神戸・広島", dayEn: "Osaka Days", dayJa: "大阪滞在日", placeEn: "Osaka Metro Official Route Map PDF", placeJa: "Osaka Metro（大阪メトロ）公式路線図PDF", url: "https://subway.osakametro.co.jp/img/osakametro_rosenzu_20191001.pdf", noteEn: "Official Osaka Metro PDF route map covering Midosuji, Chuo, and Osaka Loop transfers.", noteJa: "新大阪・梅田・なんば・天王寺・大阪城を結ぶOsaka Metro全線の公式路線図PDF。", isExisting: true },
    { areaEn: "Kyoto, Osaka, Kobe & Hiroshima", areaJa: "京都・大阪・神戸・広島", dayEn: "Kobe Days", dayJa: "神戸滞在日", placeEn: "Kobe City Loop & Port Loop Sightseeing Bus Official Route Map PDF", placeJa: "神戸シティループ＆ポートループバス 公式路線図マップPDF", url: "https://kobeloop.bus-japan.net/zh-Hant/images/home/map.pdf", noteEn: "Official PDF map linking Shin-Kobe, Kitano, Sannomiya, Chinatown, and Meriken Park.", noteJa: "新神戸駅・北野異人館・三宮・南京町・メリケンパークを巡る公式マップPDF。", isExisting: false },
    { areaEn: "Kyoto, Osaka, Kobe & Hiroshima", areaJa: "京都・大阪・神戸・広島", dayEn: "Hiroshima & Miyajima", dayJa: "広島・宮島滞在日", placeEn: "Hiroshima Sightseeing Loop Bus 'Meipuru-pu' & Ferry Route Map PDF", placeJa: "広島観光ループバス「めいぷる〜ぷ」公式路線図PDF", url: "http://www.chugoku-jrbus.co.jp/sightseeing/files/20251024meipurupu_map_foreigner.pdf", noteEn: "Official JR Bus Chugoku PDF map from Hiroshima Station to Peace Park & Miyajima Ferry.", noteJa: "広島駅から原爆ドーム・平和記念公園を巡るJRバス公式PDF（JRパス提示で無料）。", isExisting: false }
  ],
  Okinawa: [
    { areaEn: "Okinawa Main Island", areaJa: "沖縄本島（那覇・恩納・本部）", dayEn: "Naha Days", dayJa: "那覇滞在日", placeEn: "Okinawa Yui Rail Monorail Route Map & Fare Guide (Naha Airport ↔ Shuri / Tedako)", placeJa: "沖縄都市モノレール「ゆいレール」公式路線図・運賃案内", url: "https://www.yui-rail.co.jp/en/", noteEn: "Direct monorail from Naha Airport (OKA) to Kokusai Dori (Kenchomae/Makishi) and Shuri Castle.", noteJa: "那覇空港駅から国際通り（県庁前・牧志駅）や首里駅を結ぶ沖縄唯一の鉄道。", isExisting: true },
    { areaEn: "Okinawa Main Island", areaJa: "沖縄本島（那覇・恩納・本部）", dayEn: "Onna-son & Churaumi", dayJa: "恩納村・美ら海方面", placeEn: "Yanbaru Express Bus & Okinawa Airport Shuttle Timetable (Naha ↔ Onna ↔ Churaumi)", placeJa: "やんばる急行バス＆沖縄エアポートシャトル 公式時刻表（那覇〜恩納村〜美ら海水族館）", url: "https://www.okinawa-shuttle.co.jp/en/", noteEn: "No rental car needed: direct express buses from Naha Airport/Kenchomae to Onna-son resorts and Churaumi Aquarium.", noteJa: "レンタカーなしでも安心！那覇から恩納村リゾート・美ら海水族館への直通バス時刻表。", isExisting: true },
    { areaEn: "Ishigaki & Taketomi Islands", areaJa: "石垣島・竹富島（八重山諸島）", dayEn: "Island Ferry Days", dayJa: "離島フェリー移動", placeEn: "An'ei Kanko High-Speed Ferry Timetable (Ishigaki Port ↔ Taketomi / Iriomote)", placeJa: "安栄観光 高速フェリー時刻表（石垣港離島ターミナル ↔ 竹富島・西表島）", url: "https://aneikankou.co.jp/en/", noteEn: "10-minute high-speed ferries departing every 30–60 minutes between Ishigaki Port Terminal and Taketomi Island.", noteJa: "石垣港離島ターミナルから竹富島まで高速船で約10〜15分！事前オンライン予約可。", isExisting: false },
    { areaEn: "Ishigaki & Taketomi Islands", areaJa: "石垣島・竹富島（八重山諸島）", dayEn: "Ishigaki Bus", dayJa: "石垣島内移動", placeEn: "Azuma Bus Ishigaki Island Official Route Map & Kabira Bay Timetable", placeJa: "東運輸（石垣島路線バス）空港・川平湾・市内周遊時刻表", url: "https://www.azumabus.co.jp/", noteEn: "Covers Ishigaki Airport (ISG) ↔ Bus Terminal / Port (30 min) and Kabira Bay sightseeing line.", noteJa: "石垣空港〜石垣港離島ターミナル・川平湾を結ぶ島内路線バスの時刻表案内。", isExisting: false }
  ],
  Onsen: [
    { areaEn: "Hakone & Mt. Fuji", areaJa: "箱根・富士山エリア", dayEn: "Fuji & Hakone Days", dayJa: "箱根・河口湖", placeEn: "JR Central & Odakyu Hakone / Mt. Fuji Railway Official Route Map PDF", placeJa: "箱根登山鉄道・ロープウェイ＆JR東海エリア公式鉄道路線図PDF", url: "https://global.jr-central.co.jp/en/info/railwaymap/_pdf/railwaymap.pdf", noteEn: "Official downloadable PDF railway & ropeway network map for Hakone, Odawara, and Mt. Fuji.", noteJa: "小田原・箱根登山電車・富士山周辺エリアの公式鉄道路線図PDF。", isExisting: true }
  ],
  IzuShizuoka: [
    { areaEn: "Atami, Kawazu & Shizuoka", areaJa: "熱海・河津・静岡エリア", dayEn: "Kawazu & Atami Day", dayJa: "熱海・河津桜移動", placeEn: "Izukyu Line & JR Odoriko Route Guide (Atami ↔ Ito ↔ Kawazu)", placeJa: "伊豆急行線・JR特急「踊り子」公式案内（熱海〜伊東〜河津）", url: "https://www.izukyu.co.jp/global_data/english/index.html", noteEn: "Reserve JR Limited Express Odoriko seats 1 month ahead at 10:00 AM JST for late-Feb Kawazu-zakura, or transfer at Ito onto frequent Izukyu trains.", noteJa: "2月下旬の河津桜ピーク時は特急踊り子指定席を1ヶ月前に確保推奨（または熱海〜伊東経由で伊豆急行普通列車）。", isExisting: true },
    { areaEn: "Atami, Kawazu & Shizuoka", areaJa: "熱海・河津・静岡エリア", dayEn: "Fujikawa SA & Shizuoka", dayJa: "富士川SA・静岡移動", placeEn: "Fujikawa Rakuza / EXPASA Fujikawa Public Transport Access Guide (from JR Fujikawa Stn)", placeJa: "富士川楽座・EXPASA富士川 公共交通アクセス案内（JR富士川駅からバス・徒歩・タクシー）", url: "https://www.fujikawarakuza.co.jp/access/", noteEn: "From JR Fujikawa Station West Exit: take Yamanashi Kotsu Bus to 'Fujikawa Rakuza Mae', walk 25–30 min uphill (~2.1 km), or take a 5-min station taxi (~¥1,200) for clear 07:30 AM Mt. Fuji views.", noteJa: "JR富士川駅西口からバス「富士川楽座前」またはタクシー約5分（¥1,200前後）・徒歩約25分。朝の晴天時が富士山絶景。", isExisting: false }
  ],
  GunmaAlps: [
    { areaEn: "Northern Alps & Gunma", areaJa: "飛騨・信州・群馬", dayEn: "Shinhotaka & Matsumoto", dayJa: "新穂高・松本連絡バス", placeEn: "Nohi Bus & Alpico Highway Bus Official Route Guide (Takayama ↔ Shinhotaka / Hirayu / Matsumoto)", placeJa: "濃飛バス＆アルピコ交通 公式路線・時刻表（高山〜新穂高ロープウェイ〜松本）", url: "https://www.nouhibus.co.jp/english/", noteEn: "Nohi Bus runs every 1–2 hrs from Takayama Nohi Bus Center to Shinhotaka Ropeway (¥4,400 2-Day Open Pass) and direct via Abo Tunnel to Matsumoto (¥4,400, 2h25m).", noteJa: "高山濃飛バスセンターから新穂高ロープウェイ（2日フリー¥4,400）や、安房トンネル経由・松本直通バス（¥4,400）が便利。", isExisting: true },
    { areaEn: "Northern Alps & Gunma", areaJa: "飛騨・信州・群馬", dayEn: "Takasaki ↔ Kusatsu Onsen", dayJa: "高崎〜草津温泉連絡", placeEn: "JR Agatsuma Line + JR Bus Kanto Official Route (Takasaki ↔ Naganoharakusatsuguchi ↔ Kusatsu)", placeJa: "JR吾妻線＋JRバス関東 公式案内（高崎〜長野原草津口〜草津温泉バスターミナル）", url: "https://www.kusatsu-onsen.ne.jp/guide/en/access/", noteEn: "Seamless rail-to-bus transfer at Naganoharakusatsuguchi Station straight into Kusatsu Onsen Town (~¥2,010 one-way, 2h05m total).", noteJa: "高崎からJR吾妻線で長野原草津口駅へ（¥1,230）、駅前のJRバス接続で草津温泉中心部へ約25分（¥780）。", isExisting: true }
  ]
};

window.buildAccessListFromKeys = function(keys) {
  let idx = 1;
  const enArr = [];
  const jaArr = [];
  keys.forEach(k => {
    (window.METRO_ACCESS_BY_LOC[k] || []).forEach(it => {
      const id = "acc_p_" + (idx++);
      enArr.push({ id, area: it.areaEn, day: it.dayEn, place: it.placeEn, url: it.url, note: it.noteEn, isExisting: it.isExisting });
      jaArr.push({ id, area: it.areaJa, day: it.dayJa, place: it.placeJa, url: it.url, note: it.noteJa, isExisting: it.isExisting });
    });
  });
  return { en: enArr, ja: jaArr };
};

window.GUIDES_BY_LOC = {
  Tokyo: [
    { areaEn: "Tokyo", areaJa: "東京", dayEn: "Tokyo East", dayJa: "東京東エリア", locEn: "Asakusa Senso-ji, Sumida River & Ueno Park Official Guide", locJa: "浅草寺・隅田公園・上野恩賜公園 散策ガイド", url: "https://www.japan-guide.com/e/e3004.html", noteEn: "Complete walking guide to Kaminarimon Gate, Nakamise Street, and Ueno Park.", noteJa: "雷門・仲見世通りから隅田川テラス、上野公園を巡る王道ガイド。" },
    { areaEn: "Tokyo", areaJa: "東京", dayEn: "Tokyo West", dayJa: "東京西エリア", locEn: "Shinjuku, Meiji Jingu Shrine & Shibuya Guide", locJa: "明治神宮・新宿御苑・渋谷 散策ガイド", url: "https://www.japan-guide.com/e/e3007.html", noteEn: "Explore Tokyo's forested Meiji Shrine, Shinjuku Gyoen gardens, and Shibuya Crossing.", noteJa: "都心の杜・明治神宮と新宿御苑の庭園、渋谷パノラマ夜景ガイド。" },
    { areaEn: "Tokyo", areaJa: "東京", dayEn: "Central & Bay", dayJa: "東京駅・湾岸", locEn: "Tokyo Station, Imperial Palace, Ginza & Odaiba Bay Guide", locJa: "皇居東御苑・銀座・お台場ベイエリアガイド", url: "https://www.japan-guide.com/e/e2164.html", noteEn: "Top highlights across Marunouchi, Ginza shopping, Toyosu Market, and Tokyo Bay.", noteJa: "丸の内・皇居東御苑の歴史散策から銀座ショッピング、豊洲・お台場まで。" }
  ],
  Kanazawa: [
    { areaEn: "Kanazawa & Kaga Onsen", areaJa: "金沢・加賀温泉", dayEn: "Kanazawa Day 1", dayJa: "金沢1日目", locEn: "Kenrokuen Garden & Kanazawa Castle Guide", locJa: "日本三名園・兼六園（雪吊り）＆金沢城公園ガイド", url: "https://www.japan-guide.com/e/e2167.html", noteEn: "Iconic winter Yukitsuri rope-umbrella pine trees, Kotojitoro lantern, and Kanazawa Castle.", noteJa: "冬の風物詩「雪吊り」と徽軫灯籠で名高い兼六園・金沢城の見どころ。" },
    { areaEn: "Kanazawa & Kaga Onsen", areaJa: "金沢・加賀温泉", dayEn: "Kanazawa Day 2", dayJa: "金沢2日目", locEn: "Higashi Chaya Geisha District & Nagamachi Samurai Quarter", locJa: "ひがし茶屋街・長町武家屋敷跡・近江町市場 町歩きガイド", url: "https://visitkanazawa.jp/en/trip-ideas/detail_251.html", noteEn: "Preserved wooden latticework teahouses, Nomura Samurai Residence, and gold-leaf workshops.", noteJa: "紅殻格子の美しい茶屋街と土塀が続く武家屋敷跡の散策コース。" },
    { areaEn: "Kanazawa & Kaga Onsen", areaJa: "金沢・加賀温泉", dayEn: "Kaga Onsen", dayJa: "加賀温泉郷", locEn: "Kaga Onsenkyo (Yamanaka & Yamashiro Hot Springs) Guide", locJa: "加賀温泉郷（山中温泉・鶴仙渓＆山代温泉・古総湯）湯めぐりガイド", url: "https://www.japan-guide.com/e/e4275.html", noteEn: "1,300-year-old hot spring towns near Kanazawa featuring Kakusenkei Gorge.", noteJa: "開湯1300年の歴史を誇る山中温泉・鶴仙渓の渓谷美と山代温泉。" }
  ],
  Takayama: [
    { areaEn: "Shirakawa-go, Gokayama & Takayama", areaJa: "白川郷・五箇山・高山", dayEn: "Gokayama & Shirakawa-go", dayJa: "五箇山・白川郷", locEn: "UNESCO Shirakawa-go & Gokayama Ainokura Gassho-zukuri Villages", locJa: "世界遺産・白川郷＆五箇山（相倉合掌造り集落）雪景色ガイド", url: "https://www.japan-guide.com/e/e5950.html", noteEn: "Guide to Ogimachi Observation Deck and tranquil Ainokura thatched farmhouses.", noteJa: "合掌造り家屋が雪に包まれる五箇山・相倉集落と白川郷展望台の絶景。" },
    { areaEn: "Shirakawa-go, Gokayama & Takayama", areaJa: "白川郷・五箇山・高山", dayEn: "Takayama Old Town", dayJa: "飛騨高山", locEn: "Takayama Sanmachi Suji Historic District & Takayama Jinya", locJa: "飛騨高山 古い町並（さんまち通り）・高山陣屋ガイド", url: "https://www.japan-guide.com/e/e5900.html", noteEn: "Edo-period merchant streets, preserved Takayama Jinya outpost, and sake breweries.", noteJa: "江戸時代の面影を残す城下町と、現存する代官所・高山陣屋の散策案内。" },
    { areaEn: "Shirakawa-go, Gokayama & Takayama", areaJa: "白川郷・五箇山・高山", dayEn: "Takayama Markets", dayJa: "高山朝市・里山", locEn: "Miyagawa Morning Market & Hida Folk Village (Hida no Sato)", locJa: "宮川朝市＆飛騨の里（合掌造り民家園）観光ガイド", url: "https://www.japan-guide.com/e/e5901.html", noteEn: "Riverside morning stalls and open-air Hida farmhouses overlooking a scenic pond.", noteJa: "宮川沿いの朝市食べ歩きと、雪化粧した飛騨の古民家が集まる飛騨の里。" }
  ],
  Sapporo: [
    { areaEn: "Sapporo & Otaru", areaJa: "札幌・小樽", dayEn: "Sapporo City", dayJa: "札幌市内", locEn: "Sapporo Odori Park, Beer Museum & Mt. Moiwa Night View Guide", locJa: "札幌大通公園・サッポロビール博物館・藻岩山夜景ガイド", url: "https://www.japan-guide.com/e/e2163.html", noteEn: "Explore Sapporo's green boulevard, Meiji beer heritage, and Mt. Moiwa ropeway.", noteJa: "大通公園から赤レンガのサッポロビール園、藻岩山ロープウェイまで。" },
    { areaEn: "Sapporo & Otaru", areaJa: "札幌・小樽", dayEn: "Otaru Day Trip", dayJa: "小樽日帰り", locEn: "Otaru Canal Gas Lamps, Sakaimachi Glassware & Music Box Museum", locJa: "小樽運河・堺町通り（北一硝子・オルゴール堂）散策ガイド", url: "https://www.japan-guide.com/e/e6700.html", noteEn: "35-minute coastal train ride from Sapporo to historic canal warehouses.", noteJa: "札幌から快速35分！ガス灯ともる小樽運河と歴史的石造倉庫群の散策。" }
  ],
  Noboribetsu: [
    { areaEn: "Furano & Noboribetsu Onsen", areaJa: "富良野・登別温泉", dayEn: "Noboribetsu Onsen", dayJa: "登別温泉", locEn: "Noboribetsu Jigokudani (Hell Valley) & Oyunuma Footbath Trail", locJa: "登別温泉 地獄谷・大湯沼・天然足湯ハイキングガイド", url: "https://www.japan-guide.com/e/e6750.html", noteEn: "Walk wooden boardwalks past steaming volcanic vents and soak your feet in a warm sulfur river.", noteJa: "噴気立ち上る地獄谷の遊歩道と、森の中で楽しむ大湯沼川の天然足湯。" },
    { areaEn: "Furano & Noboribetsu Onsen", areaJa: "富良野・登別温泉", dayEn: "Furano & Biei", dayJa: "富良野・美瑛", locEn: "Furano Farm Tomita Lavender Fields & Biei Shirogane Blue Pond", locJa: "富良野ファーム富田ラベンダー畑＆美瑛・白金青い池 絶景ガイド", url: "https://www.japan-guide.com/e/e6825.html", noteEn: "Summer rainbow flower hills in Nakafurano and cobalt-blue mineral waters in Biei.", noteJa: "夏のラベンダー絨毯と、コバルトブルーに輝く美瑛「青い池」の周遊。" }
  ],
  Hakodate: [
    { areaEn: "Hakodate", areaJa: "函館", dayEn: "Hakodate Night & Bay", dayJa: "函館山・元町", locEn: "Mt. Hakodate Ropeway Night View, Motomachi & Red Brick Warehouses", locJa: "函館山ロープウェイ百万ドルの夜景・元町・赤レンガ倉庫ガイド", url: "https://www.japan-guide.com/e/e5350.html", noteEn: "Iconic hourglass peninsula night view paired with Hachimanzaka Slope and bayfront warehouses.", noteJa: "両側を海に挟まれた奇跡の夜景と、八幡坂・異国情緒あふれる元町散策。" },
    { areaEn: "Hakodate", areaJa: "函館", dayEn: "Goryokaku & Market", dayJa: "五稜郭・朝市", locEn: "Fort Goryokaku Star Citadel & Hakodate Morning Market", locJa: "特別史跡・五稜郭タワー＆函館朝市 観光ガイド", url: "https://www.japan-guide.com/e/e5352.html", noteEn: "Bird's-eye view of the 19th-century five-pointed star fortress and morning squid fishing.", noteJa: "星形の西洋式城郭・五稜郭の展望と函館朝市の名物イカの活き釣り体験。" }
  ],
  Fukuoka: [
    { areaEn: "Fukuoka & Dazaifu", areaJa: "福岡・太宰府", dayEn: "Fukuoka City", dayJa: "福岡市内", locEn: "Fukuoka Ohori Park, Kushida Shrine & Nakasu Yatai Guide", locJa: "福岡・櫛田神社・大濠公園・中洲屋台ストリート散策ガイド", url: "https://www.japan-guide.com/e/e2161.html", noteEn: "Discover Hakata's guardian shrine, lakeside Ohori Park, and riverside yatai stalls.", noteJa: "博多総鎮守・櫛田神社の飾り山笠と大濠公園、夜の中洲・天神屋台めぐり。" },
    { areaEn: "Fukuoka & Dazaifu", areaJa: "福岡・太宰府", dayEn: "Dazaifu Excursion", dayJa: "太宰府天満宮", locEn: "Dazaifu Tenmangu Shrine & Kyushu National Museum Guide", locJa: "太宰府天満宮＆九州国立博物館ガイド", url: "https://www.japan-guide.com/e/e4850.html", noteEn: "Historic shrine grounds, vermilion arched bridges, and freshly grilled Umegae Mochi.", noteJa: "梅が咲く学問の神様・太宰府天満宮と焼きたて梅ヶ枝餅。" }
  ],
  Beppu: [
    { areaEn: "Beppu, Yufuin & Kurokawa Onsen", areaJa: "別府・由布院・黒川温泉", dayEn: "Beppu Onsen", dayJa: "別府地獄めぐり", locEn: "Beppu Hells Tour (Umi Jigoku & Chinoike Jigoku) & Sand Bath", locJa: "別府地獄めぐり（海地獄・血の池地獄）＆竹瓦温泉砂湯ガイド", url: "https://www.japan-guide.com/e/e4700.html", noteEn: "Cobalt-blue boiling Umi Jigoku pond, red Chinoike Hell, and steaming hot springs.", noteJa: "コバルトブルーの海地獄や赤い血の池地獄など、別府ならではの温泉絶景めぐり。" },
    { areaEn: "Beppu, Yufuin & Kurokawa Onsen", areaJa: "別府・由布院・黒川温泉", dayEn: "Yufuin & Kinrinko", dayJa: "由布院・金鱗湖", locEn: "Yufuin Yunotsubo Street & Misty Lake Kinrinko Morning Walk", locJa: "由布院・湯の坪街道食べ歩き＆朝霧の金鱗湖 散策ガイド", url: "https://www.japan-guide.com/e/e4750.html", noteEn: "Boutique cafes and art museums framed by twin-peaked Mt. Yufu and spring-fed Lake Kinrinko.", noteJa: "由布岳を望む湯の坪街道のスイーツ散策と、温泉と清水が湧く金鱗湖。" },
    { areaEn: "Beppu, Yufuin & Kurokawa Onsen", areaJa: "別府・由布院・黒川温泉", dayEn: "Kurokawa Onsen", dayJa: "黒川温泉", locEn: "Kurokawa Onsen Nyuto Tegata (Bath-Hopping Pass Guide)", locJa: "黒川温泉「入湯手形」で巡る渓流露天風呂3湯ガイド", url: "https://www.japan-guide.com/e/e4575.html", noteEn: "Use a cedar Nyuto Tegata pass to soak in 3 riverside, cave, and forest hot springs.", noteJa: "杉の入湯手形を首に下げて浴衣で好みの露天風呂3ヶ所を巡る極上体験。" }
  ],
  Kumamoto: [
    { areaEn: "Kumamoto & Mt. Aso", areaJa: "熊本・阿蘇", dayEn: "Mt. Aso Caldera", dayJa: "阿蘇カルデラ", locEn: "Mount Aso Nakadake Crater, Kusasenri Meadow & Daikanbo", locJa: "阿蘇中岳火口・草千里ヶ浜・大観峰 絶景ガイド", url: "https://www.japan-guide.com/e/e4552.html", noteEn: "One of the world's largest volcanic calderas with grazing horses on emerald Kusasenri plains.", noteJa: "世界最大級のカルデラ・草千里の草原と大観峰からの阿蘇五岳パノラマ。" },
    { areaEn: "Kumamoto & Mt. Aso", areaJa: "熊本・阿蘇", dayEn: "Kumamoto City", dayJa: "熊本市内", locEn: "Kumamoto Castle Skywalk & Suizenji Jojuen Garden Guide", locJa: "熊本城（特別見学通路）＆水前寺成趣園 観光ガイド", url: "https://www.japan-guide.com/e/e4500.html", noteEn: "Imposing curved stone walls, restored castle keep, and Edo-period spring-water stroll garden.", noteJa: "武者返しの石垣と復興した天守閣、阿蘇の伏流水が湧く水前寺成趣園。" }
  ],
  Kyoto: [
    { areaEn: "Kyoto", areaJa: "京都", dayEn: "East Kyoto", dayJa: "京都東山・伏見", locEn: "Fushimi Inari Taisha, Kiyomizu-dera & Tofuku-ji Autumn Maples", locJa: "伏見稲荷大社・清水寺・東福寺（通天橋紅葉）＆祇園ガイド", url: "https://www.japan-guide.com/e/e2158.html", noteEn: "Walk from Tofuku-ji & Kiyomizu-dera's wooden stages down Sannenzaka lanes into Gion.", noteJa: "東福寺の紅葉や清水の舞台から二年坂・産寧坂、祇園花見小路へ歩く王道コース。" },
    { areaEn: "Kyoto", areaJa: "京都", dayEn: "West & North Kyoto", dayJa: "京都嵐山・金閣寺", locEn: "Arashiyama Bamboo Grove, Tenryu-ji & Kinkaku-ji Golden Pavilion", locJa: "嵐山・竹林の小径・天龍寺＆金閣寺（鹿苑寺）観光ガイド", url: "https://www.japan-guide.com/e/e3912.html", noteEn: "Togetsukyo Bridge, UNESCO Tenryu-ji Sogenchi Pond, and gold-leaf Kinkaku-ji.", noteJa: "渡月橋・天龍寺から竹林の小径、黄金に輝く金閣寺を巡るガイド。" }
  ],
  Osaka: [
    { areaEn: "Osaka", areaJa: "大阪", dayEn: "Osaka Central & South", dayJa: "大阪キタ・ミナミ", locEn: "Dotonbori Canal, Kuromon Market, Shinsekai & Umeda Sky Building", locJa: "道頓堀・黒門市場・新世界＆梅田スカイビル空中庭園ガイド", url: "https://www.japan-guide.com/e/e2157.html", noteEn: "Glico neon boardwalk, Kuromon market seafood tastings, and 360-degree rooftop views.", noteJa: "グリコ看板の道頓堀や黒門市場の食べ歩き、梅田スカイビルからの夜景ガイド。" },
    { areaEn: "Osaka", areaJa: "大阪", dayEn: "Osaka Castle", dayJa: "大阪城公園", locEn: "Osaka Castle Park & Nishinomaru Garden Guide", locJa: "大坂城天守閣・西の丸庭園 観光ガイド", url: "https://www.japan-guide.com/e/e4000.html", noteEn: "Explore Toyotomi Hideyoshi's historic stronghold surrounded by massive granite moats.", noteJa: "巨石石垣と黄金の茶室で知られる大阪城天守閣と堀めぐりガイド。" }
  ],
  Kobe: [
    { areaEn: "Kobe & Arima Onsen", areaJa: "神戸・有馬温泉", dayEn: "Kobe Harbor & Kitano", dayJa: "神戸港・北野", locEn: "Kobe Meriken Park Harborland, Kitano Ijinkan & Mt. Rokko Night View", locJa: "神戸メリケンパーク・北野異人館街・六甲山夜景ガイド", url: "https://www.japan-guide.com/e/e2159.html", noteEn: "Port of Kobe red tower, 19th-century hilltop residences, and harborfront dining.", noteJa: "港町神戸のウォーターフロントと北野異人館、日本三大夜景ガイド。" },
    { areaEn: "Kobe & Arima Onsen", areaJa: "神戸・有馬温泉", dayEn: "Arima Onsen", dayJa: "有馬温泉", locEn: "Arima Onsen Kin-no-Yu (Golden Spring) & Gin-no-Yu Guide", locJa: "日本三古湯・有馬温泉「金の湯」「銀の湯」湯めぐりガイド", url: "https://www.japan-guide.com/e/e3558.html", noteEn: "Just 30 minutes from Sannomiya—soak in reddish-brown Kinsen iron-salt hot springs.", noteJa: "三宮からわずか30分！赤褐色の名湯「金の湯」と炭酸泉「銀の湯」の湯めぐり。" }
  ],
  Hiroshima: [
    { areaEn: "Hiroshima & Miyajima", areaJa: "広島・宮島", dayEn: "Hiroshima City", dayJa: "広島市内", locEn: "Hiroshima Peace Memorial Park, Atomic Bomb Dome & Shukkeien", locJa: "広島平和記念公園・原爆ドーム・名勝 縮景園 見学ガイド", url: "https://www.japan-guide.com/e/e2160.html", noteEn: "UNESCO Peace Memorial Museum, Cenotaph, and historic Shukkeien stroll garden.", noteJa: "世界遺産・原爆ドームと平和記念資料館、大名庭園「縮景園」。" },
    { areaEn: "Hiroshima & Miyajima", areaJa: "広島・宮島", dayEn: "Miyajima Island", dayJa: "宮島・厳島", locEn: "Miyajima Itsukushima Shrine Floating Torii & Mt. Misen Ropeway", locJa: "安芸の宮島・厳島神社（大鳥居）＆弥山ロープウェイ絶景ガイド", url: "https://www.japan-guide.com/e/e3450.html", noteEn: "Tide-table tips for viewing the vermilion O-Torii floating at high tide and walking up close at low tide.", noteJa: "満潮時に海に浮かぶ朱塗りの大鳥居と、瀬戸内海の多島美を望む弥山山頂。" }
  ],
  Okinawa: [
    { areaEn: "Okinawa Main Island", areaJa: "沖縄本島", dayEn: "Naha & South", dayJa: "那覇・首里・南部", locEn: "Shuri Castle Park, Kokusai Dori, Makishi Market & Senagajima Sunset", locJa: "首里城公園・国際通り・牧志公設市場＆瀬長島ウミカジテラスガイド", url: "https://www.japan-guide.com/e/e7100.html", noteEn: "Ryukyu Kingdom heritage at Shuri, Yachimun pottery street, and Umikaji oceanfront cafes.", noteJa: "琉球王国の歴史息づく首里城と、やちむん通り・国際通りの散策ガイド。" },
    { areaEn: "Okinawa Main Island", areaJa: "沖縄本島", dayEn: "Onna-son & Churaumi", dayJa: "恩納村・美ら海", locEn: "Okinawa Churaumi Aquarium, Cape Manzamo & Kouri Island Bridge", locJa: "沖縄美ら海水族館・万座毛・備瀬フクギ並木＆古宇利大橋ガイド", url: "https://www.japan-guide.com/e/e7109.html", noteEn: "Whale sharks in the Kuroshio Tank, emerald coral reefs at Cape Manzamo, and Bise Fukugi tree tunnel.", noteJa: "ジンベエザメが泳ぐ黒潮の海大水槽、エメラルドグリーンの古宇利大橋と万座毛。" },
    { areaEn: "Okinawa Main Island", areaJa: "沖縄本島", dayEn: "Beaches & Snorkeling", dayJa: "青の洞窟・ビーチ", locEn: "Onna-son Blue Cave (Cape Maeda) & Emerald Coast Beach Guide", locJa: "恩納村「青の洞窟（真栄田岬）」シュノーケリング＆西海岸ビーチガイド", url: "https://visitokinawa.jp/", noteEn: "Book morning Blue Cave snorkeling/diving slots when ocean visibility is clearest.", noteJa: "透明度の高い午前中が狙い目！真栄田岬・青の洞窟アクティビティ案内。" }
  ],
  Ishigaki: [
    { areaEn: "Ishigaki & Taketomi Islands", areaJa: "石垣島・竹富島", dayEn: "Ishigaki Island", dayJa: "石垣島一周", locEn: "Kabira Bay Glass-Bottom Boat, Tamatorizaki Cape & Starry Sky Guide", locJa: "石垣島 川平湾グラスボート・玉取崎展望台＆星空保護区ガイド", url: "https://www.japan-guide.com/e/e7201.html", noteEn: "Seven-shade emerald lagoon at Kabira Bay and panoramic Pacific/East China Sea ridge views.", noteJa: "ミシュラン三ツ星の川平湾グラスボートとハイビスカス咲く玉取崎展望台。" },
    { areaEn: "Ishigaki & Taketomi Islands", areaJa: "石垣島・竹富島", dayEn: "Taketomi Island", dayJa: "竹富島日帰り", locEn: "Taketomi Island Cycling, Water Buffalo Carts, Kondoi & Star Sand Beach", locJa: "竹富島 赤瓦集落サイクリング・水牛車・コンドイ浜＆星砂の浜ガイド", url: "https://www.japan-guide.com/e/e7203.html", noteEn: "Just 10 min by high-speed ferry from Ishigaki—preserve traditional Ryukyu red-tile roofs & coral-sand lanes.", noteJa: "石垣島から高速船10分！白砂の道と赤瓦屋根、水牛車に揺られる沖縄の原風景。" }
  ],
  Onsen: [
    { areaEn: "Hakone & Mt. Fuji", areaJa: "箱根・富士山", dayEn: "Mt. Fuji & Kawaguchiko", dayJa: "富士山・河口湖", locEn: "Lake Kawaguchiko, Ropeway & Chureito Pagoda Scenic Guide", locJa: "河口湖・富士山パノラマロープウェイ＆富士五湖絶景ガイド", url: "https://www.japan-guide.com/e/e6900.html", noteEn: "Best morning Mt. Fuji reflections along northern Lake Kawaguchiko shores and Oishi Park.", noteJa: "逆さ富士が美しい河口湖北岸・大石公園と周辺観光スポット。" },
    { areaEn: "Hakone & Mt. Fuji", areaJa: "箱根・富士山", dayEn: "Hakone Loop", dayJa: "箱根ゴールデンコース", locEn: "Hakone Round Course (Ropeway over Owakudani, Lake Ashi & Hakone Shrine)", locJa: "箱根ゴールデンコース（大涌谷ロープウェイ・芦ノ湖海賊船・箱根神社）", url: "https://www.japan-guide.com/e/e5200.html", noteEn: "Classic ropeway and lake cruise loop with Mt. Fuji views and lakeside red torii gate.", noteJa: "登山電車・ロープウェイ・芦ノ湖海賊船を乗り継ぐ箱根の王道周遊コース。" }
  ],
  IzuShizuoka: [
    { areaEn: "Atami & Kawazu Sakura", areaJa: "熱海・河津桜", dayEn: "Atami & Kawazu", dayJa: "熱海梅園・河津桜", locEn: "Atami Plum Garden (Late-Feb Peak Ume) & Kawazu Early Cherry Blossoms", locJa: "熱海梅園（梅まつり）＆河津桜まつり（2月下旬満開の早咲き桜並木）", url: "https://www.japan-guide.com/e/e6314.html", noteEn: "Catch late-February peak deep-pink Kawazu-zakura lining Kawazu River plus 460 early-to-late plum trees in Atami Baien.", noteJa: "河津川沿い約850本の濃いピンクの河津桜と、熱海梅園の早咲き〜遅咲き梅リレーを同日に満喫。" },
    { areaEn: "Shizuoka & Fujikawa", areaJa: "静岡・富士川", dayEn: "Fujikawa & Nihondaira", dayJa: "富士川SA・日本平・三保松原", locEn: "Starbucks EXPASA Fujikawa Mt. Fuji Viewpoint, Nihondaira Yume Terrace & Miho-no-Matsubara", locJa: "富士川SAスタバ富士山絶景・日本平夢テラス＆三保松原 ガイド", url: "https://www.japan-guide.com/e/e6350.html", noteEn: "Visit EXPASA Fujikawa around 07:30–09:00 AM for crystal-clear morning Mt. Fuji reflections, then panoramic Suruga Bay terraces.", noteJa: "朝7時台〜9時台が富士川の雲のない逆光少なめの富士山絶景ベストタイム。午後は三保松原と静岡おでん。" }
  ],
  GunmaAlps: [
    { areaEn: "Northern Alps & Matsumoto", areaJa: "新穂高・松本", dayEn: "Shinhotaka & Matsumoto", dayJa: "新穂高ロープウェイ・松本城", locEn: "Shinhotaka Double-Decker Ropeway (2,156m Winter Alps) & Matsumoto Castle Snow Peaks", locJa: "新穂高ロープウェイ（標高2,156m西穂高口・雪の回廊）＆国宝松本城", url: "https://www.japan-guide.com/e/e5942.html", noteEn: "Ascend to 2,156m Nishihotakaguchi Observatory in winter snow wall corridors, and photograph snow-capped Alps behind black Matsumoto Castle.", noteJa: "日本唯一の2階建てゴンドラで標高2,156mへ！白銀の北アルプス大パノラマと黒漆塗りの国宝松本城。" },
    { areaEn: "Gunma • Kusatsu Onsen", areaJa: "群馬・草津温泉", dayEn: "Kusatsu Onsen", dayJa: "草津温泉（湯畑・西の河原）", locEn: "Kusatsu Onsen Yubatake Steam Field, Yumomi Dance & Sainokawara Snow Rotenburo", locJa: "草津温泉「湯畑」湯けむり散策・湯もみショー＆西の河原雪見露天風呂", url: "https://www.japan-guide.com/e/e7400.html", noteEn: "Japan's #1 mineral spring town in dramatic winter steam around the illuminated Yubatake sulfur wooden conduits.", noteJa: "冬の雪化粧と湯畑のモクモクと立ち上る湯けむりが幻想的な日本三名泉・草津温泉。" }
  ]
};

window.buildGuidesListFromKeys = function(keys) {
  let idx = 1;
  const enArr = [];
  const jaArr = [];
  keys.forEach(k => {
    (window.GUIDES_BY_LOC[k] || []).slice(0, 3).forEach(it => {
      const id = "gd_p_" + (idx++);
      enArr.push({ id, area: it.areaEn, day: it.dayEn, location: it.locEn, url: it.url, note: it.noteEn, isExisting: true });
      jaArr.push({ id, area: it.areaJa, day: it.dayJa, location: it.locJa, url: it.url, note: it.noteJa, isExisting: true });
    });
  });
  return { en: enArr, ja: jaArr };
};

window.WIZARD_CITIES = [
  { key: "Tokyo", labelEn: "🗼 Tokyo", labelJa: "🗼 東京", regEn: "Tokyo", regJa: "東京", hotelEn: "Tokyo Station / Shinjuku Hotel", hotelJa: "東京・新宿ベースホテル", foodKeys: ["Tokyo"], accessKeys: ["Tokyo"], guideKeys: ["Tokyo"] },
  { key: "Kyoto", labelEn: "⛩️ Kyoto", labelJa: "⛩️ 京都", regEn: "Kyoto", regJa: "京都", hotelEn: "Kyoto Station Hotel", hotelJa: "京都駅周辺ホテル", foodKeys: ["Kyoto"], accessKeys: ["Kansai"], guideKeys: ["Kyoto"] },
  { key: "Osaka", labelEn: "🏮 Osaka", labelJa: "🏮 大阪", regEn: "Osaka", regJa: "大阪", hotelEn: "Namba / Umeda Hotel (Osaka)", hotelJa: "なんば・梅田ホテル（大阪）", foodKeys: ["Osaka"], accessKeys: ["Kansai"], guideKeys: ["Osaka"] },
  { key: "FujiHakone", labelEn: "🗻 Mt. Fuji / Hakone", labelJa: "🗻 富士山・箱根", regEn: "Mt. Fuji & Hakone", regJa: "富士山・箱根", hotelEn: "Kawaguchiko / Hakone Onsen Hotel", hotelJa: "河口湖・箱根温泉宿", foodKeys: ["Onsen"], accessKeys: ["Onsen"], guideKeys: ["Onsen"] },
  { key: "Kanazawa", labelEn: "🏯 Kanazawa", labelJa: "🏯 金沢", regEn: "Kanazawa", regJa: "金沢", hotelEn: "Kanazawa Station Hotel", hotelJa: "金沢駅周辺ホテル", foodKeys: ["Kanazawa"], accessKeys: ["Kanazawa"], guideKeys: ["Kanazawa"] },
  { key: "Takayama", labelEn: "🏔️ Takayama", labelJa: "🏔️ 高山・白川郷", regEn: "Takayama & Shirakawa-go", regJa: "高山・白川郷", hotelEn: "Hida Takayama Station Hotel", hotelJa: "飛騨高山駅周辺ホテル", foodKeys: ["Takayama"], accessKeys: ["Kanazawa", "GunmaAlps"], guideKeys: ["Takayama"] },
  { key: "Hiroshima", labelEn: "🦌 Hiroshima", labelJa: "🦌 広島・宮島", regEn: "Hiroshima & Miyajima", regJa: "広島・宮島", hotelEn: "JR Hiroshima Station Hotel", hotelJa: "広島駅周辺ホテル", foodKeys: ["Hiroshima"], accessKeys: ["Kansai"], guideKeys: ["Hiroshima"] },
  { key: "Sapporo", labelEn: "❄️ Sapporo", labelJa: "❄️ 札幌・小樽", regEn: "Sapporo & Otaru", regJa: "札幌・小樽", hotelEn: "Sapporo Station / Odori Hotel", hotelJa: "札幌・大通周辺ホテル", foodKeys: ["Sapporo"], accessKeys: ["Hokkaido"], guideKeys: ["Sapporo"] },
  { key: "Fukuoka", labelEn: "🍜 Fukuoka", labelJa: "🍜 福岡・博多", regEn: "Fukuoka & Kyushu", regJa: "福岡・九州", hotelEn: "JR Hakata Station Hotel (Fukuoka)", hotelJa: "博多駅周辺ホテル（福岡）", foodKeys: ["Fukuoka"], accessKeys: ["Kyushu"], guideKeys: ["Fukuoka"] },
  { key: "Okinawa", labelEn: "🌺 Okinawa", labelJa: "🌺 沖縄", regEn: "Okinawa", regJa: "沖縄本島", hotelEn: "Naha Kokusai Dori Hotel (Okinawa)", hotelJa: "那覇国際通りホテル（沖縄）", foodKeys: ["Okinawa", "Ishigaki"], accessKeys: ["Okinawa"], guideKeys: ["Okinawa", "Ishigaki"] },
  { key: "AtamiShizuoka", labelEn: "🌸 Atami / Shizuoka", labelJa: "🌸 熱海・静岡", regEn: "Atami & Shizuoka", regJa: "熱海・静岡", hotelEn: "Shizuoka / Atami Station Hotel", hotelJa: "静岡・熱海駅周辺ホテル", foodKeys: ["IzuShizuoka"], accessKeys: ["IzuShizuoka"], guideKeys: ["IzuShizuoka"] },
  { key: "KusatsuMatsumoto", labelEn: "♨️ Kusatsu / Matsumoto", labelJa: "♨️ 草津温泉・松本", regEn: "Kusatsu & Matsumoto", regJa: "草津温泉・松本", hotelEn: "Takasaki / Matsumoto Station Hotel", hotelJa: "高崎・松本駅周辺ホテル", foodKeys: ["GunmaAlps"], accessKeys: ["GunmaAlps"], guideKeys: ["GunmaAlps"] }
];

window.detectCatalogKeysFromSchedule = function() {
  const GAZETTEER_TO_CATALOG = {
    sapporo: { f: "Sapporo", a: "Hokkaido", g: "Sapporo" },
    otaru: { f: "Sapporo", a: "Hokkaido", g: "Sapporo" },
    niseko: { f: "Sapporo", a: "Hokkaido", g: "Sapporo" },
    asahikawa: { f: "Sapporo", a: "Hokkaido", g: "Sapporo" },
    kushiro: { f: "Sapporo", a: "Hokkaido", g: "Sapporo" },
    noboribetsu: { f: "Noboribetsu", a: "Hokkaido", g: "Noboribetsu" },
    hakodate: { f: "Hakodate", a: "Hokkaido", g: "Hakodate" },
    tokyo: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    shinjuku: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    asakusa: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    haneda: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    narita: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    yokohama: { f: "Tokyo", a: "Tokyo", g: "Tokyo" },
    hakone: { f: "Onsen", a: "Onsen", g: "Onsen" },
    fuji: { f: "Onsen", a: "Onsen", g: "Onsen" },
    atami: { f: "IzuShizuoka", a: "IzuShizuoka", g: "IzuShizuoka" },
    shizuoka: { f: "IzuShizuoka", a: "IzuShizuoka", g: "IzuShizuoka" },
    kusatsu: { f: "GunmaAlps", a: "GunmaAlps", g: "GunmaAlps" },
    takasaki: { f: "GunmaAlps", a: "GunmaAlps", g: "GunmaAlps" },
    nagano: { f: "GunmaAlps", a: "GunmaAlps", g: "GunmaAlps" },
    kanazawa: { f: "Kanazawa", a: "Kanazawa", g: "Kanazawa" },
    kaga: { f: "Kanazawa", a: "Kanazawa", g: "Kanazawa" },
    gokayama: { f: "Takayama", a: "Kanazawa", g: "Takayama" },
    takayama: { f: "Takayama", a: "Kanazawa", g: "Takayama" },
    kyoto: { f: "Kyoto", a: "Kansai", g: "Kyoto" },
    nara: { f: "Kyoto", a: "Kansai", g: "Kyoto" },
    osaka: { f: "Osaka", a: "Kansai", g: "Osaka" },
    kobe: { f: "Kobe", a: "Kansai", g: "Kobe" },
    hiroshima: { f: "Hiroshima", a: "Kansai", g: "Hiroshima" },
    okayama: { f: "Hiroshima", a: "Kansai", g: "Hiroshima" },
    fukuoka: { f: "Fukuoka", a: "Kyushu", g: "Fukuoka" },
    dazaifu: { f: "Fukuoka", a: "Kyushu", g: "Fukuoka" },
    beppu: { f: "Beppu", a: "Kyushu", g: "Beppu" },
    kurokawa: { f: "Beppu", a: "Kyushu", g: "Beppu" },
    kumamoto: { f: "Kumamoto", a: "Kyushu", g: "Kumamoto" },
    nagasaki: { f: "Kumamoto", a: "Kyushu", g: "Kumamoto" },
    kagoshima: { f: "Kumamoto", a: "Kyushu", g: "Kumamoto" },
    okinawa_north: { f: "Okinawa", a: "Okinawa", g: "Okinawa" },
    chatan: { f: "Okinawa", a: "Okinawa", g: "Okinawa" },
    naha: { f: "Okinawa", a: "Okinawa", g: "Okinawa" },
    kerama: { f: "Okinawa", a: "Okinawa", g: "Okinawa" },
    ishigaki: { f: "Ishigaki", a: "Okinawa", g: "Ishigaki" },
    taketomi: { f: "Ishigaki", a: "Okinawa", g: "Ishigaki" },
    miyakojima: { f: "Ishigaki", a: "Okinawa", g: "Ishigaki" }
  };

  const foodSet = new Set();
  const accessSet = new Set();
  const guideSet = new Set();

  const scanText = (txt) => {
    if (!txt || typeof window.findMatchingGazetteerStops !== "function") return;
    window.findMatchingGazetteerStops(txt).forEach(stop => {
      const m = GAZETTEER_TO_CATALOG[stop.id];
      if (m) {
        if (m.f) foodSet.add(m.f);
        if (m.a) accessSet.add(m.a);
        if (m.g) guideSet.add(m.g);
      }
    });
  };

  const enDays = (window.state && state.dataEn && state.dataEn.days) || [];
  const jaDays = (window.state && state.dataJa && state.dataJa.days) || [];
  enDays.forEach((d, i) => {
    const dj = jaDays[i] || {};
    const combined = `${d.region || ""} ${d.routeJp || ""} ${d.routeEn || ""} ${d.hotel || ""} ${dj.region || ""} ${dj.routeJp || ""}`
      .replace(/\bhotel\s+nikko\b/gi, "");
    scanText(combined);
  });
  ((window.state && state.customMapLocations) || []).forEach(loc => scanText(loc));

  if (foodSet.size === 0) foodSet.add("Tokyo");
  if (accessSet.size === 0) accessSet.add("Tokyo");
  if (guideSet.size === 0) guideSet.add("Tokyo");

  return {
    foodKeys: Array.from(foodSet),
    accessKeys: Array.from(accessSet),
    guideKeys: Array.from(guideSet)
  };
};

window.syncRegionalCatalogsFromSchedule = function() {
  if (!window.state || !state.dataEn || !state.dataJa) return { foodAdded: 0, accessAdded: 0, guidesAdded: 0 };
  const en = typeof window.isEn === "function" ? window.isEn() : true;
  const { foodKeys, accessKeys, guideKeys } = window.detectCatalogKeysFromSchedule();

  const candFood = window.buildGourmetListFromLocations(foodKeys);
  const candAccess = window.buildAccessListFromKeys(accessKeys);
  const candGuides = window.buildGuidesListFromKeys(guideKeys);

  if (!Array.isArray(state.dataEn.food)) state.dataEn.food = [];
  if (!Array.isArray(state.dataJa.food)) state.dataJa.food = [];
  if (!Array.isArray(state.dataEn.access)) state.dataEn.access = [];
  if (!Array.isArray(state.dataJa.access)) state.dataJa.access = [];
  if (!Array.isArray(state.dataEn.guides)) state.dataEn.guides = [];
  if (!Array.isArray(state.dataJa.guides)) state.dataJa.guides = [];

  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

  // Check duplicates before pushing undo snapshot
  const foodKeysEn = new Set(state.dataEn.food.map(f => `${norm(f.dish)}||${norm(f.place)}`));
  const foodKeysJa = new Set(state.dataJa.food.map(f => `${norm(f.dish)}||${norm(f.place)}`));
  const newFoodIdx = [];
  candFood.en.forEach((fEn, i) => {
    const fJa = candFood.ja[i];
    const kEn = `${norm(fEn.dish)}||${norm(fEn.place)}`;
    const kJa = fJa ? `${norm(fJa.dish)}||${norm(fJa.place)}` : kEn;
    if (!foodKeysEn.has(kEn) && !foodKeysJa.has(kJa)) {
      foodKeysEn.add(kEn);
      foodKeysJa.add(kJa);
      newFoodIdx.push(i);
    }
  });

  const accKeysEn = new Set(state.dataEn.access.map(a => norm(a.url) || norm(a.place)));
  const accKeysJa = new Set(state.dataJa.access.map(a => norm(a.url) || norm(a.place)));
  const newAccIdx = [];
  candAccess.en.forEach((aEn, i) => {
    const aJa = candAccess.ja[i];
    const kEn = norm(aEn.url) || norm(aEn.place);
    const kJa = aJa ? (norm(aJa.url) || norm(aJa.place)) : kEn;
    if (kEn && !accKeysEn.has(kEn) && !accKeysJa.has(kJa)) {
      accKeysEn.add(kEn);
      accKeysJa.add(kJa);
      newAccIdx.push(i);
    }
  });

  const gdKeysEn = new Set(state.dataEn.guides.map(g => norm(g.url) || norm(g.location)));
  const gdKeysJa = new Set(state.dataJa.guides.map(g => norm(g.url) || norm(g.location)));
  const newGdIdx = [];
  candGuides.en.forEach((gEn, i) => {
    const gJa = candGuides.ja[i];
    const kEn = norm(gEn.url) || norm(gEn.location);
    const kJa = gJa ? (norm(gJa.url) || norm(gJa.location)) : kEn;
    if (kEn && !gdKeysEn.has(kEn) && !gdKeysJa.has(kJa)) {
      gdKeysEn.add(kEn);
      gdKeysJa.add(kJa);
      newGdIdx.push(i);
    }
  });

  const foodAdded = newFoodIdx.length;
  const accessAdded = newAccIdx.length;
  const guidesAdded = newGdIdx.length;

  if (foodAdded + accessAdded + guidesAdded === 0) {
    if (typeof window.showToast === "function") {
      window.showToast(en
        ? "✓ Gourmet, Metro PDFs & Sightseeing Guides are already up to date for all cities in your schedule"
        : "✓ グルメ・路線図PDF・観光ガイドは現在の訪問都市に合わせて最新です");
    }
    return { foodAdded: 0, accessAdded: 0, guidesAdded: 0 };
  }

  if (typeof window.pushUndoSnapshot === "function") {
    window.pushUndoSnapshot("Sync regional catalogs");
  }

  let nextFoodId = state.dataEn.food.reduce((m, x) => Math.max(m, Number(x.id) || 0), 0) + 1;
  newFoodIdx.forEach(i => {
    const nid = nextFoodId++;
    state.dataEn.food.push(Object.assign({}, candFood.en[i], { id: nid }));
    state.dataJa.food.push(Object.assign({}, candFood.ja[i], { id: nid }));
  });

  const stamp = Date.now();
  newAccIdx.forEach((i, n) => {
    const aid = `acc_sync_${stamp}_${n}`;
    state.dataEn.access.push(Object.assign({}, candAccess.en[i], { id: aid }));
    state.dataJa.access.push(Object.assign({}, candAccess.ja[i], { id: aid }));
  });

  newGdIdx.forEach((i, n) => {
    const gid = `gd_sync_${stamp}_${n}`;
    state.dataEn.guides.push(Object.assign({}, candGuides.en[i], { id: gid }));
    state.dataJa.guides.push(Object.assign({}, candGuides.ja[i], { id: gid }));
  });

  if (typeof window.saveState === "function") window.saveState();
  if (typeof window.renderAll === "function") window.renderAll();
  if (typeof window.showToast === "function") {
    window.showToast(en
      ? `✨ Synced from Schedule: +${foodAdded} Gourmet, +${accessAdded} Transit PDFs, +${guidesAdded} Guides`
      : `✨ 日程から自動追加：グルメ+${foodAdded}件・交通PDF+${accessAdded}件・ガイド+${guidesAdded}件`);
  }
  return { foodAdded, accessAdded, guidesAdded };
};
