// Preset Management, New Trip Wizard Submit, Overwrite/New Guards, Share/Export (.jptrip.json) & PDF Print

window.closeAllModals = function() {
  ["confirmModalBackdrop", "savePresetModalBackdrop", "newTripModalBackdrop", "shareExportModalBackdrop"].forEach(id => {
    const el = document.getElementById(id);
    if (el && el.classList) el.classList.remove("open");
  });
};

if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") window.closeAllModals();
  });
}

window.populatePresetSelectDropdown = function() {
  const sel = document.getElementById("tripPresetSelect");
  if (!sel) return;
  const en = window.isEn();
  const curVal = state.activePreset || "tohoku22";
  let html = "";

  if (curVal === "__draft__") {
    html += `<option value="__draft__">${window.escapeHtml(en ? "📝 Unsaved Custom Draft (Click Save)" : "📝 未保存の新規プラン（保存してください）")}</option>`;
  }

  html += window.PRESET_CATALOG_META.map(p =>
    `<option value="${window.escapeAttr(p.id)}">${window.escapeHtml(en ? p.labelEn : p.labelJa)}</option>`
  ).join("");

  if (Array.isArray(state.savedCustomPresets) && state.savedCustomPresets.length > 0) {
    html += `<optgroup label="${window.escapeAttr(en ? "★ Saved User Presets" : "★ 保存済みカスタムプリセット")}">` +
      state.savedCustomPresets.map(cp =>
        `<option value="${window.escapeAttr(cp.id)}">${window.escapeHtml(en ? cp.labelEn : cp.labelJa)}</option>`
      ).join("") +
      `</optgroup>`;
  }
  const delBtn = document.getElementById("btnDeleteCustomPreset");
  const delVis = String(curVal).startsWith("userpreset_") ? "inline-flex" : "none";
  if (sel._lastHtml !== html) {
    sel.innerHTML = html;
    sel._lastHtml = html;
  }
  if (sel.value !== curVal) sel.value = curVal;

  if (delBtn && delBtn.style.display !== delVis) {
    delBtn.style.display = delVis;
  }
};

function buildSnapshotFromActiveState(descEn, descJa, existingId) {
  const en = window.isEn();
  const daysLen = (state.dataEn && state.dataEn.days ? state.dataEn.days.length : 1) || 1;
  const cleanEn = window.sanitizeTripDescriptor(descEn || state.customTitleEn || "Custom Japan Route");
  const cleanJa = window.sanitizeTripDescriptor(descJa || state.customTitleJa || cleanEn || "マイカスタム旅程");
  const labelEn = window.formatPresetLabel(cleanEn, state.startDate || "", daysLen, false);
  const labelJa = window.formatPresetLabel(cleanJa, state.startDate || "", daysLen, true);
  return {
    id: existingId || ("userpreset_" + Date.now() + "_" + Math.floor(Math.random() * 1000)),
    labelEn,
    labelJa,
    startDate: state.startDate || "",
    endDate: state.endDate || "",
    customTitleEn: cleanEn,
    customTitleJa: cleanJa,
    customSubtitleEn: state.customSubtitleEn || "",
    customSubtitleJa: state.customSubtitleJa || "",
    currencyCode: state.currencyCode || "SGD",
    fxRate: state.fxRate !== undefined ? Number(state.fxRate) : 122,
    paxCount: parseInt(state.paxCount, 10) || 1,
    budgetMode: state.budgetMode || "group",
    shareHotelRoom: typeof state.shareHotelRoom === "boolean" ? state.shareHotelRoom : true,
    budgetTargetJpy: Number(state.budgetTargetJpy) || 0,
    taxFreeEnabled: !!state.taxFreeEnabled,
    selectedPassId: state.selectedPassId || "none",
    passStartDay: state.passStartDay || 1,
    customPassPrice: state.customPassPrice != null ? state.customPassPrice : null,
    syncedLocalTransit: !!state.syncedLocalTransit,
    prepDone: JSON.parse(JSON.stringify(state.prepDone || {})),
    dataEn: JSON.parse(JSON.stringify(state.dataEn)),
    dataJa: JSON.parse(JSON.stringify(state.dataJa)),
    shoppingList: JSON.parse(JSON.stringify(state.shoppingList || [])),
    updatedAt: new Date().toISOString(),
    _activeLangHint: en ? "en" : "ja"
  };
}

