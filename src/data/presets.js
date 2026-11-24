// Complete 7-Preset Bilingual Regional Catalog (100% Genuine EN & JA + Dynamically Aligned Dates)

window.PRESET_CATALOG_META = [
  { id: "tohoku22", seasonEn: "Autumn", seasonJa: "秋", days: 22, labelEn: "[Autumn] Tohoku, Nikko & Tokyo (22 days)", labelJa: "[秋] 東北・日光・東京 (22日間)" },
  { id: "hokuriku8", seasonEn: "Winter", seasonJa: "冬", days: 8, labelEn: "[Winter] Hokuriku: Tokyo, Kanazawa, Shirakawa-go, Takayama & Kaga Onsen (8 days)", labelJa: "[冬] 北陸・飛騨：東京・金沢・白川郷・五箇山・高山・加賀温泉 (8日間)" },
  { id: "hokkaido7", seasonEn: "Summer", seasonJa: "夏", days: 7, labelEn: "[Summer] Hokkaido Only: Sapporo, Otaru, Furano, Noboribetsu Onsen & Hakodate (7 days)", labelJa: "[夏] 北海道のみ：札幌・小樽・富良野・登別温泉・函館 (7日間)" },
  { id: "kyushu8", seasonEn: "Spring", seasonJa: "春", days: 8, labelEn: "[Spring] Kyushu Only & Hot Springs: Fukuoka, Beppu, Yufuin, Kurokawa Onsen & Kumamoto (8 days)", labelJa: "[春] 九州のみ＆名湯巡り：福岡・別府・由布院・黒川温泉・熊本 (8日間)" },
  { id: "kansaiHiroshima8", seasonEn: "Autumn", seasonJa: "秋", days: 8, labelEn: "[Autumn] Kyoto-Osaka-Kobe-Hiroshima (8 days)", labelJa: "[秋] 京都・大阪・神戸・広島 (8日間)" },
  { id: "okinawa7", seasonEn: "Summer", seasonJa: "夏", days: 7, labelEn: "[Summer] Okinawa Island (7 days)", labelJa: "[夏] 沖縄アイランド周遊（本島＆石垣・竹富島）(7日間)" },
  { id: "goldenRoute", seasonEn: "Autumn", seasonJa: "秋", days: 10, labelEn: "[Autumn] Golden Route: Tokyo, Mt. Fuji, Kyoto & Osaka (10 days)", labelJa: "[秋] ゴールデンルート：東京・富士山・京都・大阪 (10日間)" }
];

