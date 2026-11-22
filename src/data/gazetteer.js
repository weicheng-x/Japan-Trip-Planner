// Unified 1000x1000 SVG Japan Gazetteer & Geographically Recognizable Multi-Island Vector Paths
// Coordinates map cleanly from Hokkaido (top-right) through Honshu/Shikoku/Kyushu to Okinawa & Yaeyama (bottom-left).

window.JAPAN_MAP_PATHS = {
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

window.JAPAN_GAZETTEER = [
  // HOKKAIDO
  { id: "sapporo", keys: ["sapporo", "札幌", "chitose", "新千歳", "hokkaido", "北海道", "susukino", "すすきの", "odori", "大通"], nameEn: "Sapporo", nameJa: "札幌", regionKey: "Hokkaido", x: 755, y: 136, isAir: true },
  { id: "otaru", keys: ["otaru", "小樽", "sakaimachi", "堺町"], nameEn: "Otaru", nameJa: "小樽", regionKey: "Hokkaido", x: 738, y: 132 },
  { id: "niseko", keys: ["niseko", "ニセコ", "hirafu", "比羅夫"], nameEn: "Niseko", nameJa: "ニセコ", regionKey: "Hokkaido", x: 730, y: 148 },
  { id: "asahikawa", keys: ["asahikawa", "旭川", "furano", "富良野", "biei", "美瑛", "tomita", "富田"], nameEn: "Furano / Biei", nameJa: "富良野・美瑛", regionKey: "Hokkaido", x: 782, y: 118 },
  { id: "noboribetsu", keys: ["noboribetsu", "登別", "jigokudani", "地獄谷", "toya", "toyako", "洞爺湖", "shiraoi", "白老"], nameEn: "Noboribetsu / Lake Toya", nameJa: "登別・洞爺湖", regionKey: "Hokkaido", x: 744, y: 158 },
  { id: "kushiro", keys: ["kushiro", "釧路", "akan", "阿寒", "shiretoko", "知床", "abashiri", "網走"], nameEn: "East Hokkaido (Kushiro / Shiretoko)", nameJa: "道東（釧路・知床）", regionKey: "Hokkaido", x: 822, y: 122 },
  { id: "hakodate", keys: ["hakodate", "函館", "goryokaku", "五稜郭"], nameEn: "Hakodate", nameJa: "函館", regionKey: "Hokkaido", x: 718, y: 190 },

  // TOHOKU
  { id: "aomori", keys: ["aomori", "青森", "hakkoda", "八甲田", "tsutanuma", "蔦沼", "jogakura", "城ヶ倉"], nameEn: "Aomori / Hakkoda", nameJa: "青森・八甲田", regionKey: "Iwate-Aomori", x: 714, y: 238 },
  { id: "hirosaki", keys: ["hirosaki", "弘前"], nameEn: "Hirosaki", nameJa: "弘前", regionKey: "Iwate-Aomori", x: 697, y: 248 },
  { id: "misawa", keys: ["misawa", "三沢", "aomoriya", "青森屋", "hachinohe", "八戸", "hasshoku", "八食"], nameEn: "Misawa / Hachinohe", nameJa: "三沢・八戸", regionKey: "Aomori", x: 734, y: 254 },
  { id: "oirase", keys: ["oirase", "奥入瀬", "towada", "十和田", "yasumiya", "休屋"], nameEn: "Oirase / Lake Towada", nameJa: "奥入瀬・十和田湖", regionKey: "Iwate-Aomori", x: 715, y: 266 },
  { id: "morioka", keys: ["morioka", "盛岡", "iwate", "岩手"], nameEn: "Morioka", nameJa: "盛岡", regionKey: "Iwate-Aomori", x: 722, y: 302 },
  { id: "akita", keys: ["akita", "秋田", "kakunodate", "角館", "nyuto onsen", "乳頭温泉", "tazawako", "田沢湖"], nameEn: "Akita / Kakunodate", nameJa: "秋田・角館", regionKey: "Tohoku", x: 688, y: 306 },
  { id: "naruko", keys: ["naruko", "鳴子", "furukawa", "古川"], nameEn: "Naruko Gorge", nameJa: "鳴子峡", regionKey: "Miyagi", x: 704, y: 348 },
  { id: "sendai", keys: ["sendai", "仙台", "miyagi", "宮城", "akiu", "秋保", "rairaikyo", "磊々峡", "matsushima", "松島", "entuuin", "円通院"], nameEn: "Sendai / Matsushima", nameJa: "仙台・松島", regionKey: "Miyagi", x: 715, y: 374 },
  { id: "yamagata", keys: ["yamagata", "山形", "tendo", "天童", "yamadera", "山寺", "mogami", "最上", "ginzan", "銀山", "zao", "蔵王"], nameEn: "Tendo / Yamadera / Yamagata", nameJa: "天童・山寺・山形", regionKey: "Yamagata", x: 685, y: 382 },
  { id: "fukushima", keys: ["fukushima", "福島", "aizu", "会津", "ouchi", "大内宿", "inawashiro", "猪苗代"], nameEn: "Fukushima / Aizu", nameJa: "福島・会津", regionKey: "Tohoku", x: 682, y: 422 },

  // KANTO & GREATER TOKYO
  { id: "nikko", keys: ["nikko", "日光", "chuzenji", "中禅寺", "kegon", "華厳", "kinugawa", "鬼怒川", "tochigi", "栃木", "toshogu", "東照宮"], nameEn: "Nikko / Lake Chuzenji", nameJa: "日光・中禅寺湖", regionKey: "Tochigi-Ibaraki", x: 662, y: 462 },
  { id: "kusatsu", keys: ["kusatsu", "草津", "yubatake", "湯畑", "ikaho", "伊香保", "gunma", "群馬"], nameEn: "Kusatsu Onsen", nameJa: "草津温泉", regionKey: "Gunma", x: 642, y: 472 },
  { id: "takasaki", keys: ["takasaki", "高崎"], nameEn: "Takasaki (Gunma)", nameJa: "高崎（群馬）", regionKey: "Gunma", x: 648, y: 484 },
  { id: "koga", keys: ["koga", "古河", "ibaraki", "茨城", "utsunomiya", "宇都宮", "mito", "水戸"], nameEn: "Koga / Ibaraki", nameJa: "古河・宇都宮", regionKey: "Tochigi-Ibaraki", x: 672, y: 486 },
  { id: "omiya", keys: ["omiya", "大宮", "saitama", "埼玉", "kawagoe", "川越"], nameEn: "Omiya (Saitama)", nameJa: "大宮（埼玉）", regionKey: "Saitama", x: 664, y: 504 },
  { id: "tokyo", keys: ["tokyo", "東京", "suidobashi", "水道橋", "marunouchi", "丸の内", "ginza", "銀座", "imperial", "皇居"], nameEn: "Tokyo Central", nameJa: "東京・銀座", regionKey: "Tokyo", x: 668, y: 518 },
  { id: "shinjuku", keys: ["shinjuku", "新宿", "shibuya", "渋谷", "harajuku", "原宿", "roppongi", "六本木", "ikebukuro", "池袋", "meiji", "明治神宮"], nameEn: "Shinjuku / Shibuya", nameJa: "新宿・渋谷", regionKey: "Tokyo", x: 660, y: 519 },
  { id: "asakusa", keys: ["asakusa", "浅草", "ueno", "上野", "akihabara", "秋葉原", "skytree", "スカイツリー", "senso-ji", "浅草寺"], nameEn: "Asakusa / Ueno", nameJa: "浅草・上野", regionKey: "Tokyo", x: 673, y: 514 },
  { id: "haneda", keys: ["haneda", "羽田", "odaiba", "お台場", "toyosu", "豊洲", "shinagawa", "品川"], nameEn: "Haneda / Tokyo Bay", nameJa: "羽田空港・湾岸", regionKey: "Tokyo", x: 669, y: 528, isAir: true },
  { id: "narita", keys: ["narita", "成田", "chiba", "千葉", "disney", "ディズニー", "maihama", "舞浜"], nameEn: "Narita / Chiba", nameJa: "成田空港・千葉", regionKey: "Tokyo", x: 688, y: 517, isAir: true },
  { id: "yokohama", keys: ["yokohama", "横浜", "kamakura", "鎌倉", "kanagawa", "神奈川", "enoshima", "江ノ島", "minato mirai", "みなとみらい"], nameEn: "Yokohama / Kamakura", nameJa: "横浜・鎌倉", regionKey: "Tokyo", x: 659, y: 536 },
  { id: "hakone", keys: ["hakone", "箱根", "odawara", "小田原", "owakudani", "大涌谷", "ashi", "芦ノ湖"], nameEn: "Hakone / Odawara", nameJa: "箱根・小田原", regionKey: "Chubu", x: 644, y: 542 },
  { id: "atami", keys: ["atami", "熱海", "kawazu", "河津", "izu", "伊豆", "itogawa", "糸川"], nameEn: "Atami / Kawazu (Izu)", nameJa: "熱海・河津（伊豆）", regionKey: "Chubu", x: 642, y: 550 },
  { id: "shizuoka", keys: ["shizuoka", "静岡", "fujikawa", "富士川", "shin-fuji", "新富士", "miho", "三保", "nihondaira", "日本平"], nameEn: "Shizuoka / Fujikawa", nameJa: "静岡・富士川", regionKey: "Chubu", x: 616, y: 554 },

  // CHUBU & HOKURIKU
  { id: "fuji", keys: ["fuji", "富士山", "kawaguchiko", "河口湖", "chureito", "忠霊塔", "fujiyoshida", "富士吉田", "yamanashi", "山梨", "gotemba", "御殿場"], nameEn: "Mt. Fuji / Kawaguchiko", nameJa: "富士山・河口湖", regionKey: "Chubu", x: 634, y: 526 },
  { id: "nagano", keys: ["nagano", "長野", "karuizawa", "軽井沢", "matsumoto", "松本", "kamikochi", "上高地", "hakuba", "白馬", "jigokudani monkey"], nameEn: "Nagano / Matsumoto", nameJa: "長野・松本・軽井沢", regionKey: "Chubu", x: 616, y: 478 },
  { id: "kanazawa", keys: ["kanazawa", "金沢", "ishikawa", "石川", "toyama", "富山", "hokuriku", "北陸", "kenrokuen", "兼六園", "omicho", "近江町"], nameEn: "Kanazawa / Toyama", nameJa: "金沢・富山", regionKey: "Chubu", x: 566, y: 468 },
  { id: "kaga", keys: ["kaga", "加賀", "yamanaka", "山中温泉", "yamashiro", "山代温泉", "awazu", "粟津"], nameEn: "Kaga Onsen", nameJa: "加賀温泉郷", regionKey: "Chubu", x: 556, y: 480 },
  { id: "gokayama", keys: ["gokayama", "五箇山", "ainokura", "相倉"], nameEn: "Gokayama (Ainokura)", nameJa: "五箇山（相倉）", regionKey: "Chubu", x: 575, y: 482 },
  { id: "takayama", keys: ["takayama", "高山", "shirakawa", "白川郷", "gifu", "岐阜", "hida", "飛騨", "shinhotaka", "新穂高", "hirayu", "平湯"], nameEn: "Takayama / Shirakawa-go", nameJa: "高山・白川郷", regionKey: "Chubu", x: 584, y: 498 },
  { id: "nagoya", keys: ["nagoya", "名古屋", "aichi", "愛知", "ghibli", "ジブリ", "ise", "伊勢"], nameEn: "Nagoya", nameJa: "名古屋", regionKey: "Chubu", x: 576, y: 548 },

  // KANSAI
  { id: "kyoto", keys: ["kyoto", "京都", "arashiyama", "嵐山", "fushimi", "伏見", "gion", "祇園", "uji", "宇治", "kiyomizu", "清水", "tofukuji", "東福寺"], nameEn: "Kyoto", nameJa: "京都", regionKey: "Kansai", x: 526, y: 556 },
  { id: "nara", keys: ["nara", "奈良", "todai", "東大寺", "koyasan", "高野山", "wakayama", "和歌山"], nameEn: "Nara", nameJa: "奈良", regionKey: "Kansai", x: 529, y: 574 },
  { id: "osaka", keys: ["osaka", "大阪", "dotonbori", "道頓堀", "umeda", "梅田", "namba", "難波", "usj", "kansai airport", "kix", "関西空港"], nameEn: "Osaka / KIX", nameJa: "大阪・関空", regionKey: "Kansai", x: 512, y: 572, isAir: true },
  { id: "kobe", keys: ["kobe", "神戸", "himeji", "姫路", "arima", "有馬", "hyogo", "兵庫", "sannomiya", "三宮", "meriken", "メリケン"], nameEn: "Kobe / Himeji / Arima", nameJa: "神戸・姫路・有馬", regionKey: "Kansai", x: 492, y: 568 },

  // CHUGOKU & SHIKOKU
  { id: "okayama", keys: ["okayama", "岡山", "kurashiki", "倉敷", "naoshima", "直島", "tottori", "鳥取", "matsue", "松江", "izumo", "出雲"], nameEn: "Okayama / Kurashiki", nameJa: "岡山・倉敷・直島", regionKey: "Chugoku", x: 454, y: 566 },
  { id: "takamatsu", keys: ["takamatsu", "高松", "kagawa", "香川", "shikoku", "四国", "tokushima", "徳島", "kochi", "高知", "matsuyama", "松山", "ehime", "愛媛", "dogo", "道後"], nameEn: "Shikoku (Takamatsu / Matsuyama)", nameJa: "四国（高松・松山）", regionKey: "Shikoku", x: 446, y: 600 },
  { id: "hiroshima", keys: ["hiroshima", "広島", "miyajima", "宮島", "itsukushima", "厳島", "onomichi", "尾道", "yamaguchi", "山口"], nameEn: "Hiroshima / Miyajima", nameJa: "広島・宮島", regionKey: "Chugoku", x: 395, y: 584 },

  // KYUSHU
  { id: "fukuoka", keys: ["fukuoka", "福岡", "hakata", "博多", "tenjin", "天神", "nakasu", "中洲", "kyushu", "九州", "kokura", "小倉"], nameEn: "Fukuoka (Hakata)", nameJa: "福岡（博多）", regionKey: "Kyushu", x: 318, y: 632, isAir: true },
  { id: "dazaifu", keys: ["dazaifu", "太宰府", "yanagawa", "柳川", "itoshima", "糸島"], nameEn: "Dazaifu / Yanagawa", nameJa: "太宰府・柳川", regionKey: "Kyushu", x: 320, y: 644 },
  { id: "beppu", keys: ["beppu", "別府", "yufuin", "由布院", "湯布院", "oita", "大分", "kinrinko", "金鱗湖"], nameEn: "Beppu / Yufuin", nameJa: "別府・由布院", regionKey: "Kyushu", x: 354, y: 654 },
  { id: "kurokawa", keys: ["kurokawa", "黒川温泉", "ogun", "小国"], nameEn: "Kurokawa Onsen", nameJa: "黒川温泉", regionKey: "Kyushu", x: 340, y: 666 },
  { id: "nagasaki", keys: ["nagasaki", "長崎", "saga", "佐賀", "huis ten bosch", "ハウステンボス"], nameEn: "Nagasaki", nameJa: "長崎", regionKey: "Kyushu", x: 294, y: 668 },
  { id: "kumamoto", keys: ["kumamoto", "熊本", "aso", "阿蘇", "kusasenri", "草千里", "miyazaki", "宮崎", "takachiho", "高千穂"], nameEn: "Kumamoto / Mt. Aso", nameJa: "熊本・阿蘇", regionKey: "Kyushu", x: 326, y: 682 },
  { id: "kagoshima", keys: ["kagoshima", "鹿児島", "sakurajima", "桜島", "ibusuki", "指宿", "yakushima", "屋久島"], nameEn: "Kagoshima / Yakushima", nameJa: "鹿児島・屋久島", regionKey: "Kyushu", x: 318, y: 734 },

  // OKINAWA & YAEYAMA ISLANDS
  { id: "okinawa_north", keys: ["churaumi", "美ら海", "motobu", "本部", "onna", "恩納", "manzamo", "万座毛", "nago", "名護", "kouri", "古宇利", "bise", "備瀬"], nameEn: "Onna-son / Churaumi", nameJa: "恩納村・美ら海", regionKey: "Okinawa", x: 184, y: 862 },
  { id: "chatan", keys: ["chatan", "北谷", "american village", "アメリカンビレッジ", "maeda", "真栄田", "blue cave", "青の洞窟"], nameEn: "Chatan / Cape Maeda", nameJa: "北谷・真栄田岬", regionKey: "Okinawa", x: 175, y: 878 },
  { id: "naha", keys: ["okinawa", "沖縄", "naha", "那覇", "shuri", "首里", "kokusai", "国際通り", "senagajima", "瀬長島", "makishi", "牧志", "gyokusendo", "玉泉洞", "sefa-utaki", "斎場御嶽"], nameEn: "Naha / Shuri (Okinawa)", nameJa: "那覇・首里（沖縄本島）", regionKey: "Okinawa", x: 168, y: 894, isAir: true },
  { id: "kerama", keys: ["kerama", "慶良間", "zamami", "座間味", "tokashiki", "渡嘉敷"], nameEn: "Kerama Islands", nameJa: "慶良間諸島", regionKey: "Okinawa", x: 150, y: 901 },
  { id: "miyakojima", keys: ["miyako", "miyakojima", "宮古島", "宮古"], nameEn: "Miyako Island", nameJa: "宮古島", regionKey: "Okinawa", x: 133, y: 924, isAir: true },
  { id: "ishigaki", keys: ["ishigaki", "石垣", "kabira", "川平", "yaeyama", "八重山"], nameEn: "Ishigaki Island", nameJa: "石垣島", regionKey: "Okinawa", x: 112, y: 938, isAir: true },
  { id: "taketomi", keys: ["taketomi", "竹富", "iriomote", "西表", "kondoi", "コンドイ"], nameEn: "Taketomi / Iriomote", nameJa: "竹富島・西表島", regionKey: "Okinawa", x: 98, y: 946 }
];