const _savedFingerprintCache = typeof WeakMap === "function" ? new WeakMap() : null;
let _dirtyCheckCache = null;

function buildRawPresetFingerprint(obj) {
  return JSON.stringify({
    startDate: obj.startDate || "",
    endDate: obj.endDate || "",
    currencyCode: obj.currencyCode || "SGD",
    fxRate: Number(obj.fxRate) || 122,
    paxCount: parseInt(obj.paxCount, 10) || 1,
    budgetMode: obj.budgetMode || "group",
    shareHotelRoom: !!obj.shareHotelRoom,
    budgetTargetJpy: Number(obj.budgetTargetJpy) || 0,
    taxFreeEnabled: !!obj.taxFreeEnabled,
    selectedPassId: obj.selectedPassId || "none",
    passStartDay: parseInt(obj.passStartDay, 10) || 1,
    customPassPrice: obj.customPassPrice != null ? Number(obj.customPassPrice) : null,
    syncedLocalTransit: !!obj.syncedLocalTransit,
    customSubtitleEn: obj.customSubtitleEn || "",
    customSubtitleJa: obj.customSubtitleJa || "",
    dataEn: obj.dataEn,
    dataJa: obj.dataJa,
    shoppingList: obj.shoppingList || []
  });
}

function computePresetFingerprint(obj) {
  if (!obj) return "";
  const isSavedObj = _savedFingerprintCache && obj.id && String(obj.id).startsWith("userpreset_") && typeof obj.updatedAt === "string";
  if (isSavedObj) {
    const cached = _savedFingerprintCache.get(obj);
    if (cached && cached.updatedAt === obj.updatedAt) return cached.fp;
    const fp = buildRawPresetFingerprint(obj);
    _savedFingerprintCache.set(obj, { updatedAt: obj.updatedAt, fp });
    return fp;
  }
  return buildRawPresetFingerprint(obj);
}

window.isActiveTripDirty = function() {
  if (!state || !state.dataEn) return false;
  const activeId = String(state.activePreset || "");
  if (activeId === "__draft__") return true;
  if (!activeId.startsWith("userpreset_")) return false;
  const saved = (state.savedCustomPresets || []).find(p => p.id === activeId);
  if (!saved) return true;

  const daysLen = Array.isArray(state.dataEn.days) ? state.dataEn.days.length : 0;
  const cacheKey = `${state._rev || 0}|${activeId}|${saved.updatedAt || ""}|${state.customTitleEn || ""}|${state.customTitleJa || ""}|${daysLen}`;
  if (_dirtyCheckCache && _dirtyCheckCache.key === cacheKey) {
    return _dirtyCheckCache.dirty;
  }

  let dirty = false;
  if (computePresetFingerprint(saved) !== computePresetFingerprint(state)) {
    dirty = true;
  } else {
    const curEn = window.sanitizeTripDescriptor(state.customTitleEn || "");
    const curJa = window.sanitizeTripDescriptor(state.customTitleJa || "");
    const savEn = window.sanitizeTripDescriptor(saved.customTitleEn || saved.labelEn || "");
    const savJa = window.sanitizeTripDescriptor(saved.customTitleJa || saved.labelJa || "");
    dirty = (curEn !== savEn) || (curJa !== savJa);
  }
  _dirtyCheckCache = { key: cacheKey, dirty };
  return dirty;
};

