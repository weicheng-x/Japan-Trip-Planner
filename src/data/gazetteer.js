// Unified 1000x1000 SVG Japan Gazetteer: All 47 Prefectures + 75+ Distinct Sightseeing Cities & Multi-Island Paths

window.JAPAN_MAP_PATHS = {
  rebun: "M731,52 L739,50 L741,60 L733,62 Z",
  hokkaido: "M706,196 L700,174 L708,154 L722,135 L736,108 L754,74 L768,66 L790,82 L814,96 L838,94 L848,108 L830,126 L844,138 L826,154 L796,156 L776,174 L766,194 L750,180 L734,192 L722,202 Z",
  honshu: "M704,224 L724,222 L732,232 L738,224 L744,244 L750,282 L744,322 L736,360 L726,388 L718,418 L704,452 L695,482 L699,508 L694,524 L684,532 L678,522 L674,513 L666,515 L666,527 L660,536 L651,546 L643,544 L632,548 L612,554 L592,558 L576,568 L560,564 L548,576 L532,594 L520,596 L512,578 L496,576 L464,578 L430,584 L394,592 L364,606 L354,598 L368,578 L394,562 L430,552 L468,546 L504,542 L532,526 L552,494 L562,464 L574,454 L578,472 L592,464 L616,450 L642,436 L656,412 L666,374 L676,336 L682,296 L688,256 L696,234 Z",
  sado: "M644,386 L654,378 L658,390 L648,398 Z",
  awaji: "M497,578 L504,576 L502,588 L496,586 Z",
  tokyoBayWater: "M666,514 L676,514 L678,526 L671,537 L663,533 Z",
  shikoku: "M418,596 L444,588 L472,588 L488,600 L482,616 L462,628 L442,616 L422,626 L408,616 Z",
  kyushu: "M324,616 L352,622 L362,644 L366,678 L354,712 L338,742 L322,744 L318,722 L308,728 L298,708 L304,684 L290,672 L292,650 L306,632 Z",
  amami: "M246,784 L260,792 L254,808 L240,800 Z",
  okinawaMain: "M178,846 L192,854 L194,872 L182,884 L178,898 L166,904 L158,894 L164,878 L172,862 Z",
  kerama: "M148,898 L154,900 L152,906 L146,904 Z",
  miyako: "M130,918 L140,922 L136,930 L126,926 Z",
  ishigaki: "M108,932 L118,936 L114,946 L104,942 Z",
  iriomote: "M90,942 L100,944 L98,954 L88,950 Z"
};

