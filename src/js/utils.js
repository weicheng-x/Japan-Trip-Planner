// Shared Utilities: XSS Escaping, Safe URLs, Currency Formatting, Modals, CSV Export

window.escapeHtml = function(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

window.escapeAttr = window.escapeHtml;

window.safeUrl = function(url) {
  const s = String(url || "").trim();
  if (!s) return "";
  try {
    const parsed = new URL(s);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch (e) {}
  return "";
};

window.curData = function() {
  return state.lang === "ja" ? state.dataJa : state.dataEn;
};

window.isEn = function() {
  return state.lang !== "ja";
};

window.formatRegionLabel = function(reg, en) {
  const raw = String(reg || "");
  if (!en) return raw;
  const COMPOUND_MAP = {
    "Iwate-Aomori": "Iwate & Aomori",
    "Tochigi-Ibaraki": "Tochigi & Ibaraki"
  };
  return COMPOUND_MAP[raw] || raw;
};

window.csvSafeCell = function(val) {
  let s = String(val == null ? "" : val);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

window.fmtJpy = function(val) {
  return "¥" + Math.round(Number(val) || 0).toLocaleString("en-US");
};

window.fmtSgd = function(jpyVal) {
  const code = state.currencyCode || "SGD";
  const meta = (window.CURRENCY_META && window.CURRENCY_META[code]) || { symbol: "S$", defaultRate: 122 };
  const rate = (state.fxRate !== undefined && state.fxRate !== null) ? Number(state.fxRate) : meta.defaultRate;
  const converted = rate > 0 ? (Number(jpyVal) || 0) / rate : 0;
  return meta.symbol + converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

window.showToast = function(msg) {
  const box = document.getElementById("toastBox");
  if (!box) return;
  box.textContent = msg;
  box.classList.add("show");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    box.classList.remove("show");
  }, 3200);
};

let _confirmCallback = null;
window.showConfirmModal = function(title, message, onConfirm, confirmLabel) {
  const backdrop = document.getElementById("confirmModalBackdrop");
  const titleEl = document.getElementById("confirmModalTitle");
  const bodyEl = document.getElementById("confirmModalBody");
  const okBtn = document.getElementById("confirmModalOk");
  const cancelBtn = document.getElementById("confirmModalCancel");
  if (!backdrop || !titleEl || !bodyEl || !okBtn) return;

  titleEl.textContent = title;
  bodyEl.textContent = message;
  okBtn.textContent = confirmLabel || (window.isEn() ? "Confirm" : "実行");
  if (cancelBtn) cancelBtn.textContent = window.isEn() ? "Cancel" : "キャンセル";

  _confirmCallback = onConfirm;
  okBtn.onclick = function() {
    const fn = _confirmCallback;
    window.closeConfirmModal();
    if (typeof fn === "function") fn();
  };
  backdrop.classList.add("open");
};

window.closeConfirmModal = function() {
  const backdrop = document.getElementById("confirmModalBackdrop");
  if (backdrop) backdrop.classList.remove("open");
  _confirmCallback = null;
};

window.debounce = function(fn, waitMs) {
  let timer = null;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), waitMs);
  };
};

window.getBudgetMultiplier = function() {
  const pax = Math.max(1, Math.min(99, parseInt(state.paxCount, 10) || 1));
  return state.budgetMode === "per_person" ? pax : 1;
};

window.computeBudgetSummary = function() {
  const dList = (window.curData().days) || [];
  const pax = Math.max(1, Math.min(99, parseInt(state.paxCount, 10) || 1));
  const isPerPersonMode = state.budgetMode === "per_person";

  let rawStay = 0, rawTravel = 0, rawFun = 0, rawUnbookedAdd = 0;
  dList.forEach(d => {
    rawStay += Number(d.stay) || 0;
    rawTravel += Number(d.travelBase) || 0;
    rawFun += Number(d.fun) || 0;
    rawUnbookedAdd += Number(d.travelActualAdd) || 0;
  });

  // In per_person mode: travel & fun scale by pax; stay scales by pax unless shareHotelRoom is checked
  const stayMult = isPerPersonMode ? (state.shareHotelRoom ? 1 : pax) : 1;
  const personMult = isPerPersonMode ? pax : 1;

  const stayGroup = rawStay * stayMult;
  const travelGroup = rawTravel * personMult;
  const funGroup = rawFun * personMult;
  const unmergedTransitGroup = state.syncedLocalTransit ? 0 : (rawUnbookedAdd * personMult);

  const items = Array.isArray(state.shoppingList) ? state.shoppingList : [];
  let shoppingGross = 0;
  items.forEach(item => {
    const p = Math.max(0, Number(item.price) || 0);
    const q = Math.max(1, parseInt(item.qty, 10) || 1);
    shoppingGross += p * q;
  });
  const taxFreeDiscount = (state.taxFreeEnabled && shoppingGross >= 5000) ? Math.floor(shoppingGross / 11) : 0;
  const shoppingNet = Math.max(0, shoppingGross - taxFreeDiscount);

  const itineraryBaselineGroup = stayGroup + travelGroup + funGroup;
  const finalGrandTotalGroup = itineraryBaselineGroup + unmergedTransitGroup + shoppingNet;
  const perPaxFinal = Math.round(finalGrandTotalGroup / pax);

  return {
    pax,
    isPerPersonMode,
    stayGroup,
    travelGroup,
    funGroup,
    unmergedTransitGroup,
    shoppingGross,
    taxFreeDiscount,
    shoppingNet,
    itineraryBaselineGroup,
    finalGrandTotalGroup,
    perPaxFinal
  };
};