window.resolveSavePresetContext = function(rawInput) {
  const en = window.isEn();
  const list = Array.isArray(state.savedCustomPresets) ? state.savedCustomPresets : [];
  const typedClean = window.sanitizeTripDescriptor(
    rawInput !== undefined ? rawInput : (en ? state.customTitleEn : state.customTitleJa)
  );
  const daysLen = (state.dataEn && state.dataEn.days ? state.dataEn.days.length : 1) || 1;
  const effectiveClean = typedClean || (en ? "Custom Japan Route" : "マイカスタム旅程");
  const formattedPreview = window.formatPresetLabel(effectiveClean, state.startDate || "", daysLen, !en);

  const activeSaved = String(state.activePreset || "").startsWith("userpreset_")
    ? list.find(p => p.id === state.activePreset) || null
    : null;

  const matchingByName = list.find(p => {
    const descEn = window.sanitizeTripDescriptor(p.customTitleEn || p.labelEn);
    const descJa = window.sanitizeTripDescriptor(p.customTitleJa || p.labelJa);
    return (descEn && descEn.toLowerCase() === effectiveClean.toLowerCase()) ||
           (descJa && descJa.toLowerCase() === effectiveClean.toLowerCase());
  }) || null;

  const overwriteTarget = activeSaved || matchingByName;
  const unchanged = !!(overwriteTarget && computePresetFingerprint(overwriteTarget) === computePresetFingerprint(state));

  return { effectiveClean, formattedPreview, activeSaved, matchingByName, overwriteTarget, unchanged };
};

window.updateSavePresetModalPreview = function(noticeErrorText) {
  const en = window.isEn();
  const inp = document.getElementById("savePresetNameInput");
  const prevEl = document.getElementById("savePresetPreviewVal");
  const noticeEl = document.getElementById("savePresetStatusNotice");
  const btnOver = document.getElementById("btnModalOverwritePreset");
  const btnNew = document.getElementById("btnModalSaveAsNewPreset");

  const ctx = window.resolveSavePresetContext(inp ? inp.value : undefined);
  if (prevEl) prevEl.textContent = ctx.formattedPreview;

  if (btnOver && btnNew) {
    if (ctx.overwriteTarget) {
      const targetName = en ? ctx.overwriteTarget.labelEn : ctx.overwriteTarget.labelJa;
      const shortTarget = targetName.length > 42 ? (targetName.slice(0, 40) + "…") : targetName;
      btnOver.style.display = "inline-flex";
      btnOver.textContent = en ? `Overwrite "${shortTarget}"` : `「${shortTarget}」を上書き保存`;
      btnOver.className = "btn btn-primary";
      btnNew.className = "btn";
    } else {
      btnOver.style.display = "none";
      btnNew.className = "btn btn-primary";
    }
  }

  if (noticeEl) {
    if (noticeErrorText) {
      noticeEl.className = "preset-notice-box error";
      noticeEl.textContent = noticeErrorText;
      noticeEl.style.display = "block";
    } else if (ctx.unchanged) {
      noticeEl.className = "preset-notice-box";
      noticeEl.textContent = en
        ? "ℹ️ No edits since your last save. Choose Overwrite to update in place (no duplicate), or change the description and click Save as New."
        : "ℹ️ 前回保存時から内容の変更はありません。重複を作らない場合は「上書き保存」、別案を作る場合は名前を変えて「新規保存」を選んでください。";
      noticeEl.style.display = "block";
    } else if (ctx.overwriteTarget && !ctx.activeSaved) {
      noticeEl.className = "preset-notice-box";
      noticeEl.textContent = en
        ? "ℹ️ A saved preset with this name already exists. Overwrite it cleanly or edit the name for a new copy."
        : "ℹ️ 同じ名前の保存済みプリセットが存在します。上書き保存するか、別名を入力して新規保存してください。";
      noticeEl.style.display = "block";
    } else {
      noticeEl.style.display = "none";
    }
  }
  return ctx;
};

window.openSavePresetModal = function() {
  const en = window.isEn();
  const inp = document.getElementById("savePresetNameInput");
  const curDesc = window.sanitizeTripDescriptor(en ? state.customTitleEn : state.customTitleJa);
  if (inp) inp.value = curDesc;
  window.updateSavePresetModalPreview();
  const modal = document.getElementById("savePresetModalBackdrop");
  if (modal && modal.classList) modal.classList.add("open");
};

window.saveCurrentAsCustomPreset = window.openSavePresetModal;

