// Dynamic Multi-Island Japan Route Map with Collision-Avoided Labels & Unrecognized Fallback

(function() {
  window.gazetteerKeyMatches = function(textLower, keyLower) {
    if (!textLower || !keyLower) return false;
    if (/[^\x00-\x7F]/.test(keyLower)) {
      return textLower.includes(keyLower);
    }
    const escaped = keyLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp("(^|[^a-z0-9])" + escaped + "(?=$|[^a-z0-9])", "i");
    return rx.test(textLower);
  };

  window.findMatchingGazetteerStops = function(rawText) {
    const q = String(rawText || "").toLowerCase().trim();
    if (!q) return [];
    const matches = [];
    (window.JAPAN_GAZETTEER || []).forEach(g => {
      if (g.id === q || g.keys.some(k => window.gazetteerKeyMatches(q, k))) {
        matches.push(g);
      }
    });
    return matches;
  };

  window.getMatchedJapanLocations = function() {
    const matchedMap = new Map();
    const tokyoStop = (window.JAPAN_GAZETTEER || []).find(g => g.id === "tokyo") || {
      id: "tokyo", nameEn: "Tokyo Central", nameJa: "東京", regionKey: "Tokyo", x: 668, y: 518
    };

    const addStop = (gItem) => {
      if (gItem && !matchedMap.has(gItem.id)) {
        matchedMap.set(gItem.id, Object.assign({}, gItem));
      }
    };

    if (Array.isArray(state.customMapLocations) && state.customMapLocations.length > 0) {
      state.customMapLocations.forEach((raw, idx) => {
        const q = String(raw || "").toLowerCase().trim();
        if (!q) return;
        const foundList = window.findMatchingGazetteerStops(q);
        if (foundList.length > 0) {
          foundList.forEach(g => addStop(g));
        } else {
          const unrecId = "unrec_custom_" + idx + "_" + q;
          matchedMap.set(unrecId, {
            id: unrecId,
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
        const text = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""}`.replace(/\bhotel\s+nikko\b/gi, "");
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
    return Array.from(matchedMap.values());
  };

  function isTokyoOnlySet(stops) {
    return stops.length > 0 && stops.every(s => s.x >= 640 && s.x <= 700 && s.y >= 495 && s.y <= 545);
  }

  function computeDynamicViewBox(stops) {
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

  window.buildInteractiveJapanMapHtml = function() {
    const en = window.isEn();
    const stops = window.getMatchedJapanLocations();
    const box = computeDynamicViewBox(stops);
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
      if (dist > 135 || a.regionKey === "Okinawa" || b.regionKey === "Okinawa" || a.regionKey === "Hokkaido" || b.regionKey === "Hokkaido") {
        const mx = (a.x + b.x) / 2 - (b.y - a.y) * 0.16;
        const my = (a.y + b.y) / 2 + (b.x - a.x) * 0.12;
        pathsSvg += `<path d="M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}" stroke="var(--accent)" stroke-width="${lineW}" stroke-dasharray="${lineW * 2},${lineW * 1.4}" fill="none" opacity="0.88"/>`;
      } else {
        pathsSvg += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="var(--forest)" stroke-width="${lineW}" stroke-linecap="round" opacity="0.9"/>`;
      }
    }

    const labelPositions = layoutMapLabels(stops, box, rHub, fontSz, en);
    const pinsSvg = stops.map((s, idx) => {
      const label = window.escapeHtml(en ? s.nameEn : s.nameJa);
      const pos = labelPositions[idx];
      const pinFill = s.unrecognized ? "#DC2626" : (s.isAir ? "var(--accent)" : "var(--indigo)");
      const safeId = window.escapeAttr(s.id);
      const safeReg = window.escapeAttr(s.regionKey || "ALL");
      return `
        <g class="map-node" onclick="jumpToLocationFilter('${safeId}', '${safeReg}')">
          <circle cx="${s.x}" cy="${s.y}" r="${idx === 0 || idx === stops.length - 1 || s.unrecognized ? rHub : rPin}" fill="${pinFill}" stroke="#FFFFFF" stroke-width="${strokeW}"/>
          <text x="${pos.tx.toFixed(1)}" y="${pos.ty.toFixed(1)}" text-anchor="${pos.anchor}" font-size="${fontSz.toFixed(2)}" font-weight="800" fill="${s.unrecognized ? "#B91C1C" : "#1E293B"}" style="paint-order:stroke;stroke:#FFFFFF;stroke-width:${(fontSz * 0.28).toFixed(2)}px;stroke-linejoin:round;">
            ${idx + 1}. ${label}
          </text>
        </g>
      `;
    }).join("");

    const customTagsHtml = (state.customMapLocations || []).map((loc, idx) => {
      const q = String(loc || "").toLowerCase().trim();
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
          ? "Automatically zooms & frames your itinerary stops. Add any Japan city below or click any pin to filter Schedule (unrecognised places default to Tokyo with ❗)."
          : "行程や追加都市名に合わせて自動ズームします。地図のピンをクリックすると該当日のスケジュールへ移動します（未認識の地名は ❗ マーク付きで東京に設定）。"}
      </p>

      <div class="map-control-bar">
        <input type="text" id="mapLocationInput" class="search-input" style="min-width:180px;flex:1;padding:6px 10px;font-size:12px;"
          placeholder="${window.escapeAttr(en ? "Add Japan stop (e.g. Tokyo, Ishigaki, Kyoto, Sapporo)..." : "都市名を追加（例：東京、石垣島、京都、札幌）...")}"
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
    window.saveState();
    window.renderOverviewTab();
  };

  window.setMapQuickScope = function(scope) {
    const en = window.isEn();
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
    window.switchTabById("itinerary");
    if (regionKey && regionKey !== "ALL") {
      const hasRegion = (window.curData().days || []).some(d => d.region === regionKey);
      if (hasRegion) {
        state.activeRegionKey = regionKey;
        window.renderItineraryCards();
        return;
      }
    }
    state.activeRegionKey = "ALL";
    const searchEl = document.getElementById("itinerarySearch");
    if (searchEl) {
      const g = (window.JAPAN_GAZETTEER || []).find(x => x.id === locId);
      searchEl.value = g ? (window.isEn() ? g.nameEn.split(" ")[0] : g.nameJa.split("（")[0]) : "";
    }
    window.renderItineraryCards();
  };
})();
