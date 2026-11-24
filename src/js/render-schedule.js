// Tab 2: Detailed Daily Schedule Renderer & Intuitive Drag-and-Drop Reordering UI

(function() {
  let _dragFromIdx = null;

  function clearDragVisuals() {
    if (typeof document === "undefined") return;
    document.querySelectorAll(".day-card.dragging, .day-card.drag-over-top, .day-card.drag-over-bottom, .day-jump-btn.dragging, .day-jump-btn.drag-over-pill").forEach(el => {
      el.classList.remove("dragging", "drag-over-top", "drag-over-bottom", "drag-over-pill");
    });
  }

  window.armDayDrag = function(idx) {
    const card = typeof document !== "undefined" ? document.querySelector(`article.day-card[data-day-idx="${idx}"]`) : null;
    if (card) card.setAttribute("draggable", "true");
  };

  window.disarmDayDrag = function(idx) {
    const card = typeof document !== "undefined" ? document.querySelector(`article.day-card[data-day-idx="${idx}"]`) : null;
    if (card) card.setAttribute("draggable", "false");
  };

  window.handleDayDragStart = function(idx, evt) {
    _dragFromIdx = idx;
    if (evt && evt.dataTransfer) {
      evt.dataTransfer.effectAllowed = "move";
      evt.dataTransfer.setData("text/plain", String(idx));
    }
    const el = evt && evt.currentTarget;
    if (el && el.classList) setTimeout(() => el.classList.add("dragging"), 0);
  };

  window.handleDayDragOver = function(targetIdx, evt) {
    if (evt) {
      evt.preventDefault();
      if (evt.dataTransfer) evt.dataTransfer.dropEffect = "move";
      if (typeof window !== "undefined" && typeof window.scrollBy === "function") {
        if (evt.clientY < 110) window.scrollBy(0, -14);
        else if (evt.clientY > (window.innerHeight || 900) - 90) window.scrollBy(0, 14);
      }
    }
    if (_dragFromIdx === null || _dragFromIdx === targetIdx) return;
    const el = evt && evt.currentTarget;
    if (!el || !el.classList) return;
    if (el.classList.contains("day-jump-btn")) {
      document.querySelectorAll(".day-jump-btn.drag-over-pill").forEach(x => { if (x !== el) x.classList.remove("drag-over-pill"); });
      el.classList.add("drag-over-pill");
      return;
    }
    const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    const isBottom = rect ? (evt.clientY > rect.top + rect.height / 2) : (_dragFromIdx < targetIdx);
    el.classList.toggle("drag-over-top", !isBottom);
    el.classList.toggle("drag-over-bottom", isBottom);
  };

  window.handleDayDragLeave = function(evt) {
    const el = evt && evt.currentTarget;
    if (el && el.classList) el.classList.remove("drag-over-top", "drag-over-bottom", "drag-over-pill");
  };

  window.handleDayDrop = function(targetIdx, evt) {
    if (evt) evt.preventDefault();
    let fromIdx = _dragFromIdx;
    if ((fromIdx === null || isNaN(fromIdx)) && evt && evt.dataTransfer) {
      const parsed = parseInt(evt.dataTransfer.getData("text/plain"), 10);
      if (!isNaN(parsed)) fromIdx = parsed;
    }
    clearDragVisuals();
    _dragFromIdx = null;
    if (fromIdx === null || isNaN(fromIdx) || fromIdx === targetIdx) return;
    if (typeof window.reorderItineraryDay === "function") {
      window.reorderItineraryDay(fromIdx, targetIdx);
    }
  };

  window.handleDayDragEnd = function() {
    clearDragVisuals();
    _dragFromIdx = null;
    if (typeof document !== "undefined") {
      document.querySelectorAll("article.day-card[draggable='true']").forEach(c => c.setAttribute("draggable", "false"));
    }
  };

  function getDynamicRegionPills() {
    const en = window.isEn();
    const days = (window.curData().days) || [];
    const groups = new Map();
    days.forEach(d => {
      const pref = typeof window.getPrimaryPrefectureForDay === "function"
        ? window.getPrimaryPrefectureForDay(d)
        : null;
      const key = pref ? `PREF:${pref.id}` : (d.region || (en ? "Other" : "その他"));
      if (!groups.has(key)) groups.set(key, { key, pref, count: 0 });
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
    const isNorth = /hokkaido|北海道|札幌|函館|aomori|青森|iwate|岩手|miyagi|宮城|yamagata|山形/.test(r);
    const isSouth = /okinawa|沖縄|ishigaki|石垣|kyushu|九州|福岡/.test(r);

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
      if (evt.target && evt.target.closest && evt.target.closest(".day-detail-drawer, .day-drag-handle")) return;
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
      jumpStrip.innerHTML = `<span style="font-size:11px;font-weight:800;color:var(--ink-muted);align-self:center;margin-right:4px;" title="${window.escapeAttr(en ? "Click to jump or drag pills (e.g. D15 → D2) to reorder instantly" : "クリックで移動、ドラッグ（例：D15→D2）で瞬時に並べ替え")}">${en ? "⚡ Jump / Drag:" : "⚡ ジャンプ・並替:"}</span>` +
        daysList.map((d, idx) => `
          <button type="button" draggable="true" class="day-jump-btn ${d.passCovered ? "pass-day" : ""}"
            ondragstart="handleDayDragStart(${idx}, event)"
            ondragover="handleDayDragOver(${idx}, event)"
            ondragleave="handleDayDragLeave(event)"
            ondrop="handleDayDrop(${idx}, event)"
            ondragend="handleDayDragEnd()"
            onclick="jumpToDayCard(${d.day})"
            title="${window.escapeAttr(en ? `Day ${d.day}: ${d.routeJp} (Drag to swap/move)` : `Day ${d.day}：${d.routeJp}（ドラッグで移動可）`)}">
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

    const totalDaysCnt = daysList.length;
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

      const dayPref = typeof window.getPrimaryPrefectureForDay === "function"
        ? window.getPrimaryPrefectureForDay(d)
        : null;
      const prefBadgeHtml = dayPref
        ? `<span class="pref-day-badge" title="${en ? "Detected Prefecture" : "判定された都道府県"}">📍 ${window.escapeHtml(en ? `${dayPref.nameEn} Pref.` : dayPref.nameJa)}</span>`
        : "";

      const moveOptionsHtml = totalDaysCnt > 1
        ? `<select class="day-move-select" onchange="reorderItineraryDay(${idx}, Number(this.value))" title="${en ? "Move this day directly to any position" : "移動先の日番号を直接選択"}">
            ${daysList.map((t, tIdx) => `<option value="${tIdx}" ${tIdx === idx ? "selected" : ""}>${tIdx === idx ? (en ? `Move D${d.day}` : `並替 D${d.day}`) : `→ D${t.day}`}</option>`).join("")}
          </select>`
        : "";

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
            <td style="width:270px;">
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

      return `
        <article id="day-card-${d.day}" data-day-idx="${idx}" draggable="false"
          ondragstart="handleDayDragStart(${idx}, event)"
          ondragover="handleDayDragOver(${idx}, event)"
          ondragleave="handleDayDragLeave(event)"
          ondrop="handleDayDrop(${idx}, event)"
          ondragend="handleDayDragEnd()"
          class="day-card ${d.passCovered ? "pass-active" : ""} ${d.needsAttention || d._unrecognizedPlace ? "needs-attention" : ""}">
          <div class="day-header">
            <div class="day-title-group">
              <span class="day-drag-handle" onmousedown="armDayDrag(${idx})" onmouseup="disarmDayDrag(${idx})" title="${en ? "Drag handle to reorder day" : "ここをドラッグして日付を並べ替え"}">⠿</span>
              <span class="day-num">DAY ${d.day}</span>
              <span class="day-date">${window.escapeHtml(d.date)} (${window.escapeHtml(d.dow)})</span>
              <input type="text" class="editable-text" style="width:130px;min-width:105px;font-weight:800;font-size:11.5px;padding:3px 8px;background:var(--surface-alt);border:1px solid var(--border);"
                value="${window.escapeAttr(d.region || "")}" onchange="updateDayRegionAndMap(${idx}, this.value)" title="${en ? "Edit Region/City (updates Map & auto-fills 3-4★ Hotel)" : "エリア編集（地図＆3〜4★ホテル自動設定）"}">
              ${prefBadgeHtml}
              ${unrecHtml}
              <span style="font-size:11px;color:var(--ink-muted);background:var(--bg);border:1px solid var(--border);padding:2px 8px;border-radius:999px;font-weight:600;">${window.escapeHtml(weatherTip)}</span>
              ${d.passCovered ? `<span class="pass-badge">🚄 ${en ? "Pass Active" : "パス適用"}</span>` : ""}
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <div class="day-actions-mini">
                ${moveOptionsHtml}
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
