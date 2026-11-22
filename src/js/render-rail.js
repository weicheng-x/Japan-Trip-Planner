// Tab 5: Dynamic Rail Pass & Ground Transport Optimizer (Shared Metric Engine with KPI Card #3)

(function() {
  const REGION_TEXT_MAP = [
    ["okinawa", "Okinawa"], ["ishigaki", "Okinawa"], ["taketomi", "Okinawa"], ["naha", "Okinawa"], ["沖縄", "Okinawa"], ["石垣", "Okinawa"],
    ["kyushu", "Kyushu"], ["fukuoka", "Kyushu"], ["hakata", "Kyushu"], ["beppu", "Kyushu"], ["yufuin", "Kyushu"], ["kumamoto", "Kyushu"], ["kurokawa", "Kyushu"], ["九州", "Kyushu"], ["福岡", "Kyushu"], ["博多", "Kyushu"], ["別府", "Kyushu"], ["由布院", "Kyushu"], ["熊本", "Kyushu"],
    ["hokkaido", "Hokkaido"], ["sapporo", "Hokkaido"], ["otaru", "Hokkaido"], ["hakodate", "Hokkaido"], ["noboribetsu", "Hokkaido"], ["furano", "Hokkaido"], ["北海道", "Hokkaido"], ["札幌", "Hokkaido"], ["小樽", "Hokkaido"], ["函館", "Hokkaido"], ["富良野", "Hokkaido"], ["登別", "Hokkaido"],
    ["hiroshima", "Chugoku"], ["miyajima", "Chugoku"], ["chugoku", "Chugoku"], ["okayama", "Chugoku"], ["広島", "Chugoku"], ["宮島", "Chugoku"],
    ["kansai", "Kansai"], ["kyoto", "Kansai"], ["osaka", "Kansai"], ["kobe", "Kansai"], ["nara", "Kansai"], ["himeji", "Kansai"], ["arima", "Kansai"], ["関西", "Kansai"], ["京都", "Kansai"], ["大阪", "Kansai"], ["神戸", "Kansai"], ["姫路", "Kansai"],
    ["kanazawa", "Chubu"], ["takayama", "Chubu"], ["shirakawa", "Chubu"], ["hokuriku", "Chubu"], ["kaga", "Chubu"], ["chubu", "Chubu"], ["fuji", "Chubu"], ["hakone", "Chubu"], ["nagoya", "Chubu"], ["金沢", "Chubu"], ["高山", "Chubu"], ["白川郷", "Chubu"], ["加賀", "Chubu"], ["富士", "Chubu"], ["箱根", "Chubu"],
    ["tohoku", "Tohoku"], ["aomori", "Iwate-Aomori"], ["morioka", "Iwate-Aomori"], ["hirosaki", "Iwate-Aomori"], ["sendai", "Miyagi"], ["yamagata", "Yamagata"], ["tendo", "Yamagata"], ["fukushima", "Tohoku"], ["nikko", "Tochigi-Ibaraki"], ["東北", "Tohoku"], ["青森", "Iwate-Aomori"], ["盛岡", "Iwate-Aomori"], ["仙台", "Miyagi"], ["山形", "Yamagata"], ["日光", "Tochigi-Ibaraki"],
    ["tokyo", "Tokyo"], ["shinjuku", "Tokyo"], ["asakusa", "Tokyo"], ["haneda", "Tokyo"], ["narita", "Tokyo"], ["東京", "Tokyo"], ["新宿", "Tokyo"], ["成田", "Tokyo"], ["羽田", "Tokyo"]
  ];

  function getDayRegions(d) {
    const out = new Set();
    const raw = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""}`.replace(/\bhotel\s+nikko\b/gi, "").toLowerCase();
    if (typeof window.findMatchingGazetteerStops === "function") {
      window.findMatchingGazetteerStops(raw).forEach(g => {
        if (g.regionKey) out.add(g.regionKey);
      });
    }
    REGION_TEXT_MAP.forEach(([kw, reg]) => {
      if (raw.includes(kw)) out.add(reg);
    });
    return out;
  }

  function dayMatchesPassScope(d, dayRegs, passObj) {
    if (!passObj || !passObj.days) return false;
    if (Array.isArray(passObj.eligibleRegions) && passObj.eligibleRegions.length > 0 && dayRegs.size > 0) {
      const regOk = passObj.eligibleRegions.some(r => dayRegs.has(r));
      if (!regOk) return false;
    }
    if (passObj.nonJr) {
      const legText = `${d.routeJp || ""} ${(d.legs || []).join(" ")}`.toLowerCase();
      const kws = passObj.nonJrKeywords || [];
      return kws.length === 0 || kws.some(kw => legText.includes(kw));
    }
    return true;
  }

  function isPassEligibleForTrip(passObj, daysList, noPassEval) {
    if (!passObj || passObj.id === "none") return true;
    const tripRegs = new Set();
    daysList.forEach(d => {
      getDayRegions(d).forEach(r => tripRegs.add(r));
    });
    if (Array.isArray(passObj.requiresRegions) && passObj.requiresRegions.length > 0) {
      if (!passObj.requiresRegions.some(r => tripRegs.has(r))) return false;
    }
    if (passObj.nonJr) {
      return daysList.some(d => {
        const dr = getDayRegions(d);
        const jr = Math.max(0, Number(d.jrOnly) || 0);
        const all = Math.max(jr, Number(d.totalAllLegs) || 0);
        return (all - jr) > 0 && dayMatchesPassScope(d, dr, passObj);
      });
    }
    if (!noPassEval || noPassEval.jrSum <= 0) return false;
    return daysList.some(d => {
      const dr = getDayRegions(d);
      return (Number(d.jrOnly) || 0) > 0 && (!passObj.eligibleRegions || dr.size === 0 || passObj.eligibleRegions.some(r => dr.has(r)));
    });
  }

  function evaluatePassAcrossDays(daysList, passObj, passPrice, startDay) {
    const passDays = passObj.days || 0;
    const endDay = passDays > 0 ? (startDay + passDays - 1) : -1;
    let jrSum = 0, nonJrSum = 0, allSum = 0, coveredJrSum = 0, coveredNonJrSum = 0, outOfPocketJrSum = 0;

    daysList.forEach(d => {
      const jr = Math.max(0, Number(d.jrOnly) || 0);
      const all = Math.max(jr, Number(d.totalAllLegs) || 0);
      const nonJr = Math.max(0, all - jr);
      const inWindow = passDays > 0 && d.day >= startDay && d.day <= endDay;
      const dayRegs = getDayRegions(d);
      const scopeOk = inWindow && dayMatchesPassScope(d, dayRegs, passObj);

      jrSum += jr;
      nonJrSum += nonJr;
      allSum += all;

      if (passObj.nonJr) {
        outOfPocketJrSum += jr;
        if (scopeOk && nonJr > 0) {
          coveredNonJrSum += Math.min(nonJr, passObj.maxDailyCovered || nonJr);
        }
      } else {
        if (scopeOk) coveredJrSum += jr;
        else outOfPocketJrSum += jr;
      }
    });

    const coveredTotal = passObj.nonJr ? coveredNonJrSum : coveredJrSum;
    const totalWithPass = passPrice + outOfPocketJrSum + (nonJrSum - coveredNonJrSum);
    const netSavings = coveredTotal - passPrice; // Positive means selected pass beats paying individual fares
    return {
      jrSum,
      nonJrSum,
      allSum,
      coveredJrSum: coveredTotal,
      outOfPocketJrSum,
      totalWithPass,
      netSavings,
      startDay,
      endDay
    };
  }

  function findBestStartDayForPass(daysList, passObj, passPrice) {
    if (!passObj || !passObj.days || daysList.length === 0) {
      return evaluatePassAcrossDays(daysList, passObj || { days: 0, price: 0 }, 0, 1);
    }
    let best = null;
    for (let s = 1; s <= daysList.length; s++) {
      const ev = evaluatePassAcrossDays(daysList, passObj, passPrice, s);
      if (!best || ev.netSavings > best.netSavings) best = ev;
    }
    return best;
  }

  window.computeRailPassMetrics = function() {
    const daysList = (window.curData().days) || [];
    const catalog = window.JR_PASS_CATALOG || [];
    const passObj = catalog.find(p => p.id === (state.selectedPassId || "none")) || catalog[0];
    const passPrice = (state.customPassPrice !== null && state.customPassPrice !== undefined && state.customPassPrice !== "")
      ? Math.max(0, Number(state.customPassPrice) || 0)
      : passObj.price;

    const maxDay = Math.max(1, daysList.length);
    const startDay = Math.max(1, Math.min(maxDay, parseInt(state.passStartDay, 10) || 1));
    const currentEval = evaluatePassAcrossDays(daysList, passObj, passPrice, startDay);
    const noPassEval = evaluatePassAcrossDays(daysList, catalog[0], 0, 1);

    // Find best eligible alternative pass scoped to this trip's regions & transport modes
    let bestAlt = null;
    catalog.forEach(cand => {
      if (cand.id === "none" || cand.id === passObj.id) return;
      if (!isPassEligibleForTrip(cand, daysList, noPassEval)) return;
      const ev = findBestStartDayForPass(daysList, cand, cand.price);
      if (!bestAlt || ev.netSavings > bestAlt.eval.netSavings) {
        bestAlt = { pass: cand, eval: ev };
      }
    });

    return { passObj, passPrice, currentEval, noPassEval, bestAlt };
  };

  window.selectJapanPass = function(passId) {
    state.selectedPassId = passId;
    state.customPassPrice = null;
    const daysLen = ((window.curData().days) || []).length || 1;
    if ((parseInt(state.passStartDay, 10) || 1) > daysLen) state.passStartDay = 1;
    window.saveState();
    window.renderAll();
  };

  window.updatePassStartDay = function(val) {
    state.passStartDay = Math.max(1, parseInt(val, 10) || 1);
    window.saveState();
    window.renderAll();
  };

  window.updateCustomPassPrice = function(val) {
    if (val === "" || val === null) {
      state.customPassPrice = null;
    } else {
      state.customPassPrice = Math.max(0, Number(val) || 0);
    }
    window.saveState();
    window.renderAll();
  };

  window.updateRailDayFare = function(idx, kind, val) {
    const num = Math.max(0, Number(val) || 0);
    [state.dataEn.days, state.dataJa.days].forEach(arr => {
      const d = arr[idx];
      if (!d) return;
      const curJr = Math.max(0, Number(d.jrOnly) || 0);
      const curAll = Math.max(curJr, Number(d.totalAllLegs) || 0);
      const curNonJr = Math.max(0, curAll - curJr);
      if (kind === "jr") {
        d.jrOnly = num;
        d.totalAllLegs = num + curNonJr;
      } else {
        d.totalAllLegs = curJr + num;
      }
    });
    window.saveState();
    window.renderAll();
  };

  window.applyPassWindowToSchedule = function() {
    const en = window.isEn();
    const m = window.computeRailPassMetrics();
    const s = m.currentEval.startDay;
    const e = m.currentEval.endDay;
    const hasPass = m.passObj.days > 0;
    [state.dataEn.days, state.dataJa.days].forEach(arr => {
      arr.forEach(d => {
        d.passCovered = hasPass && d.day >= s && d.day <= e;
      });
    });
    window.saveState();
    window.renderAll();
    window.showToast(hasPass
      ? (en ? `🚄 Synced ${m.passObj.nameEn.split("(")[0].trim()} (Days ${s}–${e}) to Daily Schedule` : `🚄 パス適用期間（Day ${s}〜${e}）を日別スケジュールへ反映しました`)
      : (en ? "🎫 Cleared active Rail Pass flags on Daily Schedule" : "🎫 パス適用フラグを解除しました"));
  };

  window.renderRailTable = function() {
    const en = window.isEn();
    const daysList = (window.curData().days) || [];
    const m = window.computeRailPassMetrics();
    const { passObj, passPrice, currentEval, noPassEval, bestAlt } = m;

    const titleEl = document.getElementById("railTabTitle");
    const leadEl = document.getElementById("railTabLead");
    if (titleEl) {
      titleEl.textContent = en
        ? "🚄 Rail Pass & Ground Transport Optimizer"
        : "🚄 鉄道パス＆現地交通費 最適化シミュレーター";
    }
    if (leadEl) {
      leadEl.innerHTML = en
        ? `Compare your selected pass against individual tickets across this <strong>${daysList.length}-day itinerary</strong>. Edit per-day JR vs Non-JR fares directly in the ledger below to simulate any custom Japan route.`
        : `現在の <strong>${daysList.length}日間ルート</strong> におけるJR運賃とJR以外の現地交通費（バス・私鉄・フェリー・ロープウェー等）をリアルタイム比較できます。下の表で各日の金額を直接編集可能です。`;
    }

    const activeName = en ? passObj.nameEn : passObj.nameJa;
    const hasPass = passObj.days > 0;
    const passBeatsPoint = hasPass && currentEval.netSavings > 0;

    // Strategy Card 1: Selected Pass Strategy
    const card1Html = hasPass ? `
      <div class="strategy-card ${passBeatsPoint ? "optimal" : ""}">
        <span class="strategy-badge" style="background:${passBeatsPoint ? "var(--forest)" : "var(--indigo)"};color:#FFF;">
          ${passBeatsPoint ? (en ? "★ Selected Pass Saves Money" : "★ パス利用がお得") : (en ? "Option 1: Selected Pass" : "プラン①：選択中のパス")}
        </span>
        <h3 style="font-size:15.5px;margin-bottom:6px;">${window.escapeHtml(activeName)}</h3>
        <div style="font-size:23px;font-weight:800;color:${passBeatsPoint ? "var(--forest)" : "var(--ink)"};margin:6px 0;">
          ${window.fmtJpy(currentEval.totalWithPass)} <small style="font-size:12.5px;color:var(--ink-muted);">(${window.fmtSgd(currentEval.totalWithPass)})</small>
        </div>
        <ul style="font-size:12px;color:var(--ink-muted);padding-left:18px;line-height:1.6;">
          <li><strong>${en ? `Window (Days ${currentEval.startDay}–${Math.min(daysList.length, currentEval.endDay)}):` : `適用期間（Day ${currentEval.startDay}〜${Math.min(daysList.length, currentEval.endDay)}）：`}</strong> ${en ? `Pass cost ${window.fmtJpy(passPrice)} covers ${window.fmtJpy(currentEval.coveredJrSum)} of JR/transit fares` : `パス代 ${window.fmtJpy(passPrice)} で対象運賃 ${window.fmtJpy(currentEval.coveredJrSum)} をカバー`}</li>
          <li><strong>${en ? "Out-of-Pocket Non-Covered Fares:" : "パス対象外（期間外JR＋私鉄/バス等）："}</strong> ${window.fmtJpy(currentEval.outOfPocketJrSum + currentEval.nonJrSum)}</li>
          <li><strong>${en ? "Net Difference vs Point-to-Point:" : "通常きっぷとの差額："}</strong> <strong style="color:${passBeatsPoint ? "var(--forest)" : "var(--accent)"};">${currentEval.netSavings >= 0 ? (en ? `Save ${window.fmtJpy(currentEval.netSavings)}` : `${window.fmtJpy(currentEval.netSavings)} お得`) : (en ? `Costs ${window.fmtJpy(Math.abs(currentEval.netSavings))} more` : `${window.fmtJpy(Math.abs(currentEval.netSavings))} 割高`)}</strong></li>
        </ul>
      </div>
    ` : `
      <div class="strategy-card optimal">
        <span class="strategy-badge" style="background:var(--forest);color:#FFF;">★ ${en ? "Active Strategy: Pay-As-You-Go" : "現在採用中：パスなし（都度払い）"}</span>
        <h3 style="font-size:15.5px;margin-bottom:6px;">${en ? "Point-to-Point Tickets & IC Card (No JR Pass)" : "個別きっぷ・交通系ICカード利用"}</h3>
        <div style="font-size:23px;font-weight:800;color:var(--forest);margin:6px 0;">
          ${window.fmtJpy(noPassEval.allSum)} <small style="font-size:12.5px;color:var(--ink-muted);">(${window.fmtSgd(noPassEval.allSum)})</small>
        </div>
        <ul style="font-size:12px;color:var(--ink-muted);padding-left:18px;line-height:1.6;">
          <li><strong>${en ? "JR Rail Fares:" : "JR区間運賃計："}</strong> ${window.fmtJpy(noPassEval.jrSum)}</li>
          <li><strong>${en ? "Non-JR (Metro, Buses, Ferries, Ropeways):" : "JR以外（地下鉄・バス・フェリー等）："}</strong> ${window.fmtJpy(noPassEval.nonJrSum)}</li>
          <li>${en ? "Ideal when regional/island travel relies mostly on buses, ferries, flights, or short rail hops." : "JR線の長距離乗車が少ない旅程・沖縄や都市型観光に最適です。"}</li>
        </ul>
      </div>
    `;

    // Strategy Card 2: No Rail Pass Benchmark
    const card2Html = `
      <div class="strategy-card ${hasPass && !passBeatsPoint ? "optimal" : ""}">
        <span class="strategy-badge" style="background:#E2E8F0;color:#334155;">${en ? "Benchmark: No Rail Pass (Point-to-Point)" : "比較基準：パスなし（全区間個別購入）"}</span>
        <h3 style="font-size:15.5px;margin-bottom:6px;">${en ? `All ${daysList.length} Days Individual Fares` : `全${daysList.length}日間 通常きっぷ＋現地交通`}</h3>
        <div style="font-size:23px;font-weight:800;color:var(--ink);margin:6px 0;">
          ${window.fmtJpy(noPassEval.allSum)} <small style="font-size:12.5px;color:var(--ink-muted);">(${window.fmtSgd(noPassEval.allSum)})</small>
        </div>
        <ul style="font-size:12px;color:var(--ink-muted);padding-left:18px;line-height:1.6;">
          <li><strong>${en ? "JR Fares Total:" : "JR運賃合計："}</strong> ${window.fmtJpy(noPassEval.jrSum)}</li>
          <li><strong>${en ? "Non-JR Transit Total:" : "JR以外の交通費："}</strong> ${window.fmtJpy(noPassEval.nonJrSum)}</li>
          <li><strong>${en ? "Verdict:" : "判定："}</strong> ${noPassEval.jrSum === 0
            ? (en ? "No JR rail legs in this itinerary — IC card / local passes apply." : "この旅程にJR長距離区間はありません（バス・フェリー・地下鉄中心）。")
            : (hasPass && passBeatsPoint
              ? (en ? `Buying individual tickets costs ${window.fmtJpy(currentEval.netSavings)} more than your pass.` : `個別購入より選択パスのほうが ${window.fmtJpy(currentEval.netSavings)} お得です。`)
              : (en ? "Point-to-point tickets / SmartEX beat buying an expensive rail pass here." : "パスを購入するより個別きっぷ・Suica払いが経済的です。"))}</li>
        </ul>
      </div>
    `;

    // Strategy Card 3: Best Alternative Pass Suggestion
    const altBeatsZero = bestAlt && bestAlt.eval.netSavings > 0;
    const altName = bestAlt ? (en ? bestAlt.pass.nameEn : bestAlt.pass.nameJa) : "";
    const card3Html = bestAlt ? `
      <div class="strategy-card ${!passBeatsPoint && altBeatsZero ? "optimal" : ""}">
        <span class="strategy-badge" style="background:var(--gold-soft);color:#92400E;">${en ? "Smart Catalog Recommendation" : "カタログ最適候補の自動提案"}</span>
        <h3 style="font-size:15.5px;margin-bottom:6px;">${altBeatsZero ? window.escapeHtml(altName) : (en ? "Point-to-Point Beats Other Passes" : "他のパスより個別きっぷが優位")}</h3>
        <div style="font-size:23px;font-weight:800;color:#B45309;margin:6px 0;">
          ${altBeatsZero ? window.fmtJpy(bestAlt.eval.totalWithPass) : window.fmtJpy(noPassEval.allSum)}
          <small style="font-size:12.5px;color:var(--ink-muted);">(${window.fmtSgd(altBeatsZero ? bestAlt.eval.totalWithPass : noPassEval.allSum)})</small>
        </div>
        <ul style="font-size:12px;color:var(--ink-muted);padding-left:18px;line-height:1.6;">
          ${altBeatsZero ? `
            <li><strong>${en ? `Best Window (Days ${bestAlt.eval.startDay}–${Math.min(daysList.length, bestAlt.eval.endDay)}):` : `最適開始日（Day ${bestAlt.eval.startDay}〜${Math.min(daysList.length, bestAlt.eval.endDay)}）：`}</strong> ${en ? `Covers ${window.fmtJpy(bestAlt.eval.coveredJrSum)} vs ${window.fmtJpy(bestAlt.pass.price)} pass` : `対象JR運賃 ${window.fmtJpy(bestAlt.eval.coveredJrSum)}（パス代 ${window.fmtJpy(bestAlt.pass.price)}）`}</li>
            <li><strong>${en ? "Net Savings vs Individual Tickets:" : "通常きっぷ比："}</strong> <strong style="color:var(--forest);">${en ? `Save ${window.fmtJpy(bestAlt.eval.netSavings)}` : `${window.fmtJpy(bestAlt.eval.netSavings)} お得`}</strong></li>
            <li><button type="button" class="btn" style="padding:3px 9px;font-size:11px;margin-top:4px;" onclick="state.passStartDay=${bestAlt.eval.startDay};selectJapanPass('${window.escapeAttr(bestAlt.pass.id)}')">⚡ ${en ? "Switch to This Pass" : "このパスに切替"}</button></li>
          ` : `
            <li>${en ? `Across all ${daysList.length} days, JR fares total ${window.fmtJpy(noPassEval.jrSum)} — no alternative pass yields net savings.` : `全${daysList.length}日間のJR運賃計は ${window.fmtJpy(noPassEval.jrSum)} のため、他パスを購入するメリットはありません。`}</li>
          `}
        </ul>
      </div>
    ` : "";

    document.getElementById("railStrategyCards").innerHTML = card1Html + card2Html + card3Html;

    // Pass Selector + Editable Pass Price + Start Day Selector
    const passOptionsHtml = (window.JR_PASS_CATALOG || []).map(p =>
      `<option value="${window.escapeAttr(p.id)}" ${p.id === passObj.id ? "selected" : ""}>${window.escapeHtml(en ? p.nameEn : p.nameJa)} (${window.fmtJpy(p.price)})</option>`
    ).join("");

    document.getElementById("passSimLabel").innerHTML = `
      🎛️ ${en ? "Pass:" : "周遊パス:"}
      <select class="search-input" style="margin-left:4px;font-weight:700;min-width:240px;" onchange="selectJapanPass(this.value)">
        ${passOptionsHtml}
      </select>
      <span style="margin-left:8px;font-size:12px;">${en ? "Pass Price (¥):" : "パス価格 (¥):"}</span>
      <input type="number" class="editable-num" style="width:88px;" value="${passPrice}" step="500" min="0"
        onchange="updateCustomPassPrice(this.value)" title="${en ? "Edit pass price if promo or updated fare applies" : "実購入価格に合わせて変更可能"}">
    `;

    document.getElementById("passSimSub").textContent = hasPass
      ? (en ? `${passObj.days}-Day Window` : `${passObj.days}日間有効`)
      : (en ? "No Pass Selected" : "パス未選択");

    const sel = document.getElementById("passStartSelect");
    if (sel) {
      if (!hasPass) {
        sel.innerHTML = `<option value="1">${en ? "No Pass Activation Window Needed" : "パス適用期間なし"}</option>`;
        sel.disabled = true;
      } else {
        sel.disabled = false;
        let optsHtml = "";
        for (let s = 1; s <= daysList.length; s++) {
          const eDay = Math.min(daysList.length, s + passObj.days - 1);
          const d1 = daysList[s - 1] ? String(daysList[s - 1].date || "").slice(5) : "";
          const d2 = daysList[eDay - 1] ? String(daysList[eDay - 1].date || "").slice(5) : "";
          optsHtml += `<option value="${s}" ${s === currentEval.startDay ? "selected" : ""}>${en ? `Activate Day ${s} → Day ${eDay} (${d1}–${d2})` : `Day ${s}〜Day ${eDay} 開始 (${d1}〜${d2})`}</option>`;
        }
        sel.innerHTML = optsHtml;
      }
    }

    const applyBtn = document.getElementById("btnApplyPassWindow");
    if (applyBtn) applyBtn.textContent = en ? "✓ Sync Window to Schedule" : "✓ 日別スケジュールへ反映";

    document.getElementById("passSimSummary").innerHTML = hasPass
      ? (en
        ? `Simulating <strong>${window.escapeHtml(activeName)}</strong> on <strong>Day ${currentEval.startDay}–${Math.min(daysList.length, currentEval.endDay)}</strong>: Covered JR Fares = <strong>${window.fmtJpy(currentEval.coveredJrSum)}</strong> vs Pass Price = <strong>${window.fmtJpy(passPrice)}</strong> (${currentEval.netSavings >= 0 ? `<strong style="color:var(--forest);">Save ${window.fmtJpy(currentEval.netSavings)} (${window.fmtSgd(currentEval.netSavings)})</strong>` : `<strong style="color:var(--accent);">Point-to-point is cheaper by ${window.fmtJpy(Math.abs(currentEval.netSavings))}</strong>`}). All-In Ground Transit = <strong>${window.fmtJpy(currentEval.totalWithPass)} (${window.fmtSgd(currentEval.totalWithPass)})</strong>.`
        : `<strong>${window.escapeHtml(activeName)}</strong> を <strong>Day ${currentEval.startDay}〜Day ${Math.min(daysList.length, currentEval.endDay)}</strong> で試算：対象運賃計 <strong>${window.fmtJpy(currentEval.coveredJrSum)}</strong> vs パス代 <strong>${window.fmtJpy(passPrice)}</strong>（${currentEval.netSavings >= 0 ? `<strong style="color:var(--forest);">${window.fmtJpy(currentEval.netSavings)} (${window.fmtSgd(currentEval.netSavings)}) お得</strong>` : `<strong style="color:var(--accent);">通常購入の方が ${window.fmtJpy(Math.abs(currentEval.netSavings))} お得</strong>`}）。交通費合計 ＝ <strong>${window.fmtJpy(currentEval.totalWithPass)} (${window.fmtSgd(currentEval.totalWithPass)})</strong>`)
      : (en
        ? `No Rail Pass active. Total point-to-point ground transit across all ${daysList.length} days = <strong>${window.fmtJpy(noPassEval.allSum)} (${window.fmtSgd(noPassEval.allSum)})</strong>.`
        : `鉄道パスなし。全${daysList.length}日間の現地交通費合計 ＝ <strong>${window.fmtJpy(noPassEval.allSum)} (${window.fmtSgd(noPassEval.allSum)})</strong>`);

    document.getElementById("railTableHead").innerHTML = en ? `
      <tr>
        <th>Day</th><th>Date</th><th>Itinerary</th><th>Legs Breakdown</th><th>Pass Status</th>
        <th class="num-col">JR Fare (¥)</th><th class="num-col">Non-JR / Local (¥)</th><th class="num-col">All Legs (¥)</th><th class="num-col">Out-of-Pocket (¥)</th>
      </tr>
    ` : `
      <tr>
        <th>Day</th><th>日付</th><th>旅程</th><th>移動区間</th><th>パス適用</th>
        <th class="num-col">JR運賃 (¥)</th><th class="num-col">JR以外 (¥)</th><th class="num-col">全区間計 (¥)</th><th class="num-col">実質自己負担 (¥)</th>
      </tr>
    `;

    document.getElementById("railTableBody").innerHTML = daysList.map((d, idx) => {
      const inWindow = hasPass && d.day >= currentEval.startDay && d.day <= currentEval.endDay;
      const jr = Math.max(0, Number(d.jrOnly) || 0);
      const all = Math.max(jr, Number(d.totalAllLegs) || 0);
      const nonJr = Math.max(0, all - jr);
      const youPay = (inWindow ? 0 : jr) + nonJr;

      return `
        <tr>
          <td><strong>Day ${d.day}</strong></td>
          <td style="white-space:nowrap;">${window.escapeHtml(d.date)} (${window.escapeHtml(d.dow)})</td>
          <td><strong>${window.escapeHtml(d.routeJp)}</strong></td>
          <td style="font-size:12px;color:var(--ink-muted);">${(d.legs || []).map(l => window.escapeHtml(l)).join(en ? " / " : " ／ ")}</td>
          <td>
            ${inWindow
              ? `<span class="pass-badge">✓ ${en ? `Covered (${d.day - currentEval.startDay + 1}/${passObj.days})` : `適用 (${d.day - currentEval.startDay + 1}/${passObj.days})`}</span>`
              : `<span style="font-size:11.5px;color:var(--ink-muted);font-weight:600;">${en ? "IC / Ticket" : "通常・IC"}</span>`}
          </td>
          <td class="num-col"><input type="number" class="editable-num" value="${jr}" min="0" step="100" onchange="updateRailDayFare(${idx}, 'jr', this.value)"></td>
          <td class="num-col"><input type="number" class="editable-num" value="${nonJr}" min="0" step="100" onchange="updateRailDayFare(${idx}, 'nonJr', this.value)"></td>
          <td class="num-col">${window.fmtJpy(all)}</td>
          <td class="num-col"><strong>${window.fmtJpy(youPay)}</strong></td>
        </tr>
      `;
    }).join("");

    document.getElementById("railTableFoot").innerHTML = `
      <tr style="background:var(--surface-alt);font-weight:800;">
        <td colspan="5">${en ? `Total (${daysList.length} Days${hasPass ? ` • Includes ${window.fmtJpy(passPrice)} Pass` : ""})` : `合計 (${daysList.length}日間${hasPass ? ` • パス代 ${window.fmtJpy(passPrice)} 込` : ""})`}</td>
        <td class="num-col">${window.fmtJpy(currentEval.jrSum)}</td>
        <td class="num-col">${window.fmtJpy(currentEval.nonJrSum)}</td>
        <td class="num-col">${window.fmtJpy(currentEval.allSum)}</td>
        <td class="num-col" style="color:var(--forest);">${window.fmtJpy(currentEval.totalWithPass)}<br><small style="font-weight:600;">${window.fmtSgd(currentEval.totalWithPass)}</small></td>
      </tr>
    `;
  };
})();
