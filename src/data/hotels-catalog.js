// Curated 3-4 Star Hotels Catalog for All 80 Common Sightseeing Cities + All 47 Prefectures
// Priority resolution: Specific City Match -> Prefecture Capital Default -> Tokyo Fallback

(function() {
  function expandHotelMap(specMap) {
    const out = {};
    Object.keys(specMap).forEach(k => {
      const [nameEn, nameJa, stars, perNightJpy, url, accessEn, accessJa] = specMap[k];
      out[k] = { nameEn, nameJa, stars, perNightJpy, url, accessEn, accessJa };
    });
    return out;
  }

  // All 80 Common City Hubs (Matching cityKey in gazetteer.js & cities-catalog.js)
  const CITY_SPECS = {
    sapporo: ["JR Tower Hotel Nikko-free -> Cross Hotel Sapporo", "クロスホテル札幌", 4, 15000, "https://www.crosshotel.com/sapporo/", "5-min walk JR Sapporo South Exit", "JR札幌駅南口徒歩5分"],
    chitose: ["Portom International Hokkaido / Crowne Plaza ANA Chitose", "ANAクラウンプラザホテル千歳", 4, 13500, "https://www.anacrowneplaza-chitose.jp/", "7-min walk JR Chitose Station", "JR千歳駅徒歩7分（新千歳空港2駅）"],
    otaru: ["Dormy Inn Premium Otaru Natural Hot Spring", "天然温泉 灯の湯 ドーミーインPREMIUM小樽", 3.5, 13000, "https://dormy-hotels.com/dormyinn/hotels/otaru/", "1-min walk JR Otaru Station", "JR小樽駅前徒歩1分"],
    asahikawa: ["JR Inn Asahikawa", "JRイン旭川", 3.5, 11000, "https://www.jr-inn.jp/asahikawa/", "Direct connection above JR Asahikawa Stn", "JR旭川駅直結"],
    furano: ["Shin Furano Prince Hotel / Natulux Furano", "フラノ寶亭留／ナトゥールヴァルト富良野", 4, 16500, "https://www.princehotels.com/shinfurano/", "10-min bus from JR Furano Station", "JR富良野駅から車で約10分"],
    niseko: ["Hilton Niseko Village / Hinode Hills", "パーク ハイアット／ヒルトンニセコビレッジ", 4, 24000, "https://www.hilton.com/en/hotels/ctsnvhi-hilton-niseko-village/", "10-min Niseko Shuttle from JR Kutchan", "JR倶知安・ニセコ駅からシャトル約10分"],
    noboribetsu: ["Dai-ichi Takimotokan Onsen Resort", "第一滝本館（登別温泉）", 4, 22000, "https://takimotokan.co.jp/en/", "15-min Donan Bus from JR Noboribetsu Stn", "JR登別駅から道南バス15分（地獄谷すぐ）"],
    hakodate: ["La Vista Hakodate Bay (Kyoritsu Resort)", "ラビスタ函館ベイ（共立リゾート）", 4, 16000, "https://dormy-hotels.com/resort/hotels/la_hakodate/", "5-min Bay Area walk / 12-min JR Hakodate", "市電魚市場通徒歩5分・赤レンガ倉庫すぐ"],
    rebun_island: ["Mitsui Kanko Hotel Rebun / Island Ryokan Kabuka", "三井観光ホテル（礼文島・香深港）", 3.5, 16500, "https://www.rebun-island.jp/", "2-min walk Kafuka Ferry Terminal", "礼文島香深フェリーターミナル徒歩2分"],

    mutsu_bay: ["Plaza Hotel Mutsu / Mutsu Grand Hotel", "プラザホテルむつ（陸奥湾）", 3.5, 10500, "https://www.ph-mutsu.jp/", "8-min walk JR Shimokita Stn", "JR大湊線「下北駅」徒歩圏・車5分"],
    shin_aomori: ["Daiwa Roynet Hotel Aomori", "ダイワロイネットホテル青森", 4, 11500, "https://www.daiwaroynet.jp/aomori/", "5-min walk JR Aomori (1 stop from Shin-Aomori)", "JR青森駅徒歩5分（新青森駅から1駅）"],
    hirosaki: ["Dormy Inn Hirosaki (Natural Hot Spring)", "天然温泉 岩木桜の湯 ドーミーイン弘前", 3.5, 11000, "https://dormy-hotels.com/dormyinn/hotels/hirosaki/", "100-yen loop bus to Honcho / 6-min JR Hirosaki", "弘前公園すぐ・土手町循環バス停前"],
    hachinohe: ["Hotel Mets Hachinohe (JR East)", "JR東日本ホテルメッツ 八戸", 3.5, 10000, "https://www.hotelmets.jp/hachinohe/", "Directly connected to JR Hachinohe Shinkansen Stn", "東北新幹線JR八戸駅直結"],
    morioka: ["Daiwa Roynet Hotel Morioka Ekimae", "ダイワロイネットホテル盛岡駅前", 4, 11500, "https://www.daiwaroynet.jp/morioka-ekimae/", "4-min walk JR Morioka Station", "JR盛岡駅東口徒歩4分"],
    nyuto_onsen: ["Tsurunoyu Onsen / Kyukamura Nyuto-Onsenkyo", "休暇村 乳頭温泉郷／鶴の湯温泉", 3.5, 22000, "https://www.qkamura.or.jp/nyuto/", "45-min Ugo Kotsu Bus from JR Tazawako Stn", "JR田沢湖駅から羽後交通バス45分"],
    matsushima: ["Hotel Matsushima Taikanso / Century Hotel", "ホテル松島大観荘／松島センチュリーホテル", 4, 19500, "https://www.taikanso.co.jp/", "5-min shuttle JR Matsushima-Kaigan Stn", "JR松島海岸駅からシャトル5分"],
    sendai: ["Hotel Metropolitan Sendai East", "ホテルメトロポリタン仙台イースト", 4, 14500, "https://sendai.metropolitan.jp/east/", "Directly connected to JR Sendai Station", "JR仙台駅直結"],
    tsuruoka: ["Suiden Terrasse (Shigeru Ban Architecture Hotel)", "SHONAI HOTEL SUIDEN TERRASSE（スイデンテラス）", 4, 17500, "https://suiden-terrasse.yamagata-design.com/", "7-min taxi / bus from JR Tsuruoka Stn", "JR鶴岡駅から車で約7分"],
    ginzan_onsen: ["Kosekiya Bekkan / Ginzanso (Ginzan Onsen)", "古勢起屋別館／銀山荘（銀山温泉）", 4, 28000, "https://www.ginzanonsen.jp/", "35-min Hanagasa Bus from JR Oishida Stn", "JR大石田駅から路線バス35分"],
    zao: ["Takamiya Hotel Jurin / Zao Shiki-no-Hotel", "蔵王四季のホテル／高見屋ホテル樹林", 3.5, 19000, "https://www.zao-shiki.jp/", "40-min Yamako Bus from JR Yamagata Stn", "JR山形駅から山交バス約40分（樹氷ロープウェイ圏）"],
    kaminoyama_onsen: ["Koyo Ryokan / Tsukioka Hotel (Kaminoyama)", "日本の宿 古窯／仙渓園 月岡ホテル（かみのやま温泉）", 4, 21000, "https://www.tsukioka.co.jp/", "10-min walk JR Kaminoyama-Onsen Stn", "JRかみのやま温泉駅徒歩10分"],
    aizuwakamatsu: ["Onyado Toho (Higashiyama Onsen) / Washington Aizu", "御宿 東鳳（会津若松・東山温泉）", 4, 16500, "https://www.onyado-toho.co.jp/", "15-min bus from JR Aizuwakamatsu Stn", "JR会津若松駅からバス15分"],

    kinugawa_onsen: ["Kinugawa Onsen Asaya Hotel", "鬼怒川温泉 あさやホテル", 4, 24000, "https://www.asaya-hotel.co.jp/", "8-min Dial Bus from Tobu Kinugawa-Onsen Stn", "東武鬼怒川温泉駅ダイヤルバス約8分"],
    nikko: ["Nikko Senhime Monogatari / Chuzenji Kanaya Hotel", "中禅寺金谷ホテル／日光千姫物語", 4, 21000, "https://www.kanayahotel.co.jp/ckh/", "Walkable to Toshogu or Lake Chuzenji Bus Stop", "東武・JR日光駅から東武バス路線沿い"],
    kusatsu_onsen: ["Hotel Sakurai / Naraya (Kusatsu Yubatake)", "草津温泉 ホテル櫻井／奈良屋", 4, 22000, "https://www.hotel-sakurai.co.jp/", "8-min walk Kusatsu Bus Terminal / Yubatake", "草津温泉バスターミナル送迎・湯畑徒歩圏"],
    takasaki: ["Hotel Metropolitan Takasaki", "ホテルメトロポリタン高崎", 3.5, 11500, "https://takasaki.metropolitan.jp/", "Direct inside JR Takasaki Station West Building", "JR高崎駅西口直結"],
    tokyo: ["Mitsui Garden Hotel Nihonbashi Premier / Shinjuku Prince", "三井ガーデンホテル日本橋プレミア／ホテルメッツ東京", 4, 21000, "https://www.gardenhotels.co.jp/nihonbashi-premier/", "1-min walk Ginza/Hanzomon Mitsukoshimae or JR Tokyo Stn", "地下鉄三越前駅直結・JR東京駅徒歩圏"],
    yokohama: ["Mitsui Garden Hotel Yokohama Minatomirai Premier", "三井ガーデンホテル横浜みなとみらいプレミア", 4, 18500, "https://www.gardenhotels.co.jp/yokohama-minatomirai-premier/", "5-min walk Minatomirai Stn / Sakuragicho", "みなとみらい駅徒歩5分・JR桜木町徒歩10分"],
    kamakura: ["Hotel Metropolitan Kamakura", "ホテルメトロポリタン鎌倉", 4, 18000, "https://kamakura.metropolitan.jp/", "2-min walk JR Kamakura East Exit", "JR鎌倉駅東口徒歩2分（若宮大路沿い）"],
    hakone: ["Hakone Kowakien Ten-yu / Indigo Hakone Gora", "箱根小涌園 天悠／箱根湯本富士屋ホテル", 4, 28000, "https://www.ten-yu.com/", "Tozan Bus Kowakien / Gora Cable access", "箱根登山バス「小涌園」すぐ・強羅駅シャトル"],

    sado_island: ["Hotel Azuma / Sado Green Hotel Kiraku", "ホテル吾妻／朱鷺伝説と国際両津の宿 きらく（佐渡島）", 3.5, 16500, "https://www.hotel-azuma.jp/", "Bus from Ryotsu Jetfoil Port / Aikawa Coast", "両津港から路線バス・佐渡金山近く"],
    kawaguchiko: ["La Vista Fujikawaguchiko / Konansou", "ラビスタ富士河口湖／湖南荘", 4, 24000, "https://dormy-hotels.com/resort/hotels/la_fujikawaguchiko/", "Fujikyu Red Bus / Shuttle from Kawaguchiko Stn", "河口湖駅シャトル・周遊バス沿線"],
    hakuba: ["Hakuba Tokyu Hotel / Courtyard Marriott Hakuba", "白馬東急ホテル／コートヤード・バイ・マリオット白馬", 4, 21000, "https://www.tokyuhotels.co.jp/hakuba-h/", "8-min shuttle JR Hakuba / Happo Terminal", "JR白馬駅・八方バスターミナル送迎"],
    azumino: ["Ambient Azumino Hotel (Hotaka Onsenkyo)", "ホテルアンビエント安曇野（穂高温泉郷）", 3.5, 16000, "https://azumino.izumigo.co.jp/", "15-min shuttle from JR Oito Line Hotaka Stn", "JR大糸線「穂高駅」より定時送迎バス15分"],
    matsumoto: ["Richmond Hotel Matsumoto / Dormy Inn Matsumoto", "リッチモンドホテル松本／天然温泉 梓の湯 ドーミーイン松本", 3.5, 11500, "https://richmondhotel.jp/matsumoto/", "4-min walk JR Matsumoto East Exit", "JR松本駅お城口徒歩4〜5分"],
    karuizawa: ["Karuizawa Prince Hotel West", "軽井沢プリンスホテル ウエスト", 4, 24000, "https://www.princehotels.com/karuizawa-west/", "10-min walk or Pickup Bus JR Karuizawa South Exit", "JR軽井沢駅南口ピックアップバスすぐ"],
    atami: ["Atami Korakuen Hotel / Kamenoi Hotel Atami", "熱海後楽園ホテル／亀の井ホテル 熱海", 4, 19500, "https://www.atamikorakuen.co.jp/", "10-min shuttle from JR Atami Station", "JR熱海駅から無料送迎バス10分"],
    izu: ["Atagawa Ocean Resort / Shimoda Tokyu Hotel", "下田東急ホテル／吉祥CAREN（伊豆半島）", 4, 20000, "https://www.tokyuhotels.co.jp/shimoda-h/", "Shuttle from Izukyu Shimoda / Izu-Kogen Stn", "伊豆急下田駅・伊豆稲取駅から送迎有"],
    shizuoka: ["Hotel Associa Shizuoka", "ホテルアソシア静岡", 4, 12500, "https://www.associa.com/szh/", "1-min walk JR Shizuoka North Exit", "JR静岡駅北口徒歩1分"],
    hamamatsu: ["Okura Act City Hotel Hamamatsu", "オークラアクトシティホテル浜松", 4, 13500, "https://www.act-okura.co.jp/", "3-min covered walkway JR Hamamatsu Stn", "JR浜松駅東口直結アクトタワー内"],
    nagoya: ["Mitsui Garden Hotel Nagoya Premier", "三井ガーデンホテル名古屋プレミア", 4, 15500, "https://www.gardenhotels.co.jp/nagoya-premier/", "5-min underground walk JR Nagoya Station", "JR名古屋駅桜通口地下街直結徒歩5分"],
    kanazawa: ["Mitsui Garden Hotel Kanazawa / Daiwa Roynet MIYABI", "三井ガーデンホテル金沢／ダイワロイネットホテル金沢MIYABI", 4, 14500, "https://www.gardenhotels.co.jp/kanazawa/", "Kanazawa Loop Bus Minamicho / Near Kanazawa Stn", "JR金沢駅東口・近江町市場徒歩圏"],
    kaga_onsen: ["Hatori Ryokan (Yamashiro Onsen) / Kissho Yamanaka", "葉渡莉（山代温泉）／吉祥やまなか", 4, 22000, "https://hatori.jp/", "10-min CANBUS or free shuttle JR Kagaonsen Stn", "JR北陸新幹線「加賀温泉駅」送迎10分"],
    shirakawago: ["Onyado Yuinosho (Shirakawa-go) / Toyota Nature Villa", "天然温泉 白川の湯 御宿 結の庄（白川郷）", 4, 23000, "https://dormy-hotels.com/resort/hotels/yuinosho/", "5-min shuttle from Shirakawa-go Bus Terminal", "白川郷バスターミナルから車5分"],
    takayama: ["Mercure Hida Takayama / Takayama Ouan", "飛騨花里の湯 高山桜庵（共立リゾート）／メルキュール飛騨高山", 4, 16000, "https://dormy-hotels.com/resort/hotels/takayama/", "5-min walk JR Takayama East Exit", "JR高山駅東口徒歩5分"],
    ise: ["Sanco Inn Iseshi Ekimae / Inishie no Yado Ikyu", "いにしえの宿 伊久（伊勢内宮）／三交イン伊勢市駅前", 4, 17000, "https://dormy-hotels.com/resort/hotels/ikyu/", "Iseshi Stn or steps from Ise Grand Inner Shrine", "伊勢市駅前または内宮鳥居前徒歩圏"],

    kyoto: ["Mitsui Garden Hotel Kyoto Shijo / Cross Hotel Kyoto", "三井ガーデンホテル京都四条／クロスホテル京都", 4, 16500, "https://www.gardenhotels.co.jp/kyoto-shijo/", "6-min walk Subway Shijo / Hankyu Karasuma Stn", "地下鉄「四条駅」阪急「烏丸駅」徒歩6分"],
    nara: ["JW Marriott Nara / Hotel Piazza Nara", "ピアッツァホテル奈良／ノボテル奈良", 4, 14500, "https://www.piazza-hotel.co.jp/", "1-min walk JR Nara / Short walk Kintetsu Nara", "JR奈良駅西口直結徒歩1分"],
    koyasan: ["Eko-in Temple Lodging / Fukuchi-in Shukubo", "高野山 宿坊 恵光院／福智院", 4, 22000, "https://www.ekoin.jp/en/", "Koyasan Rinnai Bus to Karukayado-mae", "南海高野山駅〜バス「刈萱堂前」徒歩すぐ"],
    osaka: ["Cross Hotel Osaka / Hankyu Respire Osaka", "クロスホテル大阪（心斎橋・道頓堀）／ホテル阪急レスパイア大阪", 4, 16500, "https://www.crosshotel.com/osaka/", "3-min walk Subway Namba Exit 14 / JR Osaka", "地下鉄なんば駅徒歩3分・道頓堀すぐ"],
    kobe: ["Oriental Hotel Kobe / Remm Plus Kobe Sannomiya", "レムプラス神戸三宮／オリエンタルホテル神戸", 4, 15000, "https://www.hankyu-hotel.com/hotel/remm/kobe-sannomiya", "Directly atop Hankyu Kobe-Sannomiya Stn", "阪急神戸三宮駅直結・JR三ノ宮徒歩1分"],
    arima_onsen: ["Arima Gyoen / Arima Kirari / Tocen Goshoboh", "有馬御苑／陶泉 御所坊（有馬温泉）", 4, 24000, "https://www.arimagyoe.com/", "2-min walk Kobe Dentetsu Arimaonsen Stn", "神戸電鉄「有馬温泉駅」徒歩2分"],
    himeji: ["Hotel Monterey Himeji / Daiwa Roynet Himeji", "ホテルモントレ姫路／ダイワロイネットホテル姫路", 4, 12500, "https://www.hotelmonterey.co.jp/himeji/", "Direct 1-min walk from JR Himeji Stn", "JR姫路駅直結徒歩1分（姫路城徒歩圏）"],
    kinosaki_onsen: ["Nishimuraya Hotel Shogetsutei / Morizuya (Kinosaki)", "西村屋ホテル招月庭／森津屋（城崎温泉）", 4, 25000, "https://www.nishimuraya.ne.jp/shogetsutei/", "Free Ryokan Union Shuttle from JR Kinosaki-Onsen Stn", "JR城崎温泉駅から旅館組合無料送迎"],
    awaji_island: ["Grand Nikko omitted -> Fairfield by Marriott Hyogo Awaji / Awaji Yumebutai", "フェアフィールド･バイ･マリオット･兵庫淡路島福良／グランドニッコー淡路除くウェスティン系", 4, 16000, "https://www.marriott.com/en-us/hotels/ukbfa-fairfield-hyogo-awaji-higashiura/", "Higashiura IC / Fukura Bus Terminal", "淡路島東浦・福良バスターミナル徒歩圏"],

    tottori_city: ["Hotel Monarque Tottori / Green Hotel Morris Tottori", "ホテルモナーク鳥取／グリーンホテルモーリス鳥取", 3.5, 10500, "https://www.hotel-monarque.co.jp/", "5-min walk JR Tottori North Exit", "JR鳥取駅北口徒歩5分"],
    matsue: ["Dormy Inn Express Matsue / Hotel Ichibata", "天然温泉 だんだんの湯 御宿 野乃 松江（共立リゾート）", 3.5, 13000, "https://dormy-hotels.com/dormyinn/hotels/nono_matsue/", "12-min walk Matsue Castle / Lake Shinji Waterfront", "一畑電車松江しんじ湖温泉駅・宍道湖畔徒歩圏"],
    izumo: ["Dormy Inn Izumo / Inishie no Yado Keiun (Izumo Taisha)", "いにしえの宿 佳雲／天然温泉 八雲の湯 ドーミーイン出雲", 4, 14500, "https://dormy-hotels.com/dormyinn/hotels/izumo/", "1-min walk JR Izumoshi Stn (or Taisha gate)", "JR出雲市駅南口徒歩1分（出雲大社直行バス停すぐ）"],
    okayama_city: ["Hotel Granvia Okayama / Mitsui Garden Okayama", "ホテルグランヴィア岡山／三井ガーデンホテル岡山", 4, 13000, "https://www.granvia-oka.co.jp/", "Directly connected to JR Okayama Shinkansen Stn", "JR岡山駅直結"],
    kurashiki: ["Kurashiki Royal Art Hotel / Dormy Inn Kurashiki", "倉敷ロイヤルアートホテル／天然温泉 阿智の湯 ドーミーイン倉敷", 3.5, 12500, "https://www.royal-art-hotel.co.jp/", "2-min walk Bikan Canal / 7-min JR Kurashiki Stn", "倉敷美観地区徒歩2分・JR倉敷駅徒歩7分"],
    onomichi: ["Onomichi U2 HOTEL CYCLE / Green Hill Hotel", "ONOMICHI U2 HOTEL CYCLE／グリーンヒルホテル尾道", 3.5, 14500, "https://onomichi-u2.com/", "5-min harbor walk JR Onomichi South Exit", "JR尾道駅南口海沿い徒歩5分"],
    hiroshima: ["Hotel Granvia Hiroshima / Mitsui Garden Hiroshima", "ホテルグランヴィア広島／三井ガーデンホテル広島", 4, 13500, "https://www.hgh.co.jp/", "Directly connected to JR Hiroshima Shinkansen Exit", "JR広島駅新幹線口直結"],
    miyajima: ["Miyajima Kinsuikan / Hotel Miyajima Villa", "みやじまの宿 岩惣／ホテル宮島別荘（錦水館）", 4, 23000, "https://www.kinsuikan.jp/", "1-5 min walk from Miyajima Ferry Pier", "宮島桟橋徒歩1〜5分"],
    shimonoseki: ["Dormy Inn Premium Shimonoseki / Shimonoseki Grand Hotel", "天然温泉 関門の湯 ドーミーインPREMIUM下関／下関グランドホテル", 3.5, 11500, "https://dormy-hotels.com/dormyinn/hotels/shimonoseki/", "8-min walk JR Shimonoseki / Near Karato Market", "JR下関駅徒歩8分・唐戸市場アクセス良好"],
    naoshima: ["Benesse House Park / Wright Style Hotel Naoshima", "ベネッセハウス パーク／ライトスタイル直島", 4, 24000, "https://benesse-artsite.jp/en/stay/", "Miyanoura Port Shuttle / Art Museum Loop", "直島宮浦港から宿泊者専用シャトル有"],
    takamatsu: ["JR Hotel Clement Takamatsu / Dormy Inn Takamatsu Chuo", "JRホテルクレメント高松／ドーミーイン高松中央公園前", 4, 12500, "https://www.jrclement.co.jp/takamatsu/", "1-min walk JR Takamatsu Stn & Setouchi Ferry Pier", "JR高松駅＆高松港フェリー乗り場徒歩1〜2分"],
    matsuyama: ["ANA Crowne Plaza Matsuyama / Dormy Inn Matsuyama", "ANAクラウンプラザホテル松山／天然温泉 石手の湯 ドーミーイン松山", 4, 13000, "https://www.anacpmatsuyama.com/", "Direct step from Okaido Tram Stop / Matsuyama Castle Ropeway", "伊予鉄「大街道」電停目の前・松山城ロープウェイすぐ"],

    fukuoka: ["Mitsui Garden Hotel Fukuoka Gion / Solaria Nishitetsu", "三井ガーデンホテル福岡祇園／ソラリア西鉄ホテル福岡", 4, 14500, "https://www.gardenhotels.co.jp/fukuoka-gion/", "5-min walk JR Hakata Stn Hakata Exit / Canal City", "JR博多駅徒歩7分・地下鉄櫛田神社前すぐ"],
    beppu: ["AMANERESORT SEIKAI / Kamenoi Hotel Beppu", "潮騒の宿 晴海／AMANE RESORT SEIKAI／亀の井ホテル別府", 4, 17500, "https://www.seikai.co.jp/", "4-min walk JR Beppu Stn or Shoningahama Coast", "JR別府駅徒歩4分または上人ヶ浜海岸沿い"],
    yufuin: ["Yufuin Kotobuki Hananosho / Yufuin Sansuikan", "ゆふいん山水館／ゆふいんホテル秀峰館", 4, 20000, "https://www.sansuikan.co.jp/", "8-min walk JR Yufuin Stn overlooking Mt. Yufu", "JR由布院駅徒歩8分・由布岳一望"],
    kurokawa_onsen: ["Ryokan Wakaba / Kurokawa-so / Sanga", "黒川温泉 黒川荘／お宿 のし湯／旅館わかば", 4, 25000, "https://www.kurokawa-so.com/", "Pickup shuttle from Kurokawa Bus Stop", "黒川温泉バス停より各旅館無料送迎"],
    nagasaki: ["Hilton Nagasaki / Dormy Inn Nagasaki Chinatown", "ヒルトン長崎／天然温泉 鶴港の湯 ドーミーインPREMIUM長崎駅前", 4, 14500, "https://nagasaki.hiltonjapan.co.jp/", "Directly connected to JR Nagasaki Nishi-Kyushu Shinkansen Stn", "JR長崎駅西口直結・路面電車すぐ"],
    kumamoto: ["THE BLOSSOM KUMAMOTO / Mitsui Garden Kumamoto", "THE BLOSSOM KUMAMOTO（JR九州ホテルズ）／三井ガーデン熊本", 4, 13500, "https://www.jrk-hotels.co.jp/Kumamoto_Blossom/", "0-min walk Amu Plaza inside JR Kumamoto Stn", "JR熊本駅直結（熊本城へ市電約12分）"],
    kagoshima: ["Shiroyama Hotel Kagoshima / Solaria Nishitetsu Kagoshima", "城山ホテル鹿児島／ソラリア西鉄ホテル鹿児島", 4, 15000, "https://www.shiroyama-g.co.jp/", "Free Shuttle or Direct opposite JR Kagoshima-Chuo Stn", "JR鹿児島中央駅前すぐ（桜島展望シャトル有）"],
    yakushima: ["Sankara omitted -> TASHIRO ANNEX / JR Hotel Yakushima", "JRホテル屋久島／シーサイドホテル屋久島", 4, 19500, "https://www.jrk-hotels.co.jp/Yakushima/", "Kagoshima Kotsu Bus from Anbo / Airport / Miyanoura Port", "屋久島安房港・空港・宮之浦港から路線バス利用"],

    onna_son: ["ANA InterContinental Manza / Hotel Monterey Okinawa Spa", "ホテルモントレ沖縄 スパ＆リゾート／ANA万座ビーチリゾート", 4, 24000, "https://www.hotelmonterey.co.jp/okinawa/", "Okinawa Airport Shuttle & Yanbaru Express Stop", "恩納村タイガービーチ前・エアポートシャトル直停"],
    naha: ["Hotel Collective / Hyatt Regency Naha Okinawa", "ホテル コレクティブ（国際通り中心）／ダイワロイネット国際通り", 4, 15500, "https://hotelcollective.jp/", "5-min walk Yui Rail Kencho-mae / Makishi Stn", "ゆいレール県庁前・牧志駅徒歩圏 国際通り沿い"],
    miyakojima: ["Hilton Okinawa Miyako Island / Shigira Bayside", "ヒルトン沖縄宮古島リゾート／アラマンダ・シギラ", 4, 23000, "https://miyakojima.hiltonjapan.co.jp/", "15-min Airport Shuttle overlooking Irabu Bridge", "宮古空港車15分・伊良部大橋ビュー"],
    ishigaki: ["ANA InterContinental Ishigaki / Art Hotel Ishigakijima", "アートホテル石垣島／フサキビーチリゾート・ANA石垣", 4, 18500, "https://www.art-ishigakijima.com/", "Shuttle / Bus near Euglena Ishigaki Ferry Terminal", "石垣空港・離島ターミナルへアクセス良好"],
    taketomi: ["Hoshino Resorts Risonare Kohamajima / Taketomi Hotel Peace Island", "星のや竹富島／ホテルピースアイランド竹富島／西表島ホテル by 星野", 4, 22000, "https://www.peace-k.jp/", "10-min High-Speed Boat from Ishigaki Port + Free Port Pickup", "竹富東港・西表島上原港から無料送迎バス"]
  };

  // Correct cross-hotel label without unrelated keywords in Sapporo/Awaji/Yakushima
  CITY_SPECS.sapporo[0] = "Cross Hotel Sapporo / Mitsui Garden Sapporo West";
  CITY_SPECS.awaji_island[0] = "Fairfield by Marriott Hyogo Awaji / Grand Chariot";
  CITY_SPECS.yakushima[0] = "JR Hotel Yakushima / Seaside Hotel Yakushima";

  // All 47 Prefectural 3-4 Star Baseline Hotels (for prefecture-level fallback or uncommon cities)
  const PREFECTURE_SPECS = {
    hokkaido: ["Cross Hotel Sapporo (Sapporo Center)", "クロスホテル札幌（道庁・大通徒歩圏）", 4, 14500, "https://www.crosshotel.com/sapporo/", "5-min walk JR Sapporo South Exit", "JR札幌駅南口徒歩5分"],
    aomori: ["Daiwa Roynet Hotel Aomori", "ダイワロイネットホテル青森", 4, 11500, "https://www.daiwaroynet.jp/aomori/", "5-min walk JR Aomori Station", "JR青森駅徒歩5分"],
    iwate: ["Daiwa Roynet Hotel Morioka Ekimae", "ダイワロイネットホテル盛岡駅前", 4, 11500, "https://www.daiwaroynet.jp/morioka-ekimae/", "4-min walk JR Morioka Station", "JR盛岡駅東口徒歩4分"],
    miyagi: ["Hotel Metropolitan Sendai East", "ホテルメトロポリタン仙台イースト", 4, 14000, "https://sendai.metropolitan.jp/east/", "Direct connection above JR Sendai Station", "JR仙台駅直結"],
    akita: ["Richmond Hotel Akita Ekimae", "リッチモンドホテル秋田駅前", 3.5, 11000, "https://richmondhotel.jp/akita/", "7-min walk JR Akita West Exit", "JR秋田駅西口徒歩7分"],
    yamagata: ["Hotel Metropolitan Yamagata", "ホテルメトロポリタン山形", 3.5, 11500, "https://yamagata.metropolitan.jp/", "Direct inside JR Yamagata Station", "JR山形駅直結"],
    fukushima: ["JR East Hotel Mets Fukushima / Koriyama", "JR東日本ホテルメッツ 福島／郡山", 3.5, 10500, "https://www.hotelmets.jp/fukushima/", "1-min walk JR Fukushima East Exit", "JR福島駅東口徒歩1分"],
    ibaraki: ["Hotel Terrace The Garden Mito", "ホテル・ザ・ウエストヒルズ・水戸／テラスザガーデン水戸", 3.5, 11000, "https://www.hotel-terrace.com/", "1-min walk JR Mito Station South Exit", "JR水戸駅南口直結"],
    tochigi: ["JR East Hotel Mets Utsunomiya", "JR東日本ホテルメッツ 宇都宮", 3.5, 11000, "https://www.hotelmets.jp/utsunomiya/", "Directly connected to JR Utsunomiya Shinkansen Stn", "JR宇都宮駅直結"],
    gunma: ["Hotel Metropolitan Takasaki", "ホテルメトロポリタン高崎", 3.5, 11500, "https://takasaki.metropolitan.jp/", "Directly connected to JR Takasaki Station", "JR高崎駅直結"],
    saitama: ["Palace Hotel Omiya / Candeo Hotels Omiya", "カンデオホテルズ大宮（大宮駅徒歩6分）", 4, 12500, "https://www.candeohotels.com/ja/saitama-omiya/", "6-min walk JR Omiya Shinkansen Stn", "JR大宮駅西口徒歩6分"],
    chiba: ["Mitsui Garden Hotel Chiba / Narita View", "三井ガーデンホテル千葉／ANAクラウンプラザ成田", 3.5, 11500, "https://www.gardenhotels.co.jp/chiba/", "7-min walk JR Chiba / Narita Shuttle", "JR千葉駅徒歩7分・成田空港シャトル"],
    tokyo: ["Mitsui Garden Hotel Nihonbashi Premier", "三井ガーデンホテル日本橋プレミア", 4, 20000, "https://www.gardenhotels.co.jp/nihonbashi-premier/", "5-min walk JR Tokyo / Mitsukoshimae Stn", "JR東京駅徒歩圏・三越前直結"],
    kanagawa: ["Mitsui Garden Hotel Yokohama Minatomirai", "三井ガーデンホテル横浜みなとみらいプレミア", 4, 17500, "https://www.gardenhotels.co.jp/yokohama-minatomirai-premier/", "5-min walk Minatomirai Stn", "みなとみらい駅徒歩5分"],
    niigata: ["Hotel Okura Niigata / JR East Hotel Mets Niigata", "JR東日本ホテルメッツ 新潟（新潟駅直結）", 3.5, 11500, "https://www.hotelmets.jp/niigata/", "Directly connected to JR Niigata West Exit", "JR新潟駅直結"],
    toyama: ["Hotel Vischio Toyama (JR West)", "ホテルヴィスキオ富山（JR富山駅直結）", 4, 13000, "https://www.hotelvischio-toyama.com/", "Direct inside JR Toyama Station Maroot", "JR富山駅マルート直結徒歩1分"],
    ishikawa: ["Mitsui Garden Hotel Kanazawa", "三井ガーデンホテル金沢", 4, 14500, "https://www.gardenhotels.co.jp/kanazawa/", "10-min bus / 15-min walk JR Kanazawa Stn", "JR金沢駅東口徒歩・バス圏"],
    fukui: ["Cortyard Marriott Fukui / Hotel Fujita Fukui", "コートヤード・バイ・マリオット福井（福井駅直結）", 4, 14500, "https://www.marriott.com/en-us/hotels/ukbfk-courtyard-fukui/", "1-min walk JR Fukui Shinkansen Stn", "JR北陸新幹線「福井駅」徒歩1分"],
    yamanashi: ["Dormy Inn Kofu Marunouchi Natural Hot Spring", "天然温泉 甲斐路の湯 ドーミーイン甲府", 3.5, 11500, "https://dormy-hotels.com/dormyinn/hotels/kofu/", "12-min walk JR Kofu South Exit", "JR甲府駅南口徒歩12分"],
    nagano: ["Hotel Metropolitan Nagano", "ホテルメトロポリタン長野", 4, 13000, "https://nagano.metropolitan.jp/", "1-min direct bridge from JR Nagano Stn", "JR長野駅ビル直結徒歩1分"],
    gifu: ["Miyako Hotel Gifu Nagaragawa / Daiwa Roynet Gifu", "都ホテル 岐阜長良川／ダイワロイネットホテル岐阜", 4, 12000, "https://www.miyakohotels.ne.jp/gifu/", "2-min walk Meitetsu Gifu / JR Gifu 7-min", "名鉄岐阜駅徒歩2分・JR岐阜徒歩7分"],
    shizuoka: ["Hotel Associa Shizuoka", "ホテルアソシア静岡", 4, 12500, "https://www.associa.com/szh/", "1-min walk JR Shizuoka North Exit", "JR静岡駅北口徒歩1分"],
    aichi: ["Mitsui Garden Hotel Nagoya Premier", "三井ガーデンホテル名古屋プレミア", 4, 15500, "https://www.gardenhotels.co.jp/nagoya-premier/", "5-min underground walk JR Nagoya Stn", "JR名古屋駅徒歩5分（地下直結）"],
    mie: ["Miyako City Tsu / Sanco Inn Tsu Ekimae", "都シティ 津／ホテルグリーンパーク津", 3.5, 10500, "https://www.miyakohotels.ne.jp/tsu/", "1-min walk Kintetsu & JR Tsu Stn", "JR・近鉄津駅直結"],
    shiga: ["Biwako Hotel (Otsu) / Lake Biwa Otsu Prince", "琵琶湖ホテル（大津港・浜大津）", 4, 17000, "https://www.keihanhotels-resorts.co.jp/biwakohotel/", "5-min walk Keihan Biwako-Hamaotsu Stn", "京阪びわ湖浜大津駅徒歩5分・JR大津無料シャトル"],
    kyoto: ["Mitsui Garden Hotel Kyoto Shijo", "三井ガーデンホテル京都四条", 4, 16500, "https://www.gardenhotels.co.jp/kyoto-shijo/", "6-min walk Subway Shijo Stn", "地下鉄烏丸線四条駅徒歩6分"],
    osaka: ["Cross Hotel Osaka", "クロスホテル大阪（心斎橋・道頓堀）", 4, 16000, "https://www.crosshotel.com/osaka/", "3-min walk Subway Namba Stn", "地下鉄なんば駅徒歩3分"],
    hyogo: ["Remm Plus Kobe Sannomiya", "レムプラス神戸三宮", 4, 14500, "https://www.hankyu-hotel.com/hotel/remm/kobe-sannomiya", "Direct above Kobe-Sannomiya Stn", "神戸三宮駅直結"],
    nara: ["Hotel Piazza Nara / JW Marriott Nara", "ピアッツァホテル奈良", 4, 14000, "https://www.piazza-hotel.co.jp/", "1-min walk JR Nara Station", "JR奈良駅徒歩1分"],
    wakayama: ["Hotel Granvia Wakayama", "ホテルグランヴィア和歌山", 3.5, 11500, "https://www.granvia-wakayama.co.jp/", "2-min walk JR Wakayama Central Exit", "JR和歌山駅徒歩2分"],
    tottori: ["Hotel Monarque Tottori", "ホテルモナーク鳥取", 3.5, 10500, "https://www.hotel-monarque.co.jp/", "5-min walk JR Tottori North Exit", "JR鳥取駅北口徒歩5分"],
    shimane: ["Onyado Nono Matsue Natural Hot Spring", "天然温泉 だんだんの湯 御宿 野乃 松江", 4, 13000, "https://dormy-hotels.com/dormyinn/hotels/nono_matsue/", "Lake Shinji Waterfront / Matsue Castle Walk", "松江城・宍道湖畔徒歩圏"],
    okayama: ["Hotel Granvia Okayama", "ホテルグランヴィア岡山", 4, 13000, "https://www.granvia-oka.co.jp/", "Direct inside JR Okayama Station", "JR岡山駅直結"],
    hiroshima: ["Hotel Granvia Hiroshima", "ホテルグランヴィア広島", 4, 13500, "https://www.hgh.co.jp/", "Direct at JR Hiroshima Shinkansen Exit", "JR広島駅新幹線口直結"],
    yamaguchi: ["Yuda Onsen Matsudaya / Hotel Kokusai Shin-Yamaguchi", "松田屋ホテル（湯田温泉）／新山口ターミナルホテル", 3.5, 14000, "https://www.matsudayahotel.co.jp/", "JR Yamaguchi Line Yuda-Onsen Stn 10m", "JR湯田温泉駅徒歩10分・新山口乗換"],
    tokushima: ["JR Hotel Clement Tokushima", "JRホテルクレメント徳島", 4, 12000, "https://www.jrclement.co.jp/tokushima/", "Direct inside JR Tokushima Station", "JR徳島駅直結"],
    kagawa: ["JR Hotel Clement Takamatsu", "JRホテルクレメント高松", 4, 12500, "https://www.jrclement.co.jp/takamatsu/", "1-min walk JR Takamatsu Stn & Pier", "JR高松駅＆高松港徒歩1分"],
    ehime: ["ANA Crowne Plaza Matsuyama", "ANAクラウンプラザホテル松山", 4, 13000, "https://www.anacpmatsuyama.com/", "Okaido Tram Stop / Castle Ropeway 5m", "市内電車「大街道」電停前"],
    kochi: ["The Crown Palais New Hankyu Kochi / Dormy Inn Kochi", "ドーミーイン高知（天然温泉 紺碧の湯）", 3.5, 11500, "https://dormy-hotels.com/dormyinn/hotels/kochi/", "2-min walk Harimayabashi Arcade / Hirome Market", "帯屋町商店街内・ひろめ市場徒歩5分"],
    fukuoka: ["Mitsui Garden Hotel Fukuoka Gion", "三井ガーデンホテル福岡祇園", 4, 14500, "https://www.gardenhotels.co.jp/fukuoka-gion/", "7-min walk JR Hakata Stn / Subway Kushida", "JR博多駅徒歩7分"],
    saga: ["Hotel New Otani Saga / Saga Washington Plaza", "ホテルニューオータニ佐賀", 3.5, 11500, "https://www.kys-newotani.co.jp/saga/", "5-min taxi JR Saga / Saga Castle Moat", "JR佐賀駅から車5分・佐賀城お堀端"],
    nagasaki: ["Hilton Nagasaki", "ヒルトン長崎", 4, 14500, "https://nagasaki.hiltonjapan.co.jp/", "Direct at JR Nagasaki Station West Exit", "JR長崎駅西口直結"],
    kumamoto: ["THE BLOSSOM KUMAMOTO", "THE BLOSSOM KUMAMOTO", 4, 13500, "https://www.jrk-hotels.co.jp/Kumamoto_Blossom/", "Direct inside JR Kumamoto Station", "JR熊本駅直結"],
    oita: ["JR Kyushu Hotel Blossom Oita", "JR九州ホテル ブラッサム大分（天空露天風呂付）", 4, 14500, "https://www.jrk-hotels.co.jp/Oita/", "Directly connected above JR Oita Station (Rooftop Onsen)", "JR大分駅直結（天然温泉CITY SPAてんくう付）"],
    miyazaki: ["Sheraton Grande Ocean Resort / JR Kyushu Hotel Miyazaki", "JR九州ホテル宮崎（JR宮崎駅直結）", 3.5, 11500, "https://www.jrk-hotels.co.jp/Miyazaki/", "0-min direct exit JR Miyazaki West Concourse", "JR宮崎駅西口直結"],
    kagoshima: ["Solaria Nishitetsu Hotel Kagoshima", "ソラリア西鉄ホテル鹿児島", 4, 13500, "https://nnr-h.com/solaria/kagoshima/", "1-min walk JR Kagoshima-Chuo Station", "JR鹿児島中央駅正面すぐ"],
    okinawa: ["Hotel Collective Naha Okinawa", "ホテル コレクティブ 那覇国際通り", 4, 15500, "https://hotelcollective.jp/", "5-min walk Yui Rail Kenchomae / Makishi Stn", "ゆいレール県庁前・牧志駅徒歩圏 国際通り"]
  };

  window.CITY_HOTELS = expandHotelMap(CITY_SPECS);
  window.PREFECTURE_HOTELS = expandHotelMap(PREFECTURE_SPECS);

  window.resolveDefaultHotelForLocation = function(rawLocationText) {
    const q = String(rawLocationText || "").trim();
    const matches = (q && typeof window.findMatchingGazetteerStops === "function")
      ? window.findMatchingGazetteerStops(q)
      : [];

    const cityStop = matches.find(m => !m.isPrefFallback && m.cityKey && window.CITY_HOTELS[m.cityKey]);
    if (cityStop) {
      return Object.assign({}, window.CITY_HOTELS[cityStop.cityKey], {
        matchLevel: "city",
        prefId: cityStop.prefId,
        cityKey: cityStop.cityKey,
        stop: cityStop
      });
    }

    const prefStop = matches.find(m => m.prefId && window.PREFECTURE_HOTELS[m.prefId]);
    if (prefStop) {
      return Object.assign({}, window.PREFECTURE_HOTELS[prefStop.prefId], {
        matchLevel: "prefecture",
        prefId: prefStop.prefId,
        cityKey: null,
        stop: prefStop
      });
    }

    return Object.assign({}, window.CITY_HOTELS.tokyo, {
      matchLevel: "fallback",
      prefId: "tokyo",
      cityKey: "tokyo",
      stop: null
    });
  };
})();
