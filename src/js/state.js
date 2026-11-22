// Application State, Persistence, Preset Loader, Undo Snapshot & JSON Portability

window.STORAGE_KEY = "jpTripPlanner_v5_state";
window.DOW_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
window.DOW_JA = ["日", "月", "火", "水", "木", "金", "土"];

window.state = {
  version: 5,
  lang: "en",
  currencyCode: "SGD",
  fxRate: 122,
  paxCount: 1,
  budgetMode: "group", // "group" | "per_person"
  shareHotelRoom: true,
  budgetTargetJpy: 0,
  taxFreeEnabled: false,
  darkMode: false,
  animationsPaused: false,
  heroPeek: false,
  activeTab: "overview",
  activePreset: "tohoku22",
  activeRegionKey: "ALL",
  activeFoodKey: "ALL",
  activeAccessKey: "ALL",
  activeGuideKey: "ALL",
  mapScopeMode: "schedule",
  customMapLocations: [],
  manualMapZoom: null,
  startDate: "2026-10-21",
  endDate: "2026-11-11",
  customTitleEn: null,
  customTitleJa: null,
  customSubtitleEn: null,
  customSubtitleJa: null,
  selectedPassId: "jreast10",
  passStartDay: 3,
  customPassPrice: null,
  syncedLocalTransit: false,
  prepDone: {},
  expandedDays: { 1: true },
  shoppingList: [],
  savedCustomPresets: [],
  dataEn: null,
  dataJa: null
};

const _undoStack = [];

window.pushUndoSnapshot = function(label) {
  try {
    const snap = JSON.stringify({
      label: label || "",
      activePreset: state.activePreset,
      startDate: state.startDate,
      endDate: state.endDate,
      customTitleEn: state.customTitleEn,
      customTitleJa: state.customTitleJa,
      selectedPassId: state.selectedPassId,
      passStartDay: state.passStartDay,
      customPassPrice: state.customPassPrice,
      syncedLocalTransit: state.syncedLocalTransit,
      shoppingList: state.shoppingList,
      dataEn: state.dataEn,
      dataJa: state.dataJa
    });
    _undoStack.push(snap);
    if (_undoStack.length > 15) _undoStack.shift();
  } catch (e) {}
};

window.canUndo = function() {
  return _undoStack.length > 0;
};

window.undoLastChange = function() {
  if (_undoStack.length === 0) return;
  try {
    const raw = _undoStack.pop();
    const snap = JSON.parse(raw);
    state.activePreset = snap.activePreset;
    state.startDate = snap.startDate;
    state.endDate = snap.endDate;
    state.customTitleEn = snap.customTitleEn;
    state.customTitleJa = snap.customTitleJa;
    state.selectedPassId = snap.selectedPassId;
    state.passStartDay = snap.passStartDay;
    state.customPassPrice = snap.customPassPrice;
    state.syncedLocalTransit = snap.syncedLocalTransit;
    state.shoppingList = snap.shoppingList || [];
    state.dataEn = snap.dataEn;
    state.dataJa = snap.dataJa;
    window.saveState();
    window.renderAll();
    window.showToast(window.isEn() ? "↩ Undid last change" : "↩ 直前の操作を取り消しました");
  } catch (e) {}
};

