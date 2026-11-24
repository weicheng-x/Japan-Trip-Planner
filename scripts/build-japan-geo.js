// Fetches open MLIT administrative GeoJSONs (prefectures & municipalities),
// projects coordinates into conformal Web Mercator inside 0..920 x 0..980,
// simplifies rings with Ramer-Douglas-Peucker, and emits src/data/japan-geo.js.

const fs = require("fs");
const path = require("path");

const PREF_URL = "https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0001/prefectures.json";
const MUNI_URL = "https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0001/N03-21_210101_designated_city.json";

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
  let pathParts = [];
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
      // Split at antipodal/midpoint for closed ring RDP stability
      const mid = Math.floor(open.length / 2);
      const s1 = rdp(open.slice(0, mid + 1), eps);
      const s2 = rdp(open.slice(mid).concat([open[0]]), eps);
      const simplified = s1.slice(0, -1).concat(s2.slice(0, -1));
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

// Common sightseeing city/municipality boundaries mapped explicitly to stop IDs.
// Stops omitted here (koga, omiya, narita, kushiro, plus all pref_* stops) highlight their whole prefecture instead!
const CITY_MUNI_SPEC = {
  rebun_island: { pref: "北海道", munis: ["礼文町"] },
  rishiri_island: { pref: "北海道", munis: ["利尻町", "利尻富士町"] },
  sapporo: { pref: "北海道", munis: ["札幌市"] },
  chitose: { pref: "北海道", munis: ["千歳市"] },
  otaru: { pref: "北海道", munis: ["小樽市"] },
  asahikawa: { pref: "北海道", munis: ["旭川市"] },
  furano: { pref: "北海道", munis: ["富良野市", "美瑛町", "中富良野町"] },
  niseko: { pref: "北海道", munis: ["ニセコ町", "倶知安町"] },
  noboribetsu: { pref: "北海道", munis: ["登別市", "洞爺湖町", "壮瞥町"] },
  hakodate: { pref: "北海道", munis: ["函館市"] },

  mutsu_bay: { pref: "青森県", munis: ["むつ市", "大間町", "平内町"] },
  shin_aomori: { pref: "青森県", munis: ["青森市"] },
  aomori_city: { pref: "青森県", munis: ["青森市"] },
  hirosaki: { pref: "青森県", munis: ["弘前市"] },
  hachinohe: { pref: "青森県", munis: ["八戸市"] },
  oirase: { pref: "青森県", munis: ["十和田市"] },
  misawa: { pref: "青森県", munis: ["三沢市"] },

  morioka: { pref: "岩手県", munis: ["盛岡市"] },
  nyuto_onsen: { pref: "秋田県", munis: ["仙北市"] },
  kakunodate: { pref: "秋田県", munis: ["仙北市", "秋田市"] },
  matsushima: { pref: "宮城県", munis: ["松島町", "塩竈市"] },
  sendai: { pref: "宮城県", munis: ["仙台市"] },
  naruko: { pref: "宮城県", munis: ["大崎市"] },
  tsuruoka: { pref: "山形県", munis: ["鶴岡市"] },
  ginzan_onsen: { pref: "山形県", munis: ["尾花沢市"] },
  zao: { pref: "山形県", munis: ["山形市", "上山市"] },
  kaminoyama_onsen: { pref: "山形県", munis: ["上山市"] },
  yamagata_city: { pref: "山形県", munis: ["山形市", "天童市"] },
  aizuwakamatsu: { pref: "福島県", munis: ["会津若松市", "喜多方市", "下郷町"] },

  kinugawa_onsen: { pref: "栃木県", munis: ["日光市"] },
  nikko: { pref: "栃木県", munis: ["日光市"] },
  kusatsu_onsen: { pref: "群馬県", munis: ["草津町"] },
  takasaki: { pref: "群馬県", munis: ["高崎市"] },

  tokyo: { pref: "東京都", munis: ["千代田区", "中央区", "港区", "文京区", "渋谷区", "新宿区", "台東区", "墨田区", "品川区", "大田区", "江東区"] },
  shinjuku: { pref: "東京都", munis: ["新宿区", "渋谷区", "豊島区"] },
  asakusa: { pref: "東京都", munis: ["台東区", "墨田区", "文京区"] },
  haneda: { pref: "東京都", munis: ["大田区", "品川区", "江東区", "港区"] },
  yokohama: { pref: "神奈川県", munis: ["横浜市"] },
  kamakura: { pref: "神奈川県", munis: ["鎌倉市", "藤沢市"] },
  hakone: { pref: "神奈川県", munis: ["箱根町"] },

  sado_island: { pref: "新潟県", munis: ["佐渡市"] },
  kawaguchiko: { pref: "山梨県", munis: ["富士河口湖町", "富士吉田市"] },
  hakuba: { pref: "長野県", munis: ["白馬村"] },
  azumino: { pref: "長野県", munis: ["安曇野市"] },
  matsumoto: { pref: "長野県", munis: ["松本市"] },
  karuizawa: { pref: "長野県", munis: ["軽井沢町"] },
  nagano_city: { pref: "長野県", munis: ["長野市", "山ノ内町"] },
  atami: { pref: "静岡県", munis: ["熱海市"] },
  izu: { pref: "静岡県", munis: ["伊豆市", "河津町", "下田市", "伊東市", "東伊豆町"] },
  shizuoka: { pref: "静岡県", munis: ["静岡市", "富士市"] },
  hamamatsu: { pref: "静岡県", munis: ["浜松市"] },
  nagoya: { pref: "愛知県", munis: ["名古屋市"] },
  kanazawa: { pref: "石川県", munis: ["金沢市"] },
  kaga_onsen: { pref: "石川県", munis: ["加賀市"] },
  gokayama: { pref: "富山県", munis: ["南砺市"] },
  shirakawago: { pref: "岐阜県", munis: ["白川村"] },
  takayama: { pref: "岐阜県", munis: ["高山市"] },
  ise: { pref: "三重県", munis: ["伊勢市", "鳥羽市", "志摩市"] },

  kyoto: { pref: "京都府", munis: ["京都市", "宇治市"] },
  nara: { pref: "奈良県", munis: ["奈良市"] },
  koyasan: { pref: "和歌山県", munis: ["高野町"] },
  osaka: { pref: "大阪府", munis: ["大阪市"] },
  kobe: { pref: "兵庫県", munis: ["神戸市"] },
  arima_onsen: { pref: "兵庫県", munis: ["神戸市"] },
  himeji: { pref: "兵庫県", munis: ["姫路市"] },
  kinosaki_onsen: { pref: "兵庫県", munis: ["豊岡市"] },
  awaji_island: { pref: "兵庫県", munis: ["淡路市", "洲本市", "南あわじ市"] },

  tottori_city: { pref: "鳥取県", munis: ["鳥取市"] },
  matsue: { pref: "島根県", munis: ["松江市"] },
  izumo: { pref: "島根県", munis: ["出雲市"] },
  okayama_city: { pref: "岡山県", munis: ["岡山市"] },
  kurashiki: { pref: "岡山県", munis: ["倉敷市"] },
  onomichi: { pref: "広島県", munis: ["尾道市"] },
  hiroshima: { pref: "広島県", munis: ["広島市"] },
  miyajima: { pref: "広島県", munis: ["廿日市市"] },
  shimonoseki: { pref: "山口県", munis: ["下関市"] },
  naoshima: { pref: "香川県", munis: ["直島町"] },
  takamatsu: { pref: "香川県", munis: ["高松市"] },
  matsuyama: { pref: "愛媛県", munis: ["松山市"] },

  fukuoka: { pref: "福岡県", munis: ["福岡市"] },
  dazaifu: { pref: "福岡県", munis: ["太宰府市"] },
  beppu: { pref: "大分県", munis: ["別府市"] },
  yufuin: { pref: "大分県", munis: ["由布市"] },
  kurokawa: { pref: "熊本県", munis: ["南小国町"] },
  nagasaki: { pref: "長崎県", munis: ["長崎市"] },
  kumamoto: { pref: "熊本県", munis: ["熊本市", "阿蘇市"] },
  kagoshima: { pref: "鹿児島県", munis: ["鹿児島市"] },
  yakushima: { pref: "鹿児島県", munis: ["屋久島町"] },

  onna_son: { pref: "沖縄県", munis: ["恩納村", "本部町", "名護市"] },
  chatan: { pref: "沖縄県", munis: ["北谷町", "読谷村"] },
  naha: { pref: "沖縄県", munis: ["那覇市"] },
  kerama: { pref: "沖縄県", munis: ["座間味村", "渡嘉敷村"] },
  miyakojima: { pref: "沖縄県", munis: ["宮古島市"] },
  ishigaki: { pref: "沖縄県", munis: ["石垣市"] },
  taketomi: { pref: "沖縄県", munis: ["竹富町"] }
};

