// Google-Maps-Styled Interactive Japan Route Map, Full All-792-Shi MLIT Boundaries, LOD Progressive Zoom & Place Card

(function() {
  let _locCache = { sig: "", result: null };
  let _lastDynamicMuniSig = "";

  window.findMatchingGazetteerStops = function(rawText) {
    const prep = typeof window.prepareGazetteerText === "function"
      ? window.prepareGazetteerText(rawText)
      : { rawLower: String(rawText || "").toLowerCase().trim(), normText: String(rawText || "").toLowerCase().trim() };
    if (!prep.rawLower) return [];

    const matches = [];
    (window.JAPAN_GAZETTEER || []).forEach(g => {
      if (g.id === prep.rawLower || g.keys.some(k => window.gazetteerKeyMatches(prep, k))) {
        matches.push(g);
      }
    });

    const hasShinAomori = matches.some(m => m.id === "shin_aomori");
    const hasExplicitAomoriCity = /(?:hakkoda|tsutanuma|jogakura|nebuta|aomori city|aomori station|八甲田|蔦沼|城ヶ倉|ねぶた|青森市|青森駅)/i.test(prep.rawLower);
    const filteredAomori = (hasShinAomori && !hasExplicitAomoriCity)
      ? matches.filter(m => m.id !== "aomori_city")
      : matches;

    const specificPrefs = new Set(filteredAomori.filter(m => !m.isPrefFallback && m.prefId).map(m => m.prefId));
    return filteredAomori.filter(m => !m.isPrefFallback || !specificPrefs.has(m.prefId));
  };

  function getStopsForDayStrict(d) {
    const regText = String((d && d.region) || "").trim();
    const regStops = (regText && typeof window.resolveLocationInputStops === "function")
      ? window.resolveLocationInputStops(regText)
      : (regText ? window.findMatchingGazetteerStops(regText) : []);

    // If user explicitly edited region (e.g. changed Kawaguchiko -> Akiu), do NOT leak old routeJp/hotel stops from another prefecture!
    if (d && d._regionOverridden && regStops.length > 0) {
      return regStops;
    }

    const routeHotelText = `${(d && d.routeJp) || ""} ${(d && d.hotel) || ""}`;
    const routeStops = window.findMatchingGazetteerStops(routeHotelText);

    if (regStops.length > 0) {
      const regPrefs = new Set(regStops.map(s => s.prefId).filter(Boolean));
      const hasSpecificReg = regStops.some(s => !s.isPrefFallback);
      const routeMentionsRegPref = routeStops.some(s => s.prefId && regPrefs.has(s.prefId));
      // If routeJp has zero mention of region's prefecture (e.g. region="Akiu" (Miyagi) while old routeJp mentions "Kawaguchiko"), keep region stops only!
      if (hasSpecificReg && !routeMentionsRegPref) {
        return regStops;
      }
      const combined = regStops.slice();
      const seen = new Set(combined.map(s => s.id));
      routeStops.forEach(s => {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          combined.push(s);
        }
      });
      return combined;
    }

    if (routeStops.length > 0) return routeStops;
    return window.findMatchingGazetteerStops((d && d.routeEn) || "");
  }

  window.getMatchedJapanLocations = function() {
    const days = (window.curData && window.curData().days) || [];
    const customLocs = Array.isArray(state.customMapLocations) ? state.customMapLocations : [];
    const sig = [
      state.lang || "en",
      state.mapScopeMode || "schedule",
      customLocs.join("\x01"),
      days.map(d => `${d.day}\x01${d._regionOverridden ? "1" : "0"}\x01${d.region || ""}\x01${d.routeJp || ""}\x01${d.hotel || ""}\x01${d.routeEn || ""}`).join("\x02")
    ].join("\x03");

    if (_locCache.sig === sig && Array.isArray(_locCache.result)) {
      days.forEach((d, i) => {
        const meta = _locCache.dayFlags && _locCache.dayFlags[i];
        if (meta) {
          d._unrecognizedPlace = meta.unrec;
          d._unrecognizedRaw = meta.raw;
        }
      });
      return _locCache.result;
    }

    const matchedMap = new Map();
    const tokyoStop = (window.JAPAN_GAZETTEER || []).find(g => g.id === "tokyo") || {
      id: "tokyo", geoId: "tokyo", prefId: "tokyo", cityKey: "tokyo", nameEn: "Tokyo Central", nameJa: "東京", regionKey: "Tokyo", x: 611, y: 493
    };

    const addStop = (gItem) => {
      if (gItem && !matchedMap.has(gItem.id)) {
        matchedMap.set(gItem.id, Object.assign({}, gItem));
      }
    };

    if (customLocs.length > 0) {
      customLocs.forEach((raw, idx) => {
        const q = String(raw || "").trim();
        if (!q) return;
        const foundList = typeof window.resolveLocationInputStops === "function"
          ? window.resolveLocationInputStops(q)
          : window.findMatchingGazetteerStops(q);
        if (foundList.length > 0) {
          foundList.forEach(g => addStop(g));
        } else {
          const unrecId = "unrec_custom_" + idx;
          matchedMap.set(unrecId, {
            id: unrecId, prefId: "tokyo",
            nameEn: `❗ ${raw} → Tokyo (Not recognised in Japan)`,
            nameJa: `❗ ${raw} → 東京（日本の地名として未認識）`,
            rawInput: raw, unrecognized: true, regionKey: "Tokyo",
            x: tokyoStop.x, y: tokyoStop.y
          });
        }
      });
    }

    const dayFlags = [];
    if (!state.mapScopeMode || state.mapScopeMode === "schedule") {
      days.forEach((d, i) => {
        const dayMatches = getStopsForDayStrict(d);
        if (dayMatches.length > 0) {
          d._unrecognizedPlace = false;
          d._unrecognizedRaw = "";
          dayFlags[i] = { unrec: false, raw: "" };
          dayMatches.forEach(g => addStop(g));
        } else {
          const labelRaw = (d.region && d.region.trim()) ? d.region.trim() : (d.routeJp || `Day ${d.day}`);
          d._unrecognizedPlace = true;
          d._unrecognizedRaw = labelRaw;
          dayFlags[i] = { unrec: true, raw: labelRaw };
          const unrecDayId = "unrec_day_" + d.day;
          matchedMap.set(unrecDayId, {
            id: unrecDayId, prefId: "tokyo",
            nameEn: `❗ ${labelRaw} (D${d.day}) → Tokyo`,
            nameJa: `❗ ${labelRaw} (D${d.day}) → 東京`,
            rawInput: labelRaw, unrecognized: true, regionKey: "Tokyo",
            x: tokyoStop.x, y: tokyoStop.y
          });
        }
      });
    }

    if (matchedMap.size === 0) addStop(tokyoStop);
    const rawList = Array.from(matchedMap.values());
    const prefsWithSpecificCity = new Set(rawList.filter(s => !s.isPrefFallback && !s.unrecognized && s.prefId).map(s => s.prefId));
    const list = rawList.filter(s => !s.isPrefFallback || !prefsWithSpecificCity.has(s.prefId));

    _locCache = { sig, dayFlags, result: list };
    return list;
  };

  function isTokyoOnlySet(stops) {
    return stops.length > 0 && stops.every(s => s.x >= 575 && s.x <= 635 && s.y >= 468 && s.y <= 525);
  }

  function bboxToViewBox(bbox, padRatio, minSpan) {
    const [x0, y0, x1, y1] = bbox;
    const spanX = Math.max(x1 - x0, minSpan);
    const spanY = Math.max(y1 - y0, minSpan);
    const padX = Math.max(spanX * padRatio, 10);
    const padY = Math.max(spanY * padRatio, 10);
    return {
      vx: Math.max(20, Math.round(x0 - padX)),
      vy: Math.max(22, Math.round(y0 - padY)),
      vw: Math.min(915, Math.round(spanX + padX * 2)),
      vh: Math.min(950, Math.round(spanY + padY * 2))
    };
  }

  function computeDynamicViewBox(stops, activePrefId, selectedStop) {
    if (window._preserveLiveViewBox && window._liveMapViewBox) {
      const vb = window._liveMapViewBox;
      return Object.assign({}, vb, {
        modeLabelEn: selectedStop ? `Inspecting: ${selectedStop.nameEn}` : "Custom Map View",
        modeLabelJa: selectedStop ? `拡大表示：${selectedStop.nameJa}` : "カスタム表示"
      });
    }

    if (selectedStop && !activePrefId && !selectedStop.unrecognized) {
      const geoId = selectedStop.geoId || selectedStop.id;
      const cityGeo = !selectedStop.isPrefFallback && window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[geoId];
      const prefGeo = window.JAPAN_PREF_PATHS && window.JAPAN_PREF_PATHS[selectedStop.prefId];
      if (cityGeo && cityGeo.bbox) {
        const vb = bboxToViewBox(cityGeo.bbox, 0.9, 55);
        return Object.assign(vb, {
          modeLabelEn: `City Boundary: ${selectedStop.nameEn}`,
          modeLabelJa: `市区町村範囲：${selectedStop.nameJa}`
        });
      }
      if (prefGeo && prefGeo.bbox) {
        const vb = bboxToViewBox(prefGeo.bbox, 0.30, 80);
        const pref = window.getPrefectureById ? window.getPrefectureById(selectedStop.prefId) : null;
        return Object.assign(vb, {
          modeLabelEn: `Prefecture Boundary: ${pref ? pref.nameEn : selectedStop.prefId}`,
          modeLabelJa: `都道府県範囲：${pref ? pref.nameJa : selectedStop.prefId}`
        });
      }
    }

    if (activePrefId) {
      const prefGeo = window.JAPAN_PREF_PATHS && window.JAPAN_PREF_PATHS[activePrefId];
      const pref = window.getPrefectureById ? window.getPrefectureById(activePrefId) : null;
      if (prefGeo && prefGeo.bbox) {
        let [minX, minY, maxX, maxY] = prefGeo.bbox;
        (stops || []).forEach(s => {
          if (s.x < minX) minX = s.x;
          if (s.y < minY) minY = s.y;
          if (s.x > maxX) maxX = s.x;
          if (s.y > maxY) maxY = s.y;
        });
        const vb = bboxToViewBox([minX, minY, maxX, maxY], 0.22, 58);
        const cnt = (stops || []).length;
        return Object.assign(vb, {
          modeLabelEn: cnt > 0
            ? `Prefecture Zoom: ${pref ? pref.nameEn : activePrefId} (${cnt} ${cnt === 1 ? "stop" : "stops"})`
            : `Prefecture Zoom: ${pref ? pref.nameEn : activePrefId} (Explore)`,
          modeLabelJa: cnt > 0
            ? `都道府県拡大：${pref ? pref.nameJa : activePrefId}（${cnt}地点）`
            : `都道府県拡大：${pref ? pref.nameJa : activePrefId}`
        });
      }
    }

    if (state.manualMapZoom === "allJapan") {
      return { vx: 26, vy: 28, vw: 895, vh: 922, modeLabelEn: "Nationwide Japan (Hokkaido to Okinawa)", modeLabelJa: "日本全域（北海道〜沖縄）" };
    }
    if (state.manualMapZoom === "tokyoOnly") {
      return { vx: 572, vy: 472, vw: 62, vh: 52, modeLabelEn: "Greater Tokyo & Tokyo Bay", modeLabelJa: "東京・首都圏クローズアップ" };
    }
    if (state.manualMapZoom === "tokyoOkinawa") {
      return { vx: 30, vy: 452, vw: 615, vh: 500, modeLabelEn: "Tokyo to Okinawa & Yaeyama Corridor", modeLabelJa: "東京〜沖縄・八重山 広域レンジ" };
    }
    if (isTokyoOnlySet(stops)) {
      return { vx: 572, vy: 472, vw: 62, vh: 52, modeLabelEn: "Auto-Zoom: Greater Tokyo Only", modeLabelJa: "自動ズーム：東京・首都圏のみ" };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    stops.forEach(s => {
      if (s.x < minX) minX = s.x;
      if (s.x > maxX) maxX = s.x;
      if (s.y < minY) minY = s.y;
      if (s.y > maxY) maxY = s.y;
    });
    const box = bboxToViewBox([minX, minY, maxX, maxY], 0.28, 78);
    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    return Object.assign(box, {
      modeLabelEn: stops.length === 1
        ? `Auto-Zoom: ${firstStop.nameEn}`
        : `Auto-Fit (${stops.length} Stops): ${firstStop.nameEn} ↔ ${lastStop.nameEn}`,
      modeLabelJa: stops.length === 1
        ? `自動ズーム：${firstStop.nameJa}`
        : `自動フィット（${stops.length}拠点）：${firstStop.nameJa} ↔ ${lastStop.nameJa}`
    });
  }

  function layoutMapLabels(stops, box, rHub, fontSz, en) {
    const placed = [];
    stops.forEach(s => {
      const rObs = rHub * 1.15;
      placed.push({ x0: s.x - rObs, x1: s.x + rObs, y0: s.y - rObs, y1: s.y + rObs });
    });
    const charW = en ? fontSz * 0.56 : fontSz * 0.92;
    const labelH = fontSz * 1.25;
    const padX = fontSz * 0.65;
    const makeRect = (txVal, tyVal, anchorVal, estW) => {
      const x0 = anchorVal === "start" ? txVal : (txVal - estW);
      const x1 = anchorVal === "start" ? (txVal + estW) : txVal;
      return { x0: x0 - padX, x1: x1 + padX, y0: tyVal - labelH * 0.85, y1: tyVal + labelH * 0.3 };
    };
    const overlaps = (r) => placed.some(p => r.x0 < p.x1 && r.x1 > p.x0 && r.y0 < p.y1 && r.y1 > p.y0);

    return stops.map((s) => {
      const routeNum = (typeof s._routeIdx === "number" ? s._routeIdx : 0) + 1;
      const rawText = `${routeNum}. ${(en ? s.nameEn : s.nameJa) || ""}`;
      const estW = Math.max(fontSz * 3.5, rawText.length * charW + fontSz * 0.6);
      const rightX = s.x + rHub * 1.45;
      const leftX = s.x - rHub * 1.45;
      const preferRight = s.x < box.vx + box.vw * 0.54;
      let anchor = preferRight ? "start" : "end";
      let tx = anchor === "start" ? rightX : leftX;
      const baseTy = s.y + fontSz * 0.35 + (s.unrecognized ? fontSz * 1.15 : 0);

      if (anchor === "start" && tx + estW > box.vx + box.vw * 0.96) {
        anchor = "end";
        tx = leftX;
      } else if (anchor === "end" && tx - estW < box.vx + box.vw * 0.04) {
        anchor = "start";
        tx = rightX;
      }

      const dyStep = fontSz * 1.28;
      const minY = box.vy + fontSz * 1.25;
      const maxY = box.vy + box.vh - fontSz * 0.55;
      let bestCandidate = { anchor, tx, ty: Math.max(minY, Math.min(maxY, baseTy)) };
      let foundClean = false;

      const sideOrder = anchor === "start"
        ? [{ a: "start", x: rightX }, { a: "end", x: leftX }]
        : [{ a: "end", x: leftX }, { a: "start", x: rightX }];

      for (let ring = 0; ring <= 8 && !foundClean; ring++) {
        const offsets = ring === 0 ? [0] : [ring, -ring];
        for (const off of offsets) {
          if (foundClean) break;
          const tryY = Math.max(minY, Math.min(maxY, baseTy + off * dyStep));
          for (const side of sideOrder) {
            if (side.a === "start" && side.x + estW > box.vx + box.vw * 0.98) continue;
            if (side.a === "end" && side.x - estW < box.vx + box.vw * 0.02) continue;
            const rect = makeRect(side.x, tryY, side.a, estW);
            if (!overlaps(rect)) {
              bestCandidate = { anchor: side.a, tx: side.x, ty: tryY };
              placed.push(rect);
              foundClean = true;
              break;
            }
          }
        }
      }
      if (!foundClean) placed.push(makeRect(bestCandidate.tx, bestCandidate.ty, bestCandidate.anchor, estW));
      return bestCandidate;
    });
  }

  // Progressive Level-of-Detail (LOD) Cities Layer: zooms into a prefecture or deeper viewBox reveals all MLIT cities (市) cleanly!
  window.buildDynamicCityLayerContent = function(box, en) {
    if (!box || box.vw >= 260) return { html: "", sig: "none" };
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const citiesByPref = window.JAPAN_CITIES_BY_PREF || {};
    const xMin = box.vx - box.vw * 0.1;
    const xMax = box.vx + box.vw * 1.1;
    const yMin = box.vy - box.vh * 0.1;
    const yMax = box.vy + box.vh * 1.1;

    const visPrefs = [];
    Object.keys(prefPaths).forEach(pId => {
      const b = prefPaths[pId].bbox;
      if (b && b[2] >= xMin && b[0] <= xMax && b[3] >= yMin && b[1] <= yMax) {
        visPrefs.push(pId);
      }
    });
    if (visPrefs.length === 0) return { html: "", sig: "empty" };

    const lodTier = box.vw < 72 ? 3 : (box.vw < 135 ? 2 : 1);
    const sig = `${visPrefs.sort().join(",")}|${lodTier}|${en ? "en" : "ja"}`;

    const polyStroke = Math.max(0.18, Math.min(0.65, box.vw / 240)).toFixed(2);
    const lblSizeNum = Math.max(1.15, Math.min(4.2, box.vw / 42));
    const lblSize = lblSizeNum.toFixed(2);
    const lblStroke = (lblSizeNum * 0.30).toFixed(2);

    const polys = [];
    const labelCandidates = [];
    const seenIds = new Set();

    visPrefs.forEach(pId => {
      const list = citiesByPref[pId] || [];
      list.forEach((city, idx) => {
        const gId = city.geoId || city.id;
        if (!gId || seenIds.has(gId)) return;
        const geo = window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[gId];
        if (!geo || !geo.d || !geo.bbox) return;
        const b = geo.bbox;
        if (b[2] < xMin || b[0] > xMax || b[3] < yMin || b[1] > yMax) return;
        seenIds.add(gId);

        const safeGeoId = window.escapeAttr(gId);
        const safePrefId = window.escapeAttr(pId);
        polys.push(`<path class="gmaps-muni-poly" data-geo-id="${safeGeoId}" data-pref-id="${safePrefId}" d="${geo.d}" stroke-width="${polyStroke}" stroke-linejoin="round" onclick="selectMapCityGeo(this.dataset.geoId)"/>`);

        const cx = geo.cx;
        const cy = geo.cy;
        if (cx >= box.vx && cx <= box.vx + box.vw && cy >= box.vy && cy <= box.vy + box.vh) {
          const areaEst = Math.max(0.1, (b[2] - b[0]) * (b[3] - b[1]));
          const isCurated = !city.isShi;
          const isCapitalOrMajor = idx < 5;
          if (lodTier >= 2 || isCurated || isCapitalOrMajor || areaEst > (box.vw * box.vw) / 280) {
            labelCandidates.push({
              gId,
              name: en ? (city.rawNameEn || city.nameEn) : (city.rawNameJa || city.nameJa),
              cx,
              cy,
              prio: (isCurated ? 1000 : 0) + (isCapitalOrMajor ? 200 : 0) + areaEst
            });
          }
        }
      });
    });

    // Greedy collision cull for crisp readable labels at any zoom depth
    labelCandidates.sort((a, b) => b.prio - a.prio);
    const maxLabels = lodTier === 3 ? 65 : (lodTier === 2 ? 36 : 16);
    const minDistX = lblSizeNum * (lodTier === 3 ? 5.2 : 6.8);
    const minDistY = lblSizeNum * 1.45;
    const accepted = [];
    const labelsHtml = [];

    for (let i = 0; i < labelCandidates.length && accepted.length < maxLabels; i++) {
      const c = labelCandidates[i];
      const clash = accepted.some(a => Math.abs(a.cx - c.cx) < minDistX && Math.abs(a.cy - c.cy) < minDistY);
      if (clash) continue;
      accepted.push(c);
      labelsHtml.push(`<text class="gmaps-muni-label" x="${c.cx}" y="${c.cy}" text-anchor="middle" font-size="${lblSize}" style="stroke-width:${lblStroke}px;">${window.escapeHtml(c.name)}</text>`);
    }

    return {
      html: polys.join("") + labelsHtml.join(""),
      sig
    };
  };

  window.updateDynamicCityLayerForViewBox = function(svgEl) {
    if (!svgEl) return;
    const layer = svgEl.querySelector ? svgEl.querySelector("#gmapsDynamicMuniLayer") : null;
    if (!layer) return;
    const raw = svgEl.getAttribute("viewBox") || "";
    const parts = raw.trim().split(/\s+/).map(Number);
    if (parts.length !== 4 || parts.some(n => isNaN(n))) return;
    const box = { vx: parts[0], vy: parts[1], vw: parts[2], vh: parts[3] };
    const en = window.isEn();
    const res = window.buildDynamicCityLayerContent(box, en);
    if (res.sig !== _lastDynamicMuniSig) {
      _lastDynamicMuniSig = res.sig;
      layer.innerHTML = res.html;
    }
  };

  function findDaysMatchingStop(stop) {
    const days = (window.curData && window.curData().days) || [];
    if (!stop) return [];
    if (String(stop.id || "").startsWith("unrec_day_")) {
      const n = parseInt(String(stop.id).replace("unrec_day_", ""), 10);
      return days.filter(d => d.day === n);
    }
    return days.filter(d => getStopsForDayStrict(d).some(m => m.id === stop.id));
  }

  window.focusMapPrefecture = function(prefId) {
    const en = window.isEn();
    window._preserveLiveViewBox = false;
    window._liveMapViewBox = null;
    state.mapPopupDismissed = false;
    state.focusedPrefId = prefId || null;
    state.selectedMapStopId = null;
    state.manualMapZoom = null;
    if (prefId && window.getPrefectureById) {
      const pref = window.getPrefectureById(prefId);
      if (pref) window.showToast(en ? `🗾 Zoomed to ${pref.nameEn} Prefecture` : `🗾 ${pref.nameJa}を拡大表示しました`);
    }
    window.saveState();
    window.renderActiveViews();
  };

  window.selectMapLocationPin = function(locId, regionKey) {
    if (state.selectedMapStopId === locId && !state.mapPopupDismissed) {
      window.jumpToLocationFilter(locId, regionKey);
      return;
    }
    window._preserveLiveViewBox = false;
    window._liveMapViewBox = null;
    state.mapPopupDismissed = false;
    state.selectedMapStopId = locId;
    state.focusedPrefId = null;
    state.manualMapZoom = null;
    window.saveState();
    window.renderActiveViews();
  };

  window.selectMapCityGeo = function(geoId) {
    if (!geoId) return;
    // Keep user's current zoomed viewBox if we're already zoomed closely onto this prefecture
    const svg = typeof document !== "undefined" ? document.getElementById("dynamicJapanMapSvg") : null;
    const rawVb = svg && svg.getAttribute("viewBox");
    if (rawVb) {
      const parts = rawVb.trim().split(/\s+/).map(Number);
      if (parts.length === 4 && parts[2] < 240) {
        window._liveMapViewBox = { vx: parts[0], vy: parts[1], vw: parts[2], vh: parts[3] };
        window._preserveLiveViewBox = true;
      } else {
        window._preserveLiveViewBox = false;
        window._liveMapViewBox = null;
      }
    }
    state.mapPopupDismissed = false;
    state.focusedPrefId = null;
    state.selectedMapStopId = geoId;
    window.saveState();
    window.renderActiveViews();
  };

  window.dismissMapPlaceCard = function() {
    state.mapPopupDismissed = true;
    const card = typeof document !== "undefined" ? document.getElementById("gmapsPlaceCard") : null;
    if (card && card.parentNode) card.parentNode.removeChild(card);
    window.saveState();
  };

  window.clearMapBoundarySelection = function() {
    window._preserveLiveViewBox = false;
    window._liveMapViewBox = null;
    state.mapPopupDismissed = false;
    state.selectedMapStopId = null;
    state.focusedPrefId = null;
    window.saveState();
    window.renderActiveViews();
  };

  window.quickAddPlaceFromMap = function(placeLabel) {
    const label = String(placeLabel || "").trim();
    if (!label || typeof window.appendDayFromMapStop !== "function") return;
    window._preserveLiveViewBox = false;
    window._liveMapViewBox = null;
    state.mapPopupDismissed = false;
    const added = window.appendDayFromMapStop(label);
    state.mapScopeMode = "schedule";
    state.customMapLocations = [];
    state.manualMapZoom = null;
    if (added && added.stop && !added.stop.isPrefFallback) {
      state.focusedPrefId = null;
      state.selectedMapStopId = added.stop.id;
    } else if (added && added.stop && added.stop.prefId) {
      state.focusedPrefId = added.stop.prefId;
      state.selectedMapStopId = null;
    }
    window.saveState();
    window.renderActiveViews();
    const en = window.isEn();
    window.showToast(en
      ? `📍 Added "${added ? added.regionEn : label}" as Day ${added ? added.day : "?"} • 🏨 ${added ? added.hotelName : ""}`
      : `📍 Day ${added ? added.day : "?"}に「${added ? added.regionJa : label}」を追加しました • 🏨 ${added ? added.hotelName : ""}`);
  };

  function buildBoundaryHighlightSvg(activePrefId, selectedStop, scale) {
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const cityPaths = window.JAPAN_CITY_PATHS || {};
    const strokeW = Math.max(0.35, Math.min(2.6, 1.85 * scale)).toFixed(2);
    const prefStrokeW = Math.max(0.45, Math.min(2.8, 2.0 * scale)).toFixed(2);

    if (activePrefId && prefPaths[activePrefId]) {
      return `<path class="gmaps-highlight-boundary" data-highlight-scope="prefecture" data-pref-id="${window.escapeAttr(activePrefId)}" d="${prefPaths[activePrefId].d}" fill="rgba(234,67,53,0.14)" stroke="#EA4335" stroke-width="${prefStrokeW}" stroke-linejoin="round"/>`;
    }
    if (selectedStop && !selectedStop.unrecognized) {
      const gId = selectedStop.geoId || selectedStop.id;
      const cityGeo = !selectedStop.isPrefFallback && cityPaths[gId];
      if (cityGeo && cityGeo.d) {
        return `<path class="gmaps-highlight-boundary" data-highlight-scope="city" data-city-id="${window.escapeAttr(gId)}" d="${cityGeo.d}" fill="rgba(234,67,53,0.22)" stroke="#EA4335" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
      }
      const fallbackPref = selectedStop.prefId && prefPaths[selectedStop.prefId];
      if (fallbackPref && fallbackPref.d) {
        return `<path class="gmaps-highlight-boundary" data-highlight-scope="prefecture" data-pref-id="${window.escapeAttr(selectedStop.prefId)}" d="${fallbackPref.d}" fill="rgba(234,67,53,0.16)" stroke="#EA4335" stroke-width="${prefStrokeW}" stroke-linejoin="round"/>`;
      }
    }
    return "";
  }

  function buildFloatingPlaceCardHtml(activePrefId, selectedStop, stops, en) {
    if (state.mapPopupDismissed || (!activePrefId && !selectedStop)) return "";
    const getIcon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon : () => "📍";

    if (activePrefId) {
      const pref = window.getPrefectureById ? window.getPrefectureById(activePrefId) : null;
      if (!pref) return "";
      const prefStops = stops.filter(s => !s.unrecognized && s.prefId === activePrefId);
      const defH = typeof window.resolveDefaultHotelForLocation === "function"
        ? window.resolveDefaultHotelForLocation(pref.nameEn)
        : null;
      const pIcon = getIcon(activePrefId);
      const hasPlanned = prefStops.length > 0;
      const cityCount = ((window.JAPAN_CITIES_BY_PREF && window.JAPAN_CITIES_BY_PREF[activePrefId]) || []).length;

      return `
        <div class="gmaps-place-card" id="gmapsPlaceCard">
          <div class="gmaps-place-card-top">
            <div>
              <div class="gmaps-place-scope">${pIcon} ${hasPlanned
                ? (en ? "Prefecture Highlight (Google Maps Style)" : "都道府県エリア選択")
                : (en ? "Prefecture Highlight (Unplanned — Explore)" : "未訪問の都道府県ハイライト")}</div>
              <h4 class="gmaps-place-title">${pIcon} ${window.escapeHtml(en ? `${pref.nameEn} Prefecture` : pref.nameJa)}</h4>
            </div>
            <button type="button" class="gmaps-card-close" onclick="dismissMapPlaceCard()" aria-label="Close">×</button>
          </div>
          <div class="gmaps-place-meta">${hasPlanned
            ? `${en ? `${prefStops.length} planned stop(s): ` : `予定スポット（${prefStops.length}件）：`}${window.escapeHtml(prefStops.map(s => en ? s.nameEn : s.nameJa).join(" • "))}`
            : (en
              ? `No stops planned yet (${cityCount} cities/areas inside — click + zoom or any city boundary)`
              : `まだ日程にありません（${cityCount}市区町村をズームで表示・選択可能）`)}</div>
          ${defH ? `<div class="gmaps-place-hotel">🏨 ${en ? "3–4★ Default:" : "標準3〜4★ホテル:"} ${window.escapeHtml(en ? defH.nameEn : defH.nameJa)}</div>` : ""}
          <div class="gmaps-place-actions">
            ${hasPlanned
              ? `<button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" onclick="jumpToRegionSchedule('PREF:${window.escapeAttr(activePrefId)}')">📅 ${en ? "Filter Prefecture in Schedule" : "日程表で絞込"} →</button>`
              : `<button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" data-place="${window.escapeAttr(en ? pref.nameEn : pref.nameJa)}" onclick="quickAddPlaceFromMap(this.dataset.place)">${en ? `+ Add ${pref.nameEn} Day` : `+ ${pref.nameJa}を追加`}</button>`}
          </div>
        </div>
      `;
    }

    const gId = selectedStop.geoId || selectedStop.id;
    const isCityScope = !selectedStop.unrecognized && !selectedStop.isPrefFallback && !!(window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[gId]);
    const pref = selectedStop.prefId && window.getPrefectureById ? window.getPrefectureById(selectedStop.prefId) : null;
    const matchedDays = findDaysMatchingStop(selectedStop);
    const hasDays = matchedDays.length > 0;
    const dayStr = hasDays
      ? matchedDays.map(d => `D${d.day}`).join(", ")
      : (en ? "Not yet in schedule" : "日程未追加（マップ選択）");
    const defH = typeof window.resolveDefaultHotelForLocation === "function"
      ? window.resolveDefaultHotelForLocation(selectedStop.nameEn)
      : null;
    const dayHotel = (matchedDays[0] && matchedDays[0].hotel) || (defH ? (en ? defH.nameEn : defH.nameJa) : "");
    const stopIcon = getIcon(selectedStop);

    const altStops = typeof window.getAmbiguousAlternativesForStop === "function"
      ? window.getAmbiguousAlternativesForStop(selectedStop)
      : [];
    const altHtml = altStops.length > 0 ? `
      <div style="font-size:10.5px;color:var(--ink-muted);margin-bottom:6px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
        <span>${en ? "Other pref:" : "同名都市:"}</span>
        ${altStops.map(alt => `<button type="button" class="btn" style="padding:1px 6px;font-size:10px;" data-geo-id="${window.escapeAttr(alt.id)}" onclick="selectMapCityGeo(this.dataset.geoId)">${window.escapeHtml(en ? alt.nameEn : alt.nameJa)}</button>`).join("")}
      </div>
    ` : "";

    const scopeLabel = selectedStop.unrecognized
      ? (en ? "❗ Unrecognised Location (Defaulted to Tokyo)" : "❗ 未認識地名（東京に設定）")
      : (isCityScope
        ? (en ? `📍 City Boundary Highlight (${pref ? pref.nameEn : ""})` : `📍 市区町村境界ハイライト（${pref ? pref.nameJa : ""}）`)
        : (en ? `🗾 Prefecture Fallback Highlight (${pref ? pref.nameEn : ""})` : `🗾 都道府県全体ハイライト（${pref ? pref.nameJa : ""}）`));

    return `
      <div class="gmaps-place-card" id="gmapsPlaceCard">
        <div class="gmaps-place-card-top">
          <div>
            <div class="gmaps-place-scope">${window.escapeHtml(scopeLabel)}</div>
            <h4 class="gmaps-place-title">${stopIcon} ${window.escapeHtml(en ? selectedStop.nameEn : selectedStop.nameJa)}</h4>
          </div>
          <button type="button" class="gmaps-card-close" onclick="dismissMapPlaceCard()" aria-label="Close">×</button>
        </div>
        <div class="gmaps-place-meta">${en ? `Scheduled: ${dayStr}` : `該当予定：${dayStr}`}</div>
        ${dayHotel ? `<div class="gmaps-place-hotel">🏨 ${window.escapeHtml(dayHotel)}</div>` : ""}
        ${altHtml}
        <div class="gmaps-place-actions">
          ${hasDays
            ? `<button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" data-loc-id="${window.escapeAttr(selectedStop.id)}" data-region="${window.escapeAttr(selectedStop.prefId ? `PREF:${selectedStop.prefId}` : "ALL")}" onclick="jumpToLocationFilter(this.dataset.locId, this.dataset.region)">📅 ${en ? "View in Schedule" : "日程カードへ移動"} →</button>`
            : `<button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" data-place="${window.escapeAttr(en ? selectedStop.nameEn : selectedStop.nameJa)}" onclick="quickAddPlaceFromMap(this.dataset.place)">${en ? `+ Add as Day ${(window.curData().days || []).length + 1}` : `+ 日程に追加`}</button>`}
        </div>
      </div>
    `;
  }

  window.buildInteractiveJapanMapHtml = function() {
    const en = window.isEn();
    const stops = window.getMatchedJapanLocations();
    stops.forEach((s, i) => { s._routeIdx = i; });

    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const prefGroups = new Map();
    stops.forEach(s => {
      if (s.unrecognized || !s.prefId) return;
      if (!prefGroups.has(s.prefId)) prefGroups.set(s.prefId, []);
      prefGroups.get(s.prefId).push(s);
    });

    // Support clicking ANY of the 47 prefectures (planned or unplanned!)
    const activePrefId = (state.focusedPrefId && prefPaths[state.focusedPrefId]) ? state.focusedPrefId : null;
    if (state.focusedPrefId && !activePrefId) state.focusedPrefId = null;

    let selectedStop = null;
    if (!activePrefId && state.selectedMapStopId) {
      selectedStop = stops.find(s => s.id === state.selectedMapStopId)
        || (typeof window.getCityStopByGeoId === "function" ? window.getCityStopByGeoId(state.selectedMapStopId) : null);
      if (!selectedStop) state.selectedMapStopId = null;
    }

    const focusedStops = activePrefId ? (prefGroups.get(activePrefId) || []) : stops;
    const box = computeDynamicViewBox(focusedStops, activePrefId, selectedStop);
    window._preserveLiveViewBox = false;
    const unrecStops = stops.filter(s => s.unrecognized);

    const scale = Math.max(0.05, box.vw / 380);
    const pinScale = Math.max(0.35, Math.min(3.8, 2.35 * scale));
    const rHub = Math.max(1.0, Math.min(8.5, 6.2 * scale));
    const fontSz = Math.max(1.5, Math.min(11.2, 8.8 * scale));
    const lineW = Math.max(0.45, Math.min(3.2, 2.3 * scale));
    const borderW = Math.max(0.18, Math.min(1.1, 0.55 * scale)).toFixed(2);

    const prefPathsSvg = Object.keys(prefPaths).map(pId => {
      const geo = prefPaths[pId];
      const hasStop = prefGroups.has(pId);
      const cls = `gmaps-pref${hasStop ? " has-stop" : ""}${activePrefId === pId ? " is-focused" : ""}`;
      return `<path class="${cls}" data-pref-id="${window.escapeAttr(pId)}" d="${geo.d}" stroke-width="${borderW}" stroke-linejoin="round" onclick="focusMapPrefecture(this.dataset.prefId)"/>`;
    }).join("");

    // Dynamic progressive City (市) LOD layer (rendered right above prefectures when zoomed in!)
    const muniLod = window.buildDynamicCityLayerContent(box, en);
    _lastDynamicMuniSig = muniLod.sig;

    const highlightSvg = buildBoundaryHighlightSvg(activePrefId, selectedStop, scale);

    let prefLabelsSvg = "";
    if (!activePrefId && !selectedStop) {
      prefGroups.forEach((pStops, pId) => {
        if (pStops.length < 2) return;
        const pref = window.getPrefectureById ? window.getPrefectureById(pId) : null;
        const pGeo = prefPaths[pId];
        if (!pref || !pGeo) return;
        const lblFs = Math.max(2.0, fontSz * 0.84).toFixed(2);
        prefLabelsSvg += `<text class="gmaps-pref-label" x="${pGeo.cx}" y="${pGeo.cy}" text-anchor="middle" font-size="${lblFs}" font-weight="800" data-pref-id="${window.escapeAttr(pId)}" onclick="focusMapPrefecture(this.dataset.prefId)" style="stroke-width:${(Number(lblFs) * 0.34).toFixed(2)}px;">${window.escapeHtml(en ? pref.nameEn : pref.nameJa)} (${pStops.length})</text>`;
      });
    }

    let pathsSvg = "";
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const isFocusedEdge = !activePrefId || (a.prefId === activePrefId && b.prefId === activePrefId);
      const edgeOpacity = isFocusedEdge ? "0.95" : "0.22";
      const casingW = (lineW * 1.85).toFixed(2);
      const innerW = lineW.toFixed(2);
      if (dist > 110 || a.regionKey === "Okinawa" || b.regionKey === "Okinawa" || a.regionKey === "Hokkaido" || b.regionKey === "Hokkaido") {
        const mx = (a.x + b.x) / 2 - (b.y - a.y) * 0.14;
        const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.10;
        const dArc = `M${a.x},${a.y} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x},${b.y}`;
        pathsSvg += `<path class="gmaps-route-casing" d="${dArc}" stroke-width="${casingW}" stroke-dasharray="${(lineW * 2.1).toFixed(1)},${(lineW * 1.4).toFixed(1)}" fill="none" opacity="${edgeOpacity}"/>`;
        pathsSvg += `<path class="gmaps-route-air" d="${dArc}" stroke-width="${innerW}" stroke-dasharray="${(lineW * 2.1).toFixed(1)},${(lineW * 1.4).toFixed(1)}" fill="none" opacity="${edgeOpacity}"/>`;
      } else {
        pathsSvg += `<line class="gmaps-route-casing" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-width="${casingW}" stroke-linecap="round" opacity="${edgeOpacity}"/>`;
        pathsSvg += `<line class="gmaps-route-line" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke-width="${innerW}" stroke-linecap="round" opacity="${edgeOpacity}"/>`;
      }
    }

    const labelTargetStops = activePrefId ? focusedStops : stops;
    const labelPositions = layoutMapLabels(labelTargetStops, box, rHub, fontSz, en);
    const labelPosByStopId = new Map();
    labelTargetStops.forEach((s, i) => labelPosByStopId.set(s.id, labelPositions[i]));

    const pinsSvg = stops.map(s => {
      const label = window.escapeHtml(en ? s.nameEn : s.nameJa);
      const pos = labelPosByStopId.get(s.id);
      const isDimmed = !!(activePrefId && s.prefId !== activePrefId);
      const isSel = selectedStop && selectedStop.id === s.id;
      const isEnd = s._routeIdx === 0 || s._routeIdx === stops.length - 1;
      const pinColor = s.unrecognized ? "#D93025" : (isSel || isEnd ? "#EA4335" : (s.isAir ? "#F9AB00" : "#1A73E8"));
      const curScale = (isSel ? pinScale * 1.28 : (isEnd ? pinScale * 1.12 : pinScale)).toFixed(2);
      const safeId = window.escapeAttr(s.id);
      const safeReg = window.escapeAttr(s.prefId ? `PREF:${s.prefId}` : (s.regionKey || "ALL"));
      const routeNum = (typeof s._routeIdx === "number" ? s._routeIdx : 0) + 1;
      return `
        <g class="map-node" style="${isDimmed ? "opacity:0.25;" : ""}" data-loc-id="${safeId}" data-region="${safeReg}" onclick="selectMapLocationPin(this.dataset.locId, this.dataset.region)">
          <g transform="translate(${s.x},${s.y}) scale(${curScale})">
            <path d="M0,-2.6 C-1.4,-2.6 -2.5,-1.5 -2.5,-0.15 C-2.5,1.45 0,3.2 0,3.2 C0,3.2 2.5,1.45 2.5,-0.15 C2.5,-1.5 1.4,-2.6 0,-2.6 Z" fill="${pinColor}" stroke="#FFFFFF" stroke-width="0.45"/>
            <circle cx="0" cy="-0.25" r="0.85" fill="#FFFFFF"/>
          </g>
          ${pos ? `<text class="gmaps-pin-label${isSel ? " is-selected" : ""}" x="${pos.tx.toFixed(1)}" y="${pos.ty.toFixed(1)}" text-anchor="${pos.anchor}" font-size="${fontSz.toFixed(2)}" font-weight="800" ${s.unrecognized ? 'fill="#D93025"' : ""} style="stroke-width:${(fontSz * 0.30).toFixed(2)}px;stroke-linejoin:round;">
            ${routeNum}. ${label}
          </text>` : ""}
        </g>
      `;
    }).join("");

    const prefEntries = Array.from(prefGroups.entries()).sort((a, b) => {
      const diff = (b[1].length > 1 ? 1 : 0) - (a[1].length > 1 ? 1 : 0);
      return diff !== 0 ? diff : b[1].length - a[1].length;
    });

    const mapPrefBarHtml = (prefEntries.length > 0 || activePrefId || selectedStop) ? `
      <div class="map-pref-zoom-bar" id="mapPrefZoomBar">
        <span class="map-pref-bar-label">${en ? "Prefecture Zoom:" : "都道府県ズーム:"}</span>
        ${(activePrefId || selectedStop) ? `<button type="button" class="btn map-pref-chip map-pref-back" onclick="clearMapBoundarySelection()">← ${en ? "Back to Full Route" : "全体ルートへ戻る"}</button>` : ""}
        ${prefEntries.map(([pId, pStops]) => {
          const pref = window.getPrefectureById ? window.getPrefectureById(pId) : null;
          if (!pref) return "";
          const isActive = activePrefId === pId;
          const cnt = pStops.length;
          return `<button type="button" class="pill map-pref-chip ${isActive ? "active" : ""}" data-pref-id="${window.escapeAttr(pId)}" onclick="focusMapPrefecture('${window.escapeAttr(pId)}')" title="${window.escapeAttr(en ? `Highlight & zoom to ${pref.nameEn}` : `${pref.nameJa}の境界を拡大表示`)}">📍 ${window.escapeHtml(en ? pref.nameEn : pref.nameJa)} (${cnt})${cnt >= 2 ? " 🔍" : ""}</button>`;
        }).join("")}
      </div>
    ` : "";

    const customTagsHtml = (state.customMapLocations || []).map((loc, idx) => {
      const q = String(loc || "").trim();
      const isKnown = (typeof window.resolveLocationInputStops === "function" ? window.resolveLocationInputStops(q) : window.findMatchingGazetteerStops(q)).length > 0;
      const safeLoc = window.escapeHtml(loc);
      return `
        <span class="map-tag-chip" style="${!isKnown ? "border-color:#EF4444;background:#FEF2F2;color:#B91C1C;" : ""}">
          ${isKnown ? `📍 ${safeLoc}` : (en ? `❗ ${safeLoc} (Not recognised → Tokyo)` : `❗ ${safeLoc}（未認識 → 東京）`)}
          <button type="button" onclick="removeCustomMapLocation(${idx})" title="Remove">×</button>
        </span>
      `;
    }).join("");

    const unrecBannerHtml = unrecStops.length > 0 ? `
      <div id="mapUnrecognizedBanner" style="background:#FEF2F2;border:1px solid #FCA5A5;color:#B91C1C;padding:9px 12px;border-radius:9px;font-size:12px;font-weight:700;margin-bottom:10px;">
        ❗ ${en
          ? `Unrecognised location(s): ${unrecStops.map(u => `"${window.escapeHtml(u.rawInput)}"`).join(", ")} — place not recognised in Japan, defaulted to Tokyo.`
          : `未認識の地名：${unrecStops.map(u => `「${window.escapeHtml(u.rawInput)}」`).join("、")} は日本国内の地名として認識されないため、東京に設定されました。`}
      </div>
    ` : "";

    const placeCardHtml = buildFloatingPlaceCardHtml(activePrefId, selectedStop, stops, en);

    return `
      <h2>
        <span>🗾 ${en ? "Interactive Japan Route Map" : "日本全国インタラクティブ・ルートマップ"}</span>
        <span class="pass-badge" style="font-size:11.5px;">${window.escapeHtml(en ? box.modeLabelEn : box.modeLabelJa)}</span>
      </h2>
      <p class="lead" style="margin-bottom:10px;">
        ${en
          ? "Click any prefecture or pin to zoom & highlight its real boundary (zoom further in to reveal all 792 Japanese cities); drag to pan & scroll to zoom."
          : "都道府県・ピンをクリックすると境界をハイライトして拡大（さらに拡大すると全792市が表示されます）。ドラッグ移動・ホイール拡大縮小・都市追加に対応。"}
      </p>

      <div class="map-control-bar">
        <input type="text" id="mapLocationInput" class="search-input" style="min-width:180px;flex:1;padding:6px 10px;font-size:12px;"
          placeholder="${window.escapeAttr(en ? "Add city/prefecture (e.g. Akiu, Fuchu, Achi Village, Shimane)..." : "日程に都市・県を追加（例：秋保、府中、阿智村、島根）...")}"
          onkeydown="if(event.key==='Enter'){addCustomMapLocation();}">
        <button type="button" class="btn btn-primary" style="padding:6px 10px;font-size:11.5px;" onclick="addCustomMapLocation()">
          ${en ? "+ Add Stop & Day" : "+ 地点＆日程追加"}
        </button>
        <button type="button" class="btn" style="padding:5px 8px;font-size:11px;" onclick="setMapQuickScope('tokyoOnly')">🗼 ${en ? "Tokyo" : "東京のみ"}</button>
        <button type="button" class="btn" style="padding:5px 8px;font-size:11px;" onclick="setMapQuickScope('tokyoOkinawa')">✈️ ${en ? "Tokyo↔Okinawa" : "東京↔沖縄"}</button>
        <button type="button" class="btn" style="padding:5px 8px;font-size:11px;" onclick="setMapQuickScope('goldenRoute')">🚄 ${en ? "Golden Route" : "ゴールデン"}</button>
        <button type="button" class="btn" style="padding:5px 8px;font-size:11px;" onclick="setMapQuickScope('allJapan')">🗾 ${en ? "All Japan" : "日本全域"}</button>
        <button type="button" class="btn" style="padding:5px 8px;font-size:11px;" onclick="setMapQuickScope('schedule')">🔄 ${en ? "Sync" : "連動"}</button>
      </div>

      ${mapPrefBarHtml}
      ${unrecBannerHtml}
      ${customTagsHtml ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">${customTagsHtml}</div>` : ""}

      <div class="route-svg-wrap gmaps-stage" id="gmapsStage">
        ${placeCardHtml}
        <svg id="dynamicJapanMapSvg" class="gmaps-svg" viewBox="${box.vx} ${box.vy} ${box.vw} ${box.vh}" data-init-viewbox="${box.vx} ${box.vy} ${box.vw} ${box.vh}" width="100%" height="460" preserveAspectRatio="xMidYMid meet" aria-label="Google Maps Style Japan Map">
          <g class="gmaps-pref-layer">${prefPathsSvg}</g>
          <g id="gmapsDynamicMuniLayer" class="gmaps-muni-layer">${muniLod.html}</g>
          <g class="gmaps-highlight-layer">${highlightSvg}</g>
          <g class="gmaps-pref-labels">${prefLabelsSvg}</g>
          <g class="gmaps-route-layer">${pathsSvg}</g>
          <g class="gmaps-pins-layer">${pinsSvg}</g>
        </svg>
        <div class="gmaps-zoom-controls" aria-label="Map Zoom Controls">
          <button type="button" class="gmaps-ctrl-btn" onclick="zoomInteractiveMap(0.68)" title="${en ? "Zoom in (reveals cities)" : "拡大（市区町村を表示）"}">+</button>
          <button type="button" class="gmaps-ctrl-btn" onclick="zoomInteractiveMap(1.42)" title="${en ? "Zoom out" : "縮小"}">−</button>
          <button type="button" class="gmaps-ctrl-btn" onclick="resetInteractiveMapView()" title="${en ? "Fit Route" : "全体表示に戻す"}">⌖</button>
        </div>
      </div>
    `;
  };

  window.jumpToLocationFilter = function(locId, regionKey) {
    window.switchTab("itinerary", null);
    const days = (window.curData().days) || [];
    const searchEl = document.getElementById("itinerarySearch");
    if (searchEl) searchEl.value = "";

    const g = (window.JAPAN_GAZETTEER || []).find(x => x.id === locId)
      || (typeof window.getCityStopByGeoId === "function" ? window.getCityStopByGeoId(locId) : null);
    let targetDayNum = null;
    state.activeRegionKey = "ALL";

    if (String(locId || "").startsWith("unrec_day_")) {
      const parsedDay = parseInt(String(locId).replace("unrec_day_", ""), 10);
      if (parsedDay > 0) targetDayNum = parsedDay;
    } else if (g) {
      const matchedDay = days.find(d => getStopsForDayStrict(d).some(m => m.id === g.id));
      if (matchedDay) {
        targetDayNum = matchedDay.day;
        if (g.prefId) state.activeRegionKey = `PREF:${g.prefId}`;
      }
    } else if (regionKey && regionKey !== "ALL" && String(regionKey).startsWith("PREF:")) {
      state.activeRegionKey = regionKey;
    }

    window.renderItineraryCards();
    if (targetDayNum) {
      const el = document.getElementById("day-card-" + targetDayNum);
      if (el && el.scrollIntoView) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    window.scrollTo({ top: 180, behavior: "smooth" });
  };
})();
