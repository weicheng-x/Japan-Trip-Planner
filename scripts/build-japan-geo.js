// Fetches open MLIT administrative GeoJSONs (prefectures & municipalities) and municipality Romanization,
// projects coordinates into conformal Web Mercator inside 0..920 x 0..980,
// simplifies rings with Ramer-Douglas-Peucker, and emits src/data/japan-geo.js with:
//   - All 47 Prefectures (JAPAN_PREF_PATHS)
//   - All 792 Japan Cities (市) + Curated Tourist Composite/Town/Village Areas (JAPAN_CITY_PATHS)

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

// Direct 1:1 canonical gazetteer stopId -> [prefJa, shiJa] mapping so canonical IDs carry isShi: true
const SHI_CANONICAL_ID_MAP = {
  "北海道|札幌市": "sapporo",
  "北海道|千歳市": "chitose",
  "北海道|小樽市": "otaru",
  "北海道|旭川市": "asahikawa",
  "北海道|函館市": "hakodate",
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
  "神奈川県|横浜市": "yokohama",
  "神奈川県|鎌倉市": "kamakura",
  "新潟県|佐渡市": "sado_island",
  "長野県|安曇野市": "azumino",
  "長野県|松本市": "matsumoto",
  "静岡県|熱海市": "atami",
  "静岡県|静岡市": "shizuoka",
  "静岡県|浜松市": "hamamatsu",
  "愛知県|名古屋市": "nagoya",
  "石川県|金沢市": "kanazawa",
  "石川県|加賀市": "kaga_onsen",
  "富山県|南砺市": "gokayama",
  "岐阜県|高山市": "takayama",
  "京都府|京都市": "kyoto",
  "奈良県|奈良市": "nara",
  "大阪府|大阪市": "osaka",
  "兵庫県|神戸市": "kobe",
  "兵庫県|姫路市": "himeji",
  "兵庫県|豊岡市": "kinosaki_onsen",
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
  "愛媛県|松山市": "matsuyama",
  "福岡県|福岡市": "fukuoka",
  "福岡県|太宰府市": "dazaifu",
  "大分県|別府市": "beppu",
  "大分県|由布市": "yufuin",
  "長崎県|長崎市": "nagasaki",
  "熊本県|熊本市": "kumamoto",
  "鹿児島県|鹿児島市": "kagoshima",
  "沖縄県|那覇市": "naha",
  "沖縄県|宮古島市": "miyakojima",
  "沖縄県|石垣市": "ishigaki"
};