window.confirmOverwritePreset = function() {
  const en = window.isEn();
  const inp = document.getElementById("savePresetNameInput");
  const ctx = window.resolveSavePresetContext(inp ? inp.value : undefined);
  const target = ctx.overwriteTarget;
  if (!target) {
    return window.confirmSaveAsNewPreset();
  }

  const nextEn = en ? ctx.effectiveClean : (window.sanitizeTripDescriptor(target.customTitleEn) || ctx.effectiveClean);
  const nextJa = !en ? ctx.effectiveClean : (window.sanitizeTripDescriptor(target.customTitleJa) || ctx.effectiveClean);
  const updated = buildSnapshotFromActiveState(nextEn, nextJa, target.id);
  const idx = state.savedCustomPresets.findIndex(p => p.id === target.id);
  if (idx >= 0) state.savedCustomPresets[idx] = updated;
  else state.savedCustomPresets.push(updated);

  state.activePreset = target.id;
  state.customTitleEn = updated.customTitleEn;
  state.customTitleJa = updated.customTitleJa;
  window.closeAllModals();
  window.saveState();
  window.populatePresetSelectDropdown();
  window.renderAll();
  window.showToast(en ? `💾 Updated preset "${updated.labelEn}" (no duplicate created)` : `💾 プリセット「${updated.labelJa}」を上書き保存しました`);
  return updated;
};

window.confirmSaveAsNewPreset = function() {
  const en = window.isEn();
  const inp = document.getElementById("savePresetNameInput");
  const ctx = window.resolveSavePresetContext(inp ? inp.value : undefined);

  if (ctx.matchingByName) {
    const err = en
      ? "⚠️ A saved preset with that exact description already exists. Enter a different name for a new copy, or click Overwrite."
      : "⚠️ 同じ名前のプリセットがすでに存在します。新規保存するには別の名前を入力するか、「上書き保存」を選んでください。";
    window.updateSavePresetModalPreview(err);
    if (inp && typeof inp.focus === "function") inp.focus();
    return null;
  }

  if (!Array.isArray(state.savedCustomPresets)) state.savedCustomPresets = [];
  const nextEn = ctx.effectiveClean;
  const nextJa = !en ? ctx.effectiveClean : (ctx.effectiveClean === window.sanitizeTripDescriptor(state.customTitleEn) ? (window.sanitizeTripDescriptor(state.customTitleJa) || ctx.effectiveClean) : ctx.effectiveClean);
  const created = buildSnapshotFromActiveState(nextEn, nextJa, null);
  state.savedCustomPresets.push(created);

  state.activePreset = created.id;
  state.customTitleEn = created.customTitleEn;
  state.customTitleJa = created.customTitleJa;
  window.closeAllModals();
  window.saveState();
  window.populatePresetSelectDropdown();
  window.renderAll();
  window.showToast(en ? `💾 Saved new preset: "${created.labelEn}"!` : `💾 新規プリセット「${created.labelJa}」を保存しました！`);
  return created;
};

window.openNewTripModal = function() {
  const en = window.isEn();
  const nameEl = document.getElementById("newTripTitleInput");
  const startEl = document.getElementById("newTripStartInput");
  const daysEl = document.getElementById("newTripDaysInput");
  const costSel = document.getElementById("newTripCostMode");
  const emptyChk = document.getElementById("newTripEmptySlots");

  if (nameEl) nameEl.value = en ? "My Custom Japan Itinerary" : "マイカスタム日本旅行";
  if (startEl) startEl.value = state.startDate || "2027-04-01";
  if (daysEl) daysEl.value = "7";
  if (costSel) costSel.value = "blank";
  if (emptyChk) emptyChk.checked = true;

  if (typeof window.renderNewTripWizardChips === "function") {
    window.renderNewTripWizardChips(["Tokyo"]);
  }

  const modal = document.getElementById("newTripModalBackdrop");
  if (modal && modal.classList) modal.classList.add("open");
};

window.toggleWizardCityChip = function(btn) {
  if (!btn || !btn.classList) return;
  btn.classList.toggle("active");
};

