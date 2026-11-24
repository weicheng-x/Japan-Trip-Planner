// Comprehensive 47-Prefecture Curated Gourmet (Restaurant Homepage + Dedicated Tabelog Search URL), Transit PDFs & Sightseeing Guides

(function() {
  function tbEn(slug, q) {
    return `https://tabelog.com/en/${slug}/rstLst/?sw=${encodeURIComponent(q)}`;
  }
  function tbJa(slug, q) {
    return `https://tabelog.com/${slug}/rstLst/?vs=1&sw=${encodeURIComponent(q)}`;
  }

  function expandPack(prefId, slug, regEn, regJa, cfg) {
    const food = (cfg.f || []).map(([dishEn, dishJa, placeEn, placeJa, url, score, lvl, trEn, trJa, noteEn, noteJa, tbQuery]) => ({
      prefId,
      regionEn: regEn,
      regionJa: regJa,
      dishEn,
      dishJa,
      placeEn,
      placeJa,
      url,
      tabelogUrl: tbEn(slug, tbQuery || placeEn.split("(")[0].split("/")[0].trim()),
      tabelogUrlJa: tbJa(slug, placeJa.split("（")[0].split("／")[0].trim()),
      score,
      transitLevel: lvl || "easy",
      transitEn: trEn,
      transitJa: trJa,
      tagEn: `Prefecture Pick (${regEn})`,
      tagJa: `ご当地名物 (${regJa})`,
      noteEn,
      noteJa
    }));
    const access = (cfg.a || []).map(([dayEn, dayJa, placeEn, placeJa, url, noteEn, noteJa, isExisting]) => ({
      prefId,
      areaEn: regEn,
      areaJa: regJa,
      dayEn,
      dayJa,
      placeEn,
      placeJa,
      url,
      noteEn,
      noteJa,
      isExisting: isExisting !== false
    }));
    const guides = (cfg.g || []).map(([dayEn, dayJa, locEn, locJa, url, noteEn, noteJa]) => ({
      prefId,
      areaEn: regEn,
      areaJa: regJa,
      dayEn,
      dayJa,
      locEn,
      locJa,
      url,
      noteEn,
      noteJa
    }));
    return { prefId, food, access, guides };
  }

  const SPECS = {
    hokkaido: {
      regEn: "Hokkaido", regJa: "北海道",
      f: [
        ["Sapporo Rich Miso Ramen", "札幌濃厚味噌ラーメン", "Sumire Susukino / Ramen Yokocho", "すみれ 札幌すすきの店／ラーメン横丁", "https://www.sumireya.com/", "★ 3.68", "easy", "🟢 3-min walk from Susukino Subway Stn", "🟢 地下鉄すすきの駅徒歩3分", "Sear-blistered miso lard broth locking heat over chewy curly noodles.", "ラードが蓋をする熱々濃厚味噌スープと熟成ちぢれ麺。", "すみれ 札幌"],
        ["Genghis Khan (Grilled Hokkaido Lamb)", "北海道名物 成吉思汗（生ラムジンギスカン）", "Daruma Honten (Susukino)", "成吉思汗だるま 本店（すすきの）", "https://sapporo-jingisukan.info/", "★ 3.71", "easy", "🟢 4-min walk from Susukino Subway Stn", "🟢 地下鉄すすきの駅徒歩4分", "Founded 1954—chilled tender mutton seared over charcoal dome grills.", "1954年創業、臭みのない新鮮生ラムの鉄板焼肉。", "成吉思汗 だるま"],
        ["Morning Market Kaisen-don (Crab & Uni)", "函館・小樽 朝市 海鮮丼（ウニ・カニ・イクラ）", "Hakodate Asaichi / Otaru Sankaku Market", "函館朝市・小樽三角市場 滝波食堂", "https://www.hakodate-asaichi.com/", "★ 3.64", "easy", "🟢 1–2 min walk from JR Hakodate / Otaru Stn", "🟢 JR函館駅・小樽駅より徒歩1〜2分", "Wild Hokkaido sea urchin, salmon roe, and sweet king/snow crab over warm rice.", "獲れたての北海道産生ウニ・イクラ・カニを贅沢に堪能。", "滝波食堂"],
        ["Sapporo Spiced Soup Curry", "札幌名物 スパイススープカレー", "Soup Curry Garaku / Suage+", "スープカレー GARAKU／Suage+", "https://s-garaku.com/", "★ 3.74", "easy", "🟢 3-min walk from Odori / Susukino Stn", "🟢 地下鉄大通駅・すすきの駅徒歩3分", "Dashi-infused spiced curry with roasted Hokkaido pumpkin, potato & chicken.", "和風出汁と秘伝スパイス、素揚げ道産野菜の王道スープカレー。", "GARAKU 札幌"]
      ],
      a: [
        ["Hokkaido Rail", "道内JR線", "JR Hokkaido Official Railway Route Map PDF", "JR北海道 公式鉄道路線図PDF", "https://www.jrhokkaido.co.jp/global/pdf/route_map.pdf", "Covers Sapporo, Chitose, Asahikawa, Furano, Noboribetsu, Otaru & Hakodate.", "新千歳・札幌・小樽・旭川・富良野・登別・函館を網羅する公式路線図PDF。", true],
        ["Sapporo Subway", "札幌地下鉄", "Sapporo Municipal Subway Route Map PDF", "札幌市営地下鉄 公式路線図PDF", "https://www.city.sapporo.jp/st/english/documents/rosenzu_e.pdf", "Full Namboku, Tozai & Toho Line station guide in English.", "南北線・東西線・東豊線の駅番号付き路線図PDF。", true]
      ],
      g: [
        ["Hokkaido Guide", "北海道ガイド", "Hokkaido Love! Official Tourism Portal", "北海道公式観光サイト HOKKAIDO LOVE!", "https://www.visit-hokkaido.jp/en/", "Official seasonal blooms, alpine parks, winter festivals & culinary trails.", "四季の見どころ・ドライブ・鉄道周遊の北海道公式ガイド。", true],
        ["Overview", "定番ガイド", "Japan-Guide Hokkaido Highlights", "ジャパンガイド 北海道特集", "https://www.japan-guide.com/list/e1101.html", "Comprehensive itineraries covering Sapporo, Otaru, Daisetsuzan & Rishiri/Rebun.", "道央・道南・道北・道東のモデルコースと交通案内。"]
      ]
    },
    aomori: {
      regEn: "Aomori", regJa: "青森県",
      f: [
        ["Nokke-don (DIY Sashimi Rice Bowl)", "青森魚菜センター のっけ丼（勝手乗せ海鮮丼）", "Aomori Gyosai Center (Furukawa Market)", "青森魚菜センター（古川市場）", "https://nokkedon.jp/", "★ 3.56", "easy", "🟢 5-min walk from JR Aomori Station", "🟢 JR青森駅から徒歩5分", "Buy meal tickets and pick scallops, Oma tuna & salmon roe stall by stall.", "ホタテ・大間マグロ・イクラなど好きな具材を少しずつ乗せる名物丼。", "青森魚菜センター"],
        ["Hachinohe Shichirin Charcoal Seafood", "八戸 八食センター「七厘村」炭火焼", "Hasshoku Center Shichirin-mura", "八食センター（七厘村・八戸市）", "https://www.849net.com/", "★ 3.55", "bus", "🟡 10 min via ¥100 Bus from JR Hachinohe Stn", "🟡 JR八戸駅から100円バスで約10分", "Buy fresh mackerel, squid & scallops across 60 stalls and grill table-side.", "市場で買った新鮮魚介を七厘でそのまま炭火焼き。", "八食センター 七厘村"],
        ["Tsugaru Niboshi Shoyu Ramen", "弘前・青森 津軽濃厚煮干しラーメン", "Takahashi Chuka Soba / Chuka Soba Hirayama", "たかはし中華そば店／中華そばひら山", "https://www.hirosaki-kanko.or.jp/", "★ 3.71", "easy", "🟢 Accessible from JR Hirosaki / Nishi-Hirosaki Stn", "🟢 JR弘前・撫牛子方面からアクセス", "Deep dried-sardine soy broth paired with thick chewy hand-kneaded noodles.", "津軽発祥の濃厚煮干し出汁にモチモチ中太麺が絡むご当地ラーメン。", "たかはし中華そば 弘前"],
        ["Oma Pacific Bluefin Tuna & Hotate", "大間産本マグロ＆陸奥湾ホタテ貝焼き味噌", "Osakana Shokudo / Oma Seafood Stalls", "おさかな処・大間マグロ直売／お食事処", "https://www.aptinet.jp/", "★ 3.60", "bus", "🟡 Downtown Aomori & Mutsu Bay harborfront", "🟡 青森市街・大間港周辺", "Wild Tsugaru Strait bluefin tuna and miso-simmered Mutsu Bay scallops.", "津軽海峡の黒いダイヤ『大間マグロ』と陸奥湾の濃厚ホタテ。", "大間 マグロ 青森"]
      ],
      a: [
        ["Aomori Transit", "青森交通", "Visit Aomori Rail & Bus Access Guide", "あおもり観光 鉄道・バスアクセスガイド", "https://aomori-tourism.com/en/access/", "Tohoku Shinkansen (Shin-Aomori/Hachinohe), JR Ou Line & Resort Shirakami details.", "東北新幹線（新青森・八戸）や奥羽本線・青い森鉄道・リゾートしらかみ案内。"],
        ["Hachinohe Bus", "八戸バス", "Visit Hachinohe Hasshoku 100-Yen Bus & Bay Guide", "八戸観光 100円バス＆市内移動ガイド", "https://visithachinohe.com/en/", "Covers Hasshoku Center ¥100 shuttle & Same/Kabushima Umineko bus lines.", "八食センター100円バスや種差海岸・蕪島方面のバス時刻案内。"]
      ],
      g: [
        ["Aomori Guide", "青森ガイド", "Official Aomori Travel Guide (Aptinet)", "青森県観光情報サイト Amazing AOMORI", "https://aomori-tourism.com/en/", "Hirosaki Castle, Oirase Gorge, Lake Towada, Hakkoda & Nebuta Museum.", "弘前城・奥入瀬渓流・十和田湖・八甲田山・ねぶた祭りの公式ガイド。"],
        ["Japan-Guide", "基本ガイド", "Japan-Guide Aomori Prefecture Overview", "ジャパンガイド 青森県", "https://www.japan-guide.com/list/e1202.html", "Complete area guide linking Shin-Aomori, Hirosaki, Hachinohe & Shimokita.", "青森県全域の見どころとモデルコース。"]
      ]
    },
    iwate: {
      regEn: "Iwate", regJa: "岩手県",
      f: [
        ["Morioka Wanko Soba Challenge", "盛岡名物 わんこそば（無限おかわり体験）", "Azumaya Honten (Morioka)", "東家 本店（盛岡市）", "https://www.wankosoba-azumaya.co.jp/", "★ 3.62", "easy", "🟢 5-min bus or 15-min walk from JR Morioka Stn", "🟢 JR盛岡駅からバス5分（駅前店あり）", "Refill servers chant 'Hai janjan!' dropping bite-size soba bowls until you close the lid.", "「はい、じゃんじゃん！」の掛け声とともに楽しむ盛岡三大麺の名物。", "東家 盛岡"],
        ["Morioka Reimen (Cold Chewy Noodles)", "盛岡冷麺（牛骨クリアスープ＆コシ麺）", "Pyonpyonsha Morioka Ekimae", "ぴょんぴょん舎 盛岡駅前店", "https://www.pyonpyonsha.co.jp/", "★ 3.69", "easy", "🟢 2-min walk across from JR Morioka Station", "🟢 JR盛岡駅 東口より徒歩2分", "Elastic translucent noodles in savory beef broth garnished with watermelon or Asian pear.", "モチモチ透明麺と牛骨スープ、季節のフルーツが絶妙な盛岡冷麺の代表店。", "ぴょんぴょん舎 盛岡"],
        ["Morioka Jajamen & Chitan-tan Soup", "盛岡じゃじゃ麺＆〆のちーたんたん卵スープ", "Pairon Main Shop (Sakurayama)", "白龍（パイロン）本店（桜山神社前）", "https://www.iwatetabi.jp/", "★ 3.59", "easy", "🟢 12-min walk or bus to Sakurayama Shrine", "🟢 JR盛岡駅から循環バス「県庁・市役所前」", "Thick flat noodles tossed in savory meat miso, finished by cracking a raw egg for Chitan-tan.", "特製肉味噌を絡めて食べ、〆に卵スープを作る盛岡ソウルフード。", "白龍 パイロン 盛岡"]
      ],
      a: [
        ["Morioka Loop", "盛岡バス", "Dendenmushi Morioka City Loop Bus Map", "盛岡都心循環バス「でんでんむし」案内", "https://www.iwatekenkotsu.co.jp/", "Loops around JR Morioka Station, Morioka Castle Park, Sakurayama & Kon'yacho.", "盛岡駅から城跡公園・桜山・紺屋町を巡る都心循環バス案内。"],
        ["Iwate Transit", "岩手交通", "Iwate Prefecture Rail & Hiraizumi Transit Guide", "岩手県 公式アクセス案内（新幹線・在来線）", "https://visitiwate.com/", "Shinkansen links to Morioka, Kitakami & Ichinoseki (Hiraizumi gateway).", "東北新幹線・平泉・三陸鉄道へのアクセス情報。"]
      ],
      g: [
        ["Iwate Official", "岩手ガイド", "Visit Iwate Official Tourism Portal", "岩手の旅 公式観光サイト", "https://visitiwate.com/", "Covers Morioka Castle, Hiraizumi UNESCO Chuson-ji, Geibikei Gorge & Sanriku Coast.", "盛岡・平泉中尊寺・猊鼻渓・龍泉洞の公式ガイド。"]
      ]
    },
    miyagi: {
      regEn: "Miyagi", regJa: "宮城県",
      f: [
        ["Thick-Cut Charcoal Gyutan (Beef Tongue)", "仙台名物 厚切り炭火焼牛たん定食", "Aji Tasuke / Gyutan Rikyu / Kaku", "旨味太助／牛たん炭焼 利久／閣（仙台）", "https://www.rikyu-gyutan.co.jp/", "★ 3.74", "easy", "🟢 2–5 min walk inside/near JR Sendai Station", "🟢 JR仙台駅構内・東口・国分町徒歩圏内", "Juicy aged beef tongue charcoal-grilled with barley rice, pickles & oxtail soup.", "仙台発祥！極厚炭火焼き牛たん・麦飯・テールスープの王道定食。", "牛たん 閣 仙台"],
        ["Matsushima Bay Grilled & Raw Oysters", "松島湾 焼き牡蠣・生牡蠣＆カキフライ丼", "Matsushima Sakana Ichiba / Kakigoya", "松島さかな市場／松島かき小屋", "https://www.sakana-ichiba.co.jp/", "★ 3.55", "easy", "🟢 6–10 min walk from JR Matsushimakaigan Stn", "🟢 JR仙石線「松島海岸駅」より徒歩約8分", "Plump nutrient-rich oysters harvested right in Matsushima Bay (peak Oct–Mar).", "日本三景・松島湾育ちの濃厚ジューシーな焼き牡蠣・生牡蠣を満喫。", "松島さかな市場"],
        ["Zunda Mochi & Zunda Shake (Edamame Sweet)", "仙台名物 ずんだ餅・ずんだシェイク", "Zunda Saryo / Hikosaka (Sendai Station)", "ずんだ茶寮／村上屋餅店（仙台）", "https://zundasaryo.com/", "★ 3.63", "easy", "🟢 Inside JR Sendai Station 3F Zunda Komichi", "🟢 JR仙台駅3F「ずんだ小径」直結", "Vibrant crushed sweet green edamame paste pounded over silky mochi or blended into shakes.", "枝豆の香り豊かな伝統ずんだ餅と大人気のずんだシェイク。", "村上屋餅店 仙台"]
      ],
      a: [
        ["Sendai Metro", "仙台地下鉄", "Loople Sendai & Sendai Subway Route Map PDF", "るーぷる仙台＆仙台市地下鉄 路線図", "https://www.kotsu.city.sendai.jp/english/bus/loople.html", "Loops Zuihoden, Sendai Castle Ruins, Osaki Hachimangu & Jozenji-dori.", "瑞鳳殿・青葉城跡・定禅寺通を結ぶ観光シティループ「るーぷる仙台」＆地下鉄案内。"],
        ["JR Senseki Line", "JR仙石線", "Sendai ↔ Matsushima-Kaigan JR Senseki Line & Bay Cruise", "仙台 ↔ 松島海岸（JR仙石線・松島島巡り観光船）", "https://www.matsushima.or.jp/", "40-min direct JR train from Sendai to Matsushima-Kaigan right beside pier & Zuigan-ji.", "仙台駅からJR仙石線で約40分！松島海岸駅・観光船桟橋へ直結。"]
      ],
      g: [
        ["Sendai / Miyagi", "宮城ガイド", "Visit Miyagi Official Travel Guide", "宮城県観光連盟 Visit Miyagi", "https://visitmiyagi.com/", "Covers Sendai, Matsushima Bay, Akiu/Naruko Onsen, Fox Village & Zao Okama Crater.", "仙台・松島・秋保・鳴子峡・蔵王御釜の見どころガイド。"]
      ]
    },
    akita: {
      regEn: "Akita", regJa: "秋田県",
      f: [
        ["Kiritanpo Nabe (Hinai Jidori Hotpot)", "秋田名物 きりたんぽ鍋（比内地鶏出汁）", "Akita Kiritanpo-ya / Hinai-ya", "秋田きりたんぽ屋／本家あべや", "https://akita-kiritanpo.jp/", "★ 3.62", "easy", "🟢 3-min walk from JR Akita Station West Exit", "🟢 JR秋田駅 西口より徒歩3分", "Toasted rice skewers simmered with rich Hinai free-range chicken, maitake & burdock.", "比内地鶏の旨み溢れるスープで炊く、炙り米のきりたんぽ鍋。", "秋田きりたんぽ屋"],
        ["Inaniwa Udon (Silky Hand-Stretched Noodles)", "日本三大うどん 稲庭うどん（佐藤養助）", "Sato Yosuke Akita / Kakunodate", "佐藤養助 総本店・秋田店・角館店", "https://www.sato-yoske.co.jp/", "★ 3.70", "easy", "🟢 Seibu Akita Basement / Kakunodate Samurai St", "🟢 JR秋田駅隣接・角館武家屋敷通り", "Imperial-warrant thin flat udon with glass-like sheen and crisp springy chew.", "繊細な喉越しとコシを誇る、江戸時代からの伝統・稲庭手延べうどん。", "佐藤養助 秋田"],
        ["Oyakodon & Hinai Jidori Charcoal Grill", "究極の比内地鶏 親子丼（角館・秋田）", "Sakura-no-Sato (Kakunodate) / Honke Abeya", "桜の里（角館武家屋敷）／本家あべや", "https://www.stayakita.com/", "★ 3.65", "easy", "🟢 15-min walk from JR Kakunodate Station", "🟢 JR角館駅より武家屋敷通りへ徒歩約15分", "Charcoal-seared Hinai Jidori chicken folded into velvety golden egg over Akita Komachi rice.", "炭火で炙った歯応え抜群の比内地鶏と濃厚卵のとろとろ親子丼。", "桜の里 角館"]
      ],
      a: [
        ["Akita Rail & Bus", "秋田交通", "JR Akita Shinkansen & Tazawako/Nyuto Ugo Kotsu Bus", "秋田新幹線・田沢湖〜乳頭温泉郷 羽後交通バス案内", "https://ugokotsu.co.jp/", "Akita Shinkansen (Komachi) links Morioka/Tokyo to Kakunodate, Tazawako & Akita.", "新幹線こまち＆田沢湖駅〜乳頭温泉郷「羽後交通バス」公式時刻表。"]
      ],
      g: [
        ["Akita Official", "秋田ガイド", "Stay Akita Official Travel Portal", "秋田県公式観光サイト アキタファン", "https://akita-fun.jp/", "Nyuto Onsenkyo, Kakunodate Samurai Residences, Lake Tazawa & Oga Peninsula Namahage.", "乳頭温泉郷・角館武家屋敷・田沢湖・男鹿半島なまはげガイド。"]
      ]
    },
    yamagata: {
      regEn: "Yamagata", regJa: "山形県",
      f: [
        ["Yonezawa Wagyu Beef Sukiyaki & Steak", "日本三大和牛 米沢牛ステーキ＆すき焼き", "Tokiwa / Beko-ya (Yonezawa)", "米沢牛 登起波／べこや（米沢・山形）", "https://www.yonezawabeef.co.jp/", "★ 3.74", "easy", "🟢 3-min walk from JR Yonezawa Station", "🟢 JR米沢駅徒歩3分（山形駅周辺店あり）", "Fine snowy marbling cured in Yamagata mountain climate with sweet miso tare.", "上質な甘みある脂が口中でとろける、明治創業の名門・米沢牛。", "登起波 米沢"],
        ["Yamagata Hiyashi Ramen & Soba (Ita-soba)", "山形名物 冷やしラーメン＆板そば（大盛り手打ち）", "Sakae-ya Main Shop / Shojiya", "栄屋本店／蕎麦処 庄司屋（山形市）", "https://yamagatakanko.com/", "★ 3.64", "easy", "🟢 12–15 min walk from JR Yamagata Station", "🟢 JR山形駅から市内バス・徒歩圏内", "Yamagata invented iced shoyu beef-stock ramen—paired alongside rustic wooden-board Ita-soba.", "山形発祥の元祖冷やしラーメンと、香り強い太打ち板そばを堪能。", "栄屋本店 山形"],
        ["Dondon-yaki & Konnyaku Skewers (Tama-Konnyaku)", "山形ソウルグルメ どんどん焼き＆玉こんにゃく", "Omiya / Yamadera Chikara Konnyaku", "おやつ屋さん・山寺力こんにゃく", "https://www.yamaderakankou.com/", "★ 3.50", "easy", "🟢 Yamagata Station & Yamadera trailhead", "🟢 JR山形駅・山寺駅参道すぐ", "Soy-braised hot konjac balls (great pre-climb before Yamadera's 1,015 steps) & rolled festival pancakes.", "箸に巻いた名物どんどん焼きと、山寺参道で必食の醤油しみしみ玉こんにゃく。", "山寺 力こんにゃく"],
        ["Zao Jingisukan (Lamb Dome Grill)", "蔵王温泉名物 元祖蔵王ジンギスカン", "Jingisukan Lodge / Zao Onsen Grill", "ろばた・じんぎすかんロッジ（蔵王温泉）", "https://www.zao-spa.or.jp/", "★ 3.54", "bus", "🟡 Zao Onsen center (40-min bus from Yamagata Stn)", "🟡 JR山形駅から山交バス40分「蔵王温泉」", "Said to be one of Japan's Jingisukan birthplaces—juicy lamb legs with local highland miso tare.", "実はジンギスカン発祥地の一つ！蔵王温泉街で焼く柔らかラム肉と秘伝タレ。", "蔵王 ジンギスカン"]
      ],
      a: [
        ["Yamagata Bus/Rail", "山形交通", "Yamagata Kotsu Bus (Zao / Ginzan / Kaminoyama) & Shinkansen", "山交バス（蔵王・銀山温泉・鶴岡高速バス）公式サイト", "https://www.yamakobus.jp/", "Route timetables for Zao Onsen, Oishida→Ginzan Onsen & Yamagata–Tsuruoka expressway buses.", "蔵王温泉・大石田〜銀山温泉・山形〜鶴岡酒田高速バスの公式案内。"]
      ],
      g: [
        ["Yamagata Guide", "山形ガイド", "Visit Yamagata Official Tourism Guide", "やまがたへの旅 山形県公式観光サイト", "https://yamagatakanko.com/", "Ginzan Onsen gaslights, Yamadera cliff temple, Zao snow monsters & Dewa Sanzan.", "銀山温泉・山寺・蔵王樹氷・出羽三山・加茂水族館の完全案内。"]
      ]
    },
    fukushima: {
      regEn: "Fukushima", regJa: "福島県",
      f: [
        ["Kitakata Ramen (Thick Curly Hand-Massaged Noodles)", "日本三大ラーメン 喜多方ラーメン（朝ラー）", "Bannai Shokudo Main Shop (Kitakata)", "坂内食堂 本店（喜多方市）", "https://www.ramenkai.com/", "★ 3.74", "easy", "🟢 15-min walk from JR Kitakata Station", "🟢 JR磐越西線「喜多方駅」より徒歩15分", "Crystal-clear pork bone soy broth crowned with melt-in-mouth pork belly chashu—famous for breakfast from 07:00 AM.", "澄んだ豚骨醤油スープにとろけるバラ焼豚がぎっしり！喜多方「朝ラー」の総本山。", "坂内食堂 喜多方"],
        ["Aizu Sauce Katsudon & Negi-Soba (Leek Spoon Soba)", "会津ソースカツ丼＆大内宿 名物ネギそば", "Shokudo Naka-no-Ya / Misawaya (Ouchi-juku)", "むらい／三澤屋（大内宿ねぎそば）", "https://ouchi-juku.com/", "★ 3.63", "bus", "🟡 Aizuwakamatsu center or Aizu Railway to Yunokami-Onsen", "🟡 会津若松市内・湯野上温泉駅から猿游号バス", "Crispy pork cutlet soaked in sweet-savory Aizu sauce, or rustic soba eaten using a whole raw leek as chopsticks.", "会津名物の甘辛ソースカツ丼と、長ネギ1本で食べる大内宿の『高遠そば』。", "三澤屋 大内宿"],
        ["Fukushima Enban Gyoza (22-Piece Skillet Pan)", "福島名物 円盤餃子（パリパリ羽根付き一皿焼き）", "Gyoza Terui / Manpuku (Fukushima Stn)", "餃子 照井／満腹（JR福島駅東口）", "https://fukushima.travel/", "★ 3.64", "easy", "🟢 3-min walk from JR Fukushima Station East Exit", "🟢 JR福島駅 東口より徒歩約3分", "Crispy thin-skinned cabbage-and-pork dumplings arranged in a sizzling circular disc.", "フライパンいっぱいに丸く焼き上げた香ばしく軽い食感の福島ソウルフード。", "餃子 照井 福島"]
      ],
      a: [
        ["Aizu Loop Bus", "会津周遊バス", "Aizu Bus Haikara-san / Akabee Sightseeing Loop & Digital Map", "会津バス「ハイカラさん・あかべぇ」公式路線図", "https://www.aizubus.com/", "Connects JR Aizuwakamatsu Station, Tsuruga Castle, Nanukamachi & Higashiyama Onsen.", "JR会津若松駅から鶴ヶ城・七日町・飯盛山・東山温泉を巡る周遊バス公式案内。"]
      ],
      g: [
        ["Fukushima Official", "福島ガイド", "Fukushima Travel Official Guide", "福島県公式観光サイト Fukushima Travel", "https://fukushima.travel/", "Tsuruga Castle, Ouchi-juku thatched village, Kitakata storehouses & Lake Inawashiro.", "会津若松鶴ヶ城・大内宿・喜多方蔵の街・五色沼ガイド。"]
      ]
    },
    ibaraki: {
      regEn: "Ibaraki", regJa: "茨城県",
      f: [
        ["Anko-Nabe (Winter Monkfish Hotpot) & Oarai Seafood", "茨城冬の味覚 あんこう鍋＆大洗生しらす・海鮮丼", "Chubo Sansho / Kaisen-donya (Oarai Port)", "味処大森・魚市場かあちゃんの店（大洗港）", "https://www.oarai-info.jp/", "★ 3.59", "bus", "🟡 15 min walk/bus from Kashima Rinkai Oarai Stn", "🟢 鹿島臨海鉄道 大洗駅からバス・徒歩", "Ibaraki's signature winter delicacy simmered with creamy ankimo liver miso broth beside Oarai Wharf.", "濃厚あん肝が溶け出す茨城冬の王者「あんこう鍋」と大洗市場の新鮮海鮮。", "大洗 かあちゃんの店"],
        ["Hitachi Aki-Soba & Mito Natto Traditional Cuisine", "茨城・水戸 常陸秋そば＆水戸納豆老舗グルメ", "Soba Dokoro Mizuki / Funanatto", "手打ち常陸秋そば みづき／舟納豆・水戸駅", "https://mitokoumon.com/", "★ 3.55", "easy", "🟢 Near JR Mito Station & Kairakuen Garden", "🟢 JR水戸駅・偕楽園周辺徒歩・バス", "Fragrant stone-milled Hitachi Autumn buckwheat paired with small-bean straw-wrapped Mito natto.", "日本一の香りを誇るブランド蕎麦『常陸秋そば』と伝統の水戸納豆グルメ。", "水戸 常陸秋そば"],
        ["Hitachi Wagyu Beef Steak & Melon Soft Serve", "最高級・常陸牛ステーキ＆茨城ブランドメロンパフェ", "Iitoyo / Ibaraki Melon Cafe (Mito / Oarai)", "常陸牛 いい友／いばらき食彩館", "https://www.ibarakiguide.jp/", "★ 3.60", "easy", "🟢 JR Mito Station Excel & downtown", "🟢 JR水戸駅周辺・水戸市街", "Melt-in-your-mouth A5 Hitachi Wagyu raised in northern Ibaraki, plus Japan's #1 melon-producing sweets.", "極上A5常陸牛のステーキと、生産量日本一の茨城メロンを使ったスイーツ。", "常陸牛 いい友 水戸"]
      ],
      a: [
        ["Mito / Hitachi Transit", "茨城交通", "Hitachinaka Seaside Railway & Ibaraki Kotsu Bus Guide", "JR常磐線（ひたち・ときわ）＆ひたち海浜鉄道アクセス", "https://www.ibarakiguide.jp/access/", "JR Joban Ltd Express takes ~75 min Ueno→Mito; transfer to Ajigaura Line for Hitachi Seaside Park.", "上野・東京からJR特急ひたちで水戸約75分、勝田乗り換えでひたち海浜公園へ直通。"]
      ],
      g: [
        ["Ibaraki Guide", "茨城ガイド", "Visit Ibaraki Official Tourism Guide", "観光いばらき 茨城県公式観光ガイド", "https://english.ibarakiguide.jp/", "Hitachi Seaside Park (Nemophila / Kochia), Kairakuen Plum Garden & Oarai Isosaki Shrine torii.", "ひたち海浜公園（ネモフィラ・コキア）・偕楽園の梅・大洗磯前神社ガイド。"]
      ]
    },
    tochigi: {
      regEn: "Tochigi", regJa: "栃木県",
      f: [
        ["Utsunomiya Pan-Fried Gyoza (Crisp Vegetable-Rich)", "餃子の街・宇都宮のカリカリ焼餃子（みんみん・正嗣）", "Utsunomiya Minmin / Masashi (Utsunomiya)", "宇都宮みんみん／正嗣（宇都宮駅・東武駅）", "https://www.gyozakai.com/", "★ 3.68", "easy", "🟢 Inside/beside JR Utsunomiya Station", "🟢 JR宇都宮駅直結パセオ・徒歩圏", "Crispy cabbage-heavy pan-fried, boiled, and deep-fried dumplings that define Tochigi's capital.", "全国屈指の餃子聖地！キャベツの甘みが際立つ焼・水・揚の三拍子。", "宇都宮みんみん"],
        ["Nikko Nama-Yuba Kaiseki (Artisan Soy-Milk Skin)", "日光老舗 生ゆば懐石・湯波うどん", "Yudokoro Fukuya / Nikko Kanaya Dining", "日光ゆば懐石・ふだらく本舗／日光駅周辺", "https://www.visitnikko.jp/", "★ 3.62", "easy", "🟢 Walkable from Tobu-Nikko / JR Nikko Stn", "🟢 東武日光駅・JR日光駅から路線バス・徒歩", "Silky multi-layered mountain spring soy skin simmered in delicate dashi or filled with red bean yuba buns.", "日光の清流で作る濃厚「引き上げ湯波」の懐石と名物ゆばむすび・揚げゆばまんじゅう。", "日光 ゆば 湯波"],
        ["Sano Ramen & Tochiotome Strawberry Parfait", "佐野青竹手打ちラーメン＆とちおとめ苺スイーツ", "Sano Ramen Morita-ya / Nikko Strawberry", "佐野ラーメン 森田屋／とちぎ苺カフェ", "https://www.visit-tochigi.com/", "★ 3.66", "easy", "🟢 JR Sano Line & Tobu-Nikko / Kinugawa", "🟢 JR佐野・宇都宮・日光エリア", "Translucent bamboo-rolled wavy ramen noodles & sweet-tart fresh Tochigi Tochiotome strawberries.", "青竹打ちのちぢれ麺が透き通るスープに合う佐野ラーメン＆栃木産いちごパフェ。", "森田屋 佐野ラーメン"]
      ],
      a: [
        ["Tobu Nikko & Bus", "東武日光・バス", "Tobu Railway Nikko/Kinugawa Express & World Heritage Bus Map", "東武鉄道 特急スペーシア＆日光世界遺産めぐりバス路線図", "https://www.tobu.co.jp/en/sightseeing/nikko_kinugawa/", "Official Tobu Spacia X timetables plus Toshogu, Lake Chuzenji & Kinugawa bus passes.", "浅草・新宿発の東武特急と日光駅〜東照宮・中禅寺湖・鬼怒川バス路線案内。"]
      ],
      g: [
        ["Tochigi Official", "栃木ガイド", "Visit Tochigi Official Tourism Portal", "とちぎ旅ネット 栃木県公式観光サイト", "https://www.visit-tochigi.com/", "Nikko UNESCO shrines, Kegon Falls, Kinugawa Onsen gorge & Ashikaga Wisteria Park.", "日光東照宮・鬼怒川温泉・那須高原・あしかがフラワーパーク案内。"]
      ]
    },
    gunma: {
      regEn: "Gunma", regJa: "群馬県",
      f: [
        ["Mizusawa Udon (Japan's Top 3 Udon Noodles)", "日本三大うどん 水沢うどん（つるつるコシ麺＋舞茸天）", "Tamakiya / Osawaya (Ikaho Mizusawa)", "水澤うどん 田丸屋／大澤屋（伊香保）", "https://www.tamaruya.co.jp/", "★ 3.68", "bus", "🟡 Bus from JR Shibukawa or Takasaki to Mizusawa", "🟡 JR渋川駅・高崎方面から路線バス", "400-year-old chewy mountain-water udon dipped into savory sesame-walnut or soy broth with crispy maitake tempura.", "400年の歴史を誇る透明感ある水沢うどんと絶品・群馬産まいたけ天ぷら。", "大澤屋 水沢うどん"],
        ["Kusatsu Stone-Ground Soba & Hot Onsen Manju", "草津湯畑 名物そば「三国家」＆出来立て温泉饅頭", "Mikuniya / Matsumura Manju (Yubatake)", "石臼挽蕎麦 三国家／松むら饅頭（草津湯畑）", "https://www.kusatsu-onsen.ne.jp/guide/en/", "★ 3.58", "easy", "🟢 2-min walk along Yubatake boardwalk", "🟢 草津温泉 湯畑から徒歩2分", "In-house milled soba with steaming duck broth and warm brown-sugar buns beside Yubatake.", "石臼挽きの特製都汁そばと湯畑でほおばる出来立て温泉まんじゅう。", "三国家 草津"],
        ["Takasaki Torimeshi (Glazed Chicken) & Yakimanju", "群馬ソウルフード 登利平「鳥めし」＆焼きまんじゅう", "Torihei Takasaki Montres / Harada Grill", "登利平 高崎モントレー店／原嶋屋総本家", "https://www.torihei.co.jp/", "★ 3.55", "easy", "🟢 Directly inside JR Takasaki Station building", "🟢 JR高崎駅ビル直結・前橋周辺", "Tender sliced chicken glazed in Gunma's beloved sweet soy tare plus smoky miso-basted steamed buns.", "群馬県民熱愛の登利平『上州御用鳥めし』と甘辛い味噌ダレ香る焼きまんじゅう。", "登利平 高崎"]
      ],
      a: [
        ["Gunma Rail & Bus", "群馬鉄道・バス", "JR Agatsuma Line + JR Bus Kanto (Kusatsu) & Joshin Dentetsu", "JR吾妻線＋JRバス関東（草津）・上信電鉄公式案内", "https://www.visit-gunma.jp/en/access/", "Covers Hokuriku/Joetsu Shinkansen to Takasaki & rail/bus links up to Kusatsu & Ikaho.", "高崎駅から草津温泉・伊香保・富岡製糸場への鉄道・バス乗換ガイド。"]
      ],
      g: [
        ["Gunma Official", "群馬ガイド", "Visit Gunma Official Tourism Guide", "ググっとぐんま 群馬県公式観光案内", "https://www.visit-gunma.jp/en/", "Kusatsu Onsen Yubatake, Ikaho Stone Steps, Tomioka Silk Mill & Takasaki Daruma.", "草津温泉・伊香保温泉石段街・富岡製糸場・高崎だるまガイド。"]
      ]
    },
    saitama: {
      regEn: "Saitama", regJa: "埼玉県",
      f: [
        ["Koedo Kawagoe Unagi (Steamed Edo Eel)", "小江戸川越 伝統うなぎ蒲焼（小川菊）", "Ogakiku / Ichinoya (Kawagoe Kurazukuri)", "小川菊（おがきく）／いちのや（川越）", "https://www.koedo.or.jp/", "★ 3.72", "easy", "🟢 8-min walk from Hon-Kawagoe / Kawagoe Stn", "🟢 西武本川越駅・川越駅から蔵造り通り徒歩圏", "Fluffy steamed-then-charcoal-grilled Edo freshwater eel glazed in a 200-year secret tare.", "200年以上継ぎ足す秘伝タレで焼く小江戸川越の名門ふわふわ鰻重。", "小川菊 川越"],
        ["Kawagoe Sweet Potato Kaiseki & Waraji Katsudon", "川越サツマイモ尽くし＆秩父名物わらじカツ丼", "Kashiya Yokocho & Yasuda-ya (Chichibu)", "菓子屋横丁・小江戸おさつ庵／安田屋（秩父）", "https://www.chichibu-omotenashi.com/", "★ 3.55", "easy", "🟢 Kawagoe Kurazukuri St & Chichibu Stn", "🟢 川越蔵造り通り・秩父鉄道駅周辺", "Crispy sweet-potato chips in Penny Candy Alley and giant twin sauce-dipped pork cutlets in Chichibu.", "食べ歩きの定番サツマイモチップスと秩父の巨大2枚組わらじカツ丼。", "安田屋 秩父"],
        ["Musashino Udon (Hearty Pig-Mushroom Dip)", "埼玉名物 武蔵野肉汁うどん（太打ちゴワコシ麺）", "Fujiten / Sawamura Udon (Omiya/Kawagoe)", "藤店うどん／手打うどん 永井", "https://www.chocotabi-saitama.jp/", "★ 3.63", "easy", "🟢 Accessible from Omiya & Kawagoe stations", "🟢 大宮・川越エリアのバス・徒歩圏", "Chewy nutty wheat udon dipped in steaming rich pork-belly and negi scallion broth.", "豚バラと焼きネギの甘みが溶けた熱々つけ汁で味わう埼玉の伝統うどん。", "藤店うどん 大宮"]
      ],
      a: [
        ["Kawagoe / Seibu / Tobu", "川越・秩父交通", "Tobu Tojo / Seibu Red Arrow Express to Kawagoe & Chichibu Map", "東武東上線・西武特急ラビュー（川越・秩父）アクセス", "https://www.seiburailway.jp/railways/tourist/english/", "Only 30–45 min from Ikebukuro / Seibu-Shinjuku directly to Little Edo Kawagoe or Chichibu.", "池袋・新宿から30〜45分で小江戸川越や秩父神社へ直通！"]
      ],
      g: [
        ["Saitama Guide", "埼玉ガイド", "Chocotabi Saitama Official Travel Guide", "ちょこたび埼玉 埼玉県公式観光ガイド", "https://www.chocotabi-saitama.jp/en/", "Kawagoe Time Bell Tower & Candy Alley, Omiya Bonsai Village & Railway Museum, Chichibu.", "川越蔵造り・大宮鉄道博物館・大宮盆栽村・長瀞ライン下り案内。"]
      ]
    },
    chiba: {
      regEn: "Chiba", regJa: "千葉県",
      f: [
        ["Naritasan Omotesando Charcoal Unagi", "成田山表参道 名物うなぎ蒲焼（川豊本店）", "Kawatoyo Honten / Surugaya (Narita)", "川豊 本店／駿河屋（成田山表参道）", "https://www.unagi-kawatoyo.com/", "★ 3.74", "easy", "🟢 8-min walk from JR / Keisei Narita Station", "🟢 JR成田駅・京成成田駅から表参道徒歩8分", "Chefs butterfly live eels in view out front along Narita's temple lane before charcoal roasting.", "店頭で捌きたてを炭火で焼く！成田山新勝寺参道の絶品ふわふわ鰻重。", "川豊 本店 成田"],
        ["Boso Namerou (Miso-Ginger Minced Fish) & Choshi Seafood", "千葉房総 漁師めし「なめろう」＆銚子・勝浦新鮮海鮮", "Ise-ya / Hamakko (Choshi & Tateyama)", "浜っ子・一山いけす（銚子・房総エリア）", "https://www.visitchiba.jp/", "★ 3.58", "bus", "🟡 Coastal Choshi / Katsuura / Tateyama ports", "🟡 銚子・木更津・房総半島の駅周辺", "Freshly caught horse mackerel pounded with miso, ginger & shiso plus creamy Pacific oysters.", "房総の漁師が船上で生み出した味噌と薬味の「なめろう」と鮮魚定食。", "一山いけす 銚子"],
        ["Chiba Soy-Glazed Roasted Peanuts & Katsuura Tantanmen", "千葉特産 八街ピーナッツ菓子＆旨辛勝浦タンタンメン", "Egawa / Katsuura Tantanmen Kodama", "江ざわ（勝浦タンタンメン）／千葉落花生本舗", "https://www.visitchiba.jp/", "★ 3.61", "bus", "🟢 Narita / Katsuura / Chiba stations", "🟢 千葉駅・成田・勝浦エリア", "Japan's #1 Chiba roasted peanut sweets and fiery onion-chili oil coastal fishermen ramen.", "千葉県名産の香ばしい落花生スイーツと、ラー油香る熱々・勝浦タンタンメン。", "江ざわ 勝浦"]
      ],
      a: [
        ["Narita & Keisei", "成田・京成", "Keisei Skyliner / JR Narita Express (N'EX) Route Map", "京成スカイライナー・JR成田エクスプレス 千葉県鉄道案内", "https://www.keisei.co.jp/keisei/tetudou/skyliner/us/index.php", "41-min Skyliner to Ueno, direct N'EX to Tokyo/Shinjuku & JR Lines to Naritasan/Boso.", "成田空港〜上野41分のスカイライナーやN'EX、房総半島各線の案内。"]
      ],
      g: [
        ["Chiba Official", "千葉ガイド", "Visit Chiba Official Travel Guide", "まるごとe!ちば 千葉県公式観光サイト", "https://www.visitchiba.jp/", "Naritasan Shinshoji Temple, Tokyo Bay Aqua-Line, Sawara Edo Canal & Nokogiriyama.", "成田山新勝寺・佐原の水郷・鋸山地獄のぞき・房総花畑ガイド。"]
      ]
    },
    tokyo: {
      regEn: "Tokyo", regJa: "東京",
      f: [
        ["Edomae Toyosu Market Omakase Sushi", "江戸前寿司・豊洲市場おまかせ寿司", "Sushi Dai / Daiwa Sushi (Toyosu Market)", "寿司大・大和寿司（豊洲市場）", "https://www.toyosu-market.or.jp/en/", "★ 3.78", "easy", "🟢 2-min walk from Yurikamome Shijomae Stn", "🟢 ゆりかもめ「市場前駅」徒歩2分", "World-famous morning seasonal tuna, sea urchin & conger eel flight straight off the market.", "豊洲市場の新鮮な本マグロ・ウニ・穴子を味わう江戸前寿司の頂点。", "寿司大 豊洲"],
        ["Asakusa Charcoal Unagi", "浅草 老舗うなぎ蒲焼", "Unagi Irokawa / Hatsuogawa (Asakusa)", "うなぎ色川・初小川（浅草）", "https://www.gotokyo.org/en/spot/41/index.html", "★ 3.72", "easy", "🟢 4-min walk from Tokyo Metro Asakusa Stn", "🟢 東京メトロ「浅草駅」徒歩4分", "Traditional Edo eel steamed tender and lacquered in decades-old tare near Kaminarimon.", "浅草雷門近くで味わう秘伝ダレの炭火焼うなぎ老舗。", "色川 浅草"],
        ["Michelin-Featured Tokyo Craft Ramen", "東京ミシュラン系 特製トリュフ醤油・つけ麺", "Ginza Hachigou / Shinjuku Fuunji", "銀座 八五／新宿 風雲児", "https://www.gotokyo.org/en/story/guide/ramen-guide/index.html", "★ 3.86", "easy", "🟢 3-min walk from Higashi-Ginza / Shinjuku", "🟢 東銀座駅・新宿駅 徒歩3分", "Clarified duck-and-prosciutto golden ramen broth or rich chicken-seafood tsukemen.", "ミシュラン掲載の黄金コンソメ中華そばや新宿行列の濃厚魚介つけ麺。", "銀座 八五"],
        ["Aoyama Aged Pork Tonkatsu", "低温熟成 とんかつ（特上ヒレ・ロース）", "Tonkatsu Maisen Aoyama / Narikura", "とんかつ まい泉 青山本店／成蔵", "https://mai-sen.com/", "★ 3.68", "easy", "🟢 3-min walk from Omotesando Stn", "🟢 表参道駅 徒歩3分", "Fork-tender breadcrumb-fried Japanese pork cutlets in a historic converted bathhouse.", "お箸で切れるほど柔らかい伝統の熟成豚とんかつ。", "まい泉 青山本店"]
      ],
      a: [
        ["Tokyo Subway PDF", "東京地下鉄PDF", "Tokyo Metro & Toei Subway Official Route Map PDF", "東京メトロ・都営地下鉄 公式路線図PDF（全13路線）", "https://www.tokyometro.jp/station/pdf/202305/202305_number_en.pdf", "Essential station-numbered subway map for central Tokyo sightseeing.", "駅ナンバリング付きの全13路線公式地下鉄マップPDF。", true],
        ["JR East Tokyo PDF", "JR首都圏PDF", "JR East Railway & Airport Express Route Map PDF", "JR東日本 首都圏主要鉄道路線図PDF", "https://www.jreast.co.jp/en/multi/downloads/", "Covers Yamanote Loop, Chuo Line, Haneda Monorail, Narita Express & Shinkansen.", "山手線・中央線・成田エクスプレス・羽田アクセス網羅PDF。", true]
      ],
      g: [
        ["Go Tokyo", "東京公式", "Go Tokyo Official Tokyo Travel Guide", "東京公式観光サイト GO TOKYO", "https://www.gotokyo.org/en/", "Official guide covering Asakusa, Meiji Jingu, Shibuya Sky, Ginza, Toyosu & Ueno.", "浅草寺・明治神宮・渋谷スカイ・銀座・豊洲の東京公式ガイド。"]
      ]
    },
    kanagawa: {
      regEn: "Kanagawa", regJa: "神奈川県",
      f: [
        ["Yokohama Chinatown Dim Sum & Soup Dumplings", "横浜中華街 本格小籠包・肉まん（江戸清・鵬天閣）", "Edosei / Manchinro / Hotenkaku (Motomachi)", "江戸清／萬珍樓／鵬天閣（横浜中華街）", "https://www.chinatown.or.jp/", "★ 3.65", "easy", "🟢 3-min walk from Motomachi-Chukagai Stn", "🟢 みなとみらい線「元町・中華街駅」徒歩3分", "Crispy pan-fried soup dumplings and oversized steamed pork buns along colorful bazaar lanes.", "日本最大の横浜中華街で味わう肉汁焼き小籠包と極上中華コース。", "萬珍樓 横浜中華街"],
        ["Kamakura Shirasu-don (Enoshima Whitebait Bowl)", "鎌倉・江ノ島 名物生しらす丼＆釜揚げしらす", "Tobiccho / Akimoto (Enoshima & Kamakura)", "とびっちょ（江ノ島）／秋本（鎌倉小町通り）", "https://tobiccho.com/", "★ 3.58", "easy", "🟢 10-min walk from Enoden Katase-Enoshima / Kamakura Stn", "🟢 江ノ電「江ノ島駅」「鎌倉駅」徒歩圏", "Translucent fresh Sagami Bay whitebait over steamed rice with ginger & soy.", "湘南・相模湾で水揚げされた新鮮な生しらす＆ふわふわ釜揚げしらす丼。", "とびっちょ 江ノ島"],
        ["Hakone Yuba-don (Spring-Water Tofu Skin)", "箱根湯本 名物汲み上げ湯葉丼", "Yubadon Naokichi (Hakone-Yumoto)", "湯葉丼 直吉（箱根湯本）", "https://www.hakoneyumoto.com/", "★ 3.59", "easy", "🟢 3-min walk from Odakyu Hakone-Yumoto Stn", "🟢 小田急「箱根湯本駅」徒歩3分", "Simmered silky tofu skin folded in light dashi & egg beside the Hayakawa stream.", "早川の清流を眺めながら味わう、優しい出汁のふわとろ箱根湯葉丼。", "直吉 箱根湯本"]
      ],
      a: [
        ["Odakyu & Enoden", "小田急・江ノ電", "Odakyu Hakone / Enoshima-Kamakura Free Pass & Minatomirai Map", "小田急箱根フリーパス・江ノ電・みなとみらい線 観光交通案内", "https://www.odakyu.jp/english/passes/", "Covers Romancecar, Hakone Golden Course & Enoshima-Kamakura vintage tram.", "ロマンスカー・箱根ロープウェイ・江ノ電乗り放題パスの公式案内。"]
      ],
      g: [
        ["Yokohama & Kanagawa", "神奈川ガイド", "Visit Kanagawa Official Travel Guide", "観光かながわNOW 神奈川県公式ガイド", "https://www.kanagawa-kankou.or.jp/", "Yokohama Minato Mirai, Kamakura Great Buddha, Enoshima Island & Hakone hot springs.", "横浜みなとみらい・鎌倉大仏・江ノ島・箱根温泉の神奈川完全ガイド。"]
      ]
    },
    niigata: {
      regEn: "Niigata", regJa: "新潟県",
      f: [
        ["Niigata Tare Katsudon (Sweet-Soy Cutlet Bowl)", "新潟発祥 名物タレかつ丼（卵でとじない甘辛醤油）", "Tonkatsu Taro Main Shop (Furumachi)", "とんかつ太郎 本店（新潟市古町）", "https://www.tonkatsutaro.com/", "★ 3.68", "easy", "🟢 8-min bus from JR Niigata Station Bandai Exit", "🟢 JR新潟駅 万代口からバスで約8分", "Thin crispy pork cutlets dipped straight into decades-old sweet soy tare over Koshihikari rice.", "薄切りのサクサクとんかつを秘伝の甘辛醤油ダレにくぐらせた新潟元祖の味。", "とんかつ太郎 新潟"],
        ["Tokamachi Hegi-Soba (Seaweed-Bound Buckwheat)", "新潟名物 へぎそば（布海苔つなぎ・一口小分け盛り）", "Kojimaya Sohonten / Suzakaya", "小嶋屋総本店／須坂屋そば（新潟駅直結）", "https://www.kojimaya.co.jp/", "★ 3.60", "easy", "🟢 Branch inside JR Niigata Station CoCoLo", "🟢 JR新潟駅ビルCoCoLo内・十日町", "Silky emerald-tinted soba bound with funori seaweed served neatly coiled on wooden hegi trays.", "布海苔をつなぎに使った強いコシとツルツルの喉越しが魅力の伝統そば。", "須坂屋そば 新潟駅"],
        ["Ponshukan Sake Tasting & Snow-Aged Rice", "新潟駅「ぽんしゅ館」地酒利き酒＆爆弾おにぎり", "Ponshukan Niigata / Echigo-Yuzawa", "ぽんしゅ館 新潟驛店／越後湯沢驛店", "https://www.ponshukan.com/", "★ 3.55", "easy", "🟢 Directly inside JR Niigata & Echigo-Yuzawa Stn", "🟢 JR新潟駅・越後湯沢駅 改札すぐ直結", "Sample 100+ local Niigata sakes by token alongside giant Uonuma Koshihikari rice balls.", "県内全酒蔵の銘酒飲み比べと、魚沼産コシヒカリの絶品爆弾おにぎり。", "ぽんしゅ館 新潟"],
        ["Sado Island Sushi & Winter Snow Crab (Beni-Zuwai)", "佐渡島 天然ブリ・ノドグロ寿司＆新潟本ズワイガニ", "Benkei / Sado Seafood Stalls (Ryotsu & Pier)", "廻転寿司 弁慶（佐渡本店・ピア万代）／佐渡海鮮", "https://sado-benkei.com/", "★ 3.65", "bus", "🟡 Sado Ryotsu Port & Pia Bandai Fish Market", "🟡 ピア万代（新潟港近く）・佐渡島内", "Thick-cut Japan Sea yellowtail, blackthroat seaperch & sweet cold-water red snow crab.", "佐渡沖の寒ブリ・のどぐろを新潟産コシヒカリシャリで握る全国屈指の回転寿司。", "廻転寿司 弁慶"]
      ],
      a: [
        ["Sado Ferry & Transit", "佐渡汽船・新潟", "Sado Kisen Official Ferry/Jetfoil & Joetsu Shinkansen Access", "佐渡汽船公式時刻表（新潟港〜佐渡両津港 ジェットフォイル67分）", "https://www.sadokisen.co.jp/en/", "High-speed Jetfoil crosses Niigata↔Sado Ryotsu in 67 min; Joetsu Shinkansen from Tokyo in ~90 min.", "新潟駅から佐渡両津港へ67分のジェットフォイル＆カーフェリー公式予約案内。"]
      ],
      g: [
        ["Enjoy Niigata", "新潟ガイド", "Enjoy Niigata Official Tourism Guide", "にいがた観光ナビ 新潟県公式ガイド", "https://enjoyniigata.com/en/", "Sado Island Gold Mine, Kiyotsu Gorge tunnel reflections, Yahiko Shrine & Echigo-Yuzawa.", "佐渡金山・清津峡渓谷トンネル・弥彦山・越後湯沢スキー＆温泉ガイド。"]
      ]
    },
    toyama: {
      regEn: "Toyama", regJa: "富山県",
      f: [
        ["Toyama Bay White Shrimp & Firefly Squid Sushi", "富山湾「天然の生け簀」白えび天丼＆氷見寒ブリ寿司", "Shiroebi-tei / Toyama Sushi-jin", "白えび亭（JR富山駅）／廻る富山湾 すし玉", "https://www.shiroebiya.co.jp/", "★ 3.64", "easy", "🟢 Directly inside JR Toyama Station きときと市場", "🟢 JR富山駅「きときと市場とやマルシェ」直結", "Crispy sweet 'Jewels of Toyama Bay' glass shrimp tempura bowls & rich winter yellowtail.", "富山湾でしか獲れない透明な宝石『白えび』のサクサク天丼＆氷見寒ブリ。", "白えび亭 富山駅"],
        ["Original Toyama Black Ramen", "ご当地名物 富山ブラックラーメン", "Nishicho Taiki / Menya Iroha (Toyama)", "西町大喜／麺家いろは（富山市）", "https://www.ramen-iroha.com/", "★ 3.55", "easy", "🟢 3–8 min walk / tram from JR Toyama Stn", "🟢 JR富山駅前・路面電車「西町」徒歩すぐ", "Jet-black fermented soy broth packed with cracked black pepper—originally crafted to pair with white rice.", "真っ黒な濃厚醤油と粗挽き黒胡椒が癖になる富山発祥の元祖ブラックラーメン。", "西町大喜 富山"],
        ["Masu-zushi (Pressed Cherry Salmon Leaf Sushi)", "富山伝統 鱒の寿司（笹の葉押し寿司）", "Minamoto / Sekino-ya (Toyama)", "ますのすし本舗 源／関野屋", "https://www.masunosushi.co.jp/", "★ 3.56", "easy", "🟢 Sold inside JR Toyama Station concourse", "🟢 JR富山駅構内・市内本店", "Vibrant coral trout pressed tightly inside fragrant green bamboo leaves in cedar rounds.", "爽やかな笹の香りと上品な脂の乗った鱒を味わう伝統の押し寿司。", "ますのすし 源 富山"]
      ],
      a: [
        ["Toyama Tram & Alpine", "富山路面電車", "Toyama Chiho Tram Loop & Tateyama Kurobe Alpine Route Access", "富山地方鉄道 市内電車＆立山黒部アルペンルート公式案内", "https://www.alpen-route.com/en/", "Tram connects JR Toyama Station to Castle Park & Glass Art Museum; Dentetsu Toyama leads to Tateyama.", "富山駅直結の路面電車と、春の雪の大谷・黒部ダムへのアルペンルート時刻案内。"]
      ],
      g: [
        ["Visit Toyama", "富山ガイド", "Visit Toyama Official Travel Guide", "とやま観光ナビ 富山県公式サイト", "https://visit-toyama-japan.com/", "Tateyama Kurobe Snow Wall, Kurobe Gorge Railway, Ainokura Gokayama & Amaharashi Coast.", "立山黒部雪の大谷・黒部峡谷トロッコ・五箇山相倉・雨晴海岸ガイド。"]
      ]
    },
    ishikawa: {
      regEn: "Ishikawa", regJa: "石川県",
      f: [
        ["Omicho Market Kano Snow Crab & Nodoguro Bowl", "近江町市場 加能ガニ・のどぐろ海鮮丼", "Yamasho / Ikiiki-tei (Omicho Market)", "山さん寿司／いきいき亭（近江町市場）", "https://ohmicho-ichiba.com/", "★ 3.64", "easy", "🟢 12-min walk or 5-min bus from JR Kanazawa Stn", "🟢 JR金沢駅から徒歩12分または周遊バス5分", "Winter Kano snow crab, sweet amaebi shrimp & rich blackthroat seaperch over warm sushi rice.", "冬の加能ガニと脂の乗った「白身のトロ」のどぐろが踊る金沢台所の贅沢丼。", "いきいき亭 金沢"],
        ["Charcoal Nodoguro & Kanazawa Winter Oden", "のどぐろ塩焼き＆金沢おでん（カニ面・車麩）", "Itaru Honten / Kuroyuri (Kanazawa Station)", "いたる本店／黒百合（金沢駅あんと直結）", "https://visitkanazawa.jp/en/", "★ 3.71", "easy", "🟢 Inside JR Kanazawa Station Anto / Katamachi", "🟢 JR金沢駅百番街あんと直結・片町", "Delicate kombu dashi soaked into wheel-shaped gluten & seasonal female kobako crab shells.", "上品な出汁が染みた車麩やバイ貝、冬のカニ面を味わう金沢の夜定番。", "いたる本店 金沢"],
        ["Noto Bay Wagyu & Gold Leaf Higashi Chaya Sweets", "能登牛グリル＆ひがし茶屋街 金箔ソフト", "Terakoya / Hakuichi Higashi Chaya", "箔一 東山店／能登牛ステーキ専門店", "https://kanazawa.hakuichi.co.jp/", "★ 3.55", "bus", "🟡 10 min on Kanazawa Loop Bus to Hashibacho", "🟡 金沢周遊バス「橋場町」下車徒歩3分", "Pure artisan edible 24K gold-leaf soft-serve inside preserved Edo geisha lattice teahouses.", "伝統の金沢箔を丸ごと1枚まとった華やかな金箔ソフトクリーム＆加賀棒茶スイーツ。", "箔一 東山 金沢"]
      ],
      a: [
        ["Kanazawa Loop Bus PDF", "金沢周遊バスPDF", "Kanazawa Loop Bus Official 1-Day Pass Route Map PDF", "金沢周遊バス・ふらっとバス 公式1日券路線図PDF", "https://www.hokutetsu.co.jp/_wp/wp-content/uploads/2026/01/ONE-DAY-PASS-Kanazawa-Bus-Route-Map-February-2026.pdf", "Connects Kanazawa Stn, Omicho Market, Kenrokuen, 21st Century Museum & Higashi Chaya.", "主要観光地を網羅する北鉄金沢周遊バスの最新公式路線図PDF。", true]
      ],
      g: [
        ["Visit Kanazawa", "石川・金沢ガイド", "Visit Kanazawa & Ishikawa Official Portal", "ほっと石川旅ねっと・金沢旅物語 公式ガイド", "https://visitkanazawa.jp/en/", "Kenrokuen Yukitsuri winter snow ropes, Samurai Nagamachi, Kaga Onsen & Noto Peninsula.", "兼六園の雪吊り・長町武家屋敷・加賀温泉郷・能登半島の公式案内。"]
      ]
    },
    fukui: {
      regEn: "Fukui", regJa: "福井県",
      f: [
        ["Echizen Crab (Imperial Winter Snow Crab Kaiseki)", "冬の王者 越前がに（ブランドタグ付本ズワイガニ）", "Echizen Kani Museum / Yazaemon (Fukui)", "越前がに料理 やざえもん／道の駅越前", "https://www.fuku-e.com/", "★ 3.69", "easy", "🟢 JR Fukui Stn Curu-ru & coastal Mikuni", "🟢 JR福井駅周辺・三国港えちぜん鉄道", "Yellow-tagged male snow crabs renowned across Japan for sweet snow-white leg meat & rich kani-miso.", "黄色いタグが目印の最高級ブランド蟹・越前がに（刺身・焼き・蟹味噌）。", "越前がに 福井"],
        ["Echizen Oroshi Soba (Grated Radish Stone-Milled Soba)", "福井名物 越前おろしそば（辛味大根＆鰹節）", "Amida Soba Fukunoi / Mikuni Minato", "あみだそば 福の井（JR福井駅横）／けんぞう蕎麦", "https://www.fuku-e.com/", "★ 3.65", "easy", "🟢 2-min walk from JR Fukui Station West Exit", "🟢 JR福井駅 ハピリン1F徒歩すぐ", "Fragrant coarse-ground dark buckwheat doused in chilled dashi and zesty grated daikon radish.", "殻ごと挽いた香り高い田舎そばに辛味大根おろしをぶっかけていただく越前の定番。", "あみだそば 福井"],
        ["Europeken Source Katsudon (Thin Crispy Breaded Pork)", "福井発祥 ヨーロッパ軒の元祖ソースカツ丼", "Europeken Sohonten (Fukui City)", "ヨーロッパ軒 総本店（福井市片町）", "https://yo-roppaken.gourmet.coocan.jp/", "★ 3.62", "easy", "🟢 12-min walk or Fukui Railway tram from Fukui Stn", "🟢 JR福井駅から路面電車または徒歩12分", "Fine-crumb crisp pork cutlets bathed in aromatic Worcestershire-blend sauce atop hot rice since 1913.", "大正2年創業！きめ細かい薄衣のカツに秘伝ウスターソースが絡む福井市民の誇り。", "ヨーロッパ軒 福井"]
      ],
      a: [
        ["Fukui Hokuriku Rail", "福井交通・新幹線", "Hokuriku Shinkansen Fukui Extension & Echizen Railway Guide", "北陸新幹線（福井・敦賀）＆えちぜん鉄道・京福バス案内", "https://www.echizen-tetudo.co.jp/", "Direct Hokuriku Shinkansen from Tokyo to Fukui/Tsuruga; Echizen Railway connects Tojinbo & Eiheiji.", "北陸新幹線で福井・敦賀へ直通！えちぜん鉄道・東尋坊・永平寺バスの公式時刻表。"]
      ],
      g: [
        ["Enjoy Fukui", "福井ガイド", "Fukui Prefecture Official Travel Guide (Fuku-e)", "ふくいドットコム 福井県公式観光ガイド", "https://www.fuku-e.com/", "Fukui Dinosaur Museum, Tojinbo basalt cliffs, Eiheiji Zen Temple & Ichijodani ruins.", "恐竜博物館・東尋坊・大本山永平寺・丸岡城・一乗谷朝倉氏遺跡ガイド。"]
      ]
    },
    yamanashi: {
      regEn: "Yamanashi", regJa: "山梨県",
      f: [
        ["Kawaguchiko Pumpkin Hoto Iron-Pot Noodles", "山梨名物 かぼちゃ味噌ほうとう（ほうとう不動・小作）", "Hoto Fudo / Kosaku (Kawaguchiko & Kofu)", "ほうとう不動／甲州ほうとう小作（河口湖・甲府）", "https://www.houtou-fudou.jp/english.html", "★ 3.57", "easy", "🟢 1–5 min walk from Kawaguchiko / JR Kofu Stn", "🟢 富士急河口湖駅目の前・JR甲府駅徒歩圏", "Chewy flat hand-cut wheat ribbons simmered with sweet kabocha squash in an iron cauldron.", "モチモチ太麺とかぼちゃの甘みが溶けた熱々味噌仕立ての郷土鍋。", "ほうとう不動 河口湖"],
        ["Yoshida Udon (World's Chewiest Buckwheat-Style Udon)", "富士吉田名物 吉田のうどん（驚異のコシ＆すりだね辛味）", "Miyuki Udon / Miura Udon (Fujiyoshida)", "みうらうどん／美也樹（富士吉田市）", "https://fujiyoshida.net/en", "★ 3.66", "bus", "🟡 Fujikyuko Line to Shimoyoshida / Gekkoji", "🟡 富士急行線 下吉田駅・月江寺駅", "Thick, firm hand-kneaded noodles in miso-soy broth crowned with cabbage, horsemeat & spicy suridane.", "一度食べたら忘れられない超強力コシ麺にキャベツと甘辛馬肉・すりだねを添えて。", "みうらうどん 富士吉田"],
        ["Kofu Chicken Offal Stew (Tori Motsuni) & Shine Muscat", "甲府 B-1グランプリ王者「甲府鳥もつ煮」＆勝沼ぶどうスイーツ", "Okufuji Honten (Kofu) / Katsunuma Budoka-no-oka", "奥藤本店（甲府駅前）／勝沼ぶどうの丘", "https://www.yamanashi-kankou.jp/", "★ 3.58", "easy", "🟢 2-min walk from JR Kofu Station", "🟢 JR甲府駅南口すぐ・勝沼ぶどう郷駅", "Rich caramelized sweet-soy chicken giblets born in Kofu, paired with crisp local peaches & Kyoho grapes.", "B-1グランプリ優勝の照り艶・甲府鳥もつ煮とフルーツ王国山梨のぶどう＆ワイン。", "奥藤本店 甲府"]
      ],
      a: [
        ["Fujikyu Rail & Bus", "富士急行・周遊バス", "JR Fuji Excursion & Kawaguchiko Sightseeing Bus Network", "JR特急富士回遊＆河口湖・富士山五湖周遊バスガイド", "https://bus.fujikyu.co.jp/rosen/fujigoko", "Direct JR/Fujikyuko limited express from Shinjuku to Kawaguchiko plus Red/Green Line lake buses.", "新宿〜河口湖直通「富士回遊」＆河口湖周遊バス（大石公園・忠霊塔・忍野八海）。"]
      ],
      g: [
        ["Visit Yamanashi", "山梨ガイド", "Yamanashi Official Travel & Mt. Fuji Portal", "富士の国やまなし 山梨県公式観光サイト", "https://www.yamanashi-kankou.jp/english/", "Chureito Pagoda, Oishi Park, Oshino Hakkai springs, Shosenkyo Gorge & Kofu Takeda Shrine.", "新倉山浅間公園（忠霊塔）・大石公園・忍野八海・昇仙峡の公式観光案内。"]
      ]
    },
    nagano: {
      regEn: "Nagano", regJa: "長野県",
      f: [
        ["Shinshu Nagano Stone-Milled Soba", "信州長野 戸隠・松本 石臼挽手打ちそば", "Uzuraya (Togakushi) / Nomugi (Matsumoto)", "うずら家（戸隠）／野麦（松本）", "https://www.go-nagano.net/", "★ 3.74", "easy", "🟢 Matsumoto Castle & Togakushi Middle Shrine", "🟢 松本駅・長野駅（戸隠中社バス直通）", "Pure high-altitude buckwheat milled fresh every morning in crisp Northern Alps mountain water.", "北アルプスの清流と冷涼な気候が育んだ香り高い本場・信州手打ち蕎麦。", "うずら家 戸隠"],
        ["Shinshu Oyaki (Fire-Roasted Savory Buckwheat Dumplings)", "信州郷土料理 おやき（野沢菜・切干大根・かぼちゃ）", "Iroha-do / Ogawa-no-sho (Nagano Stn)", "いろは堂（長野駅MIDORI）／小川の庄（おやき村）", "https://www.irohado.com/", "★ 3.60", "easy", "🟢 Inside JR Nagano Station MIDORI & Zenko-ji", "🟢 JR長野駅直結MIDORI・善光寺門前", "Crisp hearth-baked stuffed dumplings packed with tangy Nozawana greens, sweet miso eggplant or kabocha.", "囲炉裏で焼いた香ばしい生地に野沢菜やなす味噌を包んだ長野定番グルメ。", "いろは堂 長野駅"],
        ["Matsumoto Sanzoku-yaki (Crispy Garlic-Ginger Chicken)", "松本名物 山賊焼き（ニンニク醤油の豪快一枚揚げ）", "Sanzoku / Matsumoto Karaage Center", "山賊／松本からあげセンター（JR松本駅ビル）", "https://matsumoto-experience.com/", "★ 3.56", "easy", "🟢 Inside JR Matsumoto Station 4F & downtown", "🟢 JR松本駅ビルMIDORI 4F・駅徒歩すぐ", "Giant crispy butterflied chicken thigh marinated in grated garlic, ginger & soy before frying.", "大迫力の大きさ！ニンニク生姜醤油が香ばしい松本・塩尻地域のソウルフード。", "松本からあげセンター"]
      ],
      a: [
        ["Alpico Alpine & Rail", "アルピコ交通・JR", "JR Shinano/Hokuriku Shinkansen & Alpico Bus (Kamikochi / Hakuba / Takayama)", "JR東日本/東海＆アルピコ交通（上高地・白馬・高山・戸隠）案内", "https://www.alpico.co.jp/en/timetable/", "Direct express buses linking Matsumoto/Nagano to Kamikochi, Hakuba Valley & Takayama.", "松本・長野から上高地・白馬・戸隠・高山（安房トンネル直通）への高速路線バス時刻表。"]
      ],
      g: [
        ["Go Nagano", "長野ガイド", "Go Nagano Official Prefecture Travel Portal", "Go NAGANO 長野県公式観光サイト", "https://www.go-nagano.net/en/", "Matsumoto Castle, Jigokudani Snow Monkeys, Kamikochi, Hakuba, Azumino, Zenko-ji & Narai-juku.", "松本城・地獄谷野猿公苑・上高地・白馬・安曇野・善光寺・妻籠宿ガイド。"]
      ]
    },
    gifu: {
      regEn: "Gifu", regJa: "岐阜県",
      f: [
        ["A5 Hida Wagyu Hoba Miso & Seared Sushi", "飛騨高山 A5飛騨牛 朴葉味噌＆炙りにぎり", "Hidagyu Maruaki / Kotteushi (Sanmachi Suji)", "飛騨牛 丸明 飛騨高山店／こって牛", "https://www.hidagyu-maruaki.co.jp/", "★ 3.69", "easy", "🟢 5–10 min walk from JR Takayama Station", "🟢 JR高山駅より徒歩5〜10分", "Rich marbled Hida wagyu grilled over aromatic dried magnolia leaves with mountain miso.", "全国和牛王座級・A5飛騨牛の朴葉味噌ステーキとさんまち通りの炙り寿司。", "丸明 高山"],
        ["Takayama Shoyu-Bonito Chuka Soba", "高山ラーメン（細ちぢれ麺×魚介醤油）", "Menya Shirakawa / Masago Soba", "麺屋しらかわ／まさごそば（高山）", "https://www.hida.jp/english/", "★ 3.74", "easy", "🟢 8-min walk from JR Takayama Station", "🟢 JR高山駅より徒歩8分", "Silky simmered soy-and-bonito broth topped with tender chashu and curly thin noodles.", "鶏ガラと鰹出汁を煮詰めたコク深い醤油スープの高山ラーメン名店。", "麺屋しらかわ 高山"],
        ["Gifu / Nakatsugawa Chestnut Kinton & Ayu Sweetfish", "美濃・中津川 栗きんとん（すや・川上屋）＆長良川天然鮎", "Suya / Kawakamiya (Nakatsugawa & Gifu)", "すや／川上屋（中津川・岐阜）", "https://www.kankou-gifu.jp/", "★ 3.66", "easy", "🟢 Near JR Nakatsugawa & Magome-juku Trail", "🟢 JR中津川駅・馬籠宿・長良川周辺", "Silky pure steamed Gifu mountain chestnuts pressed into cloth-shaped confections every autumn/winter.", "栗そのものの甘みを凝縮した中津川発祥・伝統の和菓子と清流の鮎料理。", "すや 中津川"]
      ],
      a: [
        ["Nohi Bus Alpine", "濃飛バス", "Nohi Highway Bus (Shirakawa-go, Shinhotaka, Kanazawa, Matsumoto)", "濃飛バス 公式サイト（白川郷・新穂高・金沢・松本直通）", "https://www.nouhibus.co.jp/english/", "Frequent highway buses linking Takayama to Shirakawa-go (50 min), Shinhotaka & Matsumoto.", "高山を拠点に世界遺産白川郷・新穂高ロープウェイ・松本を結ぶ濃飛バス予約案内。"]
      ],
      g: [
        ["Visit Gifu", "岐阜ガイド", "Visit Gifu Official Prefecture Tourism Guide", "ぎふの旅ガイド 岐阜県公式観光サイト", "https://visitgifu.com/", "Shirakawa-go, Hida Takayama Old Town, Shinhotaka Ropeway, Gero Onsen, Magome & Gujo Hachiman.", "白川郷・飛騨高山・新穂高ロープウェイ・下呂温泉・馬籠宿・郡上八幡ガイド。"]
      ]
    },
    shizuoka: {
      regEn: "Shizuoka", regJa: "静岡県",
      f: [
        ["Atami Sagami Bay Seafood & Izu Kinmedai", "熱海・伊豆 豪快海鮮丼＆金目鯛煮付け", "Atami Ginza Osakana Shokudo / Tokuzo", "熱海銀座おさかな食堂／徳造丸", "https://www.osakana-atami.com/", "★ 3.55", "easy", "🟢 Walkable/bus from JR Atami / Shimoda / Ito", "🟢 JR熱海駅・伊豆急下田駅からアクセス", "Suruga Bay shirasu, sakura shrimp & sweet soy-simmered golden-eye snapper from Izu waters.", "相模湾・駿河湾の地魚海鮮丼と伊豆名物のとろける金目鯛姿煮。", "熱海銀座おさかな食堂"],
        ["Shizuoka Dark-Broth Oden Alley (Kuro-Hanpen)", "静岡夜名物 青葉おでん街（真っ黒牛すじ出汁・黒はんぺん）", "Aoba Oden Alley / Miho-ya (Shizuoka City)", "青葉横丁・青葉おでん街「三保屋」ほか", "https://www.visit-shizuoka.com/en/", "★ 3.56", "easy", "🟢 10-min walk from JR Shizuoka Station North", "🟢 JR静岡駅 北口より徒歩10分", "Skewers stewed in dark beef-tendon soy broth topped with savory dashi powder & green nori.", "濃い真っ黒スープの黒はんぺん・牛すじに削り粉と青のりをかけて味わう昭和横丁。", "静岡 青葉おでん街"],
        ["Starbucks EXPASA Fujikawa Mt. Fuji View Terrace", "スタバ EXPASA富士川（雪化粧の富士山絶景テラス）", "Starbucks EXPASA Fujikawa / Rakuza", "スターバックス EXPASA富士川（富士川楽座）", "https://www.fujikawarakuza.co.jp/", "★ 3.40", "bus", "🟡 Train to JR Fujikawa + 5-min taxi or bus", "🟡 JR富士川駅西口→富士川楽座バス/タクシー", "Crystal-clear morning 07:00–09:00 AM panorama of snow-capped Mt. Fuji rising directly over the Fuji River.", "冬の早朝に富士川と富士山を一望できる大人気の富士山絶景テラスカフェ。", "スターバックス EXPASA富士川"],
        ["Hamamatsu Grilled Unagi & Circular Bean-Sprout Gyoza", "浜松名物 炭火うなぎ＆円盤浜松餃子", "Atsumi / Mutsugiku (Hamamatsu Station)", "うなぎ料理 あつみ／むつぎく（浜松駅近く）", "https://www.hamamatsu-daisuki.net/", "★ 3.70", "easy", "🟢 3–7 min walk from JR Hamamatsu Station", "🟢 JR浜松駅より徒歩3〜7分", "Lake Hamana eel seared aromatic alongside crispy circular gyoza rings topped with fresh bean sprouts.", "浜名湖産うなぎ名店＆もやし添えが定番の円形キャベツたっぷり浜松餃子。", "むつぎく 浜松"]
      ],
      a: [
        ["Izukyu & Tokaido", "伊豆急・JR東海", "JR Tokaido / Fujikawa Access & Izukyu Line Official Timetable", "JR東海・伊豆急行線・富士川楽座 公共交通ガイド", "https://www.fujikawarakuza.co.jp/access/", "Covers Shinkansen/JR Tokaido stops (Atami, Shizuoka, Fujikawa, Hamamatsu) + Izukyu Line to Kawazu.", "東海道新幹線・在来線（熱海・富士川・静岡・浜松）＆伊豆急河津アクセス。"]
      ],
      g: [
        ["Explore Shizuoka", "静岡ガイド", "Explore Shizuoka Official Prefecture Travel Guide", "ハローナビしずおか 静岡県公式観光案内", "https://exploreshizuoka.jp/", "Mt. Fuji views from Fujikawa & Miho-no-Matsubara, Atami Plum Garden, Kawazu Sakura & Izu coast.", "富士川・三保松原・熱海梅園・河津桜・修善寺・浜名湖の静岡ガイド。"]
      ]
    },
    aichi: {
      regEn: "Aichi", regJa: "愛知県",
      f: [
        ["Nagoya Hitsumabushi (4-Way Charcoal Unagi Bowl)", "名古屋名物 ひつまぶし（炭火パリッと四度楽しむ鰻丼）", "Atsuta Horaiken / Maruya Honten (Nagoya Stn)", "あつた蓬莱軒／まるや本店 名駅店", "https://www.houraiken.com/", "★ 3.78", "easy", "🟢 Inside Meitetsu/JR Nagoya Station or Atsuta", "🟢 JR名古屋駅直結・地下鉄伝馬町徒歩圏", "Crisp Kansai-style butterflied eel eaten plain, with condiments, and finished as fragrant dashi chazuke.", "最初はそのまま、薬味と、最後はお茶漬けで味わう名古屋飯の王様『ひつまぶし』。", "あつた蓬莱軒 神宮店"],
        ["Yabaton Misokatsu (Hatcho Red Miso Pork Cutlet)", "名古屋めし 矢場とんのみそかつ（濃厚八丁味噌）", "Yabaton Yabacho Main Shop / Nagoya Stn", "みそかつ 矢場とん 本店・名古屋駅店", "https://www.yabaton.com/", "★ 3.59", "easy", "🟢 Inside JR Nagoya Station Esca or Yabacho", "🟢 JR名古屋駅エスカ・地下鉄矢場町徒歩すぐ", "Savory slow-brewed red Hatcho miso sauce poured table-side over golden fried pork loin.", "伝統の八丁味噌を使ったコク深くもあっさりした秘伝ダレをかける名古屋名物。", "矢場とん 矢場町"],
        ["Sekai-no-Yamachan & Furaibo Pepper Chicken Wings", "名古屋 手羽先唐揚げ（胡椒ピリ辛＆甘辛醤油）", "Furaibo / Sekai-no-Yamachan (Sakae & Meieki)", "風来坊／世界の山ちゃん（名駅・栄）", "https://www.yamachan.co.jp/", "★ 3.52", "easy", "🟢 Steps from JR Nagoya & Sakae Subway", "🟢 JR名古屋駅・栄駅周辺に複数店舗", "Addictive twice-fried crispy chicken wings dusted in secret spice & sesame.", "秘伝タレとピリッと効いた胡椒がビールに最高の名物手羽先唐揚げ。", "風来坊 名古屋"],
        ["Nagoya Mornings (Ogura Toast) & Miso Nikomi Udon", "小倉トースト喫茶モーニング＆山本屋本店 味噌煮込みうどん", "Komeda / Cafe Konparu & Yamamotoya Honten", "コンパル（大須・名駅）／山本屋本店", "https://yamamotoyahonten.co.jp/", "★ 3.63", "easy", "🟢 Nagoya Station Underground & Osu", "🟢 名古屋駅地下街・大須観音すぐ", "Al-dente thick udon simmered in clay-pot red miso broth, plus Nagoya's iconic red-bean butter toast morning.", "芯を残した硬め麺の味噌煮込みうどんと、エビフライサンド＆小倉トースト。", "山本屋本店 名古屋"]
      ],
      a: [
        ["Nagoya Subway & Linimo", "名古屋市営地下鉄", "Nagoya City Subway, Meitetsu Airport & Linimo (Ghibli Park) Map", "名古屋市営地下鉄＆名鉄・リニモ（ジブリパーク）路線図", "https://www.kotsu.city.nagoya.jp/en/pc/", "Covers Higashiyama/Meijo Subway lines, Chubu Centrair µSKY & Linimo to Ghibli Park.", "名古屋駅・栄・熱田神宮・セントレア・ジブリパークを結ぶ公式鉄道ガイド。"]
      ],
      g: [
        ["Aichi Now", "愛知ガイド", "Aichi Now Official Prefecture Tourism Guide", "Aichi Now 愛知県公式観光ガイド", "https://www.aichi-now.jp/en/", "Nagoya Castle, Atsuta Shrine, Ghibli Park, Inuyama Castle & Tokoname pottery walk.", "名古屋城・熱田神宮・ジブリパーク・国宝犬山城・常滑やきもの散歩道案内。"]
      ]
    },
    mie: {
      regEn: "Mie", regJa: "三重県",
      f: [
        ["Matsusaka Wagyu Sukiyaki (Queen of Japanese Beef)", "日本三大和牛 松阪牛（芸術的霜降りのすき焼き・網焼）", "Wadakin / Gyugin Main Shop (Matsusaka)", "和田金／牛銀 本店（松阪市・伊勢エリア）", "https://e-wadakin.co.jp/", "★ 3.84", "easy", "🟢 8-min walk from JR / Kintetsu Matsusaka Stn", "🟢 JR・近鉄「松阪駅」より徒歩8〜10分", "Fed sake lees and massaged in Mie—delicately sweet fat melts at body temperature in iron skillets.", "とろける食感と極上の香り！明治創業の老舗『和田金』で味わう本場・松阪牛。", "和田金 松阪"],
        ["Ise Udon & Akafuku Mochi (Ise Jingu Okage-yokocho)", "伊勢名物 伊勢うどん（ふわふわ太麺）＆赤福本店", "Fuku-suke & Akafuku Honten (Okage-yokocho)", "ふくすけ（伊勢うどん）／赤福 本店（おかげ横丁）", "https://www.akafuku.co.jp/", "★ 3.70", "bus", "🟡 Bus from Kintetsu Isuzugawa / Iseshi Stn", "🟡 近鉄五十鈴川駅・伊勢市駅から三重交通バス", "Pillow-soft thick noodles bathed in aromatic bonito-tamari sauce beside 300-year-old Akafuku mochi.", "伊勢神宮お参り後に味わう真っ黒ダレの極太伊勢うどんと五十鈴川沿いの赤福餅。", "赤福 本店 伊勢"],
        ["Ise Spiny Lobster (Ise-Ebi) & Tekone-Zushi", "伊勢志摩 伊勢海老＆漁師めし「てこね寿司」", "Sushi Kyu / Toba Sea-Woman Hut", "すし久（おはらい町）／鳥羽海女小屋", "https://www.iseshima-kanko.jp/", "★ 3.60", "bus", "🟡 Oharaimachi & Kintetsu Toba Station", "🟡 伊勢おかげ横丁・近鉄鳥羽駅", "Vinegar rice layered with soy-marinated bonito slices alongside sweet grilled Shima lobster.", "漬け鰹を酢飯に混ぜた名物「てこね寿司」とプリプリの伊勢海老料理。", "すし久 伊勢"]
      ],
      a: [
        ["Kintetsu & Sanco Bus", "近鉄・三重交通バス", "Kintetsu Limited Express (Nagoya/Osaka/Kyoto ↔ Ise-Shima) & CAN Bus", "近鉄特急（伊勢志摩ライナー・しまかぜ）＆三重交通参宮バス", "https://www.kintetsu.co.jp/foreign/english/", "Direct Kintetsu express trains from Kyoto/Osaka/Nagoya to Iseshi, Ujiyamada & Toba.", "京都・大阪・名古屋から伊勢神宮・鳥羽・賢島へ直結の近鉄＆三重交通バス案内。"]
      ],
      g: [
        ["Tourism Mie", "三重ガイド", "Kanko Mie Official Prefecture Travel Guide", "観光三重 三重県公式観光サイト", "https://www.kankomie.or.jp/en/", "Ise Grand Shrine (Jingu), Okage-yokocho, Toba Pearl Island, Kumano Kodo & Iga Ninja Museum.", "伊勢神宮・おかげ横丁・鳥羽水族館・夫婦岩・熊野古道伊勢路・伊賀忍者ガイド。"]
      ]
    },
    shiga: {
      regEn: "Shiga", regJa: "滋賀県",
      f: [
        ["Omi Wagyu Beef (400-Year Heritage Steak & Sukiyaki)", "日本最古のブランド牛 近江牛（毛利志満・千成亭）", "Morishima / Sennari-tei Kyara (Hikone & Omihachiman)", "近江牛 毛利志満／千成亭 伽羅（彦根・近江八幡）", "https://www.oumi-usi.co.jp/", "★ 3.69", "easy", "🟢 Walkable from Hikone Castle / Omihachiman Stn", "🟢 JR彦根駅・近江八幡駅からアクセス", "Japan's oldest recognized wagyu brand raised beside mineral-rich Lake Biwa since Edo times.", "400年の歴史を誇る三大和牛「近江牛」の極上すき焼き・ステーキ・炙り寿司。", "千成亭 伽羅 彦根"],
        ["Nagahama Yaki-Saba Somen & Club Harie Baumkuchen", "滋賀名物 焼鯖そうめん（翼果楼）＆ラ コリーナ近江八幡", "Yokaro (Nagahama) & La Collina Omihachiman", "翼果楼（長浜）／ラ コリーナ近江八幡", "https://taneya.jp/la_collina/", "★ 3.64", "easy", "🟢 5-min walk JR Nagahama Stn / bus from Omihachiman", "🟢 JR長浜駅徒歩5分・近江八幡駅からバス10分", "Sweet-braised mackerel boiled into tender wheat somen noodles plus warm freshly baked Baumkuchen in a grass-roofed pavilion.", "長浜黒壁スクエアの絶品『焼鯖そうめん』と草屋根が美しいラ コリーナの焼きたてバームクーヘン。", "ラ コリーナ近江八幡"],
        ["Omi Champon (Clear Bonito-Kelp Veggie Noodle Soup)", "彦根名物 近江ちゃんぽん（黄金和風出汁＆たっぷり野菜）", "Chanpon-tei Sohonten (Hikone Ekimae)", "ちゃんぽん亭 総本家 彦根駅前本店", "https://chanpontei.com/", "★ 3.53", "easy", "🟢 2-min walk from JR Hikone Station West Exit", "🟢 JR彦根駅 西口より徒歩2分", "Unlike pork-bone Nagasaki champon, Shiga uses sweet clear bonito-kelp broth with heaps of crisp local vegetables.", "秘伝の京風黄金和風だしに国産野菜をたっぷり煮込んだ彦根のソウルフード。", "ちゃんぽん亭 彦根"]
      ],
      a: [
        ["JR Biwako & Boats", "JR琵琶湖線・観光船", "JR Biwako Line (20–45 min from Kyoto) & Lake Biwa Cruises", "JR琵琶湖線・湖西線＆びわ湖汽船（京都から20〜45分）", "https://www.biwakokisen.co.jp/en/", "Rapid JR trains reach Otsu in 10 min, Omihachiman in 33 min, Hikone in 48 min from Kyoto Station.", "JR京都駅から大津10分・近江八幡33分・彦根48分！琵琶湖観光のアクセス案内。"]
      ],
      g: [
        ["Biwako Visitors", "滋賀ガイド", "Biwako Visitors Bureau Official Shiga Guide", "びわこビジターズビューロー 滋賀県公式ガイド", "https://en.biwako-visitors.jp/", "Hikone Original Castle, Shirahige Floating Torii, Enryaku-ji Mt. Hiei, Omihachiman & La Collina.", "国宝彦根城・白鬚神社湖中大鳥居・比叡山延暦寺・近江八幡水郷ガイド。"]
      ]
    },
    kyoto: {
      regEn: "Kyoto", regJa: "京都府",
      f: [
        ["Arashiyama Bamboo-Basket Yudofu Kaiseki", "嵐山・南禅寺 伝統湯豆腐会席", "Yudofu Sagano / Nanzenji Junsei", "湯豆腐 嵯峨野（嵐山）／南禅寺 順正", "https://www.tofu-junsei.co.jp/", "★ 3.68", "easy", "🟢 6-min walk from Randen Arashiyama / Keage Stn", "🟢 嵐電嵐山駅・地下鉄蹴上駅徒歩6分", "Silken Kyoto spring-water tofu simmered gently in kelp broth overlooking Edo stroll gardens.", "名水で仕込んだなめらかな京豆腐を美しい庭園を眺めながら味わう伝統の味。", "南禅寺 順正"],
        ["Nishiki Obanzai & Uji Matcha Parfait", "京のおばんざい＆中村藤吉本店 宇治抹茶パフェ", "Nishiki Market & Nakamura Tokichi Kyoto Stn", "錦市場＆中村藤吉本店（JR京都駅伊勢丹3F）", "https://tokichi.jp/", "★ 3.75", "easy", "🟢 Inside JR Kyoto Station / near Shijo Stn", "🟢 JR京都駅直結（中村藤吉）・四条駅徒歩3分", "Sample Kyoto pickled vegetables & yuba in 400-year-old Nishiki Market followed by Uji stone-milled matcha jelly.", "400年続く錦市場の食べ歩きと、竹筒入り濃厚宇治抹茶パフェ。", "中村藤吉 京都駅店"],
        ["Katsukura Kyoto Tonkatsu & Sesame Mortar", "名代とんかつ かつくら（京野菜＆白味噌汁）", "Katsukura Sanjo Main Shop / Kyoto Stn Cube", "かつくら 三条本店／京都駅ザ・キューブ店", "https://www.katsukura.jp/", "★ 3.64", "easy", "🟢 Directly inside JR Kyoto Station Building 11F", "🟢 JR京都駅ビル11F・三条河原町", "Crisp light breadcrumbs paired with freshly roasted ground sesame & red-wine Kyoto sauce.", "すりたての白胡麻と赤ワイン入り濃口ソース・京白味噌汁が自慢のとんかつ。", "かつくら 三条本店"],
        ["Fushimi Inari 1540 Kitsune Udon & Gion Duck Ramen", "伏見稲荷 きつねうどん・祇園合鴨ラーメン", "Nezameya (Inari) / Gion Duck Noodles", "祢ざめ家（伏見稲荷）／Gion Duck Noodles", "https://kyoto.travel/en/", "★ 3.70", "easy", "🟢 2–4 min walk from JR Inari / Keihan Gion-Shijo", "🟢 JR稲荷駅・京阪祇園四条駅徒歩圏", "500-year-old shrine-gate sweet tofu udon or French-inspired roasted duck ramen in Gion alleyways.", "創業1540年の老舗稲荷寿司・きつねうどん＆祇園の本格紀州鴨ラーメン。", "Gion Duck Noodles 京都"]
      ],
      a: [
        ["Kyoto Bus & Metro PDF", "京都市交通局PDF", "Kyoto City Bus & Subway Official Navi Route Map PDF", "京都市バス・地下鉄 公式路線図マップPDF", "https://www.city.kyoto.lg.jp/kotsu/cmsfiles/contents/0000019/19770/ENG202503(map)WEB.pdf", "Full subway & city bus routes serving Kiyomizu-dera, Kinkaku-ji, Gion & Kitano Tenmangu.", "清水寺・金閣寺・祇園・北野天満宮・嵐山を巡る京都市公式路線図PDF。", true]
      ],
      g: [
        ["Kyoto Official Travel", "京都公式ガイド", "Kyoto City Official Travel Guide", "京都観光オフィシャルサイト Kyoto Travel", "https://kyoto.travel/en/", "Fushimi Inari, Arashiyama, Kiyomizu-dera, Kinkaku-ji, Uji Byodo-in & Amanohashidate.", "伏見稲荷・嵐山・清水寺・金閣寺・宇治平等院・天橋立の公式ガイド。"]
      ]
    },
    osaka: {
      regEn: "Osaka", regJa: "大阪府",
      f: [
        ["Dotonbori Yamaimo-yaki Okonomiyaki", "道頓堀 本場お好み焼き（山芋100%・美津の）", "Okonomiyaki Mizuno / Kiji (Osaka)", "お好み焼 美津の（道頓堀）／きじ", "https://www.mizuno-osaka.com/", "★ 3.73", "easy", "🟢 4-min walk from Namba Subway Stn Exit 14", "🟢 地下鉄なんば駅14番出口徒歩4分", "Michelin Bib Gourmand Osaka staple—fluffy pure grated mountain yam batter grilled live before you.", "山芋100%でふっくら焼き上げるミシュラン掲載・道頓堀の大行列お好み焼き。", "美津の 道頓堀"],
        ["Copper-Griddle Melty Takoyaki (Octopus Balls)", "大阪 とろとろ大だこ たこ焼き（わなか・くくる）", "Takoyaki Wanaka / Kukuru Dotonbori", "たこ焼道楽 わなか 千日前／くくる", "http://takoyaki-wanaka.com/", "★ 3.66", "easy", "🟢 3-min walk from Namba / Nipponbashi Stn", "🟢 なんば駅・日本橋駅徒歩3分", "Crisp golden shell hiding piping-hot dashi custard and tender giant octopus chunks.", "外はカリッと中は出汁がとろける大阪粉もんの王道。", "わなか 千日前"],
        ["Shinsekai & Namba Crisp Kushikatsu Skewers", "新世界・難波 元祖串かつ（二度漬け禁止）", "Kushikatsu Daruma Dotonbori / Shinsekai", "串かつだるま 道頓堀店／新世界総本店", "https://www.kushikatu-daruma.com/", "★ 3.55", "easy", "🟢 4-min walk from Namba or Dobutsuen-mae Stn", "🟢 なんば駅・動物園前駅徒歩4分", "Fine-breaded beef, asparagus, quail egg & pickled ginger skewers fried light in hot oil.", "きめ細かい衣でカラッと揚げた牛串・紅生姜串を秘伝ソースで。", "串かつだるま 新世界"],
        ["Freshly Steamed 551 Horai Pork Buns", "大阪名物 551蓬莱のできたて豚まん", "551 Horai Main Shop (Namba Ebisubashi)", "551蓬莱 本店（なんば戎橋筋）", "https://www.551horai.co.jp/", "★ 3.69", "easy", "🟢 2-min walk from Namba Station", "🟢 各線なんば駅徒歩2分・新大阪駅", "Over 170,000 handmade steamed pork & sweet-onion buns crafted fresh daily across Osaka.", "甘い玉ねぎとジューシー豚肉がたっぷり詰まった大阪の国民的ソウルフード。", "551蓬莱 本店"]
      ],
      a: [
        ["Osaka Metro PDF", "Osaka Metro PDF", "Osaka Metro Official Route Map PDF (All Subway Lines)", "Osaka Metro（大阪メトロ）公式路線図PDF", "https://subway.osakametro.co.jp/img/osakametro_rosenzu_20191001.pdf", "Covers Shin-Osaka, Umeda, Namba, Tennoji, Osaka Castle & USJ transfers.", "新大阪・梅田・なんば・天王寺・大阪城公園を結ぶ全線マップPDF。", true]
      ],
      g: [
        ["Osaka Convention", "大阪公式ガイド", "Osaka Official Tourism Information (Osaka-Info)", "大阪観光局 OSAKA-INFO 公式ガイド", "https://osaka-info.jp/en/", "Dotonbori Canal, Osaka Castle, Kuromon Market, Shinsekai, Umeda Sky & Universal Studios.", "道頓堀・大阪城・黒門市場・新世界・梅田スカイビル・USJガイド。"]
      ]
    },
    hyogo: {
      regEn: "Hyogo", regJa: "兵庫県",
      f: [
        ["Certified A5 Kobe Beef Teppanyaki Steak", "世界が認める A5等級 神戸ビーフ鉄板焼ステーキ", "Kobe Plaisir / Steakland Kobe-kan", "神戸プレジール／ステーキランド神戸館（三宮）", "https://steakland.jp/", "★ 3.65", "easy", "🟢 2-min walk from JR / Hankyu Sannomiya Stn", "🟢 JR・阪急「三宮駅」西口より徒歩2分", "Hyogo Tajima-bloodline Kobe beef seared medium-rare with crispy garlic chips by master teppan chefs.", "兵庫県産・但馬牛から厳選された本場神戸ビーフを駅チカ鉄板焼きで堪能。", "ステーキランド 神戸"],
        ["Nankinmachi Steamed Pork Buns & Kobe Croquettes", "神戸南京町 老祥記「元祖豚饅頭」＆森谷コロッケ", "Roushouki & Moriya Shoten (Motomachi)", "老祥記（南京町広場）／森谷商店（元町）", "https://www.nankinmachi.or.jp/", "★ 3.74", "easy", "🟢 3-min walk from JR / Hanshin Motomachi Stn", "🟢 JR・阪神「元町駅」より徒歩3分", "Founded 1915—juicy fermented-dough pork buns right across from famous Kobe-beef potato croquettes.", "大正4年創業の元祖豚饅頭と、行列必至の神戸牛入り揚げたてコロッケ。", "老祥記 神戸"],
        ["Akashiyaki (Dashi-Dipped Fluffy Octopus Dumplings)", "兵庫・明石＆神戸名物 明石焼（玉子焼）", "Takoyaki Tachibana / Akashi Uonotana", "たこ焼 たちばな（三宮）／魚の棚（明石）", "https://www.feel-kobe.jp/en/", "★ 3.59", "easy", "🟢 3-min walk from Sannomiya / JR Akashi Stn", "🟢 三宮センター街・JR明石駅徒歩すぐ", "Custard-soft egg batter dumplings gently dipped into warm kelp-mitsuba broth.", "タコを包んだふわふわ卵生地を温かい和風だしにつけて味わう兵庫伝統の味。", "たちばな 三宮"],
        ["Arima Carbonated Wafer & Awaji Sweet Onion Burger", "有馬温泉 生炭酸せんべい＆淡路島玉ねぎ・Kinosaki Crab", "Yunohana Honpo (Arima) / Awajishima Burger", "湯の花堂本舗（有馬）／あわじ島オニオンビーフバーガー", "https://www.arima-onsen.com/", "★ 3.56", "bus", "🟡 Arima Onsen, Kinosaki Crab Coast & Awaji", "🟡 有馬温泉・淡路島・城崎温泉エリア", "Warm 5-second-fresh spring wafers in Arima, winter Matsuba crab in Kinosaki & ultra-sweet onions on Awaji.", "有馬の焼き立て炭酸せんべいや、冬の城崎松葉ガニ、淡路島ブランド玉ねぎグルメ。", "湯の花堂本舗 有馬温泉"]
      ],
      a: [
        ["Hyogo Rail & Kobe", "兵庫・神戸交通", "Hyogo Rail Map (JR Sanyo/Kobe, Hankyu, Shinkansen & Port Liner)", "JR神戸線・山陽電車・神戸電鉄（有馬）・高速バス案内", "https://www.feel-kobe.jp/en/access/", "Seamless JR/Hankyu connections across Kobe, Himeji, Arima Onsen & Kinosaki Express.", "神戸三宮〜姫路（新快速40分）・有馬温泉（電車30分）・淡路島・城崎温泉アクセス。"]
      ],
      g: [
        ["Hyogo Official", "兵庫ガイド", "Hyogo Tourism Official Guide (Enjoy Hyogo)", "ひょうご観光本部 HYOGO!ナビ 公式ガイド", "https://www.hyogo-tourism.jp/english/", "Himeji White Heron Castle, Kobe Harborland, Arima & Kinosaki Onsen, Takeda Castle & Awaji Island.", "国宝姫路城・神戸港・有馬温泉・城崎温泉・竹田城跡・淡路島ガイド。"]
      ]
    },
    nara: {
      regEn: "Nara", regJa: "奈良県",
      f: [
        ["Kakinoha-zushi (Persimmon-Leaf Cured Salmon & Mackerel Sushi)", "奈良名物 柿の葉すし（鯖・鮭の伝統押し寿司）", "Hiraso / Izasa Kakinoha-zushi (Nara Park)", "柿の葉すし本舗 たなか／平宗／いざさ（奈良）", "https://www.kakinoha.co.jp/", "★ 3.60", "easy", "🟢 2–5 min walk from Kintetsu-Nara / JR Nara", "🟢 近鉄奈良駅・JR奈良駅周辺徒歩圏", "Fragrant seasonal persimmon leaves preserve vinegared mackerel & salmon sushi with subtle herbal aroma.", "抗菌作用のある柿の葉で包んだ爽やかな香り！奈良・吉野の伝統郷土寿司。", "平宗 奈良"],
        ["Kama-meshi Shizu (Slow-Cooked Claypot Seven-Topping Rice)", "奈良公園老舗 釜めし「志津香」（奈良七種釜めし）", "Kamameshi Shizuka Koen / Omiya", "麺闘庵／志津香 公園店（奈良公園そば）", "https://www.kamameshi-shizuka.jp/", "★ 3.64", "easy", "🟢 3-min walk from Kintetsu-Nara toward Todai-ji", "🟢 近鉄奈良駅から奈良公園方面徒歩8分", "Individual iron pots cooked to order with anago eel, shrimp, chicken, bamboo & crispy scorched rice bottom.", "一杯ずつ炊き上げる奈良七種釜めし。香ばしいお焦げと繊細な出汁が絶品。", "志津香 奈良公園"],
        ["Nakatanidou High-Speed Pounded Yomogi Mochi & Miwa Somen", "高速餅つき「中谷堂」よもぎ餅＆日本最古 三輪そうめん", "Nakatanidou (Sanjo-dori) / Miwa Yamamoto", "中谷堂（近鉄奈良すぐ）／三輪そうめん山本", "https://www.nakatanidou.jp/", "★ 3.65", "easy", "🟢 5-min walk from Kintetsu-Nara Station", "🟢 近鉄奈良駅から東向商店街・三条通徒歩5分", "Fresh warm mugwort mochi filled with red-bean paste pounded right before cheering crowds.", "テレビでもお馴染み！高速餅つきで練り上げる柔らか温かいよもぎ餅。", "中谷堂 奈良"]
      ],
      a: [
        ["Kintetsu & Nara Bus", "近鉄・奈良交通バス", "Kintetsu Nara/Kyoto Access & Nara Kotsu Heritage Loop Bus", "近鉄電車（大阪・京都35分）＆奈良交通・ぐるっとバス", "https://www.narakotsu.co.jp/language/en/", "Direct Kintetsu express trains from Kyoto & Osaka plus Todai-ji/Kasuga loop buses.", "京都・大阪難波から近鉄特急35分！東大寺・春日大社・法隆寺バス案内。"]
      ],
      g: [
        ["Visit Nara", "奈良ガイド", "Visit Nara Prefecture Official Travel Portal", "なら旅ネット 奈良県公式観光情報サイト", "https://www.visitnara.jp/", "Todai-ji Great Buddha, Nara Deer Park, Kasuga Taisha, Horyu-ji, Asuka & Mt. Yoshino cherry blossoms.", "東大寺大仏殿・奈良公園の鹿・春日大社・法隆寺・飛鳥・吉野山の桜ガイド。"]
      ]
    },
    wakayama: {
      regEn: "Wakayama", regJa: "和歌山県",
      f: [
        ["Wakayama Ramen (Rich Tonkotsu-Shoyu Chuka Soba)", "ご当地名物 和歌山ラーメン（井出商店・早寿司付）", "Ide Shoten / Marumiya (JR Wakayama Stn)", "井出商店（和歌山駅前）／丸美商店", "https://visitwakayama.jp/", "★ 3.67", "easy", "🟢 7-min walk from JR Wakayama Station", "🟢 JR和歌山駅より徒歩7分", "Rich pork-bone soy broth paired with pickled mackerel hayasushi and boiled eggs placed on every table.", "濃厚豚骨醤油スープと、卓上の『早寿司（鯖寿司）』を一緒に頬張るのが和歌山流！", "井出商店 和歌山"],
        ["Koyasan Shojin Ryori & Fresh Sesame Tofu (Goma-dofu)", "高野山 伝統精進料理＆できたて濃厚ごま豆腐", "Kadohama Gomadofu / Koyasan Shukubo", "角濱ごまとうふ総本舗（高野山）／宿坊精進料理", "https://www.gomatofu.com/", "★ 3.60", "bus", "🟡 Nankai Bus from Koyasan Cablecar terminal", "🟡 南海高野山駅ケーブルカー〜南海りんかんバス", "Silky pure roasted-sesame pudding-like tofu paired with mountain sansai vegetables in monk cuisine.", "弘法大師ゆかりの高野山で守られてきたクリーミーで濃厚な絶品ごま豆腐＆精進料理。", "角濱ごまとうふ 高野山"],
        ["Kii-Katsuura Wild Tuna & Shirahama Tore-Tore Seafood", "南紀勝浦 生まぐろ丼＆白浜とれとれ市場海鮮", "Bodai (Kii-Katsuura) / Toretore Market", "めはりや／竹原／とれとれ市場（白浜）", "https://www.toretore.com/", "★ 3.61", "easy", "🟢 Steps from JR Kii-Katsuura Port / Shirahama Bus", "🟢 JR紀伊勝浦駅・白浜バス停", "Japan's #1 fresh never-frozen pole-and-line bluefin & albacore tuna straight off Katsuura docks.", "生鮮マグロ水揚げ日本一の勝浦港グルメと南紀白浜の巨大海鮮市場。", "とれとれ市場 白浜"]
      ],
      a: [
        ["Nankai Koyasan & JR", "南海高野山・JR", "Nankai Koyasan World Heritage Ticket & JR Kuroshio Express", "南海電鉄 高野山世界遺産きっぷ＆JR特急くろしお（白浜・勝浦）", "https://www.howto-osaka.com/en/special/ticket/koyasan/", "Combines Nankai Ropeway/Rail from Osaka Namba with unlimited Koyasan buses.", "難波から高野山へ直通の南海電車・ケーブルカー＆JR特急くろしお案内。"]
      ],
      g: [
        ["Visit Wakayama", "和歌山ガイド", "Visit Wakayama Official Prefecture Portal", "わかやま観光情報 和歌山県公式サイト", "https://visitwakayama.jp/en/", "Koyasan Temple Stays, Kumano Kodo Pilgrimage Trails, Nachi Falls & Shirahama Onsen.", "高野山宿坊体験・世界遺産熊野古道・那智の滝・白浜温泉の公式ガイド。"]
      ]
    },
    tottori: {
      regEn: "Tottori", regJa: "鳥取県",
      f: [
        ["Tottori Matsuba-gani (Winter Brand Snow Crab) & Karo Market", "鳥取冬の王者 松葉がに＆賀露港海鮮丼", "Karoichi / Wakabayashi (Tottori Port)", "味覚のお宿 山田屋・かろいち市場（鳥取港）", "https://www.tottori-tour.jp/en/", "★ 3.63", "bus", "🟡 20-min Kirin Lion Bus from JR Tottori Stn", "🟡 JR鳥取駅からループ麒麟獅子バスで約20分", "Japan's top crab-landing prefecture—sweet freshly boiled winter Matsuba snow crab & Oyagani roe.", "蟹取県と呼ばれる日本一の蟹水揚げ！鳥取港かろいちで味わう冬の松葉がに＆海鮮丼。", "かろいち 鳥取"],
        ["Tottori Gyukotsu Ramen (Golden Beef-Bone Broth)", "鳥取ご当地麺 牛骨ラーメン（香味豊かな澄みスープ）", "Sumire Shokudo / Hot Wheel (Kurayoshi & Tottori)", "すみれ食堂／満洲味／ごっつぉらーめん（鳥取）", "https://www.torican.jp/", "★ 3.58", "easy", "🟢 Walkable from JR Kurayoshi & Tottori Stn", "🟢 JR鳥取駅・倉吉周辺", "Slow-simmered roasted beef-bone broth with subtle sweetness unlike pork or chicken stocks elsewhere in Japan.", "鳥取中・西部に根付く香ばしくコク深い唯一無二の「牛骨ラーメン」。", "満洲味 鳥取"],
        ["Hakuto White Squid Sashimi & Daisen Soft Serve", "鳥取賀露 活白イカ（シロイカ）＆大山まきばミルクソフト", "Sunaba Coffee / Daisen Makiba Milk-no-Sato", "すなば珈琲（鳥取駅前）／大山まきばみるくの里", "https://www.tottori-tour.jp/en/", "★ 3.54", "easy", "🟢 Sunaba Coffee 2 min from JR Tottori Stn", "🟢 JR鳥取駅すぐ「すなば珈琲」＆大山エリア", "Translucent crispy white squid sashimi plus Tottori's playful homegrown Sunaba Sand Cafe coffee & toast.", "「スタバはなくてもスナバはある」から名物になったすなば珈琲＆透明活白イカ。", "すなば珈琲 鳥取"]
      ],
      a: [
        ["Tottori Loop Bus", "麒麟獅子バス", "Tottori 100-Yen Kururi & Kirin Lion Loop Bus (Sand Dunes)", "鳥取駅↔鳥取砂丘・賀露港 麒麟獅子バス＆JR山陰本線", "https://www.torican.jp/english/access", "20-min direct bus from JR Tottori Station to Tottori Sand Dunes & Sand Museum.", "JR鳥取駅から鳥取砂丘（約20分）・砂の美術館・賀露港を結ぶ公式バス案内。"]
      ],
      g: [
        ["Tottori Tourism", "鳥取ガイド", "Tottori Prefecture Official Travel Guide", "とっとり旅 鳥取県公式観光案内サイト", "https://www.tottori-tour.jp/en/", "Tottori Sand Dunes, Sand Museum, Uradome Coast, Mt. Daisen & Sakaiminato Mizuki Shigeru Road.", "鳥取砂丘・砂の美術館・浦富海岸・大山・水木しげるロード・コナン空港ガイド。"]
      ]
    },
    shimane: {
      regEn: "Shimane", regJa: "島根県",
      f: [
        ["Izumo Wariko Soba (Three-Tiered Dark Buckwheat)", "日本三大そば 出雲そば「割子そば」（朱塗り3段丸漆器）", "Kenetsuya / Yakumoan / Arakiya (Izumo & Matsue)", "献上そば 羽根屋／荒木屋／八雲庵（出雲・松江）", "https://www.izumo-kankou.gr.jp/", "★ 3.70", "easy", "🟢 Walkable around Izumo Taisha & Matsue Castle", "🟢 出雲大社門前・JR出雲市駅・松江城近く", "Whole-grain unhulled buckwheat milled dark and topped directly with dashi tare, momiji-oroshi & nori.", "そばの実を殻ごと挽いた香り豊かな黒い麺に、つゆを直接かけて食べる出雲そば。", "羽根屋 出雲"],
        ["Lake Shinji Shijimi Clam Ramen & Seven Treasures", "宍道湖名物 しじみ汁＆のどぐろ丼（松江）", "Kawabata / Matsue Minami-kan (Tai-meshi)", "皆美館（松江名物鯛めし）／川京（松江）", "https://www.kankou-shimane.com/en/", "★ 3.68", "easy", "🟢 10-min bus from JR Matsue Station along Ohashi River", "🟢 JR松江駅〜松江城・宍道湖畔エリア", "Plump Lake Shinji freshwater shijimi clams, Matsue Sea-Bream Rice & crispy Iwami blackthroat seaperch.", "宍道湖七珍のヤマトシジミと、松江藩伝統の雅な『皆美家伝・鯛めし』。", "皆美館 松江"],
        ["Iwami Shimane Wagyu & Matsue Wagashi Tea Sweets", "島根和牛＆日本三大菓子処 松江の抹茶と上生菓子", "Furyudo / Meimeian Tea House (Matsue Castle)", "風流堂／明々庵（松江市・茶の湯文化）", "https://www.visit-matsue.com/", "★ 3.57", "easy", "🟢 Near Matsue Castle & Lakefront", "🟢 松江城北側・塩見縄手エリア", "Delicate seasonal wagashi sweets paired with whisked matcha inside samurai-era tea pavilions.", "京都・金沢と並ぶ日本三大菓子処！松江城近くの茶室で味わう極上の和菓子と抹茶。", "風流堂 松江"]
      ],
      a: [
        ["Lakeline & Ichibata", "レイクライン・一畑", "Matsue Lakeline Loop Bus & Ichibata Electric Railway (Matsue ↔ Izumo)", "松江レイクラインバス＆一畑電車（松江しんじ湖〜出雲大社）案内", "https://www.ichibata.co.jp/railway/en/", "Lakeline Bus connects JR Matsue Station, Matsue Castle & Art Museum; Ichibata Rail crosses Lake Shinji to Izumo Taisha.", "JR松江駅〜松江城・美術館を巡るレイクラインバスと、宍道湖畔を走る一畑電車。"]
      ],
      g: [
        ["Discover Shimane", "島根ガイド", "Visit Shimane Prefecture Official Travel Guide", "しまね観光ナビ 島根県公式観光サイト", "https://www.kankou-shimane.com/en/", "Izumo Taisha Grand Shrine, Matsue Original Castle, Adachi Museum of Art, Tamatsukuri Onsen & Iwami Ginzan.", "出雲大社・国宝松江城・足立美術館・玉造温泉・世界遺産石見銀山の完全ガイド。"]
      ]
    },
    okayama: {
      regEn: "Okayama", regJa: "岡山県",
      f: [
        ["Okayama Demi-Katsudon (Rich Demi-Glace Pork Bowl)", "岡山B級王道 デミカツ丼（濃厚デミグラスソース）", "Ajitsukasa Nomura (Okayama City)", "味司 野村（岡山市北区平和町）", "https://www.okayama-japan.jp/en/", "★ 3.63", "easy", "🟢 8-min walk or tram from JR Okayama Station", "🟢 JR岡山駅東口より徒歩約8分", "Founded 1931—crispy breaded pork over steamed cabbage topped with velvety demi-glace sauce.", "昭和6年創業！サクッと揚げたカツに上品な特製デミグラスソースをかける岡山名物。", "味司 野村 岡山"],
        ["Mamacari Zushi & Setouchi Bara-zushi (Festive Scattered Sushi)", "岡山伝統 祭り寿司（ばら寿司）＆ママカリ寿司", "Azuma Sushi (Inside JR Okayama Station) / Ryori Ryokan", "吾妻寿司（JR岡山駅さんすて直結）／季節料理", "https://www.okayama-japan.jp/en/", "★ 3.55", "easy", "🟢 Directly inside JR Okayama Station Sun-Station", "🟢 JR岡山駅構内さんすて直結", "Vinegared rice laden with Seto Inland Sea mama-kari shad, shrimp, conger eel & mountain veggies.", "『飯を借りるほど旨い』ママカリや瀬戸内の海の幸を敷き詰めた晴れの国・岡山ばらずし。", "吾妻寿司 岡山駅"],
        ["Kurashiki Denim Street Parfaits & Shimizu White Peach Sweets", "倉敷美観地区 白桃パフェ＆くらしき桃子（桃・マスカット）", "Kurashiki Momoko / Bikan Parlor", "くらしき桃子（倉敷美観地区本店）／ぶっかけふるいち", "https://www.kurashiki-tabi.jp/", "★ 3.62", "easy", "🟢 10-min walk from JR Kurashiki Station", "🟢 JR倉敷駅南口より美観地区へ徒歩10分", "Sun-ripened Okayama white peach & Muscat grape parfaits served inside white-walled canal storehouses.", "フルーツ王国・岡山の完熟白桃＆シャインマスカットを丸ごと味わう美観地区パフェ。", "くらしき桃子 倉敷"]
      ],
      a: [
        ["Okayama Tram & Rail", "岡山路面電車・JR", "Okayama Electric Tramway & JR Sanyo/Uno Port (Kurashiki & Naoshima Ferry)", "岡山電気軌道路面電車＆JR山陽線（倉敷）・宇野線（直島フェリー）案内", "https://www.okayama-japan.jp/en/access", "Direct Sanyo Shinkansen hub: 17 min to Kurashiki, 50 min JR Uno Line to Naoshima ferries.", "山陽新幹線岡山駅から倉敷17分・直島行きの宇野港へも直結！"]
      ],
      g: [
        ["Okayama Official", "岡山ガイド", "Okayama Prefecture Official Tourism Portal", "岡山観光WEB 岡山県公式観光サイト", "https://www.okayama-japan.jp/en/", "Okayama Korakuen Top-3 Garden, Okayama Crow Castle, Kurashiki Bikan Quarter & Kojima Jeans Street.", "日本三名園・岡山後楽園・岡山城・倉敷美観地区・児島ジーンズストリート案内。"]
      ]
    },
    hiroshima: {
      regEn: "Hiroshima", regJa: "広島県",
      f: [
        ["Hiroshima Layered Okonomiyaki with Crispy Noodles", "本場 広島お好み焼き（そば肉玉・牡蠣のせ）", "Nagataya / Mitchan Sohonten / Okonomimura", "お好み焼 長田屋（原爆ドーム前）／みっちゃん総本店", "https://www.nagataya-okonomi.com/en/", "★ 3.68", "easy", "🟢 2-min walk from Genbaku-Dome-mae / JR Hiroshima ekie", "🟢 原爆ドーム前電停徒歩2分・JR広島駅直結", "Thin crepe stacked high with sweet steamed cabbage, pork belly, crispy yakisoba & Carp sauce.", "蒸した甘いキャベツとパリッと焼いた中華麺が重なる広島市民のソウルフード。", "長田屋 広島"],
        ["Miyajima Charcoal Anagomeshi (Roasted Conger Eel)", "宮島名物 あなごめし（明治創業・うえの）", "Anagomeshi Ueno (Miyajimaguchi)", "あなごめし うえの（宮島口）／ふじたや", "https://www.anagomeshi.com/", "★ 3.79", "easy", "🟢 2-min walk from JR Miyajimaguchi & Ferry Pier", "🟢 JR宮島口駅・宮島フェリー乗り場徒歩2分", "Wild Seto Inland Sea conger eel charcoal-broiled crisp over rice simmered in eel-bone broth.", "明治34年創業！炭火で香ばしく焼いた穴子を、穴子の出汁炊きご飯に乗せた極上の逸品。", "あなごめし うえの"],
        ["Setouchi Charcoal-Grilled Miyajima Oysters & Onomichi Ramen", "宮島 焼き牡蠣＆尾道背脂醤油ラーメン", "Yakigaki-no-Hayashi (Miyajima) / Tsutafuji", "焼がきのはやし（宮島表参道）／朱華園・つたふじ（尾道）", "https://www.yakigakino-hayashi.co.jp/", "★ 3.63", "easy", "🟢 Omotesando Arcade, Miyajima / JR Onomichi", "🟢 宮島表参道商店街・JR尾道駅徒歩圏", "Plump winter oysters roasted over hot coals beside savory pork-back-fat dried-fish Onomichi shoyu ramen.", "宮島商店街のプリプリ炭火焼き牡蠣と、港町・尾道名物のコク旨背脂中華そば。", "焼がきのはやし 宮島"]
      ],
      a: [
        ["Hiroden Tram & Loop", "広電路面電車・バス", "Hiroden Streetcar, Meipuru-pu Sightseeing Loop PDF & Miyajima Ferry", "広島電鉄＆JR観光バス「めいぷる〜ぷ」公式PDF・宮島フェリー", "http://www.chugoku-jrbus.co.jp/sightseeing/files/20251024meipurupu_map_foreigner.pdf", "Loop bus links JR Hiroshima Stn to Peace Park & Shukkeien (JR Pass free); JR West Ferry reaches Miyajima in 10 min.", "広島駅〜平和記念公園・縮景園バスPDF＆JR西日本宮島フェリー10分。", true]
      ],
      g: [
        ["Dive! Hiroshima", "広島ガイド", "Dive! Hiroshima Official Travel Portal", "ひろしま公式観光サイト Dive! Hiroshima", "https://dive-hiroshima.com/en/", "Atomic Bomb Dome & Peace Museum, Itsukushima Floating Torii, Onomichi & Shimanami Kaido.", "原爆ドーム・平和記念公園・安芸の宮島（厳島神社）・尾道・しまなみ海道案内。"]
      ]
    },
    yamaguchi: {
      regEn: "Yamaguchi", regJa: "山口県",
      f: [
        ["Shimonoseki Karato Market Fugu (Pufferfish) & Sushi", "下関 唐戸市場 フグ刺し＆名物ふく寿司・海鮮屋台", "Karato Ichiba / Shunpanro (Shimonoseki)", "唐戸市場（活きいき馬関街）／春帆楼（下関）", "https://www.karatoichiba.com/", "★ 3.65", "bus", "🟡 10-min Sanden Bus from JR Shimonoseki Stn", "🟡 JR下関駅からサンデン交通バス約10分", "Japan's fugu capital—sample affordable nigiri, fugu sashimi & crispy deep-fried pufferfish right at weekend market stalls.", "ふぐの本場・下関！週末の活きいき馬関街では天然ふぐや大トロ握りを1貫から堪能。", "唐戸市場 下関"],
        ["Kawara Soba (Sizzling Green-Tea Noodles on Hot Roof Tile)", "山口川棚温泉名物 元祖「瓦そば」", "Ganso Kawara Soba Takase (Kawatana & Karato)", "元祖 瓦そば たかせ（川棚・下関カモンワーフ）", "https://www.kawarasoba.jp/", "★ 3.63", "bus", "🟡 At Kamon Wharf beside Karato Market / Kawatana", "🟡 唐戸市場すぐ「カモンワーフ」店・川棚本館", "Cha-soba crisped directly on a piping hot clay roof tile, topped with sweet beef, egg threads & lemon.", "熱々に焼いた日本瓦の上で茶そばをパリッと香ばしく焼き、甘辛い牛肉と味わう山口名物。", "瓦そば たかせ"],
        ["Iwakuni Sushi & Iwagami Sake (Dassai Homeland)", "岩国五層押し寿司＆銘酒「獺祭」・山賊焼", "Hangetsu-an / Irori Sanzoku (Iwakuni)", "岩国寿司（錦帯橋すぐ）／いろり山賊（玖珂）", "https://yamaguchi-tourism.jp/", "★ 3.55", "bus", "🟡 15-min bus from JR Iwakuni/Shin-Iwakuni Stn", "🟢 JR岩国駅・新岩国駅から錦帯橋バス", "Pressed multi-layered feudal lord sushi beside iconic wooden Kintaikyo Bridge & lively mountain-hearth chicken.", "名勝・錦帯橋そばの華やかな押し寿司「岩国寿司」と大人気の炭火・いろり山賊。", "いろり山賊 岩国"]
      ],
      a: [
        ["Yamaguchi Rail & Bus", "山口交通・JR", "JR Sanyo Shinkansen (Shin-Shimonoseki/Shin-Yamaguchi) & Sanden Bus", "JR山陽新幹線＆サンデンバス（唐戸市場・角島・元乃隅稲成）", "https://shimonoseki.travel/en/", "Shinkansen connects Hiroshima↔Shin-Shimonoseki↔Hakata; 10-min bus links JR Shimonoseki to Karato Market.", "新幹線で広島・博多と直結。下関駅〜唐戸市場・関門人道トンネルへのバス案内。"]
      ],
      g: [
        ["Visit Yamaguchi", "山口ガイド", "Visit Yamaguchi Official Prefecture Portal", "おいでませ山口へ 山口県公式観光サイト", "https://yamaguchi-tourism.jp/en/", "Kintaikyo Bridge, Motonosumi 123 Red Torii Gates, Tsunoshima Bridge, Akiyoshido Cave & Hagi.", "錦帯橋・元乃隅神社・角島大橋・秋芳洞・萩城下町・下関関門海峡ガイド。"]
      ]
    },
    tokushima: {
      regEn: "Tokushima", regJa: "徳島県",
      f: [
        ["Tokushima Sukiyaki-Style Ramen (Pork Belly & Raw Egg)", "徳島ラーメン（甘辛豚骨醤油×豚バラ＆生卵）", "Inotani Main Shop / Men-o (Tokushima Stn)", "中華そば いのたに 本店／麺王 徳島駅前店", "https://www.tokushima-ramen.jp/", "★ 3.63", "easy", "🟢 1-min walk (Men-o) / 10-min walk from JR Tokushima Stn", "🟢 JR徳島駅すぐ（麺王）・徒歩10分（いのたに）", "Savory dark pork-bone soy soup topped with thinly sliced sukiyaki-style pork belly and a raw egg yolk.", "すき焼き風に甘辛く煮た豚バラ肉と生卵をのせ、白いご飯と食べる濃厚・徳島ラーメン。", "いのたに 徳島"],
        ["Iya Valley Buckwheat Soba & Dekomawashi Skewers", "大歩危・祖谷 伝統「祖谷そば」＆でこまわし（味噌田楽）", "Iya-no-Kazura-bashi Teahouses / Kazuraya", "祖谷のかずら橋茶屋・祖谷美人（徳島）", "https://miyoshi-tourism.jp/", "★ 3.55", "bus", "🟡 Shikoku Kotsu Bus from JR Oboke Station", "🟡 JR土讃線「大歩危駅」から四国交通バス", "Rustic short handmade noodles rich in wild buckwheat aroma alongside grilled rock-tofu miso skewers.", "つなぎ少なめで香り豊かな祖谷そばと、岩豆腐・じゃがいもの味噌田楽「でこまわし」。", "祖谷美人 徳島"],
        ["Naruto Sea Bream Ramen (Tai-Shio) & Sudachi Sweets", "鳴門鯛塩ラーメン＆徳島特産すだち・鳴門金時スイーツ", "Naruto Ginza / Uzushio Shokudo (Naruto)", "堂の浦（鯛塩ラーメン）／びんび家（鳴門）", "https://www.discovertokushima.net/", "★ 3.62", "easy", "🟢 Walkable near JR Tokushima / Naruto Coast", "🟢 JR徳島駅近く・鳴門公園周辺", "Freshly caught Naruto Strait red sea bream simmered into golden salt ramen or sashimi platters.", "激しい潮流で育った最高級・鳴門鯛を丸ごと使った鯛塩ラーメンや老舗活魚料理。", "びんび家 鳴門"]
      ],
      a: [
        ["Tokushima Bus & JR", "徳島鉄道・バス", "JR Kotoku/Dosan Line & Shikoku Kotsu (Naruto / Iya Kazurabashi)", "JR徳島線/土讃線＆四国交通・徳島バス（鳴門渦潮・祖谷かずら橋）", "https://www.tokubus.co.jp/", "Express buses link Kobe/Osaka via Akashi Bridge straight into Naruto Whirlpools & Tokushima Station.", "関西から高速バス直通！鳴門公園（渦の道）・大歩危・祖谷かずら橋への公式時刻表。"]
      ],
      g: [
        ["Discover Tokushima", "徳島ガイド", "Discover Tokushima Official Tourism Guide", "阿波ナビ 徳島県公式観光情報サイト", "https://www.discovertokushima.net/en/", "Naruto Tidal Whirlpools, Iya Valley Vine Bridge, Oboke Gorge Cruise, Mt. Bizan & Awa Odori.", "鳴門の渦潮・祖谷のかずら橋・大歩危峡遊覧船・阿波おどり会館ガイド。"]
      ]
    },
    kagawa: {
      regEn: "Kagawa", regJa: "香川県",
      f: [
        ["Authentic Sanuki Udon (Udon-Ken Pride!)", "うどん県・香川 本場讃岐うどん（コシ抜群・かけ・釜玉）", "Udon Baka Ichidai / Waraya / Yamagoe", "手打十段 うどんバカ一代／わら家（屋島）／山越", "https://www.udonbakaichidai.co.jp/", "★ 3.74", "easy", "🟢 8-min walk Kotoden Hanazono / JR Takamatsu", "🟢 琴電「花園駅」徒歩8分・JR高松周辺", "Famous for morning Kama-butter (black-pepper carbonara) udon with springy hand-stomped noodles.", "早朝行列必須の名物『釜バターうどん』や、たらいで味わう屋島の伝統釜揚げうどん。", "うどんバカ一代 高松"],
        ["Honetsuki-dori (Crispy Spiced Roast Chicken Leg)", "丸亀・高松名物「骨付鳥」（親鳥の歯応え・雛鳥のジューシーさ）", "Ikkaku Takamatsu / Marugame Main Shop", "骨付鳥 一鶴（いっかく）高松店・丸亀本店", "https://www.ikkaku.co.jp/", "★ 3.65", "easy", "🟢 1-min walk Kotoden Kawaramachi / JR Marugame", "🟢 JR丸亀駅すぐ・琴電「瓦町駅」徒歩すぐ", "Garlicky pepper-crusted whole chicken leg roasted crisp in rendered chicken oil—eat with raw cabbage!", "にんにく・胡椒・塩の秘伝スパイスが効いた、香川第2のソウルフード！", "一鶴 高松"],
        ["Shodoshima Olive Wagyu & Island Somen", "小豆島オリーブ牛＆島そうめん・醤油蔵ソフト", "Marukin Soy Sauce Museum / Shodoshima Olive Park", "小豆島マルキン醤油記念館／作兵衛（手延素麺）", "https://www.shodoshima.or.jp/", "★ 3.55", "bus", "🟡 Ferry 60 min from Takamatsu Port to Tonosho", "🟡 高松港からフェリー60分・小豆島内バス", "Wagyu finished on pressed olive pomace alongside 400-year handmade island somen & soy-sauce soft serve.", "小豆島の醤油蔵で味わうしょうゆソフト＆伝統手延べ島そうめん・オリーブ牛。", "小豆島 島そうめん"]
      ],
      a: [
        ["Takamatsu Port & Kotoden", "高松港・ことでん", "Takamatsu Port Ferry Hub (Naoshima / Teshima / Shodoshima) & Kotoden", "高松港フェリー時刻表（直島・豊島・小豆島）＆琴電公式案内", "https://www.shikokukisen.com/en/", "Quick 50-min ferries from JR Takamatsu Station pier to Naoshima Art Island & Kotoden lines to Ritsurin/Kotohira.", "JR高松駅すぐの高松港から直島・小豆島フェリー＆栗林公園・こんぴらさん行きの琴電案内。"]
      ],
      g: [
        ["Visit Kagawa", "香川ガイド", "My Kagawa Official Prefecture Travel Guide", "うどん県旅ネット 香川県公式観光サイト", "https://www.my-kagawa.jp/en/", "Ritsurin National Treasure Garden, Naoshima/Teshima Art Islands, Kotohira Shrine & Shodoshima.", "栗林公園・アートの島 直島/豊島・金刀比羅宮（こんぴらさん）・小豆島オリーブ公園案内。"]
      ]
    },
    ehime: {
      regEn: "Ehime", regJa: "愛媛県",
      f: [
        ["Uwajima & Matsuyama Tai-Meshi (Sea Bream Rice)", "愛媛郷土料理 鯛めし（宇和島生卵ダレ・松山土鍋炊き）", "Goshiki / Kadoya / Taimeshi Akiyoshi", "五志喜／宇和島鯛めし かどや／丸水（松山）", "https://www.visitehimejapan.com/", "★ 3.63", "easy", "🟢 Steps from Matsuyama Okaido / Dogo Onsen", "🟢 伊予鉄道「大街道駅」「道後温泉駅」徒歩すぐ", "Compare southern Uwajima raw tai-sashimi over rice & egg yolk sauce vs claypot-steamed Matsuyama Tai-meshi.", "新鮮な鯛の刺身を特製卵ダレで味わう宇和島流＆鯛を丸ごと炊き込む松山流の食べ比べ！", "かどや 大街道 松山"],
        ["Dogo Botchan Dango & Mikan Citrus Juice Taps", "道後温泉 坊っちゃん団子＆蛇口からみかんジュース", "Tsuruya / 10 Factory (Dogo Shopping Arcade)", "つるや（坊っちゃん団子）／10 FACTORY（道後商店街）", "https://dogo.jp/en/", "★ 3.55", "easy", "🟢 Inside Dogo Onsen Haikara Arcade", "🟢 道後温泉本館すぐの道後ハイカラ通り", "Soak in 3,000-year-old Dogo Onsen Honkan then turn fresh Ehime Satsuma tangerine juice taps & enjoy tricolor dango.", "温泉上がりに蛇口から出る濃厚みかんジュース飲み比べと夏目漱石ゆかりの坊っちゃん団子。", "10 FACTORY 道後"],
        ["Imabari Yakibuta Tamago-Meshi (Pork & Double Fried Eggs)", "今治B級名物 焼豚玉子飯（半熟目玉焼き×甘辛焼豚）", "Shigematsu Hanten / Hakurakuten (Imabari)", "重松飯店／白楽天（JR今治駅）", "https://www.city.imabari.ehime.jp/", "★ 3.59", "easy", "🟢 Near JR Imabari Station (Shimanami gateway)", "🟢 JR今治駅より徒歩約10分", "Two runny sunny-side-up eggs layered over sliced roasted pork & sweet pepper sauce before/after cycling Shimanami Kaido.", "しまなみ海道サイクリング前後に必食のパンチの効いた今治ソウルフード！", "重松飯店 今治"]
      ],
      a: [
        ["Iyo-tetsu & Ferry", "伊予鉄・フェリー", "Iyotetsu Botchan Tram & JR Yosan Line (Dogo, Matsuyama, Shimonada)", "伊予鉄道市内電車（道後温泉〜松山市駅）＆JR予讃線（下灘）案内", "https://www.iyotetsu.co.jp/en/", "Retro trams connect JR Matsuyama Station to Matsuyama Castle Rope-way & Dogo Onsen Honkan.", "JR松山駅から松山城・大街道・道後温泉へ直結の路面電車＆坊っちゃん列車時刻表。"]
      ],
      g: [
        ["Visit Ehime", "愛媛ガイド", "Visit Ehime Japan Official Prefecture Portal", "いよ観ネット 愛媛県公式観光ガイド", "https://www.visitehimejapan.com/en", "Dogo Onsen Honkan, Matsuyama Original Castle, Shimanami Kaido Cycling & Shimonada Coastal Station.", "道後温泉本館・現存天守松山城・しまなみ海道サイクリング・海が目の前の下灘駅ガイド。"]
      ]
    },
    kochi: {
      regEn: "Kochi", regJa: "高知県",
      f: [
        ["Katsuo-no-Tataki (Straw-Flamed Bonito at Hirome Market)", "高知最強グルメ 本場「藁焼き鰹のたたき」（塩たたき）", "Myojinmaru (Hirome Market, Kochi)", "明神丸 ひろめ市場店（高知市）", "https://hirome.co.jp/", "★ 3.68", "easy", "🟢 2-min walk from Tosaden Ohashidori Tram Stop", "🟢 とさでん路面電車「大橋通」徒歩2分（高知城近く）", "Fresh Pacific bonito seared rapidly over roaring rice-straw flames, sliced thick with sea salt & raw garlic.", "豪快な藁の炎で一気に焼き上げる香ばしさ！分厚い鰹を粗塩と生にんにくで味わう名店。", "明神丸 ひろめ市場"],
        ["Yatai Gyoza & Crispy Nabeyaki Ramen", "高知屋台餃子（安兵衛）＆須崎名物 鍋焼きラーメン", "Yatai Yasubei / Hashimoto Shokudo (Kochi)", "屋台安兵衛／いまどき安兵衛／橋本食堂（須崎）", "https://yasubei.jp/", "★ 3.61", "easy", "🟢 Central Kochi tram stops & Susaki", "🟢 とさでん「蓮池町通」徒歩すぐ", "Bite-size crisp thin-skinned fried-steamed dumplings paired with sizzling claypot chicken-stock ramen.", "サクサク食感が病みつきの高知夜の名物・屋台餃子とアツアツ土鍋の鍋焼きラーメン。", "屋台安兵衛 高知"],
        ["Shimanto River Charbroiled Unagi & Yuzu Drinks", "清流四万十川 天然鮎・うなぎ＆馬路村ゆずジュース", "Kawanoya / Shimanto Roof Market", "四万十屋（四万十川）／ごっくん馬路村", "https://visitkochijapan.com/en/", "★ 3.55", "bus", "🟡 JR Dosan/Tosa Kuroshio Line to Nakamura", "🟢 JR高知・土佐くろしお鉄道 中村エリア", "Pure mountain-fed Shimanto River eel and refreshing Kochi orchard yuzu citrus.", "最後の清流・四万十川で育った極上天然うなぎ＆名産ゆずグルメ。", "四万十屋 高知"]
      ],
      a: [
        ["MY-YU Bus & Tram", "MY遊バス・とさでん", "Tosaden Streetcar & MY-YU Sightseeing Bus (Kochi Castle / Katsurahama)", "とさでん交通路面電車＆観光周遊バス「MY遊バス」（桂浜行き）", "https://visitkochijapan.com/en/useful/transportation", "Loops JR Kochi Station, Hirome Market, Mt. Godaisan Makino Botanical Garden & Katsurahama Beach.", "JR高知駅からひろめ市場・高知城・五台山・桂浜を結ぶ路面電車＆MY遊バス案内。"]
      ],
      g: [
        ["Visit Kochi Japan", "高知ガイド", "Visit Kochi Japan Official Prefecture Portal", "こうち旅ネット 高知県公式観光サイト", "https://visitkochijapan.com/en/", "Kochi Original Castle, Hirome Market, Katsurahama Beach, Niyodo Blue Gorge & Shimanto River.", "現存十二天守・高知城、ひろめ市場、桂浜、仁淀ブルー、四万十川沈下橋ガイド。"]
      ]
    },
    fukuoka: {
      regEn: "Fukuoka", regJa: "福岡県",
      f: [
        ["Frothy Hakata Tonkotsu Ramen", "本場 博多豚骨ラーメン（豚骨カプチーノ）", "Hakata Issou / ShinShin (Hakata)", "博多一双 本店／博多らーめん ShinShin", "https://www.hakata-issou.com/", "★ 3.74", "easy", "🟢 5-min walk JR Hakata Stn Chikushi Exit", "🟢 JR博多駅 筑紫口より徒歩5分", "Rich creamy pork-bone broth paired with crisp extra-thin al-dente noodles & kaedama refills.", "泡立つ濃厚「豚骨カプチーノ」スープと極細麺の本場博多ラーメン。", "博多一双 博多駅"],
        ["Hakata Motsunabe & Milky Mizutaki Hotpots", "博多もつ鍋＆水炊き", "Yamanaka / Oyama / Hanamidori", "もつ鍋 やま中／おおやま／華味鳥（博多）", "https://www.motu-ooyama.com/", "★ 3.68", "easy", "🟢 Directly inside KITTE Hakata / JR Hakata City", "🟢 JR博多シティ・KITTE博多直結", "Plump wagyu offal simmered with sweet Kyushu miso, chives & garlic alongside chicken collagen hotpot.", "ぷりぷり牛もつの濃厚味噌もつ鍋と白濁スープが絶品の博多水炊き。", "おおやま 博多"],
        ["Nakasu & Tenjin Yatai Stalls & Mentaiju", "中洲・天神 屋台ストリート＆元祖博多めんたい重", "Ganso Hakata Mentaiju / Kokinchan Yatai", "元祖博多めんたい重／屋台小金ちゃん", "https://www.mentaiju.com/", "★ 3.66", "easy", "🟢 3–5 min walk Nakasu-Kawabata / Tenjin Stn", "🟢 地下鉄「中洲川端」「天神」徒歩3〜5分", "Whole kelp-wrapped spiced pollack roe over nori rice plus open-air riverbank grilled yaki-ramen.", "昆布巻き明太子を丸ごと乗せた贅沢重と那珂川沿いの風情ある博多屋台。", "元祖博多めんたい重"],
        ["Dazaifu Freshly Grilled Umegae-Mochi", "太宰府天満宮 焼きたて梅ヶ枝餅", "Kasanoya (Dazaifu Approach)", "かさの家（太宰府天満宮参道）", "https://www.kasanoya.com/", "★ 3.55", "easy", "🟢 3-min walk Nishitetsu Dazaifu Station", "🟢 西鉄太宰府駅すぐ参道沿い", "Crisp toasted mochi filled with warm smooth red-bean paste eaten hot along the shrine stone avenue.", "梅の焼印入り！参道で焼き立てをほおばるパリッとモチモチの名物梅ヶ枝餅。", "かさの家 太宰府"]
      ],
      a: [
        ["Fukuoka Subway PDF", "福岡地下鉄PDF", "Fukuoka City Subway Route Map PDF (5 min Airport → Hakata)", "福岡市地下鉄 公式路線図PDF（空港〜博多5分・天神11分）", "https://subway.city.fukuoka.lg.jp/eng/route/deta/map.pdf", "Direct Airport Line subway reaches Hakata in 5 min and Tenjin in 11 min!", "福岡空港から博多5分・天神11分！市営地下鉄公式路線図PDF。", true]
      ],
      g: [
        ["Visit Fukuoka", "福岡ガイド", "Visit Fukuoka Official Prefecture Portal", "クロスロードふくおか 福岡県公式観光サイト", "https://www.crossroadfukuoka.jp/en", "Nakasu Yatai stalls, Dazaifu Tenmangu, Yanagawa river punting, Mojiko Retro & Itoshima.", "中洲屋台・太宰府天満宮・柳川川下り・門司港レトロ・糸島ガイド。"]
      ]
    },
    saga: {
      regEn: "Saga", regJa: "佐賀県",
      f: [
        ["A5 Saga Beef Teppanyaki & Yakiniku", "全国最高峰クラス「佐賀牛」ステーキ＆焼肉", "Kira Main Shop (Saga City) / Saga Beef Restaurant", "佐賀牛レストラン 季楽 本店（JAさが直営）", "https://kira.jasaga.or.jp/", "★ 3.68", "easy", "🟢 10-min walk from JR Saga Station", "🟢 JR佐賀駅より徒歩約10分", "Silky fine marbling backed by strict JA Saga grading—savored via seiro-mushi steam or teppan grill.", "厳格な基準をクリアした艶さし「佐賀牛」をJA直営の名店で堪能。", "季楽 本店 佐賀"],
        ["Yobuko Live Clear Squid (Ika Ikizukuri)", "呼子名物「イカの活き造り」＆天ぷら", "Kawataro Yobuko / Manbo (Undersea Restaurant)", "河太郎 呼子店／萬坊（海中レストラン・唐津）", "https://www.kawataro.jp/", "★ 3.64", "bus", "🟡 Showa Bus 30 min north of JR Karatsu Stn", "🟡 JR唐津駅から昭和バス約30分（呼子港）", "Crystal-clear sweet squid sashimi sliced minutes after leaving seawater, followed by crisp tempura tentacles.", "透き通る活イカの甘みとコリコリ食感！余ったゲソはサクサク天ぷらに。", "河太郎 呼子"],
        ["Ureshino Onsen Yudofu & Sicilian Rice", "日本三大美肌の湯「嬉野温泉湯どうふ」＆佐賀シシリアンライス", "Sohomoto Yoshyu-ya / Saga Station Dining", "宗庵よこ長（嬉野温泉湯どうふ）", "https://www.asobo-saga.jp/", "★ 3.58", "bus", "🟡 Walkable in Ureshino Onsen (Nishi-Kyushu Shinkansen)", "🟢 西九州新幹線「嬉野温泉駅」・嬉野温泉街", "Alkaline hot-spring water melts local tofu into a creamy soy-milk soup naturally packed with umami.", "嬉野の美肌温泉水で煮込むことでトロトロに溶け出す絶品「温泉湯どうふ」。", "宗庵よこ長 嬉野"]
      ],
      a: [
        ["Nishi-Kyushu & JR", "西九州新幹線・JR", "Nishi-Kyushu Shinkansen (Takeo/Ureshino) & JR Kamome / Karatsu Line", "JR九州 西九州新幹線（武雄温泉・嬉野温泉）＆長崎線・唐津線", "https://www.jrkyushu.co.jp/english/", "Takes ~38 min Hakata→JR Saga; Takeo Onsen connects Nishi-Kyushu Shinkansen toward Nagasaki.", "博多〜佐賀約38分！武雄温泉で西九州新幹線に接続する九州北部交通案内。"]
      ],
      g: [
        ["Official Saga Guide", "佐賀ガイド", "The Official Saga Prefecture Travel Guide (ASOBO SAGA)", "あそぼーさが 佐賀県公式観光情報サイト", "https://www.asobo-saga.jp/", "Arita & Imari Porcelain towns, Yutoku Inari Shrine, Ureshino Onsen, Karatsu Castle & Yoshinogari.", "有田焼・伊万里の窯元、祐徳稲荷神社、嬉野温泉、唐津城・虹の松原ガイド。"]
      ]
    },
    nagasaki: {
      regEn: "Nagasaki", regJa: "長崎県",
      f: [
        ["Nagasaki Champon & Crispy Sara-Udon", "長崎発祥 本場「ちゃんぽん」＆パリパリ「皿うどん」", "Shikairo / Kouzanrou (Chinatown)", "四海樓（大浦天主堂近く）／江山楼（新地中華街）", "https://shikairou.com/", "★ 3.63", "easy", "🟢 2-min walk Tram Oura-Tenshudo / Shinchi Chinatown", "🟢 長崎路面電車「大浦天主堂」「新地中華街」すぐ", "Invented 1899 at Shikairo—rich pork-chicken soup piled with shrimp, squid, pork & sweet cabbage.", "明治32年発祥の名門『四海樓』で味わう本場長崎ちゃんぽん＆皿うどん。", "四海樓 長崎"],
        ["Glazed Castella Honey Sponge Cake & Kakuni-Manju", "長崎伝統 カステラ（福砂屋・文明堂）＆角煮まんじゅう", "Fukusaya Honten / Iwasaki Honpo", "福砂屋 本店／岩崎本舗（長崎中華街）", "https://www.fukusaya.co.jp/", "★ 3.68", "easy", "🟢 Walkable across central Nagasaki & Shianbashi", "🟢 思案橋・新地中華街・長崎駅前すぐ", "Moist hand-mixed sponge cake topped with crunchy zarame sugar crystals & melt-in-mouth braised pork buns.", "ザラメ糖が香ばしい創業1624年・福砂屋カステラとふわふわ角煮まんじゅう。", "福砂屋 長崎本店"],
        ["Sasebo Gourmet Burger & Toruko Rice", "佐世保バーガー＆長崎大人のお子様ランチ「トルコライス」", "Hikari / Big Man (Sasebo) & Tsuru-chan", "ヒカリ／ビッグマン（佐世保）／ツル茶ん（長崎）", "https://www.discover-nagasaki.com/", "★ 3.59", "easy", "🟢 Near JR Sasebo Stn & Nagasaki Hamanomachi", "🟢 思案橋電停すぐ・佐世保市内", "Custom grilled Sasebo burgers alongside Nagasaki's nostalgic trio of pilaf, tonkatsu & curry spaghetti.", "注文後に焼く佐世保バーガーと九州最古の喫茶店『ツル茶ん』のトルコライス。", "ツル茶ん 長崎"]
      ],
      a: [
        ["Nagasaki Tram & Pass", "長崎電気軌道", "Nagasaki Electric Tramway 1-Day Pass & Nishi-Kyushu Shinkansen Map", "長崎電気軌道（路面電車）1日乗車券＆西九州新幹線アクセス", "https://www.naga-den.com/", "Trams run everywhere for flat fares linking JR Nagasaki Stn, Chinatown, Glover Garden & Peace Park.", "路面電車1日券で長崎駅・中華街・グラバー園・平和公園へ快適移動。"]
      ],
      g: [
        ["Discover Nagasaki", "長崎ガイド", "Discover Nagasaki Official Tourism Guide", "ながさき旅ネット 長崎県公式観光サイト", "https://www.discover-nagasaki.com/en", "Glover Garden, Oura Church, Mt. Inasa 10-Million-Dollar Night View, Gunkanjima & Huis Ten Bosch.", "グラバー園・大浦天主堂・稲佐山夜景・軍艦島・ハウステンボス完全案内。"]
      ]
    },
    kumamoto: {
      regEn: "Kumamoto", regJa: "熊本県",
      f: [
        ["Aso Akaushi Don (Seared Red Beef & Onsen Egg Bowl)", "阿蘇名物 あか牛丼（いまきん食堂）", "Imakin Shokudo (Aso Uchinomaki) / Yoka-Yoka", "いまきん食堂（阿蘇内牧）／よかよか（熊本駅）", "https://kumamoto.guide/en/", "★ 3.71", "easy", "🟢 Inside JR Kumamoto Stn (Yoka-Yoka) or Aso", "🟢 JR熊本駅ビル直結（よかよか）・阿蘇内牧", "Lean tender grass-fed Aso cattle seared rare with warm miso sauce and oozing soft egg.", "阿蘇の草原育ち「あか牛」のジューシーレアステーキに温泉卵を絡める大行列丼。", "いまきん食堂 阿蘇"],
        ["Kumamoto Black-Garlic Ma-yu Pork Ramen", "熊本ラーメン（焦がしニンニク黒マー油豚骨）", "Kokutei / Keika Ramen Honten", "熊本ラーメン 黒亭／桂花ラーメン 本店", "https://www.kokutei.co.jp/", "★ 3.67", "easy", "🟢 Branch inside JR Kumamoto Station", "🟢 JR熊本駅ビル内・下通商店街徒歩圏", "Fragrant roasted black garlic oil drizzled over smooth tonkotsu soup & twin golden yolks.", "香ばしい焦がしニンニクの「黒マー油」と卵黄2個が名物の熊本ラーメン老舗。", "黒亭 熊本"],
        ["Premium Basashi (Marbled Horsemeat Sashimi)", "本場 熊本霜降り馬刺し", "Suganoya (Shimotori / JR Kumamoto Stn)", "馬肉料理 菅乃屋（下通店・JR熊本駅店）", "https://service.suganoya.com/", "★ 3.69", "easy", "🟢 Inside JR Kumamoto Station / Torichosuji Tram", "🟢 JR熊本駅構内・熊本市電「通町筋」すぐ", "Sweet marbled kumamoto basashi served with fresh grated ginger, garlic & sweet Kyushu soy.", "熊本県民のご馳走！とろける鮮度抜群の霜降り馬刺しを名門・菅乃屋で。", "菅乃屋 熊本駅"]
      ],
      a: [
        ["Kumamoto Tram & Bus", "熊本市電・産交バス", "Kumamoto City Tram & Sanko Express Bus (Aso / Kurokawa Onsen)", "熊本市電・JR九州＆産交バス（阿蘇・黒川温泉横断バス）", "https://www.kyusanko.co.jp/sankobus/english/", "Trams serve Kumamoto Castle; Sanko Express runs directly between Kumamoto, Aso, Kurokawa & Beppu.", "熊本城路面電車＆阿蘇・黒川温泉〜別府を結ぶ九州横断バス公式サイト。"]
      ],
      g: [
        ["Kumamoto Guide", "熊本ガイド", "Kumamoto Prefecture Official Tourism Guide", "熊本県公式観光サイト もっと、もーっと！くまもっと。", "https://kumamoto.guide/en/", "Kumamoto Castle Skywalk, Suizenji Garden, Mt. Aso Crater, Kusasenri & Kurokawa Onsen.", "熊本城特別見学通路・水前寺成趣園・阿蘇中岳火口・草千里・黒川温泉ガイド。"]
      ]
    },
    oita: {
      regEn: "Oita", regJa: "大分県",
      f: [
        ["Beppu Jigoku-Mushi (98°C Geothermal Steam Cooking)", "別府 鉄輪温泉 地獄蒸し料理", "Jigoku Mushi Kobo Kannawa (Beppu)", "地獄蒸し工房 鉄輪（別府海地獄エリア）", "https://www.city.beppu.oita.jp/", "★ 3.58", "bus", "🟡 20-min Kamenoi Bus #5/#7 from JR Beppu Stn", "🟡 JR別府駅から亀の井バス20分「鉄輪」", "Steam fresh Bungo seafood, pork, sweet potato & eggs in natural 98°C volcanic hot-spring vents.", "天然の温泉噴気で一気に蒸し上げるヘルシーで旨み凝縮の地獄蒸し体験！", "地獄蒸し工房 鉄輪"],
        ["Yufuin Bungo Wagyu Claypot Mabushi", "由布院名物 豊後牛まぶし", "Yufu Mabushi Shin (Yufuin Stn / Kinrinko)", "由布まぶし 心（由布院駅前店・金鱗湖本店）", "https://www.yufuin.gr.jp/", "★ 3.69", "easy", "🟢 1-min walk from JR Yufuin Station", "🟢 JR由布院駅徒歩1分・金鱗湖畔", "Charcoal-seared Oita Bungo Wagyu claypot rice enjoyed plain, with condiments & hot dashi tea.", "炭火焼A5豊後牛の土鍋ひつまぶしを1人1釜ずつ3通りの食べ方で味わう行列店。", "由布まぶし 心 由布院"],
        ["Oita Original Toriten (Citrus Chicken Tempura)", "大分発祥 元祖とり天（かぼすポン酢＆練り辛子）", "Toyotsune Honten / Toyoken (Beppu & Oita)", "とよ常 別府駅前店／元祖とり天 東洋軒", "https://www.toyotsune.com/", "★ 3.65", "easy", "🟢 2-min walk JR Beppu East / Oita", "🟢 JR別府駅東口徒歩2分・別府市内", "Airy crisp chicken breast/thigh tempura dipped in fragrant Oita kabosu citrus soy & mustard.", "ふわふわサクサクの鶏天をかぼすポン酢と和辛子でさっぱり食べる大分名物。", "とよ常 別府"]
      ],
      a: [
        ["Kamenoi Bus & Yufuin", "亀の井バス・ゆふいんの森", "Kamenoi Bus (Beppu Hells 1-Day Pass) & Yufuin-no-Mori Express", "亀の井バス（別府地獄めぐりフリー券）＆JR特急ゆふいんの森", "https://kamenoibus.com/en/", "My Beppu Free 1-Day bus pass covers all 7 Hells, Kannawa, Ropeway & Yufuin hops.", "別府七湯・地獄めぐりから由布院まで便利に巡れる亀の井バス公式サイト。"]
      ],
      g: [
        ["Discover Oita", "大分ガイド", "Discover Oita Official Prefecture Tourism Guide", "日本一のおんせん県おおいた 公式観光サイト", "https://www.discover-oita.com/", "Beppu Seven Hells & Sand Baths, Yufuin Kinrinko Mist, Usa Jingu & Usuki Stone Buddhas.", "別府地獄めぐり・砂湯、由布院湯の坪街道・金鱗湖、宇佐神宮、臼杵石仏案内。"]
      ]
    },
    miyazaki: {
      regEn: "Miyazaki", regJa: "宮崎県",
      f: [
        ["Original Miyazaki Chicken Nanban with Tartar", "宮崎発祥 元祖チキン南蛮（おぐら 本店）", "Ogura Main Shop (Tachibana-dori, Miyazaki)", "おぐら 本店（宮崎市橘通東）", "https://www.kanko-miyazaki.jp/", "★ 3.64", "easy", "🟢 12-min walk from JR Miyazaki Station", "🟢 JR宮崎駅西口から橘通りへ徒歩約12分", "Birthplace of tartar-crowned Chicken Nanban—tender fried chicken soaked in sweet-tangy nanban vinegar.", "全国に広まったタルタルたっぷりチキン南蛮の本家！宮崎旅行では外せない一皿。", "おぐら 本店 宮崎"],
        ["Charcoal Smoldering Jitokko Chicken & Karamen", "宮崎名物 炭火地鶏モモ焼き＆辛麺（こんにゃく麺）", "Maruman Yakitori / Karamenya Masumoto", "丸万焼鳥 本店／元祖辛麺屋 桝元", "https://www.miyazaki-city.tourism.or.jp/", "★ 3.66", "easy", "🟢 Downtown Nishitachi (10 min from Miyazaki Stn)", "🟢 JR宮崎駅から橘通・ニシタチ徒歩圏", "Dramatic black-smoked charcoal free-range Miyazaki chicken paired with spicy garlic-egg ramen.", "真っ黒な見た目に旨みが詰まった名物「もも焼き」と癖になる「宮崎辛麺」。", "丸万焼鳥 宮崎"],
        ["Miyazaki Hiyajiru (Chilled Miso Fish Soup over Rice)", "宮崎郷土料理「冷や汁」＆マンゴースイーツ", "Kura-no-Ya / Fruit Ohno (Miyazaki)", "ふるさと料理 杉の子／フルーツ大野", "https://www.kanko-miyazaki.jp/", "★ 3.57", "easy", "🟢 Near JR Miyazaki Station & Nishitachi", "🟢 宮崎市街・橘通り周辺", "Roasted miso-sesame broth poured icy cold with tofu & cucumber over rice plus luxury Miyazaki mango.", "焼き魚と胡麻味噌出汁をご飯にかける伝統の冷や汁＆極甘・完熟宮崎マンゴーパフェ。", "フルーツ大野 宮崎"]
      ],
      a: [
        ["Miyazaki Bus & JR", "宮崎交通・JR", "Miyazaki Kotsu Visit Miyazaki Bus Pass & JR Nichirin/Kirishima", "宮崎交通 外国人向け周遊バスパス＆JR日豊本線（高千穂・青島）", "https://www.miyakoh.co.jp/english/", "1-Day bus pass connects Miyazaki Airport, Aoshima Shrine, Sun Messe Moai statues & Udo Jingu.", "青島神社・鬼の洗濯板・鵜戸神宮・高千穂方面への宮崎交通公式バス案内。"]
      ],
      g: [
        ["Visit Miyazaki", "宮崎ガイド", "Visit Miyazaki Official Tourism Guide", "みやざき観光情報 旬ナビ 宮崎県公式サイト", "https://www.kanko-miyazaki.jp/en", "Takachiho Mythical Gorge boats, Aoshima Devil's Washboard, Udo Cliff Shrine & Obi Castle Town.", "高千穂峡貸しボート・夜神楽、青島神社、鵜戸神宮、飫肥城下町ガイド。"]
      ]
    },
    kagoshima: {
      regEn: "Kagoshima", regJa: "鹿児島県",
      f: [
        ["Kagoshima Kurobuta (Black Berkshire Pork) Shabu-Shabu & Tonkatsu", "鹿児島最高峰 黒豚しゃぶしゃぶ＆厚切りとんかつ", "Ichiniisan / Ajimori / Kawakyu (Tenmonkan)", "遊食豚彩 いちにいさん／味の六白／川久（鹿児島中央）", "https://ichiniisan.jp/", "★ 3.72", "easy", "🟢 Steps from JR Kagoshima-Chuo / Tenmonkan", "🟢 JR鹿児島中央駅すぐ・天文館周辺", "Tender, sweet Kagoshima black-pork loins swished through rich buckwheat dipping tsuyu or fried golden.", "甘く上質な脂が特徴の本場・黒豚しゃぶしゃぶをそばつゆで味わう鹿児島名店。", "川久 鹿児島"],
        ["Tenmonkan Mujaki Shirokuma Shaved Ice", "天文館むじゃき 元祖「白熊（しろくま）」かき氷", "Tenmonkan Mujaki Main Shop (Kagoshima)", "天文館むじゃき 本店（天文館）", "https://mujyaki.co.jp/", "★ 3.63", "easy", "🟢 2-min walk Tram Tenmonkan-dori Stop", "🟢 鹿児島市電「天文館通」電停徒歩2分", "Mountainous fluffy shaved ice drizzled with homemade condensed milk & fresh tropical fruits.", "自家製ミルクがたっぷり絡む可愛い白くま顔の元祖ふわふわかき氷。", "天文館むじゃき"],
        ["Kagoshima Green-Tea Pork & Sweet Imo-Shochu Satsuma-age", "さつま揚げ（揚立屋）＆薩摩黒牛・鶏飯", "Agetateya Tenmonkan / Kumamoto-ya Ramen", "揚立屋 天文館店／こむらさき・豚とろラーメン", "https://www.kagoshima-kankou.com/for/", "★ 3.59", "easy", "🟢 Central Tenmonkan & Kagoshima-Chuo", "🟢 天文館商店街・JR鹿児島中央駅直結", "Warm freshly fried sweet fishcakes alongside rich Kagoshima pork-cheek torotoro ramen.", "出来たてアツアツのさつま揚げと、とろけるチャーシューの鹿児島豚骨ラーメン。", "豚とろ 鹿児島"]
      ],
      a: [
        ["Kagoshima Tram & Ferry", "市電・桜島フェリー", "Kagoshima City View Bus, Tram & 24h Sakurajima Volcano Ferry", "鹿児島市電・カゴシマシティビュー＆24時間運航・桜島フェリー", "https://www.kotsu-city-kagoshima.jp/", "15-min ferry runs every 15–20 min to Sakurajima Volcano; City View Bus reaches Sengan-en Garden.", "JR鹿児島中央駅から仙巌園・天文館・桜島フェリー（乗船15分）を巡る公式交通案内。"]
      ],
      g: [
        ["Discover Kagoshima", "鹿児島ガイド", "Discover Kagoshima Official Prefecture Travel Portal", "かごしまの旅 鹿児島県公式観光サイト", "https://www.kagoshima-kankou.com/for", "Sakurajima Active Volcano, Sengan-en Garden, Ibusuki Natural Sand Baths, Kirishima & Yakushima.", "桜島・名勝仙巌園・指宿天然砂むし温泉・霧島温泉・屋久島・奄美大島ガイド。"]
      ]
    },
    okinawa: {
      regEn: "Okinawa", regJa: "沖縄県",
      f: [
        ["Okinawa Soba & Melt-in-Mouth Soki Pork", "本場 沖縄そば・ソーキそば", "Shuri Soba / Kishimoto Shokudo / Hamaya", "首里そば／きしもと食堂（本部）／浜屋（北谷）", "https://visitokinawajapan.com/", "★ 3.66", "easy", "🟢 Walkable from Yui Rail Shuri Stn / Motobu", "🟢 ゆいレール「首里駅」徒歩圏・恩納/本部", "Springy wood-ash lye wheat noodles in clear bonito-pork broth topped with tender spare ribs.", "あっさり鰹と豚骨の黄金スープにトロトロ軟骨ソーキがのる沖縄の魂の麺。", "首里そば 那覇"],
        ["Makishi Public Market Seafood & Ryukyu Agu Shabu-Shabu", "第一牧志公設市場 海鮮＆あぐー豚しゃぶしゃぶ", "Makishi Public Market / Matsumoto Naha", "第一牧志公設市場 2F食堂／まつもと（那覇）", "https://www.kousetsu-ichiba.com/", "★ 3.64", "easy", "🟢 4-min walk off Kokusai Dori / Makishi Stn", "🟢 ゆいレール「牧志駅」「県庁前駅」徒歩圏", "Pick colorful coral-reef fish, lobster & giant clams downstairs for instant cooking upstairs!", "1階で買った伊勢海老や夜光貝を2階食堂ですぐ調理してもらえる那覇名物体験。", "第一牧志公設市場 那覇"],
        ["Naha Jack's Steak House & Blue Seal Salt Chinsuko", "那覇老舗 ジャッキーステーキハウス＆ブルーシールアイス", "Jack's Steak House (Naha Nishi) / Blue Seal", "ジャッキーステーキハウス／ブルーシール", "https://www.steak.co.jp/", "★ 3.63", "easy", "🟢 5-min walk from Yui Rail Asahibashi Stn", "🟢 ゆいレール「旭橋駅」より徒歩5分", "Post-war retro American-Okinawan tenderloin steaks sizzled on iron platters beside local Beni-imo & salted Chinsuko gelato.", "1953年創業の沖縄ステーキ定番『ジャッキー』＆ご当地紅イモ・塩ちんすこうアイス。", "ジャッキーステーキハウス 那覇"]
      ],
      a: [
        ["Yui Rail & Shuttle Bus", "ゆいレール・空港バス", "Okinawa Yui Rail Monorail & Yanbaru / Okinawa Airport Shuttle", "沖縄ゆいレール＆やんばる急行バス（那覇〜恩納村〜美ら海水族館）", "https://www.okinawa-shuttle.co.jp/en/", "Direct Airport↔Shuri monorail plus non-stop express coach to Onna-son resorts & Churaumi Aquarium.", "那覇空港〜国際通り・首里へのゆいレールと、美ら海水族館直通バスの公式案内。"]
      ],
      g: [
        ["Visit Okinawa", "沖縄ガイド", "Visit Okinawa Japan Official Prefecture Travel Guide", "おきなわ物語 沖縄県公式観光情報サイト", "https://visitokinawajapan.com/", "Shuri Castle, Kokusai Dori, Churaumi Aquarium, Cape Manzamo, Zamami/Kerama & Yaeyama Islands (Ishigaki/Taketomi).", "首里城・美ら海水族館・万座毛・古宇利島・石垣島川平湾・竹富島完全ガイド。"]
      ]
    }
  };

  window.PREFECTURE_CATALOGS = {};
  Object.keys(SPECS).forEach(prefId => {
    const s = SPECS[prefId];
    window.PREFECTURE_CATALOGS[prefId] = expandPack(prefId, prefId, s.regEn, s.regJa, s);
  });
})();
