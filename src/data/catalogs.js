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

// Curated Regional Gourmet, Transit & Guide Sync Engine (v2.2.0)
// Prioritizes matching City Catalogs (80 sightseeing hubs incl. 32+ priority cities) and falls back to 47 Prefecture Catalogs.

const AREA_TO_TABELOG_SLUG = {
  // Region / city keyword fallbacks -> Tabelog prefecture URL slug
  tokyo: "tokyo", shinjuku: "tokyo", shibuya: "tokyo", ginza: "tokyo", asakusa: "tokyo", toyosu: "tokyo",
  kyoto: "kyoto", uji: "kyoto", arashiyama: "kyoto", gion: "kyoto",
  osaka: "osaka", namba: "osaka", dotonbori: "osaka", umeda: "osaka",
  kobe: "hyogo", arima: "hyogo", himeji: "hyogo", kinosaki: "hyogo", awaji: "hyogo", hyogo: "hyogo",
  nara: "nara", nara_pref: "nara",
  sapporo: "hokkaido", otaru: "hokkaido", hakodate: "hokkaido", noboribetsu: "hokkaido", asahikawa: "hokkaido", chitose: "hokkaido", rebun: "hokkaido", furano: "hokkaido", niseko: "hokkaido", hokkaido: "hokkaido",
  sendai: "miyagi", matsushima: "miyagi", miyagi: "miyagi",
  aomori: "aomori", hachinohe: "aomori", hirosaki: "aomori", mutsu: "aomori", oirase: "aomori",
  morioka: "iwate", iwate: "iwate", hiraizumi: "iwate",
  nyuto: "akita", akita: "akita", tazawako: "akita",
  yamagata: "yamagata", ginzan: "yamagata", zao: "yamagata", tsuruoka: "yamagata", kaminoyama: "yamagata", tendo: "yamagata", yamadera: "yamagata",
  aizu: "fukushima", fukushima: "fukushima",
  nikko: "tochigi", kinugawa: "tochigi", tochigi: "tochigi",
  kusatsu: "gunma", takasaki: "gunma", gunma: "gunma",
  yokohama: "kanagawa", kamakura: "kanagawa", hakone: "kanagawa", enoshima: "kanagawa", kanagawa: "kanagawa",
  kawaguchiko: "yamanashi", fujikawaguchiko: "yamanashi", yamanashi: "yamanashi",
  shizuoka: "shizuoka", atami: "shizuoka", izu: "shizuoka", hamamatsu: "shizuoka", shimoda: "shizuoka",
  nagano: "nagano", matsumoto: "nagano", hakuba: "nagano", azumino: "nagano", karuizawa: "nagano",
  niigata: "niigata", sado: "niigata",
  kanazawa: "ishikawa", kaga: "ishikawa", ishikawa: "ishikawa",
  takayama: "gifu", shirakawa: "gifu", hida: "gifu", gifu: "gifu",
  nagoya: "aichi", aichi: "aichi",
  ise: "mie", shima: "mie", mie: "mie",
  koyasan: "wakayama", wakayama: "wakayama", shirahama: "wakayama",
  tottori: "tottori",
  matsue: "shimane", izumo: "shimane", shimane: "shimane",
  okayama: "okayama", kurashiki: "okayama",
  hiroshima: "hiroshima", miyajima: "hiroshima", onomichi: "hiroshima",
  shimonoseki: "yamaguchi", yamaguchi: "yamaguchi",
  takamatsu: "kagawa", naoshima: "kagawa", kagawa: "kagawa",
  matsuyama: "ehime", dogo: "ehime", ehime: "ehime",
  fukuoka: "fukuoka", hakata: "fukuoka", dazaifu: "fukuoka",
  beppu: "oita", yufuin: "oita", oita: "oita",
  nagasaki: "nagasaki",
  kumamoto: "kumamoto", aso: "kumamoto", kurokawa: "kumamoto",
  kagoshima: "kagoshima", yakushima: "kagoshima",
  okinawa: "okinawa", naha: "okinawa", ishigaki: "okinawa", miyako: "okinawa", taketomi: "okinawa", onna: "okinawa"
};

