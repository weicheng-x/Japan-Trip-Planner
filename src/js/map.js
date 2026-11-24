// Google-Maps-Styled Interactive Japan Route Map, Real MLIT Boundaries & Place Card

(function() {
  let _locCache = { sig: "", result: null };

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

  window.getMatchedJapanLocations = function() {
    const days = (window.curData && window.curData().days) || [];
    const customLocs = Array.isArray(state.customMapLocations) ? state.customMapLocations : [];
    const sig = [
      state.lang || "en",
      state.mapScopeMode || "schedule",
      customLocs.join("\x01"),
      days.map(d => `${d.day}\x01${d.region || ""}\x01${d.routeJp || ""}\x01${d.hotel || ""}\x01${d.routeEn || ""}`).join("\x02")
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
      id: "tokyo", prefId: "tokyo", cityKey: "tokyo", nameEn: "Tokyo Central", nameJa: "東京", regionKey: "Tokyo", x: 611, y: 493
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
        const foundList = window.findMatchingGazetteerStops(q);
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
        const text = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""}`;
        const dayMatches = window.findMatchingGazetteerStops(text);
        if (dayMatches.length > 0) {
          d._unrecognizedPlace = false;
          d._unrecognizedRaw = "";
          dayFlags[i] = { unrec: false, raw: "" };
          dayMatches.forEach(g => addStop(g));
        } else {
          const fallbackMatches = window.findMatchingGazetteerStops(d.routeEn || "");
          if (fallbackMatches.length > 0) {
            d._unrecognizedPlace = false;
            d._unrecognizedRaw = "";
            dayFlags[i] = { unrec: false, raw: "" };
            fallbackMatches.forEach(g => addStop(g));
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
    const padX = Math.max(spanX * padRatio, 18);
    const padY = Math.max(spanY * padRatio, 18);
    return {
      vx: Math.max(20, Math.round(x0 - padX)),
      vy: Math.max(22, Math.round(y0 - padY)),
      vw: Math.min(915, Math.round(spanX + padX * 2)),
      vh: Math.min(950, Math.round(spanY + padY * 2))
    };
  }

  function computeDynamicViewBox(stops, focusedPrefId, selectedStop) {
    if (selectedStop && !focusedPrefId && !selectedStop.unrecognized) {
      const cityGeo = !selectedStop.isPrefFallback && window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[selectedStop.id];
      const prefGeo = window.JAPAN_PREF_PATHS && window.JAPAN_PREF_PATHS[selectedStop.prefId];
      if (cityGeo && cityGeo.bbox) {
        const vb = bboxToViewBox(cityGeo.bbox, 0.85, 72);
        return Object.assign(vb, {
          modeLabelEn: `City Boundary: ${selectedStop.nameEn}`,
          modeLabelJa: `市区町村範囲：${selectedStop.nameJa}`
        });
      }
      if (prefGeo && prefGeo.bbox) {
        const vb = bboxToViewBox(prefGeo.bbox, 0.35, 95);
        const pref = window.getPrefectureById ? window.getPrefectureById(selectedStop.prefId) : null;
        return Object.assign(vb, {
          modeLabelEn: `Prefecture Boundary: ${pref ? pref.nameEn : selectedStop.prefId}`,
          modeLabelJa: `都道府県範囲：${pref ? pref.nameJa : selectedStop.prefId}`
        });
      }
    }

    if (focusedPrefId) {
      const prefGeo = window.JAPAN_PREF_PATHS && window.JAPAN_PREF_PATHS[focusedPrefId];
      const pref = window.getPrefectureById ? window.getPrefectureById(focusedPrefId) : null;
      let minX = prefGeo ? prefGeo.bbox[0] : Infinity;
      let minY = prefGeo ? prefGeo.bbox[1] : Infinity;
      let maxX = prefGeo ? prefGeo.bbox[2] : -Infinity;
      let maxY = prefGeo ? prefGeo.bbox[3] : -Infinity;
      (stops || []).forEach(s => {
        if (s.x < minX) minX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.x > maxX) maxX = s.x;
        if (s.y > maxY) maxY = s.y;
      });
      if (isFinite(minX)) {
        const vb = bboxToViewBox([minX, minY, maxX, maxY], 0.28, 72);
        const cnt = (stops || []).length;
        return Object.assign(vb, {
          modeLabelEn: `Prefecture Zoom: ${pref ? pref.nameEn : focusedPrefId} (${cnt} ${cnt === 1 ? "stop" : "stops"})`,
          modeLabelJa: `都道府県拡大：${pref ? pref.nameJa : focusedPrefId}（${cnt}地点）`
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
    const vb = bboxToViewBox([minX, minY, maxX, maxY], 0.28, 78);
    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    return Object.assign(vb, {
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

  function findDaysMatchingStop(stop) {
    const days = (window.curData && window.curData().days) || [];
    if (!stop) return [];
    if (String(stop.id || "").startsWith("unrec_day_")) {
      const n = parseInt(String(stop.id).replace("unrec_day_", ""), 10);
      return days.filter(d => d.day === n);
    }
    return days.filter(d => {
      const text = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""} ${d.routeEn || ""}`;
      const prep = typeof window.prepareGazetteerText === "function"
        ? window.prepareGazetteerText(text)
        : { rawLower: text.toLowerCase(), normText: text.toLowerCase() };
      return Array.isArray(stop.keys) && stop.keys.some(k => window.gazetteerKeyMatches(prep, k));
    });
  }

  window.focusMapPrefecture = function(prefId) {
    const en = window.isEn();
    state.focusedPrefId = prefId || null;
    state.selectedMapStopId = null;
    state.manualMapZoom = null;
    if (prefId && window.getPrefectureById) {
      const pref = window.getPrefectureById(prefId);
      if (pref) window.showToast(en ? `🗾 Highlighting ${pref.nameEn} Prefecture` : `🗾 ${pref.nameJa}の境界をハイライト・拡大しました`);
    }
    window.saveState();
    window.renderActiveViews();
  };

  window.selectMapLocationPin = function(locId, regionKey) {
    if (state.selectedMapStopId === locId) {
      window.jumpToLocationFilter(locId, regionKey);
      return;
    }
    state.selectedMapStopId = locId;
    state.focusedPrefId = null;
    state.manualMapZoom = null;
    window.saveState();
    window.renderActiveViews();
  };

  window.clearMapBoundarySelection = function() {
    state.selectedMapStopId = null;
    state.focusedPrefId = null;
    window.saveState();
    window.renderActiveViews();
  };

  function buildBoundaryHighlightSvg(activePrefId, selectedStop, scale, en) {
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const cityPaths = window.JAPAN_CITY_PATHS || {};
    const strokeW = Math.max(0.45, Math.min(2.6, 1.85 * scale)).toFixed(2);
    const prefStrokeW = Math.max(0.5, Math.min(2.8, 2.0 * scale)).toFixed(2);

    if (activePrefId && prefPaths[activePrefId]) {
      return `<path class="gmaps-highlight-boundary" data-highlight-scope="prefecture" data-pref-id="${window.escapeAttr(activePrefId)}" d="${prefPaths[activePrefId].d}" fill="rgba(234,67,53,0.14)" stroke="#EA4335" stroke-width="${prefStrokeW}" stroke-linejoin="round"/>`;
    }
    if (selectedStop && !selectedStop.unrecognized) {
      const cityGeo = !selectedStop.isPrefFallback && cityPaths[selectedStop.id];
      if (cityGeo && cityGeo.d) {
        return `<path class="gmaps-highlight-boundary" data-highlight-scope="city" data-city-id="${window.escapeAttr(selectedStop.id)}" d="${cityGeo.d}" fill="rgba(234,67,53,0.20)" stroke="#EA4335" stroke-width="${strokeW}" stroke-linejoin="round"/>`;
      }
      const fallbackPref = selectedStop.prefId && prefPaths[selectedStop.prefId];
      if (fallbackPref && fallbackPref.d) {
        return `<path class="gmaps-highlight-boundary" data-highlight-scope="prefecture" data-pref-id="${window.escapeAttr(selectedStop.prefId)}" d="${fallbackPref.d}" fill="rgba(234,67,53,0.16)" stroke="#EA4335" stroke-width="${prefStrokeW}" stroke-linejoin="round"/>`;
      }
    }
    void en;
    return "";
  }

  function buildFloatingPlaceCardHtml(activePrefId, selectedStop, stops, en) {
    if (!activePrefId && !selectedStop) return "";
    if (activePrefId) {
      const pref = window.getPrefectureById ? window.getPrefectureById(activePrefId) : null;
      if (!pref) return "";
      const prefStops = stops.filter(s => !s.unrecognized && s.prefId === activePrefId);
      const defH = typeof window.resolveDefaultHotelForLocation === "function"
        ? window.resolveDefaultHotelForLocation(pref.nameEn)
        : null;
      return `
        <div class="gmaps-place-card" id="gmapsPlaceCard">
          <div class="gmaps-place-card-top">
            <div>
              <div class="gmaps-place-scope">🗾 ${en ? "Prefecture Highlight (Google Maps Style)" : "都道府県エリア選択"}</div>
              <h4 class="gmaps-place-title">${window.escapeHtml(en ? `${pref.nameEn} Prefecture` : pref.nameJa)}</h4>
            </div>
            <button type="button" class="gmaps-card-close" onclick="clearMapBoundarySelection()" aria-label="Close">×</button>
          </div>
          <div class="gmaps-place-meta">${en ? `${prefStops.length} planned stop(s): ` : `予定スポット（${prefStops.length}件）：`}${window.escapeHtml(prefStops.map(s => en ? s.nameEn : s.nameJa).join(" • "))}</div>
          ${defH ? `<div class="gmaps-place-hotel">🏨 ${en ? "3–4★ Default:" : "標準3〜4★ホテル:"} ${window.escapeHtml(en ? defH.nameEn : defH.nameJa)}</div>` : ""}
          <div class="gmaps-place-actions">
            <button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" onclick="jumpToRegionSchedule('PREF:${window.escapeAttr(activePrefId)}')">📅 ${en ? "Filter Prefecture in Schedule" : "日程表で絞込"} →</button>
          </div>
        </div>
      `;
    }

    const isCityScope = !selectedStop.unrecognized && !selectedStop.isPrefFallback && !!(window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[selectedStop.id]);
    const pref = selectedStop.prefId && window.getPrefectureById ? window.getPrefectureById(selectedStop.prefId) : null;
    const matchedDays = findDaysMatchingStop(selectedStop);
    const dayStr = matchedDays.length > 0
      ? matchedDays.map(d => `D${d.day}`).join(", ")
      : (en ? "Map pin only" : "マップ選択");
    const dayHotel = matchedDays[0] && matchedDays[0].hotel
      ? matchedDays[0].hotel
      : (typeof window.resolveDefaultHotelForLocation === "function" ? (en ? window.resolveDefaultHotelForLocation(selectedStop.nameEn).nameEn : window.resolveDefaultHotelForLocation(selectedStop.nameJa).nameJa) : "");

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
            <h4 class="gmaps-place-title">${window.escapeHtml(en ? selectedStop.nameEn : selectedStop.nameJa)}</h4>
          </div>
          <button type="button" class="gmaps-card-close" onclick="clearMapBoundarySelection()" aria-label="Close">×</button>
        </div>
        <div class="gmaps-place-meta">${en ? `Scheduled: ${dayStr}` : `該当予定：${dayStr}`}</div>
        ${dayHotel ? `<div class="gmaps-place-hotel">🏨 ${window.escapeHtml(dayHotel)}</div>` : ""}
        <div class="gmaps-place-actions">
          <button type="button" class="btn btn-primary" style="font-size:11px;padding:4px 9px;" data-loc-id="${window.escapeAttr(selectedStop.id)}" data-region="${window.escapeAttr(selectedStop.prefId ? `PREF:${selectedStop.prefId}` : "ALL")}" onclick="jumpToLocationFilter(this.dataset.locId, this.dataset.region)">📅 ${en ? "View in Schedule" : "日程カードへ移動"} →</button>
        </div>
      </div>
    `;
  }

  window.buildInteractiveJapanMapHtml = function() {
    const en = window.isEn();
    const stops = window.getMatchedJapanLocations();
    stops.forEach((s, i) => { s._routeIdx = i; });

    const prefGroups = new Map();
    stops.forEach(s => {
      if (s.unrecognized || !s.prefId) return;
      if (!prefGroups.has(s.prefId)) prefGroups.set(s.prefId, []);
      prefGroups.get(s.prefId).push(s);
    });

    const activePrefId = (state.focusedPrefId && prefGroups.has(state.focusedPrefId)) ? state.focusedPrefId : null;
    if (state.focusedPrefId && !activePrefId) state.focusedPrefId = null;

    const selectedStop = (!activePrefId && state.selectedMapStopId)
      ? (stops.find(s => s.id === state.selectedMapStopId) || null)
      : null;
    if (state.selectedMapStopId && !selectedStop && !activePrefId) state.selectedMapStopId = null;

    const focusedStops = activePrefId ? prefGroups.get(activePrefId) : stops;
    const box = computeDynamicViewBox(focusedStops, activePrefId, selectedStop);
    const unrecStops = stops.filter(s => s.unrecognized);

    const scale = Math.max(0.08, box.vw / 380);
    const pinScale = Math.max(0.55, Math.min(3.8, 2.35 * scale));
    const rHub = Math.max(1.4, Math.min(8.5, 6.2 * scale));
    const fontSz = Math.max(2.0, Math.min(11.2, 8.8 * scale));
    const lineW = Math.max(0.6, Math.min(3.2, 2.3 * scale));
    const borderW = Math.max(0.22, Math.min(1.1, 0.55 * scale)).toFixed(2);

    // Real 47-prefecture base layer (Google Maps terrain/border styling)
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const prefPathsSvg = Object.keys(prefPaths).map(pId => {
      const geo = prefPaths[pId];
      const hasStop = prefGroups.has(pId);
      const cls = `gmaps-pref${hasStop ? " has-stop" : ""}${activePrefId === pId ? " is-focused" : ""}`;
      return `<path class="${cls}" data-pref-id="${window.escapeAttr(pId)}" d="${geo.d}" stroke-width="${borderW}" stroke-linejoin="round" onclick="focusMapPrefecture(this.dataset.prefId)"/>`;
    }).join("");

    // Boundary highlight overlay (selected city OR fallback prefecture)
    const highlightSvg = buildBoundaryHighlightSvg(activePrefId, selectedStop, scale, en);

    // Prefecture label badges on multi-stop prefectures (replaced arbitrary ellipse circles!)
    let prefLabelsSvg = "";
    if (!activePrefId && !selectedStop) {
      prefGroups.forEach((pStops, pId) => {
        if (pStops.length < 2) return;
        const pref = window.getPrefectureById ? window.getPrefectureById(pId) : null;
        const pGeo = prefPaths[pId];
        if (!pref || !pGeo) return;
        const lblFs = Math.max(2.2, fontSz * 0.84).toFixed(2);
        prefLabelsSvg += `<text class="gmaps-pref-label" x="${pGeo.cx}" y="${pGeo.cy}" text-anchor="middle" font-size="${lblFs}" font-weight="800" data-pref-id="${window.escapeAttr(pId)}" onclick="focusMapPrefecture(this.dataset.prefId)" style="stroke-width:${(Number(lblFs) * 0.34).toFixed(2)}px;">${window.escapeHtml(en ? pref.nameEn : pref.nameJa)} (${pStops.length})</text>`;
      });
    }

    // Google Maps Directions Polyline (white casing + blue route line)
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

    const mapPrefBarHtml = prefEntries.length > 0 ? `
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
      const isKnown = window.findMatchingGazetteerStops(q).length > 0;
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
          ? "Click any pin to highlight its real city (or prefecture) boundary; drag to pan & scroll to zoom. Adding a stop appends a new latest day to Tab 2 with a curated 3–4★ hotel."
          : "ピンクリックで市区町村（未収録都市は都道府県）の境界をハイライト。ドラッグで移動・ホイールで拡大縮小でき、都市追加でタブ2に最終日程＋3〜4★ホテルが自動追加されます。"}
      </p>

      <div class="map-control-bar">
        <input type="text" id="mapLocationInput" class="search-input" style="min-width:180px;flex:1;padding:6px 10px;font-size:12px;"
          placeholder="${window.escapeAttr(en ? "Add city/prefecture to itinerary (e.g. Takayama, Matsuyama, Shimane)..." : "日程に都市・県を追加（例：高山、松山、島根）...")}"
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
        <svg id="dynamicJapanMapSvg" class="gmaps-svg" viewBox="${box.vx} ${box.vy} ${box.vw} ${box.vh}" data-init-viewbox="${box.vx} ${box.vy} ${box.vw} ${box.vh}" width="100%" height="440" preserveAspectRatio="xMidYMid meet" aria-label="Google Maps Style Japan Map">
          <g class="gmaps-pref-layer">${prefPathsSvg}</g>
          <g class="gmaps-highlight-layer">${highlightSvg}</g>
          <g class="gmaps-pref-labels">${prefLabelsSvg}</g>
          <g class="gmaps-route-layer">${pathsSvg}</g>
          <g class="gmaps-pins-layer">${pinsSvg}</g>
        </svg>
        <div class="gmaps-zoom-controls" aria-label="Map Zoom Controls">
          <button type="button" class="gmaps-ctrl-btn" onclick="zoomInteractiveMap(0.72)" title="${en ? "Zoom in" : "拡大"}">+</button>
          <button type="button" class="gmaps-ctrl-btn" onclick="zoomInteractiveMap(1.38)" title="${en ? "Zoom out" : "縮小"}">−</button>
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

    const g = (window.JAPAN_GAZETTEER || []).find(x => x.id === locId);
    let targetDayNum = null;
    state.activeRegionKey = "ALL";

    if (String(locId || "").startsWith("unrec_day_")) {
      const parsedDay = parseInt(String(locId).replace("unrec_day_", ""), 10);
      if (parsedDay > 0) targetDayNum = parsedDay;
    } else if (g && Array.isArray(g.keys)) {
      const matchedDay = days.find(d => {
        const text = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""} ${d.routeEn || ""}`;
        const prep = typeof window.prepareGazetteerText === "function"
          ? window.prepareGazetteerText(text)
          : { rawLower: text.toLowerCase(), normText: text.toLowerCase() };
        return g.keys.some(k => window.gazetteerKeyMatches(prep, k));
      });
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
