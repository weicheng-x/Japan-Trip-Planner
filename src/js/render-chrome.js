// Chrome, Sticky Navigation, Reconciled KPI Strip & Dynamic Merge Local Transit Action

window.syncLocalTransitToBudget = function() {
  const en = window.isEn();
  const dList = (window.curData().days) || [];
  const totalAdd = dList.reduce((s, d) => s + (Number(d.travelActualAdd) || 0), 0);
  if (state.syncedLocalTransit || totalAdd <= 0) {
    window.showToast(en
      ? "✓ Local & post-pass transit is already merged or ¥0"
      : "✓ 現地交通費はすでに合算済み（または¥0）です");
    return;
  }
  window.pushUndoSnapshot("Merge local transit");
  [state.dataEn.days, state.dataJa.days].forEach(arr => {
    arr.forEach(d => {
      if (d.travelActualAdd > 0) {
        d.travelBase = (Number(d.travelBase) || 0) + Number(d.travelActualAdd);
      }
    });
  });
  state.syncedLocalTransit = true;
  window.saveState();
  window.renderAll();
  window.showToast(en
    ? `⚡ Merged +${window.fmtJpy(totalAdd)} of local transit into the daily expense ledger!`
    : `⚡ 現地交通費（+${window.fmtJpy(totalAdd)}）を日別予算台帳へ合算しました！`);
};

window.autoResizeHeroTitle = function(el) {
  const t = el || document.getElementById("heroTitleInput");
  if (!t || !t.style) return;
  t.style.height = "auto";
  const sh = Number(t.scrollHeight) || 40;
  t.style.height = Math.max(36, sh) + "px";
};

if (typeof window.addEventListener === "function") {
  window.addEventListener("resize", function() {
    window.autoResizeHeroTitle();
  });
}