window.buildCsvPayload = function() {
  const en = window.isEn();
  const cCode = state.currencyCode || "SGD";
  const meta = (window.CURRENCY_META && window.CURRENCY_META[cCode]) || { defaultRate: 122 };
  const rate = (state.fxRate !== undefined && state.fxRate !== null) ? Number(state.fxRate) : meta.defaultRate;
  const conv = (jpy) => (rate > 0 ? (jpy / rate).toFixed(2) : "0.00");

  const summary = window.computeBudgetSummary();
  const rows = [
    ["Day", "DOW", "Date", "Region", "Itinerary", "Hotel", "Stay_JPY", "Travel_JPY", "Fun_Food_JPY", "Total_JPY", `Total_${cCode}`]
  ];

  (window.curData().days || []).forEach(d => {
    const stay = Number(d.stay) || 0;
    const travel = Number(d.travelBase) || 0;
    const fun = Number(d.fun) || 0;
    const tot = stay + travel + fun;
    rows.push([
      d.day,
      window.csvSafeCell(d.dow || ""),
      window.csvSafeCell(d.date || ""),
      window.csvSafeCell(d.region || ""),
      window.csvSafeCell(d.routeJp || ""),
      window.csvSafeCell(d.hotel || ""),
      stay, travel, fun, tot, conv(tot)
    ]);
  });

  if (summary.unmergedTransitGroup > 0) {
    rows.push(["", "", "", "", window.csvSafeCell(en ? "Unmerged Local Transit" : "未合算現地交通費"), "", 0, summary.unmergedTransitGroup, 0, summary.unmergedTransitGroup, conv(summary.unmergedTransitGroup)]);
  }
  if (summary.shoppingNet > 0) {
    rows.push(["", "", "", "", window.csvSafeCell(en ? "Shopping List (Net)" : "買い物リスト合計"), "", 0, 0, summary.shoppingNet, summary.shoppingNet, conv(summary.shoppingNet)]);
  }
  rows.push(["", "", "", "", window.csvSafeCell(en ? `Final Grand Total (${summary.pax} Pax)` : `最終総合計 (${summary.pax}名)`), "", summary.stayGroup, summary.travelGroup + summary.unmergedTransitGroup, summary.funGroup + summary.shoppingNet, summary.finalGrandTotalGroup, conv(summary.finalGrandTotalGroup)]);

  const rawTitle = (en ? state.customTitleEn : state.customTitleJa) || "Japan_Trip_Plan";
  const safeBase = rawTitle.replace(/[\\/:*?"<>|\[\]]+/g, "_").replace(/\s+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60) || "Japan_Trip_Plan";
  const filename = `${safeBase}_${en ? "EN" : "JP"}.csv`;
  // Prepend UTF-8 BOM so Windows Excel renders Japanese characters properly
  const csv = "\uFEFF" + rows.map(r => r.join(",")).join("\n");
  return { csv, filename };
};

window.exportCsv = async function() {
  const en = window.isEn();
  const { csv, filename } = window.buildCsvPayload();
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.exportCsv === "function") {
    const res = await window.jpDesktopAPI.exportCsv(filename, csv);
    if (res && res.ok) {
      window.showToast(en ? `📥 Saved CSV: ${res.filePath}` : `📥 CSVを保存しました: ${res.filePath}`);
    } else if (res && res.error) {
      window.showToast(en ? `⚠️ CSV export failed: ${res.error}` : `⚠️ CSV保存に失敗しました: ${res.error}`);
    }
    return;
  }
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  window.showToast(en ? `📥 Downloaded ${filename}` : `📥 ${filename} をダウンロードしました`);
};
