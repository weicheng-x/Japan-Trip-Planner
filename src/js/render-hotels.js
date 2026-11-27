// Tab 3: Hotel & Accommodation Ledger (Full Inline Editing, Date Auto-Chaining & Clean Day Sync)

function shiftHotelYmd(ymd, deltaDays) {
  const dt = window.parseDateLocal(String(ymd || "").split("(")[0].trim());
  if (!dt) return ymd || "";
  const shifted = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + deltaDays);
  return window.formatDateYMD(shifted);
}

window.addCustomHotel = function() {
  const en = window.isEn();
  const nameInp = document.getElementById("newHotelName");
  const urlInp = document.getElementById("newHotelUrl");
  const name = (nameInp?.value || "").trim();
  const region = (document.getElementById("newHotelRegion")?.value || "").trim() || (en ? "Tokyo" : "東京");
  const nights = Math.max(1, Math.round(parseFloat(document.getElementById("newHotelNights")?.value || "2") || 2));
  const rate = Math.round(Math.max(0, parseFloat(document.getElementById("newHotelRate")?.value || "15000") || 0));
  const access = (document.getElementById("newHotelAccess")?.value || "").trim() || (en ? "Near JR / Metro Station" : "最寄り駅徒歩圏内");
  const url = (urlInp?.value || "").trim();

  if (!name) {
    window.showToast(en ? "Please enter a hotel name" : "ホテル名を入力してください");
    return;
  }

  window.pushUndoSnapshot("Add hotel");
  const existing = (window.curData().hotels) || [];
  const lastH = existing[existing.length - 1];
  let checkIn = state.startDate || "2027-04-01";
  if (lastH && lastH.checkOut) {
    const cleanOut = String(lastH.checkOut).split("(")[0].trim();
    if (window.parseDateLocal(cleanOut)) checkIn = cleanOut;
  }
  const checkOut = shiftHotelYmd(checkIn, nights) || checkIn;

  const newOrder = existing.length + 1;
  const hObj = {
    order: newOrder,
    name,
    region,
    checkIn,
    checkOut,
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
  if (nameInp) nameInp.value = "";
  if (urlInp) urlInp.value = "";
  window.saveState();
  window.refreshActiveViews ? window.refreshActiveViews() : window.renderAll();
  window.showToast(en ? `🏨 Added "${name}" (${nights}N: ${checkIn} → ${checkOut})` : `🏨 「${name}」（${nights}泊：${checkIn} → ${checkOut}）を追加しました`);
};

window.moveHotelOrder = function(idx, delta) {
  const list = (state.dataEn && state.dataEn.hotels) || [];
  const target = idx + delta;
  if (target < 0 || target >= list.length) return;
  window.pushUndoSnapshot("Reorder hotel");
  [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
    if (!arr || !arr[idx] || !arr[target]) return;
    const tmp = arr[idx];
    arr[idx] = arr[target];
    arr[target] = tmp;
    arr.forEach((h, i) => { h.order = i + 1; });
  });
  window.saveState();
  window.refreshActiveViews ? window.refreshActiveViews() : window.renderAll();
  window.showToast(window.isEn() ? "↕ Reordered hotel stay" : "↕ ホテルの順番を入れ替えました");
};

window.deleteHotelStay = function(idx) {
  window.pushUndoSnapshot("Delete hotel");
  state.dataEn.hotels.splice(idx, 1);
  state.dataJa.hotels.splice(idx, 1);
  state.dataEn.hotels.forEach((h, i) => { h.order = i + 1; });
  state.dataJa.hotels.forEach((h, i) => { h.order = i + 1; });
  window.saveState();
  window.refreshActiveViews ? window.refreshActiveViews() : window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Removed hotel stay" : "🗑️ ホテルを削除しました");
};

