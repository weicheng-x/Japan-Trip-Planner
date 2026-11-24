// Smooth Google Maps Pan/Wheel Zoom Interaction & Map-to-Schedule "+ Add Stop" Action

(function() {
  let _dragState = null;
  let _rafPending = false;
  let _pendingVb = null;
  let _suppressNextClick = false;

  function parseViewBox(svgEl) {
    const raw = (svgEl && svgEl.getAttribute("viewBox")) || "26 28 895 922";
    const parts = raw.trim().split(/\s+/).map(Number);
    return parts.length === 4 && parts.every(n => !isNaN(n))
      ? { vx: parts[0], vy: parts[1], vw: parts[2], vh: parts[3] }
      : { vx: 26, vy: 28, vw: 895, vh: 922 };
  }

  function applyViewBox(svgEl, vb) {
    if (!svgEl || !vb) return;
    _pendingVb = vb;
    if (_rafPending) return;
    _rafPending = true;
    const exec = () => {
      _rafPending = false;
      if (_pendingVb && svgEl) {
        svgEl.setAttribute(
          "viewBox",
          `${_pendingVb.vx.toFixed(1)} ${_pendingVb.vy.toFixed(1)} ${_pendingVb.vw.toFixed(1)} ${_pendingVb.vh.toFixed(1)}`
        );
      }
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(exec);
    else exec();
  }

  window.zoomInteractiveMap = function(factor) {
    const svg = document.getElementById("dynamicJapanMapSvg");
    if (!svg) return;
    const cur = parseViewBox(svg);
    const nextW = Math.max(18, Math.min(1050, cur.vw * factor));
    const scale = nextW / cur.vw;
    const nextH = cur.vh * scale;
    const cx = cur.vx + cur.vw / 2;
    const cy = cur.vy + cur.vh / 2;
    applyViewBox(svg, {
      vx: Math.max(-60, Math.min(920, cx - nextW / 2)),
      vy: Math.max(-40, Math.min(960, cy - nextH / 2)),
      vw: nextW,
      vh: nextH
    });
  };

  window.resetInteractiveMapView = function() {
    state.selectedMapStopId = null;
    state.focusedPrefId = null;
    state.manualMapZoom = null;
    state.mapScopeMode = "schedule";
    window.saveState();
    window.renderActiveViews();
  };

  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("pointerdown", evt => {
      const svg = evt && evt.target && evt.target.closest ? evt.target.closest("#dynamicJapanMapSvg") : null;
      if (!svg || evt.button !== 0) return;
      _dragState = {
        svg,
        startX: evt.clientX,
        startY: evt.clientY,
        moved: false,
        startVb: parseViewBox(svg)
      };
    });

    document.addEventListener("pointermove", evt => {
      if (!_dragState || !_dragState.svg) return;
      const dxPx = evt.clientX - _dragState.startX;
      const dyPx = evt.clientY - _dragState.startY;
      if (!_dragState.moved && Math.hypot(dxPx, dyPx) < 4) return;
      _dragState.moved = true;
      _suppressNextClick = true;
      const rect = _dragState.svg.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      // Compute effective Uniform Scale matching preserveAspectRatio="xMidYMid meet"
      const vb = _dragState.startVb;
      const unitsPerPx = Math.max(vb.vw / rect.width, vb.vh / rect.height);
      applyViewBox(_dragState.svg, {
        vx: Math.max(-80, Math.min(940, vb.vx - dxPx * unitsPerPx)),
        vy: Math.max(-60, Math.min(960, vb.vy - dyPx * unitsPerPx)),
        vw: vb.vw,
        vh: vb.vh
      });
    });

    document.addEventListener("pointerup", () => {
      if (_dragState && _dragState.moved) {
        setTimeout(() => { _suppressNextClick = false; }, 60);
      }
      _dragState = null;
    });

    document.addEventListener("click", evt => {
      if (_suppressNextClick && evt && evt.target && evt.target.closest && evt.target.closest("#dynamicJapanMapSvg")) {
        evt.stopPropagation();
        evt.preventDefault();
        _suppressNextClick = false;
      }
    }, true);

    const onWheel = evt => {
      const svg = evt && evt.target && evt.target.closest ? evt.target.closest("#dynamicJapanMapSvg") : null;
      if (!svg) return;
      evt.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const cur = parseViewBox(svg);
      const factor = evt.deltaY < 0 ? 0.84 : 1.19;
      const nextW = Math.max(18, Math.min(1050, cur.vw * factor));
      const scale = nextW / cur.vw;
      const nextH = cur.vh * scale;

      const relX = Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (evt.clientY - rect.top) / rect.height));
      const anchorX = cur.vx + relX * cur.vw;
      const anchorY = cur.vy + relY * cur.vh;

      applyViewBox(svg, {
        vx: Math.max(-80, Math.min(940, anchorX - relX * nextW)),
        vy: Math.max(-60, Math.min(960, anchorY - relY * nextH)),
        vw: nextW,
        vh: nextH
      });
    };
    document.addEventListener("wheel", onWheel, { passive: false });
  }

  window.addCustomMapLocation = function() {
    const en = window.isEn();
    const inp = document.getElementById("mapLocationInput");
    if (!inp) return;
    const val = inp.value.trim();
    if (!val) return;
    inp.value = "";

    const matchedStops = typeof window.findMatchingGazetteerStops === "function"
      ? window.findMatchingGazetteerStops(val)
      : [];
    const primaryStop = matchedStops[0] || null;

    if (typeof window.appendDayFromMapStop === "function") {
      const addedInfo = window.appendDayFromMapStop(val);
      state.mapScopeMode = "schedule";
      state.customMapLocations = [];
      state.manualMapZoom = null;
      const isPrefOnly = !!(primaryStop && primaryStop.isPrefFallback && primaryStop.prefId);
      state.focusedPrefId = isPrefOnly ? primaryStop.prefId : null;
      state.selectedMapStopId = (!isPrefOnly && primaryStop) ? primaryStop.id : null;
      window.saveState();
      window.renderActiveViews();
      const hName = addedInfo && addedInfo.hotelName ? ` • 🏨 ${addedInfo.hotelName}` : "";
      window.showToast(primaryStop
        ? (en ? `📍 Added "${val}" as Day ${addedInfo.day}${hName}` : `📍 Day ${addedInfo.day}に「${val}」を追加しました${hName}`)
        : (en ? `❗ Added Day ${addedInfo.day} ("${val}" unrecognised in Japan — defaulted to Tokyo on map)` : `❗ Day ${addedInfo.day}に「${val}」を追加（未認識のため地図は東京に設定）`));
      return;
    }

    if (!Array.isArray(state.customMapLocations)) state.customMapLocations = [];
    state.customMapLocations.push(val);
    state.manualMapZoom = null;
    state.focusedPrefId = null;
    state.selectedMapStopId = primaryStop ? primaryStop.id : null;
    window.saveState();
    window.renderActiveViews();
  };

  window.removeCustomMapLocation = function(idx) {
    if (!Array.isArray(state.customMapLocations)) return;
    state.customMapLocations.splice(idx, 1);
    state.manualMapZoom = null;
    state.focusedPrefId = null;
    state.selectedMapStopId = null;
    window.saveState();
    window.renderActiveViews();
  };

  window.setMapQuickScope = function(scope) {
    const en = window.isEn();
    state.focusedPrefId = null;
    state.selectedMapStopId = null;
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
    window.renderActiveViews();
  };
})();
