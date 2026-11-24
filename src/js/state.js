// Application State, Persistence, Undo Snapshot & Date Resizer

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
  focusedPrefId: null,
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
      customSubtitleEn: state.customSubtitleEn,
      customSubtitleJa: state.customSubtitleJa,
      customMapLocations: state.customMapLocations || [],
      mapScopeMode: state.mapScopeMode || "schedule",
      currencyCode: state.currencyCode || "SGD",
      fxRate: state.fxRate !== undefined ? state.fxRate : 122,
      paxCount: state.paxCount || 1,
      selectedPassId: state.selectedPassId,
      passStartDay: state.passStartDay,
      customPassPrice: state.customPassPrice,
      syncedLocalTransit: state.syncedLocalTransit,
      prepDone: state.prepDone || {},
      expandedDays: state.expandedDays || { 1: true },
      shoppingList: state.shoppingList,
      dataEn: state.dataEn,
      dataJa: state.dataJa
    });
    _undoStack.push(snap);
    if (_undoStack.length > 15) _undoStack.shift();
  } catch (e) {
    console.warn("[JP Trip Planner] Failed to capture undo snapshot:", e);
  }
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
    state.customSubtitleEn = snap.customSubtitleEn;
    state.customSubtitleJa = snap.customSubtitleJa;
    state.customMapLocations = Array.isArray(snap.customMapLocations) ? snap.customMapLocations : [];
    state.mapScopeMode = snap.mapScopeMode || "schedule";
    if (snap.currencyCode) state.currencyCode = snap.currencyCode;
    if (snap.fxRate !== undefined) state.fxRate = snap.fxRate;
    if (snap.paxCount !== undefined) state.paxCount = snap.paxCount;
    state.selectedPassId = snap.selectedPassId;
    state.passStartDay = snap.passStartDay;
    state.customPassPrice = snap.customPassPrice;
    state.syncedLocalTransit = snap.syncedLocalTransit;
    state.prepDone = snap.prepDone && typeof snap.prepDone === "object" ? snap.prepDone : {};
    state.expandedDays = snap.expandedDays && typeof snap.expandedDays === "object" ? snap.expandedDays : { 1: true };
    state.shoppingList = snap.shoppingList || [];
    state.dataEn = snap.dataEn;
    state.dataJa = snap.dataJa;
    window.saveState();
    window.renderAll();
    window.showToast(window.isEn() ? "↩ Undid last change" : "↩ 直前の操作を取り消しました");
  } catch (e) {
    console.warn("[JP Trip Planner] Failed to restore undo snapshot:", e);
  }
};

window.shouldMirrorCustomText = function() {
  const p = String((window.state && state.activePreset) || "");
  return p === "__draft__" || p.startsWith("userpreset_");
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
  } catch (e) {
    console.warn("[JP Trip Planner] Failed to save state to localStorage:", e);
    const isQuota = e && (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014 || /quota/i.test(String(e.message || "")));
    if (isQuota && typeof window.showToast === "function" && !window._quotaWarned) {
      window._quotaWarned = true;
      window.showToast(window.isEn()
        ? "⚠️ Browser storage limit reached — export a backup or delete old saved presets."
        : "⚠️ ブラウザ保存容量の上限に達しました。バックアップを保存するか不要なプリセットを削除してください。");
    }
  }
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.saveState === "function") {
    clearTimeout(_desktopSaveTimer);
    _desktopSaveTimer = setTimeout(() => {
      try {
        window.jpDesktopAPI.saveState(JSON.parse(JSON.stringify(state)));
      } catch (e) {
        console.warn("[JP Trip Planner] Desktop IPC saveState failed:", e);
      }
    }, 250);
  }
};

