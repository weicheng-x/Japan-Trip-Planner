// Comprehensive All-Japan (47 Prefectures + 792 Cities 市 + Curated Towns) Place Index,
// Representative Place Icons, High-Precision Destination Resolver & Ambiguous City Auto-Disambiguation

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

    prefs.forEach(p => {
      prefById.set(p.id, p);
      citiesByPref[p.id] = [];
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
    const asciiFreq = new Map();
    Object.values(cityPaths).forEach(geo => {
      if (geo && geo.isShi && geo.nameEn) {
        const key = String(geo.nameEn).toLowerCase().trim();
        asciiFreq.set(key, (asciiFreq.get(key) || 0) + 1);
      }
    });

    const registerSearchEntry = (stop) => {
      const dupSearch = allSearchEntries.some(ex =>
        ex.prefId === stop.prefId && normStr(ex.rawNameEn || ex.nameEn) === normStr(stop.rawNameEn || stop.nameEn)
      );
      if (!dupSearch) allSearchEntries.push(stop);
    };

    const registerStop = (stop) => {
      if (!stop || !stop.id) return;
      stopById.set(stop.id, stop);
      if (stop.prefId && citiesByPref[stop.prefId]) {
        const dupName = citiesByPref[stop.prefId].some(existing =>
          normStr(existing.rawNameEn || existing.nameEn) === normStr(stop.rawNameEn || stop.nameEn)
        );
        if (!dupName) citiesByPref[stop.prefId].push(stop);
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
      if (stop.rawNameJa && stop.rawNameJa.endsWith("市")) {
        addLookup(stop.rawNameJa.slice(0, -1));
      }
      if (stop.kana) addLookup(stop.kana);
      if (Array.isArray(stop.keys)) stop.keys.forEach(addLookup);
    };

    // First register curated gazetteer stops so they get priority display/names
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
      const isAmb = !!(geo && geo.isShi && asciiFreq.get(String(geo.nameEn || "").toLowerCase()) > 1 && window.AMBIGUOUS_CITY_DEFAULTS[normStr(geo.nameEn)]);
      const dispEn = isAmb && pref ? `${geo.nameEn} (${pref.nameEn})` : g.nameEn;
      const dispJa = isAmb && pref ? `${geo.nameJa}（${pref.nameJa}）` : g.nameJa;
      const stop = Object.assign({}, g, {
        geoId: matchedGeoId,
        x: geo ? geo.cx : g.x,
        y: geo ? geo.cy : g.y,
        hasCityBoundary: !!geo,
        isShi: !!(geo && geo.isShi),
        rawNameEn: geo ? geo.nameEn : g.nameEn,
        rawNameJa: geo ? geo.nameJa : g.nameJa,
        nameEn: dispEn,
        nameJa: dispJa,
        icon: window.getJapanPlaceIcon(g),
        isAmbiguous: isAmb
      });
      registerStop(stop);
      registerSearchEntry(stop);
    });

    // Then register every single remaining Shi & Curated Polygon from JAPAN_CITY_PATHS
    Object.keys(cityPaths).forEach(geoId => {
      const geo = cityPaths[geoId];
      if (!geo || stopById.has(geoId) || gazByGeoId.has(geoId)) return;
      const pref = prefById.get(geo.prefId);
      const prefNameEn = pref ? pref.nameEn : "";
      const prefNameJa = pref ? pref.nameJa : "";
      const normName = normStr(geo.nameEn);
      const isAmb = !!(geo.isShi && (asciiFreq.get(String(geo.nameEn || "").toLowerCase()) > 1) && (window.AMBIGUOUS_CITY_DEFAULTS[normName] || asciiFreq.get(normName) > 1));
      const dispEn = isAmb && prefNameEn ? `${geo.nameEn} (${prefNameEn})` : geo.nameEn;
      const dispJa = isAmb && prefNameJa ? `${geo.nameJa}（${prefNameJa}）` : geo.nameJa;
      const stop = {
        id: geoId,
        geoId,
        prefId: geo.prefId,
        cityKey: geoId,
        isPrefFallback: false,
        hasCityBoundary: true,
        isShi: !!geo.isShi,
        rawNameEn: geo.nameEn,
        rawNameJa: geo.nameJa,
        nameEn: dispEn,
        nameJa: dispJa,
        kana: geo.kana || "",
        regionKey: pref ? pref.regionKey : "Japan",
        keys: [geo.nameEn, geo.nameJa, geo.kana].filter(Boolean),
        x: geo.cx,
        y: geo.cy,
        icon: window.getJapanPlaceIcon({ id: geoId, prefId: geo.prefId }),
        isAmbiguous: isAmb
      };
      registerStop(stop);
      registerSearchEntry(stop);
    });

    // Sort cities within each prefecture: curated/iconic first, then Shi alphabetically
    Object.keys(citiesByPref).forEach(pId => {
      citiesByPref[pId].sort((a, b) => {
        const aCur = gazById.has(a.id) ? 0 : 1;
        const bCur = gazById.has(b.id) ? 0 : 1;
        if (aCur !== bCur) return aCur - bCur;
        return String(a.nameEn).localeCompare(String(b.nameEn));
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
    _built = { prefById, prefByLookup, citiesByPref, stopById, stopsByPrefNorm, stopsByAsciiBase, allSearchEntries };
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

  window.getAmbiguousAlternativesForStop = function(stop) {
    if (!stop) return [];
    const idx = ensureIndex();
    const nk = normStr(stop.rawNameEn || stop.nameEn || "");
    const rule = window.AMBIGUOUS_CITY_DEFAULTS[nk];
    if (!rule) return [];
    const allPrefs = [rule.defaultPref].concat(rule.altPrefs || []);
    return allPrefs
      .filter(pid => pid !== stop.prefId)
      .map(pid => idx.stopsByPrefNorm.get(`${pid}|${nk}`) || idx.prefById.get(pid))
      .filter(Boolean);
  };

  window.disambiguateLocationInput = function(rawText, isJa) {
    const idx = ensureIndex();
    const trimmed = String(rawText || "").trim();
    if (!trimmed) return { text: "", corrected: false, stop: null, prefId: null, alternatives: [] };

    // Case 1: Explicit parenthetical qualifier: "Fuchu (Tokyo)", "Fuchu (Hiroshima)", "府中市（広島県）"
    const m = trimmed.match(/^(.+?)\s*[(\（]([^)\）]+)[)\）]\s*$/);
    if (m) {
      const cityPart = m[1].trim();
      const prefPart = m[2].trim();
      const prefObj = resolvePrefectureToken(prefPart);
      if (prefObj) {
        const nkCity = normStr(cityPart);
        const cleanJaCity = cityPart.replace(/市$/, "");
        const matched =
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cityPart.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${nkCity}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cleanJaCity}`) ||
          (idx.citiesByPref[prefObj.id] || []).find(s =>
            normStr(s.rawNameEn || s.nameEn) === nkCity || s.rawNameJa === cityPart || (s.nameJa && s.nameJa.includes(cleanJaCity))
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

    // Case 2: Bare ambiguous Shi input ("Fuchu", "Date", "府中", "府中市", "伊達", "伊達市", "Sakura", "Kashima", ...)
    const stripped = trimmed.replace(/\s+(city|shi)$/i, "").trim();
    const nk = normStr(stripped);
    const bareJa = stripped.replace(/市$/, "");
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

    // Case 3: Unambiguous lookup via full index
    const resolved = window.resolveLocationInputStops(trimmed);
    const first = resolved[0] || null;
    return {
      text: trimmed,
      corrected: false,
      stop: first,
      prefId: first ? first.prefId : null,
      alternatives: []
    };
  };

  window.resolveLocationInputStops = function(rawText) {
    const idx = ensureIndex();
    const trimmed = String(rawText || "").trim();
    if (!trimmed) return [];

    // 1) Explicit "City (Prefecture)" syntax resolves strictly to that prefecture's city!
    const m = trimmed.match(/^(.+?)\s*[(\（]([^)\）]+)[)\）]\s*$/);
    if (m) {
      const prefObj = resolvePrefectureToken(m[2]);
      if (prefObj) {
        const cityPart = m[1].trim();
        const nkCity = normStr(cityPart.replace(/\s+(city|shi)$/i, ""));
        const hit =
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cityPart.toLowerCase()}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${nkCity}`) ||
          idx.stopsByPrefNorm.get(`${prefObj.id}|${cityPart.replace(/市$/, "")}`) ||
          (idx.citiesByPref[prefObj.id] || []).find(s => normStr(s.rawNameEn || s.nameEn) === nkCity) ||
          null;
        if (hit) return [hit];
      }
    }

    // 2) Exact full-field match against any of 792 Shi + curated stops (e.g. "Achi Village", "Akiu", "Nakagawa", "Muko")
    const stripped = trimmed.replace(/\s+(city|shi)$/i, "").trim();
    const nk = normStr(stripped);
    const jaNoShi = stripped.replace(/市$/, "");

    // Check ambiguous defaults first if bare input hits one of the 13 ambiguous names
    if (window.AMBIGUOUS_CITY_DEFAULTS[nk]) {
      const rule = window.AMBIGUOUS_CITY_DEFAULTS[nk];
      const defStop = idx.stopsByPrefNorm.get(`${rule.defaultPref}|${nk}`);
      if (defStop) return [defStop];
    }
    if (jaNoShi === "府中" || jaNoShi === "伊達") {
      const defId = jaNoShi === "府中" ? "tokyo" : "hokkaido";
      const defStop = idx.stopsByPrefNorm.get(`${defId}|${jaNoShi}`);
      if (defStop) return [defStop];
    }
    if (nk === "mt huzi" || nk === "mount huzi" || nk === "huzi" || jaNoShi === "富士山") {
      const kawa = idx.stopById.get("kawaguchiko");
      if (kawa) return [kawa];
    }

    const directCandidates =
      idx.stopsByAsciiBase.get(nk) ||
      idx.stopsByAsciiBase.get(trimmed.toLowerCase()) ||
      idx.stopsByAsciiBase.get(jaNoShi) ||
      null;
    if (directCandidates && directCandidates.length > 0) {
      return [directCandidates[0]];
    }

    // 3) Fall back to curated gazetteer substring matching (e.g. "Tokyo & Kawaguchiko", "Tsuwano & Shimane")
    if (typeof window.findMatchingGazetteerStops === "function") {
      const gazHits = window.findMatchingGazetteerStops(trimmed);
      if (gazHits.length > 0) return gazHits;
    }

    // 4) Last check: single-token or multi-token scan across all 792 Shi when wrapped in short region phrase
    for (const s of idx.allSearchEntries) {
      if (s.isPrefFallback) continue;
      if (s.rawNameJa && s.rawNameJa.endsWith("市") && trimmed.includes(s.rawNameJa)) {
        return [s];
      }
    }
    return [];
  };

  window.searchAllJapanPlaces = function(query, limit) {
    const idx = ensureIndex();
    const maxItems = Math.max(1, limit || 24);
    const qRaw = String(query || "").trim();
    if (!qRaw) {
      // Return popular cities + major prefectures preview
      return idx.allSearchEntries.slice(0, maxItems);
    }

    const qLower = qRaw.toLowerCase();
    const qNorm = normStr(qRaw.replace(/\s+(city|shi|pref|prefecture)$/i, ""));
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