function resolvePrefSlugFromMeta(prefId, areaText) {
  if (prefId && window.getPrefectureById) {
    const p = window.getPrefectureById(prefId);
    if (p && p.tabelogSlug) return p.tabelogSlug;
  }
  const raw = String(areaText || "");
  if (!raw.trim()) return "";
  if (typeof window.prepareGazetteerText === "function" && typeof window.gazetteerKeyMatches === "function" && Array.isArray(window.JAPAN_GAZETTEER)) {
    const prep = window.prepareGazetteerText(raw);
    const cityStop = window.JAPAN_GAZETTEER.find(g => !g.isPrefFallback && g.keys.some(k => window.gazetteerKeyMatches(prep, k)));
    if (cityStop && cityStop.prefId) {
      const p = window.getPrefectureById ? window.getPrefectureById(cityStop.prefId) : null;
      return (p && p.tabelogSlug) || cityStop.prefId;
    }
    const prefStop = window.JAPAN_GAZETTEER.find(g => g.isPrefFallback && g.keys.some(k => window.gazetteerKeyMatches(prep, k)));
    if (prefStop && prefStop.prefId) {
      const p = window.getPrefectureById ? window.getPrefectureById(prefStop.prefId) : null;
      return (p && p.tabelogSlug) || prefStop.prefId;
    }
  }
  const low = raw.toLowerCase();
  const norm = typeof window.normalizeJapanRomaji === "function" ? window.normalizeJapanRomaji(low) : low;
  for (const key of Object.keys(AREA_TO_TABELOG_SLUG)) {
    const re = new RegExp(`(?:^|[^a-z])${key}(?:$|[^a-z])`);
    if (re.test(low) || re.test(norm)) return AREA_TO_TABELOG_SLUG[key];
  }
  if (typeof window.resolveLocationInputStops === "function") {
    const resolved = window.resolveLocationInputStops(raw);
    if (resolved[0] && resolved[0].prefId) {
      const p = window.getPrefectureById ? window.getPrefectureById(resolved[0].prefId) : null;
      return (p && p.tabelogSlug) || resolved[0].prefId;
    }
  }
  return "";
}

function cleanVenueQuery(placeName) {
  let q = String(placeName || "")
    .split("/")[0]
    .split("／")[0]
    .split("+")[0]
    .split("&")[0]
    .split("・")[0]
    .replace(/\([^)]*\)/g, "")
    .replace(/（[^）]*）/g, "")
    .trim();
  return q || String(placeName || "").trim();
}

window.buildTabelogSearchUrl = function(placeName, areaName, isJa, prefId) {
  const q = cleanVenueQuery(placeName);
  const slug = resolvePrefSlugFromMeta(prefId, placeName) || resolvePrefSlugFromMeta(prefId, areaName);
  if (!q) {
    if (slug) return isJa ? `https://tabelog.com/${slug}/` : `https://tabelog.com/en/${slug}/`;
    return isJa ? "https://tabelog.com/" : "https://tabelog.com/en/";
  }
  if (slug) {
    return isJa
      ? `https://tabelog.com/${slug}/rstLst/?vs=1&sw=${encodeURIComponent(q)}`
      : `https://tabelog.com/en/${slug}/rstLst/?sw=${encodeURIComponent(q)}`;
  }
  const combined = areaName ? `${q} ${String(areaName).split("/")[0].trim()}` : q;
  return isJa
    ? `https://tabelog.com/rstLst/?vs=1&sw=${encodeURIComponent(combined)}`
    : `https://tabelog.com/en/rstLst/?sw=${encodeURIComponent(combined)}`;
};

window.resolveTabelogUrlForItem = function(item, isJa) {
  if (!item) return "";
  const raw = String((isJa ? (item.tabelogUrlJa || item.tabelogUrl) : (item.tabelogUrl || item.tabelogUrlJa)) || "").trim();
  if (raw && /^https?:\/\/(?:[a-z0-9-]+\.)?tabelog\.com\//i.test(raw)) {
    return raw;
  }
  return window.buildTabelogSearchUrl(item.place || "", item.region || "", !!isJa, item.prefId || "");
};