window.formatDateYMD = function(dt) {
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

window.parseDateLocal = function(str) {
  if (!str) return null;
  const iso = String(str).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

let _desktopSaveTimer = null;
window.saveState = function() {
  try {
    localStorage.setItem(window.STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.saveState === "function") {
    clearTimeout(_desktopSaveTimer);
    _desktopSaveTimer = setTimeout(() => {
      try {
        window.jpDesktopAPI.saveState(JSON.parse(JSON.stringify(state)));
      } catch (e) {}
    }, 250);
  }
};

window.sanitizeTripDescriptor = function(raw) {
  let s = String(raw == null ? "" : raw).trim();
  // Strip any leading [Season] brackets cleanly (repeatable)
  s = s.replace(/^\s*(?:\[[^\]]+\]\s*)+/, "");
  // Strip any embedded or trailing (XX days) / (XX日間) tags so duplicates can never accumulate
  s = s.replace(/\s*[\(（]\s*\d+\s*(?:days?|日間|日)\s*[\)）]/gi, "");
  return s.replace(/\s+/g, " ").trim();
};

window.formatPresetLabel = function(descriptor, startDate, dayCnt, isJa) {
  const clean = window.sanitizeTripDescriptor(descriptor) || (isJa ? "カスタム日本旅行" : "Custom Japan Route");
  const sInfo = window.getSeasonInfoFromDate(startDate || "");
  const seasonTag = isJa ? `[${sInfo.titlePrefixJa}]` : `[${sInfo.titlePrefixEn}]`;
  const daysTag = isJa ? `(${dayCnt}日間)` : `(${dayCnt} days)`;
  return `${seasonTag} ${clean} ${daysTag}`;
};

window.ensureSeededUserPresets = function() {
  if (!Array.isArray(state.savedCustomPresets)) state.savedCustomPresets = [];
  if (!state._seededFeb2027 && typeof window.buildUserFeb2027Preset === "function") {
    if (!state.savedCustomPresets.some(p => p.id === "userpreset_feb2027_16d")) {
      state.savedCustomPresets.unshift(window.buildUserFeb2027Preset());
    }
    state._seededFeb2027 = true;
  }
};

window.applyStateFromParsed = function(parsed) {
  if (!parsed || !parsed.dataEn || !parsed.dataJa) return false;
  Object.assign(state, parsed);
  if (!Array.isArray(state.shoppingList)) state.shoppingList = [];
  if (!Array.isArray(state.savedCustomPresets)) state.savedCustomPresets = [];
  window.ensureSeededUserPresets();
  if (state.activePreset === "customBlank") state.activePreset = "__draft__";
  if (state.customTitleEn) state.customTitleEn = window.sanitizeTripDescriptor(state.customTitleEn);
  if (state.customTitleJa) state.customTitleJa = window.sanitizeTripDescriptor(state.customTitleJa);
  if (!state.prepDone || typeof state.prepDone !== "object") state.prepDone = {};
  if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = { 1: true };
  if (!state.budgetMode) state.budgetMode = "group";
  if (typeof state.shareHotelRoom !== "boolean") state.shareHotelRoom = true;
  document.documentElement.lang = state.lang === "ja" ? "ja" : "en";
  document.body.classList.toggle("dark-mode", !!state.darkMode);
  document.body.classList.toggle("hero-peek", !!state.heroPeek);
  return true;
};

window.loadStateSync = function() {
  try {
    const saved = localStorage.getItem(window.STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (window.applyStateFromParsed(parsed)) return true;
    }
  } catch (e) {}
  // Fresh boot: seed user custom preset (Feb 2027 16-day) & load tohoku22 default
  window.ensureSeededUserPresets();
  window.loadTripPreset("tohoku22", { silent: true, skipUndo: true });
  return false;
};

window.setLanguage = function(lang) {
  state.lang = lang === "ja" ? "ja" : "en";
  document.documentElement.lang = state.lang;
  window.saveState();
  window.renderAll();
  window.showToast(state.lang === "en" ? "🌐 Switched language to English" : "🇯🇵 表示言語を日本語に切り替えました");
};

window.toggleDarkMode = function() {
  state.darkMode = !state.darkMode;
  document.body.classList.toggle("dark-mode", state.darkMode);
  window.saveState();
  window.renderStaticChrome();
};

window.toggleHeroPeek = function() {
  state.heroPeek = !state.heroPeek;
  document.body.classList.toggle("hero-peek", state.heroPeek);
  window.saveState();
  window.renderStaticChrome();
};

window.switchTab = function(tabId, btnEl) {
  state.activeTab = tabId;
  document.querySelectorAll(".tab-pane").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  const target = document.getElementById("tab-" + tabId);
  if (target) target.classList.add("active");
  if (btnEl) {
    btnEl.classList.add("active");
  } else {
    const matchBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (matchBtn) matchBtn.classList.add("active");
  }
  window.saveState();
};

window.switchTabById = function(tabId) {
  window.switchTab(tabId, null);
  window.scrollTo({ top: 180, behavior: "smooth" });
};

window.jumpToRegionSchedule = function(regKey) {
  state.activeRegionKey = regKey;
  window.switchTabById("itinerary");
  window.renderItineraryCards();
};

window.updateCurrencyCode = function(code) {
  const meta = (window.CURRENCY_META && window.CURRENCY_META[code]) || window.CURRENCY_META.SGD;
  state.currencyCode = code;
  state.fxRate = meta.defaultRate;
  const fxInp = document.getElementById("fxRateInput");
  if (fxInp) fxInp.value = state.fxRate;
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn()
    ? `💱 Switched currency to ${code} (1 ${code} = ¥${meta.defaultRate})`
    : `💱 通貨を ${code}（1 ${code} = ${meta.defaultRate}円）に切り替えました`);
};

window.handleFxKeydown = function(e) {
  if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") e.preventDefault();
};

window.handleFxInput = function(el, isBlurOrChange) {
  if (!el) return;
  let cleaned = String(el.value || "").replace(/-/g, "").replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot) + "." + cleaned.slice(firstDot + 1).replace(/\./g, "").slice(0, 2);
  }
  if (cleaned === "" || cleaned === ".") {
    if (isBlurOrChange) {
      el.value = "0";
      state.fxRate = 0;
      window.saveState();
      window.renderAll();
    } else {
      el.value = cleaned;
    }
    return;
  }
  let num = parseFloat(cleaned);
  if (isNaN(num) || num < 0) num = 0;
  if (num > 9999) {
    num = 9999;
    cleaned = "9999";
  }
  if (el.value !== cleaned) el.value = cleaned;
  state.fxRate = num;
  window.saveState();
  window.renderAll();
};