// Curated composite / non-shi town, village, island & sub-city tourist boundaries
const CURATED_NON_SHI_SPECS = {
  rebun_island: { pref: "北海道", munis: ["礼文町"], en: "Rebun Island", ja: "礼文島" },
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
  kusatsu_onsen: { pref: "群馬県", munis: ["草津町"], en: "Kusatsu Onsen", ja: "草津温泉" },
  tokyo: { pref: "東京都", munis: ["千代田区", "中央区", "港区", "文京区", "渋谷区", "新宿区", "台東区", "墨田区", "品川区", "大田区", "江東区"], en: "Tokyo Central", ja: "東京・銀座" },
  shinjuku: { pref: "東京都", munis: ["新宿区", "渋谷区", "豊島区"], en: "Shinjuku / Shibuya", ja: "新宿・渋谷" },
  asakusa: { pref: "東京都", munis: ["台東区", "墨田区", "文京区"], en: "Asakusa / Ueno", ja: "浅草・上野" },
  haneda: { pref: "東京都", munis: ["大田区", "品川区", "江東区", "港区"], en: "Haneda / Tokyo Bay", ja: "羽田空港・湾岸" },
  hakone: { pref: "神奈川県", munis: ["箱根町"], en: "Hakone", ja: "箱根" },
  kawaguchiko: { pref: "山梨県", munis: ["富士河口湖町", "富士吉田市"], en: "Mt. Fuji / Kawaguchiko", ja: "富士山・河口湖" },
  hakuba: { pref: "長野県", munis: ["白馬村"], en: "Hakuba", ja: "白馬" },
  karuizawa: { pref: "長野県", munis: ["軽井沢町"], en: "Karuizawa", ja: "軽井沢" },
  nagano_city: { pref: "長野県", munis: ["長野市", "山ノ内町"], en: "Nagano", ja: "長野" },
  achi_village: { pref: "長野県", munis: ["阿智村"], en: "Achi Village", ja: "阿智村" },
  izu: { pref: "静岡県", munis: ["伊豆市", "河津町", "下田市", "伊東市", "東伊豆町"], en: "Izu / Kawazu", ja: "伊豆・河津" },
  shirakawago: { pref: "岐阜県", munis: ["白川村"], en: "Shirakawa-go", ja: "白川郷" },
  ise: { pref: "三重県", munis: ["伊勢市", "鳥羽市", "志摩市"], en: "Ise / Toba", ja: "伊勢・鳥羽" },
  koyasan: { pref: "和歌山県", munis: ["高野町"], en: "Koyasan", ja: "高野山" },
  arima_onsen: { pref: "兵庫県", munis: ["神戸市"], en: "Arima Onsen", ja: "有馬温泉" },
  awaji_island: { pref: "兵庫県", munis: ["淡路市", "洲本市", "南あわじ市"], en: "Awaji Island", ja: "淡路島" },
  naoshima: { pref: "香川県", munis: ["直島町"], en: "Naoshima", ja: "直島" },
  kurokawa: { pref: "熊本県", munis: ["南小国町"], en: "Kurokawa Onsen", ja: "黒川温泉" },
  yakushima: { pref: "鹿児島県", munis: ["屋久島町"], en: "Yakushima", ja: "屋久島" },
  onna_son: { pref: "沖縄県", munis: ["恩納村", "本部町", "名護市"], en: "Onna-son / Churaumi", ja: "恩納村・美ら海" },
  chatan: { pref: "沖縄県", munis: ["北谷町", "読谷村"], en: "Chatan / Cape Maeda", ja: "北谷・真栄田岬" },
  kerama: { pref: "沖縄県", munis: ["座間味村", "渡嘉敷村"], en: "Kerama Islands", ja: "慶良間諸島" },
  taketomi: { pref: "沖縄県", munis: ["竹富町"], en: "Taketomi / Iriomote", ja: "竹富島・西表島" }
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

  // Index municipality GeoJSON features by "prefJa|muniJa" for O(1) lookup
  const featsByPrefMuni = new Map();
  const shiGroups = new Map();
  (muniGeo.features || []).forEach(f => {
    const pr = f.properties || {};
    const prefJa = pr.N03_001 || "";
    const muniJa = pr.N03_004 || pr.N03_003 || "";
    if (!prefJa || !muniJa) return;
    const mk = `${prefJa}|${muniJa}`;
    if (!featsByPrefMuni.has(mk)) featsByPrefMuni.set(mk, []);
    featsByPrefMuni.get(mk).push(f);

    if (muniJa.endsWith("市") && !shiGroups.has(mk)) {
      shiGroups.set(mk, { prefJa, nameJa: muniJa, code: String(pr.N03_007 || "") });
    }
  });

  const cityPaths = {};
  const missingEntries = [];

  // 1) Emit all 792 Cities (市) with uniform tolerance; fallback to s0010 for any tiny city whose s0001 geometry was null (e.g. Muko-shi)
  let fallbackMuniByPrefMuni = null;
  async function getFallbackFeats(mk) {
    if (!fallbackMuniByPrefMuni) {
      const fbRes = await fetch(MUNI_FALLBACK_URL);
      if (fbRes.ok) {
        const fbGeo = await fbRes.json();
        fallbackMuniByPrefMuni = new Map();
        (fbGeo.features || []).forEach(f => {
          const pr = f.properties || {};
          const k = `${pr.N03_001 || ""}|${pr.N03_004 || pr.N03_003 || ""}`;
          if (!fallbackMuniByPrefMuni.has(k)) fallbackMuniByPrefMuni.set(k, []);
          fallbackMuniByPrefMuni.get(k).push(f);
        });
      } else {
        fallbackMuniByPrefMuni = new Map();
      }
    }
    return fallbackMuniByPrefMuni.get(mk) || [];
  }

  let shiEmitted = 0;
  for (const [mk, info] of shiGroups.entries()) {
    const prefId = PREF_JA_TO_ID[info.prefJa];
    if (!prefId) continue;
    const rec = romByCode5.get(info.code) || romByPrefKanji.get(mk);
    let rawRom = rec ? rec.name_romaji : "";
    if (!rawRom && info.nameJa === "那珂川市") rawRom = "Nakagawa Shi";
    const nameEn = cleanRomajiCityName(rawRom) || info.nameJa;
    const kana = rec && rec.name_kana ? String(rec.name_kana).replace(/し$/, "") : "";

    const canonId = SHI_CANONICAL_ID_MAP[mk];
    const id = canonId || `shi_${makeShiSlug(nameEn)}_${prefId}`;
    const feats = featsByPrefMuni.get(mk) || [];
    let ringFilter = null;
    if (prefId === "tokyo") ringFilter = (_cx, cy) => cy <= 530;
    else if (prefId === "okinawa") ringFilter = (cx) => cx <= 250;

    let built = buildFeaturePaths(feats, 0.22, 0.08, true, ringFilter);
    if (!built) {
      const fbFeats = await getFallbackFeats(mk);
      built = buildFeaturePaths(fbFeats, 0.06, 0.01, true, ringFilter);
    }
    if (!built) {
      missingEntries.push(`shi:${mk}`);
      continue;
    }
    cityPaths[id] = {
      d: built.d,
      bbox: built.bbox,
      cx: built.cx,
      cy: built.cy,
      prefId,
      nameEn,
      nameJa: info.nameJa,
      kana,
      isShi: true
    };
    shiEmitted++;
  }

  // 2) Emit curated non-shi / composite tourist regions (villages, towns, bays, wards)
  Object.entries(CURATED_NON_SHI_SPECS).forEach(([stopId, spec]) => {
    const prefId = PREF_JA_TO_ID[spec.pref];
    const feats = [];
    spec.munis.forEach(mJa => {
      const list = featsByPrefMuni.get(`${spec.pref}|${mJa}`) || [];
      list.forEach(f => feats.push(f));
    });
    const built = buildFeaturePaths(feats, 0.16, 0.08, true);
    if (!built) {
      missingEntries.push(`curated:${stopId}(${spec.pref}:${spec.munis.join(",")})`);
      return;
    }
    cityPaths[stopId] = {
      d: built.d,
      bbox: built.bbox,
      cx: built.cx,
      cy: built.cy,
      prefId,
      nameEn: spec.en,
      nameJa: spec.ja,
      isShi: false
    };
  });

  if (missingEntries.length > 0 || shiEmitted < 792) {
    console.warn("MISSING ENTRIES:", missingEntries, "shiEmitted:", shiEmitted);
    process.exitCode = 1;
  }

  const outPath = path.resolve(__dirname, "..", "src", "data", "japan-geo.js");
  const outContent = `// Auto-generated Conformal Web Mercator MLIT Japan Prefectures (47), All ${shiEmitted} Cities (市) & Curated Sightseeing Boundaries (${Object.keys(cityPaths).length} total)
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
  console.log(`Generated ${outPath} (${kb} KB) | Prefectures: ${Object.keys(prefPaths).length} | All Shi: ${shiEmitted} | Total City/Area Polygons: ${Object.keys(cityPaths).length} | Missing: ${missingEntries.length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
