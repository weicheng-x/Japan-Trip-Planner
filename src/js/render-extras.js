// Tabs 6–9: Regional Gourmet, Metro PDFs & Bus Timetables, Sightseeing Guides, Shopping List

// --- TAB 6: GOURMET ---
window.filterFoodKey = function(key) {
  state.activeFoodKey = key;
  window.renderGourmet();
};

window.toggleFoodTried = function(id) {
  [state.dataEn.food, state.dataJa.food].forEach(arr => {
    const item = (arr || []).find(f => f.id === id);
    if (item) item.tried = !item.tried;
  });
  window.saveState();
  window.renderGourmet();
};

window.deleteFood = function(id) {
  window.pushUndoSnapshot("Delete gourmet spot");
  state.dataEn.food = (state.dataEn.food || []).filter(f => f.id !== id);
  state.dataJa.food = (state.dataJa.food || []).filter(f => f.id !== id);
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Removed gourmet spot" : "🗑️ グルメカードを削除しました");
};

window.addCustomFood = function() {
  const en = window.isEn();
  const regVal = (document.getElementById("newFoodRegion")?.value || "").trim() || (en ? "Tokyo" : "東京");
  const dish = (document.getElementById("newFoodDish")?.value || "").trim();
  const place = (document.getElementById("newFoodPlace")?.value || "").trim();
  const rating = (document.getElementById("newFoodRating")?.value || "").trim();
  const access = (document.getElementById("newFoodAccess")?.value || "").trim();
  if (!dish) {
    window.showToast(en ? "Please enter a specialty dish name" : "料理名を入力してください");
    return;
  }
  const newId = Date.now();
  const entryEn = {
    id: newId, region: regVal, dish, place: place || "Custom Spot", url: "",
    tabelogScore: rating ? `★ ${rating}` : "★ 3.55", tabelogUrl: "",
    transitLevel: "easy", transitText: access ? `🟢 ${access}` : "🟢 Public Transit Accessible",
    sourceTag: "Custom Added", note: "User-added gourmet spot.", tried: false
  };
  const entryJa = Object.assign({}, entryEn, { sourceTag: "カスタム追加", note: "プランナー上で追加したグルメ候補です。" });
  state.dataEn.food.unshift(entryEn);
  state.dataJa.food.unshift(entryJa);
  window.saveState();
  window.renderAll();
  window.showToast(en ? "🍜 Added new gourmet spot!" : "🍜 グルメ候補を追加しました！");
};

