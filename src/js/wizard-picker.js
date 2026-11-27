// New Trip Wizard Destination Picker:
//   1) 12 Popular Quick Cards
//   2) Full All-Japan Search (47 Prefectures + All 1,747 Municipalities: 792 Cities / 23 Wards / 743 Towns / 189 Villages)
//   3) Full-Scale Pan & Zoom Interactive Map Picker + Drag-and-Drop Route Reordering

(function() {
  const DEFAULT_WIZ_VB = { vx: 32, vy: 38, vw: 882, vh: 896 };
  let _wizardMode = "popular";
  let _wizardSelected = [];
  let _wizardLastPopularKeys = [];
  let _wizardSearchQuery = "";
  let _wizardMapPrefId = null;
  let _wizardMapMuniFilter = "";
  let _wizardMapViewBox = Object.assign({}, DEFAULT_WIZ_VB);
  let _wizardDragIdx = null;

  let _wizMapDrag = null;
  let _wizRafPending = false;
  let _wizPendingVb = null;
  let _wizSuppressClick = false;
  let _lastWizMuniSig = "";

  function makeSelectionItem(key, icon, regEn, regJa, prefId) {
    return { key, icon: icon || "📍", regEn: regEn || key, regJa: regJa || key, prefId: prefId || null };
  }

  function resolveKeyToItem(rawKey) {
    const k = String(rawKey || "").trim();
    const wiz = (window.WIZARD_CITIES || []).find(c => c.key.toLowerCase() === k.toLowerCase() || c.regEn.toLowerCase() === k.toLowerCase());
    if (wiz) {
      return makeSelectionItem(wiz.key, wiz.icon || window.getJapanPlaceIcon(wiz.key.toLowerCase()), wiz.regEn, wiz.regJa, wiz.key.toLowerCase());
    }
    const stops = typeof window.resolveLocationInputStops === "function" ? window.resolveLocationInputStops(k) : [];
    const s = stops[0];
    if (s) {
      const icon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon(s) : "📍";
      return makeSelectionItem(s.nameEn, icon, s.nameEn, s.nameJa, s.prefId);
    }
    return makeSelectionItem(k, "📍", k, k, null);
  }

  function computePrefBboxViewBox(prefId) {
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const prefGeo = prefId ? prefPaths[prefId] : null;
    if (prefGeo && prefGeo.bbox) {
      const [x0, y0, x1, y1] = prefGeo.bbox;
      const sx = Math.max(x1 - x0, 56);
      const sy = Math.max(y1 - y0, 56);
      const px = Math.max(sx * 0.22, 10);
      const py = Math.max(sy * 0.22, 10);
      return {
        vx: Math.max(20, Math.round(x0 - px)),
        vy: Math.max(22, Math.round(y0 - py)),
        vw: Math.min(915, Math.round(sx + px * 2)),
        vh: Math.min(950, Math.round(sy + py * 2))
      };
    }
    return Object.assign({}, DEFAULT_WIZ_VB);
  }

  function parseWizViewBox(svgEl) {
    const raw = (svgEl && svgEl.getAttribute("viewBox")) || "";
    const parts = raw.trim().split(/\s+/).map(Number);
    if (parts.length === 4 && parts.every(n => !isNaN(n) && n !== undefined)) {
      return { vx: parts[0], vy: parts[1], vw: parts[2], vh: parts[3] };
    }
    return Object.assign({}, _wizardMapViewBox || DEFAULT_WIZ_VB);
  }

  function buildWizardDynamicMuniContent(box, en) {
    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));
    const selSig = _wizardSelected.map(x => x.key).join(",");
    return window.renderMunicipalityLodLayer({
      box,
      en,
      focusedPrefId: _wizardMapPrefId,
      maxStroke: 0.55,
      strokeDivisor: 260,
      tier3AreaDivisor: 1350,
      maxLabelsByTier: { 4: 160, 3: 90, 2: 42, 1: 18 },
      sigExtra: selSig,
      buildPathHtml: ({ muni, geo, dispLabel, prefTitle, polyStroke }) => {
        const isSel = selSet.has(String(muni.nameEn).toLowerCase()) ||
          selSet.has(String(muni.id).toLowerCase()) ||
          (muni.rawNameEn && selSet.has(String(muni.rawNameEn).toLowerCase()));
        return `<path class="wiz-map-city${isSel ? " selected" : ""}" data-place-id="${window.escapeAttr(muni.id)}" d="${geo.d}" stroke-width="${polyStroke}" stroke-linejoin="round" onclick="wizardTogglePlaceId(this.dataset.placeId)"><title>${window.escapeHtml(`${dispLabel} (${prefTitle})`)}</title></path>`;
      }
    });
  }

  window.updateWizardDynamicMuniLayer = function(svgEl) {
    if (!svgEl) return;
    const layer = svgEl.querySelector ? svgEl.querySelector("#wizardDynamicMuniLayer") : null;
    if (!layer) return;
    const box = parseWizViewBox(svgEl);
    const en = window.isEn();
    const res = buildWizardDynamicMuniContent(box, en);
    if (res.sig !== _lastWizMuniSig) {
      _lastWizMuniSig = res.sig;
      layer.innerHTML = res.html;
    }
  };

  function applyWizViewBox(svgEl, vb) {
    if (!svgEl || !vb) return;
    _wizPendingVb = vb;
    _wizardMapViewBox = Object.assign({}, vb);
    if (_wizRafPending) return;
    _wizRafPending = true;
    const exec = () => {
      _wizRafPending = false;
      if (_wizPendingVb && svgEl) {
        svgEl.setAttribute(
          "viewBox",
          `${_wizPendingVb.vx.toFixed(1)} ${_wizPendingVb.vy.toFixed(1)} ${_wizPendingVb.vw.toFixed(1)} ${_wizPendingVb.vh.toFixed(1)}`
        );
        window.updateWizardDynamicMuniLayer(svgEl);
      }
    };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(exec);
    else exec();
  }

  function renderSelectedBar() {
    const bar = document.getElementById("wizardSelectedBar");
    if (!bar) return;
    const en = window.isEn();
    const daysEl = document.getElementById("newTripDaysInput");
    const daysCount = Math.max(1, Math.min(60, parseInt(daysEl ? daysEl.value : "7", 10) || 7));
    const nights = Math.max(0, daysCount - 1);
    const active = _wizardSelected.length > 0 ? _wizardSelected : [resolveKeyToItem("Tokyo")];
    const perStop = active.length > 0 ? (nights / active.length).toFixed(1).replace(/\.0$/, "") : "0";
    const canDrag = _wizardSelected.length > 1;

    bar.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
        <span style="font-size:11px;font-weight:800;color:var(--ink-muted);">
          ${en
            ? `Selected Route Order (${active.length} ${active.length === 1 ? "stop" : "stops"} • ~${perStop}N/stop across ${daysCount}d${canDrag ? " • drag chips to reorder" : ""}):`
            : `選択順ルート（${active.length}地点 • 全${daysCount}日 / 各約${perStop}泊${canDrag ? " • ドラッグで順番入替可" : ""}）:`}
        </span>
        ${canDrag ? `<button type="button" class="btn" style="padding:2px 7px;font-size:10.5px;" onclick="clearWizardSelection()">${en ? "Clear" : "クリア"}</button>` : ""}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        ${_wizardSelected.length === 0
          ? `<span style="font-size:11.5px;color:var(--ink-muted);font-weight:700;">${en ? "🗼 Tokyo (default if none selected)" : "🗼 東京（未選択時のデフォルト）"}</span>`
          : _wizardSelected.map((it, i) => `
            <span class="map-tag-chip wizard-route-chip"
              draggable="true"
              data-wiz-idx="${i}"
              ondragstart="handleWizardChipDragStart(${i}, event)"
              ondragover="handleWizardChipDragOver(${i}, event)"
              ondragleave="handleWizardChipDragLeave(event)"
              ondrop="handleWizardChipDrop(${i}, event)"
              ondragend="handleWizardChipDragEnd()"
              title="${window.escapeAttr(en ? "Drag to reorder stop in trip route" : "ドラッグして訪問順序を並べ替え")}">
              <span class="wiz-drag-grip" aria-hidden="true">⋮⋮</span>
              <span>${i + 1}. ${it.icon} ${window.escapeHtml(en ? it.regEn : it.regJa)}</span>
              <button type="button" data-idx="${i}" onclick="event.stopPropagation();removeWizardSelectionAt(Number(this.dataset.idx))" title="${en ? "Remove" : "削除"}">×</button>
            </span>
          `).join("")}
      </div>
    `;
  }

  function syncPopularChipsVisual() {
    const wrap = document.getElementById("newTripCityChips");
    if (!wrap || !Array.isArray(window.WIZARD_CITIES)) return;
    const en = window.isEn();
    const selKeys = new Set(_wizardSelected.map(x => x.key.toLowerCase()));
    _wizardLastPopularKeys = _wizardSelected
      .filter(x => window.WIZARD_CITIES.some(w => w.key.toLowerCase() === x.key.toLowerCase()))
      .map(x => x.key);

    wrap.innerHTML = window.WIZARD_CITIES.map(c => {
      const isActive = selKeys.has(c.key.toLowerCase());
      return `<button type="button" class="pill wizard-city-chip ${isActive ? "active" : ""}" data-city="${window.escapeAttr(c.key)}" onclick="toggleWizardCityChip(this)">${window.escapeHtml(en ? c.labelEn : c.labelJa)}</button>`;
    }).join("");
  }

  function renderSearchPanel() {
    const pane = document.getElementById("wizardSearchPane");
    if (!pane) return;
    const en = window.isEn();
    const inp = document.getElementById("wizardPlaceSearchInput");
    if (inp) {
      inp.placeholder = en
        ? "Search all 1,747 municipalities & 47 prefs (e.g. Mogami, Achi Village, Fuchu, Date)..."
        : "全1,747市区町村・47都道府県を検索（例：最上町、阿智村、府中、伊達、札幌）...";
    }
    const resEl = document.getElementById("wizardSearchResults");
    if (!resEl) return;

    const results = typeof window.searchAllJapanPlaces === "function"
      ? window.searchAllJapanPlaces(_wizardSearchQuery, 35)
      : [];
    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));

    if (results.length === 0) {
      resEl.innerHTML = `<div style="padding:12px;text-align:center;font-size:12px;color:var(--ink-muted);font-weight:700;">${en ? "No matching Japanese city, town, village or prefecture found." : "一致する市区町村・都道府県が見つかりません。"}</div>`;
      return;
    }

    resEl.innerHTML = results.map(r => {
      const addKey = r.isPrefFallback ? (r.prefNameEn || r.nameEn) : r.nameEn;
      const isSel = selSet.has(addKey.toLowerCase()) || selSet.has(String(r.id).toLowerCase());
      const subPref = r.isPrefFallback
        ? ""
        : (en ? (r.prefNameEn || "") : (r.prefNameJa || ""));
      const dispName = en ? r.nameEn : r.nameJa;
      const showSub = !r.isPrefFallback && subPref && !String(dispName || "").includes("(") && !String(dispName || "").includes("（");
      return `
        <button type="button" class="wizard-search-item ${isSel ? "active" : ""}" data-place-id="${window.escapeAttr(r.id)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">
          <span>${r.icon || "📍"} <strong>${window.escapeHtml(dispName)}</strong>${showSub ? ` <small style="color:var(--ink-muted);">(${window.escapeHtml(subPref)})</small>` : ""}</span>
          <span style="font-size:11px;font-weight:800;">${isSel ? (en ? "✓ Added" : "✓ 追加済") : (en ? "+ Add" : "+ 追加")}</span>
        </button>
      `;
    }).join("");
  }

  function renderMapPickerPanel() {
    const wrap = document.getElementById("wizardMapPickerWrap");
    if (!wrap) return;
    const en = window.isEn();
    const prefPaths = window.JAPAN_PREF_PATHS || {};
    const pref = _wizardMapPrefId && window.getPrefectureById ? window.getPrefectureById(_wizardMapPrefId) : null;
    const getIcon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon : () => "📍";

    const vb = _wizardMapViewBox || DEFAULT_WIZ_VB;
    const vbStr = `${vb.vx.toFixed(1)} ${vb.vy.toFixed(1)} ${vb.vw.toFixed(1)} ${vb.vh.toFixed(1)}`;
    const prefStroke = Math.max(0.28, Math.min(0.95, vb.vw / 950)).toFixed(2);

    const selPrefSet = new Set(_wizardSelected.map(x => x.prefId).filter(Boolean));
    const prefPathsSvg = Object.keys(prefPaths).map(pId => {
      const g = prefPaths[pId];
      const pObj = window.getPrefectureById ? window.getPrefectureById(pId) : null;
      const isFocused = _wizardMapPrefId === pId;
      const hasSel = selPrefSet.has(pId);
      const pTitle = pObj ? (en ? pObj.nameEn : pObj.nameJa) : pId;
      return `<path class="wiz-map-pref${isFocused ? " focused" : ""}${hasSel ? " selected" : ""}" data-wiz-pref="${window.escapeAttr(pId)}" d="${g.d}" stroke-width="${prefStroke}" onclick="wizardSelectMapPref(this.dataset.wizPref)"><title>${window.escapeHtml(pTitle)}</title></path>`;
    }).join("");

    const muniLod = buildWizardDynamicMuniContent(vb, en);
    _lastWizMuniSig = muniLod.sig;

    const munisList = (_wizardMapPrefId && typeof window.getMunisForPrefecture === "function")
      ? (window.getMunisForPrefecture(_wizardMapPrefId) || [])
      : ((_wizardMapPrefId && typeof window.getCitiesForPrefecture === "function") ? (window.getCitiesForPrefecture(_wizardMapPrefId) || []) : []);

    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));
    const fQuery = String(_wizardMapMuniFilter || "").trim().toLowerCase();
    const filteredMunis = fQuery
      ? munisList.filter(c =>
        String(c.nameEn || "").toLowerCase().includes(fQuery) ||
        String(c.rawNameEn || "").toLowerCase().includes(fQuery) ||
        String(c.nameJa || "").includes(_wizardMapMuniFilter.trim()) ||
        String(c.kana || "").includes(_wizardMapMuniFilter.trim())
      )
      : munisList;

    const headerBarHtml = pref ? `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <button type="button" class="btn" style="padding:3px 8px;font-size:11px;" onclick="wizardResetMapView()">← ${en ? "All Japan" : "全国へ戻る"}</button>
          <strong style="font-size:12.5px;">${getIcon(_wizardMapPrefId)} ${window.escapeHtml(en ? `${pref.nameEn} (${munisList.length} cities/towns/villages)` : `${pref.nameJa}（${munisList.length}市区町村）`)}</strong>
          <span style="font-size:11px;color:var(--ink-muted);">${en ? "Drag to pan • Scroll to zoom • Click any area" : "ドラッグ移動・ホイール拡大縮小・各町村クリック可"}</span>
        </div>
        <button type="button" class="btn btn-primary" style="padding:3px 9px;font-size:11px;" data-place-id="pref_${window.escapeAttr(_wizardMapPrefId)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">
          ${en ? `+ Add ${pref.nameEn}` : `+ ${pref.nameJa}を追加`}
        </button>
      </div>
    ` : `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
        <span style="font-size:11.5px;color:var(--ink-muted);font-weight:700;">
          ${en
            ? "Scroll anywhere to zoom in/out freely, drag to pan, or click any prefecture to inspect its cities, towns & villages:"
            : "ホイールで自由拡大縮小・ドラッグ移動・都道府県クリックで全市区町村を表示＆追加:"}
        </span>
        <span style="font-size:11px;font-weight:800;color:var(--indigo);">${en ? (vb.vw < 295 ? "🔍 Municipal View Active" : "🗾 All-Japan View") : (vb.vw < 295 ? "🔍 市区町村表示中" : "🗾 全国表示")}</span>
      </div>
    `;

    const cityChipsBelow = pref ? `
      <div style="margin-top:6px;">
        <input type="text" id="wizardMapMuniFilter" class="search-input" style="width:100%;margin-bottom:5px;padding:4px 9px;font-size:11.5px;"
          value="${window.escapeAttr(_wizardMapMuniFilter)}"
          placeholder="${window.escapeAttr(en ? `Filter all ${munisList.length} places in ${pref.nameEn}...` : `${pref.nameJa}内の全${munisList.length}市区町村を絞り込み...`)}"
          oninput="wizardFilterMapMunis(this.value)">
        <div id="wizardMapCityList" class="wizard-map-city-list">
          ${filteredMunis.map(c => {
            const isSel = selSet.has(String(c.nameEn).toLowerCase()) || selSet.has(String(c.id).toLowerCase());
            const icon = getIcon(c);
            return `<button type="button" class="pill wizard-map-city-btn ${isSel ? "active" : ""}" data-place-id="${window.escapeAttr(c.id)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">${icon} ${window.escapeHtml(en ? c.nameEn : c.nameJa)}</button>`;
          }).join("")}
        </div>
      </div>
    ` : "";

    wrap.innerHTML = `
      ${headerBarHtml}
      <div class="wizard-mini-map-box">
        <svg id="wizardJapanMapSvg" class="gmaps-svg" viewBox="${vbStr}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-label="Wizard Japan Place Picker Map">
          <g class="wiz-pref-layer">${prefPathsSvg}</g>
          <g id="wizardDynamicMuniLayer">${muniLod.html}</g>
        </svg>
        <div class="gmaps-zoom-controls" aria-label="Wizard Map Zoom Controls">
          <button type="button" class="gmaps-ctrl-btn" onclick="wizardZoomMap(0.68)" title="${en ? "Zoom in (reveals towns & villages)" : "拡大（市区町村を表示）"}">+</button>
          <button type="button" class="gmaps-ctrl-btn" onclick="wizardZoomMap(1.42)" title="${en ? "Zoom out" : "縮小"}">−</button>
          <button type="button" class="gmaps-ctrl-btn" onclick="wizardResetMapView()" title="${en ? "Reset to All Japan" : "全国全体に戻す"}">⌖</button>
        </div>
      </div>
      ${cityChipsBelow}
    `;
  }

  function renderWizardBody() {
    const popularWrap = document.getElementById("newTripCityChips");
    const searchPane = document.getElementById("wizardSearchPane");
    const mapPane = document.getElementById("wizardMapPane");
    if (popularWrap) popularWrap.style.display = _wizardMode === "popular" ? "flex" : "none";
    if (searchPane) searchPane.style.display = _wizardMode === "search" ? "block" : "none";
    if (mapPane) mapPane.style.display = _wizardMode === "map" ? "block" : "none";

    const backdrop = document.getElementById("newTripModalBackdrop");
    const modalCard = backdrop && backdrop.querySelector ? backdrop.querySelector(".modal-card") : null;
    if (modalCard && modalCard.classList) {
      modalCard.classList.toggle("wizard-map-expanded", _wizardMode === "map");
    }

    ["popular", "search", "map"].forEach(m => {
      const btn = document.getElementById(`btnWizMode_${m}`);
      if (btn && btn.classList) btn.classList.toggle("active", _wizardMode === m);
    });

    syncPopularChipsVisual();
    renderSelectedBar();
    if (_wizardMode === "search") renderSearchPanel();
    if (_wizardMode === "map") renderMapPickerPanel();
  }

  window.setWizardPickerMode = function(mode) {
    _wizardMode = (mode === "search" || mode === "map") ? mode : "popular";
    renderWizardBody();
    if (_wizardMode === "search") {
      const inp = document.getElementById("wizardPlaceSearchInput");
      if (inp && typeof inp.focus === "function") inp.focus();
    }
  };

  window.wizardOnSearchInput = function(val) {
    _wizardSearchQuery = String(val || "");
    renderSearchPanel();
  };

  window.wizardSearchQuickAdd = function() {
    const q = String(_wizardSearchQuery || "").trim();
    if (!q) return;
    const en = window.isEn();
    const dis = typeof window.disambiguateLocationInput === "function" ? window.disambiguateLocationInput(q, !en) : null;
    if (dis && dis.stop) {
      window.wizardTogglePlaceId(dis.stop.id, true);
      if (dis.corrected) {
        window.showToast(en
          ? `📍 Auto-selected "${dis.text}" (use Search results to pick other prefectures)`
          : `📍 「${dis.text}」を追加しました（同名自治体は候補一覧から選択可）`);
      }
      return;
    }
    const hits = typeof window.searchAllJapanPlaces === "function" ? window.searchAllJapanPlaces(q, 1) : [];
    if (hits[0]) window.wizardTogglePlaceId(hits[0].id, true);
  };

  window.wizardSelectMapPref = function(prefId) {
    _wizardMapPrefId = prefId || null;
    _wizardMapMuniFilter = "";
    _wizardMapViewBox = _wizardMapPrefId ? computePrefBboxViewBox(_wizardMapPrefId) : Object.assign({}, DEFAULT_WIZ_VB);
    renderMapPickerPanel();
  };

  window.wizardZoomMap = function(factor) {
    const svg = typeof document !== "undefined" ? document.getElementById("wizardJapanMapSvg") : null;
    const cur = svg ? parseWizViewBox(svg) : Object.assign({}, _wizardMapViewBox || DEFAULT_WIZ_VB);
    const nextW = Math.max(14, Math.min(1050, cur.vw * (Number(factor) || 1)));
    const scale = nextW / cur.vw;
    const nextH = cur.vh * scale;
    const cx = cur.vx + cur.vw / 2;
    const cy = cur.vy + cur.vh / 2;
    const nextVb = {
      vx: Math.max(-100, Math.min(960, cx - nextW / 2)),
      vy: Math.max(-80, Math.min(980, cy - nextH / 2)),
      vw: nextW,
      vh: nextH
    };
    if (svg) applyWizViewBox(svg, nextVb);
    else _wizardMapViewBox = nextVb;
  };

  window.wizardResetMapView = function() {
    _wizardMapPrefId = null;
    _wizardMapMuniFilter = "";
    _wizardMapViewBox = Object.assign({}, DEFAULT_WIZ_VB);
    renderMapPickerPanel();
  };

  window.wizardFilterMapMunis = function(val) {
    _wizardMapMuniFilter = String(val || "");
    const listEl = document.getElementById("wizardMapCityList");
    if (!listEl || !_wizardMapPrefId) {
      renderMapPickerPanel();
      return;
    }
    const en = window.isEn();
    const getIcon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon : () => "📍";
    const munisList = typeof window.getMunisForPrefecture === "function"
      ? (window.getMunisForPrefecture(_wizardMapPrefId) || [])
      : [];
    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));
    const q = _wizardMapMuniFilter.trim().toLowerCase();
    const filtered = q
      ? munisList.filter(c =>
        String(c.nameEn || "").toLowerCase().includes(q) ||
        String(c.rawNameEn || "").toLowerCase().includes(q) ||
        String(c.nameJa || "").includes(_wizardMapMuniFilter.trim()) ||
        String(c.kana || "").includes(_wizardMapMuniFilter.trim())
      )
      : munisList;
    listEl.innerHTML = filtered.map(c => {
      const isSel = selSet.has(String(c.nameEn).toLowerCase()) || selSet.has(String(c.id).toLowerCase());
      const icon = getIcon(c);
      return `<button type="button" class="pill wizard-map-city-btn ${isSel ? "active" : ""}" data-place-id="${window.escapeAttr(c.id)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">${icon} ${window.escapeHtml(en ? c.nameEn : c.nameJa)}</button>`;
    }).join("");
  };

  window.wizardTogglePlaceId = function(placeId, forceAddOnly) {
    if (!placeId) return;
    const svg = typeof document !== "undefined" ? document.getElementById("wizardJapanMapSvg") : null;
    if (svg) _wizardMapViewBox = parseWizViewBox(svg);
    const id = String(placeId);
    let item = null;
    if (id.startsWith("pref_")) {
      const prefId = id.slice(5);
      const p = window.getPrefectureById ? window.getPrefectureById(prefId) : null;
      if (p) {
        const icon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon(prefId) : "📍";
        item = makeSelectionItem(p.nameEn, icon, p.nameEn, p.nameJa, prefId);
      }
    } else if (typeof window.getCityStopByGeoId === "function") {
      const s = window.getCityStopByGeoId(id);
      if (s) {
        const icon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon(s) : "📍";
        item = makeSelectionItem(s.nameEn, icon, s.nameEn, s.nameJa, s.prefId);
      }
    }
    if (!item) item = resolveKeyToItem(id);

    const existingIdx = _wizardSelected.findIndex(x => x.key.toLowerCase() === item.key.toLowerCase());
    if (existingIdx >= 0) {
      if (!forceAddOnly) _wizardSelected.splice(existingIdx, 1);
    } else {
      _wizardSelected.push(item);
    }
    renderWizardBody();
  };

  window.reorderWizardSelection = function(fromIdx, toIdx) {
    const f = Number(fromIdx);
    const t = Number(toIdx);
    if (!Number.isInteger(f) || !Number.isInteger(t)) return false;
    if (f < 0 || f >= _wizardSelected.length || t < 0 || t >= _wizardSelected.length || f === t) return false;
    const [moved] = _wizardSelected.splice(f, 1);
    _wizardSelected.splice(t, 0, moved);
    renderWizardBody();
    return true;
  };

  window.handleWizardChipDragStart = function(idx, evt) {
    _wizardDragIdx = idx;
    if (evt && evt.dataTransfer) {
      evt.dataTransfer.effectAllowed = "move";
      try {
        evt.dataTransfer.setData("text/plain", String(idx));
      } catch (err) {
        console.warn("[JP Trip Planner] Drag dataTransfer error:", err);
      }
    }
    if (evt && evt.currentTarget && evt.currentTarget.classList) {
      evt.currentTarget.classList.add("is-dragging");
    }
  };

  window.handleWizardChipDragOver = function(idx, evt) {
    if (evt) {
      evt.preventDefault();
      if (evt.dataTransfer) evt.dataTransfer.dropEffect = "move";
      if (evt.currentTarget && evt.currentTarget.classList && _wizardDragIdx !== idx) {
        evt.currentTarget.classList.add("drag-over-wiz");
      }
    }
  };

  window.handleWizardChipDragLeave = function(evt) {
    if (evt && evt.currentTarget && evt.currentTarget.classList) {
      evt.currentTarget.classList.remove("drag-over-wiz");
    }
  };

  window.handleWizardChipDrop = function(targetIdx, evt) {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (evt.currentTarget && evt.currentTarget.classList) {
        evt.currentTarget.classList.remove("drag-over-wiz");
      }
    }
    let fromIdx = _wizardDragIdx;
    if ((fromIdx === null || fromIdx === undefined) && evt && evt.dataTransfer) {
      const raw = evt.dataTransfer.getData("text/plain");
      if (raw !== "" && !isNaN(Number(raw))) fromIdx = Number(raw);
    }
    _wizardDragIdx = null;
    if (fromIdx !== null && fromIdx !== undefined && fromIdx !== targetIdx) {
      window.reorderWizardSelection(fromIdx, targetIdx);
    }
  };

  window.handleWizardChipDragEnd = function() {
    _wizardDragIdx = null;
    if (typeof document !== "undefined" && document.querySelectorAll) {
      document.querySelectorAll(".wizard-route-chip.is-dragging, .wizard-route-chip.drag-over-wiz").forEach(el => {
        el.classList.remove("is-dragging", "drag-over-wiz");
      });
    }
  };

  window.removeWizardSelectionAt = function(idx) {
    if (idx >= 0 && idx < _wizardSelected.length) {
      _wizardSelected.splice(idx, 1);
      renderWizardBody();
    }
  };

  window.clearWizardSelection = function() {
    _wizardSelected = [];
    renderWizardBody();
  };

  window.renderNewTripWizardChips = function(defaultCities) {
    const list = Array.isArray(defaultCities) ? defaultCities : [];
    _wizardSelected = list.map(resolveKeyToItem);
    renderWizardBody();
  };

  window.toggleWizardCityChip = function(btn) {
    if (!btn || !btn.classList) return;
    const cityKey = btn.dataset && btn.dataset.city;
    if (cityKey) {
      const idx = _wizardSelected.findIndex(x => x.key.toLowerCase() === cityKey.toLowerCase());
      if (idx >= 0) {
        _wizardSelected.splice(idx, 1);
      } else {
        _wizardSelected.push(resolveKeyToItem(cityKey));
      }
      renderWizardBody();
    } else {
      btn.classList.toggle("active");
    }
  };

  window.openNewTripModal = function() {
    const en = window.isEn();
    const nameEl = document.getElementById("newTripTitleInput");
    const startEl = document.getElementById("newTripStartInput");
    const daysEl = document.getElementById("newTripDaysInput");
    const costSel = document.getElementById("newTripCostMode");
    const emptyChk = document.getElementById("newTripEmptySlots");
    const searchEl = document.getElementById("wizardPlaceSearchInput");

    if (nameEl) nameEl.value = en ? "My Custom Japan Itinerary" : "マイカスタム日本旅行";
    if (startEl) startEl.value = state.startDate || "2027-04-01";
    if (daysEl) daysEl.value = "7";
    if (costSel) costSel.value = "blank";
    if (emptyChk) emptyChk.checked = true;
    if (searchEl) searchEl.value = "";

    _wizardMode = "popular";
    _wizardSearchQuery = "";
    _wizardMapPrefId = null;
    _wizardMapMuniFilter = "";
    _wizardMapViewBox = Object.assign({}, DEFAULT_WIZ_VB);
    window.renderNewTripWizardChips(["Tokyo"]);

    const modal = document.getElementById("newTripModalBackdrop");
    if (modal && modal.classList) modal.classList.add("open");
  };

  window.submitNewBlankTrip = function() {
    const en = window.isEn();
    const nameEl = document.getElementById("newTripTitleInput");
    const startEl = document.getElementById("newTripStartInput");
    const daysEl = document.getElementById("newTripDaysInput");
    const costSel = document.getElementById("newTripCostMode");
    const emptyChk = document.getElementById("newTripEmptySlots");
    const chipWrap = document.getElementById("newTripCityChips");

    const cleanDesc = window.sanitizeTripDescriptor(nameEl ? nameEl.value : "") || (en ? "Custom Japan Itinerary" : "カスタム日本旅行プラン");
    const startDate = (startEl && startEl.value) ? startEl.value : "2027-04-01";
    const daysCount = Math.max(1, Math.min(60, parseInt(daysEl ? daysEl.value : "7", 10) || 7));
    const costMode = costSel ? costSel.value : "blank";
    const emptySlots = emptyChk ? !!emptyChk.checked : true;

    let domPopularCities = [];
    if (chipWrap && typeof chipWrap.querySelectorAll === "function") {
      chipWrap.querySelectorAll(".wizard-city-chip.active").forEach(b => {
        if (b && b.dataset && b.dataset.city) domPopularCities.push(b.dataset.city);
      });
    }

    // Compare sorted sets so dragging selected route chips into a custom order is never overwritten by DOM chip order
    const domSetKey = domPopularCities.slice().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join("\x01").toLowerCase();
    const lastSetKey = _wizardLastPopularKeys.slice().sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())).join("\x01").toLowerCase();
    const domChanged = domSetKey !== lastSetKey;

    let cities = [];
    if (domChanged && domPopularCities.length > 0) {
      cities = domPopularCities.slice();
    } else if (_wizardSelected.length > 0) {
      cities = _wizardSelected.map(x => x.key);
    } else if (domPopularCities.length > 0) {
      cities = domPopularCities.slice();
    }
    if (cities.length === 0) cities = ["Tokyo"];

    _wizardSelected = [];
    _wizardLastPopularKeys = [];

    window.pushUndoSnapshot("Create new blank trip");
    const payload = window.buildBlankTripPayload({
      titleEn: cleanDesc,
      titleJa: cleanDesc,
      startDate,
      daysCount,
      cities,
      costMode,
      emptySlots
    });

    state.activePreset = "__draft__";
    state.activeRegionKey = "ALL";
    state.activeFoodKey = "ALL";
    state.activeAccessKey = "ALL";
    state.activeGuideKey = "ALL";
    state.customMapLocations = [];
    state.manualMapZoom = null;
    state.focusedPrefId = null;
    state.selectedMapStopId = null;
    state.mapPopupDismissed = false;
    state.mapScopeMode = "schedule";
    state.syncedLocalTransit = false;
    state.customPassPrice = null;
    state.prepDone = {};
    state.expandedDays = { 1: true };
    state.startDate = payload.startDate;
    state.endDate = payload.endDate;
    state.customTitleEn = payload.titleEn;
    state.customTitleJa = payload.titleJa;
    state.customSubtitleEn = payload.subtitleEn;
    state.customSubtitleJa = payload.subtitleJa;
    state.selectedPassId = "none";
    state.passStartDay = 1;
    state.dataEn = payload.dataEn;
    state.dataJa = payload.dataJa;
    state.shoppingList = [];

    if (!emptySlots && typeof window.ensureAllDaysHaveTimeSlots === "function") {
      window.ensureAllDaysHaveTimeSlots();
    }
    window.closeAllModals();
    window.applySeasonThemeFromStartDate();
    window.switchTab("itinerary", null);
    window.saveState();
    window.renderAll();
    window.showToast(en
      ? `➕ Created ${daysCount}-day plan (${cities.join(" → ")}) — edit any card & click Save when ready`
      : `➕ 新規${daysCount}日間プランを作成しました（各カード編集後に保存できます）`);
  };

  // Free drag-to-pan & cursor-anchored wheel zoom on the Wizard Interactive Map
  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("pointerdown", evt => {
      const svg = evt && evt.target && evt.target.closest ? evt.target.closest("#wizardJapanMapSvg") : null;
      if (!svg || evt.button !== 0) return;
      _wizMapDrag = {
        svg,
        startX: evt.clientX,
        startY: evt.clientY,
        moved: false,
        startVb: parseWizViewBox(svg)
      };
    });

    document.addEventListener("pointermove", evt => {
      if (!_wizMapDrag || !_wizMapDrag.svg) return;
      const dxPx = evt.clientX - _wizMapDrag.startX;
      const dyPx = evt.clientY - _wizMapDrag.startY;
      if (!_wizMapDrag.moved && Math.hypot(dxPx, dyPx) < 4) return;
      _wizMapDrag.moved = true;
      _wizSuppressClick = true;
      const rect = _wizMapDrag.svg.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const vb = _wizMapDrag.startVb;
      const unitsPerPx = Math.max(vb.vw / rect.width, vb.vh / rect.height);
      applyWizViewBox(_wizMapDrag.svg, {
        vx: Math.max(-100, Math.min(960, vb.vx - dxPx * unitsPerPx)),
        vy: Math.max(-80, Math.min(980, vb.vy - dyPx * unitsPerPx)),
        vw: vb.vw,
        vh: vb.vh
      });
    });

    const endWizDrag = () => {
      if (_wizMapDrag && _wizMapDrag.moved) {
        setTimeout(() => { _wizSuppressClick = false; }, 60);
      }
      _wizMapDrag = null;
    };
    document.addEventListener("pointerup", endWizDrag);
    document.addEventListener("pointercancel", endWizDrag);

    document.addEventListener("click", evt => {
      if (_wizSuppressClick && evt && evt.target && evt.target.closest && evt.target.closest("#wizardJapanMapSvg")) {
        evt.stopPropagation();
        evt.preventDefault();
        _wizSuppressClick = false;
      }
    }, true);

    document.addEventListener("wheel", evt => {
      const svg = evt && evt.target && evt.target.closest ? evt.target.closest("#wizardJapanMapSvg") : null;
      if (!svg) return;
      evt.preventDefault();
      const rect = svg.getBoundingClientRect();
      if (!rect || !rect.width || !rect.height) return;
      const cur = parseWizViewBox(svg);
      const factor = evt.deltaY < 0 ? 0.84 : 1.19;
      const nextW = Math.max(14, Math.min(1050, cur.vw * factor));
      const scale = nextW / cur.vw;
      const nextH = cur.vh * scale;

      const relX = Math.max(0, Math.min(1, (evt.clientX - rect.left) / rect.width));
      const relY = Math.max(0, Math.min(1, (evt.clientY - rect.top) / rect.height));
      const anchorX = cur.vx + relX * cur.vw;
      const anchorY = cur.vy + relY * cur.vh;

      applyWizViewBox(svg, {
        vx: Math.max(-100, Math.min(960, anchorX - relX * nextW)),
        vy: Math.max(-80, Math.min(980, anchorY - relY * nextH)),
        vw: nextW,
        vh: nextH
      });
    }, { passive: false });
  }
})();
