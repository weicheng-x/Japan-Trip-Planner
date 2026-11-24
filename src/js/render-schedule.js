// Tab 2: Detailed Daily Schedule, Day Insertion/Reorder/Delete & Smart Time Slots

(function() {
  window.SLOT_CATEGORIES = [
    { key: "travel", icon: "🚆", labelEn: "Travel", labelJa: "移動・交通" },
    { key: "sightseeing", icon: "⛩️", labelEn: "Sightseeing", labelJa: "観光・体験" },
    { key: "meal", icon: "🍜", labelEn: "Meal", labelJa: "食事・グルメ" },
    { key: "shopping", icon: "🛍️", labelEn: "Shopping", labelJa: "買い物" },
    { key: "stay", icon: "🏨", labelEn: "Stay / Hotel", labelJa: "宿泊・ホテル" },
    { key: "other", icon: "📌", labelEn: "Other", labelJa: "その他" }
  ];

  function getSlotCategoryMeta(catKey) {
    return window.SLOT_CATEGORIES.find(c => c.key === catKey) || window.SLOT_CATEGORIES[1];
  }

  function getDynamicRegionPills() {
    const en = window.isEn();
    const days = (window.curData().days) || [];
    const groups = new Map();
    days.forEach(d => {
      const pref = typeof window.getPrimaryPrefectureForDay === "function"
        ? window.getPrimaryPrefectureForDay(d)
        : null;
      const key = pref ? `PREF:${pref.id}` : (d.region || (en ? "Other" : "その他"));
      if (!groups.has(key)) {
        groups.set(key, { key, pref, count: 0 });
      }
      groups.get(key).count += 1;
    });
    const pills = [{ key: "ALL", label: en ? `All Days (${days.length}d)` : `全日程 (${days.length}日)` }];
    groups.forEach(g => {
      if (g.pref) {
        const lbl = en ? `${g.pref.nameEn} (${g.count}d)` : `${g.pref.nameJa} (${g.count}日)`;
        pills.push({ key: g.key, label: `📍 ${lbl}` });
      } else {
        pills.push({ key: g.key, label: en ? `${window.formatRegionLabel(g.key, true)} (${g.count}d)` : `${g.key} (${g.count}日)` });
      }
    });
    return pills;
  }

  function getSeasonWeatherTip(regionStr, dateStr, en) {
    const s = window.getSeasonInfoFromDate(dateStr);
    const r = String(regionStr || "").toLowerCase();
    const isNorth = r.includes("hokkaido") || r.includes("北海道") || r.includes("札幌") || r.includes("函館") || r.includes("aomori") || r.includes("青森") || r.includes("iwate") || r.includes("岩手") || r.includes("miyagi") || r.includes("宮城") || r.includes("yamagata") || r.includes("山形");
    const isSouth = r.includes("okinawa") || r.includes("沖縄") || r.includes("ishigaki") || r.includes("石垣") || r.includes("kyushu") || r.includes("九州") || r.includes("福岡");

    if (s.key === "sakura") {
      if (isNorth) return en ? "🌸 2°C–10°C • Crisp northern spring" : "🌸 2°C〜10°C • 北日本の早春・防寒着";
      if (isSouth) return en ? "🌸 17°C–24°C • Mild blossom & spring breeze" : "🌸 17°C〜24°C • 温暖な春の陽気";
      return en ? "🌸 9°C–17°C • Sakura season; light coat & knit" : "🌸 9°C〜17°C • お花見日和・薄手コート";
    }
    if (s.key === "summer") {
      if (isNorth) return en ? "🎆 17°C–25°C • Pleasant Hokkaido summer" : "🎆 17°C〜25°C • 爽やかな北海道の夏";
      if (isSouth) return en ? "🎆 27°C–33°C • Tropical sun & ocean breeze" : "🎆 27°C〜33°C • 南国ビーチ気候・UV対策";
      return en ? "🎆 24°C–32°C • Warm summer & Hanabi nights" : "🎆 24°C〜32°C • 夏祭り・花火シーズン";
    }
    if (s.key === "autumn") {
      if (isNorth) return en ? "🍁 8°C–16°C • Peak alpine Momiji; windproof jacket" : "🍁 8°C〜16°C • 東北紅葉・防風アウター";
      if (isSouth) return en ? "🍁 22°C–28°C • Warm coastal breeze" : "🍁 22°C〜28°C • 温暖で快適";
      return en ? "🍁 12°C–20°C • Crisp autumn foliage weather" : "🍁 12°C〜20°C • 紅葉散策に最適";
    }
    if (isNorth) return en ? "❄️ -3°C–6°C • Snow & onsen weather; warm down" : "❄️ -3°C〜6°C • 雪景色・防寒必須";
    if (isSouth) return en ? "❄️ 16°C–22°C • Mild winter; light jacket" : "❄️ 16°C〜22°C • 温暖な冬・ライト羽織";
    return en ? "❄️ 4°C–12°C • Crisp clear winter skies; wool coat" : "❄️ 4°C〜12°C • 冬の澄んだ空・コート推奨";
  }

  function buildDefaultTimeSlotsForDay(d, isJa, idx, totalDays) {
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
  }

  window.ensureAllDaysHaveTimeSlots = function() {
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = { 1: true };
    const enDays = (state.dataEn && state.dataEn.days) || [];
    const jaDays = (state.dataJa && state.dataJa.days) || [];
    enDays.forEach((d, idx) => {
      if (!Array.isArray(d.timeSlots)) d.timeSlots = buildDefaultTimeSlotsForDay(d, false, idx, enDays.length);
      if (jaDays[idx] && !Array.isArray(jaDays[idx].timeSlots)) jaDays[idx].timeSlots = buildDefaultTimeSlotsForDay(jaDays[idx], true, idx, jaDays.length);
    });
  };

  function reindexDatesKeepingStart() {
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
  }

  window.addItineraryDay = function() {
    const curLen = (state.dataEn.days || []).length;
    const startDt = window.parseDateLocal(state.startDate || "2026-10-21") || new Date(2026, 9, 21);
    const newEnd = new Date(startDt.getFullYear(), startDt.getMonth(), startDt.getDate() + curLen);
    window.updateTripDates(state.startDate, window.formatDateYMD(newEnd));
    window.showToast(window.isEn() ? `➕ Added Day ${curLen + 1} to schedule!` : `➕ Day ${curLen + 1} を追加しました！`);
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
    const isClean = state.activePreset === "__draft__" && (Number(refEn.stay) || 0) === 0 && (Number(refEn.fun) || 0) === 0;
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
    reindexDatesKeepingStart();
    window.ensureAllDaysHaveTimeSlots();
    window.saveState();
    window.renderAll();
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
    reindexDatesKeepingStart();
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = {};
    state.expandedDays[idx + 2] = true;
    window.saveState();
    window.renderAll();
    window.showToast(window.isEn() ? `📋 Duplicated Day ${idx + 1} → Day ${idx + 2}` : `📋 Day ${idx + 1} を複製しました（Day ${idx + 2}）`);
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
    window.renderAll();
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
    window.renderAll();
    window.showToast(en ? "🗑️ Removed transit leg" : "🗑️ 移動区間を削除しました");
  };

  window.moveDayOrder = function(idx, delta, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const daysLen = (state.dataEn.days || []).length;
    const target = idx + delta;
    if (target < 0 || target >= daysLen) return;
    window.pushUndoSnapshot("Reorder day");
    [state.dataEn.days, state.dataJa.days].forEach(arr => {
      if (!arr || !arr[idx] || !arr[target]) return;
      const tmp = arr[idx];
      arr[idx] = arr[target];
      arr[target] = tmp;
    });
    reindexDatesKeepingStart();
    window.saveState();
    window.renderAll();
    window.showToast(window.isEn() ? `↕ Swapped Day ${idx + 1} ↔ Day ${target + 1}` : `↕ Day ${idx + 1} と Day ${target + 1} を入れ替えました`);
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
        reindexDatesKeepingStart();
        window.saveState();
        window.renderAll();
        window.showToast(en ? `🗑️ Deleted Day ${idx + 1}` : `🗑️ Day ${idx + 1} を削除しました`);
      },
      en ? "Delete Day" : "削除"
    );
  };

  window.filterRegionKey = function(key) {
    state.activeRegionKey = key;
    window.renderItineraryCards();
  };

  window.jumpToDayCard = function(dayNum) {
    state.activeRegionKey = "ALL";
    window.renderItineraryCards();
    const el = document.getElementById("day-card-" + dayNum);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  window.toggleDayDetail = function(dayNum, evt) {
    if (evt) {
      const tag = (evt.target && evt.target.tagName) ? evt.target.tagName.toUpperCase() : "";
      if (["INPUT", "SELECT", "TEXTAREA", "A", "OPTION", "BUTTON"].includes(tag)) return;
      if (evt.target && evt.target.closest && evt.target.closest(".day-detail-drawer")) return;
    }
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = {};
    state.expandedDays[dayNum] = !state.expandedDays[dayNum];
    window.saveState();
    window.renderItineraryCards();
  };

  window.setAllDaysExpanded = function(expandFlag) {
    if (!state.expandedDays || typeof state.expandedDays !== "object") state.expandedDays = {};
    ((window.curData().days) || []).forEach(d => { state.expandedDays[d.day] = !!expandFlag; });
    window.saveState();
    window.renderItineraryCards();
    window.showToast(window.isEn()
      ? (expandFlag ? "📂 Expanded all daily schedules" : "📁 Collapsed all daily schedules")
      : (expandFlag ? "📂 全日程を展開しました" : "📁 全日程を折りたたみました"));
  };

  window.updateDayRegionAndMap = function(idx, val) {
    if (window.curData().days[idx]) window.curData().days[idx].region = val;
    if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
      const otherDays = window.isEn() ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[idx]) otherDays[idx].region = val;
    }
    state.manualMapZoom = null;
    window.saveState();
    window.renderAll();
    window.showToast(window.isEn() ? `🗾 Updated Day ${idx + 1} region & refreshed Map` : `🗾 Day ${idx + 1} のエリアを更新し地図と連動しました`);
  };

  window.updateDayRouteAndMap = function(idx, val) {
    if (window.curData().days[idx]) window.curData().days[idx].routeJp = val;
    if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
      const otherDays = window.isEn() ? state.dataJa.days : state.dataEn.days;
      if (otherDays && otherDays[idx]) otherDays[idx].routeJp = val;
    }
    state.manualMapZoom = null;
    window.saveState();
    window.renderAll();
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
    window.renderAll();
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

  function addMinutesToHHMM(hhmm, deltaMins) {
    const m = String(hhmm || "").match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return "10:30";
    let total = parseInt(m[1], 10) * 60 + parseInt(m[2], 10) + deltaMins;
    total = Math.max(0, Math.min(23 * 60 + 30, total));
    return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
  }

  function computeNextSlotDefaults(d, en) {
    const slots = Array.isArray(d && d.timeSlots) ? d.timeSlots : [];
    if (slots.length > 0) {
      const last = slots[slots.length - 1];
      const timeFrom = last.timeTo || "12:00";
      return {
        timeFrom,
        timeTo: addMinutesToHHMM(timeFrom, 90),
        locFrom: last.locTo || (d.region || (en ? "Tokyo" : "東京")),
        locTo: ""
      };
    }
    return {
      timeFrom: "09:00",
      timeTo: "10:30",
      locFrom: (d && d.region) || (en ? "Tokyo" : "東京"),
      locTo: ""
    };
  }

  window.fillStarterTimeSlots = function(dayIdx, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    const enDays = state.dataEn.days || [];
    const jaDays = state.dataJa.days || [];
    if (!enDays[dayIdx]) return;
    window.pushUndoSnapshot("Fill starter time slots");
    enDays[dayIdx].timeSlots = buildDefaultTimeSlotsForDay(enDays[dayIdx], false, dayIdx, enDays.length);
    if (jaDays[dayIdx]) {
      jaDays[dayIdx].timeSlots = buildDefaultTimeSlotsForDay(jaDays[dayIdx], true, dayIdx, jaDays.length);
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
      target.timeSlots.sort((a, b) => String(a.timeFrom || "").localeCompare(String(b.timeFrom || "")));
    });

    state.expandedDays[dayNum] = true;
    window.saveState();
    window.renderItineraryCards();
    const catMeta = getSlotCategoryMeta(category);
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

  window.renderItineraryCards = function() {
    window.ensureAllDaysHaveTimeSlots();
    const en = window.isEn();
    const daysList = (window.curData().days) || [];
    const pills = getDynamicRegionPills();

    window.getMatchedJapanLocations();

    const filterGroup = document.getElementById("regionFilters");
    filterGroup.innerHTML = pills.map(rk => `
      <button type="button" class="pill ${state.activeRegionKey === rk.key ? "active" : ""}" data-key="${window.escapeAttr(rk.key)}" onclick="filterRegionKey(this.dataset.key)">
        ${window.escapeHtml(rk.label)}
      </button>
    `).join("") + `
      <button type="button" class="btn btn-primary" style="padding:5px 10px;font-size:11.5px;margin-left:4px;" onclick="addItineraryDay()">${en ? "+ Add Day" : "+ 日程追加"}</button>
      <button type="button" class="btn" style="padding:5px 10px;font-size:11.5px;" onclick="setAllDaysExpanded(true)">📂 ${en ? "Expand All" : "全展開"}</button>
      <button type="button" class="btn" style="padding:5px 10px;font-size:11.5px;" onclick="setAllDaysExpanded(false)">📁 ${en ? "Collapse All" : "全折畳"}</button>
    `;

    const searchBox = document.getElementById("itinerarySearch");
    searchBox.placeholder = en
      ? "Search city, hotel, activity, or category..."
      : "都市名・ホテル・予定・カテゴリを検索...";

    const jumpStrip = document.getElementById("dayJumpStrip");
    if (jumpStrip) {
      jumpStrip.innerHTML = `<span style="font-size:11px;font-weight:800;color:var(--ink-muted);align-self:center;margin-right:4px;">${en ? "⚡ Jump:" : "⚡ ジャンプ:"}</span>` +
        daysList.map(d => `
          <button type="button" class="day-jump-btn ${d.passCovered ? "pass-day" : ""}" onclick="jumpToDayCard(${d.day})" title="${window.escapeAttr(`Day ${d.day}: ${d.routeJp}`)}">
            D${d.day} (${window.escapeHtml(String(d.date || "").slice(5).replace("-", "/"))})
          </button>
        `).join("");
    }

    const query = (searchBox.value || "").toLowerCase().trim();
    const dayMatchesActiveKey = (d) => {
      if (state.activeRegionKey === "ALL") return true;
      const k = String(state.activeRegionKey || "");
      if (k.startsWith("PREF:")) {
        const targetPrefId = k.slice(5);
        const pref = typeof window.getPrimaryPrefectureForDay === "function"
          ? window.getPrimaryPrefectureForDay(d)
          : null;
        return !!(pref && pref.id === targetPrefId);
      }
      return d.region === k;
    };
    if (state.activeRegionKey !== "ALL" && !daysList.some(dayMatchesActiveKey)) {
      state.activeRegionKey = "ALL";
    }
    const filtered = daysList.filter(d => {
      if (!dayMatchesActiveKey(d)) return false;
      if (query) {
        const slotText = (d.timeSlots || []).map(s => `${s.timeFrom} ${s.timeTo} ${s.locFrom} ${s.locTo} ${s.category} ${s.desc}`).join(" ");
        const hay = `${d.routeJp} ${d.routeEn} ${d.hotel} ${d.region} ${d.tip} ${(d.legs || []).join(" ")} ${slotText}`.toLowerCase();
        return hay.includes(query);
      }
      return true;
    });

    const container = document.getElementById("itineraryList");
    if (filtered.length === 0) {
      container.innerHTML = `<div class="section-card"><p>${en ? 'No days match your filter. Click "All Days" to reset.' : '条件に一致する日程がありません。「全日程」をクリックしてリセットしてください。'}</p></div>`;
      return;
    }

    container.innerHTML = filtered.map(d => {
      const idx = d.day - 1;
      const dayTotal = (Number(d.stay) || 0) + (Number(d.travelBase) || 0) + (Number(d.fun) || 0);
      const weatherTip = getSeasonWeatherTip(d.region, state.startDate || d.date, en);
      const legsHtml = (d.legs || []).map((l, legIdx) => {
        const isNonJr = /non-pass|post-pass|non-jr|パス対象外|パス期間後|jr以外|✈️/i.test(l);
        return `<span class="leg-chip ${isNonJr ? "non-jr" : ""}">🚆 ${window.escapeHtml(l)}<button type="button" class="leg-del-btn" onclick="removeDayTransitLeg(${idx}, ${legIdx}, event)" title="${en ? "Remove leg" : "区間を削除"}">×</button></span>`;
      }).join("") + `
        <span class="leg-add-inline">
          <input type="text" id="newLegInput_${d.day}" class="leg-add-input"
            placeholder="${window.escapeAttr(en ? "Add transit leg (e.g. Tokyo → Kyoto ¥14,170)..." : "移動区間を追加 (例: 東京→京都 新幹線)...")}"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addDayTransitLeg(${idx}, event);}">
          <button type="button" class="btn" style="padding:2px 8px;font-size:11.5px;" onclick="addDayTransitLeg(${idx}, event)" title="${en ? "Add transit leg" : "移動区間を追加"}">+</button>
        </span>
      `;

      const unrecHtml = d._unrecognizedPlace ? `
        <span class="unrecognized-badge">
          ❗ ${en ? `"${window.escapeHtml(d._unrecognizedRaw)}" → Tokyo` : `「${window.escapeHtml(d._unrecognizedRaw)}」→ 東京`}
        </span>
      ` : "";

      const cleanUrl = window.safeUrl(d.hotelUrl);
      const slots = Array.isArray(d.timeSlots) ? d.timeSlots : [];
      const nextSlotDef = computeNextSlotDefaults(d, en);
      const isExpanded = !!(state.expandedDays && state.expandedDays[d.day]);

      const catCounts = {};
      slots.forEach(s => { const k = s.category || "sightseeing"; catCounts[k] = (catCounts[k] || 0) + 1; });
      const catSummaryHtml = window.SLOT_CATEGORIES.filter(c => catCounts[c.key] > 0).map(c => `
        <span class="slot-cat-badge slot-cat-${c.key}">${c.icon} ${en ? c.labelEn : c.labelJa}: ${catCounts[c.key]}</span>
      `).join("");

      const slotRowsHtml = slots.length === 0 ? `
        <tr><td colspan="5" style="text-align:center;padding:12px;color:var(--ink-muted);font-weight:700;">
          ${en ? "No time slots yet. Add your first slot below or click Fill Starter Slots above!" : "時間割はまだありません。下から予定を追加するか上の「基本枠を生成」をクリックできます。"}
        </td></tr>
      ` : slots.map(s => {
        const cKey = s.category || "sightseeing";
        const sIdAttr = window.escapeAttr(s.id);
        return `
          <tr>
            <td style="width:210px;">
              <div class="slot-time-wrap">
                <input type="time" class="slot-time-input" value="${window.escapeAttr(s.timeFrom || "09:00")}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'timeFrom', this.value)">
                <span style="color:var(--ink-muted);font-weight:800;">→</span>
                <input type="time" class="slot-time-input" value="${window.escapeAttr(s.timeTo || "10:30")}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'timeTo', this.value)">
              </div>
            </td>
            <td style="width:150px;">
              <select class="slot-cat-select slot-cat-${cKey}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'category', this.value)">
                ${window.SLOT_CATEGORIES.map(c => `<option value="${c.key}" ${c.key === cKey ? "selected" : ""}>${c.icon} ${en ? c.labelEn : c.labelJa}</option>`).join("")}
              </select>
            </td>
            <td style="width:255px;">
              <div class="slot-loc-wrap">
                <input type="text" class="slot-loc-input" placeholder="${en ? "From..." : "出発地..."}" value="${window.escapeAttr(s.locFrom || "")}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'locFrom', this.value)">
                <span style="color:var(--ink-muted);font-weight:800;">→</span>
                <input type="text" class="slot-loc-input" placeholder="${en ? "To..." : "目的地..."}" value="${window.escapeAttr(s.locTo || "")}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'locTo', this.value)">
              </div>
            </td>
            <td>
              <input type="text" class="slot-desc-input" placeholder="${en ? "Activity description..." : "予定内容..."}" value="${window.escapeAttr(s.desc || "")}" data-slot-id="${sIdAttr}" onchange="updateDayTimeSlotField(${idx}, this.dataset.slotId, 'desc', this.value)">
            </td>
            <td style="width:48px;text-align:right;">
              <button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;" data-slot-id="${sIdAttr}" onclick="deleteDayTimeSlot(${idx}, this.dataset.slotId, event)" title="${en ? "Delete slot" : "削除"}">🗑️</button>
            </td>
          </tr>
        `;
      }).join("");

      const dayPref = typeof window.getPrimaryPrefectureForDay === "function"
        ? window.getPrimaryPrefectureForDay(d)
        : null;
      const prefBadgeHtml = dayPref
        ? `<span class="pref-day-badge" title="${en ? "Detected Prefecture" : "判定された都道府県"}">📍 ${window.escapeHtml(en ? `${dayPref.nameEn} Pref.` : dayPref.nameJa)}</span>`
        : "";

      return `
        <article id="day-card-${d.day}" class="day-card ${d.passCovered ? "pass-active" : ""} ${d.needsAttention || d._unrecognizedPlace ? "needs-attention" : ""}">
          <div class="day-header">
            <div class="day-title-group">
              <span class="day-num">DAY ${d.day}</span>
              <span class="day-date">${window.escapeHtml(d.date)} (${window.escapeHtml(d.dow)})</span>
              <input type="text" class="editable-text" style="width:130px;min-width:105px;font-weight:800;font-size:11.5px;padding:3px 8px;background:var(--surface-alt);border:1px solid var(--border);"
                value="${window.escapeAttr(d.region || "")}" onchange="updateDayRegionAndMap(${idx}, this.value)" title="${en ? "Edit Region/City (updates Map)" : "エリア編集（地図連動）"}">
              ${prefBadgeHtml}
              ${unrecHtml}
              <span style="font-size:11px;color:var(--ink-muted);background:var(--bg);border:1px solid var(--border);padding:2px 8px;border-radius:999px;font-weight:600;">${window.escapeHtml(weatherTip)}</span>
              ${d.passCovered ? `<span class="pass-badge">🚄 ${en ? "Pass Active" : "パス適用"}</span>` : ""}
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <div class="day-actions-mini">
                <button type="button" class="btn" style="padding:3px 7px;font-size:11px;" onclick="duplicateDay(${idx}, event)" title="${en ? "Duplicate day" : "この日を複製"}">📋</button>
                <button type="button" class="btn" style="padding:3px 7px;font-size:11px;" onclick="insertDayAfter(${idx}, event)" title="${en ? "Insert day after this" : "この後に1日追加"}">+📄</button>
                <button type="button" class="btn" style="padding:3px 7px;font-size:11px;" onclick="moveDayOrder(${idx}, -1, event)" ${idx === 0 ? "disabled" : ""} title="${en ? "Move day earlier" : "上へ移動"}">↑</button>
                <button type="button" class="btn" style="padding:3px 7px;font-size:11px;" onclick="moveDayOrder(${idx}, 1, event)" ${idx === daysList.length - 1 ? "disabled" : ""} title="${en ? "Move day later" : "下へ移動"}">↓</button>
                <button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;" onclick="deleteSpecificDay(${idx}, event)" title="${en ? "Delete this day" : "この日を削除"}">🗑️</button>
              </div>
              <div class="day-cost-pill">${window.fmtJpy(dayTotal)} <small>(${window.fmtSgd(dayTotal)})</small></div>
            </div>
          </div>

          <input type="text" class="editable-text day-route-title" value="${window.escapeAttr(d.routeJp || "")}" onchange="updateDayRouteAndMap(${idx}, this.value)" title="${en ? "Edit route title (updates Map)" : "ルート編集（地図連動）"}">
          <input type="text" class="editable-text day-route-sub-input" value="${window.escapeAttr(d.routeEn || "")}" onchange="updateDayField(${idx}, 'routeEn', this.value)" title="${en ? "Edit route notes" : "詳細メモを編集"}">

          <div class="day-meta-grid">
            <div class="meta-item">
              <strong>🏨 ${en ? "Hotel Base" : "宿泊先"}</strong>
              <div style="display:flex;align-items:center;gap:5px;">
                <input type="text" class="day-meta-hotel-input" value="${window.escapeAttr(d.hotel || "")}" onchange="updateDayField(${idx}, 'hotel', this.value)">
                ${cleanUrl ? `<a href="${window.escapeAttr(cleanUrl)}" target="_blank" rel="noopener" title="${en ? "Open hotel site" : "公式サイトを開く"}" style="font-size:12px;font-weight:800;white-space:nowrap;">↗</a>` : ""}
              </div>
            </div>
            <div class="meta-item">
              <strong>🛏️ ${en ? "Stay (¥)" : "宿泊費 (¥)"}</strong>
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                <input type="number" class="editable-num day-meta-num" min="0" step="100" value="${Number(d.stay) || 0}" onchange="updateDayField(${idx}, 'stay', this.value)">
                <small style="color:var(--ink-muted);">(${window.fmtSgd(d.stay)})</small>
              </div>
            </div>
            <div class="meta-item">
              <strong>🚆 ${en ? "Travel (¥)" : "交通費 (¥)"}</strong>
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                <input type="number" class="editable-num day-meta-num" min="0" step="100" value="${Number(d.travelBase) || 0}" onchange="updateDayField(${idx}, 'travelBase', this.value)">
                <small style="color:var(--ink-muted);">(${window.fmtSgd(d.travelBase)})</small>
              </div>
            </div>
            <div class="meta-item">
              <strong>🍱 ${en ? "Dining & Fun (¥)" : "食・遊 (¥)"}</strong>
              <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;">
                <input type="number" class="editable-num day-meta-num" min="0" step="100" value="${Number(d.fun) || 0}" onchange="updateDayField(${idx}, 'fun', this.value)">
                <small style="color:var(--ink-muted);">(${window.fmtSgd(d.fun)})</small>
              </div>
            </div>
          </div>

          <div class="legs-strip">${legsHtml}</div>
          <div class="day-notes">
            <span>💡</span>
            <input type="text" class="editable-text" style="font-size:12px;color:var(--ink-muted);" value="${window.escapeAttr(d.tip || "")}" onchange="updateDayField(${idx}, 'tip', this.value)">
          </div>

          <div class="day-detail-toggle-bar" onclick="toggleDayDetail(${d.day}, event)">
            <div class="day-detail-toggle-title">
              <span>${isExpanded ? "▼" : "▶"} 🕒 ${en ? `Day ${d.day} Time Slots (${slots.length})` : `Day ${d.day} 時間別スケジュール（${slots.length}件）`}</span>
              <span style="font-size:11px;font-weight:600;color:var(--ink-muted);">${en ? (isExpanded ? "— Click to collapse" : "— Click to expand") : (isExpanded ? "— 閉じる" : "— 開く")}</span>
            </div>
            <div class="day-cat-summary-pills">${catSummaryHtml}</div>
          </div>

          <div class="day-detail-drawer ${isExpanded ? "open" : ""}" id="day-detail-drawer-${d.day}">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:8px;">
              <div style="font-size:13px;font-weight:800;">📋 ${en ? `Day ${d.day} (${d.date}) Hourly Plan` : `Day ${d.day}（${d.date}）時間帯別スケジュール`}</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">
                ${slots.length === 0 ? `<button type="button" class="btn" style="padding:4px 10px;font-size:11.5px;" onclick="fillStarterTimeSlots(${idx}, event)">✨ ${en ? "Fill Starter Slots" : "基本枠を生成"}</button>` : ""}
                <button type="button" class="btn" style="padding:4px 10px;font-size:11.5px;" onclick="sortDayTimeSlots(${idx}, event)">⇅ ${en ? "Sort by Time" : "時間順整列"}</button>
              </div>
            </div>
            <div class="data-table-wrap" style="margin-bottom:10px;">
              <table class="slot-list-table">
                <thead>
                  <tr>
                    <th>${en ? "Time (From → To)" : "時間"}</th>
                    <th>${en ? "Category" : "カテゴリ"}</th>
                    <th>${en ? "From → To" : "区間・場所"}</th>
                    <th>${en ? "Activity Description" : "予定・メモ"}</th>
                    <th style="text-align:right;">${en ? "Del" : "削除"}</th>
                  </tr>
                </thead>
                <tbody>${slotRowsHtml}</tbody>
              </table>
            </div>

            <div class="slot-add-bar">
              <div>
                <label class="slot-field-lbl">${en ? "Time" : "時間"}</label>
                <div class="slot-time-wrap">
                  <input type="time" id="newSlotTimeFrom_${d.day}" class="slot-time-input" value="${window.escapeAttr(nextSlotDef.timeFrom)}">
                  <span>→</span>
                  <input type="time" id="newSlotTimeTo_${d.day}" class="slot-time-input" value="${window.escapeAttr(nextSlotDef.timeTo)}">
                </div>
              </div>
              <div>
                <label class="slot-field-lbl">${en ? "Category" : "カテゴリ"}</label>
                <select id="newSlotCat_${d.day}" class="slot-cat-select slot-cat-sightseeing" style="padding:6px 10px;">
                  ${window.SLOT_CATEGORIES.map(c => `<option value="${c.key}">${c.icon} ${en ? c.labelEn : c.labelJa}</option>`).join("")}
                </select>
              </div>
              <div>
                <label class="slot-field-lbl">${en ? "From → To" : "出発地 → 目的地"}</label>
                <div class="slot-loc-wrap">
                  <input type="text" id="newSlotLocFrom_${d.day}" class="slot-loc-input" value="${window.escapeAttr(nextSlotDef.locFrom)}" placeholder="${en ? "From..." : "出発地..."}">
                  <span>→</span>
                  <input type="text" id="newSlotLocTo_${d.day}" class="slot-loc-input" placeholder="${en ? "To..." : "目的地..."}">
                </div>
              </div>
              <div>
                <label class="slot-field-lbl">${en ? "Activity" : "予定詳細"}</label>
                <input type="text" id="newSlotDesc_${d.day}" class="slot-desc-input" placeholder="${en ? "Dinner, transit, sightseeing..." : "食事、移動、観光など..."}" onkeydown="if(event.key==='Enter'){addDayTimeSlot(${idx}, event);}">
              </div>
              <div>
                <button type="button" class="btn btn-primary" style="padding:7px 12px;font-size:12px;" onclick="addDayTimeSlot(${idx}, event)">${en ? "+ Add Slot" : "+ 追加"}</button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join("");
  };
})();