window.renderGourmet = function() {
  const en = window.isEn();
  const foodList = (window.curData().food) || [];

  document.getElementById("gourmetTabTitle").textContent = en
    ? `🍜 Regional Gourmet Guide (${foodList.length} Curated Spots)`
    : `🍜 ご当地グルメガイド（全${foodList.length}選）`;
  document.getElementById("gourmetTabLead").textContent = en
    ? "Curated regional specialties with Tabelog ratings and station walkability badges. Add or remove spots anytime."
    : "訪問エリアごとの必食グルメを厳選（食べログ参考スコア＆駅徒歩アクセス付）。自由に追加・削除が可能です。";

  const regCounts = {};
  foodList.forEach(f => { regCounts[f.region] = (regCounts[f.region] || 0) + 1; });
  const dynamicPills = [{ key: "ALL", label: en ? `All Spots (${foodList.length})` : `すべて (${foodList.length})` }];
  Object.entries(regCounts).forEach(([rName, cnt]) => { dynamicPills.push({ key: rName, label: `${rName} (${cnt})` }); });
  dynamicPills.push({ key: "EASY_ONLY", label: en ? "🟢 Station Walkable" : "🟢 駅チカ徒歩圏" });

  document.getElementById("foodRegionPills").innerHTML = dynamicPills.map(rk => `
    <button type="button" class="pill ${state.activeFoodKey === rk.key ? "active" : ""}" data-key="${window.escapeAttr(rk.key)}" onclick="filterFoodKey(this.dataset.key)">${window.escapeHtml(rk.label)}</button>
  `).join("") + `<button type="button" class="btn" style="padding:4px 10px;font-size:11.5px;margin-left:4px;" onclick="syncRegionalCatalogsFromSchedule()">✨ ${en ? "Sync from Schedule" : "日程から自動追加"}</button>`;

  const regionOptions = Object.keys(regCounts).length > 0 ? Object.keys(regCounts) : [en ? "Tokyo" : "東京"];
  document.getElementById("foodFormBar").innerHTML = `
    <input type="text" id="newFoodRegion" class="search-input" list="foodRegionDatalist" placeholder="${en ? "City / Region" : "エリア名"}" value="${window.escapeAttr(regionOptions[0] || "")}" style="min-width:155px;">
    <datalist id="foodRegionDatalist">${regionOptions.map(r => `<option value="${window.escapeAttr(r)}"></option>`).join("")}</datalist>
    <input type="text" id="newFoodDish" class="search-input" placeholder="${en ? "Specialty Dish" : "料理名"}">
    <input type="text" id="newFoodPlace" class="search-input" placeholder="${en ? "Restaurant Name" : "店名"}">
    <input type="text" id="newFoodRating" class="search-input" placeholder="${en ? "Score (e.g. 3.65)" : "評価 (例: 3.65)"}" style="min-width:120px;">
    <input type="text" id="newFoodAccess" class="search-input" placeholder="${en ? "Transit Access" : "駅アクセス"}" style="flex:1;">
    <button type="button" class="btn btn-primary" onclick="addCustomFood()">${en ? "+ Add Gourmet" : "+ グルメ追加"}</button>
  `;

  const list = foodList.filter(f => {
    if (state.activeFoodKey === "ALL") return true;
    if (state.activeFoodKey === "EASY_ONLY") return f.transitLevel === "easy";
    return f.region === state.activeFoodKey;
  });

  document.getElementById("gourmetGrid").innerHTML = list.map(f => {
    const tClass = f.transitLevel === "easy" ? "transit-easy" : (f.transitLevel === "bus" ? "transit-bus" : "transit-far");
    const m = String(f.tabelogScore || "").match(/(\d+\.\d+)/);
    const numScore = m ? parseFloat(m[1]) : 3.5;
    const barPct = Math.min(100, Math.max(40, Math.round(((numScore - 3.0) / 1.1) * 100)));
    const pUrl = window.safeUrl(f.url);
    const tUrl = window.safeUrl(f.tabelogUrl);

    return `
      <div class="food-card ${f.tried ? "tried" : ""}">
        <div>
          <div class="food-header">
            <span class="region-tag">${window.escapeHtml(f.region)}</span>
            <span class="tabelog-badge">🍽️ ${en ? "Rating:" : "評価:"} ${tUrl ? `<a href="${window.escapeAttr(tUrl)}" target="_blank" rel="noopener">${window.escapeHtml(f.tabelogScore)}</a>` : window.escapeHtml(f.tabelogScore)}</span>
          </div>
          <div class="score-bar-track"><div class="score-bar-fill" style="width:${barPct}%;"></div></div>
          <div class="food-title" style="margin-top:9px;">${window.escapeHtml(f.dish)}</div>
          <div style="font-size:13px;font-weight:800;margin:4px 0;">
            📍 ${pUrl ? `<a href="${window.escapeAttr(pUrl)}" target="_blank" rel="noopener">${window.escapeHtml(f.place)} ↗</a>` : window.escapeHtml(f.place)}
            <span class="food-origin-tag" style="margin-left:5px;">${window.escapeHtml(f.sourceTag)}</span>
          </div>
          <div class="transit-badge ${tClass}">${window.escapeHtml(f.transitText)}</div>
          <p style="font-size:12.5px;color:var(--ink-muted);margin-top:8px;">${window.escapeHtml(f.note)}</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:9px;border-top:1px solid var(--border);">
          <button type="button" class="btn" style="padding:4px 10px;font-size:12px;" onclick="toggleFoodTried(${Number(f.id)})">
            ${f.tried ? (en ? "✅ Visited" : "✅ 訪問済") : (en ? "☐ Wishlist / Visited" : "☐ 行きたい / 訪問済")}
          </button>
          <button type="button" class="btn btn-danger" style="padding:4px 8px;font-size:11.5px;" onclick="deleteFood(${Number(f.id)})">🗑️</button>
        </div>
      </div>
    `;
  }).join("");
};

// --- TAB 7: ACCESS / METRO PDFs & BUSES ---
window.filterAccessKey = function(key) {
  state.activeAccessKey = key;
  window.renderAccessTable();
};

window.updateAccessField = function(id, field, val) {
  const item = (window.curData().access || []).find(a => a.id === id);
  if (item) item[field] = val;
  if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
    const other = (window.isEn() ? state.dataJa : state.dataEn).access || [];
    const otherItem = other.find(a => a.id === id);
    if (otherItem) otherItem[field] = val;
  }
  window.saveState();
};

