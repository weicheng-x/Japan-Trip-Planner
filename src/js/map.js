// Dynamic Multi-Island Japan Route Map with Collision-Avoided Labels & Unrecognized Fallback

(function() {
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

    // If Shin-Aomori matched, suppress Aomori/Hakkoda pin unless an explicit Hakkoda/Aomori-city term is present
    const hasShinAomori = matches.some(m => m.id === "shin_aomori");
    const hasExplicitAomoriCity = /(?:hakkoda|tsutanuma|jogakura|nebuta|aomori city|aomori station|八甲田|蔦沼|城ヶ倉|ねぶた|青森市|青森駅)/i.test(prep.rawLower);
    const filteredAomori = (hasShinAomori && !hasExplicitAomoriCity)
      ? matches.filter(m => m.id !== "aomori_city")
      : matches;

    // Suppress generic prefecture fallback entry when a specific city inside that prefecture matched the same text
    const specificPrefs = new Set(filteredAomori.filter(m => !m.isPrefFallback && m.prefId).map(m => m.prefId));
    return filteredAomori.filter(m => !m.isPrefFallback || !specificPrefs.has(m.prefId));
  };

  window.getMatchedJapanLocations = function() {
    const matchedMap = new Map();
    const tokyoStop = (window.JAPAN_GAZETTEER || []).find(g => g.id === "tokyo") || {
      id: "tokyo", prefId: "tokyo", cityKey: "tokyo", nameEn: "Tokyo Central", nameJa: "東京", regionKey: "Tokyo", x: 668, y: 518
    };

    const addStop = (gItem) => {
      if (gItem && !matchedMap.has(gItem.id)) {
        matchedMap.set(gItem.id, Object.assign({}, gItem));
      }
    };

    if (Array.isArray(state.customMapLocations) && state.customMapLocations.length > 0) {
      state.customMapLocations.forEach((raw, idx) => {
        const q = String(raw || "").trim();
        if (!q) return;
        const foundList = window.findMatchingGazetteerStops(q);
        if (foundList.length > 0) {
          foundList.forEach(g => addStop(g));
        } else {
          const unrecId = "unrec_custom_" + idx;
          matchedMap.set(unrecId, {
            id: unrecId,
            prefId: "tokyo",
            nameEn: `❗ ${raw} → Tokyo (Not recognised in Japan)`,
            nameJa: `❗ ${raw} → 東京（日本の地名として未認識）`,
            rawInput: raw,
            unrecognized: true,
            regionKey: "Tokyo",
            x: tokyoStop.x,
            y: tokyoStop.y
          });
        }
      });
    }

    if (!state.mapScopeMode || state.mapScopeMode === "schedule") {
      const days = (window.curData().days) || [];
      days.forEach(d => {
        const text = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""}`;
        const dayMatches = window.findMatchingGazetteerStops(text);
        if (dayMatches.length > 0) {
          d._unrecognizedPlace = false;
          dayMatches.forEach(g => addStop(g));
        } else {
          const fallbackMatches = window.findMatchingGazetteerStops(d.routeEn || "");
          if (fallbackMatches.length > 0) {
            d._unrecognizedPlace = false;
            fallbackMatches.forEach(g => addStop(g));
          } else {
            const labelRaw = (d.region && d.region.trim()) ? d.region.trim() : (d.routeJp || `Day ${d.day}`);
            d._unrecognizedPlace = true;
            d._unrecognizedRaw = labelRaw;
            const unrecDayId = "unrec_day_" + d.day;
            matchedMap.set(unrecDayId, {
              id: unrecDayId,
              prefId: "tokyo",
              nameEn: `❗ ${labelRaw} (D${d.day}) → Tokyo`,
              nameJa: `❗ ${labelRaw} (D${d.day}) → 東京`,
              rawInput: labelRaw,
              unrecognized: true,
              regionKey: "Tokyo",
              x: tokyoStop.x,
              y: tokyoStop.y
            });
          }
        }
      });
    }

    if (matchedMap.size === 0) addStop(tokyoStop);
    const list = Array.from(matchedMap.values());
    // Suppress prefecture-level fallback pin whenever any specific city pin inside that prefecture exists across the itinerary
    const prefsWithSpecificCity = new Set(list.filter(s => !s.isPrefFallback && !s.unrecognized && s.prefId).map(s => s.prefId));
    return list.filter(s => !s.isPrefFallback || !prefsWithSpecificCity.has(s.prefId));
  };

  function isTokyoOnlySet(stops) {
    return stops.length > 0 && stops.every(s => s.x >= 640 && s.x <= 700 && s.y >= 495 && s.y <= 545);
  }

  function computeDynamicViewBox(stops, focusedPrefId) {
    if (focusedPrefId && stops && stops.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      stops.forEach(s => {
        if (s.x < minX) minX = s.x;
        if (s.x > maxX) maxX = s.x;
        if (s.y < minY) minY = s.y;
        if (s.y > maxY) maxY = s.y;
      });
      const spanX = Math.max(maxX - minX, 52);
      const spanY = Math.max(maxY - minY, 54);
      const padX = Math.max(spanX * 0.36, 26);
      const padY = Math.max(spanY * 0.34, 26);
      const vx = Math.max(55, Math.round(minX - padX));
      const vy = Math.max(45, Math.round(minY - padY));
      const vw = Math.min(875, Math.round(spanX + padX * 2));
      const vh = Math.min(930, Math.round(spanY + padY * 2));
      const pref = window.getPrefectureById ? window.getPrefectureById(focusedPrefId) : null;
      return {
        vx, vy, vw, vh,
        modeLabelEn: `Prefecture Zoom: ${pref ? pref.nameEn : focusedPrefId} (${stops.length} ${stops.length === 1 ? "stop" : "stops"})`,
        modeLabelJa: `都道府県拡大：${pref ? pref.nameJa : focusedPrefId}（${stops.length}地点）`
      };
    }
    if (state.manualMapZoom === "allJapan") {
      return { vx: 70, vy: 55, vw: 795, vh: 915, modeLabelEn: "Nationwide Japan (Hokkaido to Okinawa)", modeLabelJa: "日本全域（北海道〜沖縄）" };
    }
    if (state.manualMapZoom === "tokyoOnly") {
      return { vx: 635, vy: 492, vw: 68, vh: 55, modeLabelEn: "Greater Tokyo & Tokyo Bay", modeLabelJa: "東京・首都圏クローズアップ" };
    }
    if (state.manualMapZoom === "tokyoOkinawa") {
      return { vx: 80, vy: 468, vw: 645, vh: 498, modeLabelEn: "Tokyo to Okinawa & Yaeyama Corridor", modeLabelJa: "東京〜沖縄・八重山 広域レンジ" };
    }
    if (isTokyoOnlySet(stops)) {
      return { vx: 635, vy: 492, vw: 68, vh: 55, modeLabelEn: "Auto-Zoom: Greater Tokyo Only", modeLabelJa: "自動ズーム：東京・首都圏のみ" };
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    stops.forEach(s => {
      if (s.x < minX) minX = s.x;
      if (s.x > maxX) maxX = s.x;
      if (s.y < minY) minY = s.y;
      if (s.y > maxY) maxY = s.y;
    });

    const spanX = Math.max(maxX - minX, 78);
    const spanY = Math.max(maxY - minY, 85);
    const padX = Math.max(spanX * 0.30, 42);
    const padY = Math.max(spanY * 0.28, 42);

    const vx = Math.max(55, Math.round(minX - padX));
    const vy = Math.max(45, Math.round(minY - padY));
    const vw = Math.min(875, Math.round(spanX + padX * 2));
    const vh = Math.min(930, Math.round(spanY + padY * 2));

    const firstStop = stops[0];
    const lastStop = stops[stops.length - 1];
    const spanLabelEn = stops.length === 1
      ? `Auto-Zoom: ${firstStop.nameEn}`
      : `Auto-Fit (${stops.length} Stops): ${firstStop.nameEn} ↔ ${lastStop.nameEn}`;
    const spanLabelJa = stops.length === 1
      ? `自動ズーム：${firstStop.nameJa}`
      : `自動フィット（${stops.length}拠点）：${firstStop.nameJa} ↔ ${lastStop.nameJa}`;

    return { vx, vy, vw, vh, modeLabelEn: spanLabelEn, modeLabelJa: spanLabelJa };
  }

  // Greedy 2D bounding-box + side-flip label de-overlap in SVG viewBox space
  function layoutMapLabels(stops, box, rHub, fontSz, en) {
    const placed = [];
    stops.forEach(s => {
      const rObs = rHub * 1.15;
      placed.push({ x0: s.x - rObs, x1: s.x + rObs, y0: s.y - rObs, y1: s.y + rObs });
    });
    const charW = en ? fontSz * 0.56 : fontSz * 0.92;
    const labelH = fontSz * 1.18;
    const padX = fontSz * 0.6;
    const makeRect = (txVal, tyVal, anchorVal, estW) => {
      const x0 = anchorVal === "start" ? txVal : (txVal - estW);
      const x1 = anchorVal === "start" ? (txVal + estW) : txVal;
      return { x0: x0 - padX, x1: x1 + padX, y0: tyVal - labelH * 0.85, y1: tyVal + labelH * 0.25 };
    };
    const overlaps = (r) => placed.some(p => r.x0 < p.x1 && r.x1 > p.x0 && r.y0 < p.y1 && r.y1 > p.y0);

    return stops.map((s, idx) => {
      const rawText = `${idx + 1}. ${(en ? s.nameEn : s.nameJa) || ""}`;
      const estW = Math.max(fontSz * 3.5, rawText.length * charW + fontSz * 0.5);
      const rightX = s.x + rHub * 1.45;
      const leftX = s.x - rHub * 1.45;
      const preferRight = s.x < box.vx + box.vw * 0.54;
      let anchor = preferRight ? "start" : "end";
      let tx = anchor === "start" ? rightX : leftX;
      const baseTy = s.y + fontSz * 0.35 + (s.unrecognized ? fontSz * 1.15 : 0);

      // Keep inside horizontal viewBox bounds whenever possible
      if (anchor === "start" && tx + estW > box.vx + box.vw * 0.96) {
        anchor = "end";
        tx = leftX;
      } else if (anchor === "end" && tx - estW < box.vx + box.vw * 0.04) {
        anchor = "start";
        tx = rightX;
      }

      const dyStep = fontSz * 1.24;
      const minY = box.vy + fontSz * 1.15;
      const maxY = box.vy + box.vh - fontSz * 0.45;
      let bestCandidate = { anchor, tx, ty: Math.max(minY, Math.min(maxY, baseTy)) };
      let foundClean = false;

      const sideOrder = anchor === "start"
        ? [{ a: "start", x: rightX }, { a: "end", x: leftX }]
        : [{ a: "end", x: leftX }, { a: "start", x: rightX }];

      for (let ring = 0; ring <= 4 && !foundClean; ring++) {
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
      if (!foundClean) {
        placed.push(makeRect(bestCandidate.tx, bestCandidate.ty, bestCandidate.anchor, estW));
      }
      return bestCandidate;
    });
  }

  window.focusMapPrefecture = function(prefId) {
    const en = window.isEn();
    state.focusedPrefId = prefId || null;
    state.manualMapZoom = null;
    if (prefId && window.getPrefectureById) {
      const pref = window.getPrefectureById(prefId);
      if (pref) {
        window.showToast(en ? `🔍 Zoomed into ${pref.nameEn} Prefecture` : `🔍 ${pref.nameJa}へズームしました`);
      }
    }
    window.saveState();
    window.renderOverviewTab();
  };

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

    const focusedStops = activePrefId ? prefGroups.get(activePrefId) : stops;
    const box = computeDynamicViewBox(focusedStops, activePrefId);
    const unrecStops = stops.filter(s => s.unrecognized);

    const scale = box.vw / 380;
    const rPin = Math.max(1.3, Math.min(7.5, 5.8 * scale));
    const rHub = Math.max(1.7, Math.min(9.0, 7.2 * scale));
    const strokeW = Math.max(0.4, Math.min(2.6, 1.8 * scale));
    const fontSz = Math.max(2.0, Math.min(11.5, 9.2 * scale));
    const lineW = Math.max(0.6, Math.min(3.2, 2.4 * scale));

    let pathsSvg = "";
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      const isFocusedEdge = !activePrefId || (a.prefId === activePrefId && b.prefId === activePrefId);
      const edgeOpacity = isFocusedEdge ? (dist > 135 ? "0.88" : "0.9") : "0.18";
      if (dist > 135 || a.regionKey === "Okinawa" || b.regionKey === "Okinawa" || a.regionKey === "Hokkaido" || b.regionKey === "Hokkaido") {
        const mx = (a.x + b.x) / 2 - (b.y - a.y) * 0.16;
        const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.12;
        pathsSvg += `<path d="M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}" stroke="var(--accent)" stroke-width="${lineW}" stroke-dasharray="${lineW * 2},${lineW * 1.4}" fill="none" opacity="${edgeOpacity}"/>`;
      } else {
        pathsSvg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="var(--forest)" stroke-width="${lineW}" stroke-linecap="round" opacity="${edgeOpacity}"/>`;
      }
    }

    // Multi-stop Prefecture clickable cluster halos in Full Route view
    let clustersSvg = "";
    if (!activePrefId) {
      prefGroups.forEach((pStops, pId) => {
        if (pStops.length < 2) return;
        const pref = window.getPrefectureById ? window.getPrefectureById(pId) : null;
        if (!pref) return;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        pStops.forEach(s => {
          if (s.x < minX) minX = s.x;
          if (s.x > maxX) maxX = s.x;
          if (s.y < minY) minY = s.y;
          if (s.y > maxY) maxY = s.y;
        });
        const cx = (minX + maxX) / 2;
        const cy = (minY + maxY) / 2;
        const rx = Math.max((maxX - minX) / 2 + rHub * 2.1, rHub * 3.0);
        const ry = Math.max((maxY - minY) / 2 + rHub * 2.1, rHub * 3.0);
        const pillFont = Math.max(2.2, fontSz * 0.86);
        const badgeY = Math.max(box.vy + pillFont * 1.4, cy - ry - pillFont * 0.45);
        const prefLabel = `${en ? pref.nameEn : pref.nameJa} (${pStops.length}) 🔍`;
        clustersSvg += `
          <g class="map-pref-cluster" data-pref-id="${window.escapeAttr(pId)}" onclick="focusMapPrefecture(this.dataset.prefId)" title="${window.escapeAttr(en ? `Click to zoom into ${pref.nameEn} (${pStops.length} stops)` : `${pref.nameJa}を拡大表示（${pStops.length}地点）`)}">
            <ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="rgba(217,119,6,0.09)" stroke="var(--accent)" stroke-width="${Math.max(0.5, 1.3 * scale).toFixed(2)}" stroke-dasharray="${(3.2 * scale).toFixed(1)},${(2.2 * scale).toFixed(1)}"/>
            <text x="${cx.toFixed(1)}" y="${badgeY.toFixed(1)}" text-anchor="middle" font-size="${pillFont.toFixed(2)}" font-weight="800" fill="var(--accent-dark, #B45309)" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:${(pillFont * 0.34).toFixed(2)}px;stroke-linejoin:round;">
              ${window.escapeHtml(prefLabel)}
            </text>
          </g>
        `;
      });
    }

    const labelTargetStops = activePrefId ? focusedStops : stops;
    const labelPositions = layoutMapLabels(labelTargetStops, box, rHub, fontSz, en);
    const labelPosByStopId = new Map();
    labelTargetStops.forEach((s, i) => labelPosByStopId.set(s.id, labelPositions[i]));

    const pinsSvg = stops.map(s => {
      const label = window.escapeHtml(en ? s.nameEn : s.nameJa);
      const pos = labelPosByStopId.get(s.id);
      const isDimmed = !!(activePrefId && s.prefId !== activePrefId);
      const pinFill = s.unrecognized ? "#DC2626" : (s.isAir ? "var(--accent)" : "var(--indigo)");
      const safeId = window.escapeAttr(s.id);
      const safeReg = window.escapeAttr(s.prefId ? `PREF:${s.prefId}` : (s.regionKey || "ALL"));
      const routeNum = (typeof s._routeIdx === "number" ? s._routeIdx : 0) + 1;
      const circleR = (s._routeIdx === 0 || s._routeIdx === stops.length - 1 || s.unrecognized) ? rHub : rPin;
      return `
        <g class="map-node" style="${isDimmed ? "opacity:0.2;" : ""}" data-loc-id="${safeId}" data-region="${safeReg}" onclick="jumpToLocationFilter(this.dataset.locId, this.dataset.region)">
          <circle cx="${s.x}" cy="${s.y}" r="${circleR}" fill="${pinFill}" stroke="#FFFFFF" stroke-width="${strokeW}"/>
          ${pos ? `<text x="${pos.tx.toFixed(1)}" y="${pos.ty.toFixed(1)}" text-anchor="${pos.anchor}" font-size="${fontSz.toFixed(2)}" font-weight="800" fill="${s.unrecognized ? "#B91C1C" : "#1E293B"}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:${(fontSz * 0.28).toFixed(2)}px;stroke-linejoin:round;">
            ${routeNum}. ${label}
          </text>` : ""}
        </g>
      `;
    }).join("");

    // Prefecture Zoom Bar HTML (Multi-stop prefectures listed first so grouped stops are one click away)
    const prefEntries = Array.from(prefGroups.entries()).sort((a, b) => {
      const diff = (b[1].length > 1 ? 1 : 0) - (a[1].length > 1 ? 1 : 0);
      if (diff !== 0) return diff;
      return b[1].length - a[1].length;
    });
    const mapPrefBarHtml = prefEntries.length > 0 ? `
      <div class="map-pref-zoom-bar" id="mapPrefZoomBar">
        <span class="map-pref-bar-label">${en ? "Prefecture Zoom:" : "都道府県ズーム:"}</span>
        ${activePrefId ? `<button type="button" class="btn map-pref-chip map-pref-back" onclick="focusMapPrefecture(null)">← ${en ? "Back to Full Route" : "全体ルートへ戻る"}</button>` : ""}
        ${prefEntries.map(([pId, pStops]) => {
          const pref = window.getPrefectureById ? window.getPrefectureById(pId) : null;
          if (!pref) return "";
          const isActive = activePrefId === pId;
          const cnt = pStops.length;
          return `<button type="button" class="pill map-pref-chip ${isActive ? "active" : ""}" data-pref-id="${window.escapeAttr(pId)}" onclick="focusMapPrefecture('${window.escapeAttr(pId)}')" title="${window.escapeAttr(en ? `Zoom to ${pref.nameEn} (${cnt})` : `${pref.nameJa}（${cnt}地点）を拡大`)}">📍 ${window.escapeHtml(en ? pref.nameEn : pref.nameJa)} (${cnt})${cnt >= 2 ? " 🔍" : ""}</button>`;
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

    const mp = window.JAPAN_MAP_PATHS;
    const landStroke = Math.max(0.45, 1.45 * scale).toFixed(2);
    const smallStroke = Math.max(0.35, 1.05 * scale).toFixed(2);

    return `
      <h2>
        <span>🗾 ${en ? "Dynamic Japan Route Map" : "日本全国ダイナミック・ルートマップ"}</span>
        <span class="pass-badge" style="font-size:11.5px;">${window.escapeHtml(en ? box.modeLabelEn : box.modeLabelJa)}</span>
      </h2>
      <p class="lead" style="margin-bottom:10px;">
        ${en
          ? "Automatically zooms & frames your itinerary stops. Click any pin to filter Schedule, or click a Prefecture chip/halo to inspect stops inside that prefecture."
          : "行程や都市名に合わせて自動ズームします。地図のピンで日程へ移動、都道府県チップ／枠クリックで都道府県内スポットへ拡大します。"}
      </p>

      <div class="map-control-bar">
        <input type="text" id="mapLocationInput" class="search-input" style="min-width:180px;flex:1;padding:6px 10px;font-size:12px;"
          placeholder="${window.escapeAttr(en ? "Add Japan stop (e.g. Hachinohe, Tottori, Shimane, Nyuutou Onsen)..." : "都市名を追加（例：八戸、鳥取、島根、乳頭温泉）...")}"
          onkeydown="if(event.key==='Enter'){addCustomMapLocation();}">
        <button type="button" class="btn btn-primary" style="padding:6px 10px;font-size:11.5px;" onclick="addCustomMapLocation()">
          ${en ? "+ Add Stop" : "+ 地点追加"}
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

      <div class="route-svg-wrap">
        <svg id="dynamicJapanMapSvg" viewBox="${box.vx} ${box.vy} ${box.vw} ${box.vh}" width="100%" height="420" preserveAspectRatio="xMidYMid meet" aria-label="Dynamic Japan Map">
          <defs>
            <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ECE4D3"/>
              <stop offset="100%" stop-color="#DFD4BE"/>
            </linearGradient>
          </defs>
          ${mp.rebun ? `<path d="${mp.rebun}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>` : ""}
          <path d="${mp.hokkaido}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${landStroke}"/>
          <path d="${mp.honshu}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${landStroke}"/>
          <path d="${mp.sado}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.awaji}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.tokyoBayWater}" data-water="true" fill="#CFE6F7" stroke="#7FAFD4" stroke-width="${smallStroke}" opacity="0.85"/>
          <polygon points="634,518 627,530 641,530" fill="#64748B" stroke="#FFFFFF" stroke-width="${Math.max(0.3, 0.7 * scale).toFixed(2)}" opacity="0.75"/>
          <path d="${mp.shikoku}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${landStroke}"/>
          <path d="${mp.kyushu}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${landStroke}"/>
          <path d="${mp.amami}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.okinawaMain}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${landStroke}"/>
          <path d="${mp.kerama}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.miyako}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.ishigaki}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          <path d="${mp.iriomote}" fill="url(#landGrad)" stroke="#B7A389" stroke-width="${smallStroke}"/>
          ${clustersSvg}
          ${pathsSvg}
          ${pinsSvg}
        </svg>
      </div>
    `;
  };

  window.addCustomMapLocation = function() {
    const en = window.isEn();
    const inp = document.getElementById("mapLocationInput");
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    if (!Array.isArray(state.customMapLocations)) state.customMapLocations = [];
    state.customMapLocations.push(val);
    state.manualMapZoom = null;
    state.focusedPrefId = null;
    inp.value = "";
    const isKnown = window.findMatchingGazetteerStops(val).length > 0;
    window.saveState();
    window.renderOverviewTab();
    window.showToast(isKnown
      ? (en ? `📍 Added "${val}" & updated map zoom!` : `📍 「${val}」を地図に追加し表示範囲を更新しました！`)
      : (en ? `❗ "${val}" is not recognised in Japan — defaulted to Tokyo!` : `❗ 「${val}」は日本の地名として未認識のため東京に設定しました！`));
  };

  window.removeCustomMapLocation = function(idx) {
    if (!Array.isArray(state.customMapLocations)) return;
    state.customMapLocations.splice(idx, 1);
    state.manualMapZoom = null;
    state.focusedPrefId = null;
    window.saveState();
    window.renderOverviewTab();
  };

  window.setMapQuickScope = function(scope) {
    const en = window.isEn();
    state.focusedPrefId = null;
    if (scope === "tokyoOnly") {
      state.mapScopeMode = "customOnly";
      state.customMapLocations = ["Haneda", "Tokyo", "Shinjuku", "Asakusa", "Narita"];
      state.manualMapZoom = "tokyoOnly";
      window.showToast(en ? "🗼 Map zoomed to Greater Tokyo Only" : "🗼 東京・首都圏エリアにズームしました");
    } else if (scope === "tokyoOkinawa") {
      state.mapScopeMode = "customOnly";
      state.customMapLocations = ["Tokyo", "Naha", "Onna-son", "Ishigaki"];
      state.manualMapZoom = "tokyoOkinawa";
      window.showToast(en ? "✈️ Map expanded to span Tokyo ↔ Okinawa" : "✈️ 東京〜沖縄の広域レンジに切り替えました");
    } else if (scope === "goldenRoute") {
      state.mapScopeMode = "customOnly";
      state.customMapLocations = ["Tokyo", "Hakone", "Mt. Fuji", "Kyoto", "Nara", "Osaka"];
      state.manualMapZoom = null;
      window.showToast(en ? "🚄 Map framed to Golden Route" : "🚄 ゴールデンルートに合わせました");
    } else if (scope === "allJapan") {
      state.mapScopeMode = "schedule";
      state.manualMapZoom = "allJapan";
      window.showToast(en ? "🗾 Showing Full Japan Map" : "🗾 日本全国マップを表示しています");
    } else {
      state.mapScopeMode = "schedule";
      state.customMapLocations = [];
      state.manualMapZoom = null;
      window.showToast(en ? "🔄 Synced map with Daily Schedule" : "🔄 日別スケジュールと地図を連動しました");
    }
    window.saveState();
    window.renderOverviewTab();
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
