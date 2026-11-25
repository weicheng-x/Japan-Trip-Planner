// Comprehensive All-Japan (47 Prefectures + All 1,747 Municipalities: 792 市 / 23 区 / 743 町 / 189 村 + Curated Areas) Place Index,
// Representative Place Icons, High-Precision Destination Resolver & Ambiguous Municipality Auto-Disambiguation

(function() {
  window.PREFECTURE_ICONS = {
    hokkaido: "❄️", aomori: "🍎", iwate: "🏯", miyagi: "🎋", akita: "❄️", yamagata: "🍒", fukushima: "🍑",
    ibaraki: "🌸", tochigi: "⛩️", gunma: "♨️", saitama: "🏮", chiba: "✈️", tokyo: "🗼", kanagawa: "⛵",
    niigata: "❄️", toyama: "🏔️", ishikawa: "🏯", fukui: "🦕", yamanashi: "🗻", nagano: "❄️", gifu: "🏔️",
    shizuoka: "🗻", aichi: "🏯", mie: "⛩️", shiga: "🌊", kyoto: "⛩️", osaka: "🏮", hyogo: "🥩",
    nara: "🦌", wakayama: "⛩️", tottori: "🐪", shimane: "⛩️", okayama: "🍑", hiroshima: "🦌", yamaguchi: "🐡",
    tokushima: "🌀", kagawa: "🍜", ehime: "🍊", kochi: "🐋", fukuoka: "🍜", saga: "🏺", nagasaki: "⚓",
    kumamoto: "🌋", oita: "♨️", miyazaki: "🌴", kagoshima: "🌋", okinawa: "🌺"
  };

  // Special-fame overrides take precedence over prefecture icons (e.g. Achi Village -> Stargazing 🌌 instead of Nagano snow ❄️)
  window.PLACE_ICON_OVERRIDES = {
    achi_village: "🌌",
    hakone: "♨️", kusatsu_onsen: "♨️", beppu: "♨️", yufuin: "♨️", arima_onsen: "♨️",
    kinosaki_onsen: "♨️", atami: "♨️", noboribetsu: "♨️", ginzan_onsen: "♨️", nyuto_onsen: "♨️",
    kinugawa_onsen: "♨️", kaminoyama_onsen: "♨️", akiu: "♨️", kurokawa: "♨️", shi_gero_gifu: "♨️",
    shi_ito_shizuoka: "♨️", shi_ibusuki_kagoshima: "♨️",
    kawaguchiko: "🗻", shi_fujiyoshida_yamanashi: "🗻", shi_fujinomiya_shizuoka: "🗻",
    shi_fuji_shizuoka: "🗻", shi_gotemba_shizuoka: "🗻",
    hirosaki: "🌸", kakunodate: "🌸", izu: "🌸",
    himeji: "🏯", matsumoto: "🏯", matsue: "🏯", kanazawa: "🏯", nagoya: "🏯",
    aizuwakamatsu: "🏯", shi_inuyama_aichi: "🏯", shi_hikone_shiga: "🏯", osaka: "🏮",
    nikko: "⛩️", izumo: "⛩️", ise: "⛩️", kamakura: "⛩️", dazaifu: "⛩️", koyasan: "⛩️", kyoto: "⛩️",
    nara: "🦌", hiroshima: "🦌", miyajima: "🦌",
    matsushima: "🏝️", sado_island: "🏝️", awaji_island: "🏝️", ishigaki: "🏝️", miyakojima: "🏝️",
    taketomi: "🏝️", rebun_island: "🏝️", rishiri_island: "🏝️",
    naoshima: "🎨", yakushima: "🌲", furano: "🪻", oirase: "🌲",
    shi_uji_kyoto: "🍵", shi_katsuyama_fukui: "🦕", tottori_city: "🐪", shi_tsukuba_ibaraki: "🚀",
    narita: "✈️", chitose: "✈️", haneda: "✈️",
    tokyo: "🗼", shinjuku: "🗼", asakusa: "🏮", yokohama: "⛵", kobe: "⛵", hakodate: "🌃",
    sapporo: "❄️", okinawa: "🌺", fukuoka: "🍜", takamatsu: "🍜", sendai: "🎋",
    takayama: "🏔️", shirakawago: "🏔️", gokayama: "🏔️", matsuyama: "♨️", onomichi: "🚲"
  };

  window.getJapanPlaceIcon = function(placeOrId) {
    if (!placeOrId) return "📍";
    if (typeof placeOrId === "string") {
      const clean = placeOrId.replace(/^pref_/, "");
      if (window.PLACE_ICON_OVERRIDES[placeOrId]) return window.PLACE_ICON_OVERRIDES[placeOrId];
      if (window.PLACE_ICON_OVERRIDES[clean]) return window.PLACE_ICON_OVERRIDES[clean];
      if (window.PREFECTURE_ICONS[clean]) return window.PREFECTURE_ICONS[clean];
      const geo = window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[placeOrId];
      if (geo && geo.prefId && window.PREFECTURE_ICONS[geo.prefId]) return window.PREFECTURE_ICONS[geo.prefId];
      return "📍";
    }
    if (placeOrId.icon) return placeOrId.icon;
    const id = placeOrId.id || placeOrId.geoId || "";
    if (window.PLACE_ICON_OVERRIDES[id]) return window.PLACE_ICON_OVERRIDES[id];
    const pId = placeOrId.prefId || (id.startsWith("pref_") ? id.slice(5) : "");
    return window.PREFECTURE_ICONS[pId] || "📍";
  };

  // All Romanized colliding Japanese Shi names across multiple prefectures.
  // Default auto-disambiguation applies to bare ambiguous inputs (e.g. "Fuchu" -> "Fuchu (Tokyo)", "Date" -> "Date (Hokkaido)").
  window.AMBIGUOUS_CITY_DEFAULTS = {
    fuchu: { defaultPref: "tokyo", altPrefs: ["hiroshima"] },
    huchu: { defaultPref: "tokyo", altPrefs: ["hiroshima"] },
    date: { defaultPref: "hokkaido", altPrefs: ["fukushima"] },
    hokuto: { defaultPref: "hokkaido", altPrefs: ["yamanashi"] },
    koga: { defaultPref: "ibaraki", altPrefs: ["fukuoka"] },
    kashima: { defaultPref: "ibaraki", altPrefs: ["saga"] },
    kasima: { defaultPref: "ibaraki", altPrefs: ["saga"] },
    sakura: { defaultPref: "chiba", altPrefs: ["tochigi"] },
    ono: { defaultPref: "hyogo", altPrefs: ["fukui"] },
    sakai: { defaultPref: "osaka", altPrefs: ["fukui"] },
    mino: { defaultPref: "gifu", altPrefs: ["osaka"] },
    tsushima: { defaultPref: "nagasaki", altPrefs: ["aichi"] },
    tusima: { defaultPref: "nagasaki", altPrefs: ["aichi"] },
    konan: { defaultPref: "aichi", altPrefs: ["shiga", "kochi"] },
    miyoshi: { defaultPref: "hiroshima", altPrefs: ["aichi", "tokushima"] },
    miyosi: { defaultPref: "hiroshima", altPrefs: ["aichi", "tokushima"] },
    izumi: { defaultPref: "osaka", altPrefs: ["kagoshima"] },
    idumi: { defaultPref: "osaka", altPrefs: ["kagoshima"] }
  };

  // Lazy index built once after japan-geo.js & gazetteer.js are loaded
  let _built = null;

  function normStr(str) {
    if (typeof window.normalizeJapanRomaji === "function") {
      return window.normalizeJapanRomaji(str);
    }
    return String(str || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[-_'’`./\\()（）\[\]]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function stripPrefSuffixJa(ja) {
    return String(ja || "").replace(/(?:都|道|府|県)$/, "");
  }

  function ensureIndex() {
    if (_built) return _built;
    const prefs = window.JAPAN_PREFECTURES || [];
    const prefById = new Map();
    const prefByLookup = new Map();
    const citiesByPref = {};
    const munisByPref = {};

    prefs.forEach(p => {
      prefById.set(p.id, p);
      citiesByPref[p.id] = [];
      munisByPref[p.id] = [];
      const addPrefKey = (k) => {
        const nk = normStr(k);
        if (nk) prefByLookup.set(nk, p);
        if (k) prefByLookup.set(String(k).toLowerCase().trim(), p);
      };
      addPrefKey(p.id);
      addPrefKey(p.nameEn);
      addPrefKey(`${p.nameEn} Pref`);
      addPrefKey(`${p.nameEn} Pref.`);
      addPrefKey(`${p.nameEn} Prefecture`);
      addPrefKey(`${p.nameEn} To`);
      addPrefKey(`${p.nameEn} Fu`);
      addPrefKey(`${p.nameEn} Ken`);
      addPrefKey(p.nameJa);
      addPrefKey(stripPrefSuffixJa(p.nameJa));
    });

    const gazByGeoId = new Map();
    const gazById = new Map();
    (window.JAPAN_GAZETTEER || []).forEach(g => {
      if (!g.isPrefFallback) {
        gazById.set(g.id, g);
        const gk = g.geoId || g.id;
        if (!gazByGeoId.has(gk)) gazByGeoId.set(gk, g);
      }
    });

    const stopById = new Map();
    const stopsByPrefNorm = new Map();
    const stopsByAsciiBase = new Map();
    const allSearchEntries = [];

    const cityPaths = window.JAPAN_CITY_PATHS || {};
    const asciiPrefSets = new Map();
    Object.values(cityPaths).forEach(geo => {
      if (geo && geo.isMuni && geo.nameEn && geo.prefId) {
        const key = normStr(geo.nameEn);
        if (key) {
          if (!asciiPrefSets.has(key)) asciiPrefSets.set(key, new Set());
          asciiPrefSets.get(key).add(geo.prefId);
        }
      }
    });

    const seenSearchKey = new Set();
    const cityKeySeenByPref = new Set();
    const muniIdSeenByPref = new Set();
    const jaMuniEntries = [];
    const registerSearchEntry = (stop) => {
      const k = `${stop.prefId}|${normStr(stop.rawNameEn || stop.nameEn)}|${stop.rawNameJa || stop.nameJa}`;
      if (!seenSearchKey.has(k)) {
        seenSearchKey.add(k);
        allSearchEntries.push(stop);
      }
    };

    const registerStop = (stop) => {
      if (!stop || !stop.id) return;
      stopById.set(stop.id, stop);
      if (stop.prefId && citiesByPref[stop.prefId]) {
        const cKey = `${stop.prefId}|${stop.rawNameJa || ""}|${normStr(stop.nameEn)}`;
        if (!cityKeySeenByPref.has(stop.id) && !cityKeySeenByPref.has(cKey)) {
          cityKeySeenByPref.add(stop.id);
          if (stop.rawNameJa) cityKeySeenByPref.add(cKey);
          citiesByPref[stop.prefId].push(stop);
        }
      }
      if (stop.isMuni && stop.prefId && munisByPref[stop.prefId]) {
        const mKey = `${stop.prefId}|${stop.id}`;
        if (!muniIdSeenByPref.has(mKey)) {
          muniIdSeenByPref.add(mKey);
          munisByPref[stop.prefId].push(stop);
        }
      }
      if (!stop.isPrefFallback) {
        const jaTarget = stop.rawMuniJa || stop.rawNameJa;
        if (jaTarget && jaTarget.length >= 3 && /[市区町村]$/.test(jaTarget)) {
          jaMuniEntries.push({ stop, jaTarget });
        }
      }
      const addLookup = (rawK) => {
        const k = String(rawK || "").trim();
        if (!k) return;
        const lower = k.toLowerCase();
        const nk = normStr(k);
        if (stop.prefId) {
          const pk1 = `${stop.prefId}|${lower}`;
          if (!stopsByPrefNorm.has(pk1)) stopsByPrefNorm.set(pk1, stop);
          if (nk) {
            const pk2 = `${stop.prefId}|${nk}`;
            if (!stopsByPrefNorm.has(pk2)) stopsByPrefNorm.set(pk2, stop);
          }
        }
        if (nk) {
          if (!stopsByAsciiBase.has(nk)) stopsByAsciiBase.set(nk, []);
          const arr = stopsByAsciiBase.get(nk);
          if (!arr.includes(stop)) arr.push(stop);
        }
        if (/[^\x00-\x7F]/.test(lower)) {
          if (!stopsByAsciiBase.has(lower)) stopsByAsciiBase.set(lower, []);
          const arrJa = stopsByAsciiBase.get(lower);
          if (!arrJa.includes(stop)) arrJa.push(stop);
        }
      };

      addLookup(stop.id);
      addLookup(stop.nameEn);
      addLookup(stop.rawNameEn);
      addLookup(stop.nameJa);
      addLookup(stop.rawNameJa);
      if (stop.rawMuniJa) {
        addLookup(stop.rawMuniJa);
        const jaStem = stop.rawMuniJa.replace(/[市区町村]$/, "");
        if (jaStem.length >= 2) addLookup(jaStem);
      } else if (stop.rawNameJa && /[市区町村]$/.test(stop.rawNameJa)) {
        const jaStem = stop.rawNameJa.replace(/[市区町村]$/, "");
        if (jaStem.length >= 2) addLookup(jaStem);
      }
      if (stop.kana) addLookup(stop.kana);
      if (Array.isArray(stop.keys)) stop.keys.forEach(addLookup);
    };

    // 1) Curated gazetteer stops first (priority names, tourism metadata & city packs)
    (window.JAPAN_GAZETTEER || []).forEach(g => {
      if (g.isPrefFallback) return;
      let matchedGeoId = g.geoId || g.id;
      let geo = cityPaths[matchedGeoId];
      if (!geo && g.prefId) {
        const gNorm = normStr(g.nameEn);
        const shiCandidate = "shi_" + g.prefId + "_" + gNorm;
        const candidateId = cityPaths[shiCandidate]
          ? shiCandidate
          : Object.keys(cityPaths).find(k => {
            const c = cityPaths[k];
            return c && c.prefId === g.prefId && normStr(c.nameEn) === gNorm;
          });
        if (candidateId) {
          matchedGeoId = candidateId;
          geo = cityPaths[candidateId];
          gazByGeoId.set(candidateId, g);
        }
      }
      const pref = prefById.get(g.prefId);
      const geoNorm = geo ? normStr(geo.nameEn) : "";
      const isAmb = !!(geo && geo.isShi && asciiPrefSets.get(geoNorm) && asciiPrefSets.get(geoNorm).size > 1 && window.AMBIGUOUS_CITY_DEFAULTS[geoNorm]);
      const dispEn = isAmb && pref ? `${geo.nameEn} (${pref.nameEn})` : g.nameEn;
      const dispJa = isAmb && pref ? `${geo.nameJa}（${pref.nameJa}）` : g.nameJa;
      const stop = Object.assign({}, g, {
        geoId: matchedGeoId,
        x: geo ? geo.cx : g.x,
        y: geo ? geo.cy : g.y,
        hasCityBoundary: !!geo,
        isShi: !!(geo && geo.isShi),
        isMuni: !!(geo && geo.isMuni),
        muniType: (geo && geo.muniType) || (geo && geo.isShi ? "city" : "area"),
        rawNameEn: geo ? geo.nameEn : g.nameEn,
        rawNameJa: geo ? (geo.rawMuniJa || geo.nameJa) : g.nameJa,
        rawMuniJa: geo && geo.rawMuniJa ? geo.rawMuniJa : "",
        nameEn: dispEn,
        nameJa: dispJa,
        icon: window.getJapanPlaceIcon(g),
        isAmbiguous: isAmb
      });
      registerStop(stop);
      registerSearchEntry(stop);
    });

    // 2) Remaining atomic municipalities in deterministic order: 市 (city) -> 区 (ward) -> 町 (town) -> 村 (village)
    const muniTypeOrder = { city: 0, ward: 1, town: 2, village: 3, area: 4, other: 5 };
    const remainingGeoIds = Object.keys(cityPaths)
      .filter(geoId => {
        const geo = cityPaths[geoId];
        return geo && !stopById.has(geoId) && !gazByGeoId.has(geoId);
      })
      .sort((a, b) => {
        const ga = cityPaths[a];
        const gb = cityPaths[b];
        const ta = muniTypeOrder[ga.muniType] !== undefined ? muniTypeOrder[ga.muniType] : 5;
        const tb = muniTypeOrder[gb.muniType] !== undefined ? muniTypeOrder[gb.muniType] : 5;
        if (ta !== tb) return ta - tb;
        return String(ga.nameEn || a).localeCompare(String(gb.nameEn || b));
      });

    remainingGeoIds.forEach(geoId => {
      const geo = cityPaths[geoId];
      const pref = prefById.get(geo.prefId);
      const prefNameEn = pref ? pref.nameEn : "";
      const prefNameJa = pref ? pref.nameJa : "";
      const normName = normStr(geo.nameEn);
      const prefSpread = asciiPrefSets.get(normName) ? asciiPrefSets.get(normName).size : 0;
      const isAmb = !!(prefSpread > 1 || (geo.isShi && window.AMBIGUOUS_CITY_DEFAULTS[normName]));
      const dispEn = isAmb && prefNameEn ? `${geo.nameEn} (${prefNameEn})` : geo.nameEn;
      const baseJa = geo.rawMuniJa || geo.nameJa;
      const dispJa = isAmb && prefNameJa ? `${baseJa}（${prefNameJa}）` : geo.nameJa;
      const stop = {
        id: geoId,
        geoId,
        prefId: geo.prefId,
        cityKey: geoId,
        isPrefFallback: false,
        hasCityBoundary: true,
        isShi: !!geo.isShi,
        isMuni: !!geo.isMuni,
        muniType: geo.muniType || (geo.isShi ? "city" : "area"),
        rawNameEn: geo.nameEn,
        rawNameJa: baseJa,
        rawMuniJa: geo.rawMuniJa || "",
        nameEn: dispEn,
        nameJa: dispJa,
        kana: geo.kana || "",
        regionKey: pref ? pref.regionKey : "Japan",
        keys: [geo.nameEn, geo.nameJa, geo.rawMuniJa, geo.kana].filter(Boolean),
        x: geo.cx,
        y: geo.cy,
        icon: window.getJapanPlaceIcon({ id: geoId, prefId: geo.prefId }),
        isAmbiguous: isAmb
      };
      registerStop(stop);
      registerSearchEntry(stop);
    });

    // Sort stops within each prefecture: curated first, then 市 -> 区 -> 町 -> 村 alphabetically
    Object.keys(citiesByPref).forEach(pId => {
      citiesByPref[pId].sort((a, b) => {
        const aCur = gazById.has(a.id) ? 0 : 1;
        const bCur = gazById.has(b.id) ? 0 : 1;
        if (aCur !== bCur) return aCur - bCur;
        const ta = muniTypeOrder[a.muniType] !== undefined ? muniTypeOrder[a.muniType] : 5;
        const tb = muniTypeOrder[b.muniType] !== undefined ? muniTypeOrder[b.muniType] : 5;
        if (ta !== tb) return ta - tb;
        return String(a.nameEn).localeCompare(String(b.nameEn));
      });
    });

    Object.keys(munisByPref).forEach(pId => {
      munisByPref[pId].sort((a, b) => {
        const ta = muniTypeOrder[a.muniType] !== undefined ? muniTypeOrder[a.muniType] : 5;
        const tb = muniTypeOrder[b.muniType] !== undefined ? muniTypeOrder[b.muniType] : 5;
        if (ta !== tb) return ta - tb;
        return String(a.rawNameEn || a.nameEn).localeCompare(String(b.rawNameEn || b.nameEn));
      });
    });

    // Add all 47 prefectures to search index too
    prefs.forEach(p => {
      allSearchEntries.push({
        id: "pref_" + p.id,
        prefId: p.id,
        geoId: null,
        cityKey: null,
        isPrefFallback: true,
        hasCityBoundary: false,
        isShi: false,
        isMuni: false,
        muniType: "prefecture",
        nameEn: `${p.nameEn} Pref.`,
        nameJa: p.nameJa,
        regionKey: p.regionKey,
        x: p.x,
        y: p.y,
        icon: window.getJapanPlaceIcon(p.id),
        keys: p.keys || []
      });
    });

    window.JAPAN_CITIES_BY_PREF = citiesByPref;
    window.JAPAN_MUNIS_BY_PREF = munisByPref;
    _built = { prefById, prefByLookup, citiesByPref, munisByPref, stopById, stopsByPrefNorm, stopsByAsciiBase, allSearchEntries, jaMuniEntries };
    return _built;
  }

  function resolvePrefectureToken(rawPrefToken) {
    const idx = ensureIndex();
    const raw = String(rawPrefToken || "").trim();
    if (!raw) return null;
    return idx.prefByLookup.get(raw.toLowerCase()) || idx.prefByLookup.get(normStr(raw)) || null;
  }

  window.getCityStopByGeoId = function(geoId) {
    const idx = ensureIndex();
    return idx.stopById.get(geoId) || null;
  };

  window.getCitiesForPrefecture = function(prefId) {
    const idx = ensureIndex();
    return idx.citiesByPref[prefId] || [];
  };

  window.getMunisForPrefecture = function(prefId) {
    const idx = ensureIndex();
    return idx.munisByPref[prefId] || [];
  };

  window.getAmbiguousAlternativesForStop = function(stop) {
    if (!stop) return [];
    const idx = ensureIndex();
    const nk = normStr(stop.rawNameEn || stop.nameEn || "");
    const rule = window.AMBIGUOUS_CITY_DEFAULTS[nk];
    if (rule) {
      const allPrefs = [rule.defaultPref].concat(rule.altPrefs || []);
      return allPrefs
        .filter(pid => pid !== stop.prefId)
        .map(pid => idx.stopsByPrefNorm.get(`${pid}|${nk}`) || idx.prefById.get(pid))
        .filter(Boolean);
    }
    const candidates = (idx.stopsByAsciiBase.get(nk) || []).filter(c =>
      c && c.prefId && c.prefId !== stop.prefId && normStr(c.rawNameEn || c.nameEn) === nk
    );
    const seenPref = new Set();
    const alts = [];
    for (const c of candidates) {
      if (!seenPref.has(c.prefId)) {
        seenPref.add(c.prefId);
        alts.push(c);
        if (alts.length >= 6) break;
      }
    }
    return alts;
  };

  window.disambiguateLocationInput = function(rawText, isJa) {
    const idx = ensureIndex();
    const trimmed = String(rawText || "").trim();
    if (!trimmed) return { text: "", corrected: false, stop: null, prefId: null, alternatives: [] };

    // Case 1: Explicit parenthetical qualifier: "Fuchu (Tokyo)", "Fuchu (Hiroshima)", "Asahi (Yamagata)", "府中市（広島県）"
    const m = trimmed.match(/^(.+?)\s*[(\（]([^)\）]+)[)\）]\s*$/);
    if (m) {
      const cityPart = m[1].trim();
      const prefPart = m[2].trim();
      const prefObj = resolvePrefectureToken(prefPart);
      if (prefObj) {
        const strippedEn = cityPart.replace(/\s+(city|shi|ward|ku|town|cho|machi|village|son|mura)$/i, "").trim();
        const nkCity = normStr(strippedEn);
        const cleanJaCity = cityPart.replace(/[市区町村]$/, "");
        const matched =
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cityPart.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${strippedEn.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${nkCity}`) ||
          (cleanJaCity.length >= 2 ? idx.stopsByPrefNorm.get(`${prefObj.id}|${cleanJaCity}`) : null) ||
          (idx.citiesByPref[prefObj.id] || []).find(s =>
            normStr(s.rawNameEn || s.nameEn) === nkCity || s.rawNameJa === cityPart || (cleanJaCity.length >= 2 && s.nameJa && s.nameJa.includes(cleanJaCity))
          ) || null;
        if (matched) {
          const outText = isJa ? matched.nameJa : matched.nameEn;
          return {
            text: outText,
            corrected: false,
            stop: matched,
            prefId: prefObj.id,
            alternatives: window.getAmbiguousAlternativesForStop(matched)
          };
        }
      }
    }

    // Case 2: Bare ambiguous Shi OR Town/Village input ("Fuchu", "Date", "Asahi", "Ikeda", "府中", "伊達", ...)
    const stripped = trimmed.replace(/\s+(city|shi|ward|ku|town|cho|machi|village|son|mura)$/i, "").trim();
    const nk = normStr(stripped);
    const bareJa = stripped.replace(/[市区町村]$/, "");
    let ambRule = window.AMBIGUOUS_CITY_DEFAULTS[nk];
    let matchedPrefCandidates = null;
    if (!ambRule && (bareJa === "府中" || bareJa === "伊達")) {
      ambRule = window.AMBIGUOUS_CITY_DEFAULTS[bareJa === "府中" ? "fuchu" : "date"];
      matchedPrefCandidates = idx.stopsByAsciiBase.get(bareJa === "府中" ? "huchu" : "date");
    }
    if (ambRule) {
      const prefObj = idx.prefById.get(ambRule.defaultPref);
      const nkLookup = matchedPrefCandidates ? normStr(matchedPrefCandidates[0].rawNameEn) : nk;
      const defaultStop =
        idx.stopsByPrefNorm.get(`${ambRule.defaultPref}|${nkLookup}`) ||
        idx.stopsByPrefNorm.get(`${ambRule.defaultPref}|${stripped.toLowerCase()}`) ||
        idx.stopsByPrefNorm.get(`${ambRule.defaultPref}|${bareJa}`) ||
        null;
      if (defaultStop && prefObj) {
        const canonicalEn = `${defaultStop.rawNameEn || defaultStop.nameEn} (${prefObj.nameEn})`;
        const canonicalJa = `${defaultStop.rawNameJa || defaultStop.nameJa}（${prefObj.nameJa}）`;
        const normalizedStop = Object.assign({}, defaultStop, { nameEn: canonicalEn, nameJa: canonicalJa, isAmbiguous: true });
        return {
          text: isJa ? canonicalJa : canonicalEn,
          corrected: true,
          stop: normalizedStop,
          prefId: prefObj.id,
          alternatives: window.getAmbiguousAlternativesForStop(normalizedStop)
        };
      }
    }

    // Dynamic ambiguity check for bare colliding towns/villages (e.g. "Asahi", "Ikeda", "Shimizu", "Mihama")
    const bareHits = idx.stopsByAsciiBase.get(nk) || [];
    const exactMuniHits = bareHits.filter(s => s && s.isMuni && normStr(s.rawNameEn || s.nameEn) === nk);
    const distinctPrefIds = new Set(exactMuniHits.map(s => s.prefId).filter(Boolean));
    const hasCuratedSingle = bareHits.some(s => !s.isMuni && !s.isAmbiguous);
    if (distinctPrefIds.size > 1 && !hasCuratedSingle && exactMuniHits[0]) {
      const defStop = exactMuniHits[0];
      const prefObj = idx.prefById.get(defStop.prefId);
      if (prefObj) {
        const canonicalEn = defStop.nameEn.includes("(") ? defStop.nameEn : `${defStop.rawNameEn || defStop.nameEn} (${prefObj.nameEn})`;
        const canonicalJa = defStop.nameJa.includes("（") ? defStop.nameJa : `${defStop.rawNameJa || defStop.nameJa}（${prefObj.nameJa}）`;
        return {
          text: isJa ? canonicalJa : canonicalEn,
          corrected: true,
          stop: defStop,
          prefId: prefObj.id,
          alternatives: window.getAmbiguousAlternativesForStop(defStop)
        };
      }
    }

    // Case 3: Unambiguous lookup via full index
    const resolved = window.resolveLocationInputStops(trimmed);
    const first = resolved[0] || null;
    return {
      text: trimmed,
      corrected: false,
      stop: first,
      prefId: first ? first.prefId : null,
      alternatives: first ? window.getAmbiguousAlternativesForStop(first) : []
    };
  };

  window.resolveLocationInputStops = function(rawText) {
    const idx = ensureIndex();
    const trimmed = String(rawText || "").trim();
    if (!trimmed) return [];

    // 1) Explicit "Name (Prefecture)" syntax resolves strictly to that prefecture's municipality!
    const m = trimmed.match(/^(.+?)\s*[(\（]([^)\）]+)[)\）]\s*$/);
    if (m) {
      const prefObj = resolvePrefectureToken(m[2]);
      if (prefObj) {
        const cityPart = m[1].trim();
        const strippedEn = cityPart.replace(/\s+(city|shi|ward|ku|town|cho|machi|village|son|mura)$/i, "").trim();
        const nkCity = normStr(strippedEn);
        const jaStem = cityPart.replace(/[市区町村]$/, "");
        const hit =
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cityPart.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${strippedEn.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${nkCity}`) ||
          (jaStem.length >= 2 ? idx.stopsByPrefNorm.get(`${prefObj.id}|${jaStem}`) : null) ||
          (idx.citiesByPref[prefObj.id] || []).find(s => normStr(s.rawNameEn || s.nameEn) === nkCity || s.rawNameJa === cityPart) ||
          null;
        if (hit) return [hit];
      }
    }

    // 2) Exact full-field match against any of 1,747 municipalities + curated stops
    const stripped = trimmed.replace(/\s+(city|shi|ward|ku|town|cho|machi|village|son|mura)$/i, "").trim();
    const nk = normStr(stripped);
    const jaFull = trimmed;
    const jaStem = stripped.replace(/[市区町村]$/, "");

    if (window.AMBIGUOUS_CITY_DEFAULTS[nk]) {
      const rule = window.AMBIGUOUS_CITY_DEFAULTS[nk];
      const defStop = idx.stopsByPrefNorm.get(`${rule.defaultPref}|${nk}`);
      if (defStop) return [defStop];
    }
    if (jaStem === "府中" || jaStem === "伊達") {
      const defId = jaStem === "府中" ? "tokyo" : "hokkaido";
      const defStop = idx.stopsByPrefNorm.get(`${defId}|${jaStem}`);
      if (defStop) return [defStop];
    }
    if (nk === "mt huzi" || nk === "mount huzi" || nk === "huzi" || jaStem === "富士山") {
      const kawa = idx.stopById.get("kawaguchiko");
      if (kawa) return [kawa];
    }

    const directCandidates =
      idx.stopsByAsciiBase.get(nk) ||
      idx.stopsByAsciiBase.get(trimmed.toLowerCase()) ||
      idx.stopsByAsciiBase.get(jaFull) ||
      (jaStem.length >= 2 ? idx.stopsByAsciiBase.get(jaStem) : null) ||
      null;
    if (directCandidates && directCandidates.length > 0) {
      const exactMuni = directCandidates.find(s =>
        normStr(s.rawNameEn || s.nameEn) === nk ||
        s.rawMuniJa === trimmed ||
        (s.rawNameJa && s.rawNameJa === trimmed)
      );
      return [exactMuni || directCandidates[0]];
    }

    // 3) Fall back to curated gazetteer substring matching (e.g. "Tokyo & Kawaguchiko", "Tsuwano & Shimane")
    if (typeof window.findMatchingGazetteerStops === "function") {
      const gazHits = window.findMatchingGazetteerStops(trimmed);
      if (gazHits.length > 0) return gazHits;
    }

    // 4) Last check: explicit Japanese municipality suffix name (>= 3 chars ending in 市/区/町/村) inside short phrase
    if (/[市区町村]/.test(trimmed)) {
      for (let i = 0; i < idx.jaMuniEntries.length; i++) {
        if (trimmed.includes(idx.jaMuniEntries[i].jaTarget)) {
          return [idx.jaMuniEntries[i].stop];
        }
      }
    }
    return [];
  };

  window.searchAllJapanPlaces = function(query, limit) {
    const idx = ensureIndex();
    const maxItems = Math.max(1, limit || 24);
    const qRaw = String(query || "").trim();
    if (!qRaw) {
      return idx.allSearchEntries.slice(0, maxItems);
    }

    const qLower = qRaw.toLowerCase();
    const qNorm = normStr(qRaw.replace(/\s+(city|shi|ward|ku|town|cho|machi|village|son|mura|pref|prefecture)$/i, ""));
    const scored = [];

    for (let i = 0; i < idx.allSearchEntries.length; i++) {
      const item = idx.allSearchEntries[i];
      const enL = String(item.nameEn || "").toLowerCase();
      const rawEnL = String(item.rawNameEn || "").toLowerCase();
      const jaS = String(item.nameJa || "");
      const enN = normStr(item.rawNameEn || item.nameEn || "");
      const prefObj = idx.prefById.get(item.prefId);
      const prefEnL = prefObj ? prefObj.nameEn.toLowerCase() : "";
      const kana = String(item.kana || "");

      let score = 0;
      if (enL === qLower || rawEnL === qLower || jaS === qRaw || enN === qNorm) score = 100;
      else if (rawEnL.startsWith(qLower) || enL.startsWith(qLower) || enN.startsWith(qNorm) || jaS.startsWith(qRaw) || (kana && kana.startsWith(qRaw))) score = 70;
      else if (enL.includes(qLower) || enN.includes(qNorm) || jaS.includes(qRaw) || prefEnL.startsWith(qLower)) score = 40;
      else if (Array.isArray(item.keys) && item.keys.some(k => String(k).toLowerCase().includes(qLower) || normStr(k).includes(qNorm))) score = 25;

      if (score > 0) {
        if (!item.isPrefFallback && item.isShi === false) score += 8; // Boost curated tourist towns slightly
        if (item.isAmbiguous) {
          const rule = window.AMBIGUOUS_CITY_DEFAULTS[normStr(item.rawNameEn || item.nameEn)];
          if (rule && rule.defaultPref === item.prefId) score += 5;
        }
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score || String(a.item.nameEn).localeCompare(String(b.item.nameEn)));
    return scored.slice(0, maxItems).map(x => Object.assign({}, x.item, {
      prefNameEn: (idx.prefById.get(x.item.prefId) || {}).nameEn || "",
      prefNameJa: (idx.prefById.get(x.item.prefId) || {}).nameJa || ""
    }));
  };
})();