window.deleteAccessRow = function(id) {
  window.pushUndoSnapshot("Delete transit link");
  state.dataEn.access = (state.dataEn.access || []).filter(a => a.id !== id);
  state.dataJa.access = (state.dataJa.access || []).filter(a => a.id !== id);
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Removed transit link" : "🗑️ 時刻表リンクを削除しました");
};

window.addAccessRow = function() {
  const en = window.isEn();
  const area = (document.getElementById("newAccessArea")?.value || "").trim() || (en ? "Tokyo" : "東京");
  const place = (document.getElementById("newAccessPlace")?.value || "").trim();
  const url = (document.getElementById("newAccessUrl")?.value || "").trim();
  const note = (document.getElementById("newAccessNote")?.value || "").trim();
  if (!place || !url) {
    window.showToast(en ? "Enter both a route/PDF name and URL" : "名称とURLを入力してください");
    return;
  }
  const obj = { id: "acc_" + Date.now(), area, day: en ? "Custom" : "カスタム", place, url, note, isExisting: true };
  state.dataEn.access.unshift(Object.assign({}, obj));
  state.dataJa.access.unshift(Object.assign({}, obj));
  window.saveState();
  window.renderAll();
  window.showToast(en ? "🚌 Added transit / metro PDF link!" : "🚌 路線図・時刻表リンクを追加しました！");
};