window.renderStaticChrome = function() {
  const en = window.isEn();
  const d = window.curData();
  const daysLen = (d.days || []).length;
  const nightsLen = Math.max(0, daysLen - 1);
  const startStr = state.startDate !== undefined ? state.startDate : ((d.days[0] && d.days[0].date) || "2026-10-21");
  const endStr = state.endDate || (d.days[daysLen - 1] && d.days[daysLen - 1].date) || "";
  const sInfo = window.getSeasonInfoFromDate(startStr);

  window.applySeasonThemeFromStartDate();
  window.populatePresetSelectDropdown();

  document.getElementById("heroLangEn").classList.toggle("active", en);
  document.getElementById("heroLangJa").classList.toggle("active", !en);

  document.getElementById("heroBadge1").textContent = en
    ? `${sInfo.heroIcon} Japan Trip & Budget Planner (${daysLen} Days / ${nightsLen} Nights)`
    : `${sInfo.heroIcon} 日本旅行プランナー（${daysLen}日間 / ${nightsLen}泊）`;

  const animBtn = document.getElementById("btnToggleAnim");
  if (animBtn) {
    animBtn.textContent = state.animationsPaused
      ? (en ? "▶ Effects" : "▶ 演出ON")
      : (en ? "⏸ Effects" : "⏸ 演出OFF");
  }
  const peekBtn = document.getElementById("btnHeroPeek");
  if (peekBtn) {
    peekBtn.textContent = state.heroPeek
      ? (en ? "👁️ Show UI" : "👁️ UI表示")
      : (en ? "👁️ Scenery" : "👁️ 背景鑑賞");
  }

  const defaultTitleEn = "Japan Autumn Foliage 2026: Tohoku, Nikko & Tokyo";
  const defaultTitleJa = "日本紅葉紀行 2026：東北・日光・東京";
  const rawTitle = en ? (state.customTitleEn || defaultTitleEn) : (state.customTitleJa || defaultTitleJa);
  const curTitleDesc = typeof window.sanitizeTripDescriptor === "function" ? window.sanitizeTripDescriptor(rawTitle) : rawTitle;
  const seasonTagText = en ? `[${sInfo.titlePrefixEn}]` : `[${sInfo.titlePrefixJa}]`;
  const daysTagText = en ? `(${daysLen} days)` : `(${daysLen}日間)`;

  const sTagEl = document.getElementById("heroTitleSeasonTag");
  if (sTagEl) sTagEl.textContent = seasonTagText;
  const dTagEl = document.getElementById("heroTitleDaysTag");
  if (dTagEl) dTagEl.textContent = daysTagText;

  const defaultSubEn = `${startStr || "Flexible Dates"} → ${endStr} (${daysLen} Days) • Click to customize`;
  const defaultSubJa = `${startStr || "日付未定"} 〜 ${endStr}（${daysLen}日間）• クリックして自由に編集`;
  const curSub = en ? (state.customSubtitleEn || defaultSubEn) : (state.customSubtitleJa || defaultSubJa);

  const tInp = document.getElementById("heroTitleInput");
  if (tInp && document.activeElement !== tInp) tInp.value = curTitleDesc;
  window.autoResizeHeroTitle(tInp);
  document.title = `${seasonTagText} ${curTitleDesc} ${daysTagText}`;

  const sInp = document.getElementById("heroSubtitleInput");
  if (sInp && document.activeElement !== sInp) sInp.value = curSub;

  const stInp = document.getElementById("tripStartDate");
  if (stInp && document.activeElement !== stInp) stInp.value = startStr;
  const enInp = document.getElementById("tripEndDate");
  if (enInp && document.activeElement !== enInp) enInp.value = endStr;

  document.getElementById("lblStartDate").textContent = en ? "📅 Start:" : "📅 出発日:";
  document.getElementById("lblEndDate").textContent = en ? "→ End:" : "→ 終了日:";
  document.getElementById("lblPresetSelect").textContent = en ? "🗾 Preset:" : "🗾 旅程プリセット:";
  document.getElementById("lblPaxSelect").textContent = en ? "👥 Pax:" : "👥 人数:";
  document.getElementById("lblHomeCurrency").textContent = en ? "💱 Currency:" : "💱 通貨:";

  const newBtn = document.getElementById("btnNewBlankTrip");
  if (newBtn) newBtn.textContent = en ? "➕ New" : "➕ 新規作成";
  const saveBtn = document.getElementById("btnSaveCustomPreset");
  if (saveBtn) {
    const dirty = typeof window.isActiveTripDirty === "function" && window.isActiveTripDirty();
    saveBtn.classList.toggle("has-unsaved", dirty);
    saveBtn.textContent = (en ? "💾 Save" : "💾 保存") + (dirty ? " ●" : "");
  }
  const shareBtn = document.getElementById("btnHeroShareExport");
  if (shareBtn) shareBtn.textContent = en ? "📤 Share / Export" : "📤 共有・書出";
  const impBtn = document.getElementById("btnHeroImportPreset");
  if (impBtn) impBtn.textContent = en ? "📥 Import" : "📥 読込";

  // Localize Modal labels
  const spTitle = document.getElementById("savePresetModalTitle");
  if (spTitle) spTitle.textContent = en ? "💾 Save Trip Preset" : "💾 旅程プリセットを保存";
  const spDesc = document.getElementById("savePresetModalDesc");
  if (spDesc) spDesc.textContent = en
    ? "Choose whether to overwrite your existing saved preset or create a separate new preset (Season & Day count tags are added automatically)."
    : "既存の保存済みプリセットを上書き更新するか、別名の新規プリセットとして保存するかを選択できます（季節と日数は自動付与されます）。";
  const spLbl = document.getElementById("lblSavePresetName");
  if (spLbl) spLbl.textContent = en ? "Preset Description" : "プリセット名（説明部分）";
  const spPrevLbl = document.getElementById("savePresetPreviewLabel");
  if (spPrevLbl) spPrevLbl.textContent = en ? "Formatted Preset Name (auto-tagged):" : "保存されるプリセット名（自動整形）：";
  const spCancel = document.getElementById("btnCancelSavePreset");
  if (spCancel) spCancel.textContent = en ? "Cancel" : "キャンセル";
  const spNew = document.getElementById("btnModalSaveAsNewPreset");
  if (spNew) spNew.textContent = en ? "Save as New Preset" : "新規プリセットとして保存";

  const ntTitle = document.getElementById("newTripModalTitle");
  if (ntTitle) ntTitle.textContent = en ? "➕ Create New Blank Japan Trip" : "➕ 新規カスタム空白プランを作成";
  const ntDesc = document.getElementById("newTripModalDesc");
  if (ntDesc) ntDesc.textContent = en
    ? "Start a fresh itinerary by picking destinations, dates, and clean blank vs estimated starting costs."
    : "訪問都市・日付・初期費用モード（¥0空白または概算）を選んで新しい旅程を作成します。";
  const ntLblN = document.getElementById("lblNewTripName");
  if (ntLblN) ntLblN.textContent = en ? "Trip Description" : "旅行タイトル（説明）";
  const ntLblS = document.getElementById("lblNewTripStart");
  if (ntLblS) ntLblS.textContent = en ? "Start Date" : "出発日";
  const ntLblD = document.getElementById("lblNewTripDays");
  if (ntLblD) ntLblD.textContent = en ? "Days (1–60)" : "日数（1〜60日）";
  const ntLblC = document.getElementById("lblNewTripCities");
  if (ntLblC) ntLblC.textContent = en ? "Destinations / Cities (select one or more)" : "訪問都市・エリア（複数選択可）";
  const wmPop = document.getElementById("btnWizMode_popular");
  if (wmPop) wmPop.textContent = en ? "⭐ Popular (12)" : "⭐ 主要都市 (12)";
  const wmSch = document.getElementById("btnWizMode_search");
  if (wmSch) wmSch.textContent = en ? "🔍 Search Any City / Pref" : "🔍 全都市・県を検索";
  const wmMap = document.getElementById("btnWizMode_map");
  if (wmMap) wmMap.textContent = en ? "🗺️ Pick on Map" : "🗺️ 地図から選択";
  const wmAdd = document.getElementById("btnWizardQuickAdd");
  if (wmAdd) wmAdd.textContent = en ? "+ Add" : "+ 追加";
  const ntLblM = document.getElementById("lblNewTripCostMode");
  if (ntLblM) ntLblM.textContent = en ? "Starting Budget Mode" : "初期予算モード";
  const ntOptB = document.getElementById("optNewTripCostBlank");
  if (ntOptB) ntOptB.textContent = en ? "Clean Blank (¥0 — enter your own)" : "完全空白（¥0・後から手入力）";
  const ntOptE = document.getElementById("optNewTripCostEst");
  if (ntOptE) ntOptE.textContent = en ? "Quick Estimates (avg hotel/food/flight)" : "参考概算入り（宿・食事・航空券目安）";
  const ntLblSl = document.getElementById("lblNewTripEmptySlots");
  if (ntLblSl) ntLblSl.textContent = en ? "Start with clean empty hourly time slots" : "時間別スケジュールを空欄で開始";
  const ntCancel = document.getElementById("btnCancelNewTrip");
  if (ntCancel) ntCancel.textContent = en ? "Cancel" : "キャンセル";
  const ntOk = document.getElementById("btnConfirmNewTrip");
  if (ntOk) ntOk.textContent = en ? "Create Blank Trip" : "空白プランを作成";

  const shTitle = document.getElementById("shareExportModalTitle");
  if (shTitle) shTitle.textContent = en ? "📤 Share or Export Active Itinerary" : "📤 旅程を共有・エクスポート";
  const shDesc = document.getElementById("shareExportModalDesc");
  if (shDesc) shDesc.textContent = en
    ? "Share with fellow JP Trip Planner users or export a complete multi-sheet Excel workbook."
    : "同じアプリユーザーへの共有用ファイル、またはExcelブック形式を選択できます。";
  const sm1T = document.getElementById("shareModeAppTitle");
  if (sm1T) sm1T.textContent = en ? "🗾 1. Share for App Users (.jptrip.json)" : "🗾 1. アプリ共有用プリセット (.jptrip.json)";
  const sm1D = document.getElementById("shareModeAppDesc");
  if (sm1D) sm1D.textContent = en
    ? "Exports this trip preset with exact seasonal backdrop, currency, FX rate, rail pass, hotels, map stops & hourly schedule so recipients view it identically."
    : "季節背景・通貨・為替・鉄道パス・宿泊・マップ・時間帯プランまで完全そのまま他の端末と共有できます。";
  const sm1B1 = document.getElementById("btnShareAppPreset");
  if (sm1B1) sm1B1.textContent = en ? "📤 Export This Preset (.jptrip.json)" : "📤 このプリセットを書き出す (.jptrip.json)";
  const sm1B2 = document.getElementById("btnShareImportFromModal");
  if (sm1B2) sm1B2.textContent = en ? "📥 Import Preset File" : "📥 プリセットを読み込む";
  const sm2T = document.getElementById("shareModeExcelTitle");
  if (sm2T) sm2T.textContent = en ? "📊 2. Export as Excel Workbook (.xlsx)" : "📊 2. Excelブック形式 (.xlsx)";
  const sm2D = document.getElementById("shareModeExcelDesc");
  if (sm2D) sm2D.textContent = en
    ? "Generates an 8-sheet Excel workbook (Overview, Schedule, Time Slots, Hotels, Budget & Rail Pass, Gourmet, Guides & Shopping) for anyone without the app."
    : "概要・日別日程・時間帯・宿泊・予算＆鉄道パス・グルメ・観光ガイド・買い物の全8シートExcelブックを生成します。";
  const sm2B1 = document.getElementById("btnShareExcel");
  if (sm2B1) sm2B1.textContent = en ? "📊 Export Excel (.xlsx)" : "📊 Excel出力 (.xlsx)";
  const sm2B2 = document.getElementById("btnShareCsv");
  if (sm2B2) sm2B2.textContent = en ? "📄 Export Simple CSV" : "📄 簡易CSV出力";
  const shBk = document.getElementById("btnShareFullBackup");
  if (shBk) shBk.textContent = en ? "💾 Full All-Presets Backup (.json)" : "💾 全設定バックアップ (.json)";
  const shCl = document.getElementById("btnCloseShareModal");
  if (shCl) shCl.textContent = en ? "Close" : "閉じる";

  const paxInp = document.getElementById("paxCountSelect");
  if (paxInp && document.activeElement !== paxInp) paxInp.value = String(state.paxCount || 1);
  const curSel = document.getElementById("currencyCodeSelect");
  if (curSel) curSel.value = state.currencyCode || "SGD";

  const fxInp = document.getElementById("fxRateInput");
  if (fxInp && document.activeElement !== fxInp && state.fxRate !== undefined) fxInp.value = String(state.fxRate);

  const cCode = state.currencyCode || "SGD";
  document.getElementById("fxLabelBox").innerHTML = en
    ? `FX (${window.escapeHtml(cCode)} ↔ JPY)<span>0–9999 (2 d.p.)</span>`
    : `為替 (${window.escapeHtml(cCode)} ↔ JPY)<span>0〜9999</span>`;
  document.getElementById("fxBaseUnitSpan").textContent = `1 ${cCode} =`;
  document.getElementById("fxUnitLabel").textContent = en ? "JPY" : "円";

  document.getElementById("themeBtn").textContent = state.darkMode
    ? (en ? "☀️ Light Mode" : "☀️ ライト表示")
    : (en ? "🌙 Dark Mode" : "🌙 ダーク表示");

  document.getElementById("tabBtnOverview").innerHTML = en ? "🗾 1. Overview & Map" : "🗾 1. 旅の概要＆全国マップ";
  document.getElementById("tabBtnItinerary").innerHTML = en
    ? `🗓️ 2. Schedule <span class="tab-count">${daysLen}d</span>`
    : `🗓️ 2. 日別スケジュール <span class="tab-count">${daysLen}日</span>`;
  document.getElementById("tabBtnHotels").innerHTML = en
    ? `🏨 3. Hotels & Stays <span class="tab-count">${(d.hotels || []).length}</span>`
    : `🏨 3. 宿泊・ホテル台帳 <span class="tab-count">${(d.hotels || []).length}</span>`;
  document.getElementById("tabBtnBudget").innerHTML = en ? "💴 4. Budget & Analytics" : "💴 4. 費用・予算分析";
  document.getElementById("tabBtnRail").innerHTML = en ? "🚄 5. Rail Pass & Transit" : "🚄 5. 鉄道パス＆交通費";
  document.getElementById("tabBtnGourmet").innerHTML = en
    ? `🍜 6. Gourmet <span class="tab-count" id="foodCountBadge">${(d.food || []).length}</span>`
    : `🍜 6. ご当地グルメ <span class="tab-count" id="foodCountBadge">${(d.food || []).length}</span>`;
  document.getElementById("tabBtnAccess").innerHTML = en
    ? `🚌 7. Metro PDFs & Bus <span class="tab-count" id="accessCountBadge">${(d.access || []).length}</span>`
    : `🚌 7. 路線図PDF＆バス <span class="tab-count" id="accessCountBadge">${(d.access || []).length}</span>`;
  document.getElementById("tabBtnGuides").innerHTML = en
    ? `📖 8. Sightseeing Guides <span class="tab-count" id="guidesCountBadge">${(d.guides || []).length}</span>`
    : `📖 8. 観光ガイド <span class="tab-count" id="guidesCountBadge">${(d.guides || []).length}</span>`;

  // Dynamic Merge Local Transit button: hide when zero unbooked transit exists, disable once merged
  const unbookedAdd = (d.days || []).reduce((s, x) => s + (Number(x.travelActualAdd) || 0), 0);
  const mergeBtn = document.getElementById("btnMergeTransit");
  if (mergeBtn) {
    if (unbookedAdd <= 0) {
      mergeBtn.style.display = "none";
    } else if (state.syncedLocalTransit) {
      mergeBtn.style.display = "inline-flex";
      mergeBtn.disabled = true;
      mergeBtn.textContent = en ? "✓ Local Transit Merged" : "✓ 現地交通費 合算済";
    } else {
      mergeBtn.style.display = "inline-flex";
      mergeBtn.disabled = false;
      mergeBtn.textContent = en
        ? `⚡ Merge Local Transit (+${window.fmtJpy(unbookedAdd)})`
        : `⚡ 現地交通費(+${window.fmtJpy(unbookedAdd)})を合算`;
    }
  }

  const undoBtn = document.getElementById("btnUndo");
  if (undoBtn) {
    undoBtn.style.display = window.canUndo() ? "inline-flex" : "none";
    undoBtn.textContent = en ? "↩ Undo" : "↩ 元に戻す";
  }

  const expBtn = document.getElementById("btnExportJson");
  if (expBtn) expBtn.textContent = en ? "📤 Export / Share" : "📤 共有・書出";
  const impTopBtn = document.getElementById("btnImportJson");
  if (impTopBtn) impTopBtn.textContent = en ? "📥 Import" : "📥 読込";
  document.getElementById("btnResetData").textContent = en ? "↺ Reset" : "↺ 初期値";
  document.getElementById("btnPrint").textContent = en ? "🖨️ Print / PDF" : "🖨️ 印刷・PDF";
};