window.sanitizeTripDescriptor = function(raw) {
  let s = String(raw == null ? "" : raw).trim();
  s = s.replace(/^\s*(?:\[[^\]]+\]\s*)+/, "");
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
  } catch (e) {
    console.warn("[JP Trip Planner] Failed to load saved localStorage state:", e);
  }
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
  let targetKey = regKey || "ALL";
  if (targetKey && targetKey !== "ALL" && !String(targetKey).startsWith("PREF:") && typeof window.getPrimaryPrefectureForDay === "function") {
    const pref = window.getPrimaryPrefectureForDay({ region: targetKey, route: "", title: "", hotel: "", highlights: [] });
    if (pref && pref.id) targetKey = `PREF:${pref.id}`;
  }
  state.activeRegionKey = targetKey;
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
    state.endDate = "";
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
    const isDepartureDayObj = (d) => d && (Number(d.stay) === 0 || /departure|airport|帰国|出発/i.test(String(d.hotel || "")));
    const refEn = [...daysEn].reverse().find(d => !isDepartureDayObj(d)) || daysEn[daysEn.length - 1] || { region: "Tokyo", hotel: "Tokyo Hotel", stay: 0 };
    const refJa = [...daysJa].reverse().find(d => !isDepartureDayObj(d)) || daysJa[daysJa.length - 1] || { region: "東京", hotel: "東京ホテル", stay: 0 };
    const isCleanBlank = state.activePreset === "__draft__" && daysEn.every(d => (Number(d.stay) || 0) === 0 && (Number(d.fun) || 0) === 0);

    daysEn.push({
      day: nextNum, dow: "Mon", date: startStr,
      region: refEn.region || "Tokyo",
      routeJp: `Day ${nextNum}: ${refEn.region || "Tokyo"} Exploration & Sightseeing`,
      routeEn: "Custom Japan sightseeing, local dining & transit",
      stay: isCleanBlank ? 0 : (Number(refEn.stay) || 12000),
      travelBase: isCleanBlank ? 0 : 1500,
      travelActualAdd: 0,
      fun: isCleanBlank ? 0 : 8000,
      hotel: refEn.hotel || "Tokyo Hotel",
      hotelUrl: refEn.hotelUrl || "",
      passCovered: false, needsAttention: false,
      jrOnly: isCleanBlank ? 0 : 1500,
      totalAllLegs: isCleanBlank ? 0 : 1500,
      legs: isCleanBlank ? [] : ["Local JR / Subway transit (¥1,500)"],
      tip: "Click any field to customize this day's route, hotel, or costs.",
      timeSlots: isCleanBlank ? [] : undefined
    });
    daysJa.push({
      day: nextNum, dow: "月", date: startStr,
      region: refJa.region || "東京",
      routeJp: `Day ${nextNum}：${refJa.region || "東京"} 観光・散策`,
      routeEn: "自由散策・ご当地グルメ・現地移動",
      stay: isCleanBlank ? 0 : (Number(refJa.stay) || 12000),
      travelBase: isCleanBlank ? 0 : 1500,
      travelActualAdd: 0,
      fun: isCleanBlank ? 0 : 8000,
      hotel: refJa.hotel || "ホテル拠点",
      hotelUrl: refJa.hotelUrl || "",
      passCovered: false, needsAttention: false,
      jrOnly: isCleanBlank ? 0 : 1500,
      totalAllLegs: isCleanBlank ? 0 : 1500,
      legs: isCleanBlank ? [] : ["JR・地下鉄・現地移動（¥1,500）"],
      tip: "日程・ホテル・予算を自由にカスタマイズできます。",
      timeSlots: isCleanBlank ? [] : undefined
    });
  }
  if (newEndStr && daysEn.length > targetDayCount) {
    daysEn.length = targetDayCount;
    daysJa.length = targetDayCount;
    state.passStartDay = Math.max(1, Math.min(targetDayCount, parseInt(state.passStartDay, 10) || 1));
    if (state.expandedDays && typeof state.expandedDays === "object") {
      Object.keys(state.expandedDays).forEach(k => {
        if (Number(k) > targetDayCount) delete state.expandedDays[k];
      });
    }
  }

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