window.JAPAN_PREFECTURES = [
  { id: "hokkaido", jisCode: "01", nameEn: "Hokkaido", nameJa: "北海道", tabelogSlug: "hokkaido", regionKey: "Hokkaido", x: 760, y: 136, keys: ["hokkaido", "北海道"] },
  { id: "aomori", jisCode: "02", nameEn: "Aomori", nameJa: "青森県", tabelogSlug: "aomori", regionKey: "Iwate-Aomori", x: 716, y: 244, keys: ["aomori prefecture", "aomori", "青森県", "青森"] },
  { id: "iwate", jisCode: "03", nameEn: "Iwate", nameJa: "岩手県", tabelogSlug: "iwate", regionKey: "Iwate-Aomori", x: 724, y: 300, keys: ["iwate", "morioka", "hanamaki", "hiraizumi", "岩手県", "岩手", "盛岡", "花巻", "平泉"] },
  { id: "miyagi", jisCode: "04", nameEn: "Miyagi", nameJa: "宮城県", tabelogSlug: "miyagi", regionKey: "Miyagi", x: 716, y: 374, keys: ["miyagi", "宮城県", "宮城"] },
  { id: "akita", jisCode: "05", nameEn: "Akita", nameJa: "秋田県", tabelogSlug: "akita", regionKey: "Tohoku", x: 690, y: 306, keys: ["akita", "tazawa", "tazawako", "kakunodate", "oga", "秋田県", "秋田", "田沢湖", "角館", "男鹿"] },
  { id: "yamagata", jisCode: "06", nameEn: "Yamagata", nameJa: "山形県", tabelogSlug: "yamagata", regionKey: "Yamagata", x: 686, y: 378, keys: ["yamagata", "tendo", "yamadera", "mogami", "yonezawa", "山形県", "山形", "天童", "山寺", "最上", "米沢"] },
  { id: "fukushima", jisCode: "07", nameEn: "Fukushima", nameJa: "福島県", tabelogSlug: "fukushima", regionKey: "Tohoku", x: 682, y: 424, keys: ["fukushima", "aizu", "aizuwakamatsu", "kitakata", "koriyama", "inawashiro", "ouchi", "ouchijuku", "福島県", "福島", "会津", "会津若松", "喜多方", "郡山", "大内宿"] },
  { id: "ibaraki", jisCode: "08", nameEn: "Ibaraki", nameJa: "茨城県", tabelogSlug: "ibaraki", regionKey: "Tochigi-Ibaraki", x: 684, y: 484, keys: ["ibaraki", "mito", "koga", "hitachi", "hitachinaka", "oarai", "茨城県", "茨城", "水戸", "古河", "ひたち海浜", "大洗"] },
  { id: "tochigi", jisCode: "09", nameEn: "Tochigi", nameJa: "栃木県", tabelogSlug: "tochigi", regionKey: "Tochigi-Ibaraki", x: 668, y: 466, keys: ["tochigi", "utsunomiya", "oyama", "nasu", "ashikaga", "栃木県", "栃木", "宇都宮", "小山", "那須"] },
  { id: "gunma", jisCode: "10", nameEn: "Gunma", nameJa: "群馬県", tabelogSlug: "gunma", regionKey: "Gunma", x: 646, y: 478, keys: ["gunma", "maebashi", "ikaho", "minakami", "tomioka", "群馬県", "群馬", "前橋", "伊香保", "水上"] },
  { id: "saitama", jisCode: "11", nameEn: "Saitama", nameJa: "埼玉県", tabelogSlug: "saitama", regionKey: "Saitama", x: 662, y: 502, keys: ["saitama", "omiya", "kawagoe", "chichibu", "埼玉県", "埼玉", "大宮", "川越", "秩父"] },
  { id: "chiba", jisCode: "12", nameEn: "Chiba", nameJa: "千葉県", tabelogSlug: "chiba", regionKey: "Tokyo", x: 686, y: 522, keys: ["chiba", "narita", "maihama", "disney", "choshi", "kamogawa", "千葉県", "千葉", "成田", "舞浜", "銚子"] },
  { id: "tokyo", jisCode: "13", nameEn: "Tokyo", nameJa: "東京都", tabelogSlug: "tokyo", regionKey: "Tokyo", x: 667, y: 518, keys: ["tokyo", "東京都", "東京"] },
  { id: "kanagawa", jisCode: "14", nameEn: "Kanagawa", nameJa: "神奈川県", tabelogSlug: "kanagawa", regionKey: "Tokyo", x: 653, y: 538, keys: ["kanagawa", "odawara", "enoshima", "kawasaki", "神奈川県", "神奈川", "小田原", "江ノ島"] },
  { id: "niigata", jisCode: "15", nameEn: "Niigata", nameJa: "新潟県", tabelogSlug: "niigata", regionKey: "Chubu", x: 654, y: 416, keys: ["niigata", "echigo yuzawa", "yuzawa", "nagaoka", "myoko", "新潟県", "新潟", "越後湯沢", "長岡", "妙高"] },
  { id: "toyama", jisCode: "16", nameEn: "Toyama", nameJa: "富山県", tabelogSlug: "toyama", regionKey: "Chubu", x: 584, y: 468, keys: ["toyama", "gokayama", "ainokura", "kurobe", "tateyama", "富山県", "富山", "五箇山", "相倉", "黒部", "立山"] },
  { id: "ishikawa", jisCode: "17", nameEn: "Ishikawa", nameJa: "石川県", tabelogSlug: "ishikawa", regionKey: "Chubu", x: 564, y: 472, keys: ["ishikawa", "noto", "wajima", "石川県", "石川", "能登", "輪島"] },
  { id: "fukui", jisCode: "18", nameEn: "Fukui", nameJa: "福井県", tabelogSlug: "fukui", regionKey: "Chubu", x: 548, y: 506, keys: ["fukui", "tojinbo", "eiheiji", "tsuruga", "echizen", "福井県", "福井", "東尋坊", "永平寺", "敦賀", "越前"] },
  { id: "yamanashi", jisCode: "19", nameEn: "Yamanashi", nameJa: "山梨県", tabelogSlug: "yamanashi", regionKey: "Chubu", x: 634, y: 522, keys: ["yamanashi", "kofu", "oshino", "fuefuki", "yamanakako", "山梨県", "山梨", "甲府", "忍野", "山中湖"] },
  { id: "nagano", jisCode: "20", nameEn: "Nagano", nameJa: "長野県", tabelogSlug: "nagano", regionKey: "Chubu", x: 616, y: 482, keys: ["nagano", "karuizawa", "kamikochi", "ueda", "suwa", "narai", "長野県", "長野", "軽井沢", "上高地", "諏訪"] },
  { id: "gifu", jisCode: "21", nameEn: "Gifu", nameJa: "岐阜県", tabelogSlug: "gifu", regionKey: "Chubu", x: 584, y: 506, keys: ["gifu", "gero", "magome", "gujo", "岐阜県", "岐阜", "下呂", "馬籠"] },
  { id: "shizuoka", jisCode: "22", nameEn: "Shizuoka", nameJa: "静岡県", tabelogSlug: "shizuoka", regionKey: "Chubu", x: 616, y: 554, keys: ["shizuoka prefecture", "shizuoka", "mishima", "gotemba", "静岡県", "静岡"] },
  { id: "aichi", jisCode: "23", nameEn: "Aichi", nameJa: "愛知県", tabelogSlug: "aichi", regionKey: "Chubu", x: 576, y: 548, keys: ["aichi", "nagoya", "inuyama", "tokoname", "toyota", "okazaki", "愛知県", "愛知", "名古屋", "犬山"] },
  { id: "mie", jisCode: "24", nameEn: "Mie", nameJa: "三重県", tabelogSlug: "mie", regionKey: "Kansai", x: 556, y: 572, keys: ["mie", "ise", "ise shima", "iseshima", "shima peninsula", "toba", "matsusaka", "kumano mie", "tsu city", "tsu mie", "三重県", "三重", "伊勢", "鳥羽", "志摩", "松阪", "津市"] },
  { id: "shiga", jisCode: "25", nameEn: "Shiga", nameJa: "滋賀県", tabelogSlug: "shiga", regionKey: "Kansai", x: 538, y: 548, keys: ["shiga", "otsu", "biwa", "biwako", "hikone", "omi hachiman", "omihachiman", "koka shiga", "滋賀県", "滋賀", "大津", "琵琶湖", "彦根", "近江八幡"] },
  { id: "kyoto", jisCode: "26", nameEn: "Kyoto", nameJa: "京都府", tabelogSlug: "kyoto", regionKey: "Kansai", x: 526, y: 554, keys: ["kyoto", "amanohashidate", "ine", "京都府", "京都", "天橋立", "伊根"] },
  { id: "osaka", jisCode: "27", nameEn: "Osaka", nameJa: "大阪府", tabelogSlug: "osaka", regionKey: "Kansai", x: 512, y: 572, keys: ["osaka", "大阪府", "大阪"] },
  { id: "hyogo", jisCode: "28", nameEn: "Hyogo", nameJa: "兵庫県", tabelogSlug: "hyogo", regionKey: "Kansai", x: 488, y: 560, keys: ["hyogo", "ashiya", "takarazuka", "takeda castle", "兵庫県", "兵庫", "宝塚"] },
  { id: "nara", jisCode: "29", nameEn: "Nara", nameJa: "奈良県", tabelogSlug: "nara", regionKey: "Kansai", x: 529, y: 575, keys: ["nara", "yoshino", "asuka", "todai", "ikoma", "奈良県", "奈良", "吉野", "飛鳥"] },
  { id: "wakayama", jisCode: "30", nameEn: "Wakayama", nameJa: "和歌山県", tabelogSlug: "wakayama", regionKey: "Kansai", x: 520, y: 594, keys: ["wakayama", "koyasan", "koya", "shirahama", "nachi", "kumano", "nachikatsuura", "和歌山県", "和歌山", "高野山", "白浜", "熊野"] },
  { id: "tottori", jisCode: "31", nameEn: "Tottori", nameJa: "鳥取県", tabelogSlug: "tottori", regionKey: "Chugoku", x: 460, y: 548, keys: ["tottori", "kurayoshi", "yonago", "daisen", "misasa", "鳥取県", "鳥取", "倉吉", "米子", "大山", "三朝"] },
  { id: "shimane", jisCode: "32", nameEn: "Shimane", nameJa: "島根県", tabelogSlug: "shimane", regionKey: "Chugoku", x: 412, y: 558, keys: ["shimane", "iwami", "masuda", "oki islands", "tsuwano", "島根県", "島根", "石見", "津和野", "隠岐"] },
  { id: "okayama", jisCode: "33", nameEn: "Okayama", nameJa: "岡山県", tabelogSlug: "okayama", regionKey: "Chugoku", x: 454, y: 566, keys: ["okayama", "bitchu", "kojima", "岡山県", "岡山", "児島"] },
  { id: "hiroshima", jisCode: "34", nameEn: "Hiroshima", nameJa: "広島県", tabelogSlug: "hiroshima", regionKey: "Chugoku", x: 400, y: 580, keys: ["hiroshima", "fukuyama", "tomonoura", "kure", "takehara", "広島県", "広島", "尾道", "宮島"] },
  { id: "yamaguchi", jisCode: "35", nameEn: "Yamaguchi", nameJa: "山口県", tabelogSlug: "yamaguchi", regionKey: "Chugoku", x: 364, y: 592, keys: ["yamaguchi", "hagi", "iwakuni", "akiyoshidai", "kintai", "山口県", "山口", "萩", "岩国"] },
  { id: "tokushima", jisCode: "36", nameEn: "Tokushima", nameJa: "徳島県", tabelogSlug: "tokushima", regionKey: "Shikoku", x: 472, y: 604, keys: ["tokushima", "naruto", "iya valley", "iya", "oboke", "徳島県", "徳島", "鳴門", "祖谷"] },
  { id: "kagawa", jisCode: "37", nameEn: "Kagawa", nameJa: "香川県", tabelogSlug: "kagawa", regionKey: "Shikoku", x: 454, y: 594, keys: ["kagawa", "kotohira", "konpira", "shodoshima", "marugame", "香川県", "香川", "琴平", "小豆島", "丸亀"] },
  { id: "ehime", jisCode: "38", nameEn: "Ehime", nameJa: "愛媛県", tabelogSlug: "ehime", regionKey: "Shikoku", x: 420, y: 612, keys: ["ehime", "uchiko", "uwajima", "imabari", "shimanami", "愛媛県", "愛媛", "内子", "今治"] },
  { id: "kochi", jisCode: "39", nameEn: "Kochi", nameJa: "高知県", tabelogSlug: "kochi", regionKey: "Shikoku", x: 444, y: 622, keys: ["kochi", "shimanto", "katsurahama", "高知県", "高知", "四万十", "桂浜"] },
  { id: "fukuoka", jisCode: "40", nameEn: "Fukuoka", nameJa: "福岡県", tabelogSlug: "fukuoka", regionKey: "Kyushu", x: 320, y: 634, keys: ["fukuoka", "hakata", "kitakyushu", "mojiko", "kokura", "yanagawa", "itoshima", "福岡県", "福岡", "博多", "北九州", "門司港", "柳川"] },
  { id: "saga", jisCode: "41", nameEn: "Saga", nameJa: "佐賀県", tabelogSlug: "saga", regionKey: "Kyushu", x: 306, y: 648, keys: ["saga prefecture", "saga city", "saga", "arita", "imari", "ureshino", "takeo onsen", "karatsu", "yoshinogari", "佐賀県", "佐賀", "有田", "伊万里", "嬉野", "唐津"] },
  { id: "nagasaki", jisCode: "42", nameEn: "Nagasaki", nameJa: "長崎県", tabelogSlug: "nagasaki", regionKey: "Kyushu", x: 294, y: 668, keys: ["nagasaki", "sasebo", "huis ten bosch", "unzen", "hirado", "hashima", "gunkanjima", "長崎県", "長崎", "佐世保", "雲仙", "軍艦島"] },
  { id: "kumamoto", jisCode: "43", nameEn: "Kumamoto", nameJa: "熊本県", tabelogSlug: "kumamoto", regionKey: "Kyushu", x: 326, y: 682, keys: ["kumamoto", "kurokawa", "aso", "amakusa", "hitoyoshi", "熊本県", "熊本", "阿蘇", "天草"] },
  { id: "oita", jisCode: "44", nameEn: "Oita", nameJa: "大分県", tabelogSlug: "oita", regionKey: "Kyushu", x: 350, y: 656, keys: ["oita", "usuki", "kitsuki", "kunisaki", "大分県", "大分", "臼杵"] },
  { id: "miyazaki", jisCode: "45", nameEn: "Miyazaki", nameJa: "宮崎県", tabelogSlug: "miyazaki", regionKey: "Kyushu", x: 342, y: 702, keys: ["miyazaki", "takachiho", "aoshima", "nichinan", "宮崎県", "宮崎", "高千穂", "青島", "日南"] },
  { id: "kagoshima", jisCode: "46", nameEn: "Kagoshima", nameJa: "鹿児島県", tabelogSlug: "kagoshima", regionKey: "Kyushu", x: 318, y: 734, keys: ["kagoshima", "ibusuki", "sakurajima", "kirishima", "chiran", "amami", "鹿児島県", "鹿児島", "指宿", "桜島", "霧島"] },
  { id: "okinawa", jisCode: "47", nameEn: "Okinawa", nameJa: "沖縄県", tabelogSlug: "okinawa", regionKey: "Okinawa", x: 168, y: 890, keys: ["okinawa", "沖縄県", "沖縄"] }
];