(function() {
  const DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];

  function addDaysYmd(baseYmd, offset) {
    const p = String(baseYmd).split("-").map(Number);
    const dt = new Date(p[0], (p[1] || 1) - 1, (p[2] || 1) + offset);
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return { ymd: `${y}-${m}-${d}`, dowIdx: dt.getDay() };
  }

  function buildBilingualDays(startDate, specs) {
    const enDays = [];
    const jaDays = [];
    specs.forEach((s, i) => {
      const info = addDaysYmd(startDate, i);
      const common = {
        day: i + 1,
        date: info.ymd,
        stay: s.stay || 0,
        travelBase: s.travelBase || 0,
        travelActualAdd: s.travelActualAdd || 0,
        fun: s.fun || 0,
        hotelUrl: s.hotelUrl || "",
        passCovered: !!s.passCovered,
        needsAttention: !!s.needsAttention,
        jrOnly: s.jrOnly || 0,
        totalAllLegs: s.totalAllLegs != null ? s.totalAllLegs : (s.jrOnly || 0)
      };
      enDays.push(Object.assign({}, common, {
        dow: DOW_EN[info.dowIdx],
        region: s.regEn,
        routeJp: s.titleEn,
        routeEn: s.subEn,
        hotel: s.hotelEn,
        legs: s.legsEn.slice(),
        tip: s.tipEn
      }));
      jaDays.push(Object.assign({}, common, {
        dow: DOW_JA[info.dowIdx],
        region: s.regJa,
        routeJp: s.titleJa,
        routeEn: s.subJa,
        hotel: s.hotelJa,
        legs: s.legsJa.slice(),
        tip: s.tipJa
      }));
    });
    return { enDays, jaDays };
  }

  function buildBilingualHotels(startDate, specs) {
    const enHotels = [];
    const jaHotels = [];
    specs.forEach((h, idx) => {
      const ci = addDaysYmd(startDate, h.startDay - 1).ymd;
      const co = h.splitNoteEn ? `${addDaysYmd(startDate, h.startDay - 1 + (h.firstSpan || h.nights)).ymd} (${h.splitNoteEn})` : addDaysYmd(startDate, h.startDay - 1 + h.nights).ymd;
      const coJa = h.splitNoteJa ? `${addDaysYmd(startDate, h.startDay - 1 + (h.firstSpan || h.nights)).ymd}（${h.splitNoteJa}）` : addDaysYmd(startDate, h.startDay - 1 + h.nights).ymd;
      const total = h.nights * h.rate;
      const base = {
        order: idx + 1,
        nights: h.nights,
        perNightJpy: h.rate,
        totalJpy: total,
        url: h.url || "",
        luxury: !!h.luxury,
        startDayOffset: h.startDay - 1
      };
      enHotels.push(Object.assign({}, base, {
        name: h.nameEn, region: h.regEn, checkIn: ci, checkOut: co,
        access: h.accEn, highlights: h.hiEn, bookingNote: h.noteEn || ""
      }));
      jaHotels.push(Object.assign({}, base, {
        name: h.nameJa, region: h.regJa, checkIn: ci, checkOut: coJa,
        access: h.accJa, highlights: h.hiJa, bookingNote: h.noteJa || ""
      }));
    });
    return { enHotels, jaHotels };
  }

  function buildPrep(customItems) {
    const baseEn = [
      { id: "p1", title: "Complete Visit Japan Web (Immigration & Customs QR)", sub: "Register flights and hotel details before departure" },
      { id: "p2", title: "Prepare IC Card (Suica / PASMO / ICOCA) or Apple Wallet Suica", sub: "Load ¥3,000–¥5,000 for effortless metro, bus, and convenience store payments" },
      { id: "p3", title: "Confirm Hotel Check-in Times & Luggage Forwarding", sub: "Contact ryokans at least 3 days ahead if using station pickup shuttles" },
      { id: "p4", title: "Save Official City Metro & Bus PDF Maps (Tab 7)", sub: "Keep offline PDF route maps ready on your phone" }
    ];
    const baseJa = [
      { id: "p1", title: "Visit Japan Web 登録（入国審査・税関QR）", sub: "出発前にフライト・宿泊先情報を登録" },
      { id: "p2", title: "交通系ICカード（Suica / PASMO / ICOCA）準備", sub: "地下鉄・路線バス用に事前チャージ（モバイルSuicaも便利）" },
      { id: "p3", title: "宿泊ホテル・旅館のチェックイン時刻＆送迎予約確認", sub: "送迎バス利用時は宿泊3日前までに要連絡" },
      { id: "p4", title: "主要都市の公式地下鉄・バス路線図PDF（タブ7）を保存", sub: "スマホに公式路線図PDFを保存しておくと現地移動が快適" }
    ];
    if (customItems) {
      return { en: customItems.en.concat(baseEn), ja: customItems.ja.concat(baseJa) };
    }
    return { en: baseEn, ja: baseJa };
  }

  window.PRESET_HELPERS = {
    addDaysYmd,
    buildBilingualDays,
    buildBilingualHotels,
    buildPrep
  };

  window.buildBlankTripPayload = function(opts) {
    const o = opts || {};
    const start = /^\d{4}-\d{2}-\d{2}$/.test(String(o.startDate || "").trim()) ? String(o.startDate).trim() : "2027-04-01";
    const daysCount = Math.max(1, Math.min(60, parseInt(o.daysCount, 10) || 7));
    const descEn = String(o.titleEn || "").trim() || "Custom Japan Itinerary";
    const descJa = String(o.titleJa || "").trim() || (o.titleEn ? descEn : "カスタム日本旅行プラン");
    const costMode = o.costMode === "estimate" ? "estimate" : "blank";
    const emptySlots = o.emptySlots !== false;

    const wizardList = Array.isArray(window.WIZARD_CITIES) ? window.WIZARD_CITIES : [];
    const resolveCityMeta = (raw) => {
      const q = String(raw || "").trim();
      const found = wizardList.find(c =>
        c.key.toLowerCase() === q.toLowerCase() ||
        c.regEn.toLowerCase() === q.toLowerCase() ||
        c.regJa === q
      );
      if (found) return found;
      return {
        key: q || "Tokyo",
        regEn: q || "Tokyo",
        regJa: q || "東京",
        hotelEn: `${q || "Custom"} Hotel`,
        hotelJa: `${q || "カスタム"} ホテル`,
        foodKeys: ["Tokyo"],
        accessKeys: ["Tokyo"],
        guideKeys: ["Tokyo"]
      };
    };

    const rawCities = Array.isArray(o.cities) && o.cities.length > 0 ? o.cities : ["Tokyo"];
    const maxCityBlocks = daysCount > 1 ? Math.min(rawCities.length, daysCount - 1) : 1;
    const selectedCities = rawCities.slice(0, maxCityBlocks).map(resolveCityMeta);

    const nightsTotal = Math.max(0, daysCount - 1);
    const dayCityList = [];
    const hotelBlocks = [];

    if (daysCount === 1) {
      dayCityList.push({ city: selectedCities[0], isBlockStart: false, prevCity: null });
    } else {
      const baseN = Math.floor(nightsTotal / selectedCities.length);
      const remN = nightsTotal % selectedCities.length;
      let cursorDay = 1;
      selectedCities.forEach((city, idx) => {
        const n = baseN + (idx < remN ? 1 : 0);
        const prev = idx > 0 ? selectedCities[idx - 1] : null;
        hotelBlocks.push({
          startDay: cursorDay,
          nights: n,
          rate: costMode === "estimate" ? 12000 : 0,
          nameEn: city.hotelEn,
          nameJa: city.hotelJa,
          regEn: city.regEn,
          regJa: city.regJa,
          url: "",
          accEn: `Near main station (${city.regEn})`,
          accJa: `主要駅周辺（${city.regJa}）`,
          hiEn: "Edit hotel name, rate, booking ref & official URL anytime.",
          hiJa: "ホテル名・料金・予約番号・公式URLを自由に編集できます。"
        });
        for (let k = 0; k < n; k++) {
          dayCityList.push({ city, isBlockStart: k === 0 && idx > 0, prevCity: prev });
        }
        cursorDay += n;
      });
      const lastCity = selectedCities[selectedCities.length - 1];
      dayCityList.push({ city: lastCity, isBlockStart: false, prevCity: null });
    }

    const specs = [];
    for (let i = 0; i < daysCount; i++) {
      const entry = dayCityList[i] || { city: selectedCities[0], isBlockStart: false, prevCity: null };
      const city = entry.city;
      const isFirst = i === 0;
      const isLast = i === daysCount - 1;
      const isTransfer = entry.isBlockStart && entry.prevCity;

      let titleEn, titleJa;
      if (isFirst && daysCount === 1) {
        titleEn = `${city.regEn}: Arrival & Day Exploration`;
        titleJa = `${city.regJa}：到着＆日帰り観光`;
      } else if (isFirst) {
        titleEn = `Arrive Japan → ${city.regEn} Check-In & Exploration`;
        titleJa = `到着 → ${city.regJa} チェックイン＆散策`;
      } else if (isLast) {
        titleEn = `${city.regEn}: Final Morning → Airport Departure`;
        titleJa = `${city.regJa}：最終ショッピング → 空港出発帰国`;
      } else if (isTransfer) {
        titleEn = `${entry.prevCity.regEn} → ${city.regEn} Transit & Sightseeing`;
        titleJa = `${entry.prevCity.regJa} → ${city.regJa} 移動＆観光`;
      } else {
        titleEn = `${city.regEn} Exploration & Dining`;
        titleJa = `${city.regJa} 終日観光＆ご当地グルメ`;
      }

      let stay = 0, travelBase = 0, fun = 0, jrOnly = 0, totalAllLegs = 0;
      let legsEn = [], legsJa = [];
      if (costMode === "estimate") {
        stay = isLast ? 0 : 12000;
        fun = 9000;
        if (isFirst || isLast) {
          travelBase = 45000;
          jrOnly = 1500;
          totalAllLegs = 1500;
        } else if (isTransfer) {
          travelBase = 5000;
          jrOnly = 5000;
          totalAllLegs = 5000;
          legsEn = [`${entry.prevCity.regEn} → ${city.regEn} Transit (¥5,000 est.)`];
          legsJa = [`${entry.prevCity.regJa} → ${city.regJa} 鉄道移動（約¥5,000）`];
        } else {
          travelBase = 1500;
          jrOnly = 1500;
          totalAllLegs = 1500;
        }
      }

      specs.push({
        regEn: city.regEn,
        regJa: city.regJa,
        titleEn,
        titleJa,
        subEn: isLast ? "Check out, last-minute shopping & airport transfer" : "Edit daily highlight, budget & time slots inline",
        subJa: isLast ? "チェックアウト・お土産購入・空港アクセス" : "スケジュール・金額・時間帯をこの画面から直接編集できます",
        stay,
        travelBase,
        travelActualAdd: 0,
        fun,
        hotelEn: isLast ? "Departure Day" : city.hotelEn,
        hotelJa: isLast ? "帰国・出発日" : city.hotelJa,
        hotelUrl: "",
        jrOnly,
        totalAllLegs,
        legsEn,
        legsJa,
        tipEn: "Edit Region or Route above to update the Map, then click Sync Guides & Gourmet for regional recommendations.",
        tipJa: "エリア・ルートを変更すると全国マップが連動します。ガイド・グルメタブの自動取得も利用できます。"
      });
    }

    const { enDays, jaDays } = buildBilingualDays(start, specs);
    if (emptySlots) {
      enDays.forEach(d => { d.timeSlots = []; });
      jaDays.forEach(d => { d.timeSlots = []; });
    }

    const { enHotels, jaHotels } = hotelBlocks.length > 0
      ? buildBilingualHotels(start, hotelBlocks)
      : { enHotels: [], jaHotels: [] };

    const foodKeys = Array.from(new Set(selectedCities.flatMap(c => c.foodKeys || ["Tokyo"])));
    const accessKeys = Array.from(new Set(selectedCities.flatMap(c => c.accessKeys || ["Tokyo"])));
    const guideKeys = Array.from(new Set(selectedCities.flatMap(c => c.guideKeys || ["Tokyo"])));
    const gList = window.buildGourmetListFromLocations(foodKeys);
    const aList = window.buildAccessListFromKeys(accessKeys);
    const gdList = window.buildGuidesListFromKeys(guideKeys);
    const prep = buildPrep();
    const cityTrail = selectedCities.map(c => c.regEn).join(" → ");
    const cityTrailJa = selectedCities.map(c => c.regJa).join(" → ");

    return {
      id: "__draft__",
      startDate: start,
      endDate: addDaysYmd(start, daysCount - 1).ymd,
      titleEn: descEn,
      titleJa: descJa,
      subtitleEn: `Custom ${daysCount}-day route (${cityTrail}) • Built in New Trip Wizard`,
      subtitleJa: `カスタム${daysCount}日間プラン（${cityTrailJa}）• 自由に編集可能`,
      selectedPassId: "none",
      passStartDay: 1,
      dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
      dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
    };
  };

  window.getPresetPayload = function(presetKey) {
    if (presetKey === "tohoku22") {
      return {
        id: "tohoku22",
        startDate: "2026-10-21",
        endDate: "2026-11-11",
        titleEn: "Japan Autumn Foliage 2026: Tohoku, Nikko & Tokyo",
        titleJa: "日本紅葉紀行 2026：東北・日光・東京",
        subtitleEn: "Wed, Oct 21 – Wed, Nov 11, 2026 • 7 Base Hotels (21 Nights) • 10-Day JR East Pass Optimizer",
        subtitleJa: "2026年10月21日(水)〜11月11日(水) • 全7拠点21泊 • JR EAST PASS 10日間シミュレーター",
        selectedPassId: "jreast10",
        passStartDay: 3,
        dataEn: JSON.parse(JSON.stringify(window.DATA_EN)),
        dataJa: JSON.parse(JSON.stringify(window.DATA_JA))
      };
    }

    if (presetKey === "okinawa7") {
      const start = "2026-07-05";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Okinawa", regJa: "沖縄本島",
          titleEn: "Arrive Naha Airport (OKA) → Kokusai Dori & Tsuboya Pottery Street",
          titleJa: "那覇空港（OKA）到着 → 国際通り・牧志公設市場・壺屋やちむん通り",
          subEn: "Yui Rail monorail to downtown Naha, Makishi Public Market seafood & Okinawa Soba dinner",
          subJa: "ゆいレールで那覇中心部へ移動し、牧志公設市場や壺屋やちむん通りを散策",
          stay: 14500, travelBase: 42000, travelActualAdd: 700, fun: 9500,
          hotelEn: "Hotel Collective Naha", hotelJa: "ホテルコレクティブ（那覇・国際通り）",
          hotelUrl: "https://hotelcollective.jp/en/", jrOnly: 0, totalAllLegs: 700,
          legsEn: ["International / Tokyo ✈️ Naha Airport (¥42,000)", "Yui Rail 48h Pass / Airport → Kenchomae (¥700 • Non-JR)"],
          legsJa: ["航空券 → 那覇空港（¥42,000）", "ゆいレール 那覇空港 → 県庁前（¥700 • JR以外）"],
          tipEn: "Pick up a Yui Rail 48-Hour Pass at Naha Airport Station and enjoy sea grapes & Okinawa Soba on Kokusai Dori.",
          tipJa: "那覇空港駅でゆいレール乗車券やSuicaを活用。国際通り・壺屋周辺で本場沖縄そばを満喫！"
        },
        {
          regEn: "Okinawa", regJa: "沖縄本島",
          titleEn: "Naha: Shuri Castle Park, Sefa-utaki / Gyokusendo Cave & Senagajima Sunset",
          titleJa: "那覇・首里城公園 → 南部（斎場御嶽・玉泉洞）＆瀬長島ウミカジテラス夕日",
          subEn: "Ryukyu Kingdom heritage at Shuri Castle, southern coastal drive/bus & oceanfront sunset cafes",
          subJa: "首里城公園で琉球王国の歴史を巡り、南部観光と瀬長島ウミカジテラスのサンセットへ",
          stay: 14500, travelBase: 0, travelActualAdd: 2500, fun: 11500,
          hotelEn: "Hotel Collective Naha", hotelJa: "ホテルコレクティブ（那覇・国際通り）",
          hotelUrl: "https://hotelcollective.jp/en/", jrOnly: 0, totalAllLegs: 2500,
          legsEn: ["Yui Rail (Naha ↔ Shuri) + Bus/Taxi to Southern Okinawa & Senagajima (¥2,500 • Non-JR)"],
          legsJa: ["ゆいレール（県庁前↔首里）＋ 路線バス/レンタカーで南部・瀬長島（¥2,500 • JR以外）"],
          tipEn: "Book morning entry to Shuri Castle reconstruction site and catch golden hour facing Naha Runway at Senagajima Umikaji Terrace.",
          tipJa: "午前は首里城、午後は玉泉洞や斎場御嶽を巡り、夕方は那覇空港滑走路を望む瀬長島で休憩。"
        },
        {
          regEn: "Okinawa", regJa: "沖縄本島",
          titleEn: "Naha → Onna-son West Coast: Cape Manzamo & Cape Maeda (Blue Cave)",
          titleJa: "那覇 → 恩納村西海岸：万座毛＆真栄田岬「青の洞窟」シュノーケリング",
          subEn: "Express bus or rental car north to emerald West Coast resort beaches & Agu pork dinner",
          subJa: "やんばる急行バスまたはレンタカーで恩納村へ北上し、絶景ビーチ＆アグー豚しゃぶしゃぶ",
          stay: 25000, travelBase: 4500, travelActualAdd: 1200, fun: 14500,
          hotelEn: "Kafuu Resort Fuchaku Condo Hotel (Onna-son)", hotelJa: "カフー リゾート フチャク コンド・ホテル（恩納村）",
          hotelUrl: "https://www.kafuu-okinawa.jp/en/", jrOnly: 0, totalAllLegs: 5700,
          legsEn: ["Naha → Onna-son (Okinawa Airport Shuttle / Rental Car ¥4,500)", "Local Beach Shuttle / Cape Manzamo Entry (¥1,200)"],
          legsJa: ["那覇 → 恩納村（沖縄エアポートシャトル / レンタカー ¥4,500）", "恩納村内移動・万座毛周辺（¥1,200）"],
          tipEn: "Reserve a morning Blue Cave snorkeling slot at Cape Maeda when ocean visibility is clearest, and try Agu pork shabu-shabu for dinner.",
          tipJa: "青の洞窟シュノーケリングは午前中が透明度抜群！夜は恩納村でブランド豚アグーしゃぶしゃぶを。"
        },
        {
          regEn: "Okinawa", regJa: "沖縄本島",
          titleEn: "Onna-son → Okinawa Churaumi Aquarium, Bise Fukugi Trees & Kouri Bridge → Naha",
          titleJa: "恩納村 → 沖縄美ら海水族館・備瀬フクギ並木・古宇利大橋 → 那覇へ戻る",
          subEn: "Visit the giant Kuroshio Sea whale shark tank, emerald Kouri Bridge & return to Naha",
          subJa: "ジンベエザメの黒潮大水槽・フクギ並木の木陰散策・古宇利島ドライブ後、那覇へ戻る",
          stay: 14500, travelBase: 4000, travelActualAdd: 800, fun: 12500,
          hotelEn: "Hotel Collective Naha", hotelJa: "ホテルコレクティブ（那覇・国際通り）",
          hotelUrl: "https://hotelcollective.jp/en/", jrOnly: 0, totalAllLegs: 4800,
          legsEn: ["Onna-son ↔ Churaumi Aquarium ↔ Kouri Bridge → Naha (Bus / Car ¥4,000)", "Churaumi & Local Parking/Transit (¥800)"],
          legsJa: ["恩納村 ↔ 美ら海水族館・古宇利島 → 那覇（急行バス / レンタカー ¥4,000）", "駐車場・現地交通（¥800）"],
          tipEn: "Arrive at Churaumi Aquarium right at 08:30 opening for crowd-free whale shark photos, then stroll shaded Bise Fukugi Tree Road.",
          tipJa: "美ら海水族館は8:30開館直後が空いていて快適！隣接する備瀬のフクギ並木と古宇利大橋も必見。"
        },
        {
          regEn: "Ishigaki", regJa: "石垣・八重山",
          titleEn: "Naha (OKA) ✈️ Ishigaki Island (ISG) → Kabira Bay & Ishigaki Beef Dinner",
          titleJa: "那覇空港（OKA）✈️ 石垣島（ISG）→ 川平湾グラスボート＆石垣牛焼肉",
          subEn: "55-minute island flight south to Yaeyama, glass-bottom boat at emerald Kabira Bay & sunset point",
          subJa: "国内線約55分で八重山諸島へ。ミシュラン三ツ星・川平湾のグラスボートと名蔵湾サンセット",
          stay: 21000, travelBase: 16500, travelActualAdd: 1600, fun: 15000,
          hotelEn: "Art Hotel Ishigakijima", hotelJa: "アートホテル石垣島",
          hotelUrl: "https://www.art-ishigakijima.com/en/", jrOnly: 0, totalAllLegs: 18100,
          legsEn: ["Naha (OKA) ✈️ Ishigaki (ISG) Domestic Flight (¥16,500)", "Ishigaki Airport ↔ Port / Kabira Bay Bus (¥1,600 • Non-JR)"],
          legsJa: ["那覇空港 ✈️ 石垣空港（国内線 ¥16,500）", "石垣空港〜市街・川平湾 路線バス（¥1,600 • JR以外）"],
          tipEn: "Reserve Sumibi Yakiniku Yamamoto or Hitoshi Izakaya weeks ahead—tables fill up every evening in July!",
          tipJa: "石垣島の人気店「炭火焼肉やまもと」「まぐろ専門居酒屋ひとし」は数週間前の事前予約が必須！"
        },
        {
          regEn: "Ishigaki", regJa: "石垣・八重山",
          titleEn: "Ishigaki ↔ Taketomi Island Day Trip (Water Buffalo Cart, Cycling & Star Sand Beach)",
          titleJa: "石垣島 ↔ 竹富島日帰り船旅（水牛車・赤瓦集落サイクリング・コンドイ浜・星砂の浜）",
          subEn: "10-minute high-speed ferry from Ishigaki Port to preserved Ryukyu red-tile village & coral beaches",
          subJa: "石垣港から高速船でわずか10分！伝統的な赤瓦集落と遠浅の白砂ビーチをレンタサイクルで満喫",
          stay: 21000, travelBase: 0, travelActualAdd: 2600, fun: 12000,
          hotelEn: "Art Hotel Ishigakijima", hotelJa: "アートホテル石垣島",
          hotelUrl: "https://www.art-ishigakijima.com/en/", jrOnly: 0, totalAllLegs: 2600,
          legsEn: ["Ishigaki Port ↔ Taketomi Island Round-Trip High-Speed Ferry (¥1,700 • Non-JR)", "Taketomi Rental Bicycle / Port Shuttle (¥900)"],
          legsJa: ["石垣港離島ターミナル ↔ 竹富島 高速船往復（¥1,700 • JR以外）", "竹富島レンタサイクル・送迎（¥900）"],
          tipEn: "Take the 08:30–09:00 ferry to Taketomi before day-trip crowds peak, cycle past bougainvillea walls to Kondoi Beach, and try Yaeyama Soba at Takenoko.",
          tipJa: "午前9時頃の高速船で竹富島へ渡り、涼しいうちに水牛車＆コンドイ浜を巡るのがおすすめ！"
        },
        {
          regEn: "Ishigaki", regJa: "石垣・八重山",
          titleEn: "Ishigaki Mirumiru Gelato & Euglena Mall → Ishigaki (ISG) ✈️ Return Departure",
          titleJa: "石垣島 ユーグレナモール土産＆ミルミル本舗 → 石垣空港（ISG）✈️ 帰路へ",
          subEn: "Pick up Ishigaki island salt, brown sugar & pineapple sweets before airport bus to ISG",
          subJa: "ユーグレナモールでお土産（石垣の塩・紅芋・島胡椒）を購入し、石垣空港から帰路へ",
          stay: 0, travelBase: 44000, travelActualAdd: 540, fun: 9000,
          hotelEn: "Departure Day (Ishigaki Airport)", hotelJa: "帰国・出発日（石垣空港）",
          hotelUrl: "", jrOnly: 0, totalAllLegs: 540,
          legsEn: ["Ishigaki City → Ishigaki Airport Bus (¥540 • Non-JR)", "Ishigaki (ISG) ✈️ Naha/Tokyo & International Return (¥44,000)"],
          legsJa: ["石垣市街 → 石垣空港 路線バス（¥540 • JR以外）", "石垣空港 ✈️ 那覇・東京経由 帰国便（¥44,000）"],
          tipEn: "Note: Okinawa has no JR lines (only Yui Rail monorail, buses, ferries & domestic flights), so no JR Rail Pass is needed!",
          tipJa: "沖縄にはJR線がないためJRパスは不要です（ゆいレール・高速船・路線バス＋国内線利用）。"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 2, rate: 14500, nameEn: "Hotel Collective Naha (Arrival Nights 1–2)", nameJa: "ホテルコレクティブ（那覇・到着2泊）", regEn: "Okinawa", regJa: "沖縄本島", url: "https://hotelcollective.jp/en/", accEn: "Right on Kokusai Dori (5-min walk from Kenchomae Monorail)", accJa: "国際通り沿い（ゆいレール県庁前駅 徒歩5分）", hiEn: "Spacious central Naha hotel with outdoor pool, steps from Makishi Market & Tsuboya.", hiJa: "国際通りの中心に位置し、屋外プール完備・公設市場ややちむん通りも徒歩圏。" },
        { startDay: 3, nights: 1, rate: 25000, nameEn: "Kafuu Resort Fuchaku Condo Hotel (Onna-son)", nameJa: "カフー リゾート フチャク コンド・ホテル（恩納村）", regEn: "Okinawa", regJa: "沖縄本島", url: "https://www.kafuu-okinawa.jp/en/", accEn: "Onna-son West Coast (Okinawa Airport Shuttle stops directly)", accJa: "恩納村西海岸（沖縄エアポートシャトル停車）", hiEn: "Ocean-view suite resort ideally placed between Blue Cave and Churaumi Aquarium.", hiJa: "全室オーシャンビュー！青の洞窟と美ら海水族館の中間に位置する人気リゾート。", luxury: true },
        { startDay: 4, nights: 1, rate: 14500, nameEn: "Hotel Collective Naha (Pre-Flight Night 4)", nameJa: "ホテルコレクティブ（那覇・離島前泊）", regEn: "Okinawa", regJa: "沖縄本島", url: "https://hotelcollective.jp/en/", accEn: "15 min via Yui Rail to Naha Airport Domestic Terminal", accJa: "那覇空港までゆいレールで約15分", hiEn: "Convenient city night before morning flight to Ishigaki Island.", hiJa: "翌朝の石垣島フライトに備えた那覇市街ベース。" },
        { startDay: 5, nights: 2, rate: 21000, nameEn: "Art Hotel Ishigakijima", nameJa: "アートホテル石垣島", regEn: "Ishigaki", regJa: "石垣・八重山", url: "https://www.art-ishigakijima.com/en/", accEn: "25 min from Ishigaki Airport / 6 min taxi to Ishigaki Port Terminal", accJa: "石垣空港から車で約25分／離島ターミナルへ車6分", hiEn: "Resort hotel with panoramic Yaeyama island ocean views and large garden pool.", hiJa: "八重山の離島を見渡す高台リゾート。広々プールと大浴場完備で竹富島観光の拠点に最適。", luxury: true }
      ]);
      const gList = window.buildGourmetListFromLocations(["Okinawa", "Ishigaki"]);
      const aList = window.buildAccessListFromKeys(["Okinawa"]);
      const gdList = window.buildGuidesListFromKeys(["Okinawa", "Ishigaki"]);
      const prep = buildPrep({
        en: [
          { id: "ok1", title: "Book Naha ✈️ Ishigaki Domestic Flights & Taketomi Ferry", sub: "Book ANA/JTA early saver fares (OKA–ISG) and reserve An'ei Kanko ferry online" },
          { id: "ok2", title: "Arrange Rental Car + International Driving Permit (or Express Bus)", sub: "IDP (1949 Geneva Convention) required to drive in Okinawa; Yanbaru Bus works car-free" },
          { id: "ok3", title: "Reserve Ishigaki Beef Dinner (Yamamoto / Hitoshi) & Blue Cave Tour", sub: "Popular Ishigaki restaurants book out 2–4 weeks ahead in summer" },
          { id: "ok4", title: "Pack Reef-Safe Sunscreen, Rash Guard & Typhoon Weather Backup Plan", sub: "Summer UV is intense; monitor JMA typhoon forecasts 5 days ahead" }
        ],
        ja: [
          { id: "ok1", title: "那覇 ✈️ 石垣島 国内線＆竹富島高速船を予約", sub: "ANA・JTA早割航空券と安栄観光フェリー事前予約" },
          { id: "ok2", title: "レンタカー予約（またはやんばる急行バス・エアポートシャトル確認）", sub: "恩納村・美ら海・石垣島はレンタカーまたは直通バス利用が効率的" },
          { id: "ok3", title: "石垣牛焼肉（やまもと）・居酒屋ひとし・青の洞窟ツアー予約", sub: "夏季の石垣島人気店は2〜4週間前の事前予約推奨" },
          { id: "ok4", title: "サンゴに優しい日焼け止め・ラッシュガード・台風対策保険", sub: "夏の沖縄は紫外線が強烈。気象庁台風情報も出発前に確認" }
        ]
      });
      return {
        id: "okinawa7",
        startDate: start,
        endDate: addDaysYmd(start, 6).ymd,
        titleEn: "Okinawa Island Hopping: Main Island & Ishigaki / Taketomi",
        titleJa: "沖縄アイランド周遊：沖縄本島＆石垣島・竹富島",
        subtitleEn: "4 Days Okinawa Main Island (Naha, Onna-son, Churaumi) + 3 Days Yaeyama (Ishigaki & Taketomi)",
        subtitleJa: "沖縄本島4日間（那覇・恩納村・美ら海）＋ 八重山諸島3日間（石垣島・竹富島）",
        selectedPassId: "none",
        passStartDay: 1,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    if (presetKey === "hokuriku8") {
      const start = "2026-12-10";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Tokyo", regJa: "東京",
          titleEn: "Arrive in Tokyo (Haneda / Narita) → Tokyo Station & Marunouchi Winter Illumination",
          titleJa: "東京到着（羽田/成田）→ 東京駅・丸の内イルミネーション",
          subEn: "Check in beside Tokyo Station for seamless morning Shinkansen departure to Hokuriku",
          subJa: "東京駅直結の拠点にチェックインし、丸の内仲通りの冬イルミネーション散策",
          stay: 18000, travelBase: 48000, travelActualAdd: 0, fun: 9000,
          hotelEn: "Hotel Metropolitan Tokyo Marunouchi", hotelJa: "ホテルメトロポリタン丸の内",
          hotelUrl: "https://tokyo-marunouchi.hotel-metropolitan.com/", jrOnly: 3070, totalAllLegs: 3070,
          legsEn: ["Airport → Tokyo Station (N'EX / Monorail ¥3,070 + Flight)"],
          legsJa: ["空港 → 東京駅（成田エクスプレス / モノレール ¥3,070 ＋ 航空券）"],
          tipEn: "Pick up your Hokuriku Arch Pass or reserved Shinkansen seats at JR East Travel Service Center in Tokyo Station.",
          tipJa: "東京駅のJR東日本トラベルサービスセンターで北陸新幹線・パスを引換しておきましょう。"
        },
        {
          regEn: "Chubu", regJa: "金沢・北陸",
          titleEn: "Tokyo → Kanazawa (Kenrokuen Garden Yukitsuri & Kanazawa Castle)",
          titleJa: "東京 → 金沢（日本三名園・兼六園の雪吊り＆金沢城公園）",
          subEn: "Hokuriku Shinkansen Kagayaki (2.5 hrs direct) to Kanazawa, winter pine rope-umbrellas",
          subJa: "北陸新幹線「かがやき」（約2.5時間）で金沢へ。冬の風物詩・兼六園の雪吊りを鑑賞",
          stay: 15500, travelBase: 14380, travelActualAdd: 0, fun: 10000,
          hotelEn: "Hotel Nikko Kanazawa", hotelJa: "ホテル日航金沢",
          hotelUrl: "https://www.hnkanazawa.jp/en/", passCovered: true, jrOnly: 14380, totalAllLegs: 14380,
          legsEn: ["Tokyo → Kanazawa (Hokuriku Shinkansen ¥14,380)"],
          legsJa: ["東京 → 金沢（北陸新幹線かがやき ¥14,380）"],
          tipEn: "Admire iconic Yukitsuri snow-protecting pine ropes in Kenrokuen Garden and dine on Kanazawa Oden inside Kanazawa Station.",
          tipJa: "兼六園の雪吊り散策の後は、金沢駅「黒百合」などで出汁が染みた金沢おでんを。"
        },
        {
          regEn: "Chubu", regJa: "金沢・北陸",
          titleEn: "Kanazawa: Omicho Seafood Market, Higashi Chaya & Nagamachi Samurai Quarter",
          titleJa: "金沢終日観光：近江町市場・ひがし茶屋街・長町武家屋敷跡",
          subEn: "Snow crab & nodoguro bowls, gold-leaf soft serve & historic geisha district via Loop Bus",
          subJa: "近江町市場で加能ガニ・のどぐろ海鮮丼、ひがし茶屋街の金箔ソフト＆武家屋敷めぐり",
          stay: 15500, travelBase: 0, travelActualAdd: 800, fun: 13500,
          hotelEn: "Hotel Nikko Kanazawa", hotelJa: "ホテル日航金沢",
          hotelUrl: "https://www.hnkanazawa.jp/en/", passCovered: true, jrOnly: 0, totalAllLegs: 800,
          legsEn: ["Kanazawa Loop Bus 1-Day Pass (¥800 • Non-JR)"],
          legsJa: ["城下まち金沢周遊バス 1日フリー乗車券（¥800 • JR以外）"],
          tipEn: "Use the official Kanazawa Loop Bus PDF Map (Tab 7) to link Omicho Market, Higashi Chaya, Kenrokuen, and Nagamachi.",
          tipJa: "タブ7の金沢周遊バス公式路線図PDFを保存しておくと市内循環が非常にスムーズです。"
        },
        {
          regEn: "Chubu", regJa: "加賀温泉",
          titleEn: "Kanazawa ↔ Kaga Onsen (Yamanaka Kakusenkei Gorge & Yamashiro Hot Springs)",
          titleJa: "金沢 ↔ 加賀温泉郷（山中温泉・鶴仙渓＆山代温泉・古総湯）",
          subEn: "Short train + Canbus hop to 1,300-year-old snow-view hot spring towns & riverside bridges",
          subJa: "北陸新幹線・在来線＆キャンバスで開湯1300年の加賀温泉郷へ雪見温泉＆渓谷散策",
          stay: 15500, travelBase: 2200, travelActualAdd: 0, fun: 11000,
          hotelEn: "Hotel Nikko Kanazawa", hotelJa: "ホテル日航金沢",
          hotelUrl: "https://www.hnkanazawa.jp/en/", passCovered: true, jrOnly: 2200, totalAllLegs: 2200,
          legsEn: ["Kanazawa ↔ Kaga Onsen (Shinkansen / IR Ishikawa & Canbus ¥2,200)"],
          legsJa: ["金沢 ↔ 加賀温泉駅・温泉街（新幹線・在来線＆キャンバス ¥2,200）"],
          tipEn: "Soak in Yamashiro Onsen's Meiji-era stained-glass Ko-Soyu bathhouse and stroll across Ayatori Bridge in Yamanaka.",
          tipJa: "山代温泉のステンドグラスが美しい「古総湯」と山中温泉「あやとりはし」がおすすめ。"
        },
        {
          regEn: "Chubu", regJa: "白川郷・高山",
          titleEn: "Kanazawa → Gokayama (Ainokura) & UNESCO Shirakawa-go → Takayama",
          titleJa: "金沢 → 五箇山（相倉合掌造り）＆世界遺産・白川郷 → 飛騨高山",
          subEn: "Reserve Nohi/Hokutetsu highway bus across snow-covered thatched-roof alpine villages",
          subJa: "予約制高速バスで雪化粧の合掌造り集落（五箇山・白川郷）を巡り飛騨高山へ",
          stay: 22000, travelBase: 0, travelActualAdd: 6000, fun: 10000,
          hotelEn: "Hotel Associa Takayama Resort", hotelJa: "ホテルアソシア高山リゾート",
          hotelUrl: "https://www.associa.com/tky/multi/en/", jrOnly: 0, totalAllLegs: 6000,
          legsEn: ["Kanazawa → Shirakawa-go / Ainokura → Takayama (Nohi/Hokutetsu Bus ¥6,000 • Non-JR)"],
          legsJa: ["金沢駅 → 白川郷・五箇山 → 高山濃飛バスセンター（予約制高速バス ¥6,000 • JR以外）"],
          tipEn: "Highway buses between Kanazawa, Shirakawa-go, and Takayama require advance seat reservations—book 1 month early!",
          tipJa: "金沢〜白川郷〜高山間の高速バスは全席予約制です。1ヶ月前の予約開始と同時手配が安心。"
        },
        {
          regEn: "Chubu", regJa: "白川郷・高山",
          titleEn: "Takayama: Miyagawa Morning Market, Sanmachi Old Town & Hida Beef Onsen",
          titleJa: "飛騨高山：宮川朝市・古い町並（さんまち通り）・飛騨牛＆アルプス温泉",
          subEn: "Edo-period merchant streets, Takayama Jinya, sake breweries & open-air Alps hot springs",
          subJa: "江戸の風情残るさんまち通りと高山陣屋、地酒試飲、A5飛騨牛朴葉味噌を堪能",
          stay: 22000, travelBase: 0, travelActualAdd: 1000, fun: 14000,
          hotelEn: "Hotel Associa Takayama Resort", hotelJa: "ホテルアソシア高山リゾート",
          hotelUrl: "https://www.associa.com/tky/multi/en/", jrOnly: 0, totalAllLegs: 1000,
          legsEn: ["Takayama Station ↔ Hotel Free Shuttle & Old Town Walk (¥1,000)"],
          legsJa: ["高山駅 ↔ ホテル無料送迎バス＆古い町並散策（¥1,000）"],
          tipEn: "Try savory soy-grilled Mitarashi Dango at Miyagawa Morning Market and A5 Hida Beef nigiri sushi on Sanmachi Street.",
          tipJa: "甘くない醤油香る高山名物「みたらし団子」と飛騨牛にぎり寿司の食べ歩きをぜひ。"
        },
        {
          regEn: "Tokyo", regJa: "東京",
          titleEn: "Takayama → Toyama (JR Hida Gorge Express) → Tokyo Evening",
          titleJa: "高山 → 富山（特急ひだ渓谷車窓）→ 北陸新幹線で東京帰着",
          subEn: "Scenic Hida Limited Express through Northern Alps gorge to Toyama & Shinkansen to Tokyo",
          subJa: "特急ひだで北アルプスの雪渓谷を抜け富山へ、北陸新幹線で東京駅へ戻る周遊ルート",
          stay: 18000, travelBase: 16500, travelActualAdd: 0, fun: 12000,
          hotelEn: "Hotel Metropolitan Tokyo Marunouchi", hotelJa: "ホテルメトロポリタン丸の内",
          hotelUrl: "https://tokyo-marunouchi.hotel-metropolitan.com/", passCovered: true, jrOnly: 16500, totalAllLegs: 16500,
          legsEn: ["Takayama → Toyama (JR Limited Express Hida) → Tokyo (Hokuriku Shinkansen ¥16,500)"],
          legsJa: ["高山 → 富山（JR特急ひだ）→ 東京（北陸新幹線 ¥16,500）"],
          tipEn: "Sit on the right side (D seats) on JR Limited Express Hida northbound for dramatic river canyon views.",
          tipJa: "高山→富山間の特急ひだは進行方向右側のD席が渓谷美を望む特等席！"
        },
        {
          regEn: "Tokyo", regJa: "東京",
          titleEn: "Tokyo Last-Minute Shopping → Haneda / Narita Departure",
          titleJa: "東京駅・銀座ショッピング → 羽田 / 成田空港 出発帰国",
          subEn: "Souvenir shopping at Tokyo Station Daimaru before airport express transfer home",
          subJa: "東京駅・大丸東京でお土産購入後、空港特急で帰路へ",
          stay: 0, travelBase: 48000, travelActualAdd: 0, fun: 10000,
          hotelEn: "Departure Day (Tokyo Airport)", hotelJa: "帰国・出発日（東京空港）",
          hotelUrl: "", jrOnly: 3070, totalAllLegs: 3070,
          legsEn: ["Tokyo Station → Airport (¥3,070 + Return Flight ¥45,000)"],
          legsJa: ["東京駅 → 空港（¥3,070 ＋ 帰国航空券 ¥45,000）"],
          tipEn: "Note: Hokuriku Arch Pass does not cover Takayama–Toyama JR Hida; compare individual tickets vs JR Pass in Tab 5!",
          tipJa: "特急ひだ（高山〜富山）は北陸アーチパス対象外です。タブ5で個別運賃と比較確認できます。"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 2, firstSpan: 1, splitNoteEn: "plus Night 7 return", splitNoteJa: "＋最終日前夜7泊目", rate: 18000, nameEn: "Hotel Metropolitan Tokyo Marunouchi", nameJa: "ホテルメトロポリタン丸の内", regEn: "Tokyo", regJa: "東京", url: "https://tokyo-marunouchi.hotel-metropolitan.com/", accEn: "1-min direct walk from JR Tokyo Station Nihombashi Exit", accJa: "JR東京駅 日本橋口直結 徒歩1分", hiEn: "Direct Hokuriku Shinkansen access at Tokyo Station.", hiJa: "東京駅サピアタワー直結で北陸新幹線への乗換が極めてスムーズ。" },
        { startDay: 2, nights: 3, rate: 15500, nameEn: "Hotel Nikko Kanazawa", nameJa: "ホテル日航金沢", regEn: "Chubu", regJa: "金沢・北陸", url: "https://www.hnkanazawa.jp/en/", accEn: "3-min underground walk from JR Kanazawa Station East Exit", accJa: "JR金沢駅 兼六園口より地下道直結徒歩3分", hiEn: "Ideal 3-night base steps from Kanazawa bus terminal for Shirakawa-go & Loop Bus.", hiJa: "バスターミナル目の前で兼六園・白川郷・加賀温泉への拠点に最適。" },
        { startDay: 5, nights: 2, rate: 22000, nameEn: "Hotel Associa Takayama Resort (Onsen)", nameJa: "ホテルアソシア高山リゾート（飛騨温泉）", regEn: "Chubu", regJa: "白川郷・高山", url: "https://www.associa.com/tky/multi/en/", accEn: "8-min free shuttle bus from JR Takayama Station", accJa: "JR高山駅より無料シャトルバス8分", hiEn: "Hilltop hot spring resort with multi-tiered outdoor baths facing the snowy Northern Alps.", hiJa: "雪の北アルプスを一望する多層露天風呂が自慢の高山リゾート。", luxury: true }
      ]);
      const gList = window.buildGourmetListFromLocations(["Tokyo", "Kanazawa", "Takayama"]);
      const aList = window.buildAccessListFromKeys(["Tokyo", "Kanazawa"]);
      const gdList = window.buildGuidesListFromKeys(["Tokyo", "Kanazawa", "Takayama"]);
      const prep = buildPrep({
        en: [
          { id: "hk1", title: "Reserve Kanazawa ↔ Shirakawa-go ↔ Takayama Highway Bus", sub: "Mandatory seat reservation opens 1 month prior via Nohi/Hokutetsu Bus" },
          { id: "hk2", title: "Book Hokuriku Shinkansen & Limited Express Hida Seats", sub: "Check Tab 5 Pass Optimizer before buying Hokuriku Arch Pass vs e5489 tickets" }
        ],
        ja: [
          { id: "hk1", title: "金沢 ↔ 白川郷 ↔ 高山 濃飛/北鉄高速バス座席予約", sub: "乗車1ヶ月前より予約開始・満席必至のため早めの予約推奨" },
          { id: "hk2", title: "北陸新幹線＆特急ひだ指定席確認", sub: "タブ5のシミュレーションでパス vs 個別購入を比較" }
        ]
      });
      return {
        id: "hokuriku8",
        startDate: start,
        endDate: addDaysYmd(start, 7).ymd,
        titleEn: "Hokuriku Winter: Tokyo, Kanazawa, Shirakawa-go, Takayama & Kaga Onsen",
        titleJa: "北陸・飛騨冬紀行：東京・金沢・白川郷・五箇山・高山・加賀温泉",
        subtitleEn: "Snow-draped Gassho-zukuri villages, Kenrokuen Yukitsuri, Winter Snow Crab & Kaga Hot Springs",
        subtitleJa: "雪化粧の五箇山相倉・白川郷合掌造り・兼六園雪吊り・冬カニ＆加賀・飛騨温泉",
        selectedPassId: "hokuriku7",
        passStartDay: 2,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    if (presetKey === "hokkaido7") {
      const start = "2026-07-12";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Hokkaido", regJa: "札幌・小樽",
          titleEn: "Arrive New Chitose Airport (CTS) → Sapporo Odori Park & Susukino",
          titleJa: "新千歳空港（CTS）到着 → 札幌・大通公園＆すすきの",
          subEn: "37-min JR Rapid Airport to Sapporo Station, miso ramen & Susukino summer evening",
          subJa: "快速エアポートで札幌駅へ（37分）。大通公園散策＆本場札幌味噌ラーメン",
          stay: 15000, travelBase: 48000, travelActualAdd: 0, fun: 9500,
          hotelEn: "JR Tower Hotel Nikko Sapporo", hotelJa: "JRタワーホテル日航札幌",
          hotelUrl: "https://www.jrhotels.co.jp/tower/english/", passCovered: true, jrOnly: 1150, totalAllLegs: 1150,
          legsEn: ["New Chitose Airport → Sapporo (JR Rapid Airport ¥1,150 + Flight)"],
          legsJa: ["新千歳空港 → 札幌駅（JR快速エアポート ¥1,150 ＋ 航空券）"],
          tipEn: "Exchange your 7-Day JR Hokkaido Rail Pass at New Chitose Airport Station right before boarding the Rapid Airport train.",
          tipJa: "新千歳空港駅のJRみどりの窓口で北海道レールパス（7日間）を引換してスタート。"
        },
        {
          regEn: "Hokkaido", regJa: "札幌・小樽",
          titleEn: "Sapporo ↔ Otaru Canal, Sakaimachi Glass Street & Sankaku Seafood Market",
          titleJa: "札幌 ↔ 小樽運河・堺町通り＆三角市場海鮮丼",
          subEn: "Scenic Ishikari Bay coastal train to Otaru warehouses, sushi & LeTAO cheesecake",
          subJa: "石狩湾沿いの絶景列車で小樽へ。三角市場の海鮮丼・北一硝子・ルタオ＆運河ガス灯",
          stay: 15000, travelBase: 1500, travelActualAdd: 0, fun: 12000,
          hotelEn: "JR Tower Hotel Nikko Sapporo", hotelJa: "JRタワーホテル日航札幌",
          hotelUrl: "https://www.jrhotels.co.jp/tower/english/", passCovered: true, jrOnly: 1500, totalAllLegs: 1500,
          legsEn: ["Sapporo ↔ Otaru (JR Rapid Airport Round-Trip ¥1,500)"],
          legsJa: ["札幌 ↔ 小樽（JR快速エアポート往復 ¥1,500）"],
          tipEn: "Grab seats on the right side outbound from Sapporo for ocean views right below the tracks, and stay until Otaru Canal gas lamps glow at dusk.",
          tipJa: "往路は進行方向右側の座席が海沿いの絶景！夕暮れの小樽運河ガス灯まで楽しむのがおすすめ。"
        },
        {
          regEn: "Hokkaido", regJa: "富良野・美瑛",
          titleEn: "Sapporo ↔ Furano (Farm Tomita Lavender Fields) & Biei Shirogane Blue Pond",
          titleJa: "札幌 ↔ 富良野（ファーム富田ラベンダー畑）＆美瑛・白金青い池",
          subEn: "Peak mid-July rainbow lavender hills in Nakafurano & cobalt-blue mineral pond in Biei",
          subJa: "7月中旬のベストシーズン！ファーム富田のラベンダー絨毯と美瑛「青い池」を巡る",
          stay: 15000, travelBase: 9800, travelActualAdd: 1000, fun: 11000,
          hotelEn: "JR Tower Hotel Nikko Sapporo", hotelJa: "JRタワーホテル日航札幌",
          hotelUrl: "https://www.jrhotels.co.jp/tower/english/", passCovered: true, jrOnly: 9800, totalAllLegs: 10800,
          legsEn: ["Sapporo ↔ Furano / Biei (JR Lavender Express ¥9,800)", "Local Blue Pond Bus / Taxi Hop (¥1,000 • Non-JR)"],
          legsJa: ["札幌 ↔ 富良野・美瑛（JRフラノラベンダーエクスプレス ¥9,800）", "美瑛〜青い池 路線バス等（¥1,000 • JR以外）"],
          tipEn: "Don't miss Furano Omelet Curry and fresh lavender soft-serve ice cream at Farm Tomita.",
          tipJa: "富良野名物オムカレーとファーム富田のラベンダーソフトクリームは必食！"
        },
        {
          regEn: "Hokkaido", regJa: "登別温泉",
          titleEn: "Sapporo → Noboribetsu Onsen (Jigokudani Hell Valley & Sulfur Hot Springs)",
          titleJa: "札幌 → 登別温泉（地獄谷＆大湯沼川天然足湯・名湯ステイ）",
          subEn: "Limited Express Hokuto to Noboribetsu, boardwalks past volcanic vents & multi-spring baths",
          subJa: "特急北斗で登別へ。噴気上がる地獄谷の遊歩道散策と5つの泉質を誇る温泉宿ステイ",
          stay: 28000, travelBase: 4780, travelActualAdd: 700, fun: 10000,
          hotelEn: "Dai-ichi Takimotokan (Noboribetsu Onsen)", hotelJa: "第一滝本館（登別温泉）",
          hotelUrl: "https://takimotokan.co.jp/en/", passCovered: true, jrOnly: 4780, totalAllLegs: 5480,
          legsEn: ["Sapporo → Noboribetsu (JR Limited Express Hokuto ¥4,780)", "Noboribetsu Stn ↔ Onsen (Donan Bus ¥700 • Non-JR)"],
          legsJa: ["札幌 → 登別（JR特急北斗 ¥4,780）", "登別駅 ↔ 登別温泉（道南バス往復 ¥700 • JR以外）"],
          tipEn: "Walk the illuminated Demon Path around Jigokudani Hell Valley after dinner and soak overlooking the steaming crater.",
          tipJa: "夕食後の地獄谷ナイトウォーク（鬼火の路）と第一滝本館の35湯大浴場を満喫。"
        },
        {
          regEn: "Hokkaido", regJa: "函館",
          titleEn: "Noboribetsu → Lake Toya → Hakodate (Mt. Hakodate Night View)",
          titleJa: "登別 → 洞爺湖車窓 → 函館（金森赤レンガ倉庫＆函館山百万ドル夜景）",
          subEn: "Limited Express Hokuto along Uchiura Bay to Hakodate Bay & Mt. Hakodate Ropeway",
          subJa: "噴火湾沿いに特急北斗で南下。ラッキーピエロ＆ベイエリア散策後に函館山夜景へ",
          stay: 16500, travelBase: 6910, travelActualAdd: 1800, fun: 11000,
          hotelEn: "La Vista Hakodate Bay", hotelJa: "ラビスタ函館ベイ",
          hotelUrl: "https://la-vista-bay.hokkaidohotelsjapan.com/en/", passCovered: true, jrOnly: 6910, totalAllLegs: 8710,
          legsEn: ["Noboribetsu → Hakodate (JR Hokuto ¥6,910)", "Mt. Hakodate Ropeway Round-Trip (¥1,800 • Non-JR)"],
          legsJa: ["登別 → 函館（JR特急北斗 ¥6,910）", "函館山ロープウェイ往復（¥1,800 • JR以外）"],
          tipEn: "Arrive at Mt. Hakodate summit 30 minutes before sunset to watch the twilight city lights ignite along both bays.",
          tipJa: "函館山は日没30分前に上がると、夕暮れから百万ドルの夜景へ移ろう絶景が撮れます。"
        },
        {
          regEn: "Hokkaido", regJa: "札幌・小樽",
          titleEn: "Hakodate Morning Market & Fort Goryokaku → Return to Sapporo",
          titleJa: "函館朝市（活イカ丼）＆五稜郭タワー → 特急北斗で札幌帰着",
          subEn: "Live squid at Hakodate Asaichi, star-shaped Goryokaku citadel & Jingisukan farewell dinner",
          subJa: "函館朝市の活イカ＆五稜郭タワー展望後、札幌へ戻り生ラムジンギスカンの夜",
          stay: 15000, travelBase: 9440, travelActualAdd: 0, fun: 12500,
          hotelEn: "JR Tower Hotel Nikko Sapporo", hotelJa: "JRタワーホテル日航札幌",
          hotelUrl: "https://www.jrhotels.co.jp/tower/english/", passCovered: true, jrOnly: 9440, totalAllLegs: 9440,
          legsEn: ["Hakodate → Sapporo (JR Limited Express Hokuto ¥9,440)"],
          legsJa: ["函館 → 札幌（JR特急北斗 ¥9,440）"],
          tipEn: "Try La Vista's famous DIY salmon-roe (ikura) & sweet shrimp seafood bowl breakfast before checking out in Hakodate!",
          tipJa: "ラビスタ函館ベイ名物の「いくら掛け放題・勝手丼朝食」を楽しんでから出発！"
        },
        {
          regEn: "Hokkaido", regJa: "札幌・小樽",
          titleEn: "Sapporo → New Chitose Airport (CTS) Shopping & Departure",
          titleJa: "札幌 → 新千歳空港（CTS）お土産ショッピング＆出発帰国",
          subEn: "Explore Royce Chocolate World & Hokkaido Ramen Dojo at CTS before flying home",
          subJa: "新千歳空港のロイズ・白い恋人・北海道ラーメン道場を満喫して帰路へ",
          stay: 0, travelBase: 48000, travelActualAdd: 0, fun: 9000,
          hotelEn: "Departure Day (New Chitose Airport)", hotelJa: "帰国・出発日（新千歳空港）",
          hotelUrl: "", passCovered: true, jrOnly: 1150, totalAllLegs: 1150,
          legsEn: ["Sapporo → New Chitose Airport (JR Rapid Airport ¥1,150 + Return Flight)"],
          legsJa: ["札幌 → 新千歳空港（JR快速エアポート ¥1,150 ＋ 帰国航空券）"],
          tipEn: "All 7 days of JR Limited Express trains are fully covered by the 7-Day JR Hokkaido Rail Pass (net savings > ¥8,000)!",
          tipJa: "7日間のJR北海道レールパス（¥26,000）で札幌〜富良野〜登別〜函館の全JR線がカバーされます。"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 4, firstSpan: 3, splitNoteEn: "plus Night 6 return", splitNoteJa: "＋6泊目帰着泊", rate: 15000, nameEn: "JR Tower Hotel Nikko Sapporo", nameJa: "JRタワーホテル日航札幌", regEn: "Hokkaido", regJa: "札幌・小樽", url: "https://www.jrhotels.co.jp/tower/english/", accEn: "Directly connected inside JR Sapporo Station South Exit", accJa: "JR札幌駅 南口直結", hiEn: "Skyscraper hotel with 22F natural hot spring sky spa and effortless rail connections.", hiJa: "JR札幌駅直結のランドマークホテル。22階天然温泉スパ完備で道内移動に抜群の利便性。" },
        { startDay: 4, nights: 1, rate: 28000, nameEn: "Dai-ichi Takimotokan (Noboribetsu Onsen)", nameJa: "第一滝本館（登別温泉）", regEn: "Hokkaido", regJa: "登別温泉", url: "https://takimotokan.co.jp/en/", accEn: "15-min Donan Bus from JR Noboribetsu Station", accJa: "JR登別駅から道南バス15分（地獄谷目の前）", hiEn: "35 hot spring baths across 5 distinct volcanic mineral waters facing Jigokudani.", hiJa: "5種類の泉質と35の湯舟を誇り、大浴場から地獄谷を望む登別の老舗名旅館。", luxury: true },
        { startDay: 5, nights: 1, rate: 16500, nameEn: "La Vista Hakodate Bay", nameJa: "ラビスタ函館ベイ", regEn: "Hokkaido", regJa: "函館", url: "https://la-vista-bay.hokkaidohotelsjapan.com/en/", accEn: "15-min walk from JR Hakodate Station (Red Brick Warehouses)", accJa: "JR函館駅徒歩15分（金森赤レンガ倉庫すぐ）", hiEn: "Famous rooftop bay-view onsen and Japan-renowned seafood ikura breakfast buffet.", hiJa: "函館山を望む最上階天然温泉露天風呂と名物「海鮮いくら丼」朝食が大人気。" }
      ]);
      const gList = window.buildGourmetListFromLocations(["Sapporo", "Noboribetsu", "Hakodate"]);
      const aList = window.buildAccessListFromKeys(["Hokkaido"]);
      const gdList = window.buildGuidesListFromKeys(["Sapporo", "Noboribetsu", "Hakodate"]);
      const prep = buildPrep({
        en: [
          { id: "hkd1", title: "Purchase 7-Day JR Hokkaido Rail Pass & Reserve Lavender Express", sub: "Book reserved seats for Lavender Express & Hokuto upon arrival at New Chitose" }
        ],
        ja: [
          { id: "hkd1", title: "JR北海道レールパス（7日間）＆フラノラベンダーエクスプレス指定席確認", sub: "新千歳空港到着時にまとめて指定席発券するとスムーズ" }
        ]
      });
      return {
        id: "hokkaido7",
        startDate: start,
        endDate: addDaysYmd(start, 6).ymd,
        titleEn: "Hokkaido Summer: Sapporo, Otaru, Furano, Noboribetsu & Hakodate",
        titleJa: "北海道夏周遊：札幌・小樽・富良野・登別温泉・函館",
        subtitleEn: "Peak July Furano lavender, Otaru Canal, Jigokudani Sulfur Onsen & Mt. Hakodate Night View",
        subtitleJa: "7月の富良野ラベンダー・小樽運河・登別地獄谷温泉＆函館山百万ドルの夜景",
        selectedPassId: "hokkaido7",
        passStartDay: 1,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    if (presetKey === "kyushu8") {
      const start = "2026-03-25";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Kyushu", regJa: "福岡・博多",
          titleEn: "Arrive Fukuoka Airport (FUK) → Hakata Station & Nakasu Yatai Stalls",
          titleJa: "福岡空港（FUK）到着 → 博多駅＆中洲・天神 屋台ストリート",
          subEn: "5-min subway ride to downtown Hakata, tonkotsu ramen & riverside open-air yatai",
          subJa: "空港から地下鉄わずか5分で博多駅へ！濃厚博多豚骨ラーメン＆中洲屋台めぐり",
          stay: 14500, travelBase: 45000, travelActualAdd: 260, fun: 9500,
          hotelEn: "JR Kyushu Hotel Blossom Hakata Central", hotelJa: "JR九州ホテル ブラッサム博多中央",
          hotelUrl: "https://www.jrk-hotels.co.jp/en/Hakata_central/", jrOnly: 0, totalAllLegs: 260,
          legsEn: ["Fukuoka Airport → Hakata Station (Subway 5 min • ¥260 + Flight)"],
          legsJa: ["福岡空港 → 博多駅（福岡市地下鉄5分 • ¥260 ＋ 航空券）"],
          tipEn: "Fukuoka Airport is Japan's closest major airport to downtown—just 2 subway stops from Hakata Station!",
          tipJa: "福岡空港は市街地直結の好立地！地下鉄わずか2駅で博多駅に到着します。"
        },
        {
          regEn: "Kyushu", regJa: "福岡・博多",
          titleEn: "Fukuoka: Ohori Park Sakura, Kushida Shrine & Dazaifu Tenmangu Excursion",
          titleJa: "福岡：大濠公園・舞鶴公園の桜、櫛田神社＆太宰府天満宮",
          subEn: "Spring cherry blossoms at Fukuoka Castle ruins & freshly grilled Umegae Mochi in Dazaifu",
          subJa: "福岡城跡・大濠公園のお花見散歩と、学問の神様・太宰府天満宮で焼きたて梅ヶ枝餅",
          stay: 14500, travelBase: 0, travelActualAdd: 1600, fun: 11000,
          hotelEn: "JR Kyushu Hotel Blossom Hakata Central", hotelJa: "JR九州ホテル ブラッサム博多中央",
          hotelUrl: "https://www.jrk-hotels.co.jp/en/Hakata_central/", passCovered: true, jrOnly: 800, totalAllLegs: 1600,
          legsEn: ["Hakata ↔ Tenjin ↔ Dazaifu (Subway & Nishitetsu Train ¥1,600 • Non-JR)"],
          legsJa: ["博多 ↔ 天神 ↔ 太宰府（地下鉄＆西鉄電車 ¥1,600 • JR以外）"],
          tipEn: "Maizuru Park / Fukuoka Castle ruins beside Ohori Park are one of Kyushu's premier late-March sakura spots!",
          tipJa: "3月下旬の大濠公園・舞鶴公園は福岡随一の桜名所。太宰府表参道の食べ歩きも充実。"
        },
        {
          regEn: "Kyushu", regJa: "由布院・別府",
          titleEn: "Hakata → Yufuin (Yunotsubo Street & Lake Kinrinko) → Beppu Onsen",
          titleJa: "博多 → 特急「ゆふいんの森」で由布院・金鱗湖 → 別府温泉ステイ",
          subEn: "Scenic Yufuin no Mori train, Bungo beef claypot rice & Beppu Bay infinity rotenburo baths",
          subJa: "人気の観光特急で由布院へ。湯の坪街道・豊後牛まぶしを堪能後、別府温泉へ移動",
          stay: 24000, travelBase: 6100, travelActualAdd: 0, fun: 11000,
          hotelEn: "Beppu Onsen Suginoi Hotel", hotelJa: "別府温泉 杉乃井ホテル",
          hotelUrl: "https://suginoi.orixhotelsandresorts.com/", passCovered: true, jrOnly: 6100, totalAllLegs: 6100,
          legsEn: ["Hakata → Yufuin → Beppu (JR Yufuin no Mori & Sonic ¥6,100)"],
          legsJa: ["博多 → 由布院 → 別府（JR特急ゆふいんの森・ソニック ¥6,100）"],
          tipEn: "Reserve Yufuin no Mori seats exactly 1 month before travel—it sells out quickly in spring!",
          tipJa: "JR特急「ゆふいんの森」は全席指定で大人気のため、1ヶ月前の予約開始と同時手配がおすすめ。"
        },
        {
          regEn: "Kyushu", regJa: "由布院・別府",
          titleEn: "Beppu Hells Tour (Umi Jigoku & Kannawa Steam Cooking) & Sand Baths",
          titleJa: "別府地獄めぐり（海地獄・血の池地獄）＆鉄輪温泉・地獄蒸し体験",
          subEn: "Tour Beppu's cobalt & crimson geothermal Hells and steam seafood in 98°C volcanic vents",
          subJa: "コバルトブルーの海地獄など別府地獄めぐりと、鉄輪温泉の天然噴気「地獄蒸し工房」ランチ",
          stay: 24000, travelBase: 0, travelActualAdd: 1100, fun: 12000,
          hotelEn: "Beppu Onsen Suginoi Hotel", hotelJa: "別府温泉 杉乃井ホテル",
          hotelUrl: "https://suginoi.orixhotelsandresorts.com/", jrOnly: 0, totalAllLegs: 1100,
          legsEn: ["Kamenoi Bus 1-Day Mini Free Pass (¥1,100 • Non-JR)"],
          legsJa: ["亀の井バス 1日ミニフリー乗車券（¥1,100 • JR以外）"],
          tipEn: "Try Beppu's signature Oita Toriten (citrus-ponzu chicken tempura) and sunset soaking at Suginoi's Tanayu baths.",
          tipJa: "大分の名物「とり天」と、杉乃井ホテルの絶景展望露天風呂「棚湯」を堪能！"
        },
        {
          regEn: "Kyushu", regJa: "黒川温泉",
          titleEn: "Beppu → Kurokawa Onsen (Riverside Open-Air Bath Hopping with Nyuto Tegata)",
          titleJa: "別府 → 九州横断バスで秘湯・黒川温泉（「入湯手形」露天風呂めぐり）",
          subEn: "Trans-Kyushu Bus across the Yamanami Highway to secluded forested riverside ryokans",
          subJa: "やまなみハイウェイを走る九州横断バスで黒川温泉へ。杉の入湯手形で3つの名湯巡り",
          stay: 26000, travelBase: 0, travelActualAdd: 3500, fun: 10000,
          hotelEn: "Kurokawa Onsen Traditional Riverside Ryokan", hotelJa: "黒川温泉 渓流沿いの老舗旅館",
          hotelUrl: "https://www.kurokawaonsen.or.jp/free/engo", jrOnly: 0, totalAllLegs: 3500,
          legsEn: ["Beppu → Kurokawa Onsen (Kyushu Odan Bus ¥3,500 • Non-JR)"],
          legsJa: ["別府 → 黒川温泉（九州横断バス ¥3,500 • JR以外）"],
          tipEn: "Reserve the Kyushu Odan Bus ahead of time and pick up a wooden Nyuto Tegata pass (¥1,500) to visit 3 scenic baths.",
          tipJa: "九州横断バスは予約推奨。温泉街で「入湯手形（¥1,500）」を購入して浴衣で露天巡りを。"
        },
        {
          regEn: "Kyushu", regJa: "熊本・阿蘇",
          titleEn: "Kurokawa Onsen → Mount Aso Caldera & Kusasenri → Kumamoto Castle → Hakata",
          titleJa: "黒川温泉 → 阿蘇カルデラ・草千里ヶ浜 → 熊本城 → 九州新幹線で博多へ",
          subEn: "Cross Mt. Aso volcanic plains, feast on Akaushi beef bowl & ride Kyushu Shinkansen back",
          subJa: "阿蘇の雄大な草原・草千里と名物あか牛丼、復興した熊本城見学後、九州新幹線で博多帰着",
          stay: 14500, travelBase: 4200, travelActualAdd: 2500, fun: 12000,
          hotelEn: "JR Kyushu Hotel Blossom Hakata Central", hotelJa: "JR九州ホテル ブラッサム博多中央",
          hotelUrl: "https://www.jrk-hotels.co.jp/en/Hakata_central/", passCovered: true, jrOnly: 5200, totalAllLegs: 7700,
          legsEn: ["Kurokawa → Aso → Kumamoto (Bus ¥2,500 • Non-JR)", "Kumamoto → Hakata (Kyushu Shinkansen ¥5,200)"],
          legsJa: ["黒川温泉 → 阿蘇 → 熊本（九州横断バス ¥2,500 • JR以外）", "熊本 → 博多（九州新幹線 ¥5,200）"],
          tipEn: "Have Kumamoto's signature Akaushi red wagyu steak bowl at Aso/Kumamoto and ride the 38-min Kyushu Shinkansen back to Hakata.",
          tipJa: "阿蘇「あか牛丼」や熊本ラーメンを味わい、九州新幹線（わずか38分）で博多へ快適帰着。"
        },
        {
          regEn: "Kyushu", regJa: "福岡・博多",
          titleEn: "Hakata ↔ Yanagawa Canal Boat Punting & Hakata Motsunabe Farewell",
          titleJa: "博多 ↔ 柳川川下り（どんこ舟）または糸島 → 博多もつ鍋ディナー",
          subEn: "Relaxing wooden boat punt under spring willows in Yanagawa & final Kyushu feast",
          subJa: "水郷・柳川で春の川下りと鰻のせいろ蒸しを堪能後、博多もつ鍋・水炊きで乾杯",
          stay: 14500, travelBase: 0, travelActualAdd: 2500, fun: 13000,
          hotelEn: "JR Kyushu Hotel Blossom Hakata Central", hotelJa: "JR九州ホテル ブラッサム博多中央",
          hotelUrl: "https://www.jrk-hotels.co.jp/en/Hakata_central/", jrOnly: 0, totalAllLegs: 2500,
          legsEn: ["Tenjin ↔ Yanagawa (Nishitetsu Train & Boat Pass ¥2,500 • Non-JR)"],
          legsJa: ["西鉄天神 ↔ 柳川（太宰府・柳川観光きっぷ ¥2,500 • JR以外）"],
          tipEn: "Savor steamed eel (Unagi no Seiro-mushi) along Yanagawa's canals before returning for Hakata Motsunabe.",
          tipJa: "柳川の伝統グルメ「うなぎのせいろ蒸し」は絶品！夜は博多駅前でもつ鍋・水炊きを。"
        },
        {
          regEn: "Kyushu", regJa: "福岡・博多",
          titleEn: "Hakata Station Shopping → Fukuoka Airport (FUK) Departure",
          titleJa: "博多駅ショッピング → 福岡空港（FUK）出発帰国",
          subEn: "Pick up Hakata Torimon & mentaiko souvenirs before 5-min subway ride to airport",
          subJa: "博多通りもん・明太子などお土産を購入後、地下鉄5分で福岡空港へ",
          stay: 0, travelBase: 45000, travelActualAdd: 260, fun: 8000,
          hotelEn: "Departure Day (Fukuoka Airport)", hotelJa: "帰国・出発日（福岡空港）",
          hotelUrl: "", jrOnly: 0, totalAllLegs: 260,
          legsEn: ["Hakata Station → Fukuoka Airport (Subway ¥260 + Return Flight)"],
          legsJa: ["博多駅 → 福岡空港（福岡市地下鉄 ¥260 ＋ 帰国航空券）"],
          tipEn: "Check Tab 5: since Yufuin no Mori + Sonic + Kumamoto Shinkansen total ~¥11,300, point-to-point tickets actually beat a ¥25,000 All-Kyushu Pass!",
          tipJa: "タブ5注目：この行程はJR九州運賃合計が約¥11,300のため、全国/全九州パスより個別きっぷの方がお得です。"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 4, firstSpan: 2, splitNoteEn: "plus Nights 6–7 return", splitNoteJa: "＋6〜7泊目博多帰着", rate: 14500, nameEn: "JR Kyushu Hotel Blossom Hakata Central", nameJa: "JR九州ホテル ブラッサム博多中央", regEn: "Kyushu", regJa: "福岡・博多", url: "https://www.jrk-hotels.co.jp/en/Hakata_central/", accEn: "2-min walk from JR Hakata Station Hakata Exit", accJa: "JR博多駅 博多口より徒歩2分", hiEn: "Prime hub steps from Shinkansen, Yufuin no Mori & 5-min airport subway.", hiJa: "博多駅正面の好立地。新幹線・ゆふいんの森・空港地下鉄アクセス抜群。" },
        { startDay: 3, nights: 2, rate: 24000, nameEn: "Beppu Onsen Suginoi Hotel", nameJa: "別府温泉 杉乃井ホテル", regEn: "Kyushu", regJa: "由布院・別府", url: "https://suginoi.orixhotelsandresorts.com/", accEn: "10-min free shuttle bus from JR Beppu Station West Exit", accJa: "JR別府駅 西口より無料シャトルバス10分", hiEn: "Multi-tiered infinity Tanayu open-air hot spring baths overlooking Beppu Bay.", hiJa: "別府湾を一望する5段棚田状の展望露天風呂「棚湯」が圧巻の温泉リゾート。", luxury: true },
        { startDay: 5, nights: 1, rate: 26000, nameEn: "Kurokawa Onsen Traditional Riverside Ryokan", nameJa: "黒川温泉 渓流沿いの老舗旅館", regEn: "Kyushu", regJa: "黒川温泉", url: "https://www.kurokawaonsen.or.jp/free/engo", accEn: "5-min walk or ryokan pickup from Kurokawa Onsen Bus Stop", accJa: "黒川温泉バス停より徒歩5分（送迎あり）", hiEn: "Secluded forest hot spring inn with open-air riverside baths and Kumamoto kaiseki.", hiJa: "渓流のせせらぎを聴きながら露天風呂と熊本の会席料理を味わう名湯ステイ。", luxury: true }
      ]);
      const gList = window.buildGourmetListFromLocations(["Fukuoka", "Beppu", "Kumamoto"]);
      const aList = window.buildAccessListFromKeys(["Kyushu"]);
      const gdList = window.buildGuidesListFromKeys(["Fukuoka", "Beppu", "Kumamoto"]);
      const prep = buildPrep({
        en: [
          { id: "ky1", title: "Reserve JR Yufuin no Mori Scenic Train & Kyushu Odan Bus", sub: "Book exactly 1 month ahead via JR Kyushu Online / Highwaybus.com" }
        ],
        ja: [
          { id: "ky1", title: "特急「ゆふいんの森」＆九州横断バス（別府〜黒川〜阿蘇）予約", sub: "JR九州ネット予約・高速バス予約サイトで1ヶ月前手配推奨" }
        ]
      });
      return {
        id: "kyushu8",
        startDate: start,
        endDate: addDaysYmd(start, 7).ymd,
        titleEn: "Kyushu & Hot Springs: Fukuoka, Beppu, Yufuin, Kurokawa & Kumamoto",
        titleJa: "九州名湯巡り：福岡・別府・由布院・黒川温泉・熊本",
        subtitleEn: "Ohori Park Sakura, Yufuin no Mori Express, Beppu Hells, Kurokawa Onsen & Mt. Aso Caldera",
        subtitleJa: "大濠公園の桜・ゆふいんの森・別府地獄めぐり・黒川温泉湯めぐり＆阿蘇・熊本城",
        selectedPassId: "none",
        passStartDay: 1,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    if (presetKey === "kansaiHiroshima8") {
      const start = "2026-11-12";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Kansai", regJa: "京都",
          titleEn: "Arrive Kansai Airport (KIX) → Kyoto Station, Fushimi Inari & Pontocho",
          titleJa: "関西国際空港（KIX）到着 → 京都駅・伏見稲荷大社＆先斗町",
          subEn: "JR Haruka Express (75 min) from KIX to Kyoto Station, dusk walk at Fushimi Inari torii",
          subJa: "関空特急はるか（75分）で京都駅直結。夕暮れの伏見稲荷・千本鳥居と先斗町散策",
          stay: 17500, travelBase: 46000, travelActualAdd: 0, fun: 10000,
          hotelEn: "Hotel Granvia Kyoto", hotelJa: "ホテルグランヴィア京都",
          hotelUrl: "https://www.granviakyoto.com/", jrOnly: 2900, totalAllLegs: 2900,
          legsEn: ["Kansai Airport (KIX) → Kyoto Station (JR Haruka ¥2,900 + Flight)"],
          legsJa: ["関西空港 → 京都駅（JR特急はるか ¥2,900 ＋ 航空券）"],
          tipEn: "Hotel Granvia Kyoto sits directly inside JR Kyoto Station—drop luggage in 1 minute and ride 2 stops to Inari!",
          tipJa: "ホテルグランヴィア京都はJR京都駅直結！荷物預け後すぐにJR奈良線2駅で伏見稲荷へ。"
        },
        {
          regEn: "Kansai", regJa: "京都",
          titleEn: "Kyoto Autumn Foliage: Tofuku-ji Tsutenkyo, Kiyomizu-dera, Gion & Nishiki Market",
          titleJa: "京都紅葉絶景：東福寺 通天橋・清水寺・二年坂〜祇園＆錦市場",
          subEn: "Visit Tofuku-ji's famous crimson maple valley early, then Higashiyama & evening light-ups",
          subJa: "朝イチで紅葉の名所・東福寺通天橋へ！清水寺から産寧坂・祇園花見小路を散策",
          stay: 17500, travelBase: 0, travelActualAdd: 1100, fun: 13000,
          hotelEn: "Hotel Granvia Kyoto", hotelJa: "ホテルグランヴィア京都",
          hotelUrl: "https://www.granviakyoto.com/", jrOnly: 0, totalAllLegs: 1100,
          legsEn: ["Kyoto Subway & City Bus 1-Day Pass (¥1,100 • Non-JR)"],
          legsJa: ["京都地下鉄・バス1日券（¥1,100 • JR以外）"],
          tipEn: "Reach Tofuku-ji right at opening (08:30) for unforgettable Tsutenkyo crimson maple views with fewer crowds.",
          tipJa: "東福寺の紅葉は8:30開門直後の訪問が鉄則！駅からも1駅（JR奈良線）で好アクセス。"
        },
        {
          regEn: "Kansai", regJa: "京都・大阪",
          titleEn: "Kyoto Arashiyama Bamboo Grove & Tenryu-ji → Evening Transfer to Osaka Namba",
          titleJa: "京都 嵐山・竹林の小径・天龍寺紅葉 → 夕方に大阪なんば（道頓堀）へ移動",
          subEn: "Morning stroll across Togetsukyo Bridge & Yudofu lunch before 30-min train to Dotonbori",
          subJa: "朝の嵐山・渡月橋と天龍寺曹源池の紅葉を満喫後、大阪なんばへ移動して道頓堀グルメ",
          stay: 15500, travelBase: 1200, travelActualAdd: 0, fun: 12500,
          hotelEn: "Cross Hotel Osaka", hotelJa: "クロスホテル大阪（道頓堀・なんば）",
          hotelUrl: "https://cross-osaka.orixhotelsandresorts.com/", jrOnly: 1200, totalAllLegs: 1200,
          legsEn: ["Kyoto ↔ Arashiyama → Osaka Namba (JR & Metro ¥1,200)"],
          legsJa: ["京都 ↔ 嵐山 → 大阪なんば（JR嵯峨野線・新快速・大阪メトロ ¥1,200）"],
          tipEn: "Cross Hotel Osaka is just steps from the Dotonbori Glico sign—perfect for late-night takoyaki & okonomiyaki.",
          tipJa: "クロスホテル大阪は道頓堀グリコ看板まで徒歩1分！たこ焼き・お好み焼き食べ歩きに最適。"
        },
        {
          regEn: "Kansai", regJa: "大阪",
          titleEn: "Osaka Full Day: Osaka Castle, Kuromon Market, Shinsekai & Umeda Sky Building",
          titleJa: "大阪満喫：大阪城公園・黒門市場・新世界＆梅田スカイビル夜景",
          subEn: "Navigate Osaka seamlessly using the Official Osaka Metro Route Map PDF (Tab 7)",
          subJa: "タブ7の大阪メトロ公式路線図PDFを活用して大阪城から黒門市場・キタ・ミナミを網羅",
          stay: 15500, travelBase: 0, travelActualAdd: 820, fun: 13500,
          hotelEn: "Cross Hotel Osaka", hotelJa: "クロスホテル大阪（道頓堀・なんば）",
          hotelUrl: "https://cross-osaka.orixhotelsandresorts.com/", passCovered: true, jrOnly: 0, totalAllLegs: 820,
          legsEn: ["Osaka Metro 1-Day Enjoy Eco Card (¥820 • Non-JR)"],
          legsJa: ["大阪メトロ エンジョイエコカード 1日券（¥820 • JR以外）"],
          tipEn: "Day 1 of your 5-Day JR West Kansai-Hiroshima Area Pass starts tomorrow (Days 4–8 or Days 5–8 cover Kobe, Himeji, Hiroshima, Miyajima & KIX)!",
          tipJa: "明日または今日から「JR西日本 関西・広島エリアパス（5日間 ¥17,000）」を適用すると新幹線・関空特急が大幅お得に！"
        },
        {
          regEn: "Kansai", regJa: "神戸・有馬",
          titleEn: "Osaka → Kobe (A5 Kobe Beef, Kitano Ijinkan, Arima Onsen & Meriken Park)",
          titleJa: "大阪 → 神戸（三宮A5神戸牛・北野異人館・有馬温泉＆メリケンパーク）",
          subEn: "25-min JR Special Rapid to Kobe for teppanyaki Kobe beef, Arima golden baths & harbor stay",
          subJa: "JR新快速で神戸へ。三宮で神戸ビーフランチ、有馬温泉「金の湯」入浴＆神戸港夜景泊",
          stay: 18500, travelBase: 2400, travelActualAdd: 1400, fun: 16000,
          hotelEn: "Kobe Meriken Park Oriental Hotel", hotelJa: "神戸メリケンパークオリエンタルホテル",
          hotelUrl: "https://en.kobe-orientalhotel.co.jp/", passCovered: true, jrOnly: 1000, totalAllLegs: 2400,
          legsEn: ["Osaka → Sannomiya / Kobe (JR ¥1,000)", "Arima Onsen Subway/Kobe Electric & City Loop (¥1,400 • Non-JR)"],
          legsJa: ["大阪 → 三宮・神戸（JR新快速 ¥1,000）", "有馬温泉への神戸電鉄・シティループバス（¥1,400 • JR以外）"],
          tipEn: "Enjoy a Kobe beef teppanyaki lunch in Sannomiya (much better value than dinner!), afternoon dip in Arima Kin-no-Yu, and harbor views.",
          tipJa: "神戸ビーフ鉄板焼きはランチがお得！午後は有馬温泉で日本三古湯を満喫。"
        },
        {
          regEn: "Chugoku", regJa: "広島・宮島",
          titleEn: "Kobe (Shin-Kobe) → Himeji Castle → Hiroshima Peace Memorial Park",
          titleJa: "新神戸 → 国宝・姫路城 → 山陽新幹線で広島平和記念公園・原爆ドーム",
          subEn: "Sanyo Shinkansen stopover at white-heron Himeji Castle en route to Hiroshima",
          subJa: "山陽新幹線で白鷺城・姫路城を見学後、広島へ！原爆ドーム・平和記念公園＆広島お好み焼き",
          stay: 16000, travelBase: 10500, travelActualAdd: 0, fun: 11000,
          hotelEn: "Hotel Granvia Hiroshima", hotelJa: "ホテルグランヴィア広島",
          hotelUrl: "https://jrwest-hotels.jp/en/granvia-hiroshima/", passCovered: true, jrOnly: 10500, totalAllLegs: 10500,
          legsEn: ["Shin-Kobe → Himeji → Hiroshima (Sanyo Shinkansen ¥10,500 — Covered by Kansai-Hiroshima Pass!)"],
          legsJa: ["新神戸 → 姫路 → 広島（山陽新幹線 ¥10,500 — 関西・広島エリアパス対象！）"],
          tipEn: "With the JR West Kansai-Hiroshima Area Pass (¥17,000), Sanyo Shinkansen rides between Shin-Osaka/Shin-Kobe, Himeji & Hiroshima are 100% included!",
          tipJa: "関西・広島エリアパスなら新大阪・新神戸〜姫路〜広島の山陽新幹線が乗り放題で元が取れます！"
        },
        {
          regEn: "Chugoku", regJa: "広島・宮島",
          titleEn: "Hiroshima ↔ Miyajima Island (Itsukushima Floating Torii & Mt. Misen)",
          titleJa: "広島 ↔ 安芸の宮島（厳島神社・大鳥居・弥山ロープウェイ＆焼き牡蠣）",
          subEn: "JR Sanyo Line & JR West Miyajima Ferry to sacred Miyajima Island and Momijidani Park",
          subJa: "JR山陽線＆JR西日本宮島フェリーで厳島へ！紅葉谷公園の紅葉とあなごめし・揚げもみじ",
          stay: 16000, travelBase: 1240, travelActualAdd: 2000, fun: 12000,
          hotelEn: "Hotel Granvia Hiroshima", hotelJa: "ホテルグランヴィア広島",
          hotelUrl: "https://jrwest-hotels.jp/en/granvia-hiroshima/", passCovered: true, jrOnly: 1240, totalAllLegs: 3240,
          legsEn: ["Hiroshima ↔ Miyajima (JR Train & JR Ferry ¥1,240)", "Mt. Misen Ropeway Round-Trip (¥2,000 • Non-JR)"],
          legsJa: ["広島 ↔ 宮島（JR山陽本線＆JR西日本宮島フェリー ¥1,240）", "弥山ロープウェイ往復（¥2,000 • JR以外）"],
          tipEn: "Don't miss Anagomeshi Ueno conger eel rice near Miyajimaguchi and Momijidani Park's crimson maples beneath Mt. Misen.",
          tipJa: "宮島口の「あなごめし うえの」と厳島神社背後の紅葉谷公園のモミジは圧巻。"
        },
        {
          regEn: "Kansai", regJa: "大阪",
          titleEn: "Hiroshima → Shin-Osaka → Kansai Airport (KIX) Departure",
          titleJa: "広島 → 新大阪 → 関空特急はるかで関西空港（KIX）出発帰国",
          subEn: "Sanyo Shinkansen & Haruka Limited Express straight to KIX for your flight home",
          subJa: "山陽新幹線と関空特急はるかを乗り継ぎ、関西国際空港から帰路へ",
          stay: 0, travelBase: 54000, travelActualAdd: 0, fun: 9000,
          hotelEn: "Departure Day (Kansai Airport)", hotelJa: "帰国・出発日（関西国際空港）",
          hotelUrl: "", passCovered: true, jrOnly: 11500, totalAllLegs: 11500,
          legsEn: ["Hiroshima → Shin-Osaka → KIX (Sanyo Shinkansen + JR Haruka ¥11,500 + Return Flight)"],
          legsJa: ["広島 → 新大阪 → 関西空港（山陽新幹線＋はるか ¥11,500 ＋ 帰国航空券）"],
          tipEn: "5-Day JR West Kansai-Hiroshima Area Pass (¥17,000, Days 4–8) covers ¥24,240+ in Shinkansen, Haruka & ferry fares—saving over ¥7,200!",
          tipJa: "関西・広島エリアパス（¥17,000・5日間）でDay 4〜8のJR・新幹線・宮島フェリー計¥24,240以上がカバーされます！"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 2, rate: 17500, nameEn: "Hotel Granvia Kyoto", nameJa: "ホテルグランヴィア京都", regEn: "Kansai", regJa: "京都", url: "https://www.granviakyoto.com/", accEn: "Directly inside JR Kyoto Station Central Exit", accJa: "JR京都駅 中央口直結", hiEn: "Unbeatable Kyoto hub right above Shinkansen, Nara Line (Tofuku-ji/Inari), and subways.", hiJa: "新幹線・奈良線（東福寺・稲荷）・地下鉄バスターミナルすべて直結の最高拠点。" },
        { startDay: 3, nights: 2, rate: 15500, nameEn: "Cross Hotel Osaka (Dotonbori / Namba)", nameJa: "クロスホテル大阪（道頓堀・なんば）", regEn: "Kansai", regJa: "大阪", url: "https://cross-osaka.orixhotelsandresorts.com/", accEn: "3-min walk from Namba Station Exit 14 (1 min to Dotonbori)", accJa: "大阪メトロなんば駅14番出口徒歩3分（道頓堀徒歩1分）", hiEn: "Stylish lifestyle hotel in the center of Minami dining and shopping.", hiJa: "道頓堀と心斎橋筋のすぐそばに位置し、大阪グルメ＆ショッピングに最適。" },
        { startDay: 5, nights: 1, rate: 18500, nameEn: "Kobe Meriken Park Oriental Hotel", nameJa: "神戸メリケンパークオリエンタルホテル", regEn: "Kansai", regJa: "神戸・有馬", url: "https://en.kobe-orientalhotel.co.jp/", accEn: "Free shuttle bus from JR Sannomiya Station", accJa: "JR三宮駅から無料シャトルバス運行", hiEn: "270-degree harbor-view pier hotel surrounded by Kobe Port lights.", hiJa: "三方を海に囲まれ、全室バルコニー付で神戸港の夜景を堪能できる象徴的ホテル。", luxury: true },
        { startDay: 6, nights: 2, rate: 16000, nameEn: "Hotel Granvia Hiroshima", nameJa: "ホテルグランヴィア広島", regEn: "Chugoku", regJa: "広島・宮島", url: "https://jrwest-hotels.jp/en/granvia-hiroshima/", accEn: "Directly connected to JR Hiroshima Station Shinkansen Exit", accJa: "JR広島駅 新幹線口直結", hiEn: "Effortless access to Sanyo Shinkansen, Meipuru-pu bus & JR Miyajima line.", hiJa: "広島駅直結で新幹線・めいぷる〜ぷ・宮島方面への乗換が非常に快適。" }
      ]);
      const gList = window.buildGourmetListFromLocations(["Kyoto", "Osaka", "Kobe", "Hiroshima"]);
      const aList = window.buildAccessListFromKeys(["Kansai"]);
      const gdList = window.buildGuidesListFromKeys(["Kyoto", "Osaka", "Kobe", "Hiroshima"]);
      const prep = buildPrep({
        en: [
          { id: "kh1", title: "Buy 5-Day JR West Kansai-Hiroshima Area Pass (¥17,000)", sub: "Activate on Day 4 or Day 5 to cover Kobe, Himeji, Hiroshima, Miyajima Ferry & Haruka to KIX" }
        ],
        ja: [
          { id: "kh1", title: "JR西日本 関西・広島エリアパス（5日間 ¥17,000）手配", sub: "Day 4またはDay 5開始で姫路・広島・宮島フェリー・関空特急はるかを網羅" }
        ]
      });
      return {
        id: "kansaiHiroshima8",
        startDate: start,
        endDate: addDaysYmd(start, 7).ymd,
        titleEn: "Kyoto, Osaka, Kobe & Hiroshima West Japan Route",
        titleJa: "京都・大阪・神戸・広島 西日本ゴールデンルート",
        subtitleEn: "Tofuku-ji Maples, Osaka Dotonbori, Kobe Beef & Arima Onsen, Himeji Castle & Miyajima Torii",
        subtitleJa: "東福寺の紅葉・大阪道頓堀・神戸ビーフ＆有馬温泉・姫路城＆厳島神社",
        selectedPassId: "kansaiHiroshima5",
        passStartDay: 4,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    if (presetKey === "goldenRoute") {
      const start = "2026-11-08";
      const { enDays, jaDays } = buildBilingualDays(start, [
        {
          regEn: "Tokyo", regJa: "東京",
          titleEn: "Arrive in Tokyo (Haneda / Narita) → Shinjuku Evening",
          titleJa: "東京到着（羽田/成田）→ 新宿チェックイン＆夜の散策",
          subEn: "Airport express transfer to Shinjuku, Omoide Yokocho & Kabukicho",
          subJa: "空港から新宿へ移動し、思い出横丁や西新宿の都庁夜景を楽しむ",
          stay: 15000, travelBase: 48000, travelActualAdd: 0, fun: 8000,
          hotelEn: "Shinjuku Washington Hotel", hotelJa: "新宿ワシントンホテル",
          hotelUrl: "https://en.washington-hotels.jp/shinjuku/", jrOnly: 1500, totalAllLegs: 1500,
          legsEn: ["Airport → Shinjuku (¥1,500 + Flight)"],
          legsJa: ["空港 → 新宿（¥1,500 ＋ 航空券）"],
          tipEn: "Download the Tokyo, Kyoto & Osaka Metro PDF maps from Tab 7 before heading out!",
          tipJa: "タブ7から東京・京都・大阪の公式地下鉄路線図PDFを保存しておくと便利です。"
        },
        {
          regEn: "Tokyo", regJa: "東京",
          titleEn: "Tokyo Highlights: Asakusa Senso-ji, Meiji Jingu, Shibuya Sky & Ginza",
          titleJa: "東京名所巡り：浅草寺・明治神宮・渋谷スカイ＆銀座",
          subEn: "Classic Tokyo East-to-West city loop with sunset panorama from Shibuya Sky",
          subJa: "浅草から明治神宮・表参道・渋谷スカイ夕景・銀座を巡る東京王道ルート",
          stay: 15000, travelBase: 1000, travelActualAdd: 0, fun: 12000,
          hotelEn: "Shinjuku Washington Hotel", hotelJa: "新宿ワシントンホテル",
          hotelUrl: "https://en.washington-hotels.jp/shinjuku/", jrOnly: 1000, totalAllLegs: 1000,
          legsEn: ["Yamanote Line & Tokyo Metro Loop (¥1,000)"],
          legsJa: ["JR山手線＆東京メトロ周遊（¥1,000）"],
          tipEn: "Book your Shibuya Sky sunset entry ticket 4 weeks in advance online.",
          tipJa: "渋谷スカイの夕暮れ時間帯は4週間前の予約開始時に完売するため早め手配を。"
        },
        {
          regEn: "Chubu", regJa: "富士山・河口湖",
          titleEn: "Tokyo ↔ Mt. Fuji / Lake Kawaguchiko & Momiji Corridor",
          titleJa: "東京 ↔ 富士山・河口湖（もみじ回廊・ロープウェイ）日帰り",
          subEn: "Fuji Excursion Express or Highway Bus from Shinjuku to autumn maples by Lake Kawaguchiko",
          subJa: "新宿から特急富士回遊または高速バスで河口湖へ。秋の紅葉回廊＆ほうとう名物",
          stay: 15000, travelBase: 8260, travelActualAdd: 1500, fun: 9000,
          hotelEn: "Shinjuku Washington Hotel", hotelJa: "新宿ワシントンホテル",
          hotelUrl: "https://en.washington-hotels.jp/shinjuku/", jrOnly: 4400, totalAllLegs: 9760,
          legsEn: ["Shinjuku ↔ Otsuki (JR Chuo ¥4,400)", "Otsuki ↔ Kawaguchiko (Fujikyu Line ¥3,860 • Non-JR)", "Kawaguchiko Sightseeing Bus (¥1,500 • Non-JR)"],
          legsJa: ["新宿 ↔ 大月（JR中央線特急 ¥4,400）", "大月 ↔ 河口湖（富士急行線 ¥3,860 • JR以外）", "河口湖周遊バス（¥1,500 • JR以外）"],
          tipEn: "Savor steaming pumpkin Hoto flat noodles at Hoto Fudo right across from Kawaguchiko Station!",
          tipJa: "河口湖駅目の前の「ほうとう不動」でアツアツのかぼちゃ味噌ほうとうをぜひ。"
        },
        {
          regEn: "Chubu", regJa: "箱根",
          titleEn: "Tokyo → Hakone Open-Air Museum, Lake Ashi Cruise & Owakudani Ropeway",
          titleJa: "東京 → 箱根（彫刻の森・大涌谷ロープウェイ・芦ノ湖海賊船）＆温泉宿",
          subEn: "Odakyu Romancecar to Hakone-Yumoto, volcanic ropeway & kaiseki onsen ryokan stay",
          subJa: "小田急ロマンスカーで箱根湯本へ。ゴールデンコース周遊後は箱根温泉旅館で会席泊",
          stay: 28000, travelBase: 0, travelActualAdd: 6500, fun: 8000,
          hotelEn: "Hakone Yumoto Onsen Ryokan", hotelJa: "箱根湯本 温泉旅館",
          hotelUrl: "https://www.hakoneyumoto.com/", jrOnly: 0, totalAllLegs: 6500,
          legsEn: ["Shinjuku → Hakone-Yumoto → Odawara (Hakone Free Pass ¥6,500 • Non-JR)"],
          legsJa: ["新宿 → 箱根湯本 → 小田原（箱根フリーパス ¥6,500 • JR以外）"],
          tipEn: "Use Yamato Takkyubin luggage forwarding from your Tokyo hotel directly to Kyoto so you travel light in Hakone!",
          tipJa: "大きなスーツケースは東京のホテルから京都へ宅配便（宅急便）で送ると箱根観光が快適！"
        },
        {
          regEn: "Kansai", regJa: "京都",
          titleEn: "Odawara / Hakone → Kyoto (Fushimi Inari Taisha & Gion Evening)",
          titleJa: "小田原 / 箱根 → 東海道新幹線で京都へ（伏見稲荷大社＆祇園散策）",
          subEn: "Tokaido Shinkansen Hikari from Odawara straight to Kyoto, dusk vermilion torii walk",
          subJa: "小田原駅から東海道新幹線ひかりで京都へ直通！千本鳥居と祇園・先斗町ディナー",
          stay: 16000, travelBase: 12320, travelActualAdd: 0, fun: 11000,
          hotelEn: "Hotel Granvia Kyoto", hotelJa: "ホテルグランヴィア京都",
          hotelUrl: "https://www.granviakyoto.com/", jrOnly: 12320, totalAllLegs: 12320,
          legsEn: ["Odawara → Kyoto (Tokaido Shinkansen Hikari ¥12,320)"],
          legsJa: ["小田原 → 京都（東海道新幹線ひかり ¥12,320）"],
          tipEn: "Sit on the right (E seat) out of Odawara for a close-up view of Mt. Fuji passing by 15 minutes into the ride!",
          tipJa: "小田原発の新幹線は進行方向右側（E席）にすると、発車後すぐに富士山の絶景が楽しめます！"
        },
        {
          regEn: "Kansai", regJa: "京都",
          titleEn: "Kyoto: Arashiyama Bamboo Grove, Kinkaku-ji, Kiyomizu-dera & Tofuku-ji",
          titleJa: "京都終日：嵐山・竹林の小径・金閣寺・清水寺＆東福寺紅葉",
          subEn: "UNESCO temples in peak November foliage plus Nishiki Market & Uji matcha treats",
          subJa: "11月の京都紅葉ベストシーズン！嵐山・金閣寺・清水寺と錦市場の食べ歩き",
          stay: 16000, travelBase: 0, travelActualAdd: 1100, fun: 13000,
          hotelEn: "Hotel Granvia Kyoto", hotelJa: "ホテルグランヴィア京都",
          hotelUrl: "https://www.granviakyoto.com/", jrOnly: 500, totalAllLegs: 1100,
          legsEn: ["Kyoto Subway/Bus 1-Day Pass + JR Sagano to Arashiyama (¥1,100)"],
          legsJa: ["JR嵯峨野線＆京都市バス・地下鉄1日券（¥1,100）"],
          tipEn: "Reach Arashiyama Bamboo Grove before 08:15 for serene photos before tour groups arrive.",
          tipJa: "嵐山の竹林の小径は朝8時前の早朝散策が静かで圧倒的におすすめ。"
        },
        {
          regEn: "Kansai", regJa: "京都・大阪",
          titleEn: "Kyoto → Nara Park (Todai-ji Great Buddha & Deer) → Osaka Dotonbori",
          titleJa: "京都 → 奈良公園（東大寺大仏殿＆春日大社）→ 大阪・道頓堀泊",
          subEn: "Day trip through historic Nara before checking into lively Namba/Dotonbori",
          subJa: "古都・奈良の東大寺と鹿に癒された後、夜は食いだおれの街・大阪道頓堀へ",
          stay: 14500, travelBase: 1600, travelActualAdd: 0, fun: 12000,
          hotelEn: "Cross Hotel Osaka (Dotonbori)", hotelJa: "クロスホテル大阪（道頓堀・なんば）",
          hotelUrl: "https://cross-osaka.orixhotelsandresorts.com/", jrOnly: 1600, totalAllLegs: 1600,
          legsEn: ["Kyoto → Nara → Osaka Namba (JR / Kintetsu ¥1,600)"],
          legsJa: ["京都 → 奈良 → 大阪難波（JR奈良線・大和路快速 / 近鉄 ¥1,600）"],
          tipEn: "Store luggage in Kintetsu-Nara or JR Nara coin lockers while touring Todai-ji Temple.",
          tipJa: "奈良駅・近鉄奈良駅のコインロッカーに荷物を預けて東大寺・奈良公園を身軽に散策。"
        },
        {
          regEn: "Chugoku", regJa: "広島・宮島",
          titleEn: "Osaka ↔ Hiroshima Peace Park & Miyajima Itsukushima Shrine",
          titleJa: "大阪 ↔ 広島平和記念公園＆安芸の宮島（厳島神社・大鳥居）日帰り",
          subEn: "Sanyo Shinkansen day trip to Hiroshima & Miyajima's floating vermilion torii",
          subJa: "山陽新幹線で広島へ日帰り旅。原爆ドーム見学と宮島の厳島神社＆広島焼き・焼き牡蠣",
          stay: 14500, travelBase: 21500, travelActualAdd: 0, fun: 10000,
          hotelEn: "Cross Hotel Osaka (Dotonbori)", hotelJa: "クロスホテル大阪（道頓堀・なんば）",
          hotelUrl: "https://cross-osaka.orixhotelsandresorts.com/", passCovered: true, jrOnly: 21500, totalAllLegs: 21500,
          legsEn: ["Shin-Osaka ↔ Hiroshima ↔ Miyajimaguchi (Shinkansen + Ferry ¥21,500)"],
          legsJa: ["新大阪 ↔ 広島 ↔ 宮島口（山陽新幹線＋宮島フェリー ¥21,500）"],
          tipEn: "Pro tip: Buy the 5-Day JR West Kansai-Hiroshima Pass (¥17,000) instead of a Nationwide ¥50,000 JR Pass—this one day trip pays it off alone!",
          tipJa: "重要節約術：全国版JRパス(¥50,000)ではなく「関西・広島エリアパス(¥17,000)」を使えばこの日帰り往復だけで¥4,500以上お釣りが来ます！"
        },
        {
          regEn: "Kansai", regJa: "大阪",
          titleEn: "Osaka Castle, Kuromon Ichiba Market & Umeda Sky Building",
          titleJa: "大阪終日：大阪城天守閣・黒門市場食べ歩き＆梅田スカイビル",
          subEn: "Full day of Osaka landmarks, fresh market seafood, kushikatsu & sunset city views",
          subJa: "豊臣秀吉ゆかりの大坂城から黒門市場の海鮮串・新世界串カツ、梅田空中庭園まで",
          stay: 14500, travelBase: 0, travelActualAdd: 900, fun: 14000,
          hotelEn: "Cross Hotel Osaka (Dotonbori)", hotelJa: "クロスホテル大阪（道頓堀・なんば）",
          hotelUrl: "https://cross-osaka.orixhotelsandresorts.com/", jrOnly: 0, totalAllLegs: 900,
          legsEn: ["Osaka Metro 1-Day Pass (¥900 • Non-JR)"],
          legsJa: ["Osaka Metro 1日乗車券（¥900 • JR以外）"],
          tipEn: "Taste Kuromon Market grilled scallops & 551 Horai steamed pork buns before heading to Umeda Sky Building.",
          tipJa: "黒門市場のホタテ焼きや551蓬莱の豚まんを味わい、夕方は梅田スカイビルへ。"
        },
        {
          regEn: "Kansai", regJa: "大阪",
          titleEn: "Osaka → Kansai International Airport (KIX) Departure",
          titleJa: "大阪・なんば → 関西国際空港（KIX）出発帰国",
          subEn: "JR Haruka or Nankai Rapi:t Express straight to KIX for your flight home",
          subJa: "JRはるかまたは南海ラピートで関西国際空港へ移動し帰国便へ",
          stay: 0, travelBase: 48000, travelActualAdd: 0, fun: 9000,
          hotelEn: "Departure Day (Kansai Airport)", hotelJa: "帰国・出発日（関西国際空港）",
          hotelUrl: "", jrOnly: 2900, totalAllLegs: 2900,
          legsEn: ["Osaka / Tennoji → KIX (JR Haruka ¥2,900 + Return Flight)"],
          legsJa: ["大阪・天王寺 → 関西空港（JR特急はるか ¥2,900 ＋ 帰国航空券）"],
          tipEn: "Test Tab 5's Optimizer: comparing 'No Rail Pass' vs '5-Day Kansai-Hiroshima Pass (¥17,000)' vs '7-Day Nationwide JR Pass (¥50,000)' shows why point-to-point + regional pass wins!",
          tipJa: "タブ5で検証可能：全国版7日間JRパス(¥50,000)より、区間きっぷ＋関西広島パス(¥17,000)の方が大幅に節約できます！"
        }
      ]);
      const { enHotels, jaHotels } = buildBilingualHotels(start, [
        { startDay: 1, nights: 3, rate: 15000, nameEn: "Shinjuku Washington Hotel (Tokyo)", nameJa: "新宿ワシントンホテル（東京）", regEn: "Tokyo", regJa: "東京", url: "https://en.washington-hotels.jp/shinjuku/", accEn: "8-min walk from JR Shinjuku Station South Exit", accJa: "JR新宿駅 南口より徒歩8分", hiEn: "West Tokyo base ideal for Mt. Fuji buses and Odakyu Romancecar to Hakone.", hiJa: "バスタ新宿・小田急線乗り場に近く河口湖・箱根方面への出発拠点に最適。" },
        { startDay: 4, nights: 1, rate: 28000, nameEn: "Hakone Yumoto Onsen Ryokan", nameJa: "箱根湯本 温泉旅館", regEn: "Chubu", regJa: "箱根", url: "https://www.hakoneyumoto.com/", accEn: "5-min shuttle from Hakone-Yumoto Station", accJa: "箱根湯本駅より送迎5分", hiEn: "Traditional hot spring ryokan with open-air rotenburo and seasonal kaiseki.", hiJa: "渓流沿いの露天風呂と季節の会席料理を味わう箱根温泉泊。", luxury: true },
        { startDay: 5, nights: 2, rate: 16000, nameEn: "Hotel Granvia Kyoto", nameJa: "ホテルグランヴィア京都", regEn: "Kansai", regJa: "京都", url: "https://www.granviakyoto.com/", accEn: "Directly inside JR Kyoto Station", accJa: "JR京都駅直結", hiEn: "Steps from Shinkansen platforms, Nara Line, and Kyoto City buses.", hiJa: "新幹線・在来線・バスターミナルすべて駅直結の好立地。" },
        { startDay: 7, nights: 3, rate: 14500, nameEn: "Cross Hotel Osaka (Dotonbori / Namba)", nameJa: "クロスホテル大阪（道頓堀・なんば）", regEn: "Kansai", regJa: "大阪", url: "https://cross-osaka.orixhotelsandresorts.com/", accEn: "3-min walk from Namba Station & Dotonbori Glico Sign", accJa: "大阪メトロなんば駅徒歩3分・道頓堀すぐ", hiEn: "Vibrant Osaka culinary and shopping hub.", hiJa: "道頓堀・黒門市場へのアクセス抜群のミナミ中心拠点。" }
      ]);
      const gList = window.buildGourmetListFromLocations(["Tokyo", "Hakone", "Kyoto", "Osaka"]);
      const aList = window.buildAccessListFromKeys(["Tokyo", "Onsen", "Kansai"]);
      const gdList = window.buildGuidesListFromKeys(["Tokyo", "Onsen", "Kyoto", "Osaka"]);
      const prep = buildPrep({
        en: [
          { id: "gr1", title: "Book Tokaido Shinkansen (SmartEX) & Shibuya Sky Sunset Slot", sub: "Reserve E-seats on Odawara → Kyoto Shinkansen for Mt. Fuji views" },
          { id: "gr2", title: "Consider 5-Day JR West Kansai-Hiroshima Pass (¥17,000) for Days 6–10", sub: "Covers Osaka↔Hiroshima↔Miyajima + Haruka Express to KIX" }
        ],
        ja: [
          { id: "gr1", title: "東海道新幹線（スマートEX）＆渋谷スカイ夕暮れチケット予約", sub: "小田原→京都間は進行方向右側E席を指定すると富士山が見えます" },
          { id: "gr2", title: "Day 6〜10用に関西・広島エリアパス（¥17,000）検討", sub: "新大阪〜広島・宮島往復＋関空はるか乗車で元が取れます" }
        ]
      });
      return {
        id: "goldenRoute",
        startDate: start,
        endDate: addDaysYmd(start, 9).ymd,
        titleEn: "Golden Route: Tokyo, Mt. Fuji, Kyoto & Osaka",
        titleJa: "ゴールデンルート：東京・富士山・京都・大阪",
        subtitleEn: "Classic Tokyo, Lake Kawaguchiko, Hakone Onsen, Kyoto, Nara, Hiroshima & Osaka",
        subtitleJa: "東京・富士山河口湖・箱根温泉・京都・奈良・広島・大阪を巡る王道10日間",
        selectedPassId: "none",
        passStartDay: 5,
        dataEn: { days: enDays, hotels: enHotels, food: gList.en, access: aList.en, guides: gdList.en, prep: prep.en, weather: {} },
        dataJa: { days: jaDays, hotels: jaHotels, food: gList.ja, access: aList.ja, guides: gdList.ja, prep: prep.ja, weather: {} }
      };
    }

    // Internal fallback when buildBlankTripPayload is requested via legacy id
    return window.buildBlankTripPayload({});
  };
})();