window.updateHotelField = function(idx, field, val) {
  const mirror = typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText();
  if (field === "nights") {
    const nVal = Math.max(1, Math.round(Number(val) || 1));
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (!arr[idx]) return;
      arr[idx].nights = nVal;
      arr[idx].totalJpy = nVal * (Number(arr[idx].perNightJpy) || 0);
      if (arr[idx].checkIn && !String(arr[idx].checkOut || "").includes("(")) {
        const nextOut = shiftHotelYmd(arr[idx].checkIn, nVal);
        if (nextOut) arr[idx].checkOut = nextOut;
      }
    });
  } else if (field === "perNightJpy") {
    const rateVal = Math.round(Math.max(0, Number(val) || 0));
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (!arr[idx]) return;
      arr[idx].perNightJpy = rateVal;
      arr[idx].totalJpy = (Number(arr[idx].nights) || 0) * rateVal;
      arr[idx].luxury = rateVal >= 30000;
    });
  } else if (field === "checkIn") {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (!arr[idx]) return;
      arr[idx].checkIn = val;
      if (!String(val || "").includes("(") && !String(arr[idx].checkOut || "").includes("(")) {
        const nextOut = shiftHotelYmd(val, Number(arr[idx].nights) || 1);
        if (nextOut) arr[idx].checkOut = nextOut;
      }
    });
  } else if (field === "checkOut") {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (!arr[idx]) return;
      arr[idx].checkOut = val;
      if (!String(val || "").includes("(") && !String(arr[idx].checkIn || "").includes("(")) {
        const sDt = window.parseDateLocal(arr[idx].checkIn);
        const eDt = window.parseDateLocal(val);
        if (sDt && eDt && eDt > sDt) {
          const calcN = Math.max(1, Math.round((eDt - sDt) / 86400000));
          arr[idx].nights = calcN;
          arr[idx].totalJpy = calcN * (Number(arr[idx].perNightJpy) || 0);
        }
      }
    });
  } else if (field === "url") {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (arr[idx]) arr[idx].url = val;
    });
  } else if (mirror) {
    [state.dataEn.hotels, state.dataJa.hotels].forEach(arr => {
      if (arr[idx]) arr[idx][field] = val;
    });
  } else {
    const curHotels = window.curData().hotels || [];
    if (curHotels[idx]) curHotels[idx][field] = val;
  }
  window.saveState();
  window.refreshActiveViews ? window.refreshActiveViews() : window.renderAll();
};

window.syncHotelsToDailyBudget = function() {
  window.pushUndoSnapshot("Sync hotels to schedule");
  const enHotels = state.dataEn.hotels || [];
  const jaHotels = state.dataJa.hotels || [];

  const applySync = (hotels, days) => {
    const prevRegionByHotel = new Map();
    hotels.forEach(hh => { if (hh.name) prevRegionByHotel.set(hh.name, hh.region); });
    let dayIdx = 0;
    hotels.forEach(h => {
      const n = Math.max(0, Number(h.nights) || 0);
      for (let k = 0; k < n && dayIdx < days.length; k++) {
        const prevHotelReg = prevRegionByHotel.get(days[dayIdx].hotel);
        const curReg = String(days[dayIdx].region || "").trim();
        days[dayIdx].stay = Number(h.perNightJpy) || 0;
        days[dayIdx].hotel = h.name;
        days[dayIdx].hotelUrl = h.url || "";
        if (!curReg || curReg === prevHotelReg || /^custom/i.test(curReg)) {
          days[dayIdx].region = h.region;
        }
        dayIdx++;
      }
    });
    if (days.length > 0 && dayIdx <= days.length - 1) {
      days[days.length - 1].stay = 0;
    }
  };

  applySync(enHotels, state.dataEn.days || []);
  applySync(jaHotels, state.dataJa.days || []);
  window.saveState();
  window.refreshActiveViews ? window.refreshActiveViews() : window.renderAll();
  window.showToast(window.isEn()
    ? "🔄 Synced Hotel Names, Official Links, Nights & Rates to Daily Schedule!"
    : "🔄 ホテル名・公式URL・宿泊数・単価を日別スケジュールへ反映しました！");
};

window.autoFillNewHotelFromCity = function(cityVal) {
  if (!cityVal || typeof window.resolveDefaultHotelForLocation !== "function") return;
  const nameInp = document.getElementById("newHotelName");
  if (nameInp && nameInp.value.trim()) return;
  const def = window.resolveDefaultHotelForLocation(cityVal);
  if (!def || def.matchLevel === "fallback") return;
  const en = window.isEn();
  if (nameInp) nameInp.value = en ? def.nameEn : def.nameJa;
  const rateInp = document.getElementById("newHotelRate");
  if (rateInp && def.perNightJpy) rateInp.value = String(def.perNightJpy);
  const accInp = document.getElementById("newHotelAccess");
  if (accInp && !accInp.value.trim()) accInp.value = en ? def.accessEn : def.accessJa;
  const urlInp = document.getElementById("newHotelUrl");
  if (urlInp && !urlInp.value.trim()) urlInp.value = def.url || "";
};