async function main() {
  console.log("Fetching MLIT Prefectures & Municipalities GeoJSONs...");
  const [prefRes, muniRes] = await Promise.all([fetch(PREF_URL), fetch(MUNI_URL)]);
  if (!prefRes.ok) throw new Error("Failed pref fetch: " + prefRes.status);
  if (!muniRes.ok) throw new Error("Failed muni fetch: " + muniRes.status);
  const prefGeo = await prefRes.json();
  const muniGeo = await muniRes.json();

  const prefPaths = {};
  (prefGeo.features || []).forEach(f => {
    const pJa = f.properties && f.properties.N03_001;
    const pId = PREF_JA_TO_ID[pJa];
    if (!pId) return;
    // Exclude distant remote Pacific Ogasawara/Izu volcanic islands under Tokyo (y > 530) and distant Daito east of Okinawa (x > 250) so bounds stay tight on mainland/tourist islands
    let ringFilter = null;
    if (pId === "tokyo") ringFilter = (_cx, cy) => cy <= 530;
    else if (pId === "okinawa") ringFilter = (cx) => cx <= 250;
    const built = buildFeaturePaths([f], 0.25, 0.25, true, ringFilter);
    if (built) prefPaths[pId] = built;
  });

  const missingPrefs = Object.values(PREF_JA_TO_ID).filter(id => !prefPaths[id]);
  if (missingPrefs.length > 0) throw new Error("Missing pref paths: " + missingPrefs.join(", "));

  const cityPaths = {};
  const missingCities = [];
  Object.entries(CITY_MUNI_SPEC).forEach(([stopId, spec]) => {
    const targetMunis = new Set(spec.munis);
    const matchedFeats = (muniGeo.features || []).filter(f => {
      const pr = f.properties || {};
      if (pr.N03_001 !== spec.pref) return false;
      const mName = pr.N03_004 || pr.N03_003 || "";
      return targetMunis.has(mName);
    });
    const built = buildFeaturePaths(matchedFeats, 0.14, 0.08, true);
    if (!built) {
      missingCities.push(`${stopId}(${spec.pref}:${spec.munis.join(",")})`);
    } else {
      cityPaths[stopId] = {
        d: built.d,
        bbox: built.bbox,
        muniJa: spec.munis.join("・")
      };
    }
  });

  if (missingCities.length > 0) {
    console.warn("MISSING CITIES:", missingCities);
    process.exitCode = 1;
  }

  const outPath = path.resolve(__dirname, "..", "src", "data", "japan-geo.js");
  const outContent = `// Auto-generated Conformal Web Mercator MLIT Japan Prefectures (47) & Common City Boundaries (${Object.keys(cityPaths).length})
// Source: MLIT National Land Numerical Information via smartnews-smri/japan-topography (s0001 simplified)

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
  console.log(`Generated ${outPath} (${kb} KB) | Prefectures: ${Object.keys(prefPaths).length} | Cities: ${Object.keys(cityPaths).length} | Missing: ${missingCities.length}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