const LEGACY_KEY_TO_PACKS = {
  Tokyo: [{ type: "city", key: "tokyo" }],
  Kyoto: [{ type: "city", key: "kyoto" }],
  Osaka: [{ type: "city", key: "osaka" }],
  Kobe: [{ type: "city", key: "kobe" }],
  Kanazawa: [{ type: "city", key: "kanazawa" }],
  Takayama: [{ type: "city", key: "takayama" }],
  Hiroshima: [{ type: "city", key: "hiroshima" }, { type: "city", key: "miyajima" }],
  Sapporo: [{ type: "city", key: "sapporo" }, { type: "city", key: "otaru" }],
  Noboribetsu: [{ type: "city", key: "noboribetsu" }],
  Hakodate: [{ type: "city", key: "hakodate" }],
  Fukuoka: [{ type: "city", key: "fukuoka" }],
  Beppu: [{ type: "city", key: "beppu" }],
  Kumamoto: [{ type: "city", key: "kumamoto" }],
  Okinawa: [{ type: "city", key: "naha" }, { type: "city", key: "onna_son" }],
  Ishigaki: [{ type: "city", key: "ishigaki" }, { type: "city", key: "taketomi" }],
  Onsen: [{ type: "city", key: "hakone" }, { type: "city", key: "kawaguchiko" }],
  Hakone: [{ type: "city", key: "hakone" }],
  Aomori: [{ type: "city", key: "shin_aomori" }, { type: "city", key: "hirosaki" }, { type: "pref", key: "aomori" }],
  Sendai: [{ type: "city", key: "sendai" }, { type: "city", key: "matsushima" }],
  IzuShizuoka: [{ type: "city", key: "atami" }, { type: "city", key: "izu" }, { type: "city", key: "shizuoka" }],
  GunmaAlps: [{ type: "city", key: "matsumoto" }, { type: "city", key: "kusatsu_onsen" }, { type: "city", key: "takasaki" }],
  Hokkaido: [{ type: "pref", key: "hokkaido" }],
  Kyushu: [{ type: "pref", key: "fukuoka" }, { type: "city", key: "beppu" }, { type: "city", key: "kumamoto" }],
  Kansai: [{ type: "pref", key: "kyoto" }, { type: "pref", key: "osaka" }, { type: "pref", key: "nara" }, { type: "city", key: "kobe" }]
};

function getPackByRef(ref) {
  if (!ref) return null;
  if (ref.type === "city") return (window.CITY_CATALOGS && window.CITY_CATALOGS[ref.key]) || null;
  if (ref.type === "pref") return (window.PREFECTURE_CATALOGS && window.PREFECTURE_CATALOGS[ref.key]) || null;
  return null;
}

function localizeFoodEntry(it, isJa, idVal) {
  return {
    id: idVal,
    prefId: it.prefId || "",
    cityKey: it.cityKey || "",
    region: isJa ? (it.regionJa || it.regionEn) : (it.regionEn || it.regionJa),
    dish: isJa ? (it.dishJa || it.dishEn) : (it.dishEn || it.dishJa),
    place: isJa ? (it.placeJa || it.placeEn) : (it.placeEn || it.placeJa),
    url: it.url || "",
    tabelogUrl: window.resolveTabelogUrlForItem({
      place: isJa ? (it.placeJa || it.placeEn) : (it.placeEn || it.placeJa),
      region: isJa ? (it.regionJa || it.regionEn) : (it.regionEn || it.regionJa),
      prefId: it.prefId || "",
      tabelogUrl: it.tabelogUrl || "",
      tabelogUrlJa: it.tabelogUrlJa || ""
    }, isJa),
    tabelogScore: it.score || "★ 3.55",
    transitLevel: it.transitLevel || "easy",
    transitText: isJa ? (it.transitJa || it.transitEn) : (it.transitEn || it.transitJa),
    sourceTag: isJa ? (it.tagJa || it.tagEn) : (it.tagEn || it.tagJa),
    note: isJa ? (it.noteJa || it.noteEn) : (it.noteEn || it.noteJa),
    tried: false
  };
}

function localizeAccessEntry(it, isJa, idVal) {
  return {
    id: idVal,
    prefId: it.prefId || "",
    cityKey: it.cityKey || "",
    area: isJa ? (it.areaJa || it.areaEn) : (it.areaEn || it.areaJa),
    day: isJa ? (it.dayJa || it.dayEn) : (it.dayEn || it.dayJa),
    place: isJa ? (it.placeJa || it.placeEn) : (it.placeEn || it.placeJa),
    url: it.url || "",
    note: isJa ? (it.noteJa || it.noteEn) : (it.noteEn || it.noteJa),
    isExisting: it.isExisting !== false
  };
}

