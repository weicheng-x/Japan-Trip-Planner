// Fetches open MLIT administrative GeoJSONs (prefectures & all 1,747 municipalities) and municipality Romanization,
// projects coordinates into conformal Web Mercator inside 0..920 x 0..980,
// simplifies rings with Ramer-Douglas-Peucker, and emits src/data/japan-geo.js with:
//   - All 47 Prefectures (JAPAN_PREF_PATHS)
//   - All 1,747 Japan Municipalities (市/区/町/村) + Curated Composite Tourist Areas (JAPAN_CITY_PATHS)

const fs = require("fs");
const path = require("path");

const PREF_URL = "https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0001/prefectures.json";
const MUNI_URL = "https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0001/N03-21_210101_designated_city.json";
const MUNI_FALLBACK_URL = "https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0010/N03-21_210101_designated_city.json";
const ROM_URL = "https://raw.githubusercontent.com/piuccio/open-data-jp-municipalities/master/municipalities.json";

function mercDeg(lat) {
  const rad = (Math.max(-85, Math.min(85, lat)) * Math.PI) / 180;
  return (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
}

function projectPoint(lat, lng) {
  return [
    (lng - 121.8) * 34,
    (52.4 - mercDeg(lat)) * 34
  ];
}

function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / lenSq;
  const px = a[0] + t * dx;
  const py = a[1] + t * dy;
  return Math.hypot(p[0] - px, p[1] - py);
}