window.renderAccessTable = function() {
  const en = window.isEn();
  const accessList = (window.curData().access) || [];

  document.getElementById("accessTabTitle").textContent = en
    ? "🚌 Official City Metro PDFs, Ferries & Bus Timetables"
    : "🚌 主要都市 公式地下鉄路線図PDF＆バス・フェリー時刻表";
  document.getElementById("accessTabLead").textContent = en
    ? "Downloadable official city metro/bus route PDFs, expressway bus timetables, and island ferry schedules."
    : "大都市の公式地下鉄・バス路線図PDFおよび郊外観光バス・離島フェリー時刻表リンク集です。";

  const areaCounts = {};
  accessList.forEach(a => { areaCounts[a.area] = (areaCounts[a.area] || 0) + 1; });
  const pills = [{ key: "ALL", label: en ? `All Areas (${accessList.length})` : `全エリア (${accessList.length})` }];
  Object.entries(areaCounts).forEach(([aName, cnt]) => { pills.push({ key: aName, label: `${aName} (${cnt})` }); });

  document.getElementById("accessAreaPills").innerHTML = pills.map(ak => `
    <button type="button" class="pill ${state.activeAccessKey === ak.key ? "active" : ""}" data-key="${window.escapeAttr(ak.key)}" onclick="filterAccessKey(this.dataset.key)">${window.escapeHtml(ak.label)}</button>
  `).join("") + `<button type="button" class="btn" style="padding:4px 10px;font-size:11.5px;margin-left:4px;" onclick="syncRegionalCatalogsFromSchedule()">✨ ${en ? "Sync from Schedule" : "日程から自動追加"}</button>`;

  const defaultArea = Object.keys(areaCounts)[0] || (en ? "Tokyo" : "東京");
  document.getElementById("accessFormBar").innerHTML = `
    <input type="text" id="newAccessArea" class="search-input" value="${window.escapeAttr(defaultArea)}" placeholder="${en ? "Area" : "エリア名"}" style="min-width:160px;">
    <input type="text" id="newAccessPlace" class="search-input" placeholder="${en ? "Metro PDF / Bus / Ferry Name" : "路線図PDF・バス区間名"}" style="min-width:200px;">
    <input type="url" id="newAccessUrl" class="search-input" placeholder="https://..." style="flex:1;">
    <input type="text" id="newAccessNote" class="search-input" placeholder="${en ? "Notes" : "メモ"}" style="min-width:170px;">
    <button type="button" class="btn btn-primary" onclick="addAccessRow()">${en ? "+ Add Link" : "+ 追加"}</button>
  `;

  document.getElementById("accessTableHead").innerHTML = en ? `
    <tr><th>Area</th><th>Target Days</th><th>Route / PDF Name</th><th>Open Official Link</th><th>Notes</th><th>Type</th><th style="width:85px;">Action</th></tr>
  ` : `
    <tr><th>エリア</th><th>対象日</th><th>路線図PDF・区間名</th><th>公式ページを開く</th><th>メモ</th><th>区分</th><th style="width:85px;">操作</th></tr>
  `;

  const list = accessList.filter(a => state.activeAccessKey === "ALL" || a.area === state.activeAccessKey);
  document.getElementById("accessTableBody").innerHTML = list.map(a => {
    const cleanUrl = window.safeUrl(a.url);
    const isPdf = String(a.url || "").toLowerCase().includes(".pdf") || String(a.place || "").toLowerCase().includes("pdf");
    const safeId = window.escapeAttr(a.id);
    return `
      <tr>
        <td><strong>${window.escapeHtml(a.area)}</strong></td>
        <td style="white-space:nowrap;font-size:12px;color:var(--ink-muted);">${window.escapeHtml(a.day)}</td>
        <td><input type="text" class="editable-text" style="font-weight:700;" value="${window.escapeAttr(a.place || "")}" data-id="${safeId}" onchange="updateAccessField(this.dataset.id, 'place', this.value)"></td>
        <td style="white-space:nowrap;">
          ${cleanUrl
            ? `<a href="${window.escapeAttr(cleanUrl)}" target="_blank" rel="noopener" class="btn ${isPdf ? "btn-primary" : ""}" style="border-bottom:none;font-size:12px;${isPdf ? "color:#FFF;" : ""}">${isPdf ? (en ? "📄 Open PDF ↗" : "📄 PDFを開く ↗") : (en ? "🚌 Timetable ↗" : "🚌 時刻表を開く ↗")}</a>`
            : `<span class="no-site-badge">${en ? "No URL" : "URLなし"}</span>`}
        </td>
        <td><input type="text" class="editable-text" style="font-size:12px;color:var(--ink-muted);" value="${window.escapeAttr(a.note || "")}" data-id="${safeId}" onchange="updateAccessField(this.dataset.id, 'note', this.value)"></td>
        <td style="white-space:nowrap;">${isPdf ? `<span class="existing-badge">${en ? "📄 Official PDF" : "📄 公式PDF"}</span>` : `<span class="added-badge">${en ? "🚌 Transit Link" : "🚌 交通案内"}</span>`}</td>
        <td><button type="button" class="btn btn-danger" style="padding:4px 8px;font-size:11.5px;" data-id="${safeId}" onclick="deleteAccessRow(this.dataset.id)">🗑️</button></td>
      </tr>
    `;
  }).join("");
};

// --- TAB 8: SIGHTSEEING GUIDES ---
window.filterGuideKey = function(key) {
  state.activeGuideKey = key;
  window.renderGuidesTable();
};

window.updateGuideField = function(id, field, val) {
  const item = (window.curData().guides || []).find(g => g.id === id);
  if (item) item[field] = val;
  if (typeof window.shouldMirrorCustomText === "function" && window.shouldMirrorCustomText()) {
    const other = (window.isEn() ? state.dataJa : state.dataEn).guides || [];
    const otherItem = other.find(g => g.id === id);
    if (otherItem) otherItem[field] = val;
  }
  window.saveState();
};

window.deleteGuideRow = function(id) {
  window.pushUndoSnapshot("Delete sightseeing guide");
  state.dataEn.guides = (state.dataEn.guides || []).filter(g => g.id !== id);
  state.dataJa.guides = (state.dataJa.guides || []).filter(g => g.id !== id);
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Removed sightseeing guide" : "🗑️ 観光ガイドを削除しました");
};

window.addGuideRow = function() {
  const en = window.isEn();
  const area = (document.getElementById("newGuideArea")?.value || "").trim() || (en ? "Tokyo" : "東京");
  const location = (document.getElementById("newGuideLocation")?.value || "").trim();
  const url = (document.getElementById("newGuideUrl")?.value || "").trim();
  const note = (document.getElementById("newGuideNote")?.value || "").trim();
  if (!location || !url) {
    window.showToast(en ? "Enter both a guide title and URL" : "観光地名とURLを入力してください");
    return;
  }
  const obj = { id: "gd_" + Date.now(), area, day: en ? "Custom" : "カスタム", location, url, note, isExisting: true };
  state.dataEn.guides.unshift(Object.assign({}, obj));
  state.dataJa.guides.unshift(Object.assign({}, obj));
  window.saveState();
  window.renderAll();
  window.showToast(en ? "📖 Added sightseeing guide!" : "📖 観光ガイドを追加しました！");
};

window.renderGuidesTable = function() {
  const en = window.isEn();
  const guidesList = (window.curData().guides) || [];
  const preset = state.activePreset || "tohoku22";
  const masterCard = document.getElementById("nikkoMasterplanCard");

  if (preset === "tohoku22") {
    masterCard.innerHTML = en ? `
      <h2>🍁 Nikko 2-Day Autumn Foliage & Tobu Bus Masterplan (World Heritage & Oku-Nikko)</h2>
      <p class="lead" style="margin-bottom:0;">Recommended 2-day bus & walking plan from <strong>Koga Station ↔ JR / Tobu Nikko Station</strong> (Days 16–17): Day 16 covers Toshogu Shrine, Rinnoji Shoyoen Garden & Shinkyo Bridge; Day 17 ascends Irohazaka Winding Road to Lake Chuzenji, Kegon Falls & Ryuzu Falls.</p>
    ` : `
      <h2>🍁 日光（世界遺産・いろは坂・中禅寺湖・奥日光）2日間 紅葉＆バス活用マスタープラン</h2>
      <p class="lead" style="margin-bottom:0;">Day 16・17は<strong>古河駅 ↔ 日光駅</strong>から東武バスで巡るのが最適：1日目は日光東照宮・輪王寺逍遥園・神橋、2日目は早朝バスでいろは坂・中禅寺湖・華厳ノ滝・竜頭ノ滝へ。</p>
    `;
  } else if (preset === "okinawa7") {
    masterCard.innerHTML = en ? `
      <h2>🌺 Okinawa & Yaeyama Island-Hopping Strategy (4d Main Island + 3d Ishigaki / Taketomi)</h2>
      <p class="lead" style="margin-bottom:0;"><strong>No JR Rail Pass needed:</strong> Days 1–4 base in Naha & Onna-son (Yui Rail + Yanbaru Express Bus or Rental Car), then fly Naha (OKA) → Ishigaki (ISG) on Day 5 with a 10-min high-speed ferry excursion to red-tile Taketomi Island on Day 6.</p>
    ` : `
      <h2>🌺 沖縄本島（4日間）＋ 石垣島・竹富島（3日間）島旅ベストルート解説</h2>
      <p class="lead" style="margin-bottom:0;"><strong>JRパス不要ルート：</strong> 前半4日間はゆいレール＆やんばる急行バス（またはレンタカー）で那覇・恩納村・美ら海水族館を満喫し、5日目に空路で石垣島へ渡り6日目は高速船10分で竹富島を巡ります。</p>
    `;
  } else {
    const curMeta = (window.PRESET_CATALOG_META || []).find(p => p.id === preset);
    const pTitle = curMeta ? (en ? curMeta.labelEn : curMeta.labelJa) : (en ? state.customTitleEn : state.customTitleJa);
    masterCard.innerHTML = `
      <h2>📖 ${en ? `Sightseeing Highlights: ${window.escapeHtml(pTitle)}` : `観光ガイド概要：${window.escapeHtml(pTitle)}`}</h2>
      <p class="lead" style="margin-bottom:0;">${en ? `Curated sightseeing guides for this preset (${guidesList.length} total). Edit, add, or remove links anytime.` : `この旅程に合わせた厳選観光ガイド（計${guidesList.length}件）です。自由に追加・編集可能です。`}</p>
    `;
  }

  document.getElementById("guidesTabTitle").textContent = en
    ? `📖 Sightseeing Guides (${guidesList.length})`
    : `📖 エリア別 観光ガイド一覧（全${guidesList.length}件）`;
  document.getElementById("guidesTabLead").textContent = en
    ? "Essential destination guides and walking courses tailored to your itinerary."
    : "各滞在地の公式ガイド・散策コース一覧です。";

  const areaCounts = {};
  guidesList.forEach(g => { areaCounts[g.area] = (areaCounts[g.area] || 0) + 1; });
  const pills = [{ key: "ALL", label: en ? `All Regions (${guidesList.length})` : `全エリア (${guidesList.length})` }];
  Object.entries(areaCounts).forEach(([aName, cnt]) => { pills.push({ key: aName, label: `${aName} (${cnt})` }); });

  document.getElementById("guideAreaPills").innerHTML = pills.map(gk => `
    <button type="button" class="pill ${state.activeGuideKey === gk.key ? "active" : ""}" data-key="${window.escapeAttr(gk.key)}" onclick="filterGuideKey(this.dataset.key)">${window.escapeHtml(gk.label)}</button>
  `).join("") + `<button type="button" class="btn" style="padding:4px 10px;font-size:11.5px;margin-left:4px;" onclick="syncRegionalCatalogsFromSchedule()">✨ ${en ? "Sync from Schedule" : "日程から自動追加"}</button>`;

  const defaultArea = Object.keys(areaCounts)[0] || (en ? "Tokyo" : "東京");
  document.getElementById("guideFormBar").innerHTML = `
    <input type="text" id="newGuideArea" class="search-input" value="${window.escapeAttr(defaultArea)}" placeholder="${en ? "City / Region" : "都市・エリア"}" style="min-width:160px;">
    <input type="text" id="newGuideLocation" class="search-input" placeholder="${en ? "Destination / Guide Title" : "観光地・ガイド名"}" style="min-width:200px;">
    <input type="url" id="newGuideUrl" class="search-input" placeholder="https://..." style="flex:1;">
    <input type="text" id="newGuideNote" class="search-input" placeholder="${en ? "Highlights & notes" : "見どころメモ"}" style="min-width:180px;">
    <button type="button" class="btn btn-primary" onclick="addGuideRow()">${en ? "+ Add Guide" : "+ 追加"}</button>
  `;

  document.getElementById("guidesTableHead").innerHTML = en ? `
    <tr><th>Region</th><th>Day / Area</th><th>Destination & Guide</th><th>Open Guide</th><th>Highlights & Walking Notes</th><th style="width:85px;">Action</th></tr>
  ` : `
    <tr><th>エリア</th><th>区分</th><th>観光地・ガイド名</th><th>ガイドを開く</th><th>見どころ・散策メモ</th><th style="width:85px;">操作</th></tr>
  `;

  const list = guidesList.filter(g => state.activeGuideKey === "ALL" || g.area === state.activeGuideKey);
  document.getElementById("guidesTableBody").innerHTML = list.map(g => {
    const cleanUrl = window.safeUrl(g.url);
    const safeId = window.escapeAttr(g.id);
    return `
      <tr>
        <td><strong>${window.escapeHtml(g.area)}</strong></td>
        <td style="white-space:nowrap;font-size:12px;color:var(--ink-muted);">${window.escapeHtml(g.day)}</td>
        <td><input type="text" class="editable-text" style="font-weight:700;" value="${window.escapeAttr(g.location || "")}" data-id="${safeId}" onchange="updateGuideField(this.dataset.id, 'location', this.value)"></td>
        <td style="white-space:nowrap;">${cleanUrl ? `<a href="${window.escapeAttr(cleanUrl)}" target="_blank" rel="noopener" class="btn" style="border-bottom:none;font-size:12px;">📖 ${en ? "Open Guide ↗" : "ガイドを開く ↗"}</a>` : `<span class="no-site-badge">No URL</span>`}</td>
        <td><input type="text" class="editable-text" style="font-size:12px;color:var(--ink-muted);" value="${window.escapeAttr(g.note || "")}" data-id="${safeId}" onchange="updateGuideField(this.dataset.id, 'note', this.value)"></td>
        <td><button type="button" class="btn btn-danger" style="padding:4px 8px;font-size:11.5px;" data-id="${safeId}" onclick="deleteGuideRow(this.dataset.id)">🗑️</button></td>
      </tr>
    `;
  }).join("");
};

// --- TAB 9: SHOPPING LIST ---
window.toggleTaxFreeShopping = function(checked) {
  state.taxFreeEnabled = !!checked;
  window.saveState();
  window.renderAll();
};

window.addShoppingItem = function() {
  const en = window.isEn();
  if (!Array.isArray(state.shoppingList)) state.shoppingList = [];
  const name = (document.getElementById("newShopName")?.value || "").trim();
  const url = (document.getElementById("newShopUrl")?.value || "").trim();
  const store = (document.getElementById("newShopStore")?.value || "").trim();
  const price = Math.max(0, parseFloat(document.getElementById("newShopPrice")?.value || "0") || 0);
  const qty = Math.max(1, parseInt(document.getElementById("newShopQty")?.value || "1", 10) || 1);

  if (!name) {
    window.showToast(en ? "Please enter an item name" : "商品名を入力してください");
    return;
  }
  state.shoppingList.push({ id: "shop_" + Date.now(), name, url, store, price, qty, bought: false });
  window.saveState();
  window.renderAll();
  window.showToast(en ? `🛍️ Added "${name}" to Shopping List` : `🛍️ 「${name}」を買い物リストに追加しました`);
};

window.updateShoppingItem = function(id, field, val) {
  const item = (state.shoppingList || []).find(x => x.id === id);
  if (!item) return;
  if (field === "price") item.price = Math.max(0, parseFloat(val) || 0);
  else if (field === "qty") item.qty = Math.max(1, parseInt(val, 10) || 1);
  else if (field === "bought") item.bought = !!val;
  else item[field] = val;
  window.saveState();
  window.renderAll();
};

window.deleteShoppingItem = function(id) {
  window.pushUndoSnapshot("Delete shopping item");
  state.shoppingList = (state.shoppingList || []).filter(x => x.id !== id);
  window.saveState();
  window.renderAll();
  window.showToast(window.isEn() ? "🗑️ Deleted item from Shopping List" : "🗑️ 買い物リストから削除しました");
};

window.renderShoppingTab = function() {
  const en = window.isEn();
  if (!Array.isArray(state.shoppingList)) state.shoppingList = [];
  const items = state.shoppingList;
  const b = window.computeBudgetSummary();
  const totalQty = items.reduce((s, x) => s + Math.max(1, parseInt(x.qty, 10) || 1), 0);
  const cCode = state.currencyCode || "SGD";

  const tabBtn = document.getElementById("tabBtnShopping");
  if (tabBtn) {
    tabBtn.innerHTML = en
      ? `🛍️ 9. Shopping <span class="tab-count" id="shoppingCountBadge">${items.length}</span>`
      : `🛍️ 9. 買い物 <span class="tab-count" id="shoppingCountBadge">${items.length}</span>`;
  }

  document.getElementById("shoppingTabTitle").textContent = en ? "🛍️ Japan Shopping & Souvenir List" : "🛍️ 買い物＆お土産リスト";
  document.getElementById("lblTaxFreeToggle").textContent = en ? "🇯🇵 Est. 10% Tax-Free (≥¥5,000)" : "🇯🇵 観光客免税 10%適用目安 (¥5,000以上)";
  const chkTf = document.getElementById("chkTaxFreeToggle");
  if (chkTf) chkTf.checked = !!state.taxFreeEnabled;

  document.getElementById("shoppingTotalHeaderBadge").textContent = en
    ? `Net Total: ${window.fmtJpy(b.shoppingNet)} (${window.fmtSgd(b.shoppingNet)})`
    : `実質合計：${window.fmtJpy(b.shoppingNet)} (${window.fmtSgd(b.shoppingNet)})`;

  document.getElementById("shoppingTabLead").textContent = en
    ? "Track souvenirs, cosmetics, electronics, or snacks to buy in Japan. Items automatically flow into Tab 4's Final Grand Total (toggle Tax-Free above if shopping ≥¥5,000 at tax-free counters)."
    : "日本で購入したいお土産・コスメ・家電・お菓子を管理できます。合計額はタブ4の最終総合計に自動反映されます（¥5,000以上で免税チェック可）。";

  document.getElementById("shoppingFormBar").innerHTML = `
    <input type="text" id="newShopName" class="search-input" placeholder="${en ? "Item Name (e.g., Shiseido, Matcha, Royce)" : "商品名（例：ロイズ生チョコ、資生堂、抹茶菓子）"}" style="min-width:190px;flex:1;">
    <input type="text" id="newShopStore" class="search-input" placeholder="${en ? "Store / Area (e.g., Ginza / Donki)" : "購入店舗・エリア（例：銀座・ドンキ）"}" style="min-width:150px;">
    <input type="url" id="newShopUrl" class="search-input" placeholder="${en ? "Product URL (https://...)" : "商品URL (https://...)"}" style="min-width:170px;flex:1;">
    <input type="number" id="newShopPrice" class="editable-num" placeholder="${en ? "Price (¥)" : "単価 (¥)"}" min="0" step="100" style="width:95px;">
    <input type="number" id="newShopQty" class="editable-num" value="1" min="1" max="999" style="width:65px;">
    <button type="button" class="btn btn-primary" id="btnAddShoppingItem" onclick="addShoppingItem()">${en ? "+ Add Item" : "+ アイテム追加"}</button>
  `;

  document.getElementById("shoppingTableHead").innerHTML = en ? `
    <tr>
      <th>Bought</th><th>Item Name</th><th>Store / Area</th><th>Link</th>
      <th class="num-col">Unit (¥)</th><th class="num-col">Qty</th>
      <th class="num-col">Subtotal (¥)</th><th class="num-col">Subtotal (${window.escapeHtml(cCode)})</th><th style="width:70px;">Del</th>
    </tr>
  ` : `
    <tr>
      <th>購入済</th><th>商品名</th><th>購入場所</th><th>リンク</th>
      <th class="num-col">単価 (¥)</th><th class="num-col">数量</th>
      <th class="num-col">小計 (¥)</th><th class="num-col">小計 (${window.escapeHtml(cCode)})</th><th style="width:70px;">削除</th>
    </tr>
  `;

  const tbody = document.getElementById("shoppingTableBody");
  if (items.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:20px;color:var(--ink-muted);font-weight:700;">${en ? "No shopping items added yet." : "買い物アイテムはまだありません。"}</td></tr>`;
  } else {
    tbody.innerHTML = items.map(it => {
      const p = Math.max(0, Number(it.price) || 0);
      const q = Math.max(1, parseInt(it.qty, 10) || 1);
      const sub = p * q;
      const cleanUrl = window.safeUrl(it.url);
      const safeId = window.escapeAttr(it.id);
      return `
        <tr style="${it.bought ? "opacity:0.65;" : ""}">
          <td style="text-align:center;"><input type="checkbox" ${it.bought ? "checked" : ""} data-id="${safeId}" onchange="updateShoppingItem(this.dataset.id, 'bought', this.checked)"></td>
          <td><input type="text" class="editable-text" style="font-weight:700;${it.bought ? "text-decoration:line-through;" : ""}" value="${window.escapeAttr(it.name || "")}" data-id="${safeId}" onchange="updateShoppingItem(this.dataset.id, 'name', this.value)"></td>
          <td><input type="text" class="editable-text" style="font-size:12px;" value="${window.escapeAttr(it.store || "")}" placeholder="${en ? "Store..." : "店舗..."}" data-id="${safeId}" onchange="updateShoppingItem(this.dataset.id, 'store', this.value)"></td>
          <td>${cleanUrl ? `<a href="${window.escapeAttr(cleanUrl)}" target="_blank" rel="noopener" class="btn" style="font-size:11.5px;border-bottom:none;">🔗 ${en ? "Open ↗" : "開く ↗"}</a>` : `<span class="no-site-badge">—</span>`}</td>
          <td class="num-col"><input type="number" class="editable-num" value="${p}" min="0" step="100" data-id="${safeId}" onchange="updateShoppingItem(this.dataset.id, 'price', this.value)"></td>
          <td class="num-col"><input type="number" class="editable-num" style="width:62px;" value="${q}" min="1" max="999" data-id="${safeId}" onchange="updateShoppingItem(this.dataset.id, 'qty', this.value)"></td>
          <td class="num-col"><strong>${window.fmtJpy(sub)}</strong></td>
          <td class="num-col" style="color:var(--ink-muted);">${window.fmtSgd(sub)}</td>
          <td><button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;" data-id="${safeId}" onclick="deleteShoppingItem(this.dataset.id)">🗑️</button></td>
        </tr>
      `;
    }).join("");
  }

  const tfRow = b.taxFreeDiscount > 0 ? `
    <tr style="background:var(--forest-soft);color:var(--forest);font-weight:800;">
      <td colspan="6">🇯🇵 ${en ? "Estimated Japan Tax-Free Savings (~9.1% off gross ≥¥5,000)" : "免税割引見込（税込¥5,000以上対象・約9.1%OFF）"}</td>
      <td class="num-col">−${window.fmtJpy(b.taxFreeDiscount)}</td>
      <td class="num-col">−${window.fmtSgd(b.taxFreeDiscount)}</td>
      <td></td>
    </tr>
  ` : "";

  document.getElementById("shoppingTableFoot").innerHTML = `
    <tr style="background:var(--surface-alt);font-weight:800;">
      <td colspan="5">${en ? `Gross Shopping Total (${items.length} items)` : `買い物小計（${items.length}品目）`}</td>
      <td class="num-col">${totalQty}</td>
      <td class="num-col">${window.fmtJpy(b.shoppingGross)}</td>
      <td class="num-col">${window.fmtSgd(b.shoppingGross)}</td>
      <td></td>
    </tr>
    ${tfRow}
    <tr style="background:var(--accent-soft);font-weight:800;">
      <td colspan="6">🛍️ ${en ? "Net Shopping Total (Synced to Tab 4)" : "実質買い物合計（タブ4へ自動連動）"}</td>
      <td class="num-col" style="color:var(--accent);">${window.fmtJpy(b.shoppingNet)}</td>
      <td class="num-col" style="color:var(--accent);">${window.fmtSgd(b.shoppingNet)}</td>
      <td></td>
    </tr>
  `;
};