function localizeGuideEntry(it, isJa, idVal) {
  return {
    id: idVal,
    prefId: it.prefId || "",
    cityKey: it.cityKey || "",
    area: isJa ? (it.areaJa || it.areaEn) : (it.areaEn || it.areaJa),
    day: isJa ? (it.dayJa || it.dayEn) : (it.dayEn || it.dayJa),
    location: isJa ? (it.locJa || it.locEn) : (it.locEn || it.locJa),
    url: it.url || "",
    note: isJa ? (it.noteJa || it.noteEn) : (it.noteEn || it.noteJa),
    isExisting: true
  };
}

function buildListsFromPacks(packs, idBase) {
  const foodEn = [], foodJa = [], accEn = [], accJa = [], gEn = [], gJa = [];
  const seenFood = new Set(), seenAcc = new Set(), seenG = new Set();
  const numBase = typeof idBase === "number" ? idBase : 0;
  const strTag = typeof idBase === "number" ? `sync_${idBase}` : "cat";
  packs.forEach(p => {
    if (!p) return;
    (p.food || []).forEach(it => {
      const k = `${it.dishEn}|${it.placeEn}`;
      if (seenFood.has(k)) return;
      seenFood.add(k);
      const fid = numBase + foodEn.length + 1;
      foodEn.push(localizeFoodEntry(it, false, fid));
      foodJa.push(localizeFoodEntry(it, true, fid));
    });
    (p.access || []).forEach(it => {
      const k = `${it.placeEn}|${it.areaEn}`;
      if (seenAcc.has(k)) return;
      seenAcc.add(k);
      const aid = `acc_${strTag}_${accEn.length + 1}`;
      accEn.push(localizeAccessEntry(it, false, aid));
      accJa.push(localizeAccessEntry(it, true, aid));
    });
    (p.guides || []).forEach(it => {
      const k = `${it.locEn}|${it.areaEn}`;
      if (seenG.has(k)) return;
      seenG.add(k);
      const gid = `gd_${strTag}_${gEn.length + 1}`;
      gEn.push(localizeGuideEntry(it, false, gid));
      gJa.push(localizeGuideEntry(it, true, gid));
    });
  });
  return {
    food: { en: foodEn, ja: foodJa },
    access: { en: accEn, ja: accJa },
    guides: { en: gEn, ja: gJa }
  };
}

function resolvePacksForLegacyKeys(keys) {
  const seen = new Set();
  const packs = [];
  (keys || []).forEach(k => {
    const refs = LEGACY_KEY_TO_PACKS[k];
    if (refs) {
      refs.forEach(r => {
        const p = getPackByRef(r);
        if (p && !seen.has(p)) { seen.add(p); packs.push(p); }
      });
      return;
    }
    if (window.CITY_CATALOGS && window.CITY_CATALOGS[k]) {
      const p = window.CITY_CATALOGS[k];
      if (!seen.has(p)) { seen.add(p); packs.push(p); }
    } else if (window.PREFECTURE_CATALOGS && window.PREFECTURE_CATALOGS[k]) {
      const p = window.PREFECTURE_CATALOGS[k];
      if (!seen.has(p)) { seen.add(p); packs.push(p); }
    }
  });
  return packs;
}

window.buildGourmetListFromLocations = function(locKeys) {
  return buildListsFromPacks(resolvePacksForLegacyKeys(locKeys)).food;
};

window.buildAccessListFromKeys = function(keys) {
  return buildListsFromPacks(resolvePacksForLegacyKeys(keys)).access;
};

window.buildGuidesListFromKeys = function(keys) {
  return buildListsFromPacks(resolvePacksForLegacyKeys(keys)).guides;
};

// Backwards-compatible legacy maps populated cleanly from City & Prefecture catalogs
window.GOURMET_BY_LOC = {};
window.METRO_ACCESS_BY_LOC = {};
window.GUIDES_BY_LOC = {};
Object.keys(LEGACY_KEY_TO_PACKS).forEach(k => {
  const built = buildListsFromPacks(resolvePacksForLegacyKeys([k]));
  window.GOURMET_BY_LOC[k] = built.food.en;
  window.METRO_ACCESS_BY_LOC[k] = built.access.en;
  window.GUIDES_BY_LOC[k] = built.guides.en;
});

