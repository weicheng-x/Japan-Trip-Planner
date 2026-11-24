// Tab 2 Schedule Domain Actions: Day Add/Map-Sync, 3-4 Star Hotel Auto-Default, Drag-and-Drop Reorder & Time Slots

(function() {
  window.SLOT_CATEGORIES = [
    { key: "travel", icon: "🚆", labelEn: "Travel", labelJa: "移動・交通" },
    { key: "sightseeing", icon: "⛩️", labelEn: "Sightseeing", labelJa: "観光・体験" },
    { key: "meal", icon: "🍜", labelEn: "Meal", labelJa: "食事・グルメ" },
    { key: "shopping", icon: "🛍️", labelEn: "Shopping", labelJa: "買い物" },
    { key: "stay", icon: "🏨", labelEn: "Stay / Hotel", labelJa: "宿泊・ホテル" },
    { key: "other", icon: "📌", labelEn: "Other", labelJa: "その他" }
  ];

  function refreshActiveOrAll() {
    if (typeof window.renderActiveViews === "function") window.renderActiveViews();
    else if (typeof window.renderAll === "function") window.renderAll();
  }

  function isCleanBlankTrip(enDays) {
    return state.activePreset === "__draft__" &&
      (enDays || []).length > 0 &&
      enDays.every(d => (Number(d.stay) || 0) === 0 && (Number(d.fun) || 0) === 0);
  }

  window.buildDefaultTimeSlotsForDay = function(d, isJa, idx, totalDays) {
    const routeParts = String(d.routeJp || "").split(/→|↔/).map(s => s.trim()).filter(Boolean);
    const origin = routeParts[0] || (d.region || (isJa ? "出発地" : "Origin"));
    const dest = routeParts[1] || routeParts[0] || (d.region || (isJa ? "目的地" : "Destination"));
    const secondDest = routeParts[2] || dest;
    const firstLeg = (d.legs && d.legs[0]) ? d.legs[0] : (d.routeEn || d.routeJp || "");
    const hotelName = d.hotel || (isJa ? "宿泊ホテル" : "Hotel Base");
    const isDepartureDay = idx === totalDays - 1 && (Number(d.stay) === 0 || /departure|airport|帰国|出発/i.test(`${d.hotel} ${d.routeJp}`));
    const isArrivalDay = idx === 0 && /arrive|arrival|airport|到着/i.test(`${d.routeJp} ${d.routeEn}`);

    if (isDepartureDay) {
      return isJa ? [
        { id: `slot_${d.day}_1`, timeFrom: "09:00", timeTo: "10:30", locFrom: origin, locTo: origin, category: "stay", desc: "ホテルチェックアウト・荷物整理" },
        { id: `slot_${d.day}_2`, timeFrom: "10:30", timeTo: "13:00", locFrom: origin, locTo: dest, category: "shopping", desc: "最後のお土産ショッピング・ランチ" },
        { id: `slot_${d.day}_3`, timeFrom: "13:30", timeTo: "15:30", locFrom: origin, locTo: secondDest, category: "travel", desc: `空港アクセス移動：${firstLeg}` }
      ] : [
        { id: `slot_${d.day}_1`, timeFrom: "09:00", timeTo: "10:30", locFrom: origin, locTo: origin, category: "stay", desc: "Hotel check-out & pack souvenirs" },
        { id: `slot_${d.day}_2`, timeFrom: "10:30", timeTo: "13:00", locFrom: origin, locTo: dest, category: "shopping", desc: "Last-minute souvenir shopping & farewell lunch" },
        { id: `slot_${d.day}_3`, timeFrom: "13:30", timeTo: "15:30", locFrom: origin, locTo: secondDest, category: "travel", desc: `Airport transfer & departure: ${firstLeg}` }
      ];
    }

    if (isArrivalDay) {
      return isJa ? [
        { id: `slot_${d.day}_1`, timeFrom: "10:00", timeTo: "12:30", locFrom: origin, locTo: dest, category: "travel", desc: `到着・空港アクセス：${firstLeg}` },
        { id: `slot_${d.day}_2`, timeFrom: "14:00", timeTo: "15:30", locFrom: dest, locTo: hotelName, category: "stay", desc: `「${hotelName}」チェックイン・パス/IC準備` },
        { id: `slot_${d.day}_3`, timeFrom: "16:00", timeTo: "19:30", locFrom: hotelName, locTo: secondDest, category: "meal", desc: `${d.region || secondDest}周辺散策＆初日ディナー` }
      ] : [
        { id: `slot_${d.day}_1`, timeFrom: "10:00", timeTo: "12:30", locFrom: origin, locTo: dest, category: "travel", desc: `Arrival & airport transit: ${firstLeg}` },
        { id: `slot_${d.day}_2`, timeFrom: "14:00", timeTo: "15:30", locFrom: dest, locTo: hotelName, category: "stay", desc: `Check in at ${hotelName} & pick up IC card / passes` },
        { id: `slot_${d.day}_3`, timeFrom: "16:00", timeTo: "19:30", locFrom: hotelName, locTo: secondDest, category: "meal", desc: `Evening neighborhood stroll & welcome dinner in ${d.region || secondDest}` }
      ];
    }

    return isJa ? [
      { id: `slot_${d.day}_1`, timeFrom: "08:30", timeTo: "10:30", locFrom: origin, locTo: dest, category: "travel", desc: `移動：${firstLeg}` },
      { id: `slot_${d.day}_2`, timeFrom: "10:45", timeTo: "12:30", locFrom: dest, locTo: secondDest, category: "sightseeing", desc: `${secondDest}エリアの主要スポット観光・散策` },
      { id: `slot_${d.day}_3`, timeFrom: "12:30", timeTo: "14:00", locFrom: secondDest, locTo: secondDest, category: "meal", desc: `${d.region || dest}のご当地グルメランチ・休憩` },
      { id: `slot_${d.day}_4`, timeFrom: "14:15", timeTo: "17:30", locFrom: secondDest, locTo: hotelName, category: "stay", desc: `お土産散策＆「${hotelName}」へ帰着・休憩` }
    ] : [
      { id: `slot_${d.day}_1`, timeFrom: "08:30", timeTo: "10:30", locFrom: origin, locTo: dest, category: "travel", desc: `Transit: ${firstLeg}` },
      { id: `slot_${d.day}_2`, timeFrom: "10:45", timeTo: "12:30", locFrom: dest, locTo: secondDest, category: "sightseeing", desc: `Explore ${secondDest} highlights & scenic sights` },
      { id: `slot_${d.day}_3`, timeFrom: "12:30", timeTo: "14:00", locFrom: secondDest, locTo: secondDest, category: "meal", desc: `Local specialty lunch & café break in ${d.region || dest}` },
      { id: `slot_${d.day}_4`, timeFrom: "14:15", timeTo: "17:30", locFrom: secondDest, locTo: hotelName, category: "stay", desc: `Afternoon shopping & return to ${hotelName}` }
    ];
  };

  window.ensureAllDaysHaveTimeSlots = function() {
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = { 1: true };
    const enDays = (state.dataEn && state.dataEn.days) || [];
    const jaDays = (state.dataJa && state.dataJa.days) || [];
    enDays.forEach((d, idx) => {
      if (!Array.isArray(d.timeSlots)) d.timeSlots = window.buildDefaultTimeSlotsForDay(d, false, idx, enDays.length);
      if (jaDays[idx] && !Array.isArray(jaDays[idx].timeSlots)) jaDays[idx].timeSlots = window.buildDefaultTimeSlotsForDay(jaDays[idx], true, idx, jaDays.length);
    });
  };

  window.reindexDatesKeepingStart = function() {
    const startDt = window.parseDateLocal(state.startDate || "2026-10-21") || new Date(2026, 9, 21);
    const enDays = state.dataEn.days || [];
    const jaDays = state.dataJa.days || [];
    for (let i = 0; i < enDays.length; i++) {
      const dt = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + i);
      const ymd = window.formatDateYMD(dt);
      const dowIdx = dt.getDay();
      enDays[i].day = i + 1;
      enDays[i].date = ymd;
      enDays[i].dow = window.DOW_EN[dowIdx];
      if (jaDays[i]) {
        jaDays[i].day = i + 1;
        jaDays[i].date = ymd;
        jaDays[i].dow = window.DOW_JA[dowIdx];
      }
    }
    const finalDt = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + Math.max(0, enDays.length - 1));
    state.startDate = window.formatDateYMD(startDt);
    state.endDate = window.formatDateYMD(finalDt);
  };

  window.addItineraryDay = function() {
    const curLen = (state.dataEn.days || []).length;
    const startDt = window.parseDateLocal(state.startDate || "2026-10-21") || new Date(2026, 9, 21);
    const newEnd = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + curLen);
    window.updateTripDates(state.startDate, window.formatDateYMD(newEnd));
    window.showToast(window.isEn() ? `➕ Added Day ${curLen + 1} to schedule!` : `➕ Day ${curLen + 1} を追加しました！`);
  };

  window.appendDayFromMapStop = function(rawInput) {
    const label = String(rawInput || "").trim();
    if (!label) return null;
    window.pushUndoSnapshot(`Add map stop ${label}`);
    if (!state.dataEn || !Array.isArray(state.dataEn.days)) state.dataEn.days = [];
    if (!state.dataJa || !Array.isArray(state.dataJa.days)) state.dataJa.days = [];

    const enDays = state.dataEn.days;
    const jaDays = state.dataJa.days;
    const cleanBlank = isCleanBlankTrip(enDays);
    const newNum = enDays.length + 1;

    const matched = typeof window.findMatchingGazetteerStops === "function"
      ? window.findMatchingGazetteerStops(label)
      : [];
    const primaryStop = matched[0] || null;
    const regionEn = primaryStop ? primaryStop.nameEn : label;
    const regionJa = primaryStop ? primaryStop.nameJa : label;

    const defH = typeof window.resolveDefaultHotelForLocation === "function"
      ? window.resolveDefaultHotelForLocation(label)
      : null;
    const hotelEn = (defH && defH.nameEn) || `${regionEn} Hotel`;
    const hotelJa = (defH && defH.nameJa) || `${regionJa} ホテル`;
    const hotelUrl = (defH && defH.url) || "";
    const stayRate = cleanBlank ? 0 : ((defH && defH.perNightJpy) || 12500);
    const funAmt = cleanBlank ? 0 : 8000;
    const transitAmt = cleanBlank ? 0 : 1500;

    enDays.push({
      day: newNum, dow: "Mon", date: state.endDate || state.startDate,
      region: regionEn,
      routeJp: `Day ${newNum}: ${regionEn} Sightseeing & Stay`,
      routeEn: defH ? `${defH.stars || 4}★ Hotel: ${hotelEn} (${defH.accessEn})` : "Explore local attractions & dining",
      stay: stayRate,
      travelBase: transitAmt,
      travelActualAdd: 0,
      fun: funAmt,
      hotel: hotelEn,
      hotelUrl,
      passCovered: false,
      needsAttention: false,
      jrOnly: transitAmt,
      totalAllLegs: transitAmt,
      legs: cleanBlank ? [] : [`Local transit in ${regionEn} (¥1,500 est.)`],
      tip: defH
        ? `Defaulted to curated ${defH.stars || 4}★ stay: ${hotelEn}. Drag-and-drop in Tab 2 to reorder this day anytime.`
        : "Edit hotel, transit & daily activities in Tab 2 anytime.",
      timeSlots: cleanBlank ? [] : undefined
    });

    jaDays.push({
      day: newNum, dow: "月", date: state.endDate || state.startDate,
      region: regionJa,
      routeJp: `Day ${newNum}：${regionJa} 観光＆宿泊`,
      routeEn: defH ? `${defH.stars || 4}★ホテル目安：${hotelJa}（${defH.accessJa}）` : "ご当地グルメ＆観光散策",
      stay: stayRate,
      travelBase: transitAmt,
      travelActualAdd: 0,
      fun: funAmt,
      hotel: hotelJa,
      hotelUrl,
      passCovered: false,
      needsAttention: false,
      jrOnly: transitAmt,
      totalAllLegs: transitAmt,
      legs: cleanBlank ? [] : [`${regionJa} 現地移動（約¥1,500）`],
      tip: defH
        ? `標準${defH.stars || 4}★ホテル「${hotelJa}」を自動設定しました。タブ2でドラッグ並べ替えも可能です。`
        : "日程・宿泊・費用はタブ2からいつでも変更できます。",
      timeSlots: cleanBlank ? [] : undefined
    });

    window.reindexDatesKeepingStart();
    window.ensureAllDaysHaveTimeSlots();
    if (typeof window.applySeasonThemeFromStartDate === "function") {
      window.applySeasonThemeFromStartDate();
    }
    return {
      day: newNum,
      regionEn,
      regionJa,
      hotelName: window.isEn() ? hotelEn : hotelJa
    };
  };

  window.removeLastItineraryDay = function() {
    const curLen = (state.dataEn.days || []).length;
    if (curLen <= 1) {
      window.showToast(window.isEn() ? "⚠️ Trip must have at least 1 day" : "⚠️ 最低1日の日程が必要です");
      return;
    }
    const startDt = window.parseDateLocal(state.startDate || "2026-10-21") || new Date(2026, 9, 21);
    const newEnd = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + curLen - 2);
    window.updateTripDates(state.startDate, window.formatDateYMD(newEnd));
    window.showToast(window.isEn() ? `➖ Removed Day ${curLen}` : `➖ Day ${curLen} を削除しました`);
  };

  window.insertDayAfter = function(idx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    window.pushUndoSnapshot("Insert day");
    const refEn = state.dataEn.days[idx] || {};
    const refJa = state.dataJa.days[idx] || {};
    const isClean = isCleanBlankTrip(state.dataEn.days) || (state.activePreset === "__draft__" && (Number(refEn.stay) || 0) === 0 && (Number(refEn.fun) || 0) === 0);
    const newNum = idx + 2;
    state.dataEn.days.splice(idx + 1, 0, {
      day: newNum, dow: "Mon", date: refEn.date || state.startDate,
      region: refEn.region || "Tokyo",
      routeJp: `${refEn.region || "Tokyo"} Exploration Day`,
      routeEn: "Inserted custom sightseeing & dining day",
      stay: isClean ? 0 : (refEn.stay || 12000),
      travelBase: isClean ? 0 : 1500,
      travelActualAdd: 0,
      fun: isClean ? 0 : 8000,
      hotel: refEn.hotel || "Hotel Base", hotelUrl: refEn.hotelUrl || "",
      passCovered: false, needsAttention: false,
      jrOnly: isClean ? 0 : 1500,
      totalAllLegs: isClean ? 0 : 1500,
      legs: isClean ? [] : ["Local Transit (¥1,500)"],
      tip: "Edit this inserted day's route, hotel, or costs anytime.",
      timeSlots: isClean ? [] : undefined
    });
    if (state.dataJa.days) {
      state.dataJa.days.splice(idx + 1, 0, {
        day: newNum, dow: "月", date: refJa.date || state.startDate,
        region: refJa.region || "東京",
        routeJp: `${refJa.region || "東京"} 観光・追加日`,
        routeEn: "自由散策・ご当地グルメ・現地移動",
        stay: isClean ? 0 : (refJa.stay || 12000),
        travelBase: isClean ? 0 : 1500,
        travelActualAdd: 0,
        fun: isClean ? 0 : 8000,
        hotel: refJa.hotel || "ホテル拠点", hotelUrl: refJa.hotelUrl || "",
        passCovered: false, needsAttention: false,
        jrOnly: isClean ? 0 : 1500,
        totalAllLegs: isClean ? 0 : 1500,
        legs: isClean ? [] : ["現地移動（¥1,500）"],
        tip: "追加した日程のルート・ホテル・予算を自由に編集できます。",
        timeSlots: isClean ? [] : undefined
      });
    }
    window.reindexDatesKeepingStart();
    window.ensureAllDaysHaveTimeSlots();
    window.saveState();
    refreshActiveOrAll();
    window.showToast(window.isEn() ? `➕ Inserted new day after Day ${idx + 1}` : `➕ Day ${idx + 1} の後に新しい日程を挿入しました`);
  };

  window.duplicateDay = function(idx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const enSrc = state.dataEn.days && state.dataEn.days[idx];
    if (!enSrc) return;
    window.pushUndoSnapshot("Duplicate day");
    const stamp = Date.now();
    const cloneDayObj = (src) => {
      if (!src) return null;
      const copy = JSON.parse(JSON.stringify(src));
      copy.legs = Array.isArray(src.legs) ? src.legs.slice() : [];
      copy.timeSlots = Array.isArray(src.timeSlots)
        ? src.timeSlots.map((sl, si) => Object.assign({}, sl, { id: `slot_dup_${stamp}_${si}` }))
        : [];
      return copy;
    };
    state.dataEn.days.splice(idx + 1, 0, cloneDayObj(enSrc));
    if (state.dataJa.days && state.dataJa.days[idx]) {
      state.dataJa.days.splice(idx + 1, 0, cloneDayObj(state.dataJa.days[idx]));
    }
    window.reindexDatesKeepingStart();
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = {};
    state.expandedDays[idx + 2] = true;
    window.saveState();
    refreshActiveOrAll();
    window.showToast(window.isEn() ? `📋 Duplicated Day ${idx + 1} → Day ${idx + 2}` : `📋 Day ${idx + 1} を複製しました（Day ${idx + 2}）`);
  };

  window.reorderItineraryDay = function(fromIdx, toIdx) {
    const enDays = state.dataEn && state.dataEn.days ? state.dataEn.days : [];
    const jaDays = state.dataJa && state.dataJa.days ? state.dataJa.days : [];
    const n = enDays.length;
    if (fromIdx < 0 || fromIdx >= n || toIdx < 0 || toIdx >= n || fromIdx === toIdx) return false;

    window.pushUndoSnapshot(`Move Day ${fromIdx + 1} to Day ${toIdx + 1}`);

    // Remap expanded drawer states so they follow each moved day
    const oldExpanded = Object.assign({}, state.expandedDays || {});
    const orderIdx = Array.from({ length: n }, (_, k) => k);
    const [movedOrigIdx] = orderIdx.splice(fromIdx, 1);
    orderIdx.splice(toIdx, 0, movedOrigIdx);
    const nextExpanded = {};
    orderIdx.forEach((origIdx, newPos) => {
      if (oldExpanded[origIdx + 1]) nextExpanded[newPos + 1] = true;
    });
    state.expandedDays = nextExpanded;

    [enDays, jaDays].forEach(arr => {
      if (!arr || arr.length <= fromIdx) return;
      const [item] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, item);
    });

    window.reindexDatesKeepingStart();
    window.saveState();
    refreshActiveOrAll();
    window.showToast(window.isEn()
      ? `↕ Moved Day ${fromIdx + 1} → Day ${toIdx + 1}`
      : `↕ Day ${fromIdx + 1} を Day ${toIdx + 1} へ移動しました`);
    return true;
  };

  window.moveDayOrder = function(idx, delta, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    return window.reorderItineraryDay(idx, idx + delta);
  };

  window.deleteSpecificDay = function(idx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    if ((state.dataEn.days || []).length <= 1) {
      window.showToast(window.isEn() ? "⚠️ Trip must have at least 1 day" : "⚠️ 最低1日の日程が必要です");
      return;
    }
    const en = window.isEn();
    window.showConfirmModal(
      en ? `Delete Day ${idx + 1}?` : `Day ${idx + 1} を削除しますか？`,
      en ? "Remaining days will be automatically re-numbered and re-dated (you can Undo)." : "残りの日程の日付は自動的に繰り上げられます（「元に戻す」で復元可）。",
      function() {
        window.pushUndoSnapshot(`Delete Day ${idx + 1}`);
        state.dataEn.days.splice(idx, 1);
        if (state.dataJa.days) state.dataJa.days.splice(idx, 1);
        window.reindexDatesKeepingStart();
        window.saveState();
        refreshActiveOrAll();
        window.showToast(en ? `🗑️ Deleted Day ${idx + 1}` : `🗑️ Day ${idx + 1} を削除しました`);
      },
      en ? "Delete Day" : "削除"
    );
  };

  window.addDayTransitLeg = function(dayIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const en = window.isEn();
    const activeDays = window.curData().days || [];
    const d = activeDays[dayIdx];
    if (!d) return;
    const inp = document.getElementById(`newLegInput_${d.day}`);
    const text = inp ? inp.value.trim() : "";
    if (!text) return;

    window.pushUndoSnapshot("Add transit leg");
    if (!Array.isArray(d.legs)) d.legs = [];
    d.legs.push(text);
    if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
      const otherDays = en ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[dayIdx]) {
        if (!Array.isArray(otherDays[dayIdx].legs)) otherDays[dayIdx].legs = [];
        otherDays[dayIdx].legs.push(text);
      }
    }
    if (inp) inp.value = "";
    window.saveState();
    refreshActiveOrAll();
    window.showToast(en ? `🚆 Added transit leg to Day ${d.day}` : `🚆 Day ${d.day} に移動区間を追加しました`);
  };

  window.removeDayTransitLeg = function(dayIdx, legIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const en = window.isEn();
    const activeDays = window.curData().days || [];
    const d = activeDays[dayIdx];
    if (!d || !Array.isArray(d.legs)) return;

    window.pushUndoSnapshot("Remove transit leg");
    d.legs.splice(legIdx, 1);
    if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
      const otherDays = en ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[dayIdx] && Array.isArray(otherDays[dayIdx].legs) && legIdx < otherDays[dayIdx].legs.length) {
        otherDays[dayIdx].legs.splice(legIdx, 1);
      }
    }
    window.saveState();
    refreshActiveOrAll();
    window.showToast(en ? "🗑️ Removed transit leg" : "🗑️ 移動区間を削除しました");
  };

  window.updateDayRegionAndMap = function(idx, val) {
    const en = window.isEn();
    const enDay = state.dataEn && state.dataEn.days && state.dataEn.days[idx];
    const jaDay = state.dataJa && state.dataJa.days && state.dataJa.days[idx];
    const curDay = window.curData().days[idx];
    if (curDay) curDay.region = val;
    const mirror = typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText();
    if (mirror) {
      const otherDays = en ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[idx]) otherDays[idx].region = val;
    }

    // Default 3-4 star city (or prefectural) hotel automatically when user enters a recognised location
    let hotelMsg = "";
    if (typeof window.resolveDefaultHotelForLocation === "function") {
      const defH = window.resolveDefaultHotelForLocation(val);
      if (defH && defH.matchLevel !== "fallback") {
        if (enDay) {
          enDay.hotel = defH.nameEn;
          enDay.hotelUrl = defH.url || "";
          if (Number(enDay.stay) > 0 && defH.perNightJpy) enDay.stay = defH.perNightJpy;
        }
        if (jaDay) {
          jaDay.hotel = defH.nameJa;
          jaDay.hotelUrl = defH.url || "";
          if (Number(jaDay.stay) > 0 && defH.perNightJpy) jaDay.stay = defH.perNightJpy;
        }
        hotelMsg = en ? ` • 🏨 ${defH.nameEn}` : ` • 🏨 ${defH.nameJa}`;
      }
    }

    state.manualMapZoom = null;
    window.saveState();
    refreshActiveOrAll();
    window.showToast(en
      ? `🗾 Updated Day ${idx + 1} region & refreshed Map${hotelMsg}`
      : `🗾 Day ${idx + 1} のエリアを更新し地図と連動しました${hotelMsg}`);
  };

  window.updateDayRouteAndMap = function(idx, val) {
    if (window.curData().days[idx]) window.curData().days[idx].routeJp = val;
    if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
      const otherDays = window.isEn() ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[idx]) otherDays[idx].routeJp = val;
    }
    state.manualMapZoom = null;
    window.saveState();
    refreshActiveOrAll();
    window.showToast(window.isEn() ? `📍 Updated Day ${idx + 1} route & re-centered Map` : `📍 Day ${idx + 1} のルートを更新し日本地図を再調整しました`);
  };

  window.updateDayField = function(idx, field, val) {
    if (field === "stay" || field === "travelBase" || field === "fun") {
      const numVal = Math.max(0, Number(val) || 0);
      if (state.dataEn.days[idx]) state.dataEn.days[idx][field] = numVal;
      if (state.dataJa.days[idx]) state.dataJa.days[idx][field] = numVal;
    } else {
      if (window.curData().days[idx]) window.curData().days[idx][field] = val;
      if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
        const otherDays = window.isEn() ? state.dataJa.days : state.dataEn.days;
        if (otherDays && otherDays[idx]) otherDays[idx][field] = val;
      }
    }
    window.saveState();
    refreshActiveOrAll();
  };

  window.updateDayTimeSlotField = function(dayIdx, slotId, field, val) {
    window.ensureAllDaysHaveTimeSlots();
    const activeDays = window.curData().days;
    const otherDays = window.isEn() ? state.dataJa.days : state.dataEn.days;
    const mirrorText = typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText();
    if (activeDays[dayIdx] && Array.isArray(activeDays[dayIdx].timeSlots)) {
      const s = activeDays[dayIdx].timeSlots.find(x => x.id === slotId);
      if (s) {
        s[field] = val;
        if ((field === "timeFrom" || field === "timeTo") && s.timeFrom && s.timeTo && s.timeTo < s.timeFrom) {
          window.showToast(window.isEn()
            ? `⚠️ End time (${s.timeTo}) is earlier than start time (${s.timeFrom})`
            : `⚠️ 終了時刻 (${s.timeTo}) が開始時刻 (${s.timeFrom}) より前になっています`);
        }
      }
    }
    if (otherDays[dayIdx] && Array.isArray(otherDays[dayIdx].timeSlots)) {
      const sOther = otherDays[dayIdx].timeSlots.find(x => x.id === slotId);
      if (sOther && (mirrorText || field === "timeFrom" || field === "timeTo" || field === "category")) {
        sOther[field] = val;
      }
    }
    window.saveState();
    if (field === "category") window.renderItineraryCards();
  };

  window.fillStarterTimeSlots = function(dayIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const enDays = state.dataEn.days || [];
    const jaDays = state.dataJa.days || [];
    if (!enDays[dayIdx]) return;
    window.pushUndoSnapshot("Fill starter time slots");
    enDays[dayIdx].timeSlots = window.buildDefaultTimeSlotsForDay(enDays[dayIdx], false, dayIdx, enDays.length);
    if (jaDays[dayIdx]) {
      jaDays[dayIdx].timeSlots = window.buildDefaultTimeSlotsForDay(jaDays[dayIdx], true, dayIdx, jaDays.length);
    }
    state.expandedDays[enDays[dayIdx].day] = true;
    window.saveState();
    window.renderItineraryCards();
    window.showToast(window.isEn() ? `✨ Generated starter hourly slots for Day ${dayIdx + 1}` : `✨ Day ${dayIdx + 1} の基本時間帯プランを生成しました`);
  };

  window.addDayTimeSlot = function(dayIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    window.ensureAllDaysHaveTimeSlots();
    const en = window.isEn();
    const d = window.curData().days[dayIdx];
    if (!d) return;
    const dayNum = d.day;

    const timeFrom = (document.getElementById(`newSlotTimeFrom_${dayNum}`)?.value || "09:00").trim() || "09:00";
    const timeTo = (document.getElementById(`newSlotTimeTo_${dayNum}`)?.value || "10:30").trim() || "10:30";
    const category = (document.getElementById(`newSlotCat_${dayNum}`)?.value || "sightseeing") || "sightseeing";
    const locFrom = (document.getElementById(`newSlotLocFrom_${dayNum}`)?.value || "").trim();
    const locTo = (document.getElementById(`newSlotLocTo_${dayNum}`)?.value || "").trim();
    const desc = (document.getElementById(`newSlotDesc_${dayNum}`)?.value || "").trim();

    if (!desc && !locFrom && !locTo) {
      window.showToast(en ? "⚠️ Enter an activity description or From/To details." : "⚠️ 予定内容（または出発地・目的地）を入力してください。");
      return;
    }

    const newSlot = {
      id: `slot_${dayNum}_${Date.now()}`,
      timeFrom, timeTo,
      locFrom: locFrom || (d.region || ""),
      locTo: locTo || (d.region || ""),
      category,
      desc: desc || `${locFrom || "Start"} → ${locTo || "Destination"}`
    };

    [state.dataEn.days[dayIdx], state.dataJa.days[dayIdx]].forEach(target => {
      if (!target) return;
      if (!Array.isArray(target.timeSlots)) target.timeSlots = [];
      target.timeSlots.push(Object.assign({}, newSlot));
    });
    state.expandedDays[dayNum] = true;
    window.saveState();
    window.renderItineraryCards();
    const catMeta = window.SLOT_CATEGORIES.find(c => c.key === category) || window.SLOT_CATEGORIES[1];
    window.showToast(en
      ? `${catMeta.icon} Added ${catMeta.labelEn} (${timeFrom}–${timeTo}) to Day ${dayNum}`
      : `${catMeta.icon} Day ${dayNum}に「${catMeta.labelJa}」を追加しました`);
  };

  window.deleteDayTimeSlot = function(dayIdx, slotId, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    window.ensureAllDaysHaveTimeSlots();
    [state.dataEn.days[dayIdx], state.dataJa.days[dayIdx]].forEach(target => {
      if (target && Array.isArray(target.timeSlots)) {
        target.timeSlots = target.timeSlots.filter(s => s.id !== slotId);
      }
    });
    window.saveState();
    window.renderItineraryCards();
    window.showToast(window.isEn() ? "🗑️ Removed time slot" : "🗑️ 時間枠を削除しました");
  };

  window.sortDayTimeSlots = function(dayIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    window.ensureAllDaysHaveTimeSlots();
    [state.dataEn.days[dayIdx], state.dataJa.days[dayIdx]].forEach(target => {
      if (target && Array.isArray(target.timeSlots)) {
        target.timeSlots.sort((a, b) => String(a.timeFrom || "").localeCompare(String(b.timeFrom || "")));
      }
    });
    window.saveState();
    window.renderItineraryCards();
    window.showToast(window.isEn() ? "⇅ Sorted time slots chronologically" : "⇅ 時間順に整列しました");
  };
})();