function rdp(pts, eps) {
  if (pts.length <= 3) return pts;
  let maxD = 0;
  let maxIdx = 0;
  const end = pts.length - 1;
  for (let i = 1; i < end; i++) {
    const d = perpDist(pts[i], pts[0], pts[end]);
    if (d > maxD) {
      maxD = d;
      maxIdx = i;
    }
  }
  if (maxD > eps) {
    const left = rdp(pts.slice(0, maxIdx + 1), eps);
    const right = rdp(pts.slice(maxIdx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [pts[0], pts[end]];
}

function polyArea(ring) {
  let sum = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    sum += x1 * y2 - x2 * y1;
  }
  return Math.abs(sum) * 0.5;
}

function buildFeaturePaths(features, eps, minRingArea, alwaysKeepLargestPerFeature, ringCenterFilter) {
  const pathParts = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let sumArea = 0, sumCx = 0, sumCy = 0;

  features.forEach(feat => {
    const geom = feat && feat.geometry;
    if (!geom) return;
    const polys = geom.type === "Polygon" ? [geom.coordinates] : (geom.type === "MultiPolygon" ? geom.coordinates : []);
    const featRings = [];

    polys.forEach(poly => {
      if (!poly || !poly[0]) return;
      const outerRaw = poly[0].map(([lng, lat]) => projectPoint(lat, lng));
      if (outerRaw.length < 3) return;
      const area = polyArea(outerRaw);
      let avgX = 0, avgY = 0;
      outerRaw.forEach(pt => { avgX += pt[0]; avgY += pt[1]; });
      avgX /= outerRaw.length;
      avgY /= outerRaw.length;
      if (ringCenterFilter && !ringCenterFilter(avgX, avgY, area)) return;
      featRings.push({ ring: outerRaw, area });
    });

    if (featRings.length === 0) return;
    let maxFeatArea = 0;
    featRings.forEach(r => { if (r.area > maxFeatArea) maxFeatArea = r.area; });

    featRings.forEach(({ ring, area }) => {
      if (area < minRingArea && !(alwaysKeepLargestPerFeature && area === maxFeatArea)) return;
      const open = ring.slice(0, -1);
      if (open.length < 3) return;
      const mid = Math.floor(open.length / 2);
      const s1 = rdp(open.slice(0, mid + 1), eps);
      const s2 = rdp(open.slice(mid).concat([open[0]]), eps);
      let simplified = s1.slice(0, -1).concat(s2.slice(0, -1));
      if (simplified.length < 3) {
        const fine1 = rdp(open.slice(0, mid + 1), 0.02);
        const fine2 = rdp(open.slice(mid).concat([open[0]]), 0.02);
        simplified = fine1.slice(0, -1).concat(fine2.slice(0, -1));
        if (simplified.length < 3) simplified = open;
      }
      if (simplified.length < 3) return;

      let dStr = "";
      let rCx = 0, rCy = 0;
      simplified.forEach((pt, idx) => {
        const rx = Math.round(pt[0] * 10) / 10;
        const ry = Math.round(pt[1] * 10) / 10;
        if (rx < minX) minX = rx;
        if (rx > maxX) maxX = rx;
        if (ry < minY) minY = ry;
        if (ry > maxY) maxY = ry;
        rCx += rx;
        rCy += ry;
        dStr += (idx === 0 ? `M${rx},${ry}` : `L${rx},${ry}`);
      });
      dStr += "Z";
      pathParts.push(dStr);
      rCx /= simplified.length;
      rCy /= simplified.length;
      sumCx += rCx * area;
      sumCy += rCy * area;
      sumArea += area;
    });
  });

  if (pathParts.length === 0) return null;
  const cx = sumArea > 0 ? Math.round((sumCx / sumArea) * 10) / 10 : Math.round(((minX + maxX) / 2) * 10) / 10;
  const cy = sumArea > 0 ? Math.round((sumCy / sumArea) * 10) / 10 : Math.round(((minY + maxY) / 2) * 10) / 10;
  return {
    d: pathParts.join(" "),
    bbox: [
      Math.round(minX * 10) / 10,
      Math.round(minY * 10) / 10,
      Math.round(maxX * 10) / 10,
      Math.round(maxY * 10) / 10
    ],
    cx,
    cy
  };
}

const PREF_JA_TO_ID = {
  "北海道": "hokkaido", "青森県": "aomori", "岩手県": "iwate", "宮城県": "miyagi", "秋田県": "akita",
  "山形県": "yamagata", "福島県": "fukushima", "茨城県": "ibaraki", "栃木県": "tochigi", "群馬県": "gunma",
  "埼玉県": "saitama", "千葉県": "chiba", "東京都": "tokyo", "神奈川県": "kanagawa", "新潟県": "niigata",
  "富山県": "toyama", "石川県": "ishikawa", "福井県": "fukui", "山梨県": "yamanashi", "長野県": "nagano",
  "岐阜県": "gifu", "静岡県": "shizuoka", "愛知県": "aichi", "三重県": "mie", "滋賀県": "shiga",
  "京都府": "kyoto", "大阪府": "osaka", "兵庫県": "hyogo", "奈良県": "nara", "和歌山県": "wakayama",
  "鳥取県": "tottori", "島根県": "shimane", "岡山県": "okayama", "広島県": "hiroshima", "山口県": "yamaguchi",
  "徳島県": "tokushima", "香川県": "kagawa", "愛媛県": "ehime", "高知県": "kochi", "福岡県": "fukuoka",
  "佐賀県": "saga", "長崎県": "nagasaki", "熊本県": "kumamoto", "大分県": "oita", "宮崎県": "miyazaki",
  "鹿児島県": "kagoshima", "沖縄県": "okinawa"
};

// Direct 1:1 canonical gazetteer stopId -> "prefJa|muniJa" mapping so canonical stops carry isMuni: true without duplicate polygons
const MUNI_CANONICAL_ID_MAP = {
  "北海道|札幌市": "sapporo",
  "北海道|千歳市": "chitose",
  "北海道|小樽市": "otaru",
  "北海道|旭川市": "asahikawa",
  "北海道|函館市": "hakodate",
  "北海道|礼文町": "rebun_island",
  "青森県|青森市": "aomori_city",
  "青森県|弘前市": "hirosaki",
  "青森県|八戸市": "hachinohe",
  "青森県|十和田市": "oirase",
  "青森県|三沢市": "misawa",
  "岩手県|盛岡市": "morioka",
  "秋田県|仙北市": "nyuto_onsen",
  "宮城県|仙台市": "sendai",
  "宮城県|大崎市": "naruko",
  "山形県|鶴岡市": "tsuruoka",
  "山形県|尾花沢市": "ginzan_onsen",
  "山形県|上山市": "kaminoyama_onsen",
  "栃木県|日光市": "nikko",
  "群馬県|高崎市": "takasaki",
  "群馬県|草津町": "kusatsu_onsen",
  "神奈川県|横浜市": "yokohama",
  "神奈川県|鎌倉市": "kamakura",
  "神奈川県|箱根町": "hakone",
  "新潟県|佐渡市": "sado_island",
  "長野県|安曇野市": "azumino",
  "長野県|松本市": "matsumoto",
  "長野県|白馬村": "hakuba",
  "長野県|軽井沢町": "karuizawa",
  "長野県|阿智村": "achi_village",
  "静岡県|熱海市": "atami",
  "静岡県|静岡市": "shizuoka",
  "静岡県|浜松市": "hamamatsu",
  "愛知県|名古屋市": "nagoya",
  "石川県|金沢市": "kanazawa",
  "石川県|加賀市": "kaga_onsen",
  "富山県|南砺市": "gokayama",
  "岐阜県|高山市": "takayama",
  "岐阜県|白川村": "shirakawago",
  "京都府|京都市": "kyoto",
  "奈良県|奈良市": "nara",
  "大阪府|大阪市": "osaka",
  "兵庫県|神戸市": "kobe",
  "兵庫県|姫路市": "himeji",
  "兵庫県|豊岡市": "kinosaki_onsen",
  "和歌山県|高野町": "koyasan",
  "鳥取県|鳥取市": "tottori_city",
  "島根県|松江市": "matsue",
  "島根県|出雲市": "izumo",
  "岡山県|岡山市": "okayama_city",
  "岡山県|倉敷市": "kurashiki",
  "広島県|尾道市": "onomichi",
  "広島県|広島市": "hiroshima",
  "広島県|廿日市市": "miyajima",
  "山口県|下関市": "shimonoseki",
  "香川県|高松市": "takamatsu",
  "香川県|直島町": "naoshima",
  "愛媛県|松山市": "matsuyama",
  "福岡県|福岡市": "fukuoka",
  "福岡県|太宰府市": "dazaifu",
  "大分県|別府市": "beppu",
  "大分県|由布市": "yufuin",
  "長崎県|長崎市": "nagasaki",
  "熊本県|熊本市": "kumamoto",
  "熊本県|南小国町": "kurokawa",
  "鹿児島県|鹿児島市": "kagoshima",
  "鹿児島県|屋久島町": "yakushima",
  "沖縄県|那覇市": "naha",
  "沖縄県|宮古島市": "miyakojima",
  "沖縄県|石垣市": "ishigaki",
  "沖縄県|竹富町": "taketomi"
};

const CANONICAL_DISPLAY_OVERRIDES = {
  rebun_island: { en: "Rebun Island", ja: "礼文島" },
  kusatsu_onsen: { en: "Kusatsu Onsen", ja: "草津温泉" },
  hakone: { en: "Hakone", ja: "箱根" },
  hakuba: { en: "Hakuba", ja: "白馬" },
  karuizawa: { en: "Karuizawa", ja: "軽井沢" },
  achi_village: { en: "Achi Village", ja: "阿智村" },
  shirakawago: { en: "Shirakawa-go", ja: "白川郷" },
  koyasan: { en: "Koyasan", ja: "高野山" },
  naoshima: { en: "Naoshima", ja: "直島" },
  kurokawa: { en: "Kurokawa Onsen", ja: "黒川温泉" },
  yakushima: { en: "Yakushima", ja: "屋久島" },
  taketomi: { en: "Taketomi / Iriomote", ja: "竹富島・西表島" }
};

// Curated composite / multi-municipality / sub-ward tourist areas (never collide with 1:1 munis)
const CURATED_COMPOSITE_SPECS = {
  rishiri_island: { pref: "北海道", munis: ["利尻町", "利尻富士町"], en: "Rishiri Island", ja: "利尻島" },
  furano: { pref: "北海道", munis: ["富良野市", "美瑛町", "中富良野町"], en: "Furano / Biei", ja: "富良野・美瑛" },
  niseko: { pref: "北海道", munis: ["ニセコ町", "倶知安町"], en: "Niseko", ja: "ニセコ" },
  noboribetsu: { pref: "北海道", munis: ["登別市", "洞爺湖町", "壮瞥町"], en: "Noboribetsu / Lake Toya", ja: "登別・洞爺湖" },
  mutsu_bay: { pref: "青森県", munis: ["むつ市", "大間町", "平内町"], en: "Mutsu Bay", ja: "陸奥湾" },
  shin_aomori: { pref: "青森県", munis: ["青森市"], en: "Shin-Aomori", ja: "新青森" },
  kakunodate: { pref: "秋田県", munis: ["仙北市", "秋田市"], en: "Akita / Kakunodate", ja: "秋田・角館" },
  matsushima: { pref: "宮城県", munis: ["松島町", "塩竈市"], en: "Matsushima", ja: "松島" },
  akiu: { pref: "宮城県", munis: ["仙台市"], en: "Akiu Onsen", ja: "秋保温泉" },
  zao: { pref: "山形県", munis: ["山形市", "上山市"], en: "Zao Onsen", ja: "蔵王温泉" },
  yamagata_city: { pref: "山形県", munis: ["山形市", "天童市"], en: "Yamagata / Tendo", ja: "山形・天童" },
  aizuwakamatsu: { pref: "福島県", munis: ["会津若松市", "喜多方市", "下郷町"], en: "Aizuwakamatsu / Kitakata", ja: "会津若松・喜多方" },
  kinugawa_onsen: { pref: "栃木県", munis: ["日光市"], en: "Kinugawa Onsen", ja: "鬼怒川温泉" },
  tokyo: { pref: "東京都", munis: ["千代田区", "中央区", "港区", "文京区", "渋谷区", "新宿区", "台東区", "墨田区", "品川区", "大田区", "江東区"], en: "Tokyo Central", ja: "東京・銀座" },
  shinjuku: { pref: "東京都", munis: ["新宿区", "渋谷区", "豊島区"], en: "Shinjuku / Shibuya", ja: "新宿・渋谷" },
  asakusa: { pref: "東京都", munis: ["台東区", "墨田区", "文京区"], en: "Asakusa / Ueno", ja: "浅草・上野" },
  haneda: { pref: "東京都", munis: ["大田区", "品川区", "江東区", "港区"], en: "Haneda / Tokyo Bay", ja: "羽田空港・湾岸" },
  kawaguchiko: { pref: "山梨県", munis: ["富士河口湖町", "富士吉田市"], en: "Mt. Fuji / Kawaguchiko", ja: "富士山・河口湖" },
  nagano_city: { pref: "長野県", munis: ["長野市", "山ノ内町"], en: "Nagano", ja: "長野" },
  izu: { pref: "静岡県", munis: ["伊豆市", "河津町", "下田市", "伊東市", "東伊豆町"], en: "Izu / Kawazu", ja: "伊豆・河津" },
  ise: { pref: "三重県", munis: ["伊勢市", "鳥羽市", "志摩市"], en: "Ise / Toba", ja: "伊勢・鳥羽" },
  arima_onsen: { pref: "兵庫県", munis: ["神戸市"], en: "Arima Onsen", ja: "有馬温泉" },
  awaji_island: { pref: "兵庫県", munis: ["淡路市", "洲本市", "南あわじ市"], en: "Awaji Island", ja: "淡路島" },
  onna_son: { pref: "沖縄県", munis: ["恩納村", "本部町", "名護市"], en: "Onna-son / Churaumi", ja: "恩納村・美ら海" },
  chatan: { pref: "沖縄県", munis: ["北谷町", "読谷村"], en: "Chatan / Cape Maeda", ja: "北谷・真栄田岬" },
  kerama: { pref: "沖縄県", munis: ["座間味村", "渡嘉敷村"], en: "Kerama Islands", ja: "慶良間諸島" }
};

const MISSING_ROMAJI_BY_CODE5 = {
  "14342": { en: "Ninomiya", kana: "にのみや" },
  "14364": { en: "Yamakita", kana: "やまきた" },
  "19368": { en: "Fujikawa", kana: "ふじかわ" },
  "20451": { en: "Asahi", kana: "あさひ" },
  "21503": { en: "Kawabe", kana: "かわべ" },
  "40231": { en: "Nakagawa", kana: "なかがわ" },
  "01695": { en: "Shikotan", kana: "しこたん" },
  "01696": { en: "Tomari (Kunashiri)", kana: "とまり" },
  "01697": { en: "Ruyobetsu", kana: "るよべつ" },
  "01698": { en: "Rubetsu", kana: "るべつ" },
  "01699": { en: "Shana", kana: "しゃな" },
  "01700": { en: "Shibetoro", kana: "しべとろ" }
};

function cleanRomajiCityName(rawRom) {
  if (!rawRom) return "";
  return String(rawRom)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+(Shi|Ku|Cho|Machi|Son|Mura)$/i, "")
    .trim();
}

function makeShiSlug(nameEn) {
  return String(nameEn || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function main() {
  console.log("Fetching MLIT Prefectures, Municipalities & Romanization datasets...");
  const [prefRes, muniRes, romRes] = await Promise.all([
    fetch(PREF_URL),
    fetch(MUNI_URL),
    fetch(ROM_URL)
  ]);
  if (!prefRes.ok) throw new Error("Failed pref fetch: " + prefRes.status);
  if (!muniRes.ok) throw new Error("Failed muni fetch: " + muniRes.status);
  if (!romRes.ok) throw new Error("Failed rom fetch: " + romRes.status);

  const prefGeo = await prefRes.json();
  const muniGeo = await muniRes.json();
  const romList = await romRes.json();

  const romByCode5 = new Map();
  const romByPrefKanji = new Map();
  for (const r of romList) {
    const c5 = String(r.code || "").slice(0, 5);
    if (c5) romByCode5.set(c5, r);
    romByPrefKanji.set(`${r.prefecture_kanji}|${r.name_kanji}`, r);
  }

  const prefPaths = {};
  (prefGeo.features || []).forEach(f => {
    const pJa = f.properties && f.properties.N03_001;
    const pId = PREF_JA_TO_ID[pJa];
    if (!pId) return;
    let ringFilter = null;
    if (pId === "tokyo") ringFilter = (_cx, cy) => cy <= 530;
    else if (pId === "okinawa") ringFilter = (cx) => cx <= 250;
    const built = buildFeaturePaths([f], 0.25, 0.25, true, ringFilter);
    if (built) prefPaths[pId] = built;
  });

  const missingPrefs = Object.values(PREF_JA_TO_ID).filter(id => !prefPaths[id]);
  if (missingPrefs.length > 0) throw new Error("Missing pref paths: " + missingPrefs.join(", "));

  // Index municipality GeoJSON features by "prefJa|muniJa" and "prefJa|muniJa|code5" for O(1) lookup
  const featsByPrefMuni = new Map();
  const featsByPrefMuniCode = new Map();
  const muniGroups = new Map();
  (muniGeo.features || []).forEach(f => {
    const pr = f.properties || {};
    const prefJa = pr.N03_001 || "";
    const muniJa = pr.N03_004 || pr.N03_003 || "";
    const code = String(pr.N03_007 || "");
    if (!prefJa || !muniJa || muniJa === "所属未定地") return;
    const mk = `${prefJa}|${muniJa}`;
    const mcKey = `${mk}|${code}`;
    if (!featsByPrefMuni.has(mk)) featsByPrefMuni.set(mk, []);
    featsByPrefMuni.get(mk).push(f);
    if (!featsByPrefMuniCode.has(mcKey)) featsByPrefMuniCode.set(mcKey, []);
    featsByPrefMuniCode.get(mcKey).push(f);

    if (!muniGroups.has(mcKey)) {
      const mType = muniJa.endsWith("市") ? "city"
        : (muniJa.endsWith("区") ? "ward"
        : (muniJa.endsWith("町") ? "town" : (muniJa.endsWith("村") ? "village" : "other")));
      muniGroups.set(mcKey, { prefJa, nameJa: muniJa, code, mk, mType });
    }
  });

  // Resolve base romaji + kana and detect same-prefecture base collisions before emitting
  const preparedMunis = [];
  const samePrefBaseBuckets = new Map();
  for (const [mcKey, info] of muniGroups.entries()) {
    const prefId = PREF_JA_TO_ID[info.prefJa];
    if (!prefId) continue;
    const fbRom = MISSING_ROMAJI_BY_CODE5[info.code];
    const rec = romByCode5.get(info.code) || romByPrefKanji.get(info.mk);
    const rawRom = fbRom ? fbRom.en : (rec ? rec.name_romaji : "");
    const baseEn = cleanRomajiCityName(rawRom) || info.nameJa;
    const rawKana = fbRom ? fbRom.kana : (rec && rec.name_kana ? String(rec.name_kana) : "");
    const kana = rawKana.replace(/(?:し|く|ちょう|まち|そん|むら)$/, "");
    const entry = Object.assign({}, info, { mcKey, prefId, baseEn, kana });
    preparedMunis.push(entry);

    const bKey = `${prefId}|${baseEn.toLowerCase()}`;
    if (!samePrefBaseBuckets.has(bKey)) samePrefBaseBuckets.set(bKey, []);
    samePrefBaseBuckets.get(bKey).push(entry);
  }

  for (const entry of preparedMunis) {
    const bucket = samePrefBaseBuckets.get(`${entry.prefId}|${entry.baseEn.toLowerCase()}`) || [entry];
    let resolvedEn = entry.baseEn;
    if (bucket.length > 1) {
      if (entry.code === "01361") resolvedEn = "Esashi (Hiyama)";
      else if (entry.code === "01516") resolvedEn = "Esashi (Soya)";
      else if (entry.mType === "town") resolvedEn = `${entry.baseEn} Town`;
      else if (entry.mType === "village") resolvedEn = `${entry.baseEn} Village`;
      else if (entry.mType === "ward") resolvedEn = `${entry.baseEn} Ward`;
    }
    entry.nameEn = resolvedEn;
  }

  const cityPaths = {};
  const missingEntries = [];

  // Lazy fetch s0010 fallback only for the tiny municipalities whose s0001 geometry was null
  let fallbackByPrefMuniCode = null;
  let fallbackByPrefMuni = null;
  async function getFallbackFeats(mk, code) {
    if (!fallbackByPrefMuni) {
      const fbRes = await fetch(MUNI_FALLBACK_URL);
      fallbackByPrefMuniCode = new Map();
      fallbackByPrefMuni = new Map();
      if (fbRes.ok) {
        const fbGeo = await fbRes.json();
        (fbGeo.features || []).forEach(f => {
          const pr = f.properties || {};
          const fMk = `${pr.N03_001 || ""}|${pr.N03_004 || pr.N03_003 || ""}`;
          const fMc = `${fMk}|${String(pr.N03_007 || "")}`;
          if (!fallbackByPrefMuni.has(fMk)) fallbackByPrefMuni.set(fMk, []);
          fallbackByPrefMuni.get(fMk).push(f);
          if (!fallbackByPrefMuniCode.has(fMc)) fallbackByPrefMuniCode.set(fMc, []);
          fallbackByPrefMuniCode.get(fMc).push(f);
        });
      }
    }
    if (code && fallbackByPrefMuniCode.has(`${mk}|${code}`)) {
      return fallbackByPrefMuniCode.get(`${mk}|${code}`);
    }
    return fallbackByPrefMuni.get(mk) || [];
  }

  let shiEmitted = 0;
  let muniEmitted = 0;
  const typePrefixMap = { city: "shi", ward: "ku", town: "cho", village: "mura", other: "muni" };

  for (const entry of preparedMunis) {
    const canonId = MUNI_CANONICAL_ID_MAP[entry.mk];
    const prefix = typePrefixMap[entry.mType] || "muni";
    let id = canonId || `${prefix}_${makeShiSlug(entry.nameEn)}_${entry.prefId}`;
    if (cityPaths[id]) id = `${id}_${entry.code || "alt"}`;

    const feats = featsByPrefMuniCode.get(entry.mcKey) || featsByPrefMuni.get(entry.mk) || [];
    let built = buildFeaturePaths(feats, 0.24, 0.08, true, null);
    if (!built) {
      const fbFeats = await getFallbackFeats(entry.mk, entry.code);
      built = buildFeaturePaths(fbFeats, 0.08, 0.01, true, null);
    }
    if (!built) {
      missingEntries.push(`${entry.mType}:${entry.mcKey}`);
      continue;
    }

    const dispOv = CANONICAL_DISPLAY_OVERRIDES[id];
    const finalNameEn = dispOv ? dispOv.en : entry.nameEn;
    const finalNameJa = dispOv ? dispOv.ja : entry.nameJa;

    cityPaths[id] = {
      d: built.d,
      bbox: built.bbox,
      cx: built.cx,
      cy: built.cy,
      prefId: entry.prefId,
      nameEn: finalNameEn,
      nameJa: finalNameJa,
      rawMuniJa: entry.nameJa,
      kana: entry.kana,
      code: entry.code,
      isShi: entry.mType === "city",
      isMuni: true,
      muniType: entry.mType
    };
    muniEmitted++;
    if (entry.mType === "city") shiEmitted++;
  }

  // 2) Emit curated composite / multi-municipality / sub-city tourist regions
  for (const [stopId, spec] of Object.entries(CURATED_COMPOSITE_SPECS)) {
    const prefId = PREF_JA_TO_ID[spec.pref];
    const feats = [];
    for (const mJa of spec.munis) {
      const mk = `${spec.pref}|${mJa}`;
      let list = featsByPrefMuni.get(mk) || [];
      if (!list.some(f => f && f.geometry)) {
        list = await getFallbackFeats(mk, null);
      }
      list.forEach(f => feats.push(f));
    }
    const built = buildFeaturePaths(feats, 0.18, 0.08, true, null);
    if (!built) {
      missingEntries.push(`curated:${stopId}(${spec.pref}:${spec.munis.join(",")})`);
      continue;
    }
    cityPaths[stopId] = {
      d: built.d,
      bbox: built.bbox,
      cx: built.cx,
      cy: built.cy,
      prefId,
      nameEn: spec.en,
      nameJa: spec.ja,
      isShi: false,
      isMuni: false,
      isComposite: true,
      muniType: "area"
    };
  }

  if (missingEntries.length > 0 || shiEmitted < 792 || muniEmitted < 1747) {
    console.warn("MISSING ENTRIES:", missingEntries, "shiEmitted:", shiEmitted, "muniEmitted:", muniEmitted);
    process.exitCode = 1;
  }

  const outPath = path.resolve(__dirname, "..", "src", "data", "japan-geo.js");
  const outContent = `// Auto-generated Conformal Web Mercator MLIT Japan Prefectures (47), All ${muniEmitted} Municipalities (${shiEmitted} 市 + 区/町/村) & Curated Sightseeing Areas (${Object.keys(cityPaths).length} total)
// Source: MLIT National Land Numerical Information via smartnews-smri/japan-topography & open-data-jp-municipalities

window.projectJapanLatLng = function(lat, lng) {
  const rad = (Math.max(-85, Math.min(85, Number(lat) || 35.68)) * Math.PI) / 180;
  const mercLat = (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
  return {
    x: Math.round((Number(lng) - 121.8) * 34 * 10) / 10,
    y: Math.round((52.4 - mercLat) * 34 * 10) / 10
  };
};

window.JAPAN_PREF_PATHS = ${JSON.stringify(prefPaths)};

window.JAPAN_CITY_PATHS = ${JSON.stringify(cityPaths)};
`;

  fs.writeFileSync(outPath, outContent, "utf8");
  const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
  console.log(`Generated ${outPath} (${kb} KB) | Prefectures: ${Object.keys(prefPaths).length} | All Shi: ${shiEmitted} | All Munis: ${muniEmitted} | Total Polygons: ${Object.keys(cityPaths).length} | Missing: ${missingEntries.length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
