// Tab 3: Hotel & Accommodation Ledger (Full Inline Editing, Booking Notes & Clean Day Sync)

window.addCustomHotel = function() {
  const en = window.isEn();
  const name = (document.getElementById("newHotelName")?.value || "").trim();
  const region = (document.getElementById("newHotelRegion")?.value || "").trim() || (en ? "Tokyo" : "東京");
  const nights = Math.max(1, parseInt(document.getElementById("newHotelNights")?.value || "2", 10) || 2);
  const rate = Math.max(0, parseFloat(document.getElementById("newHotelRate")?.value || "15000") || 0);
  const access = (document.getElementById("newHotelAccess")?.value || "").trim() || (en ? "Near JR / Metro Station" : "最寄り駅徒歩圏内");
  const url = (document.getElementById("newHotelUrl")?.value || "").trim();

  if (!name) {
    window.showToast(en ? "Please enter a hotel name" : "ホテル名を入力してください");
    return;
  }

  window.pushUndoSnapshot("Add hotel");
  const newOrder = ((window.curData().hotels) || []).length + 1;
  const hObj = {
    order: newOrder,
    name,
    region,
    checkIn: state.startDate || "2026-10-21",
    checkOut: state.endDate || "2026-10-23",
    nights,
    perNightJpy: rate,
    totalJpy: nights * rate,
    url,
    access,
    bookingNote: "",
    highlights: en ? "Added via Hotel Ledger." : "ホテル台帳から追加された宿泊拠点。",
    luxury: rate >= 30000
  };
  state.dataEn.hotels.push(Object.assign({}, hObj));
  state.dataJa.hotels.push(Object.assign({}, hObj));
  window.saveState();
  window.renderAll();
  window.showToast(en ? `🏨 Added "${name}" (${nights}N)` : `🏨 「${name}」（${nights}泊）を追加しました`);
};

window.deleteHotelStay = function(idx) {
  window.pushUndoSnapshot("Delete hotel");
  state.dataEn.hotels.splice(idx, 1);
  state.dataJa.hotels.splice(idx, 1);
  state.dataEn.hotels.forEach((h, i) => { h.order = i + 1; });
  state.dataJa.hotels.forEach((h, i) => { h.order = i + 1; });
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Removed hotel stay" : "🗑️ ホテルを削除しました");
};

window.updateHotelField = function(idx, field, val) {
  if (field === "nights" || field === "perNightJpy") {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (!arr[idx]) return;
      arr[idx][field] = Math.max(0, Number(val) || 0);
      arr[idx].totalJpy = (Number(arr[idx].nights) || 0) * (Number(arr[idx].perNightJpy) || 0);
      arr[idx].luxury = (Number(arr[idx].perNightJpy) || 0) >= 30000;
    });
  } else if (field === "url" || field === "checkIn" || field === "checkOut") {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (arr[idx]) arr[idx][field] = val;
    });
  } else {
    const curHotels = window.curData().hotels || [];
    if (curHotels[idx]) curHotels[idx][field] = val;
  }
  window.saveState();
  window.renderAll();
};

window.syncHotelsToDailyBudget = function() {
  window.pushUndoSnapshot("Sync hotels to schedule");
  const enHotels = state.dataEn.hotels || [];
  const jaHotels = state.dataJa.hotels || [];

  const applySync = (hotels, days) => {
    let dayIdx = 0;
    hotels.forEach(h => {
      const n = Math.max(0, Number(h.nights) || 0);
      for (let k = 0; k < n && dayIdx < days.length; k++) {
        days[dayIdx].stay = Number(h.perNightJpy) || 0;
        days[dayIdx].hotel = h.name;
        days[dayIdx].hotelUrl = h.url || "";
        days[dayIdx].region = h.region;
        dayIdx++;
      }
    });
    // Zero out stay on any remaining departure day if hotels only cover N-1 nights
    if (dayIdx === days.length - 1 && days[dayIdx]) {
      days[dayIdx].stay = 0;
    }
  };

  applySync(enHotels, state.dataEn.days || []);
  applySync(jaHotels, state.dataJa.days || []);
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn()
    ? "🔄 Synced Hotel Names, Official Links, Nights & Rates to Daily Schedule!"
    : "🔄 ホテル名・公式URL・宿泊数・単価を日別スケジュールへ反映しました！");
};