window.WIZARD_CITIES = [
  { key: "Tokyo", icon: "🗼", labelEn: "🗼 Tokyo", labelJa: "🗼 東京", regEn: "Tokyo", regJa: "東京", hotelEn: "Mitsui Garden Hotel Nihonbashi Premier", hotelJa: "三井ガーデンホテル日本橋プレミア", foodKeys: ["Tokyo"], accessKeys: ["Tokyo"], guideKeys: ["Tokyo"] },
  { key: "Kyoto", icon: "⛩️", labelEn: "⛩️ Kyoto", labelJa: "⛩️ 京都", regEn: "Kyoto", regJa: "京都", hotelEn: "Mitsui Garden Hotel Kyoto Shijo", hotelJa: "三井ガーデンホテル京都四条", foodKeys: ["Kyoto"], accessKeys: ["Kansai"], guideKeys: ["Kyoto"] },
  { key: "Osaka", icon: "🏮", labelEn: "🏮 Osaka", labelJa: "🏮 大阪", regEn: "Osaka", regJa: "大阪", hotelEn: "Cross Hotel Osaka", hotelJa: "クロスホテル大阪", foodKeys: ["Osaka"], accessKeys: ["Kansai"], guideKeys: ["Osaka"] },
  { key: "Hiroshima", icon: "🦌", labelEn: "🦌 Hiroshima", labelJa: "🦌 広島", regEn: "Hiroshima", regJa: "広島", hotelEn: "Hotel Granvia Hiroshima", hotelJa: "ホテルグランヴィア広島", foodKeys: ["Hiroshima"], accessKeys: ["Kansai"], guideKeys: ["Hiroshima"] },
  { key: "Hakone", icon: "♨️", labelEn: "♨️ Hakone", labelJa: "♨️ 箱根", regEn: "Hakone", regJa: "箱根", hotelEn: "Hakone Kowakien Ten-yu", hotelJa: "箱根小涌園 天悠", foodKeys: ["Hakone"], accessKeys: ["Hakone"], guideKeys: ["Hakone"] },
  { key: "Kanazawa", icon: "🏯", labelEn: "🏯 Kanazawa", labelJa: "🏯 金沢", regEn: "Kanazawa", regJa: "金沢", hotelEn: "Mitsui Garden Hotel Kanazawa", hotelJa: "三井ガーデンホテル金沢", foodKeys: ["Kanazawa"], accessKeys: ["Kanazawa"], guideKeys: ["Kanazawa"] },
  { key: "Takayama", icon: "🏔️", labelEn: "🏔️ Takayama", labelJa: "🏔️ 高山", regEn: "Takayama", regJa: "高山", hotelEn: "Mercure Hida Takayama", hotelJa: "メルキュール飛騨高山", foodKeys: ["Takayama"], accessKeys: ["Kanazawa", "GunmaAlps"], guideKeys: ["Takayama"] },
  { key: "Aomori", icon: "🍎", labelEn: "🍎 Aomori", labelJa: "🍎 青森", regEn: "Aomori", regJa: "青森", hotelEn: "Daiwa Roynet Hotel Aomori", hotelJa: "ダイワロイネットホテル青森", foodKeys: ["Aomori"], accessKeys: ["Aomori"], guideKeys: ["Aomori"] },
  { key: "Fukuoka", icon: "🍜", labelEn: "🍜 Fukuoka", labelJa: "🍜 福岡", regEn: "Fukuoka", regJa: "福岡", hotelEn: "Mitsui Garden Hotel Fukuoka Gion", hotelJa: "三井ガーデンホテル福岡祇園", foodKeys: ["Fukuoka"], accessKeys: ["Kyushu"], guideKeys: ["Fukuoka"] },
  { key: "Sapporo", icon: "❄️", labelEn: "❄️ Sapporo", labelJa: "❄️ 札幌", regEn: "Sapporo", regJa: "札幌", hotelEn: "Cross Hotel Sapporo", hotelJa: "クロスホテル札幌", foodKeys: ["Sapporo"], accessKeys: ["Hokkaido"], guideKeys: ["Sapporo"] },
  { key: "Okinawa", icon: "🌺", labelEn: "🌺 Okinawa", labelJa: "🌺 沖縄", regEn: "Okinawa", regJa: "沖縄", hotelEn: "Hotel Collective Naha Okinawa", hotelJa: "ホテル コレクティブ 那覇", foodKeys: ["Okinawa", "Ishigaki"], accessKeys: ["Okinawa"], guideKeys: ["Okinawa", "Ishigaki"] },
  { key: "Sendai", icon: "🎋", labelEn: "🎋 Sendai", labelJa: "🎋 仙台", regEn: "Sendai", regJa: "仙台", hotelEn: "Hotel Metropolitan Sendai East", hotelJa: "ホテルメトロポリタン仙台イースト", foodKeys: ["Sendai"], accessKeys: ["Sendai"], guideKeys: ["Sendai"] }
];

