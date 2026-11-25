// New Trip Wizard Destination Picker:
//   1) 12 Popular Quick Cards
//   2) Full All-Japan Search (47 Prefectures + 792 Cities + Iconic Villages with Smart Icons)
//   3) Interactive Mini-Map Picker (click any prefecture -> zoom & pick any city/prefecture)

(function() {
  let _wizardMode = "popular";
  let _wizardSelected = [];
  let _wizardLastPopularKeys = [];
  let _wizardSearchQuery = "";
  let _wizardMapPrefId = null;

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

  function renderSelectedBar() {
    const bar = document.getElementById("wizardSelectedBar");
    if (!bar) return;
    const en = window.isEn();
    const daysEl = document.getElementById("newTripDaysInput");
    const daysCount = Math.max(1, Math.min(60, parseInt(daysEl ? daysEl.value : "7", 10) || 7));
    const nights = Math.max(0, daysCount - 1);
    const active = _wizardSelected.length > 0 ? _wizardSelected : [resolveKeyToItem("Tokyo")];
    const perStop = active.length > 0 ? (nights / active.length).toFixed(1).replace(/\.0$/, "") : "0";

    bar.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:5px;">
        <span style="font-size:11px;font-weight:800;color:var(--ink-muted);">
          ${en ? `Selected Route Order (${active.length} ${active.length === 1 ? "stop" : "stops"} • ~${perStop}N/stop across ${daysCount}d):` : `選択順ルート（${active.length}地点 • 全${daysCount}日 / 各約${perStop}泊）:`}
        </span>
        ${_wizardSelected.length > 1 ? `<button type="button" class="btn" style="padding:2px 7px;font-size:10.5px;" onclick="clearWizardSelection()">${en ? "Clear" : "クリア"}</button>` : ""}
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:5px;">
        ${_wizardSelected.length === 0
          ? `<span style="font-size:11.5px;color:var(--ink-muted);font-weight:700;">${en ? "🗼 Tokyo (default if none selected)" : "🗼 東京（未選択時のデフォルト）"}</span>`
          : _wizardSelected.map((it, i) => `
            <span class="map-tag-chip">
              <span>${i + 1}. ${it.icon} ${window.escapeHtml(en ? it.regEn : it.regJa)}</span>
              <button type="button" data-idx="${i}" onclick="removeWizardSelectionAt(Number(this.dataset.idx))" title="${en ? "Remove" : "削除"}">×</button>
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
        ? "Search any of 792 cities, 47 prefectures or villages (e.g. Achi Village, Fuchu, Date)..."
        : "全792市・47都道府県・観光村を検索（例：阿智村、府中、伊達、札幌）...";
    }
    const resEl = document.getElementById("wizardSearchResults");
    if (!resEl) return;

    const results = typeof window.searchAllJapanPlaces === "function"
      ? window.searchAllJapanPlaces(_wizardSearchQuery, 30)
      : [];
    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));

    if (results.length === 0) {
      resEl.innerHTML = `<div style="padding:12px;text-align:center;font-size:12px;color:var(--ink-muted);font-weight:700;">${en ? "No matching Japanese city or prefecture found." : "一致する都市・都道府県が見つかりません。"}</div>`;
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
    const prefGeo = _wizardMapPrefId ? prefPaths[_wizardMapPrefId] : null;
    const getIcon = typeof window.getJapanPlaceIcon === "function" ? window.getJapanPlaceIcon : () => "📍";

    let vb = "26 28 895 922";
    if (prefGeo && prefGeo.bbox) {
      const [x0, y0, x1, y1] = prefGeo.bbox;
      const sx = Math.max(x1 - x0, 56);
      const sy = Math.max(y1 - y0, 56);
      const px = Math.max(sx * 0.22, 10);
      const py = Math.max(sy * 0.22, 10);
      vb = `${Math.max(20, Math.round(x0 - px))} ${Math.max(22, Math.round(y0 - py))} ${Math.min(915, Math.round(sx + px * 2))} ${Math.min(950, Math.round(sy + py * 2))}`;
    }

    const selSet = new Set(_wizardSelected.map(x => x.key.toLowerCase()));
    const selPrefSet = new Set(_wizardSelected.map(x => x.prefId).filter(Boolean));
    const prefPathsSvg = Object.keys(prefPaths).map(pId => {
      const g = prefPaths[pId];
      const isFocused = _wizardMapPrefId === pId;
      const hasSel = selPrefSet.has(pId);
      return `<path class="wiz-map-pref${isFocused ? " focused" : ""}${hasSel ? " selected" : ""}" data-wiz-pref="${window.escapeAttr(pId)}" d="${g.d}" stroke-width="${_wizardMapPrefId ? "0.45" : "0.85"}" onclick="wizardSelectMapPref(this.dataset.wizPref)"/>`;
    }).join("");

    let cityPolysSvg = "";
    let citiesList = [];
    if (_wizardMapPrefId && typeof window.getCitiesForPrefecture === "function") {
      citiesList = window.getCitiesForPrefecture(_wizardMapPrefId) || [];
      cityPolysSvg = citiesList.map(c => {
        const gId = c.geoId || c.id;
        const geo = window.JAPAN_CITY_PATHS && window.JAPAN_CITY_PATHS[gId];
        if (!geo || !geo.d) return "";
        const isSel = selSet.has(String(c.nameEn).toLowerCase()) || selSet.has(String(c.id).toLowerCase());
        return `<path class="wiz-map-city${isSel ? " selected" : ""}" data-place-id="${window.escapeAttr(c.id)}" d="${geo.d}" stroke-width="0.28" onclick="wizardTogglePlaceId(this.dataset.placeId)"><title>${window.escapeHtml(en ? c.nameEn : c.nameJa)}</title></path>`;
      }).join("");
    }

    const headerBarHtml = pref ? `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:6px;">
        <div style="display:flex;align-items:center;gap:6px;">
          <button type="button" class="btn" style="padding:3px 8px;font-size:11px;" onclick="wizardSelectMapPref(null)">← ${en ? "All Japan" : "全国へ戻る"}</button>
          <strong style="font-size:12.5px;">${getIcon(_wizardMapPrefId)} ${window.escapeHtml(en ? `${pref.nameEn} (${citiesList.length} cities/areas)` : `${pref.nameJa}（${citiesList.length}市区町村）`)}</strong>
        </div>
        <button type="button" class="btn btn-primary" style="padding:3px 9px;font-size:11px;" data-place-id="pref_${window.escapeAttr(_wizardMapPrefId)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">
          ${en ? `+ Add ${pref.nameEn}` : `+ ${pref.nameJa}を追加`}
        </button>
      </div>
    ` : `
      <div style="font-size:11.5px;color:var(--ink-muted);font-weight:700;margin-bottom:6px;">
        ${en ? "Click any prefecture on the map to zoom in & pick its cities or towns:" : "地図上の都道府県をクリックして拡大し、都市・町村を選択できます:"}
      </div>
    `;

    const cityChipsBelow = pref ? `
      <div id="wizardMapCityList" class="wizard-map-city-list">
        ${citiesList.slice(0, 60).map(c => {
          const isSel = selSet.has(String(c.nameEn).toLowerCase()) || selSet.has(String(c.id).toLowerCase());
          const icon = getIcon(c);
          return `<button type="button" class="pill wizard-map-city-btn ${isSel ? "active" : ""}" data-place-id="${window.escapeAttr(c.id)}" onclick="wizardTogglePlaceId(this.dataset.placeId)">${icon} ${window.escapeHtml(en ? c.nameEn : c.nameJa)}</button>`;
        }).join("")}
      </div>
    ` : "";

    wrap.innerHTML = `
      ${headerBarHtml}
      <div class="wizard-mini-map-box">
        <svg viewBox="${vb}" width="100%" height="210" preserveAspectRatio="xMidYMid meet" aria-label="Wizard Japan Place Picker Map">
          <g>${prefPathsSvg}</g>
          <g>${cityPolysSvg}</g>
        </svg>
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
          : `📍 「${dis.text}」を追加しました（同名都市は候補一覧から選択可）`);
      }
      return;
    }
    const hits = typeof window.searchAllJapanPlaces === "function" ? window.searchAllJapanPlaces(q, 1) : [];
    if (hits[0]) window.wizardTogglePlaceId(hits[0].id, true);
  };

  window.wizardSelectMapPref = function(prefId) {
    _wizardMapPrefId = prefId || null;
    renderMapPickerPanel();
  };

  window.wizardTogglePlaceId = function(placeId, forceAddOnly) {
    if (!placeId) return;
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

    // Respect external DOM mocks on #newTripCityChips while preserving ordered Search & Map selections in real UI
    const domChanged = JSON.stringify(domPopularCities) !== JSON.stringify(_wizardLastPopularKeys);
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
})();