window.renderHotelsTab = function() {
  const en = window.isEn();
  const hotelsList = (window.curData().hotels) || [];
  const daysLen = ((window.curData().days) || []).length;
  const neededNights = Math.max(0, daysLen - 1);
  const totalStay = hotelsList.reduce((acc, h) => acc + (Number(h.totalJpy) || 0), 0);
  const totalNights = hotelsList.reduce((acc, h) => acc + (Number(h.nights) || 0), 0);

  document.getElementById("hotelsTabTitle").textContent = en
    ? `🏨 Hotel & Accommodation Ledger (${hotelsList.length} Bases • ${totalNights} Nights)`
    : `🏨 宿泊・ホテル台帳（全${hotelsList.length}拠点・${totalNights}泊）`;
  document.getElementById("hotelSummaryHeader").textContent = en
    ? `Total ${totalNights} Nights: ${window.fmtJpy(totalStay)} (${window.fmtSgd(totalStay)})`
    : `全${totalNights}泊 合計：${window.fmtJpy(totalStay)} (${window.fmtSgd(totalStay)})`;

  const covEl = document.getElementById("hotelCoverageBadge");
  if (covEl) {
    const ok = totalNights >= neededNights;
    covEl.style.background = ok ? "var(--forest-soft)" : "#FEF3C7";
    covEl.style.color = ok ? "var(--forest)" : "#B45309";
    covEl.textContent = ok
      ? (en ? `✓ ${totalNights} / ${neededNights} nights covered` : `✓ ${totalNights} / ${neededNights}泊 カバー済`)
      : (en ? `⚠️ ${totalNights} / ${neededNights} trip nights covered` : `⚠️ ${totalNights} / ${neededNights}泊（未達）`);
  }

  document.getElementById("hotelsTabLead").innerHTML = en
    ? `Manage accommodations, auto-chained dates, booking confirmation notes, and official hotel links. Click <strong>Sync Hotels to Daily Schedule</strong> to push nightly rates, hotel names & URLs straight into Tab 2 & Tab 4.`
    : `宿泊拠点・連泊日程・予約メモ・公式ホテルURLを管理できます。変更後は「日別スケジュールへ反映」ボタンでタブ2・タブ4へ一括反映できます。`;

  const addBarHtml = `
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:18px;background:var(--surface-alt);padding:12px;border-radius:10px;align-items:center;">
      <input type="text" id="newHotelName" class="search-input" placeholder="${en ? "Hotel Name" : "ホテル名"}" style="min-width:170px;flex:1;">
      <input type="text" id="newHotelRegion" class="search-input" placeholder="${en ? "City / Region (auto-suggests hotel)" : "都市・エリア（ホテル自動提案）"}" onchange="autoFillNewHotelFromCity(this.value)" style="min-width:160px;">
      <input type="number" id="newHotelNights" class="editable-num" value="2" min="1" max="30" step="1" style="width:60px;" title="${en ? "Nights" : "泊数"}">
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
            <div style="display:flex;align-items:center;gap:4px;">
              <input type="number" class="editable-num" style="width:52px;padding:3px 5px;" value="${Number(h.nights) || 0}" min="1" step="1" onchange="updateHotelField(${idx}, 'nights', this.value)">
              <span style="font-size:11.5px;font-weight:800;">${en ? "N" : "泊"}</span>
              <button type="button" class="btn" style="padding:3px 6px;font-size:11px;" onclick="moveHotelOrder(${idx}, -1)" ${idx === 0 ? "disabled" : ""} title="${en ? "Move earlier" : "前へ"}">↑</button>
              <button type="button" class="btn" style="padding:3px 6px;font-size:11px;" onclick="moveHotelOrder(${idx}, 1)" ${idx === hotelsList.length - 1 ? "disabled" : ""} title="${en ? "Move later" : "後へ"}">↓</button>
              <button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;" onclick="deleteHotelStay(${idx})" title="${en ? "Delete" : "削除"}">🗑️</button>
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