window.renderKpis = function() {
  const en = window.isEn();
  const d = window.curData();
  const daysLen = (d.days || []).length || 1;
  const b = window.computeBudgetSummary();
  const rail = window.computeRailPassMetrics();

  // KPI 1: Itinerary Baseline
  document.getElementById("kpiTitle1").textContent = en
    ? `Itinerary Baseline (${b.isPerPersonMode ? `${b.pax} Pax` : "Group Ledger"})`
    : `旅程基本予算（${b.isPerPersonMode ? `${b.pax}名換算` : "合計"}）`;
  document.getElementById("kpiLink1").textContent = en ? "💴 View Budget →" : "💴 費用分析へ →";
  document.getElementById("kpiBaselineJpy").textContent = window.fmtJpy(b.itineraryBaselineGroup);
  document.getElementById("kpiBaselineSgd").textContent = en
    ? `${window.fmtSgd(b.itineraryBaselineGroup)} • Stay ${window.fmtJpy(b.stayGroup)} + Travel ${window.fmtJpy(b.travelGroup)} + Fun ${window.fmtJpy(b.funGroup)}`
    : `${window.fmtSgd(b.itineraryBaselineGroup)} • 宿泊 ${window.fmtJpy(b.stayGroup)} + 交通 ${window.fmtJpy(b.travelGroup)} + 食遊 ${window.fmtJpy(b.funGroup)}`;

  // KPI 2: All-In Final Budget (Exact match with Tab 4 Final Grand Total!)
  const avgPerDay = Math.round(b.finalGrandTotalGroup / daysLen);
  const cap = Number(state.budgetTargetJpy) || 0;
  let capNote = "";
  if (cap > 0) {
    const diff = cap - b.finalGrandTotalGroup;
    capNote = diff >= 0
      ? (en ? ` • Under cap by ${window.fmtJpy(diff)}` : ` • 予算枠まで残 ${window.fmtJpy(diff)}`)
      : (en ? ` • ⚠️ Over cap by ${window.fmtJpy(Math.abs(diff))}` : ` • ⚠️ 予算超過 ${window.fmtJpy(Math.abs(diff))}`);
  }
  document.getElementById("kpiTitle2").textContent = en
    ? `All-In Final Budget (Avg ${window.fmtJpy(avgPerDay)}/day)`
    : `最終総合計予算（1日平均 ${window.fmtJpy(avgPerDay)}）`;
  document.getElementById("kpiLink2").textContent = en ? "📊 Breakdown →" : "📊 内訳へ →";
  document.getElementById("kpiReconciledJpy").textContent = window.fmtJpy(b.finalGrandTotalGroup);
  document.getElementById("kpiReconciledSgd").textContent = b.pax > 1
    ? (en
      ? `${window.fmtSgd(b.finalGrandTotalGroup)} Total • ${window.fmtJpy(b.perPaxFinal)} (${window.fmtSgd(b.perPaxFinal)}) / pax${capNote}`
      : `${window.fmtSgd(b.finalGrandTotalGroup)} 合計 • 1名 ${window.fmtJpy(b.perPaxFinal)} (${window.fmtSgd(b.perPaxFinal)})${capNote}`)
    : (en
      ? `${window.fmtSgd(b.finalGrandTotalGroup)} • Shopping ${window.fmtJpy(b.shoppingNet)} + Unmerged ${window.fmtJpy(b.unmergedTransitGroup)}${capNote}`
      : `${window.fmtSgd(b.finalGrandTotalGroup)} • 買い物 ${window.fmtJpy(b.shoppingNet)} + 未合算交通 ${window.fmtJpy(b.unmergedTransitGroup)}${capNote}`);

  // KPI 3: Synced directly with Tab 5 Rail Pass Simulator!
  const hasPass = rail.passObj.days > 0;
  document.getElementById("kpiTitle3").textContent = en ? "Rail / Transit Pass Simulator" : "鉄道パス最適化結果";
  document.getElementById("kpiLink3").textContent = en ? rail.passObj.nameEn.split("(")[0].trim() : rail.passObj.nameJa.split("（")[0].trim();
  if (!hasPass) {
    document.getElementById("kpiPassSavingsJpy").textContent = en ? `Pay-As-You-Go (${window.fmtJpy(rail.noPassEval.allSum)})` : `都度払い (${window.fmtJpy(rail.noPassEval.allSum)})`;
    document.getElementById("kpiPassSavingsSgd").textContent = rail.bestAlt && rail.bestAlt.eval.netSavings > 0
      ? (en ? `Tip: ${rail.bestAlt.pass.nameEn.split("(")[0].trim()} saves ${window.fmtJpy(rail.bestAlt.eval.netSavings)}` : `提案：${rail.bestAlt.pass.nameJa.split("（")[0].trim()}で${window.fmtJpy(rail.bestAlt.eval.netSavings)}お得`)
      : (en ? `No JR Pass needed (${window.fmtJpy(rail.noPassEval.jrSum)} JR / ${window.fmtJpy(rail.noPassEval.nonJrSum)} Local)` : `パス不要（JR ${window.fmtJpy(rail.noPassEval.jrSum)} / 現地 ${window.fmtJpy(rail.noPassEval.nonJrSum)}）`);
  } else {
    const sav = rail.currentEval.netSavings;
    document.getElementById("kpiPassSavingsJpy").textContent = sav >= 0
      ? (en ? `Save ${window.fmtJpy(sav)}` : `${window.fmtJpy(sav)} お得`)
      : (en ? `Point-to-Point Wins` : `個別きっぷ推奨`);
    document.getElementById("kpiPassSavingsSgd").textContent = sav >= 0
      ? (en ? `${window.fmtSgd(sav)} Saved (Days ${rail.currentEval.startDay}–${Math.min(daysLen, rail.currentEval.endDay)} • Covers ${window.fmtJpy(rail.currentEval.coveredJrSum)})` : `${window.fmtSgd(sav)} 節約（Day ${rail.currentEval.startDay}〜${Math.min(daysLen, rail.currentEval.endDay)} • 対象 ${window.fmtJpy(rail.currentEval.coveredJrSum)}）`)
      : (en ? `Pass ${window.fmtJpy(rail.passPrice)} > Covered ${window.fmtJpy(rail.currentEval.coveredJrSum)} — buy tickets!` : `パス ${window.fmtJpy(rail.passPrice)} ＞ 対象運賃 ${window.fmtJpy(rail.currentEval.coveredJrSum)}`);
  }

  // KPI 4: Stays, Map Stops & Curated Guides
  const hotelsList = d.hotels || [];
  const totalNights = hotelsList.reduce((s, h) => s + (Number(h.nights) || 0), 0);
  const stopsLen = window.getMatchedJapanLocations().length;
  document.getElementById("kpiTitle4").textContent = en ? "Stays, Map Stops & Guides" : "宿泊拠点・訪問都市＆ガイド";
  document.getElementById("kpiLink4").textContent = en ? "🏨 View Hotels →" : "🏨 ホテル台帳へ →";
  document.getElementById("kpiMain4").textContent = en
    ? `${hotelsList.length} Bases • ${totalNights} Nights`
    : `全${hotelsList.length}拠点・${totalNights}泊`;
  document.getElementById("kpiSub4").textContent = en
    ? `${stopsLen} Map Stops • ${(d.food || []).length} Gourmet • ${(d.access || []).length} Transit • ${(d.guides || []).length} Guides`
    : `地図${stopsLen}地点 • グルメ${(d.food || []).length} • 交通${(d.access || []).length} • ガイド${(d.guides || []).length}`;
};