window.handlePaxKeydown = function(e) {
  const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter", "Home", "End"];
  if (allowed.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (!/^[0-9]$/.test(e.key)) e.preventDefault();
};

window.handlePaxInput = function(el, isBlurOrChange) {
  if (!el) return;
  const digitsOnly = String(el.value || "").replace(/[^0-9]/g, "");
  if (digitsOnly === "") {
    if (isBlurOrChange) {
      el.value = "1";
      state.paxCount = 1;
      window.saveState();
      window.renderAll();
    } else {
      el.value = "";
    }
    return;
  }
  let n = parseInt(digitsOnly, 10);
  if (isNaN(n) || n <= 0) n = 1;
  if (n > 99) n = 99;
  el.value = String(n);
  state.paxCount = n;
  window.saveState();
  window.renderAll();
};

window.debouncedUpdateCustomTitle = window.debounce(function(val) {
  const clean = window.sanitizeTripDescriptor(val);
  if (window.isEn()) state.customTitleEn = clean;
  else state.customTitleJa = clean;
  const daysLen = ((window.curData() && window.curData().days) || []).length;
  document.title = window.formatPresetLabel(clean, state.startDate, daysLen, !window.isEn());
  window.saveState();
}, 180);

window.normalizeHeroTitleOnBlur = function(el) {
  if (!el) return;
  const clean = window.sanitizeTripDescriptor(el.value);
  if (el.value !== clean) el.value = clean;
  if (window.isEn()) state.customTitleEn = clean;
  else state.customTitleJa = clean;
  window.autoResizeHeroTitle(el);
  window.saveState();
  window.renderStaticChrome();
};

window.debouncedUpdateCustomSubtitle = window.debounce(function(val) {
  if (window.isEn()) state.customSubtitleEn = val;
  else state.customSubtitleJa = val;
  window.saveState();
}, 180);

window.updateTripDates = function(newStartStr, newEndStr, opts) {
  const options = opts || {};
  const daysEn = state.dataEn.days || [];
  const daysJa = state.dataJa.days || [];

  // Allow blanking start date cleanly -> falls back to Spring Sakura backdrop
  const startInp = document.getElementById("tripStartDate");
  if (newStartStr === "" || (newStartStr === null && startInp && startInp.value === "" && !newEndStr)) {
    state.startDate = "";
    window.applySeasonThemeFromStartDate();
    window.saveState();
    window.renderAll();
    return;
  }

  const prevStartDt = window.parseDateLocal(state.startDate || (daysEn[0] && daysEn[0].date) || "2026-10-21");
  const startStr = newStartStr || state.startDate || (daysEn[0] && daysEn[0].date) || "2026-10-21";
  const startDt = window.parseDateLocal(startStr) || new Date(2026, 9, 21);

  let targetDayCount = daysEn.length || 1;
  if (newEndStr) {
    const endDt = window.parseDateLocal(newEndStr);
    if (endDt) {
      const diffDays = Math.round((endDt - startDt) / (1000 * 60 * 60 * 24)) + 1;
      if (diffDays >= 1 && diffDays <= 60) {
        targetDayCount = diffDays;
      } else if (diffDays < 1) {
        window.showToast(window.isEn() ? "⚠️ End Date cannot be earlier than Start Date" : "⚠️ 終了日は出発日以降に設定してください");
        targetDayCount = 1;
      }
    }
  }

  if (!options.skipUndo && targetDayCount !== daysEn.length) {
    window.pushUndoSnapshot("Resize dates");
  }

  while (daysEn.length < targetDayCount) {
    const nextNum = daysEn.length + 1;
    const prevEn = daysEn[daysEn.length - 1] || { region: "Tokyo", hotel: "Tokyo Hotel", stay: 12000 };
    const prevJa = daysJa[daysJa.length - 1] || { region: "東京", hotel: "東京ホテル", stay: 12000 };
    daysEn.push({
      day: nextNum, dow: "Mon", date: startStr,
      region: prevEn.region || "Tokyo",
      routeJp: `Day ${nextNum}: ${prevEn.region || "Tokyo"} Exploration & Sightseeing`,
      routeEn: "Custom Japan sightseeing, local dining & transit",
      stay: prevEn.stay || 12000, travelBase: 1500, travelActualAdd: 0, fun: 8000,
      hotel: prevEn.hotel || "Tokyo Hotel", hotelUrl: prevEn.hotelUrl || "",
      passCovered: false, needsAttention: false, jrOnly: 1500, totalAllLegs: 1500,
      legs: ["Local JR / Subway transit (¥1,500)"],
      tip: "Click any field to customize this day's route, hotel, or costs."
    });
    daysJa.push({
      day: nextNum, dow: "月", date: startStr,
      region: prevJa.region || "東京",
      routeJp: `Day ${nextNum}：${prevJa.region || "東京"} 観光・散策`,
      routeEn: "自由散策・ご当地グルメ・現地移動",
      stay: prevJa.stay || 12000, travelBase: 1500, travelActualAdd: 0, fun: 8000,
      hotel: prevJa.hotel || "ホテル拠点", hotelUrl: prevJa.hotelUrl || "",
      passCovered: false, needsAttention: false, jrOnly: 1500, totalAllLegs: 1500,
      legs: ["JR・地下鉄・現地移動（¥1,500）"],
      tip: "日程・ホテル・予算を自由にカスタマイズできます。"
    });
  }
  if (newEndStr && daysEn.length > targetDayCount) {
    daysEn.length = targetDayCount;
    daysJa.length = targetDayCount;
  }

  // Re-index days & dates
  for (let i = 0; i < daysEn.length; i++) {
    const dDt = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + i);
    const ymd = window.formatDateYMD(dDt);
    const dowIdx = dDt.getDay();
    daysEn[i].day = i + 1;
    daysEn[i].date = ymd;
    daysEn[i].dow = window.DOW_EN[dowIdx];
    if (daysJa[i]) {
      daysJa[i].day = i + 1;
      daysJa[i].date = ymd;
      daysJa[i].dow = window.DOW_JA[dowIdx];
    }
  }

  // Shift hotel checkIn/checkOut dates automatically when startDate moved!
  if (newStartStr && prevStartDt) {
    const deltaDays = Math.round((startDt - prevStartDt) / (1000 * 60 * 60 * 24));
    if (deltaDays !== 0) {
      [state.dataEn.hotels || [], state.dataJa.hotels || []].forEach(hList => {
        hList.forEach(h => {
          const shiftField = (raw) => {
            if (!raw) return raw;
            const dParsed = window.parseDateLocal(raw.split("(")[0].trim());
            if (!dParsed) return raw;
            const shifted = new Date(dParsed.getFullYear(), dParsed.getMonth(), dParsed.getDate() + deltaDays);
            return window.formatDateYMD(shifted);
          };
          h.checkIn = shiftField(h.checkIn);
          h.checkOut = shiftField(h.checkOut);
        });
      });
    }
  }

  state.startDate = window.formatDateYMD(startDt);
  const finalEndDt = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + daysEn.length - 1);
  state.endDate = window.formatDateYMD(finalEndDt);

  if (typeof window.ensureAllDaysHaveTimeSlots === "function") {
    window.ensureAllDaysHaveTimeSlots();
  }
  window.applySeasonThemeFromStartDate();
  window.saveState();
  if (!options.skipRender) window.renderAll();
};

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
  sel.innerHTML = html;
  sel.value = curVal;

  const delBtn = document.getElementById("btnDeleteCustomPreset");
  if (delBtn) {
    delBtn.style.display = String(curVal).startsWith("userpreset_") ? "inline-flex" : "none";
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

function computePresetFingerprint(obj) {
  if (!obj) return "";
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
  const activeSnap = buildSnapshotFromActiveState(effectiveClean, effectiveClean);
  const unchanged = !!(overwriteTarget && computePresetFingerprint(overwriteTarget) === computePresetFingerprint(activeSnap));

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

// Backwards-compatible alias
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
  if (nameEl) nameEl.value = en ? "My Custom Japan Itinerary" : "マイカスタム日本旅行";
  if (startEl) startEl.value = state.startDate || "2027-04-01";
  if (daysEl) daysEl.value = "7";
  const modal = document.getElementById("newTripModalBackdrop");
  if (modal && modal.classList) modal.classList.add("open");
};

window.submitNewBlankTrip = function() {
  const en = window.isEn();
  const nameEl = document.getElementById("newTripTitleInput");
  const startEl = document.getElementById("newTripStartInput");
  const daysEl = document.getElementById("newTripDaysInput");
  const cleanDesc = window.sanitizeTripDescriptor(nameEl ? nameEl.value : "") || (en ? "Custom Japan Itinerary" : "カスタム日本旅行プラン");
  const startDate = (startEl && startEl.value) ? startEl.value : "2027-04-01";
  const daysCount = Math.max(1, Math.min(60, parseInt(daysEl ? daysEl.value : "7", 10) || 7));

  window.pushUndoSnapshot("Create new blank trip");
  const payload = window.buildBlankTripPayload({
    titleEn: en ? cleanDesc : cleanDesc,
    titleJa: !en ? cleanDesc : cleanDesc,
    startDate,
    daysCount
  });

  state.activePreset = "__draft__";
  state.activeRegionKey = "ALL";
  state.activeFoodKey = "ALL";
  state.activeAccessKey = "ALL";
  state.activeGuideKey = "ALL";
  state.customMapLocations = [];
  state.manualMapZoom = null;
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

  if (typeof window.ensureAllDaysHaveTimeSlots === "function") {
    window.ensureAllDaysHaveTimeSlots();
  }
  window.closeAllModals();
  window.applySeasonThemeFromStartDate();
  window.saveState();
  window.renderAll();
  window.showToast(en ? `➕ Created new ${daysCount}-day blank plan (click Save when ready)` : `➕ 新規 ${daysCount}日間プランを作成しました（保存ボタンで保存可能）`);
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
      window.loadTripPreset("tohoku22", { silent: true });
      window.showToast(en ? "🗑️ Deleted custom preset" : "🗑️ カスタムプリセットを削除しました");
    },
    en ? "Delete" : "削除"
  );
};

window.loadTripPreset = function(presetKey, opts) {
  if (presetKey === "__draft__") return;
  const options = opts || {};
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
      window.loadTripPreset("tohoku22", { skipUndo: true });
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
    appVersion: "2.0.0",
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
    if (res && res.ok) window.showToast(en ? `💾 Saved full backup: ${res.filePath}` : `💾 全データバックアップを保存しました: ${res.filePath}`);
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
  window.showToast(en ? `💾 Exported ${filename}` : `💾 ${filename} を保存しました`);
};

window.triggerImportPresetFile = async function() {
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.importPreset === "function") {
    const res = await window.jpDesktopAPI.importPreset();
    if (res && res.ok && res.content) {
      window.applyImportedPresetText(res.content);
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
        window.loadTripPreset(targetId, { skipUndo: true });
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
    if (res && res.canceled) return;
  }
  window.print();
};