window.renderNewTripWizardChips = function(defaultCities) {
  const wrap = document.getElementById("newTripCityChips");
  if (!wrap || !Array.isArray(window.WIZARD_CITIES)) return;
  const en = window.isEn();
  const activeSet = new Set(Array.isArray(defaultCities) ? defaultCities : []);
  wrap.innerHTML = window.WIZARD_CITIES.map(c => {
    const isActive = activeSet.has(c.key);
    return `<button type="button" class="pill wizard-city-chip ${isActive ? "active" : ""}" data-city="${window.escapeAttr(c.key)}" onclick="toggleWizardCityChip(this)">${window.escapeHtml(en ? c.labelEn : c.labelJa)}</button>`;
  }).join("");
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

  let cities = [];
  if (chipWrap && typeof chipWrap.querySelectorAll === "function") {
    const selectedBtns = chipWrap.querySelectorAll(".wizard-city-chip.active");
    selectedBtns.forEach(b => {
      if (b && b.dataset && b.dataset.city) cities.push(b.dataset.city);
    });
  }
  if (cities.length === 0) cities = ["Tokyo"];

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

window.openShareExportModal = function() {
  const modal = document.getElementById("shareExportModalBackdrop");
  if (modal && modal.classList) modal.classList.add("open");
};

window.confirmDeleteCustomPreset = function() {
  const id = state.activePreset;
  if (!String(id).startsWith("userpreset_")) return;
  const en = window.isEn();
  const cp = (state.savedCustomPresets || []).find(p => p.id === id);
  const name = cp ? (en ? cp.labelEn : cp.labelJa) : id;
  window.showConfirmModal(
    en ? "Delete Custom Preset?" : "カスタムプリセットを削除しますか？",
    en ? `Remove saved preset "${name}" permanently?` : `保存済みプリセット「${name}」を削除しますか？`,
    function() {
      state.savedCustomPresets = (state.savedCustomPresets || []).filter(p => p.id !== id);
      window.loadTripPreset("tohoku22", { silent: true, force: true });
      window.showToast(en ? "🗑️ Deleted custom preset" : "🗑️ カスタムプリセットを削除しました");
    },
    en ? "Delete" : "削除"
  );
};

window.loadTripPreset = function(presetKey, opts) {
  if (presetKey === "__draft__") return;
  const options = opts || {};

  if (state.activePreset === "__draft__" && presetKey !== "__draft__" && !options.force && !options.silent && typeof document !== "undefined") {
    const sel = document.getElementById("tripPresetSelect");
    if (sel) sel.value = "__draft__";
    const en = window.isEn();
    window.showConfirmModal(
      en ? "Leave Unsaved Draft?" : "未保存の新規プランを切り替えますか？",
      en
        ? "Switching presets replaces your current unsaved draft (you can Save first or Undo afterward)."
        : "プリセットを切り替えると現在の未保存プランが置き換わります（先に保存するか、後から元に戻すことも可能です）。",
      function() {
        window.loadTripPreset(presetKey, Object.assign({}, options, { force: true }));
      },
      en ? "Switch Preset" : "切り替える"
    );
    return;
  }

  if (!options.skipUndo && state.dataEn) {
    window.pushUndoSnapshot("Switch preset");
  }

  state.activePreset = presetKey;
  state.activeRegionKey = "ALL";
  state.activeFoodKey = "ALL";
  state.activeAccessKey = "ALL";
  state.activeGuideKey = "ALL";
  state.customMapLocations = [];
  state.manualMapZoom = null;
  state.focusedPrefId = null;
  state.selectedMapStopId = null;
  state.mapScopeMode = "schedule";
  state.syncedLocalTransit = false;
  state.customPassPrice = null;
  state.prepDone = {};
  state.expandedDays = { 1: true };

  if (presetKey && presetKey.startsWith("userpreset_") && Array.isArray(state.savedCustomPresets)) {
    const found = state.savedCustomPresets.find(p => p.id === presetKey);
    if (found) {
      state.startDate = found.startDate;
      state.endDate = found.endDate;
      state.customTitleEn = window.sanitizeTripDescriptor(found.customTitleEn || found.labelEn);
      state.customTitleJa = window.sanitizeTripDescriptor(found.customTitleJa || found.labelJa);
      state.customSubtitleEn = found.customSubtitleEn;
      state.customSubtitleJa = found.customSubtitleJa;
      if (found.currencyCode) state.currencyCode = found.currencyCode;
      if (found.fxRate !== undefined) state.fxRate = found.fxRate;
      if (found.paxCount !== undefined) state.paxCount = found.paxCount;
      if (found.budgetMode) state.budgetMode = found.budgetMode;
      if (typeof found.shareHotelRoom === "boolean") state.shareHotelRoom = found.shareHotelRoom;
      if (found.budgetTargetJpy !== undefined) state.budgetTargetJpy = found.budgetTargetJpy;
      if (typeof found.taxFreeEnabled === "boolean") state.taxFreeEnabled = found.taxFreeEnabled;
      state.selectedPassId = found.selectedPassId || "none";
      state.passStartDay = found.passStartDay || 1;
      state.customPassPrice = found.customPassPrice != null ? found.customPassPrice : null;
      state.syncedLocalTransit = !!found.syncedLocalTransit;
      state.prepDone = found.prepDone ? JSON.parse(JSON.stringify(found.prepDone)) : {};
      state.dataEn = JSON.parse(JSON.stringify(found.dataEn));
      state.dataJa = JSON.parse(JSON.stringify(found.dataJa));
      state.shoppingList = JSON.parse(JSON.stringify(found.shoppingList || []));
      if (typeof window.ensureAllDaysHaveTimeSlots === "function") {
        window.ensureAllDaysHaveTimeSlots();
      }
      window.applySeasonThemeFromStartDate();
      window.saveState();
      if (typeof window.renderAll === "function" && !options.silent) {
        window.renderAll();
        window.showToast(window.isEn() ? `🗾 Loaded saved preset: ${found.labelEn}` : `🗾 プリセット「${found.labelJa}」を読み込みました`);
      }
      return;
    }
  }

  const payload = window.getPresetPayload(presetKey);
  state.startDate = payload.startDate;
  state.endDate = payload.endDate;
  state.customTitleEn = window.sanitizeTripDescriptor(payload.titleEn);
  state.customTitleJa = window.sanitizeTripDescriptor(payload.titleJa);
  state.customSubtitleEn = payload.subtitleEn;
  state.customSubtitleJa = payload.subtitleJa;
  state.selectedPassId = payload.selectedPassId || "none";
  state.passStartDay = payload.passStartDay || 1;
  state.dataEn = payload.dataEn;
  state.dataJa = payload.dataJa;

  if (typeof window.ensureAllDaysHaveTimeSlots === "function") {
    window.ensureAllDaysHaveTimeSlots();
  }
  window.applySeasonThemeFromStartDate();
  window.saveState();
  if (typeof window.renderAll === "function" && !options.silent) {
    window.renderAll();
    window.showToast(window.isEn() ? "🗾 Loaded preset & updated Map, Season, Passes & Guides!" : "🗾 プリセットを読み込み、地図・季節背景・パス・ガイドを更新しました！");
  }
};

window.confirmResetDefaultData = function() {
  const en = window.isEn();
  window.showConfirmModal(
    en ? "Reset All Planner Data?" : "初期データにリセットしますか？",
    en
      ? "This resets the active trip, budget edits, shopping list, and currency back to the default Tohoku 22-day plan (saved custom presets are preserved)."
      : "現在の旅程・予算編集・買い物リスト・通貨設定を初期の東北22日間プランに戻します（保存済みカスタムプリセットは保持されます）。",
    function() {
      window.pushUndoSnapshot("Reset");
      state.fxRate = 122;
      state.currencyCode = "SGD";
      state.paxCount = 1;
      state.budgetMode = "group";
      state.shareHotelRoom = true;
      state.budgetTargetJpy = 0;
      state.taxFreeEnabled = false;
      state.shoppingList = [];
      window.ensureSeededUserPresets();
      window.loadTripPreset("tohoku22", { skipUndo: true, force: true });
      window.showToast(en ? "↺ Reset planner to default values" : "↺ 初期データにリセットしました");
    },
    en ? "Reset" : "リセット"
  );
};

window.buildPresetExportPayload = function() {
  const en = window.isEn();
  const snap = buildSnapshotFromActiveState(state.customTitleEn, state.customTitleJa, null);
  const envelope = {
    schema: "jp-trip-planner-preset-v2",
    exportedAt: new Date().toISOString(),
    appVersion: "2.3.0",
    preset: snap
  };
  const cleanName = window.sanitizeTripDescriptor(en ? snap.customTitleEn : snap.customTitleJa) || "Japan_Trip_Preset";
  const safeBase = cleanName.replace(/[\\/:*?"<>|\[\]]+/g, "_").replace(/\s+/g, "_").replace(/^_+|_+$/g, "").slice(0, 50) || "Japan_Trip_Preset";
  const daysLen = (snap.dataEn && snap.dataEn.days ? snap.dataEn.days.length : 1) || 1;
  return {
    envelope,
    json: JSON.stringify(envelope, null, 2),
    filename: `${safeBase}_${daysLen}d.jptrip.json`
  };
};

window.exportCurrentPresetFile = async function() {
  const en = window.isEn();
  const { json, filename } = window.buildPresetExportPayload();

  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.exportPreset === "function") {
    const res = await window.jpDesktopAPI.exportPreset(filename, json);
    if (res && res.ok) {
      window.closeAllModals();
      window.showToast(en ? `📤 Shared preset saved: ${res.filePath}` : `📤 共有用プリセットを保存しました: ${res.filePath}`);
    } else if (res && res.error) {
      window.showToast(en ? `⚠️ Preset export failed: ${res.error}` : `⚠️ プリセット書き出し失敗: ${res.error}`);
    }
    return;
  }
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  window.closeAllModals();
  window.showToast(en ? `📤 Downloaded shareable preset: ${filename}` : `📤 共有用プリセット ${filename} を保存しました`);
};

window.exportTripJson = async function() {
  const en = window.isEn();
  const payload = JSON.stringify(state, null, 2);
  const cleanTitle = window.sanitizeTripDescriptor(en ? state.customTitleEn : state.customTitleJa) || "Japan_Trip_Backup";
  const safeBase = cleanTitle.replace(/[\\/:*?"<>|\[\]]+/g, "_").replace(/\s+/g, "_").slice(0, 50) || "Japan_Trip_Backup";
  const filename = `${safeBase}_FullBackup.json`;

  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.exportJson === "function") {
    const res = await window.jpDesktopAPI.exportJson(filename, payload);
    if (res && res.ok) {
      window.closeAllModals();
      window.showToast(en ? `💾 Saved full backup: ${res.filePath}` : `💾 全データバックアップを保存しました: ${res.filePath}`);
    } else if (res && res.error) {
      window.showToast(en ? `⚠️ Backup export failed: ${res.error}` : `⚠️ バックアップ保存失敗: ${res.error}`);
    }
    return;
  }
  const blob = new Blob([payload], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  window.closeAllModals();
  window.showToast(en ? `💾 Exported ${filename}` : `💾 ${filename} を保存しました`);
};

window.triggerImportPresetFile = async function() {
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.importPreset === "function") {
    const res = await window.jpDesktopAPI.importPreset();
    if (res && res.ok && res.content) {
      window.applyImportedPresetText(res.content);
    } else if (res && res.error) {
      window.showToast(window.isEn() ? `⚠️ Import failed: ${res.error}` : `⚠️ 読み込み失敗: ${res.error}`);
    }
    return;
  }
  const inp = document.getElementById("jsonImportFileInput");
  if (inp) {
    inp.value = "";
    inp.click();
  }
};
window.triggerImportTripJson = window.triggerImportPresetFile;

window.handlePresetImportFile = function(evt) {
  const file = evt.target && evt.target.files && evt.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function() {
    window.applyImportedPresetText(reader.result);
  };
  reader.readAsText(file, "utf-8");
};
window.handleJsonImportFile = window.handlePresetImportFile;

window.applyImportedPresetText = function(text, opts) {
  const options = opts || {};
  const en = window.isEn();
  try {
    const parsed = JSON.parse(text);

    // Mode 1: Single portable preset (.jptrip.json)
    if (parsed && parsed.schema === "jp-trip-planner-preset-v2" && parsed.preset && parsed.preset.dataEn) {
      const p = parsed.preset;
      if (!p.dataJa) p.dataJa = JSON.parse(JSON.stringify(p.dataEn));
      if (!Array.isArray(state.savedCustomPresets)) state.savedCustomPresets = [];

      const daysLen = (p.dataEn.days && p.dataEn.days.length) || 1;
      const cleanEn = window.sanitizeTripDescriptor(p.customTitleEn || p.labelEn || "Imported Japan Trip");
      const cleanJa = window.sanitizeTripDescriptor(p.customTitleJa || p.labelJa || cleanEn);
      const labelEn = window.formatPresetLabel(cleanEn, p.startDate || "", daysLen, false);
      const labelJa = window.formatPresetLabel(cleanJa, p.startDate || "", daysLen, true);

      const importedObj = Object.assign({}, p, {
        customTitleEn: cleanEn,
        customTitleJa: cleanJa,
        labelEn,
        labelJa
      });

      const conflictIdx = state.savedCustomPresets.findIndex(existing => {
        const eEn = window.sanitizeTripDescriptor(existing.customTitleEn || existing.labelEn).toLowerCase();
        return (p.id && existing.id === p.id) || (eEn && eEn === cleanEn.toLowerCase());
      });

      const finalizeImport = (overwriteExisting) => {
        window.pushUndoSnapshot("Import Preset");
        let targetId;
        if (overwriteExisting && conflictIdx >= 0) {
          targetId = state.savedCustomPresets[conflictIdx].id;
          importedObj.id = targetId;
          state.savedCustomPresets[conflictIdx] = importedObj;
        } else {
          targetId = "userpreset_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
          importedObj.id = targetId;
          if (conflictIdx >= 0) {
            importedObj.customTitleEn = cleanEn + " (Imported)";
            importedObj.customTitleJa = cleanJa + " (読込コピー)";
            importedObj.labelEn = window.formatPresetLabel(importedObj.customTitleEn, importedObj.startDate, daysLen, false);
            importedObj.labelJa = window.formatPresetLabel(importedObj.customTitleJa, importedObj.startDate, daysLen, true);
          }
          state.savedCustomPresets.push(importedObj);
        }
        window.loadTripPreset(targetId, { skipUndo: true, force: true });
        window.showToast(en ? `📥 Imported shared preset: "${importedObj.labelEn}"!` : `📥 共有プリセット「${importedObj.labelJa}」を読み込みました！`);
        return targetId;
      };

      if (conflictIdx >= 0) {
        if (options.conflictMode === "overwrite") {
          const id = finalizeImport(true);
          return { mode: "preset", overwritten: true, id };
        }
        if (options.conflictMode === "copy") {
          const id = finalizeImport(false);
          return { mode: "preset", addedCopy: true, id };
        }
        window.showConfirmModal(
          en ? "Preset Already Saved" : "同名のプリセットがすでに存在します",
          en
            ? `"${labelEn}" already exists in your saved presets. Click Overwrite to update it in place (your other saved presets remain safe).`
            : `「${labelJa}」はすでに保存済みです。「上書き更新」を押すと既存の同プリセットを更新します（他のプリセットは保持されます）。`,
          function() { finalizeImport(true); },
          en ? "Overwrite" : "上書き更新"
        );
        return { mode: "preset", conflictPrompted: true };
      }

      const newId = finalizeImport(false);
      return { mode: "preset", added: true, id: newId };
    }

    // Mode 2: Legacy Full-State Backup JSON
    window.pushUndoSnapshot("Import JSON");
    if (!window.applyStateFromParsed(parsed)) {
      window.showToast(en ? "⚠️ Invalid preset or trip JSON file" : "⚠️ 無効なプリセットまたはJSONファイルです");
      return null;
    }
    window.saveState();
    window.renderAll();
    window.showToast(en ? "📂 Loaded full planner backup from JSON file!" : "📂 旅程バックアップJSONを読み込みました！");
    return { mode: "fullBackup" };
  } catch (e) {
    console.warn("[JP Trip Planner] Failed to parse preset/JSON file:", e);
    window.showToast(en ? "⚠️ Could not parse preset / JSON file" : "⚠️ ファイルの読み込みに失敗しました");
    return null;
  }
};
window.applyImportedJsonText = window.applyImportedPresetText;

window.printOrPdf = async function() {
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.printToPdf === "function") {
    const res = await window.jpDesktopAPI.printToPdf();
    if (res && res.ok) {
      window.showToast(window.isEn() ? `🖨️ Exported PDF: ${res.filePath}` : `🖨️ PDFを書き出しました: ${res.filePath}`);
      return;
    }
    if (res && res.error) {
      window.showToast(window.isEn() ? `⚠️ PDF export failed: ${res.error}` : `⚠️ PDF書き出しに失敗しました: ${res.error}`);
      return;
    }
    if (res && res.canceled) return;
  }
  window.print();
};
