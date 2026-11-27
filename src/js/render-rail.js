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

  function addStopsRegions(stops, out) {
    (stops || []).forEach(g => {
      if (g.regionKey) {
        out.add(g.regionKey);
      } else if (g.prefId && typeof window.getPrefectureById === "function") {
        const p = window.getPrefectureById(g.prefId);
        if (p && p.regionKey) out.add(p.regionKey);
      }
    });
  }

  function getDayRegions(d) {
    const out = new Set();
    if (!d) return out;
    const regText = String(d.region || "").trim();
    const regStops = (regText && typeof window.resolveLocationInputStops === "function")
      ? window.resolveLocationInputStops(regText)
      : [];
    addStopsRegions(regStops, out);

    // When the user explicitly overrode the day's region (e.g., Kawaguchiko -> Akiu), do not leak stale routeJp regions
    if (d._regionOverridden && regStops.length > 0) {
      const regLower = regText.toLowerCase();
      REGION_TEXT_MAP.forEach(([kw, reg]) => {
        if (regLower.includes(kw)) out.add(reg);
      });
      return out;
    }

    const rawBase = `${d.region || ""} ${d.routeJp || ""} ${d.hotel || ""}`;
    const cleaned = typeof window.stripFalsePositivePlaces === "function"
      ? window.stripFalsePositivePlaces(rawBase)
      : rawBase.replace(/\bhotel\s+nikko\b/gi, " ");
    if (typeof window.findMatchingGazetteerStops === "function") {
      addStopsRegions(window.findMatchingGazetteerStops(cleaned), out);
    }
    const raw = cleaned.toLowerCase();
    REGION_TEXT_MAP.forEach(([kw, reg]) => {
      if (raw.includes(kw)) out.add(reg);
    });
    return out;
  }

  function dayMatchesPassScope(d, dayRegs, passObj) {
    if (!passObj || !passObj.days) return false;
    if (Array.isArray(passObj.excludeKeywords) && passObj.excludeKeywords.length > 0) {
      const text = `${d.routeJp || ""} ${d.routeEn || ""} ${(d.legs || []).join(" ")}`.toLowerCase();
      if (passObj.excludeKeywords.some(kw => text.includes(String(kw).toLowerCase()))) {
        return false;
      }
    }
    if (Array.isArray(passObj.eligibleRegions) && passObj.eligibleRegions.length > 0) {
      if (dayRegs.size === 0) return false;
      const allInEligible = Array.from(dayRegs).every(r => passObj.eligibleRegions.includes(r));
      if (!allInEligible) return false;
    }
    if (passObj.nonJr) {
      const legText = `${d.routeJp || ""} ${(d.legs || []).join(" ")}`.toLowerCase();
      const kws = passObj.nonJrKeywords || [];
      return kws.length === 0 || kws.some(kw => legText.includes(kw));
    }
    return true;
  }

  function evaluateRailDay(d, passObj, startDay, endDay, precomputedRegs) {
    const passDays = (passObj && passObj.days) || 0;
    const jr = Math.max(0, Number(d.jrOnly) || 0);
    const all = Math.max(jr, Number(d.totalAllLegs) || 0);
    const nonJr = Math.max(0, all - jr);
    const inWindow = passDays > 0 && d.day >= startDay && d.day <= endDay;
    const dayRegs = precomputedRegs || getDayRegions(d);
    const scopeOk = inWindow && dayMatchesPassScope(d, dayRegs, passObj);

    let coveredJr = 0, coveredNonJr = 0, outOfPocketJr = jr, outOfPocketNonJr = nonJr;
    if (passObj && passObj.nonJr) {
      if (scopeOk && nonJr > 0) {
        coveredNonJr = Math.min(nonJr, passObj.maxDailyCovered || nonJr);
        outOfPocketNonJr = nonJr - coveredNonJr;
      }
    } else if (scopeOk) {
      coveredJr = jr;
      outOfPocketJr = 0;
    }
    const youPay = outOfPocketJr + outOfPocketNonJr;
    return { jr, nonJr, all, inWindow, scopeOk, coveredJr, coveredNonJr, outOfPocketJr, outOfPocketNonJr, youPay };
  }

  function buildPrecomputedDays(daysList) {
    const tripRegs = new Set();
    let jrSum = 0, nonJrSum = 0, allSum = 0;
    const dayInfos = daysList.map(d => {
      const jr = Math.max(0, Number(d.jrOnly) || 0);
      const all = Math.max(jr, Number(d.totalAllLegs) || 0);
      const nonJr = Math.max(0, all - jr);
      const regs = getDayRegions(d);
      regs.forEach(r => tripRegs.add(r));
      jrSum += jr;
      nonJrSum += nonJr;
      allSum += all;
      return { d, day: d.day, jr, nonJr, all, regs };
    });
    return { dayInfos, tripRegs, jrSum, nonJrSum, allSum };
  }

  function computePassScopeFlags(dayInfos, passObj) {
    return dayInfos.map(info => dayMatchesPassScope(info.d, info.regs, passObj));
  }

  function isPassEligibleForTrip(passObj, pre, scopeFlags) {
    if (!passObj || passObj.id === "none") return true;
    if (Array.isArray(passObj.requiresRegions) && passObj.requiresRegions.length > 0) {
      if (!passObj.requiresRegions.some(r => pre.tripRegs.has(r))) return false;
    }
    if (passObj.nonJr) {
      return pre.dayInfos.some((info, i) => info.nonJr > 0 && scopeFlags[i]);
    }
    if (pre.jrSum <= 0) return false;
    return pre.dayInfos.some((info, i) => info.jr > 0 && scopeFlags[i]);
  }

  function evaluatePassFromDailyCovered(pre, passObj, passPrice, startDay, dailyCovered) {
    const passDays = (passObj && passObj.days) || 0;
    const endDay = passDays > 0 ? (startDay + passDays - 1) : -1;
    let coveredTotal = 0;
    if (passDays > 0) {
      for (let i = 0; i < pre.dayInfos.length; i++) {
        const dayNum = pre.dayInfos[i].day;
        if (dayNum >= startDay && dayNum <= endDay) coveredTotal += dailyCovered[i];
      }
    }
    const isNonJr = !!(passObj && passObj.nonJr);
    const outOfPocketJrSum = isNonJr ? pre.jrSum : (pre.jrSum - coveredTotal);
    const outOfPocketNonJrSum = isNonJr ? (pre.nonJrSum - coveredTotal) : pre.nonJrSum;
    const totalWithPass = passPrice + outOfPocketJrSum + outOfPocketNonJrSum;
    const netSavings = coveredTotal - passPrice;
    return {
      jrSum: pre.jrSum,
      nonJrSum: pre.nonJrSum,
      allSum: pre.allSum,
      coveredJrSum: coveredTotal,
      outOfPocketJrSum,
      outOfPocketNonJrSum,
      totalWithPass,
      netSavings,
      startDay,
      endDay
    };
  }

  function findBestStartDayForPass(pre, passObj, passPrice, scopeFlags) {
    const dailyCovered = pre.dayInfos.map((info, i) => {
      if (!scopeFlags[i]) return 0;
      if (passObj && passObj.nonJr) {
        return info.nonJr > 0 ? Math.min(info.nonJr, passObj.maxDailyCovered || info.nonJr) : 0;
      }
      return info.jr;
    });
    if (!passObj || !passObj.days || pre.dayInfos.length === 0) {
      return evaluatePassFromDailyCovered(pre, passObj || { days: 0, price: 0 }, 0, 1, dailyCovered);
    }
    let best = null;
    for (let s = 1; s <= pre.dayInfos.length; s++) {
      const ev = evaluatePassFromDailyCovered(pre, passObj, passPrice, s, dailyCovered);
      if (!best || ev.netSavings > best.netSavings) best = ev;
    }
    return best;
  }

  let _railMetricsCache = null;

  window.computeRailPassMetrics = function() {
    const daysList = (window.curData().days) || [];
    const catalog = window.JR_PASS_CATALOG || [];
    const daysSig = daysList.map(d => `${d.day}|${d._regionOverridden ? 1 : 0}|${d.region || ""}|${d.routeJp || ""}|${Number(d.jrOnly) || 0}|${Number(d.totalAllLegs) || 0}`).join(";");
    const cacheKey = `${(state && state._rev) || 0}|${(state && state.lang) || "en"}|${(state && state.selectedPassId) || "none"}|${(state && state.passStartDay) || 1}|${state && state.customPassPrice !== null && state.customPassPrice !== undefined ? state.customPassPrice : ""}|${daysSig}`;
    if (_railMetricsCache && _railMetricsCache.key === cacheKey) {
      return _railMetricsCache.val;
    }

    const pre = buildPrecomputedDays(daysList);
    const passObj = catalog.find(p => p.id === (state.selectedPassId || "none")) || catalog[0];
    const passPrice = (state.customPassPrice !== null && state.customPassPrice !== undefined && state.customPassPrice !== "")
      ? Math.max(0, Number(state.customPassPrice) || 0)
      : passObj.price;

    const maxDay = Math.max(1, daysList.length);
    const startDay = Math.max(1, Math.min(maxDay, parseInt(state.passStartDay, 10) || 1));

    const curFlags = computePassScopeFlags(pre.dayInfos, passObj);
    const curDailyCovered = pre.dayInfos.map((info, i) => {
      if (!curFlags[i]) return 0;
      if (passObj && passObj.nonJr) {
        return info.nonJr > 0 ? Math.min(info.nonJr, passObj.maxDailyCovered || info.nonJr) : 0;
      }
      return info.jr;
    });
    const currentEval = evaluatePassFromDailyCovered(pre, passObj, passPrice, startDay, curDailyCovered);
    const noPassEval = evaluatePassFromDailyCovered(pre, catalog[0], 0, 1, pre.dayInfos.map(() => 0));

    // Find best eligible alternative pass scoped to this trip's regions & transport modes
    let bestAlt = null;
    catalog.forEach(cand => {
      if (cand.id === "none" || cand.id === passObj.id) return;
      const flags = computePassScopeFlags(pre.dayInfos, cand);
      if (!isPassEligibleForTrip(cand, pre, flags)) return;
      const ev = findBestStartDayForPass(pre, cand, cand.price, flags);
      if (!bestAlt || ev.netSavings > bestAlt.eval.netSavings) {
        bestAlt = { pass: cand, eval: ev };
      }
    });

    const val = { passObj, passPrice, currentEval, noPassEval, bestAlt };
    _railMetricsCache = { key: cacheKey, val };
    return val;
  };

  function refreshView() {
    if (typeof window.refreshActiveViews === "function") window.refreshActiveViews();
    else if (typeof window.renderAll === "function") window.renderAll();
  }

  window.selectJapanPass = function(passId) {
    state.selectedPassId = passId;
    state.customPassPrice = null;
    const daysLen = ((window.curData().days) || []).length || 1;
    if ((parseInt(state.passStartDay, 10) || 1) > daysLen) state.passStartDay = 1;
    window.saveState();
    refreshView();
  };

  window.updatePassStartDay = function(val) {
    state.passStartDay = Math.max(1, parseInt(val, 10) || 1);
    window.saveState();
    refreshView();
  };

  window.updateCustomPassPrice = function(val) {
    if (val === "" || val === null) {
      state.customPassPrice = null;
    } else {
      state.customPassPrice = Math.max(0, Number(val) || 0);
    }
    window.saveState();
    refreshView();
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
    refreshView();
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
    refreshView();
    window.showToast(hasPass
      ? (en ? `🚄 Synced ${m.passObj.nameEn.split("(")[0].trim()} (Days ${s}–${e}) to Daily Schedule` : `🚄 パス適用期間（Day ${s}〜${e}）を日別スケジュールへ反映しました`)
      : (en ? "🎫 Cleared active Rail Pass flags on Daily Schedule" : "🎫 パス適用フラグを解除しました"));
  };

  window.syncRailFaresToBudget = function() {
    const en = window.isEn();
    const m = window.computeRailPassMetrics();
    const { passObj, passPrice, currentEval } = m;
    const startDay = currentEval.startDay;
    const endDay = currentEval.endDay;
    const hasPass = passObj && passObj.days > 0;

    window.pushUndoSnapshot("Sync rail fares to budget");
    [state.dataEn.days, state.dataJa.days].forEach(arr => {
      if (!Array.isArray(arr)) return;
      arr.forEach(d => {
        const ev = evaluateRailDay(d, passObj, startDay, endDay);
        const curTravel = Math.max(0, Number(d.travelBase) || 0);
        const hasFlightNote = /flight|airfare|航空券|✈️/i.test(`${d.routeJp || ""} ${d.routeEn || ""} ${(d.legs || []).join(" ")}`);
        const existingFlightBuffer = (hasFlightNote && curTravel > ev.all) ? (curTravel - ev.all) : 0;
        const passAdd = (hasPass && d.day === startDay) ? passPrice : 0;
        d.travelBase = ev.youPay + existingFlightBuffer + passAdd;
        d.passCovered = hasPass ? (ev.inWindow && ev.scopeOk) : false;
      });
    });

    window.saveState();
    refreshView();
    window.showToast(en
      ? "🔄 Synced Rail Pass out-of-pocket fares into Tab 4 Budget!"
      : "🔄 パス試算後の実質交通費をタブ4予算台帳へ反映しました！");
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
          <li><strong>${en ? "Out-of-Pocket Non-Covered Fares:" : "パス対象外（期間外JR＋私鉄/バス等）："}</strong> ${window.fmtJpy(currentEval.outOfPocketJrSum + currentEval.outOfPocketNonJrSum)}</li>
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
    const syncBudgetBtn = document.getElementById("btnSyncRailToBudget");
    if (syncBudgetBtn) syncBudgetBtn.textContent = en ? "🔄 Sync Rail Fares → Tab 4 Budget" : "🔄 実質交通費を予算表へ反映";

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
      const ev = evaluateRailDay(d, passObj, currentEval.startDay, currentEval.endDay);
      let statusBadgeHtml;
      if (ev.inWindow && ev.scopeOk && (ev.coveredJr > 0 || ev.coveredNonJr > 0)) {
        statusBadgeHtml = `<span class="pass-badge">✓ ${en ? `Covered (${d.day - currentEval.startDay + 1}/${passObj.days})` : `適用 (${d.day - currentEval.startDay + 1}/${passObj.days})`}</span>`;
      } else if (ev.inWindow && !ev.scopeOk && (ev.jr > 0 || (passObj.nonJr && ev.nonJr > 0))) {
        statusBadgeHtml = `<span class="leg-chip non-jr" style="font-size:11px;padding:2px 7px;">${en ? "Out of Area" : "対象外エリア"}</span>`;
      } else {
        statusBadgeHtml = `<span style="font-size:11.5px;color:var(--ink-muted);font-weight:600;">${en ? "IC / Ticket" : "通常・IC"}</span>`;
      }

      return `
        <tr>
          <td><strong>Day ${d.day}</strong></td>
          <td style="white-space:nowrap;">${window.escapeHtml(d.date)} (${window.escapeHtml(d.dow)})</td>
          <td><strong>${window.escapeHtml(d.routeJp)}</strong></td>
          <td style="font-size:12px;color:var(--ink-muted);">${(d.legs || []).map(l => window.escapeHtml(l)).join(en ? " / " : " ／ ")}</td>
          <td>${statusBadgeHtml}</td>
          <td class="num-col"><input type="number" class="editable-num" value="${ev.jr}" min="0" step="100" onchange="updateRailDayFare(${idx}, 'jr', this.value)"></td>
          <td class="num-col"><input type="number" class="editable-num" value="${ev.nonJr}" min="0" step="100" onchange="updateRailDayFare(${idx}, 'nonJr', this.value)"></td>
          <td class="num-col">${window.fmtJpy(ev.all)}</td>
          <td class="num-col"><strong>${window.fmtJpy(ev.youPay)}</strong></td>
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