window.getPrefectureById = function(prefId) {
  return (window.JAPAN_PREFECTURES || []).find(p => p.id === prefId) || null;
};

// Specific Cities & Islands (each un-lumped with dedicated prefId & cityKey)
const CITY_STOPS = [
  // HOKKAIDO
  { id: "rebun_island", prefId: "hokkaido", cityKey: "rebun_island", keys: ["rebun", "rebun island", "kafuka", "momoiwa", "scoton", "礼文", "礼文島", "香深"], nameEn: "Rebun Island", nameJa: "礼文島", regionKey: "Hokkaido", x: 735, y: 56, isAir: true },
  { id: "rishiri_island", prefId: "hokkaido", cityKey: "rebun_island", keys: ["rishiri", "rishiri island", "oshidomari", "利尻", "利尻島"], nameEn: "Rishiri Island", nameJa: "利尻島", regionKey: "Hokkaido", x: 742, y: 68, isAir: true },
  { id: "sapporo", prefId: "hokkaido", cityKey: "sapporo", keys: ["sapporo", "susukino", "odori", "moiwa", "札幌", "すすきの", "大通", "藻岩山"], nameEn: "Sapporo", nameJa: "札幌", regionKey: "Hokkaido", x: 755, y: 135 },
  { id: "chitose", prefId: "hokkaido", cityKey: "chitose", keys: ["chitose", "new chitose", "shikotsu", "shikotsuko", "千歳", "新千歳", "支笏湖"], nameEn: "Chitose / New Chitose", nameJa: "千歳・新千歳", regionKey: "Hokkaido", x: 760, y: 145, isAir: true },
  { id: "otaru", prefId: "hokkaido", cityKey: "otaru", keys: ["otaru", "sakaimachi", "yoichi", "小樽", "堺町", "余市"], nameEn: "Otaru", nameJa: "小樽", regionKey: "Hokkaido", x: 739, y: 131 },
  { id: "asahikawa", prefId: "hokkaido", cityKey: "asahikawa", keys: ["asahikawa", "asahiyama", "sounkyo", "旭川", "旭山", "層雲峡"], nameEn: "Asahikawa", nameJa: "旭川", regionKey: "Hokkaido", x: 782, y: 112 },
  { id: "furano", prefId: "hokkaido", cityKey: "furano", keys: ["furano", "biei", "tomita", "blue pond", "shirogane", "富良野", "美瑛", "富田", "青い池"], nameEn: "Furano / Biei", nameJa: "富良野・美瑛", regionKey: "Hokkaido", x: 778, y: 125 },
  { id: "niseko", prefId: "hokkaido", cityKey: "niseko", keys: ["niseko", "hirafu", "kutchan", "ニセコ", "比羅夫", "倶知安"], nameEn: "Niseko", nameJa: "ニセコ", regionKey: "Hokkaido", x: 730, y: 148 },
  { id: "noboribetsu", prefId: "hokkaido", cityKey: "noboribetsu", keys: ["noboribetsu", "jigokudani", "toya", "toyako", "shiraoi", "upopoy", "登別", "地獄谷", "洞爺湖", "白老"], nameEn: "Noboribetsu / Lake Toya", nameJa: "登別・洞爺湖", regionKey: "Hokkaido", x: 745, y: 159 },
  { id: "kushiro", prefId: "hokkaido", cityKey: "sapporo", keys: ["kushiro", "akan", "shiretoko", "abashiri", "wakkanai", "釧路", "阿寒", "知床", "網走", "稚内"], nameEn: "East / North Hokkaido", nameJa: "道東・稚内", regionKey: "Hokkaido", x: 822, y: 122 },
  { id: "hakodate", prefId: "hokkaido", cityKey: "hakodate", keys: ["hakodate", "goryokaku", "onuma", "函館", "五稜郭", "大沼"], nameEn: "Hakodate", nameJa: "函館", regionKey: "Hokkaido", x: 718, y: 190 },

  // AOMORI PREFECTURE (Distinct spots!)
  { id: "mutsu_bay", prefId: "aomori", cityKey: "mutsu_bay", keys: ["mutsu bay", "mutsu", "oma", "shimokita", "asamushi", "陸奥湾", "大間", "むつ", "下北", "浅虫"], nameEn: "Mutsu Bay", nameJa: "陸奥湾", regionKey: "Iwate-Aomori", x: 720, y: 224 },
  { id: "shin_aomori", prefId: "aomori", cityKey: "shin_aomori", keys: ["shin aomori", "shinaomori", "sannai maruyama", "新青森", "三内丸山"], nameEn: "Shin-Aomori", nameJa: "新青森", regionKey: "Iwate-Aomori", x: 709, y: 242 },
  { id: "aomori_city", prefId: "aomori", cityKey: "shin_aomori", keys: ["aomori city", "aomori station", "hakkoda", "tsutanuma", "jogakura", "nebuta", "青森市", "青森駅", "八甲田", "蔦沼", "城ヶ倉", "ねぶた"], nameEn: "Aomori / Hakkoda", nameJa: "青森市・八甲田", regionKey: "Iwate-Aomori", x: 716, y: 238 },
  { id: "hirosaki", prefId: "aomori", cityKey: "hirosaki", keys: ["hirosaki", "tsugaru", "iwaki", "弘前", "津軽"], nameEn: "Hirosaki", nameJa: "弘前", regionKey: "Iwate-Aomori", x: 697, y: 249 },
  { id: "hachinohe", prefId: "aomori", cityKey: "hachinohe", keys: ["hachinohe", "hasshoku", "kabushima", "tanesashi", "八戸", "八食", "蕪島", "種差"], nameEn: "Hachinohe", nameJa: "八戸", regionKey: "Aomori", x: 734, y: 256 },
  { id: "oirase", prefId: "aomori", cityKey: "hachinohe", keys: ["oirase", "towada", "yasumiya", "奥入瀬", "十和田", "十和田湖", "休屋"], nameEn: "Oirase / Lake Towada", nameJa: "奥入瀬・十和田湖", regionKey: "Iwate-Aomori", x: 715, y: 266 },
  { id: "misawa", prefId: "aomori", cityKey: "hachinohe", keys: ["misawa", "aomoriya", "三沢", "青森屋"], nameEn: "Misawa", nameJa: "三沢", regionKey: "Aomori", x: 732, y: 246 },

  // IWATE, MIYAGI, AKITA, YAMAGATA, FUKUSHIMA
  { id: "morioka", prefId: "iwate", cityKey: "morioka", keys: ["morioka", "koiwa", "wanko soba", "盛岡", "小岩井"], nameEn: "Morioka", nameJa: "盛岡", regionKey: "Iwate-Aomori", x: 722, y: 302 },
  { id: "nyuto_onsen", prefId: "akita", cityKey: "nyuto_onsen", keys: ["nyuto", "nyuto onsen", "nyuutou", "nyuuto", "nyutou", "tsurunoyu", "taenoyu", "ganiba", "乳頭温泉", "鶴の湯"], nameEn: "Nyuto Onsen", nameJa: "乳頭温泉郷", regionKey: "Tohoku", x: 704, y: 299 },
  { id: "kakunodate", prefId: "akita", cityKey: "nyuto_onsen", keys: ["kakunodate", "tazawako", "akita", "oga", "角館", "田沢湖", "秋田市", "男鹿"], nameEn: "Akita / Kakunodate", nameJa: "秋田・角館", regionKey: "Tohoku", x: 688, y: 306 },
  { id: "matsushima", prefId: "miyagi", cityKey: "matsushima", keys: ["matsushima", "entuuin", "zuiganji", "shiogama", "松島", "松島海岸", "瑞巌寺", "円通院", "塩竈"], nameEn: "Matsushima", nameJa: "松島", regionKey: "Miyagi", x: 724, y: 368 },
  { id: "sendai", prefId: "miyagi", cityKey: "sendai", keys: ["sendai", "akiu", "rairaikyo", "zuihoden", "ayashi", "仙台", "秋保", "磊々峡", "瑞鳳殿"], nameEn: "Sendai", nameJa: "仙台", regionKey: "Miyagi", x: 714, y: 376 },
  { id: "naruko", prefId: "miyagi", cityKey: "sendai", keys: ["naruko", "furukawa", "鳴子", "鳴子峡", "古川"], nameEn: "Naruko Gorge", nameJa: "鳴子峡", regionKey: "Miyagi", x: 704, y: 348 },
  { id: "tsuruoka", prefId: "yamagata", cityKey: "tsuruoka", keys: ["tsuruoka", "kamo aquarium", "haguro", "dewa sanzan", "shonai", "鶴岡", "加茂水族館", "羽黒山", "出羽三山", "庄内"], nameEn: "Tsuruoka", nameJa: "鶴岡", regionKey: "Yamagata", x: 676, y: 356 },
  { id: "ginzan_onsen", prefId: "yamagata", cityKey: "ginzan_onsen", keys: ["ginzan", "ginzan onsen", "oishida", "銀山温泉", "大石田"], nameEn: "Ginzan Onsen", nameJa: "銀山温泉", regionKey: "Yamagata", x: 693, y: 367 },
  { id: "zao", prefId: "yamagata", cityKey: "zao", keys: ["zao", "zao onsen", "juhyo", "okama", "蔵王", "蔵王温泉", "樹氷"], nameEn: "Zao Onsen", nameJa: "蔵王温泉", regionKey: "Yamagata", x: 695, y: 386 },
  { id: "kaminoyama_onsen", prefId: "yamagata", cityKey: "kaminoyama_onsen", keys: ["kaminoyama", "kaminoyama onsen", "kaminoyama castle", "上山", "上山温泉", "かみのやま温泉"], nameEn: "Kaminoyama Onsen", nameJa: "上山温泉", regionKey: "Yamagata", x: 688, y: 391 },
  { id: "yamagata_city", prefId: "yamagata", cityKey: "zao", keys: ["yamagata", "tendo", "yamadera", "mogami", "yonezawa", "山形市", "天童", "山寺", "最上川", "米沢"], nameEn: "Yamagata / Tendo", nameJa: "山形・天童", regionKey: "Yamagata", x: 684, y: 380 },
  { id: "aizuwakamatsu", prefId: "fukushima", cityKey: "aizuwakamatsu", keys: ["aizu", "aizuwakamatsu", "tsuruga castle", "kitakata", "ouchi", "ouchijuku", "会津", "会津若松", "喜多方", "大内宿"], nameEn: "Aizuwakamatsu / Kitakata", nameJa: "会津若松・喜多方", regionKey: "Tohoku", x: 678, y: 424 },

  // KANTO (IBARAKI, TOCHIGI, GUNMA, SAITAMA, CHIBA, TOKYO, KANAGAWA)
  { id: "koga", prefId: "ibaraki", cityKey: "ibaraki_pref", keys: ["koga", "mito", "hitachi", "hitachinaka", "oarai", "古河", "水戸", "ひたち海浜公園", "大洗"], nameEn: "Mito / Koga (Ibaraki)", nameJa: "水戸・古河（茨城）", regionKey: "Tochigi-Ibaraki", x: 678, y: 486 },
  { id: "kinugawa_onsen", prefId: "tochigi", cityKey: "kinugawa_onsen", keys: ["kinugawa", "kinugawa onsen", "edowonderland", "tobu world", "鬼怒川", "鬼怒川温泉"], nameEn: "Kinugawa Onsen", nameJa: "鬼怒川温泉", regionKey: "Tochigi-Ibaraki", x: 666, y: 455 },
  { id: "nikko", prefId: "tochigi", cityKey: "nikko", keys: ["nikko", "toshogu", "chuzenji", "kegon", "ryuzu", "shinkyo", "irohazaka", "日光", "東照宮", "中禅寺", "華厳"], nameEn: "Nikko", nameJa: "日光", regionKey: "Tochigi-Ibaraki", x: 661, y: 463 },
  { id: "kusatsu_onsen", prefId: "gunma", cityKey: "kusatsu_onsen", keys: ["kusatsu", "kusatsu onsen", "yubatake", "sainokawara", "草津", "草津温泉", "湯畑", "西の河原"], nameEn: "Kusatsu Onsen", nameJa: "草津温泉", regionKey: "Gunma", x: 642, y: 472 },
  { id: "takasaki", prefId: "gunma", cityKey: "takasaki", keys: ["takasaki", "shorinzan", "daruma", "高崎", "少林山"], nameEn: "Takasaki", nameJa: "高崎", regionKey: "Gunma", x: 648, y: 484 },
  { id: "omiya", prefId: "saitama", cityKey: "saitama_pref", keys: ["omiya", "kawagoe", "chichibu", "大宮", "川越", "秩父"], nameEn: "Omiya / Kawagoe", nameJa: "大宮・川越", regionKey: "Saitama", x: 663, y: 503 },
  { id: "narita", prefId: "chiba", cityKey: "chiba_pref", keys: ["narita", "chiba", "disney", "maihama", "naritasan", "成田", "千葉", "舞浜", "ディズニー"], nameEn: "Narita / Chiba", nameJa: "成田空港・千葉", regionKey: "Tokyo", x: 688, y: 517, isAir: true },
  { id: "tokyo", prefId: "tokyo", cityKey: "tokyo", keys: ["tokyo", "marunouchi", "ginza", "suidobashi", "imperial", "imperial palace", "tsukiji", "roppongi", "東京", "丸の内", "銀座", "水道橋", "皇居", "六本木"], nameEn: "Tokyo Central", nameJa: "東京・銀座", regionKey: "Tokyo", x: 668, y: 518 },
  { id: "shinjuku", prefId: "tokyo", cityKey: "tokyo", keys: ["shinjuku", "shibuya", "harajuku", "meiji jingu", "omotesando", "ikebukuro", "nakameguro", "新宿", "渋谷", "原宿", "明治神宮", "表参道", "池袋"], nameEn: "Shinjuku / Shibuya", nameJa: "新宿・渋谷", regionKey: "Tokyo", x: 660, y: 519 },
  { id: "asakusa", prefId: "tokyo", cityKey: "tokyo", keys: ["asakusa", "ueno", "akihabara", "skytree", "senso-ji", "sumida", "浅草", "上野", "秋葉原", "スカイツリー", "浅草寺"], nameEn: "Asakusa / Ueno", nameJa: "浅草・上野", regionKey: "Tokyo", x: 673, y: 514 },
  { id: "haneda", prefId: "tokyo", cityKey: "tokyo", keys: ["haneda", "odaiba", "toyosu", "shinagawa", "羽田", "お台場", "豊洲", "品川"], nameEn: "Haneda / Tokyo Bay", nameJa: "羽田空港・湾岸", regionKey: "Tokyo", x: 669, y: 528, isAir: true },
  { id: "yokohama", prefId: "kanagawa", cityKey: "yokohama", keys: ["yokohama", "minato mirai", "chinatown yokohama", "sakuragicho", "yamashita", "shin yokohama", "横浜", "みなとみらい", "桜木町"], nameEn: "Yokohama", nameJa: "横浜", regionKey: "Tokyo", x: 659, y: 535 },
  { id: "kamakura", prefId: "kanagawa", cityKey: "kamakura", keys: ["kamakura", "enoshima", "hase", "tsurugaoka", "鎌倉", "江ノ島", "江の島"], nameEn: "Kamakura", nameJa: "鎌倉・江ノ島", regionKey: "Tokyo", x: 655, y: 539 },
  { id: "hakone", prefId: "kanagawa", cityKey: "hakone", keys: ["hakone", "owakudani", "ashi", "odawara", "hakone yumoto", "motohakone", "gora", "箱根", "大涌谷", "芦ノ湖", "小田原", "強羅"], nameEn: "Hakone", nameJa: "箱根", regionKey: "Chubu", x: 644, y: 542 },

  // CHUBU & HOKURIKU
  { id: "sado_island", prefId: "niigata", cityKey: "sado_island", keys: ["sado", "sado island", "sado gold mine", "ryotsu", "tarai", "佐渡", "佐渡島", "佐渡ヶ島", "両津"], nameEn: "Sado Island", nameJa: "佐渡島", regionKey: "Chubu", x: 650, y: 388, isAir: true },
  { id: "kawaguchiko", prefId: "yamanashi", cityKey: "kawaguchiko", keys: ["kawaguchiko", "fuji", "mount fuji", "mt fuji", "chureito", "fujiyoshida", "oishi park", "arakurayama", "河口湖", "富士山", "忠霊塔", "富士吉田", "富士五湖"], nameEn: "Mt. Fuji / Kawaguchiko", nameJa: "富士山・河口湖", regionKey: "Chubu", x: 634, y: 526 },
  { id: "hakuba", prefId: "nagano", cityKey: "hakuba", keys: ["hakuba", "happo one", "tsugaike", "goryu", "白馬", "八方尾根"], nameEn: "Hakuba", nameJa: "白馬", regionKey: "Chubu", x: 604, y: 468 },
  { id: "azumino", prefId: "nagano", cityKey: "azumino", keys: ["azumino", "daio wasabi", "hotaka", "安曇野", "大王わさび農場", "穂高"], nameEn: "Azumino", nameJa: "安曇野", regionKey: "Chubu", x: 612, y: 482 },
  { id: "matsumoto", prefId: "nagano", cityKey: "matsumoto", keys: ["matsumoto", "nawate", "matsumoto castle", "kamikochi", "norikura", "松本", "松本城", "上高地", "乗鞍"], nameEn: "Matsumoto", nameJa: "松本", regionKey: "Chubu", x: 615, y: 489 },
  { id: "karuizawa", prefId: "nagano", cityKey: "karuizawa", keys: ["karuizawa", "kyu karuizawa", "shiraito karuizawa", "軽井沢", "旧軽井沢"], nameEn: "Karuizawa", nameJa: "軽井沢", regionKey: "Chubu", x: 634, y: 480 },
  { id: "nagano_city", prefId: "nagano", cityKey: "matsumoto", keys: ["nagano", "zenkoji", "yudanaka", "jigokudani monkey", "snow monkey", "長野", "善光寺", "湯田中"], nameEn: "Nagano", nameJa: "長野", regionKey: "Chubu", x: 620, y: 468 },
  { id: "atami", prefId: "shizuoka", cityKey: "atami", keys: ["atami", "atami baien", "kinomiya", "moa", "itogawa", "熱海", "熱海梅園", "来宮"], nameEn: "Atami", nameJa: "熱海", regionKey: "Chubu", x: 642, y: 549 },
  { id: "izu", prefId: "shizuoka", cityKey: "izu", keys: ["izu", "kawazu", "ito", "shimoda", "shuzenji", "jogasaki", "omuro", "伊豆", "河津", "伊東", "下田", "修善寺", "城ヶ崎"], nameEn: "Izu / Kawazu", nameJa: "伊豆・河津", regionKey: "Chubu", x: 638, y: 560 },
  { id: "shizuoka", prefId: "shizuoka", cityKey: "shizuoka", keys: ["shizuoka", "fujikawa", "expasa fujikawa", "miho", "nihondaira", "shimizu", "shin fuji", "静岡", "富士川", "三保", "日本平", "清水"], nameEn: "Shizuoka / Fujikawa", nameJa: "静岡・富士川", regionKey: "Chubu", x: 616, y: 554 },
  { id: "hamamatsu", prefId: "shizuoka", cityKey: "hamamatsu", keys: ["hamamatsu", "hamanako", "lake hamana", "kanzanji", "unagi pie", "浜松", "浜名湖", "舘山寺"], nameEn: "Hamamatsu", nameJa: "浜松", regionKey: "Chubu", x: 594, y: 558 },
  { id: "nagoya", prefId: "aichi", cityKey: "nagoya", keys: ["nagoya", "sakae", "osu", "ghibli", "atsuta", "atsuta jingu", "inuyama", "legoland", "名古屋", "栄", "大須", "ジブリ", "熱田神宮"], nameEn: "Nagoya", nameJa: "名古屋", regionKey: "Chubu", x: 576, y: 548 },
  { id: "kanazawa", prefId: "ishikawa", cityKey: "kanazawa", keys: ["kanazawa", "kenrokuen", "omicho", "higashi chaya", "nagamachi", "金沢", "兼六園", "近江町", "ひがし茶屋"], nameEn: "Kanazawa", nameJa: "金沢", regionKey: "Chubu", x: 566, y: 468 },
  { id: "kaga_onsen", prefId: "ishikawa", cityKey: "kaga_onsen", keys: ["kaga", "yamanaka", "yamashiro", "awazu", "katayamazu", "加賀", "山中温泉", "山代温泉", "粟津"], nameEn: "Kaga Onsen", nameJa: "加賀温泉郷", regionKey: "Chubu", x: 556, y: 480 },
  { id: "gokayama", prefId: "toyama", cityKey: "shirakawago", keys: ["gokayama", "ainokura", "suganuma", "五箇山", "相倉", "菅沼"], nameEn: "Gokayama", nameJa: "五箇山", regionKey: "Chubu", x: 575, y: 482 },
  { id: "shirakawago", prefId: "gifu", cityKey: "shirakawago", keys: ["shirakawa", "shirakawago", "ogimachi", "gassho", "白川郷", "合掌造り"], nameEn: "Shirakawa-go", nameJa: "白川郷", regionKey: "Chubu", x: 579, y: 492 },
  { id: "takayama", prefId: "gifu", cityKey: "takayama", keys: ["takayama", "hida", "shinhotaka", "hirayu", "sanmachi", "miyagawa", "高山", "飛騨", "新穂高", "平湯", "飛騨高山"], nameEn: "Takayama", nameJa: "飛騨高山", regionKey: "Chubu", x: 586, y: 500 },

  // KANSAI (MIE, SHIGA, KYOTO, OSAKA, HYOGO, NARA, WAKAYAMA)
  { id: "ise", prefId: "mie", cityKey: "ise", keys: ["ise", "ise jingu", "okage yokocho", "toba", "futami", "matsusaka", "伊勢", "伊勢神宮", "おかげ横丁", "鳥羽", "松阪"], nameEn: "Ise / Toba", nameJa: "伊勢・鳥羽", regionKey: "Kansai", x: 556, y: 576 },
  { id: "kyoto", prefId: "kyoto", cityKey: "kyoto", keys: ["kyoto", "arashiyama", "fushimi", "gion", "uji", "kiyomizu", "tofukuji", "kinkaku", "nishiki", "tenryuji", "京都", "嵐山", "伏見", "祇園", "宇治", "清水", "東福寺", "金閣寺"], nameEn: "Kyoto", nameJa: "京都", regionKey: "Kansai", x: 526, y: 555 },
  { id: "nara", prefId: "nara", cityKey: "nara", keys: ["nara", "todai", "kasuga", "yoshino", "asuka", "奈良", "東大寺", "春日大社", "吉野"], nameEn: "Nara", nameJa: "奈良", regionKey: "Kansai", x: 529, y: 575 },
  { id: "koyasan", prefId: "wakayama", cityKey: "koyasan", keys: ["koyasan", "koya", "okunoin", "kongobuji", "nachi", "kumano", "高野山", "奥の院", "那智", "熊野"], nameEn: "Koyasan", nameJa: "高野山", regionKey: "Kansai", x: 520, y: 590 },
  { id: "osaka", prefId: "osaka", cityKey: "osaka", keys: ["osaka", "dotonbori", "umeda", "namba", "shinsaibashi", "shinsekai", "usj", "kuromon", "kix", "kansai airport", "大阪", "道頓堀", "梅田", "難波", "なんば", "黒門", "関空"], nameEn: "Osaka", nameJa: "大阪", regionKey: "Kansai", x: 512, y: 572, isAir: true },
  { id: "kobe", prefId: "hyogo", cityKey: "kobe", keys: ["kobe", "sannomiya", "meriken", "harborland", "kitano", "nankinmachi", "rokko", "motomachi", "神戸", "三宮", "メリケン", "南京町", "六甲"], nameEn: "Kobe", nameJa: "神戸", regionKey: "Kansai", x: 493, y: 568 },
  { id: "arima_onsen", prefId: "hyogo", cityKey: "arima_onsen", keys: ["arima", "arima onsen", "kinsen", "有馬", "有馬温泉", "金の湯"], nameEn: "Arima Onsen", nameJa: "有馬温泉", regionKey: "Kansai", x: 497, y: 561 },
  { id: "himeji", prefId: "hyogo", cityKey: "himeji", keys: ["himeji", "himeji castle", "kokoen", "shoshazan", "姫路", "姫路城"], nameEn: "Himeji", nameJa: "姫路", regionKey: "Kansai", x: 479, y: 565 },
  { id: "kinosaki_onsen", prefId: "hyogo", cityKey: "kinosaki_onsen", keys: ["kinosaki", "kinosaki onsen", "城崎", "城崎温泉"], nameEn: "Kinosaki Onsen", nameJa: "城崎温泉", regionKey: "Kansai", x: 486, y: 542 },
  { id: "awaji_island", prefId: "hyogo", cityKey: "awaji_island", keys: ["awaji", "awaji island", "awajishima", "akashi kaikyo", "nijigen", "sumoto", "淡路", "淡路島", "洲本"], nameEn: "Awaji Island", nameJa: "淡路島", regionKey: "Kansai", x: 499, y: 583 },

  // CHUGOKU & SHIKOKU (TOTTORI, SHIMANE, OKAYAMA, HIROSHIMA, YAMAGUCHI, KAGAWA, EHIME, TOKUSHIMA, KOCHI)
  { id: "tottori_city", prefId: "tottori", cityKey: "tottori_city", keys: ["tottori", "tottori sand dunes", "uradome", "hakuto", "conan", "sakaiminato", "鳥取", "鳥取砂丘", "境港"], nameEn: "Tottori", nameJa: "鳥取", regionKey: "Chugoku", x: 463, y: 547 },
  { id: "matsue", prefId: "shimane", cityKey: "matsue", keys: ["matsue", "matsue castle", "adachi museum", "shinjiko", "tamatsukuri", "松江", "松江城", "足立美術館", "玉造温泉", "宍道湖"], nameEn: "Matsue", nameJa: "松江", regionKey: "Chugoku", x: 420, y: 553 },
  { id: "izumo", prefId: "shimane", cityKey: "izumo", keys: ["izumo", "izumo taisha", "hinomisaki", "出雲", "出雲大社"], nameEn: "Izumo", nameJa: "出雲", regionKey: "Chugoku", x: 404, y: 558 },
  { id: "okayama_city", prefId: "okayama", cityKey: "okayama_city", keys: ["okayama", "korakuen", "okayama castle", "岡山", "後楽園", "岡山城"], nameEn: "Okayama", nameJa: "岡山", regionKey: "Chugoku", x: 457, y: 566 },
  { id: "kurashiki", prefId: "okayama", cityKey: "kurashiki", keys: ["kurashiki", "bikan", "ohara museum", "kojima", "倉敷", "美観地区"], nameEn: "Kurashiki", nameJa: "倉敷", regionKey: "Chugoku", x: 448, y: 568 },
  { id: "onomichi", prefId: "hiroshima", cityKey: "onomichi", keys: ["onomichi", "shimanami kaido", "senkoji", "尾道", "しまなみ海道", "千光寺"], nameEn: "Onomichi", nameJa: "尾道", regionKey: "Chugoku", x: 424, y: 576 },
  { id: "hiroshima", prefId: "hiroshima", cityKey: "hiroshima", keys: ["hiroshima", "peace park", "atomic bomb dome", "shukkeien", "広島", "原爆ドーム", "縮景園"], nameEn: "Hiroshima", nameJa: "広島", regionKey: "Chugoku", x: 396, y: 583 },
  { id: "miyajima", prefId: "hiroshima", cityKey: "miyajima", keys: ["miyajima", "itsukushima", "misen", "miyajimaguchi", "宮島", "厳島", "厳島神社", "弥山"], nameEn: "Miyajima", nameJa: "宮島", regionKey: "Chugoku", x: 389, y: 589 },
  { id: "shimonoseki", prefId: "yamaguchi", cityKey: "shimonoseki", keys: ["shimonoseki", "karato", "karato market", "tsunoshima", "ganryujima", "kanmon", "下関", "唐戸市場", "角島", "関門"], nameEn: "Shimonoseki", nameJa: "下関", regionKey: "Chugoku", x: 351, y: 601 },
  { id: "naoshima", prefId: "kagawa", cityKey: "naoshima", keys: ["naoshima", "teshima", "benesse", "yayoi kusama", "直島", "豊島"], nameEn: "Naoshima", nameJa: "直島", regionKey: "Shikoku", x: 452, y: 582 },
  { id: "takamatsu", prefId: "kagawa", cityKey: "takamatsu", keys: ["takamatsu", "ritsurin", "shodoshima", "kotohira", "konpira", "高松", "栗林公園", "小豆島", "琴平"], nameEn: "Takamatsu", nameJa: "高松", regionKey: "Shikoku", x: 457, y: 594 },
  { id: "matsuyama", prefId: "ehime", cityKey: "matsuyama", keys: ["matsuyama", "dogo onsen", "dogo", "matsuyama castle", "shimonada", "松山", "道後温泉", "松山城", "下灘"], nameEn: "Matsuyama", nameJa: "松山", regionKey: "Shikoku", x: 418, y: 610 },

  // KYUSHU
  { id: "fukuoka", prefId: "fukuoka", cityKey: "fukuoka", keys: ["fukuoka", "hakata", "tenjin", "nakasu", "ohori", "kushida", "mojiko", "kokura", "福岡", "博多", "天神", "中洲", "小倉", "門司港"], nameEn: "Fukuoka (Hakata)", nameJa: "福岡（博多）", regionKey: "Kyushu", x: 318, y: 632, isAir: true },
  { id: "dazaifu", prefId: "fukuoka", cityKey: "fukuoka", keys: ["dazaifu", "yanagawa", "itoshima", "太宰府", "柳川", "糸島"], nameEn: "Dazaifu", nameJa: "太宰府", regionKey: "Kyushu", x: 320, y: 644 },
  { id: "beppu", prefId: "oita", cityKey: "beppu", keys: ["beppu", "jigoku", "umi jigoku", "kannawa", "別府", "地獄めぐり", "鉄輪"], nameEn: "Beppu", nameJa: "別府", regionKey: "Kyushu", x: 356, y: 651 },
  { id: "yufuin", prefId: "oita", cityKey: "yufuin", keys: ["yufuin", "yufu", "kinrinko", "yunotsubo", "由布院", "湯布院", "金鱗湖"], nameEn: "Yufuin", nameJa: "由布院", regionKey: "Kyushu", x: 348, y: 657 },
  { id: "kurokawa", prefId: "kumamoto", cityKey: "kurokawa_onsen", keys: ["kurokawa", "kurokawa onsen", "nyuto tegata", "黒川温泉"], nameEn: "Kurokawa Onsen", nameJa: "黒川温泉", regionKey: "Kyushu", x: 340, y: 666 },
  { id: "nagasaki", prefId: "nagasaki", cityKey: "nagasaki", keys: ["nagasaki", "dejima", "glover", "huis ten bosch", "inariyama", "hashima", "長崎", "出島", "グラバー", "ハウステンボス"], nameEn: "Nagasaki", nameJa: "長崎", regionKey: "Kyushu", x: 294, y: 668 },
  { id: "kumamoto", prefId: "kumamoto", cityKey: "kumamoto", keys: ["kumamoto", "aso", "mount aso", "mt aso", "kusasenri", "suizenji", "daikanbo", "熊本", "阿蘇", "草千里", "水前寺"], nameEn: "Kumamoto / Mt. Aso", nameJa: "熊本・阿蘇", regionKey: "Kyushu", x: 326, y: 682 },
  { id: "kagoshima", prefId: "kagoshima", cityKey: "kagoshima", keys: ["kagoshima", "sakurajima", "ibusuki", "kirishima", "senganen", "鹿児島", "桜島", "指宿", "霧島"], nameEn: "Kagoshima", nameJa: "鹿児島", regionKey: "Kyushu", x: 318, y: 734 },
  { id: "yakushima", prefId: "kagoshima", cityKey: "yakushima", keys: ["yakushima", "jomon sugi", "shiratani", "屋久島", "縄文杉"], nameEn: "Yakushima", nameJa: "屋久島", regionKey: "Kyushu", x: 311, y: 760, isAir: true },

  // OKINAWA & YAEYAMA
  { id: "onna_son", prefId: "okinawa", cityKey: "onna_son", keys: ["churaumi", "motobu", "onna", "manzamo", "nago", "kouri", "bise", "美ら海", "本部", "恩納", "恩納村", "万座毛", "名護", "古宇利", "備瀬"], nameEn: "Onna-son / Churaumi", nameJa: "恩納村・美ら海", regionKey: "Okinawa", x: 184, y: 862 },
  { id: "chatan", prefId: "okinawa", cityKey: "onna_son", keys: ["chatan", "american village", "maeda", "blue cave", "北谷", "真栄田", "青の洞窟"], nameEn: "Chatan / Cape Maeda", nameJa: "北谷・真栄田岬", regionKey: "Okinawa", x: 175, y: 878 },
  { id: "naha", prefId: "okinawa", cityKey: "naha", keys: ["naha", "shuri", "kokusai", "kokusai dori", "senagajima", "makishi", "gyokusendo", "sefa utaki", "yachimun", "那覇", "首里", "国際通り", "瀬長島", "牧志", "玉泉洞"], nameEn: "Naha (Okinawa)", nameJa: "那覇（沖縄本島）", regionKey: "Okinawa", x: 168, y: 894, isAir: true },
  { id: "kerama", prefId: "okinawa", cityKey: "naha", keys: ["kerama", "zamami", "tokashiki", "慶良間", "座間味", "渡嘉敷"], nameEn: "Kerama Islands", nameJa: "慶良間諸島", regionKey: "Okinawa", x: 150, y: 901 },
  { id: "miyakojima", prefId: "okinawa", cityKey: "miyakojima", keys: ["miyako", "miyakojima", "yonaha maehama", "irabu", "宮古", "宮古島", "伊良部"], nameEn: "Miyako Island", nameJa: "宮古島", regionKey: "Okinawa", x: 133, y: 924, isAir: true },
  { id: "ishigaki", prefId: "okinawa", cityKey: "ishigaki", keys: ["ishigaki", "kabira", "yaeyama", "tamatorizaki", "石垣", "石垣島", "川平", "川平湾", "八重山"], nameEn: "Ishigaki Island", nameJa: "石垣島", regionKey: "Okinawa", x: 112, y: 938, isAir: true },
  { id: "taketomi", prefId: "okinawa", cityKey: "taketomi", keys: ["taketomi", "iriomote", "kondoi", "hoshizuna", "竹富", "竹富島", "西表", "西表島", "コンドイ"], nameEn: "Taketomi / Iriomote", nameJa: "竹富島・西表島", regionKey: "Okinawa", x: 98, y: 946 }
];

// Auto-generate all 47 Prefecture Fallback Gazetteer Entries (suppressed when a specific city inside the prefecture matches)
const PREFECTURE_FALLBACK_STOPS = (window.JAPAN_PREFECTURES || []).map(p => ({
  id: "pref_" + p.id,
  prefId: p.id,
  cityKey: null,
  isPrefFallback: true,
  isAir: p.id === "okinawa",
  keys: p.keys.slice(),
  nameEn: p.nameEn + " Pref.",
  nameJa: p.nameJa,
  regionKey: p.regionKey,
  x: p.x,
  y: p.y
}));

window.JAPAN_GAZETTEER = CITY_STOPS.concat(PREFECTURE_FALLBACK_STOPS);

window.getPrimaryPrefectureForDay = function(dayObj) {
  if (!dayObj || typeof window.findMatchingGazetteerStops !== "function") return null;
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