window.detectCatalogPacksFromSchedule = function() {
  const cityKeys = [];
  const cityKeySet = new Set();
  const cityMatchedPrefs = new Set();
  const allMatchedPrefs = [];
  const prefSeen = new Set();

  const daysEn = (state.dataEn && Array.isArray(state.dataEn.days)) ? state.dataEn.days : [];
  const daysJa = (state.dataJa && Array.isArray(state.dataJa.days)) ? state.dataJa.days : [];
  const maxLen = Math.max(daysEn.length, daysJa.length);

  for (let i = 0; i < maxLen; i++) {
    const de = daysEn[i];
    const dj = daysJa[i];
    const rawText = [
      de && de.region, de && de.hotel, de && de.routeJp, de && de.routeEn,
      dj && dj.region, dj && dj.hotel, dj && dj.routeJp, dj && dj.routeEn
    ].filter(Boolean).join(" | ");
    if (!rawText || typeof window.findMatchingGazetteerStops !== "function") continue;

    const regRaw = (de && de.region) || (dj && dj.region) || "";
    const regExplicit = (regRaw && typeof window.resolveLocationInputStops === "function")
      ? window.resolveLocationInputStops(regRaw)
      : [];
    const gazMatches = window.findMatchingGazetteerStops(rawText);
    let matchedStops = gazMatches;
    if (regExplicit && regExplicit.length > 0) {
      const regPrefs = new Set(regExplicit.map(s => s.prefId).filter(Boolean));
      const gazSharesPref = gazMatches.some(s => s.prefId && regPrefs.has(s.prefId));
      if ((de && de._regionOverridden) || !gazSharesPref) {
        matchedStops = regExplicit;
      }
    }
    matchedStops.forEach(stop => {
      if (stop.prefId && !prefSeen.has(stop.prefId)) {
        prefSeen.add(stop.prefId);
        allMatchedPrefs.push(stop.prefId);
      }
      if (!stop.isPrefFallback && stop.cityKey && window.CITY_CATALOGS && window.CITY_CATALOGS[stop.cityKey]) {
        if (!cityKeySet.has(stop.cityKey)) {
          cityKeySet.add(stop.cityKey);
          cityKeys.push(stop.cityKey);
        }
        if (stop.prefId) cityMatchedPrefs.add(stop.prefId);
      }
    });
  }

  // City priority rule: use specific Priority City pack when selected; default to Prefecture pack if no specific city pack in that prefecture matched
  const packs = [];
  const fallbackPrefIds = [];
  cityKeys.forEach(ck => {
    const p = window.CITY_CATALOGS[ck];
    if (p) packs.push(p);
  });
  allMatchedPrefs.forEach(prefId => {
    if (!cityMatchedPrefs.has(prefId)) {
      const pp = window.PREFECTURE_CATALOGS && window.PREFECTURE_CATALOGS[prefId];
      if (pp) {
        packs.push(pp);
        fallbackPrefIds.push(prefId);
      }
    }
  });

  if (!packs.length && window.CITY_CATALOGS && window.CITY_CATALOGS.tokyo) {
    packs.push(window.CITY_CATALOGS.tokyo);
    cityKeys.push("tokyo");
  }

  return { packs, cityKeys, fallbackPrefIds, allMatchedPrefs };
};

