// Real-World WGS84 Lat/Lng -> Web Mercator Japan Gazetteer (47 Prefectures + 99 Un-Lumped City & Island Stops)
// Projected onto MLIT boundary geometry from src/data/japan-geo.js

(function() {
  function projectCoords(lat, lng) {
    if (typeof window.projectJapanLatLng === "function") {
      return window.projectJapanLatLng(lat, lng);
    }
    const rad = (Math.max(-85, Math.min(85, Number(lat) || 35.68)) * Math.PI) / 180;
    const mercLat = (Math.log(Math.tan(Math.PI / 4 + rad / 2)) * 180) / Math.PI;
    return {
      x: Math.round((Number(lng) - 121.8) * 34 * 10) / 10,
      y: Math.round((52.4 - mercLat) * 34 * 10) / 10
    };
  }

  function withProj(entry) {
    const pt = projectCoords(entry.lat, entry.lng);
    const gId = entry.geoId || entry.id;
    const hasCityGeo = !!(window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[gId]);
    return Object.assign({}, entry, {
      x: pt.x,
      y: pt.y,
      geoId: gId,
      hasCityBoundary: hasCityGeo
    });
  }

  window.JAPAN_PREFECTURES = [
    { id: "hokkaido", jisCode: "01", nameEn: "Hokkaido", nameJa: "北海道", tabelogSlug: "hokkaido", regionKey: "Hokkaido", lat: 43.06, lng: 141.35, keys: ["hokkaido", "北海道"] },
    { id: "aomori", jisCode: "02", nameEn: "Aomori", nameJa: "青森県", tabelogSlug: "aomori", regionKey: "Iwate-Aomori", lat: 40.82, lng: 140.74, keys: ["aomori prefecture", "aomori", "青森県", "青森"] },
    { id: "iwate", jisCode: "03", nameEn: "Iwate", nameJa: "岩手県", tabelogSlug: "iwate", regionKey: "Iwate-Aomori", lat: 39.70, lng: 141.15, keys: ["iwate", "morioka", "hanamaki", "hiraizumi", "岩手県", "岩手", "盛岡", "花巻", "平泉"] },
    { id: "miyagi", jisCode: "04", nameEn: "Miyagi", nameJa: "宮城県", tabelogSlug: "miyagi", regionKey: "Miyagi", lat: 38.27, lng: 140.87, keys: ["miyagi", "宮城県", "宮城"] },
    { id: "akita", jisCode: "05", nameEn: "Akita", nameJa: "秋田県", tabelogSlug: "akita", regionKey: "Tohoku", lat: 39.72, lng: 140.10, keys: ["akita", "tazawa", "tazawako", "kakunodate", "oga", "秋田県", "秋田", "田沢湖", "角館", "男鹿"] },
    { id: "yamagata", jisCode: "06", nameEn: "Yamagata", nameJa: "山形県", tabelogSlug: "yamagata", regionKey: "Yamagata", lat: 38.24, lng: 140.36, keys: ["yamagata", "tendo", "yamadera", "mogami", "yonezawa", "山形県", "山形", "天童", "山寺", "最上", "米沢"] },
    { id: "fukushima", jisCode: "07", nameEn: "Fukushima", nameJa: "福島県", tabelogSlug: "fukushima", regionKey: "Tohoku", lat: 37.75, lng: 140.47, keys: ["fukushima", "aizu", "aizuwakamatsu", "kitakata", "koriyama", "inawashiro", "ouchi", "ouchijuku", "福島県", "福島", "会津", "会津若松", "喜多方", "郡山", "大内宿"] },
    { id: "ibaraki", jisCode: "08", nameEn: "Ibaraki", nameJa: "茨城県", tabelogSlug: "ibaraki", regionKey: "Tochigi-Ibaraki", lat: 36.34, lng: 140.45, keys: ["ibaraki", "mito", "koga", "hitachi", "hitachinaka", "oarai", "茨城県", "茨城", "水戸", "古河", "ひたち海浜", "大洗"] },
    { id: "tochigi", jisCode: "09", nameEn: "Tochigi", nameJa: "栃木県", tabelogSlug: "tochigi", regionKey: "Tochigi-Ibaraki", lat: 36.57, lng: 139.88, keys: ["tochigi", "utsunomiya", "oyama", "nasu", "ashikaga", "栃木県", "栃木", "宇都宮", "小山", "那須"] },
    { id: "gunma", jisCode: "10", nameEn: "Gunma", nameJa: "群馬県", tabelogSlug: "gunma", regionKey: "Gunma", lat: 36.39, lng: 139.06, keys: ["gunma", "maebashi", "ikaho", "minakami", "tomioka", "群馬県", "群馬", "前橋", "伊香保", "水上"] },
    { id: "saitama", jisCode: "11", nameEn: "Saitama", nameJa: "埼玉県", tabelogSlug: "saitama", regionKey: "Saitama", lat: 35.86, lng: 139.65, keys: ["saitama", "omiya", "kawagoe", "chichibu", "埼玉県", "埼玉", "大宮", "川越", "秩父"] },
    { id: "chiba", jisCode: "12", nameEn: "Chiba", nameJa: "千葉県", tabelogSlug: "chiba", regionKey: "Tokyo", lat: 35.61, lng: 140.12, keys: ["chiba", "narita", "maihama", "disney", "choshi", "kamogawa", "千葉県", "千葉", "成田", "舞浜", "銚子"] },
    { id: "tokyo", jisCode: "13", nameEn: "Tokyo", nameJa: "東京都", tabelogSlug: "tokyo", regionKey: "Tokyo", lat: 35.68, lng: 139.77, keys: ["tokyo", "東京都", "東京"] },
    { id: "kanagawa", jisCode: "14", nameEn: "Kanagawa", nameJa: "神奈川県", tabelogSlug: "kanagawa", regionKey: "Tokyo", lat: 35.45, lng: 139.64, keys: ["kanagawa", "odawara", "enoshima", "kawasaki", "神奈川県", "神奈川", "小田原", "江ノ島"] },
    { id: "niigata", jisCode: "15", nameEn: "Niigata", nameJa: "新潟県", tabelogSlug: "niigata", regionKey: "Chubu", lat: 37.90, lng: 139.02, keys: ["niigata", "echigo yuzawa", "yuzawa", "nagaoka", "myoko", "新潟県", "新潟", "越後湯沢", "長岡", "妙高"] },
    { id: "toyama", jisCode: "16", nameEn: "Toyama", nameJa: "富山県", tabelogSlug: "toyama", regionKey: "Chubu", lat: 36.70, lng: 137.21, keys: ["toyama", "gokayama", "ainokura", "kurobe", "tateyama", "富山県", "富山", "五箇山", "相倉", "黒部", "立山"] },
    { id: "ishikawa", jisCode: "17", nameEn: "Ishikawa", nameJa: "石川県", tabelogSlug: "ishikawa", regionKey: "Chubu", lat: 36.59, lng: 136.63, keys: ["ishikawa", "noto", "wajima", "石川県", "石川", "能登", "輪島"] },
    { id: "fukui", jisCode: "18", nameEn: "Fukui", nameJa: "福井県", tabelogSlug: "fukui", regionKey: "Chubu", lat: 36.07, lng: 136.22, keys: ["fukui", "tojinbo", "eiheiji", "tsuruga", "echizen", "福井県", "福井", "東尋坊", "永平寺", "敦賀", "越前"] },
    { id: "yamanashi", jisCode: "19", nameEn: "Yamanashi", nameJa: "山梨県", tabelogSlug: "yamanashi", regionKey: "Chubu", lat: 35.66, lng: 138.57, keys: ["yamanashi", "kofu", "oshino", "fuefuki", "yamanakako", "山梨県", "山梨", "甲府", "忍野", "山中湖"] },
    { id: "nagano", jisCode: "20", nameEn: "Nagano", nameJa: "長野県", tabelogSlug: "nagano", regionKey: "Chubu", lat: 36.65, lng: 138.18, keys: ["nagano", "karuizawa", "kamikochi", "ueda", "suwa", "narai", "長野県", "長野", "軽井沢", "上高地", "諏訪"] },
    { id: "gifu", jisCode: "21", nameEn: "Gifu", nameJa: "岐阜県", tabelogSlug: "gifu", regionKey: "Chubu", lat: 35.39, lng: 136.72, keys: ["gifu", "gero", "magome", "gujo", "岐阜県", "岐阜", "下呂", "馬籠"] },
    { id: "shizuoka", jisCode: "22", nameEn: "Shizuoka", nameJa: "静岡県", tabelogSlug: "shizuoka", regionKey: "Chubu", lat: 34.98, lng: 138.38, keys: ["shizuoka prefecture", "shizuoka", "mishima", "gotemba", "静岡県", "静岡"] },
    { id: "aichi", jisCode: "23", nameEn: "Aichi", nameJa: "愛知県", tabelogSlug: "aichi", regionKey: "Chubu", lat: 35.18, lng: 136.91, keys: ["aichi", "nagoya", "inuyama", "tokoname", "toyota", "okazaki", "愛知県", "愛知", "名古屋", "犬山"] },
    { id: "mie", jisCode: "24", nameEn: "Mie", nameJa: "三重県", tabelogSlug: "mie", regionKey: "Kansai", lat: 34.73, lng: 136.51, keys: ["mie", "ise", "ise shima", "iseshima", "shima peninsula", "toba", "matsusaka", "kumano mie", "tsu city", "tsu mie", "三重県", "三重", "伊勢", "鳥羽", "志摩", "松阪", "津市"] },
    { id: "shiga", jisCode: "25", nameEn: "Shiga", nameJa: "滋賀県", tabelogSlug: "shiga", regionKey: "Kansai", lat: 35.00, lng: 135.87, keys: ["shiga", "otsu", "biwa", "biwako", "hikone", "omi hachiman", "omihachiman", "koka shiga", "滋賀県", "滋賀", "大津", "琵琶湖", "彦根", "近江八幡"] },
    { id: "kyoto", jisCode: "26", nameEn: "Kyoto", nameJa: "京都府", tabelogSlug: "kyoto", regionKey: "Kansai", lat: 35.02, lng: 135.76, keys: ["kyoto", "amanohashidate", "ine", "京都府", "京都", "天橋立", "伊根"] },
    { id: "osaka", jisCode: "27", nameEn: "Osaka", nameJa: "大阪府", tabelogSlug: "osaka", regionKey: "Kansai", lat: 34.69, lng: 135.50, keys: ["osaka", "大阪府", "大阪"] },
    { id: "hyogo", jisCode: "28", nameEn: "Hyogo", nameJa: "兵庫県", tabelogSlug: "hyogo", regionKey: "Kansai", lat: 34.69, lng: 135.18, keys: ["hyogo", "ashiya", "takarazuka", "takeda castle", "兵庫県", "兵庫", "宝塚"] },
    { id: "nara", jisCode: "29", nameEn: "Nara", nameJa: "奈良県", tabelogSlug: "nara", regionKey: "Kansai", lat: 34.69, lng: 135.83, keys: ["nara", "yoshino", "asuka", "todai", "ikoma", "奈良県", "奈良", "吉野", "飛鳥"] },
    { id: "wakayama", jisCode: "30", nameEn: "Wakayama", nameJa: "和歌山県", tabelogSlug: "wakayama", regionKey: "Kansai", lat: 34.23, lng: 135.17, keys: ["wakayama", "koyasan", "koya", "shirahama", "nachi", "kumano", "nachikatsuura", "和歌山県", "和歌山", "高野山", "白浜", "熊野"] },
    { id: "tottori", jisCode: "31", nameEn: "Tottori", nameJa: "鳥取県", tabelogSlug: "tottori", regionKey: "Chugoku", lat: 35.50, lng: 134.24, keys: ["tottori", "kurayoshi", "yonago", "daisen", "misasa", "鳥取県", "鳥取", "倉吉", "米子", "大山", "三朝"] },
    { id: "shimane", jisCode: "32", nameEn: "Shimane", nameJa: "島根県", tabelogSlug: "shimane", regionKey: "Chugoku", lat: 35.47, lng: 133.05, keys: ["shimane", "iwami", "masuda", "oki islands", "tsuwano", "島根県", "島根", "石見", "津和野", "隠岐"] },
    { id: "okayama", jisCode: "33", nameEn: "Okayama", nameJa: "岡山県", tabelogSlug: "okayama", regionKey: "Chugoku", lat: 34.66, lng: 133.93, keys: ["okayama", "bitchu", "kojima", "岡山県", "岡山", "児島"] },
    { id: "hiroshima", jisCode: "34", nameEn: "Hiroshima", nameJa: "広島県", tabelogSlug: "hiroshima", regionKey: "Chugoku", lat: 34.40, lng: 132.46, keys: ["hiroshima", "fukuyama", "tomonoura", "kure", "takehara", "広島県", "広島", "尾道", "宮島"] },
    { id: "yamaguchi", jisCode: "35", nameEn: "Yamaguchi", nameJa: "山口県", tabelogSlug: "yamaguchi", regionKey: "Chugoku", lat: 34.19, lng: 131.47, keys: ["yamaguchi", "hagi", "iwakuni", "akiyoshidai", "kintai", "山口県", "山口", "萩", "岩国"] },
    { id: "tokushima", jisCode: "36", nameEn: "Tokushima", nameJa: "徳島県", tabelogSlug: "tokushima", regionKey: "Shikoku", lat: 34.07, lng: 134.56, keys: ["tokushima", "naruto", "iya valley", "iya", "oboke", "徳島県", "徳島", "鳴門", "祖谷"] },
    { id: "kagawa", jisCode: "37", nameEn: "Kagawa", nameJa: "香川県", tabelogSlug: "kagawa", regionKey: "Shikoku", lat: 34.34, lng: 134.04, keys: ["kagawa", "kotohira", "konpira", "shodoshima", "marugame", "香川県", "香川", "琴平", "小豆島", "丸亀"] },
    { id: "ehime", jisCode: "38", nameEn: "Ehime", nameJa: "愛媛県", tabelogSlug: "ehime", regionKey: "Shikoku", lat: 33.84, lng: 132.77, keys: ["ehime", "uchiko", "uwajima", "imabari", "shimanami", "愛媛県", "愛媛", "内子", "今治"] },
    { id: "kochi", jisCode: "39", nameEn: "Kochi", nameJa: "高知県", tabelogSlug: "kochi", regionKey: "Shikoku", lat: 33.56, lng: 133.53, keys: ["kochi", "shimanto", "katsurahama", "高知県", "高知", "四万十", "桂浜"] },
    { id: "fukuoka", jisCode: "40", nameEn: "Fukuoka", nameJa: "福岡県", tabelogSlug: "fukuoka", regionKey: "Kyushu", lat: 33.61, lng: 130.42, keys: ["fukuoka", "hakata", "kitakyushu", "mojiko", "kokura", "yanagawa", "itoshima", "福岡県", "福岡", "博多", "北九州", "門司港", "柳川"] },
    { id: "saga", jisCode: "41", nameEn: "Saga", nameJa: "佐賀県", tabelogSlug: "saga", regionKey: "Kyushu", lat: 33.25, lng: 130.30, keys: ["saga prefecture", "saga city", "saga", "arita", "imari", "ureshino", "takeo onsen", "karatsu", "yoshinogari", "佐賀県", "佐賀", "有田", "伊万里", "嬉野", "唐津"] },
    { id: "nagasaki", jisCode: "42", nameEn: "Nagasaki", nameJa: "長崎県", tabelogSlug: "nagasaki", regionKey: "Kyushu", lat: 32.75, lng: 129.88, keys: ["nagasaki", "sasebo", "huis ten bosch", "unzen", "hirado", "hashima", "gunkanjima", "長崎県", "長崎", "佐世保", "雲仙", "軍艦島"] },
    { id: "kumamoto", jisCode: "43", nameEn: "Kumamoto", nameJa: "熊本県", tabelogSlug: "kumamoto", regionKey: "Kyushu", lat: 32.79, lng: 130.74, keys: ["kumamoto", "kurokawa", "aso", "amakusa", "hitoyoshi", "熊本県", "熊本", "阿蘇", "天草"] },
    { id: "oita", jisCode: "44", nameEn: "Oita", nameJa: "大分県", tabelogSlug: "oita", regionKey: "Kyushu", lat: 33.24, lng: 131.61, keys: ["oita", "usuki", "kitsuki", "kunisaki", "大分県", "大分", "臼杵"] },
    { id: "miyazaki", jisCode: "45", nameEn: "Miyazaki", nameJa: "宮崎県", tabelogSlug: "miyazaki", regionKey: "Kyushu", lat: 31.91, lng: 131.42, keys: ["miyazaki", "takachiho", "aoshima", "nichinan", "宮崎県", "宮崎", "高千穂", "青島", "日南"] },
    { id: "kagoshima", jisCode: "46", nameEn: "Kagoshima", nameJa: "鹿児島県", tabelogSlug: "kagoshima", regionKey: "Kyushu", lat: 31.56, lng: 130.56, keys: ["kagoshima", "ibusuki", "sakurajima", "kirishima", "chiran", "amami", "鹿児島県", "鹿児島", "指宿", "桜島", "霧島"] },
    { id: "okinawa", jisCode: "47", nameEn: "Okinawa", nameJa: "沖縄県", tabelogSlug: "okinawa", regionKey: "Okinawa", lat: 26.21, lng: 127.68, keys: ["okinawa", "沖縄県", "沖縄"] }
  ].map(p => {
    const pt = projectCoords(p.lat, p.lng);
    return Object.assign({}, p, { x: pt.x, y: pt.y });
  });

  window.getPrefectureById = function(prefId) {
    return (window.JAPAN_PREFECTURES || []).find(p => p.id === prefId) || null;
  };

  // Specific Cities & Islands (each un-lumped with real lat/lng projected onto MLIT boundaries)
  const CITY_STOPS = [
    // HOKKAIDO
    { id: "rebun_island", prefId: "hokkaido", cityKey: "rebun_island", keys: ["rebun", "rebun island", "kafuka", "momoiwa", "scoton", "礼文", "礼文島", "香深"], nameEn: "Rebun Island", nameJa: "礼文島", regionKey: "Hokkaido", lat: 45.38, lng: 141.03, isAir: true },
    { id: "rishiri_island", prefId: "hokkaido", cityKey: "rebun_island", keys: ["rishiri", "rishiri island", "oshidomari", "利尻", "利尻島"], nameEn: "Rishiri Island", nameJa: "利尻島", regionKey: "Hokkaido", lat: 45.18, lng: 141.24, isAir: true },
    { id: "sapporo", prefId: "hokkaido", cityKey: "sapporo", keys: ["sapporo", "susukino", "odori", "moiwa", "札幌", "すすきの", "大通", "藻岩山"], nameEn: "Sapporo", nameJa: "札幌", regionKey: "Hokkaido", lat: 43.06, lng: 141.35 },
    { id: "chitose", prefId: "hokkaido", cityKey: "chitose", keys: ["chitose", "new chitose", "shikotsu", "shikotsuko", "千歳", "新千歳", "支笏湖"], nameEn: "Chitose / New Chitose", nameJa: "千歳・新千歳", regionKey: "Hokkaido", lat: 42.82, lng: 141.65, isAir: true },
    { id: "otaru", prefId: "hokkaido", cityKey: "otaru", keys: ["otaru", "sakaimachi", "yoichi", "小樽", "堺町", "余市"], nameEn: "Otaru", nameJa: "小樽", regionKey: "Hokkaido", lat: 43.19, lng: 140.99 },
    { id: "asahikawa", prefId: "hokkaido", cityKey: "asahikawa", keys: ["asahikawa", "asahiyama", "sounkyo", "旭川", "旭山", "層雲峡"], nameEn: "Asahikawa", nameJa: "旭川", regionKey: "Hokkaido", lat: 43.77, lng: 142.37 },
    { id: "furano", prefId: "hokkaido", cityKey: "furano", keys: ["furano", "biei", "tomita", "blue pond", "shirogane", "富良野", "美瑛", "富田", "青い池"], nameEn: "Furano / Biei", nameJa: "富良野・美瑛", regionKey: "Hokkaido", lat: 43.34, lng: 142.38 },
    { id: "niseko", prefId: "hokkaido", cityKey: "niseko", keys: ["niseko", "hirafu", "kutchan", "ニセコ", "比羅夫", "倶知安"], nameEn: "Niseko", nameJa: "ニセコ", regionKey: "Hokkaido", lat: 42.80, lng: 140.69 },
    { id: "noboribetsu", prefId: "hokkaido", cityKey: "noboribetsu", keys: ["noboribetsu", "jigokudani", "toya", "toyako", "shiraoi", "upopoy", "登別", "地獄谷", "洞爺湖", "白老"], nameEn: "Noboribetsu / Lake Toya", nameJa: "登別・洞爺湖", regionKey: "Hokkaido", lat: 42.49, lng: 141.14 },
    { id: "kushiro", prefId: "hokkaido", cityKey: "sapporo", keys: ["kushiro", "akan", "shiretoko", "abashiri", "wakkanai", "釧路", "阿寒", "知床", "網走", "稚内"], nameEn: "East / North Hokkaido", nameJa: "道東・稚内", regionKey: "Hokkaido", lat: 42.98, lng: 144.38 },
    { id: "hakodate", prefId: "hokkaido", cityKey: "hakodate", keys: ["hakodate", "goryokaku", "onuma", "函館", "五稜郭", "大沼"], nameEn: "Hakodate", nameJa: "函館", regionKey: "Hokkaido", lat: 41.77, lng: 140.73 },

    // AOMORI
    { id: "mutsu_bay", prefId: "aomori", cityKey: "mutsu_bay", keys: ["mutsu bay", "mutsu", "oma", "shimokita", "asamushi", "陸奥湾", "大間", "むつ", "下北", "浅虫"], nameEn: "Mutsu Bay", nameJa: "陸奥湾", regionKey: "Iwate-Aomori", lat: 41.29, lng: 141.21 },
    { id: "shin_aomori", prefId: "aomori", cityKey: "shin_aomori", keys: ["shin aomori", "shinaomori", "sannai maruyama", "新青森", "三内丸山"], nameEn: "Shin-Aomori", nameJa: "新青森", regionKey: "Iwate-Aomori", lat: 40.83, lng: 140.69 },
    { id: "aomori_city", prefId: "aomori", cityKey: "shin_aomori", keys: ["aomori city", "aomori station", "hakkoda", "tsutanuma", "jogakura", "nebuta", "青森市", "青森駅", "八甲田", "蔦沼", "城ヶ倉", "ねぶた"], nameEn: "Aomori / Hakkoda", nameJa: "青森市・八甲田", regionKey: "Iwate-Aomori", lat: 40.82, lng: 140.74 },
    { id: "hirosaki", prefId: "aomori", cityKey: "hirosaki", keys: ["hirosaki", "tsugaru", "iwaki", "弘前", "津軽"], nameEn: "Hirosaki", nameJa: "弘前", regionKey: "Iwate-Aomori", lat: 40.60, lng: 140.46 },
    { id: "hachinohe", prefId: "aomori", cityKey: "hachinohe", keys: ["hachinohe", "hasshoku", "kabushima", "tanesashi", "八戸", "八食", "蕪島", "種差"], nameEn: "Hachinohe", nameJa: "八戸", regionKey: "Aomori", lat: 40.51, lng: 141.49 },
    { id: "oirase", prefId: "aomori", cityKey: "hachinohe", keys: ["oirase", "towada", "yasumiya", "奥入瀬", "十和田", "十和田湖", "休屋"], nameEn: "Oirase / Lake Towada", nameJa: "奥入瀬・十和田湖", regionKey: "Iwate-Aomori", lat: 40.58, lng: 141.05 },
    { id: "misawa", prefId: "aomori", cityKey: "hachinohe", keys: ["misawa", "aomoriya", "三沢", "青森屋"], nameEn: "Misawa", nameJa: "三沢", regionKey: "Aomori", lat: 40.68, lng: 141.37 },

    // IWATE, MIYAGI, AKITA, YAMAGATA, FUKUSHIMA
    { id: "morioka", prefId: "iwate", cityKey: "morioka", keys: ["morioka", "koiwa", "wanko soba", "盛岡", "小岩井"], nameEn: "Morioka", nameJa: "盛岡", regionKey: "Iwate-Aomori", lat: 39.70, lng: 141.15 },
    { id: "nyuto_onsen", prefId: "akita", cityKey: "nyuto_onsen", keys: ["nyuto", "nyuto onsen", "nyuutou", "nyuuto", "nyutou", "tsurunoyu", "taenoyu", "ganiba", "乳頭温泉", "鶴の湯"], nameEn: "Nyuto Onsen", nameJa: "乳頭温泉郷", regionKey: "Tohoku", lat: 39.77, lng: 140.76 },
    { id: "kakunodate", prefId: "akita", cityKey: "nyuto_onsen", keys: ["kakunodate", "tazawako", "akita", "oga", "角館", "田沢湖", "秋田市", "男鹿"], nameEn: "Akita / Kakunodate", nameJa: "秋田・角館", regionKey: "Tohoku", lat: 39.60, lng: 140.56 },
    { id: "matsushima", prefId: "miyagi", cityKey: "matsushima", keys: ["matsushima", "entuuin", "zuiganji", "shiogama", "松島", "松島海岸", "瑞巌寺", "円通院", "塩竈"], nameEn: "Matsushima", nameJa: "松島", regionKey: "Miyagi", lat: 38.37, lng: 141.07 },
    { id: "akiu", prefId: "miyagi", cityKey: "sendai", geoId: "akiu", keys: ["akiu", "akiu onsen", "akiu great falls", "rairaikyo", "秋保", "秋保温泉", "秋保大滝", "磊々峡"], nameEn: "Akiu Onsen (Sendai)", nameJa: "秋保温泉（仙台）", regionKey: "Miyagi", lat: 38.225, lng: 140.718 },
    { id: "sendai", prefId: "miyagi", cityKey: "sendai", keys: ["sendai", "zuihoden", "ayashi", "jozenji", "仙台", "瑞鳳殿", "愛子"], nameEn: "Sendai", nameJa: "仙台", regionKey: "Miyagi", lat: 38.27, lng: 140.87 },
    { id: "naruko", prefId: "miyagi", cityKey: "sendai", keys: ["naruko", "furukawa", "鳴子", "鳴子峡", "古川"], nameEn: "Naruko Gorge", nameJa: "鳴子峡", regionKey: "Miyagi", lat: 38.74, lng: 140.72 },
    { id: "tsuruoka", prefId: "yamagata", cityKey: "tsuruoka", keys: ["tsuruoka", "kamo aquarium", "haguro", "dewa sanzan", "shonai", "鶴岡", "加茂水族館", "羽黒山", "出羽三山", "庄内"], nameEn: "Tsuruoka", nameJa: "鶴岡", regionKey: "Yamagata", lat: 38.73, lng: 139.83 },
    { id: "ginzan_onsen", prefId: "yamagata", cityKey: "ginzan_onsen", keys: ["ginzan", "ginzan onsen", "oishida", "銀山温泉", "大石田"], nameEn: "Ginzan Onsen", nameJa: "銀山温泉", regionKey: "Yamagata", lat: 38.57, lng: 140.53 },
    { id: "zao", prefId: "yamagata", cityKey: "zao", keys: ["zao", "zao onsen", "juhyo", "okama", "蔵王", "蔵王温泉", "樹氷"], nameEn: "Zao Onsen", nameJa: "蔵王温泉", regionKey: "Yamagata", lat: 38.17, lng: 140.40 },
    { id: "kaminoyama_onsen", prefId: "yamagata", cityKey: "kaminoyama_onsen", keys: ["kaminoyama", "kaminoyama onsen", "kaminoyama castle", "上山", "上山温泉", "かみのやま温泉"], nameEn: "Kaminoyama Onsen", nameJa: "上山温泉", regionKey: "Yamagata", lat: 38.15, lng: 140.27 },
    { id: "yamagata_city", prefId: "yamagata", cityKey: "zao", keys: ["yamagata", "tendo", "yamadera", "mogami", "yonezawa", "山形市", "天童", "山寺", "最上川", "米沢"], nameEn: "Yamagata / Tendo", nameJa: "山形・天童", regionKey: "Yamagata", lat: 38.25, lng: 140.34 },
    { id: "aizuwakamatsu", prefId: "fukushima", cityKey: "aizuwakamatsu", keys: ["aizu", "aizuwakamatsu", "tsuruga castle", "kitakata", "ouchi", "ouchijuku", "会津", "会津若松", "喜多方", "大内宿"], nameEn: "Aizuwakamatsu / Kitakata", nameJa: "会津若松・喜多方", regionKey: "Tohoku", lat: 37.49, lng: 139.93 },

    // KANTO
    { id: "koga", prefId: "ibaraki", cityKey: "ibaraki_pref", keys: ["koga", "mito", "hitachi", "hitachinaka", "oarai", "古河", "水戸", "ひたち海浜公園", "大洗"], nameEn: "Mito / Koga (Ibaraki)", nameJa: "水戸・古河（茨城）", regionKey: "Tochigi-Ibaraki", lat: 36.19, lng: 139.71 },
    { id: "kinugawa_onsen", prefId: "tochigi", cityKey: "kinugawa_onsen", keys: ["kinugawa", "kinugawa onsen", "edowonderland", "tobu world", "鬼怒川", "鬼怒川温泉"], nameEn: "Kinugawa Onsen", nameJa: "鬼怒川温泉", regionKey: "Tochigi-Ibaraki", lat: 36.82, lng: 139.71 },
    { id: "nikko", prefId: "tochigi", cityKey: "nikko", keys: ["nikko", "toshogu", "chuzenji", "kegon", "ryuzu", "shinkyo", "irohazaka", "日光", "東照宮", "中禅寺", "華厳"], nameEn: "Nikko", nameJa: "日光", regionKey: "Tochigi-Ibaraki", lat: 36.72, lng: 139.61 },
    { id: "kusatsu_onsen", prefId: "gunma", cityKey: "kusatsu_onsen", keys: ["kusatsu", "kusatsu onsen", "yubatake", "sainokawara", "草津", "草津温泉", "湯畑", "西の河原"], nameEn: "Kusatsu Onsen", nameJa: "草津温泉", regionKey: "Gunma", lat: 36.62, lng: 138.60 },
    { id: "takasaki", prefId: "gunma", cityKey: "takasaki", keys: ["takasaki", "shorinzan", "daruma", "高崎", "少林山"], nameEn: "Takasaki", nameJa: "高崎", regionKey: "Gunma", lat: 36.32, lng: 139.00 },
    { id: "omiya", prefId: "saitama", cityKey: "saitama_pref", keys: ["omiya", "kawagoe", "chichibu", "大宮", "川越", "秩父"], nameEn: "Omiya / Kawagoe", nameJa: "大宮・川越", regionKey: "Saitama", lat: 35.91, lng: 139.62 },
    { id: "narita", prefId: "chiba", cityKey: "chiba_pref", keys: ["narita", "chiba", "disney", "maihama", "naritasan", "成田", "千葉", "舞浜", "ディズニー"], nameEn: "Narita / Chiba", nameJa: "成田空港・千葉", regionKey: "Tokyo", lat: 35.77, lng: 140.39, isAir: true },
    { id: "tokyo", prefId: "tokyo", cityKey: "tokyo", keys: ["tokyo", "marunouchi", "ginza", "suidobashi", "imperial", "imperial palace", "tsukiji", "roppongi", "東京", "丸の内", "銀座", "水道橋", "皇居", "六本木"], nameEn: "Tokyo Central", nameJa: "東京・銀座", regionKey: "Tokyo", lat: 35.68, lng: 139.77 },
    { id: "shinjuku", prefId: "tokyo", cityKey: "tokyo", keys: ["shinjuku", "shibuya", "harajuku", "meiji jingu", "omotesando", "ikebukuro", "nakameguro", "新宿", "渋谷", "原宿", "明治神宮", "表参道", "池袋"], nameEn: "Shinjuku / Shibuya", nameJa: "新宿・渋谷", regionKey: "Tokyo", lat: 35.69, lng: 139.70 },
    { id: "asakusa", prefId: "tokyo", cityKey: "tokyo", keys: ["asakusa", "ueno", "akihabara", "skytree", "senso-ji", "sumida", "浅草", "上野", "秋葉原", "スカイツリー", "浅草寺"], nameEn: "Asakusa / Ueno", nameJa: "浅草・上野", regionKey: "Tokyo", lat: 35.71, lng: 139.80 },
    { id: "haneda", prefId: "tokyo", cityKey: "tokyo", keys: ["haneda", "odaiba", "toyosu", "shinagawa", "羽田", "お台場", "豊洲", "品川"], nameEn: "Haneda / Tokyo Bay", nameJa: "羽田空港・湾岸", regionKey: "Tokyo", lat: 35.55, lng: 139.78, isAir: true },
    { id: "yokohama", prefId: "kanagawa", cityKey: "yokohama", keys: ["yokohama", "minato mirai", "chinatown yokohama", "sakuragicho", "yamashita", "shin yokohama", "横浜", "みなとみらい", "桜木町"], nameEn: "Yokohama", nameJa: "横浜", regionKey: "Tokyo", lat: 35.44, lng: 139.64 },
    { id: "kamakura", prefId: "kanagawa", cityKey: "kamakura", keys: ["kamakura", "enoshima", "hase", "tsurugaoka", "鎌倉", "江ノ島", "江の島"], nameEn: "Kamakura", nameJa: "鎌倉・江ノ島", regionKey: "Tokyo", lat: 35.32, lng: 139.55 },
    { id: "hakone", prefId: "kanagawa", cityKey: "hakone", keys: ["hakone", "owakudani", "ashi", "odawara", "hakone yumoto", "motohakone", "gora", "箱根", "大涌谷", "芦ノ湖", "小田原", "強羅"], nameEn: "Hakone", nameJa: "箱根", regionKey: "Chubu", lat: 35.23, lng: 139.06 },

    // CHUBU & HOKURIKU
    { id: "sado_island", prefId: "niigata", cityKey: "sado_island", keys: ["sado", "sado island", "sado gold mine", "ryotsu", "tarai", "佐渡", "佐渡島", "佐渡ヶ島", "両津"], nameEn: "Sado Island", nameJa: "佐渡島", regionKey: "Chubu", lat: 38.02, lng: 138.37, isAir: true },
    { id: "kawaguchiko", prefId: "yamanashi", cityKey: "kawaguchiko", keys: ["kawaguchiko", "fujikawaguchiko", "chureito", "fujiyoshida", "oishi park", "arakurayama", "fuji five lakes", "河口湖", "富士河口湖", "忠霊塔", "富士吉田", "富士五湖"], nameEn: "Mt. Fuji / Kawaguchiko", nameJa: "富士山・河口湖", regionKey: "Chubu", lat: 35.51, lng: 138.76 },
    { id: "hakuba", prefId: "nagano", cityKey: "hakuba", keys: ["hakuba", "happo one", "tsugaike", "goryu", "白馬", "八方尾根"], nameEn: "Hakuba", nameJa: "白馬", regionKey: "Chubu", lat: 36.70, lng: 137.86 },
    { id: "azumino", prefId: "nagano", cityKey: "azumino", keys: ["azumino", "daio wasabi", "hotaka", "安曇野", "大王わさび農場", "穂高"], nameEn: "Azumino", nameJa: "安曇野", regionKey: "Chubu", lat: 36.30, lng: 137.90 },
    { id: "achi_village", prefId: "nagano", cityKey: "matsumoto", geoId: "achi_village", keys: ["achi", "achi village", "hirugami", "hirugami onsen", "heavens sonohara", "阿智", "阿智村", "昼神温泉"], nameEn: "Achi Village", nameJa: "阿智村", regionKey: "Chubu", lat: 35.442, lng: 137.734 },
    { id: "matsumoto", prefId: "nagano", cityKey: "matsumoto", keys: ["matsumoto", "nawate", "matsumoto castle", "kamikochi", "norikura", "松本", "松本城", "上高地", "乗鞍"], nameEn: "Matsumoto", nameJa: "松本", regionKey: "Chubu", lat: 36.24, lng: 137.97 },
    { id: "karuizawa", prefId: "nagano", cityKey: "karuizawa", keys: ["karuizawa", "kyu karuizawa", "shiraito karuizawa", "軽井沢", "旧軽井沢"], nameEn: "Karuizawa", nameJa: "軽井沢", regionKey: "Chubu", lat: 36.35, lng: 138.60 },
    { id: "nagano_city", prefId: "nagano", cityKey: "matsumoto", keys: ["nagano", "zenkoji", "yudanaka", "jigokudani monkey", "snow monkey", "長野", "善光寺", "湯田中"], nameEn: "Nagano", nameJa: "長野", regionKey: "Chubu", lat: 36.65, lng: 138.19 },
    { id: "atami", prefId: "shizuoka", cityKey: "atami", keys: ["atami", "atami baien", "kinomiya", "moa", "itogawa", "熱海", "熱海梅園", "来宮"], nameEn: "Atami", nameJa: "熱海", regionKey: "Chubu", lat: 35.10, lng: 139.07 },
    { id: "izu", prefId: "shizuoka", cityKey: "izu", keys: ["izu", "kawazu", "ito", "shimoda", "shuzenji", "jogasaki", "omuro", "伊豆", "河津", "伊東", "下田", "修善寺", "城ヶ崎"], nameEn: "Izu / Kawazu", nameJa: "伊豆・河津", regionKey: "Chubu", lat: 34.86, lng: 138.94 },
    { id: "shizuoka", prefId: "shizuoka", cityKey: "shizuoka", keys: ["shizuoka", "fujikawa", "expasa fujikawa", "miho", "nihondaira", "shimizu", "shin fuji", "静岡", "富士川", "三保", "日本平", "清水"], nameEn: "Shizuoka / Fujikawa", nameJa: "静岡・富士川", regionKey: "Chubu", lat: 35.02, lng: 138.52 },
    { id: "hamamatsu", prefId: "shizuoka", cityKey: "hamamatsu", keys: ["hamamatsu", "hamanako", "lake hamana", "kanzanji", "unagi pie", "浜松", "浜名湖", "舘山寺"], nameEn: "Hamamatsu", nameJa: "浜松", regionKey: "Chubu", lat: 34.71, lng: 137.73 },
    { id: "nagoya", prefId: "aichi", cityKey: "nagoya", keys: ["nagoya", "sakae", "osu", "ghibli", "atsuta", "atsuta jingu", "inuyama", "legoland", "名古屋", "栄", "大須", "ジブリ", "熱田神宮"], nameEn: "Nagoya", nameJa: "名古屋", regionKey: "Chubu", lat: 35.18, lng: 136.91 },
    { id: "kanazawa", prefId: "ishikawa", cityKey: "kanazawa", keys: ["kanazawa", "kenrokuen", "omicho", "higashi chaya", "nagamachi", "金沢", "兼六園", "近江町", "ひがし茶屋"], nameEn: "Kanazawa", nameJa: "金沢", regionKey: "Chubu", lat: 36.56, lng: 136.66 },
    { id: "kaga_onsen", prefId: "ishikawa", cityKey: "kaga_onsen", keys: ["kaga", "yamanaka", "yamashiro", "awazu", "katayamazu", "加賀", "山中温泉", "山代温泉", "粟津"], nameEn: "Kaga Onsen", nameJa: "加賀温泉郷", regionKey: "Chubu", lat: 36.30, lng: 136.35 },
    { id: "gokayama", prefId: "toyama", cityKey: "shirakawago", keys: ["gokayama", "ainokura", "suganuma", "五箇山", "相倉", "菅沼"], nameEn: "Gokayama", nameJa: "五箇山", regionKey: "Chubu", lat: 36.42, lng: 136.92 },
    { id: "shirakawago", prefId: "gifu", cityKey: "shirakawago", keys: ["shirakawa", "shirakawago", "ogimachi", "gassho", "白川郷", "合掌造り"], nameEn: "Shirakawa-go", nameJa: "白川郷", regionKey: "Chubu", lat: 36.26, lng: 136.91 },
    { id: "takayama", prefId: "gifu", cityKey: "takayama", keys: ["takayama", "hida", "shinhotaka", "hirayu", "sanmachi", "miyagawa", "高山", "飛騨", "新穂高", "平湯", "飛騨高山"], nameEn: "Takayama", nameJa: "飛騨高山", regionKey: "Chubu", lat: 36.14, lng: 137.25 },

    // KANSAI
    { id: "ise", prefId: "mie", cityKey: "ise", keys: ["ise", "ise jingu", "okage yokocho", "toba", "futami", "matsusaka", "伊勢", "伊勢神宮", "おかげ横丁", "鳥羽", "松阪"], nameEn: "Ise / Toba", nameJa: "伊勢・鳥羽", regionKey: "Kansai", lat: 34.49, lng: 136.71 },
    { id: "kyoto", prefId: "kyoto", cityKey: "kyoto", keys: ["kyoto", "arashiyama", "fushimi", "gion", "uji", "kiyomizu", "tofukuji", "kinkaku", "nishiki", "tenryuji", "京都", "嵐山", "伏見", "祇園", "宇治", "清水", "東福寺", "金閣寺"], nameEn: "Kyoto", nameJa: "京都", regionKey: "Kansai", lat: 35.01, lng: 135.76 },
    { id: "nara", prefId: "nara", cityKey: "nara", keys: ["nara", "todai", "kasuga", "yoshino", "asuka", "奈良", "東大寺", "春日大社", "吉野"], nameEn: "Nara", nameJa: "奈良", regionKey: "Kansai", lat: 34.68, lng: 135.83 },
    { id: "koyasan", prefId: "wakayama", cityKey: "koyasan", keys: ["koyasan", "koya", "okunoin", "kongobuji", "nachi", "kumano", "高野山", "奥の院", "那智", "熊野"], nameEn: "Koyasan", nameJa: "高野山", regionKey: "Kansai", lat: 34.21, lng: 135.59 },
    { id: "osaka", prefId: "osaka", cityKey: "osaka", keys: ["osaka", "dotonbori", "umeda", "namba", "shinsaibashi", "shinsekai", "usj", "kuromon", "kix", "kansai airport", "大阪", "道頓堀", "梅田", "難波", "なんば", "黒門", "関空"], nameEn: "Osaka", nameJa: "大阪", regionKey: "Kansai", lat: 34.69, lng: 135.50, isAir: true },
    { id: "kobe", prefId: "hyogo", cityKey: "kobe", keys: ["kobe", "sannomiya", "meriken", "harborland", "kitano ijinkan", "nankinmachi", "rokko", "motomachi", "神戸", "三宮", "メリケン", "南京町", "六甲", "北野異人館"], nameEn: "Kobe", nameJa: "神戸", regionKey: "Kansai", lat: 34.69, lng: 135.19 },
    { id: "arima_onsen", prefId: "hyogo", cityKey: "arima_onsen", keys: ["arima", "arima onsen", "kinsen", "有馬", "有馬温泉", "金の湯"], nameEn: "Arima Onsen", nameJa: "有馬温泉", regionKey: "Kansai", lat: 34.80, lng: 135.25 },
    { id: "himeji", prefId: "hyogo", cityKey: "himeji", keys: ["himeji", "himeji castle", "kokoen", "shoshazan", "姫路", "姫路城"], nameEn: "Himeji", nameJa: "姫路", regionKey: "Kansai", lat: 34.83, lng: 134.69 },
    { id: "kinosaki_onsen", prefId: "hyogo", cityKey: "kinosaki_onsen", keys: ["kinosaki", "kinosaki onsen", "城崎", "城崎温泉"], nameEn: "Kinosaki Onsen", nameJa: "城崎温泉", regionKey: "Kansai", lat: 35.62, lng: 134.81 },
    { id: "awaji_island", prefId: "hyogo", cityKey: "awaji_island", keys: ["awaji", "awaji island", "awajishima", "akashi kaikyo", "nijigen", "sumoto", "淡路", "淡路島", "洲本"], nameEn: "Awaji Island", nameJa: "淡路島", regionKey: "Kansai", lat: 34.43, lng: 134.85 },

    // CHUGOKU & SHIKOKU
    { id: "tottori_city", prefId: "tottori", cityKey: "tottori_city", keys: ["tottori", "tottori sand dunes", "uradome", "hakuto", "conan", "sakaiminato", "鳥取", "鳥取砂丘", "境港"], nameEn: "Tottori", nameJa: "鳥取", regionKey: "Chugoku", lat: 35.50, lng: 134.24 },
    { id: "matsue", prefId: "shimane", cityKey: "matsue", keys: ["matsue", "matsue castle", "adachi museum", "shinjiko", "tamatsukuri", "松江", "松江城", "足立美術館", "玉造温泉", "宍道湖"], nameEn: "Matsue", nameJa: "松江", regionKey: "Chugoku", lat: 35.47, lng: 133.05 },
    { id: "izumo", prefId: "shimane", cityKey: "izumo", keys: ["izumo", "izumo taisha", "hinomisaki", "出雲", "出雲大社"], nameEn: "Izumo", nameJa: "出雲", regionKey: "Chugoku", lat: 35.39, lng: 132.72 },
    { id: "okayama_city", prefId: "okayama", cityKey: "okayama_city", keys: ["okayama", "korakuen", "okayama castle", "岡山", "後楽園", "岡山城"], nameEn: "Okayama", nameJa: "岡山", regionKey: "Chugoku", lat: 34.66, lng: 133.92 },
    { id: "kurashiki", prefId: "okayama", cityKey: "kurashiki", keys: ["kurashiki", "bikan", "ohara museum", "kojima", "倉敷", "美観地区"], nameEn: "Kurashiki", nameJa: "倉敷", regionKey: "Chugoku", lat: 34.59, lng: 133.77 },
    { id: "onomichi", prefId: "hiroshima", cityKey: "onomichi", keys: ["onomichi", "shimanami kaido", "senkoji", "尾道", "しまなみ海道", "千光寺"], nameEn: "Onomichi", nameJa: "尾道", regionKey: "Chugoku", lat: 34.41, lng: 133.20 },
    { id: "hiroshima", prefId: "hiroshima", cityKey: "hiroshima", keys: ["hiroshima", "peace park", "atomic bomb dome", "shukkeien", "広島", "原爆ドーム", "縮景園"], nameEn: "Hiroshima", nameJa: "広島", regionKey: "Chugoku", lat: 34.40, lng: 132.46 },
    { id: "miyajima", prefId: "hiroshima", cityKey: "miyajima", keys: ["miyajima", "itsukushima", "misen", "miyajimaguchi", "宮島", "厳島", "厳島神社", "弥山"], nameEn: "Miyajima", nameJa: "宮島", regionKey: "Chugoku", lat: 34.30, lng: 132.32 },
    { id: "shimonoseki", prefId: "yamaguchi", cityKey: "shimonoseki", keys: ["shimonoseki", "karato", "karato market", "tsunoshima", "ganryujima", "kanmon", "下関", "唐戸市場", "角島", "関門"], nameEn: "Shimonoseki", nameJa: "下関", regionKey: "Chugoku", lat: 33.95, lng: 130.94 },
    { id: "naoshima", prefId: "kagawa", cityKey: "naoshima", keys: ["naoshima", "teshima", "benesse", "yayoi kusama", "直島", "豊島"], nameEn: "Naoshima", nameJa: "直島", regionKey: "Shikoku", lat: 34.46, lng: 133.99 },
    { id: "takamatsu", prefId: "kagawa", cityKey: "takamatsu", keys: ["takamatsu", "ritsurin", "shodoshima", "kotohira", "konpira", "高松", "栗林公園", "小豆島", "琴平"], nameEn: "Takamatsu", nameJa: "高松", regionKey: "Shikoku", lat: 34.34, lng: 134.05 },
    { id: "matsuyama", prefId: "ehime", cityKey: "matsuyama", keys: ["matsuyama", "dogo onsen", "dogo", "matsuyama castle", "shimonada", "松山", "道後温泉", "松山城", "下灘"], nameEn: "Matsuyama", nameJa: "松山", regionKey: "Shikoku", lat: 33.84, lng: 132.77 },

    // KYUSHU
    { id: "fukuoka", prefId: "fukuoka", cityKey: "fukuoka", keys: ["fukuoka", "hakata", "tenjin", "nakasu", "ohori", "kushida", "mojiko", "kokura", "福岡", "博多", "天神", "中洲", "小倉", "門司港"], nameEn: "Fukuoka (Hakata)", nameJa: "福岡（博多）", regionKey: "Kyushu", lat: 33.59, lng: 130.40, isAir: true },
    { id: "dazaifu", prefId: "fukuoka", cityKey: "fukuoka", keys: ["dazaifu", "yanagawa", "itoshima", "太宰府", "柳川", "糸島"], nameEn: "Dazaifu", nameJa: "太宰府", regionKey: "Kyushu", lat: 33.52, lng: 130.53 },
    { id: "beppu", prefId: "oita", cityKey: "beppu", keys: ["beppu", "jigoku", "umi jigoku", "kannawa", "別府", "地獄めぐり", "鉄輪"], nameEn: "Beppu", nameJa: "別府", regionKey: "Kyushu", lat: 33.28, lng: 131.50 },
    { id: "yufuin", prefId: "oita", cityKey: "yufuin", keys: ["yufuin", "yufu", "kinrinko", "yunotsubo", "由布院", "湯布院", "金鱗湖"], nameEn: "Yufuin", nameJa: "由布院", regionKey: "Kyushu", lat: 33.26, lng: 131.35 },
    { id: "kurokawa", prefId: "kumamoto", cityKey: "kurokawa_onsen", keys: ["kurokawa", "kurokawa onsen", "nyuto tegata", "黒川温泉"], nameEn: "Kurokawa Onsen", nameJa: "黒川温泉", regionKey: "Kyushu", lat: 33.08, lng: 131.14 },
    { id: "nagasaki", prefId: "nagasaki", cityKey: "nagasaki", keys: ["nagasaki", "dejima", "glover", "huis ten bosch", "inariyama", "hashima", "長崎", "出島", "グラバー", "ハウステンボス"], nameEn: "Nagasaki", nameJa: "長崎", regionKey: "Kyushu", lat: 32.75, lng: 129.88 },
    { id: "kumamoto", prefId: "kumamoto", cityKey: "kumamoto", keys: ["kumamoto", "aso", "mount aso", "mt aso", "kusasenri", "suizenji", "daikanbo", "熊本", "阿蘇", "草千里", "水前寺"], nameEn: "Kumamoto / Mt. Aso", nameJa: "熊本・阿蘇", regionKey: "Kyushu", lat: 32.80, lng: 130.71 },
    { id: "kagoshima", prefId: "kagoshima", cityKey: "kagoshima", keys: ["kagoshima", "sakurajima", "ibusuki", "kirishima", "senganen", "鹿児島", "桜島", "指宿", "霧島"], nameEn: "Kagoshima", nameJa: "鹿児島", regionKey: "Kyushu", lat: 31.59, lng: 130.56 },
    { id: "yakushima", prefId: "kagoshima", cityKey: "yakushima", keys: ["yakushima", "jomon sugi", "shiratani", "屋久島", "縄文杉"], nameEn: "Yakushima", nameJa: "屋久島", regionKey: "Kyushu", lat: 30.35, lng: 130.53, isAir: true },

    // OKINAWA & YAEYAMA
    { id: "onna_son", prefId: "okinawa", cityKey: "onna_son", keys: ["churaumi", "motobu", "onna", "manzamo", "nago", "kouri", "bise", "美ら海", "本部", "恩納", "恩納村", "万座毛", "名護", "古宇利", "備瀬"], nameEn: "Onna-son / Churaumi", nameJa: "恩納村・美ら海", regionKey: "Okinawa", lat: 26.58, lng: 127.91 },
    { id: "chatan", prefId: "okinawa", cityKey: "onna_son", keys: ["chatan", "american village", "maeda", "blue cave", "北谷", "真栄田", "青の洞窟"], nameEn: "Chatan / Cape Maeda", nameJa: "北谷・真栄田岬", regionKey: "Okinawa", lat: 26.33, lng: 127.76 },
    { id: "naha", prefId: "okinawa", cityKey: "naha", keys: ["naha", "shuri", "kokusai", "kokusai dori", "senagajima", "makishi", "gyokusendo", "sefa utaki", "yachimun", "那覇", "首里", "国際通り", "瀬長島", "牧志", "玉泉洞"], nameEn: "Naha (Okinawa)", nameJa: "那覇（沖縄本島）", regionKey: "Okinawa", lat: 26.21, lng: 127.68, isAir: true },
    { id: "kerama", prefId: "okinawa", cityKey: "naha", keys: ["kerama", "zamami", "tokashiki", "慶良間", "座間味", "渡嘉敷"], nameEn: "Kerama Islands", nameJa: "慶良間諸島", regionKey: "Okinawa", lat: 26.22, lng: 127.31 },
    { id: "miyakojima", prefId: "okinawa", cityKey: "miyakojima", keys: ["miyako", "miyakojima", "yonaha maehama", "irabu", "宮古", "宮古島", "伊良部"], nameEn: "Miyako Island", nameJa: "宮古島", regionKey: "Okinawa", lat: 24.81, lng: 125.28, isAir: true },
    { id: "ishigaki", prefId: "okinawa", cityKey: "ishigaki", keys: ["ishigaki", "kabira", "yaeyama", "tamatorizaki", "石垣", "石垣島", "川平", "川平湾", "八重山"], nameEn: "Ishigaki Island", nameJa: "石垣島", regionKey: "Okinawa", lat: 24.34, lng: 124.16, isAir: true },
    { id: "taketomi", prefId: "okinawa", cityKey: "taketomi", keys: ["taketomi", "iriomote", "kondoi", "hoshizuna", "竹富", "竹富島", "西表", "西表島", "コンドイ"], nameEn: "Taketomi / Iriomote", nameJa: "竹富島・西表島", regionKey: "Okinawa", lat: 24.33, lng: 123.95 }
  ].map(withProj);

  // Auto-generate all 47 Prefecture Fallback Gazetteer Entries
  const PREFECTURE_FALLBACK_STOPS = window.JAPAN_PREFECTURES.map(p => ({
    id: "pref_" + p.id,
    prefId: p.id,
    cityKey: null,
    isPrefFallback: true,
    hasCityBoundary: false,
    isAir: p.id === "okinawa",
    keys: p.keys.slice(),
    nameEn: p.nameEn + " Pref.",
    nameJa: p.nameJa,
    regionKey: p.regionKey,
    lat: p.lat,
    lng: p.lng,
    x: p.x,
    y: p.y
  }));

  window.JAPAN_GAZETTEER = CITY_STOPS.concat(PREFECTURE_FALLBACK_STOPS);

  window.getPrimaryPrefectureForDay = function(dayObj) {
    if (!dayObj) return null;
    if (dayObj.region && typeof window.resolveLocationInputStops === "function") {
      const explicit = window.resolveLocationInputStops(dayObj.region);
      if (explicit && explicit.length > 0 && explicit[0].prefId) {
        return window.getPrefectureById(explicit[0].prefId);
      }
    }
    if (typeof window.findMatchingGazetteerStops !== "function") return null;
    const checkText = (txt) => {
      if (!txt) return null;
      const matches = window.findMatchingGazetteerStops(txt);
      if (!matches || matches.length === 0) return null;
      const specific = matches.find(m => !m.isPrefFallback && m.prefId) || matches.find(m => m.prefId);
      return specific ? window.getPrefectureById(specific.prefId) : null;
    };
    return (
      checkText(dayObj.region) ||
      checkText(`${dayObj.routeJp || ""} ${dayObj.hotel || ""}`) ||
      checkText(dayObj.routeEn || "")
    );
  };
})();
