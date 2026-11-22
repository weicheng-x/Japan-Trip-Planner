// Tab 4: Budget & Expense Analytics (Group vs Per-Person Mode, Budget Cap & Full Reconciliation)

window.setBudgetMode = function(mode) {
  state.budgetMode = mode === "per_person" ? "per_person" : "group";
  window.saveState();
  window.renderAll();
};

window.toggleShareHotelRoom = function(checked) {
  state.shareHotelRoom = !!checked;
  window.saveState();
  window.renderAll();
};

window.updateBudgetTarget = function(val) {
  state.budgetTargetJpy = Math.max(0, Number(val) || 0);
  window.saveState();
  window.renderAll();
};

window.renderBudgetTable = function() {
  const en = window.isEn();
  const daysList = (window.curData().days) || [];
  const b = window.computeBudgetSummary();
  const cCode = state.currencyCode || "SGD";

  document.getElementById("budgetAnalyticsTitle").textContent = en
    ? "📊 Category & Regional Expense Analytics"
    : "📊 カテゴリ別＆エリア別 費用分析";
  document.getElementById("budgetAnalyticsSub").textContent = en
    ? `Live sync across ${daysList.length} days, Shopping List & ${b.pax} Traveler${b.pax > 1 ? "s" : ""}`
    : `全${daysList.length}日間・買い物リスト・旅行人数（${b.pax}名）と完全連動`;

  // Budget Mode & Budget Cap Controls Bar
  const cap = Number(state.budgetTargetJpy) || 0;
  const capPct = cap > 0 ? Math.min(140, Math.round((b.finalGrandTotalGroup / cap) * 100)) : 0;
  const isOver = cap > 0 && b.finalGrandTotalGroup > cap;
  document.getElementById("budgetModeControlsBar").innerHTML = `
    <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;background:var(--surface-alt);border:1px solid var(--border);padding:10px 14px;border-radius:11px;">
      <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
        <span style="font-size:12px;font-weight:800;">${en ? "💡 Ledger Mode:" : "💡 金額入力基準:"}</span>
        <button type="button" class="pill ${!b.isPerPersonMode ? "active" : ""}" onclick="setBudgetMode('group')">
          ${en ? "Group Total (Divide ÷ Pax)" : "グループ合計入力（÷人数で割る）"}
        </button>
        <button type="button" class="pill ${b.isPerPersonMode ? "active" : ""}" onclick="setBudgetMode('per_person')">
          ${en ? "Per-Person Rates (Multiply × Pax)" : "1名あたり入力（×人数で合算）"}
        </button>
        ${b.isPerPersonMode && b.pax > 1 ? `
          <label style="font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:5px;cursor:pointer;margin-left:6px;">
            <input type="checkbox" ${state.shareHotelRoom ? "checked" : ""} onchange="toggleShareHotelRoom(this.checked)">
            ${en ? "Share Room (Stay = Group Rate)" : "宿泊は部屋単位（人数掛けしない）"}
          </label>
        ` : ""}
      </div>
      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
        <span style="font-size:12px;font-weight:800;">🎯 ${en ? "Target Budget Cap (¥):" : "目標予算上限 (¥):"}</span>
        <input type="number" class="editable-num" style="width:110px;" value="${cap || ""}" placeholder="0 = Off" step="10000" min="0" onchange="updateBudgetTarget(this.value)">
        ${cap > 0 ? `<span class="pass-badge" style="background:${isOver ? "#FEE2E2" : "var(--forest-soft)"};color:${isOver ? "#B91C1C" : "var(--forest)"};">${capPct}% ${isOver ? (en ? "⚠️ Over" : "⚠️ 超過") : (en ? "✓ Within Cap" : "✓ 予算内")}</span>` : ""}
      </div>
    </div>
  `;

  document.getElementById("budgetAnalyticsLead").innerHTML = en
    ? `Itinerary Baseline: <strong>${window.fmtJpy(b.itineraryBaselineGroup)}</strong>${b.unmergedTransitGroup > 0 ? ` + Unmerged Local Transit: <strong>${window.fmtJpy(b.unmergedTransitGroup)}</strong>` : ""} + Shopping (Net): <strong>${window.fmtJpy(b.shoppingNet)}</strong> = <strong>Final Grand Total: ${window.fmtJpy(b.finalGrandTotalGroup)} (${window.fmtSgd(b.finalGrandTotalGroup)})</strong>${b.pax > 1 ? ` • <strong>Per Person (${b.pax} Pax): ${window.fmtJpy(b.perPaxFinal)} (${window.fmtSgd(b.perPaxFinal)})</strong>` : ""}.`
    : `旅程基本予算：<strong>${window.fmtJpy(b.itineraryBaselineGroup)}</strong>${b.unmergedTransitGroup > 0 ? ` ＋ 未合算現地交通：<strong>${window.fmtJpy(b.unmergedTransitGroup)}</strong>` : ""} ＋ 買い物合計：<strong>${window.fmtJpy(b.shoppingNet)}</strong> ＝ <strong>最終総合計：${window.fmtJpy(b.finalGrandTotalGroup)} (${window.fmtSgd(b.finalGrandTotalGroup)})</strong>${b.pax > 1 ? ` • <strong>1名あたり（${b.pax}名）：${window.fmtJpy(b.perPaxFinal)} (${window.fmtSgd(b.perPaxFinal)})</strong>` : ""}。`;

  document.getElementById("catBarsHeading").textContent = en
    ? "1. Breakdown by Category (All-In)"
    : "① カテゴリ別内訳（総合計ベース）";
  document.getElementById("regBarsHeading").textContent = en
    ? "2. Breakdown by Region (Ground Spend)"
    : "② 滞在エリア別内訳";
  document.getElementById("budgetLedgerTitle").textContent = en
    ? `💴 ${daysList.length}-Day Expense Ledger (Directly Editable)`
    : `💴 ${daysList.length}日間 費用管理台帳（金額・内容を直接編集可）`;

  document.getElementById("budgetTableHead").innerHTML = en ? `
    <tr>
      <th>Day</th><th>Date</th><th>Region</th><th>Itinerary</th><th>Hotel</th>
      <th class="num-col">Stay (¥)</th><th class="num-col">Travel (¥)</th><th class="num-col">Fun / Food (¥)</th>
      <th class="num-col">Daily Total (¥)</th><th class="num-col">Daily (${window.escapeHtml(cCode)})</th>
    </tr>
  ` : `
    <tr>
      <th>Day</th><th>日付</th><th>エリア</th><th>旅程</th><th>宿泊先</th>
      <th class="num-col">宿泊 Stay (¥)</th><th class="num-col">交通 Travel (¥)</th><th class="num-col">食・遊 Fun (¥)</th>
      <th class="num-col">日計 (¥)</th><th class="num-col">日計 (${window.escapeHtml(cCode)})</th>
    </tr>
  `;

  const regMap = {};
  document.getElementById("budgetTableBody").innerHTML = daysList.map((d, idx) => {
    const stay = Number(d.stay) || 0;
    const travel = Number(d.travelBase) || 0;
    const fun = Number(d.fun) || 0;
    const rowTotal = stay + travel + fun;

    const rLabel = en ? (d.region || "Japan").replace("-", " & ") : (d.region || "日本");
    if (!regMap[rLabel]) regMap[rLabel] = 0;
    regMap[rLabel] += stay + (d.day > 1 && d.day < daysList.length ? travel : 0) + fun;

    return `
      <tr>
        <td><strong>Day ${d.day}</strong></td>
        <td style="white-space:nowrap;">${window.escapeHtml(d.date)} (${window.escapeHtml(d.dow)})</td>
        <td><span class="region-tag">${window.escapeHtml(rLabel)}</span></td>
        <td><input type="text" class="editable-text" value="${window.escapeAttr(d.routeJp || "")}" onchange="updateDayField(${idx}, 'routeJp', this.value)"></td>
        <td><input type="text" class="editable-text" value="${window.escapeAttr(d.hotel || "")}" onchange="updateDayField(${idx}, 'hotel', this.value)"></td>
        <td class="num-col"><input type="number" class="editable-num" value="${stay}" min="0" step="100" onchange="updateDayField(${idx}, 'stay', this.value)"></td>
        <td class="num-col"><input type="number" class="editable-num" value="${travel}" min="0" step="100" onchange="updateDayField(${idx}, 'travelBase', this.value)"></td>
        <td class="num-col"><input type="number" class="editable-num" value="${fun}" min="0" step="100" onchange="updateDayField(${idx}, 'fun', this.value)"></td>
        <td class="num-col"><strong>${window.fmtJpy(rowTotal)}</strong></td>
        <td class="num-col" style="color:var(--ink-muted);">${window.fmtSgd(rowTotal)}</td>
      </tr>
    `;
  }).join("");

  const unmergedRowHtml = b.unmergedTransitGroup > 0 ? `
    <tr style="background:var(--gold-soft);font-weight:700;font-size:13px;">
      <td colspan="8">🚌 ${en ? "Unmerged Local & Post-Pass Transit (Click 'Merge Local Transit' above to fold into daily travel)" : "未合算の現地バス・パス期間外JR運賃（上部の合算ボタンで日別表に統合可能）"}</td>
      <td class="num-col">${window.fmtJpy(b.unmergedTransitGroup)}</td>
      <td class="num-col">${window.fmtSgd(b.unmergedTransitGroup)}</td>
    </tr>
  ` : "";

  const paxRowHtml = b.pax > 1 ? `
    <tr id="budgetPerPaxRow" style="background:var(--indigo-soft);color:var(--indigo);font-weight:800;font-size:14px;">
      <td colspan="5">👥 ${en ? `Price / Pax (${b.pax} Travelers)` : `1名あたり金額（${b.pax}名）`}</td>
      <td class="num-col">${window.fmtJpy(b.stayGroup / b.pax)}<br><small style="font-weight:600;">${window.fmtSgd(b.stayGroup / b.pax)}</small></td>
      <td class="num-col">${window.fmtJpy((b.travelGroup + b.unmergedTransitGroup) / b.pax)}<br><small style="font-weight:600;">${window.fmtSgd((b.travelGroup + b.unmergedTransitGroup) / b.pax)}</small></td>
      <td class="num-col">${window.fmtJpy(b.funGroup / b.pax)}<br><small style="font-weight:600;">${window.fmtSgd(b.funGroup / b.pax)}</small></td>
      <td class="num-col" id="budgetFinalPerPaxJpy">${window.fmtJpy(b.perPaxFinal)} / pax</td>
      <td class="num-col" id="budgetFinalPerPaxSgd">${window.fmtSgd(b.perPaxFinal)} / pax</td>
    </tr>
  ` : "";

  document.getElementById("budgetTableFoot").innerHTML = `
    <tr style="background:var(--surface-alt);font-weight:800;font-size:13.5px;">
      <td colspan="5">${en ? `Itinerary Grand Total (${daysList.length} Days${b.isPerPersonMode ? ` × ${b.pax} Pax` : ""})` : `旅程合計 (${daysList.length}日間${b.isPerPersonMode ? ` × ${b.pax}名` : ""})`}</td>
      <td class="num-col">${window.fmtJpy(b.stayGroup)}<br><small style="font-weight:600;color:var(--ink-muted);">${window.fmtSgd(b.stayGroup)}</small></td>
      <td class="num-col">${window.fmtJpy(b.travelGroup)}<br><small style="font-weight:600;color:var(--ink-muted);">${window.fmtSgd(b.travelGroup)}</small></td>
      <td class="num-col">${window.fmtJpy(b.funGroup)}<br><small style="font-weight:600;color:var(--ink-muted);">${window.fmtSgd(b.funGroup)}</small></td>
      <td class="num-col" id="budgetItineraryGrandTotalJpy">${window.fmtJpy(b.itineraryBaselineGroup)}</td>
      <td class="num-col" id="budgetItineraryGrandTotalSgd">${window.fmtSgd(b.itineraryBaselineGroup)}</td>
    </tr>
    ${unmergedRowHtml}
    <tr id="budgetShoppingExpensesRow" style="background:var(--bg);font-weight:800;font-size:13.5px;">
      <td colspan="8">🛍️ ${en ? `Shopping Expenses (Tab 9${b.taxFreeDiscount > 0 ? ` • Incl. −${window.fmtJpy(b.taxFreeDiscount)} Est. Tax-Free` : ""})` : `買い物リスト費用（タブ9${b.taxFreeDiscount > 0 ? ` • 免税割引 −${window.fmtJpy(b.taxFreeDiscount)} 適用` : ""}）`}</td>
      <td class="num-col" id="budgetShoppingExpensesJpy">${window.fmtJpy(b.shoppingNet)}</td>
      <td class="num-col" id="budgetShoppingExpensesSgd">${window.fmtSgd(b.shoppingNet)}</td>
    </tr>
    <tr id="budgetFinalGrandTotalRow" style="background:var(--accent-soft);font-weight:800;font-size:14.5px;">
      <td colspan="8">💴 ${en ? "Final Grand Total (All-In Trip Budget)" : "最終総合計 (全費用合計)"}</td>
      <td class="num-col" style="color:var(--accent);" id="budgetFinalGrandTotalJpy">${window.fmtJpy(b.finalGrandTotalGroup)}</td>
      <td class="num-col" style="color:var(--accent);" id="budgetFinalGrandTotalSgd">${window.fmtSgd(b.finalGrandTotalGroup)}</td>
    </tr>
    ${paxRowHtml}
  `;

  const denom = b.finalGrandTotalGroup > 0 ? b.finalGrandTotalGroup : 1;
  const cats = [
    { label: en ? "🏨 Accommodations (Stay)" : "🏨 宿泊費 (Stay)", val: b.stayGroup, color: "#1E3A5F" },
    { label: en ? "🍱 Dining & Activities (Fun / Food)" : "🍱 食費・レジャー (Fun)", val: b.funGroup, color: "#D97706" },
    { label: en ? "🚄 Flights, Passes & Transit (Travel)" : "🚄 航空券・鉄道・交通 (Travel)", val: b.travelGroup + b.unmergedTransitGroup, color: "#246347" },
    { label: en ? "🛍️ Shopping List (Net)" : "🛍️ 買い物リスト", val: b.shoppingNet, color: "#C83E2B" }
  ];
  document.getElementById("categoryBars").innerHTML = cats.map(c => {
    const pct = b.finalGrandTotalGroup > 0 ? Math.round((c.val / denom) * 100) : 0;
    return `
      <div class="bar-row">
        <div class="bar-label"><span>${c.label}</span><span>${window.fmtJpy(c.val)} (${window.fmtSgd(c.val)} • ${pct}%)</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${c.color};"></div></div>
      </div>
    `;
  }).join("");

  const regTotal = Object.values(regMap).reduce((a, bVal) => a + bVal, 0) || 1;
  document.getElementById("regionalBars").innerHTML = Object.entries(regMap).map(([rName, rVal]) => {
    const pct = Math.round((rVal / regTotal) * 100);
    return `
      <div class="bar-row">
        <div class="bar-label"><span>${window.escapeHtml(rName)}</span><span>${window.fmtJpy(rVal)} (${window.fmtSgd(rVal)} • ${pct}%)</span></div>
        <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:var(--indigo);"></div></div>
      </div>
    `;
  }).join("");
};