window.detectCatalogKeysFromSchedule = function() {
  const detected = window.detectCatalogPacksFromSchedule();
  return {
    packs: detected.packs,
    foodKeys: detected.cityKeys.concat(detected.fallbackPrefIds),
    accessKeys: detected.cityKeys.concat(detected.fallbackPrefIds),
    guideKeys: detected.cityKeys.concat(detected.fallbackPrefIds)
  };
};

window.syncRegionalCatalogsFromSchedule = function() {
  const en = state.lang === "en";
  if (typeof window.pushUndoSnapshot === "function") {
    window.pushUndoSnapshot(en ? "Sync Gourmet, Metro & Guides from Schedule" : "旅程からグルメ・路線図・観光ガイドを同期");
  }
  const detected = window.detectCatalogPacksFromSchedule();
  const syncStamp = Date.now();
  const built = buildListsFromPacks(detected.packs, syncStamp);

  const mergeList = (targetList, items, keyFn, enrichFn) => {
    const existing = new Map();
    targetList.forEach(it => existing.set(keyFn(it).toLowerCase(), it));
    let added = 0;
    items.forEach(it => {
      const k = keyFn(it).toLowerCase();
      if (!existing.has(k)) {
        targetList.push({ ...it });
        existing.set(k, it);
        added++;
      } else if (enrichFn) {
        enrichFn(existing.get(k), it);
      }
    });
    return added;
  };

  let addF = 0, addA = 0, addG = 0;
  [
    { dataObj: state.dataEn, key: "en" },
    { dataObj: state.dataJa, key: "ja" }
  ].forEach(({ dataObj, key: l }) => {
    if (!dataObj) return;
    if (!Array.isArray(dataObj.food)) dataObj.food = [];
    if (!Array.isArray(dataObj.access)) dataObj.access = [];
    if (!Array.isArray(dataObj.guides)) dataObj.guides = [];

    addF += mergeList(
      dataObj.food,
      built.food[l],
      x => `${x.dish}|${x.place}`,
      (cur, fresh) => {
        if (!cur.prefId && fresh.prefId) cur.prefId = fresh.prefId;
        if (!cur.tabelogUrl || !cur.tabelogUrl.includes("tabelog.com")) cur.tabelogUrl = fresh.tabelogUrl;
      }
    );
    addA += mergeList(
      dataObj.access,
      built.access[l],
      x => `${x.place}|${x.area}`,
      (cur, fresh) => { if (!cur.prefId && fresh.prefId) cur.prefId = fresh.prefId; }
    );
    addG += mergeList(
      dataObj.guides,
      built.guides[l],
      x => `${x.location}|${x.area}`,
      (cur, fresh) => { if (!cur.prefId && fresh.prefId) cur.prefId = fresh.prefId; }
    );
  });

  state.activeFoodKey = "ALL";
  state.activeAccessKey = "ALL";
  state.activeGuideKey = "ALL";

  if (typeof window.saveState === "function") window.saveState();
  if (typeof window.renderOverviewTab === "function") window.renderOverviewTab();
  if (typeof window.renderGourmet === "function") window.renderGourmet();
  if (typeof window.renderAccessTable === "function") window.renderAccessTable();
  if (typeof window.renderGuidesTable === "function") window.renderGuidesTable();

  const cityCnt = detected.cityKeys.length;
  const prefCnt = detected.fallbackPrefIds.length;
  const msg = (addF + addA + addG) > 0
    ? (en ? `✨ Synced from schedule (${cityCnt} city, ${prefCnt} prefecture packs): +${Math.round(addF / 2)} gourmet, +${Math.round(addA / 2)} transit, +${Math.round(addG / 2)} guides!`
        : `✨ 旅程から同期完了（都市${cityCnt}・都道府県${prefCnt}）：グルメ+${Math.round(addF / 2)}、路線図+${Math.round(addA / 2)}、ガイド+${Math.round(addG / 2)}！`)
    : (en ? `✅ Gourmet, Metro & Guides already match all scheduled cities/prefectures (${cityCnt} city, ${prefCnt} pref packs).`
        : `✅ 旅程上の全都市・都道府県データはすでに同期済みです（都市${cityCnt}・県${prefCnt}）。`);
  if (typeof window.showToast === "function") window.showToast(msg);
  return {
    foodAdded: Math.round(addF / 2),
    accessAdded: Math.round(addA / 2),
    guidesAdded: Math.round(addG / 2),
    detected
  };
};