window.renderHotelsTab = function() {
  const en = window.isEn();
  const hotelsList = (window.curData().hotels) || [];
  const totalStay = hotelsList.reduce((acc, h) => acc + (Number(h.totalJpy) || 0), 0);
  const totalNights = hotelsList.reduce((acc, h) => acc + (Number(h.nights) || 0), 0);

  document.getElementById("hotelsTabTitle").textContent = en
    ? `🏨 Hotel & Accommodation Ledger (${hotelsList.length} Bases • ${totalNights} Nights)`
    : `🏨 宿泊・ホテル台帳（全${hotelsList.length}拠点・${totalNights}泊）`;
  document.getElementById("hotelSummaryHeader").textContent = en
    ? `Total ${totalNights} Nights: ${window.fmtJpy(totalStay)} (${window.fmtSgd(totalStay)})`
    : `全${totalNights}泊 合計：${window.fmtJpy(totalStay)} (${window.fmtSgd(totalStay)})`;
  document.getElementById("hotelsTabLead").innerHTML = en
    ? `Manage accommodations, booking confirmation notes, and official hotel links. Click <strong>Sync Hotels to Daily Schedule</strong> to push nightly rates, hotel names & URLs straight into Tab 2 & Tab 4.`
    : `宿泊拠点・予約メモ・公式ホテルURLを管理できます。変更後は「日別スケジュールへ反映」ボタンでタブ2・タブ4へ一括反映できます。`;

  const addBarHtml = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;background:var(--surface-alt);padding:12px;border-radius:10px;align-items:center;">
      <input type="text" id="newHotelName" class="search-input" placeholder="${en ? "Hotel Name" : "ホテル名"}" style="min-width:170px;flex:1;">
      <input type="text" id="newHotelRegion" class="search-input" placeholder="${en ? "City / Region" : "都市・エリア"}" style="min-width:130px;">
      <input type="number" id="newHotelNights" class="editable-num" value="2" min="1" max="30" style="width:60px;" title="${en ? "Nights" : "泊数"}">
      <span style="font-size:12px;font-weight:700;">${en ? "N @" : "泊 ×"}</span>
      <input type="number" id="newHotelRate" class="editable-num" value="15000" step="500" style="width:88px;" title="${en ? "Rate/night" : "1泊単価"}">
      <span style="font-size:12px;font-weight:700;">¥/night</span>
      <input type="text" id="newHotelAccess" class="search-input" placeholder="${en ? "Station Access" : "最寄り駅・アクセス"}" style="min-width:140px;">
      <input type="url" id="newHotelUrl" class="search-input" placeholder="${en ? "Official Website (https://...)" : "公式サイトURL (https://...)"}" style="min-width:190px;flex:1;">
      <button type="button" class="btn btn-primary" onclick="addCustomHotel()">${en ? "+ Add Hotel" : "+ ホテル追加"}</button>
      <button type="button" class="btn" onclick="syncHotelsToDailyBudget()">🔄 ${en ? "Sync Hotels to Daily Schedule" : "日別スケジュールへ反映"}</button>
    </div>
  `;

  const grid = document.getElementById("hotelGrid");
  grid.innerHTML = `<div style="grid-column: 1 / -1;">${addBarHtml}</div>` + hotelsList.map((h, idx) => {
    const cleanUrl = window.safeUrl(h.url);
    return `
      <div class="hotel-card ${h.luxury ? "luxury" : ""}">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
            <input type="text" class="editable-text" style="width:auto;min-width:110px;max-width:180px;font-size:11px;font-weight:800;background:var(--indigo-soft);color:var(--indigo);border-radius:999px;padding:3px 10px;"
              value="${window.escapeAttr(h.region || "")}" onchange="updateHotelField(${idx}, 'region', this.value)" title="${en ? "Edit region" : "エリア編集"}">
            <div style="display:flex;align-items:center;gap:5px;">
              <input type="number" class="editable-num" style="width:55px;padding:3px 5px;" value="${Number(h.nights) || 0}" min="1" onchange="updateHotelField(${idx}, 'nights', this.value)">
              <span style="font-size:11.5px;font-weight:800;">${en ? "Nights" : "泊"}</span>
              <button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;" onclick="deleteHotelStay(${idx})">🗑️</button>
            </div>
          </div>

          <input type="text" class="editable-text" style="font-size:16px;font-weight:800;margin-bottom:5px;" value="${window.escapeAttr(h.name || "")}" onchange="updateHotelField(${idx}, 'name', this.value)" title="${en ? "Edit hotel name" : "ホテル名編集"}">

          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink-muted);margin-bottom:9px;flex-wrap:wrap;">
            <span>📅</span>
            <input type="text" class="editable-text" style="width:125px;min-width:95px;font-size:12px;padding:2px 6px;border:1px solid var(--border);background:var(--bg);" value="${window.escapeAttr(h.checkIn || "")}" onchange="updateHotelField(${idx}, 'checkIn', this.value)">
            <span>→</span>
            <input type="text" class="editable-text" style="width:145px;min-width:105px;font-size:12px;padding:2px 6px;border:1px solid var(--border);background:var(--bg);" value="${window.escapeAttr(h.checkOut || "")}" onchange="updateHotelField(${idx}, 'checkOut', this.value)">
          </div>

          <div style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 11px;font-size:12px;margin-bottom:9px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <strong>🚉</strong>
              <input type="text" class="editable-text" style="font-size:12px;" value="${window.escapeAttr(h.access || "")}" onchange="updateHotelField(${idx}, 'access', this.value)" placeholder="${en ? "Station access" : "アクセス"}">
            </div>
            <div style="margin-top:4px;">
              <input type="text" class="editable-text" style="font-size:12px;color:var(--ink-muted);" value="${window.escapeAttr(h.highlights || "")}" onchange="updateHotelField(${idx}, 'highlights', this.value)" placeholder="${en ? "Highlights" : "特徴メモ"}">
            </div>
            <div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--border);display:flex;align-items:center;gap:6px;">
              <span style="font-size:11px;font-weight:700;color:var(--ink-muted);white-space:nowrap;">🔖 ${en ? "Ref #:" : "予約メモ:"}</span>
              <input type="text" class="editable-text" style="font-size:11.5px;padding:2px 6px;border:1px solid var(--border);background:var(--surface);" placeholder="${en ? "Confirmation / check-in note..." : "予約番号・チェックイン時刻..."}" value="${window.escapeAttr(h.bookingNote || "")}" onchange="updateHotelField(${idx}, 'bookingNote', this.value)">
            </div>
            <div style="margin-top:6px;display:flex;align-items:center;gap:6px;">
              <span style="font-size:11px;font-weight:700;color:var(--ink-muted);white-space:nowrap;">🔗 URL:</span>
              <input type="url" class="editable-text" style="font-size:11.5px;padding:2px 6px;border:1px solid var(--border);background:var(--surface);" placeholder="https://..." value="${window.escapeAttr(h.url || "")}" onchange="updateHotelField(${idx}, 'url', this.value)">
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:9px;border-top:1px solid var(--border);gap:8px;flex-wrap:wrap;">
          <div>
            <span style="font-size:11px;color:var(--ink-light);display:block;">
              ${en ? "Rate (¥/night):" : "1泊単価 (¥):"}
              <input type="number" class="editable-num" style="width:80px;padding:2px 5px;font-size:11.5px;" value="${Number(h.perNightJpy) || 0}" step="500" min="0" onchange="updateHotelField(${idx}, 'perNightJpy', this.value)">
            </span>
            <strong style="font-size:15.5px;color:var(--ink);">${en ? "Subtotal" : "小計"} ${window.fmtJpy(h.totalJpy)} <small style="color:var(--ink-muted);">(${window.fmtSgd(h.totalJpy)})</small></strong>
          </div>
          ${cleanUrl
            ? `<a href="${window.escapeAttr(cleanUrl)}" target="_blank" rel="noopener" class="btn btn-primary" style="border-bottom:none;color:#FFF;">🔗 ${en ? "Official Hotel Site" : "ホテル公式サイト"}</a>`
            : `<span class="no-site-badge">${en ? "No official hotel site" : "公式サイトなし"}</span>`}
        </div>
      </div>
    `;
  }).join("");
};
