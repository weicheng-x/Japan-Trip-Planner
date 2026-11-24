// Tab 1: Overview, Dynamic Route Phases, Map Card & Pre-Trip Checklist

(function() {
  let _prepFormOpen = false;
  let _prepLastErrorKey = null;

  function buildDynamicPhasesHtml() {
    const en = window.isEn();
    const days = (window.curData().days) || [];
    if (days.length === 0) return "";
    const phases = [];
    days.forEach(d => {
      const last = phases[phases.length - 1];
      if (last && last.region === d.region) {
        last.endDay = d.day;
        last.endDate = d.date;
        last.routes.push(d.routeJp);
        if (d.hotel && !last.hotels.includes(d.hotel)) last.hotels.push(d.hotel);
      } else {
        phases.push({
          region: d.region || "Japan",
          startDay: d.day,
          endDay: d.day,
          startDate: d.date,
          endDate: d.date,
          routes: [d.routeJp],
          hotels: d.hotel ? [d.hotel] : []
        });
      }
    });

    const colors = ["#1E40AF", "#166534", "#991B1B", "#D97706", "#6B21A8", "#9A3412", "#0284C7", "#334155"];
    return phases.map((p, idx) => {
      const col = colors[idx % colors.length];
      const daySpan = p.startDay === p.endDay ? `Day ${p.startDay}` : `Days ${p.startDay}–${p.endDay}`;
      const d1 = String(p.startDate || "").slice(5);
      const d2 = String(p.endDate || "").slice(5);
      const dateSpan = d1 === d2 ? d1 : `${d1} → ${d2}`;
      const dayCnt = p.endDay - p.startDay + 1;
      const summaryRoutes = p.routes.slice(0, 3).map(r => window.escapeHtml(r)).join(" • ") + (p.routes.length > 3 ? " …" : "");
      const safeReg = window.escapeAttr(p.region);
      return `
        <div class="phase-card" style="border-left-color:${col};" data-region="${safeReg}" onclick="jumpToRegionSchedule(this.dataset.region)">
          <div class="phase-days">${daySpan}<br><small>${window.escapeHtml(dateSpan)} (${dayCnt}${en ? "d" : "日"})</small></div>
          <div class="phase-info">
            <h4>${idx + 1}. ${window.escapeHtml(window.formatRegionLabel(p.region, en))} ${p.hotels[0] ? `— ${window.escapeHtml(p.hotels[0])}` : ""}</h4>
            <p>${summaryRoutes}</p>
          </div>
          <span class="btn" style="font-size:11.5px;">${en ? "View →" : "詳細 →"}</span>
        </div>
      `;
    }).join("");
  }

  window.renderOverviewTab = function() {
    const en = window.isEn();
    const leftCol = document.getElementById("overviewLeftCol");
    const mapCard = document.getElementById("overviewMapCard");
    const d = window.curData();
    const daysLen = (d.days || []).length;

    const howToCardHtml = en ? `
      <div class="section-card" id="plannerHowToCard">
        <h2><span>💡 How to Use This Planner & Linked Logic</span></h2>
        <p class="lead" style="margin-bottom:8px;">
          Every tab is connected—updating dates, presets, stops, or shopping items recalculates your map, passes, hotels, and totals live:
        </p>
        <div class="logic-flow-grid">
          <div class="logic-step-box">
            <strong>1. Dates & Scenic Seasons</strong>
            Change <em>Start / End Date</em> above to resize days, shift hotel check-ins, and switch seasonal Japan scenery (defaults to Spring Sakura if blank).
          </div>
          <div class="logic-step-box">
            <strong>2. Smart Map & ❗ Fallback</strong>
            Scans daily routes and custom stops across 85+ Japanese destinations and auto-frames the SVG map. Unrecognised places default to <strong>Tokyo</strong> with <strong>❗</strong>.
          </div>
          <div class="logic-step-box">
            <strong>3. Pass Optimizer & Hotels</strong>
            Tab 5 compares your active Rail Pass against point-to-point fares and syncs directly to KPI Card #3. Tab 3 syncs hotels & rates back to the schedule.
          </div>
          <div class="logic-step-box">
            <strong>4. Group / Pax & Shopping</strong>
            Switch Group vs Per-Person mode in Tab 4, track purchases & 10% Tax-Free savings in Tab 9, and save/open portable JSON backups anytime.
          </div>
        </div>
      </div>
    ` : `
      <div class="section-card" id="plannerHowToCard">
        <h2><span>💡 プランナーの使い方＆全タブ連動ロジック</span></h2>
        <p class="lead" style="margin-bottom:8px;">
          日付・プリセット・訪問地・買い物リストを編集すると、全国マップ・鉄道パス・ホテル・予算台帳がリアルタイムで連動更新されます：
        </p>
        <div class="logic-flow-grid">
          <div class="logic-step-box">
            <strong>① 出発日・終了日と季節背景</strong>
            「出発日」「終了日」を変更すると日程数とホテル泊日が連動し、出発月に応じて春夏秋冬の風景と演出が自動で切り替わります。
          </div>
          <div class="logic-step-box">
            <strong>② 全国マップ＆❗未認識警告</strong>
            日本各地85以上の観光地を自動認識してズーム表示します。日本の地名として認識できない文字列は <strong>❗ マーク付きで東京</strong> に設定されます。
          </div>
          <div class="logic-step-box">
            <strong>③ 鉄道パス最適化＆ホテル連動</strong>
            タブ5でJRパス vs 個別運賃を試算でき、上部のKPIカードとも完全一致。タブ3から日別宿泊費へワンクリック反映可能です。
          </div>
          <div class="logic-step-box">
            <strong>④ 買い物免税＆JSON保存</strong>
            タブ9の買い物（¥5,000以上免税トグル対応）はタブ4最終総合計に合算。JSON保存/読込・BOM付CSV出力にも対応しています。
          </div>
        </div>
      </div>
    `;

    leftCol.innerHTML = howToCardHtml + `
      <div class="section-card">
        <h2>
          <span>🧭 ${en ? `${daysLen}-Day Route Masterplan` : `${daysLen}日間 ルート全体像（フェーズ一覧）`}</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            <button type="button" class="btn" style="font-size:11.5px;padding:5px 10px;" onclick="syncRegionalCatalogsFromSchedule()">✨ ${en ? "Sync Guides & Gourmet" : "グルメ・ガイド自動追加"}</button>
            <button type="button" class="btn btn-primary" style="font-size:11.5px;padding:5px 10px;" onclick="addItineraryDay()">${en ? "+ Add Day" : "+ 日程追加"}</button>
            <button type="button" class="btn" style="font-size:11.5px;padding:5px 10px;" onclick="removeLastItineraryDay()">${en ? "− Remove Last" : "− 最終日削除"}</button>
          </div>
        </h2>
        <p class="lead">
          ${en
            ? "Click any phase card to filter Tab 2 (Schedule), or add/reorder/edit days in Tab 2 to update phases automatically."
            : "フェーズカードをクリックするとタブ2（日別スケジュール）の該当エリアへ移動します。"}
        </p>
        <div class="phase-timeline">
          ${buildDynamicPhasesHtml()}
        </div>
      </div>
    `;

    mapCard.innerHTML = window.buildInteractiveJapanMapHtml();
    window.renderPrepChecklist();
  };

  window.togglePrepTask = function(taskId) {
    if (!state.prepDone) state.prepDone = {};
    state.prepDone[taskId] = !state.prepDone[taskId];
    window.saveState();
    window.renderPrepChecklist();
  };

  window.togglePrepAddForm = function(forceState) {
    _prepFormOpen = typeof forceState === "boolean" ? forceState : !_prepFormOpen;
    if (!_prepFormOpen) _prepLastErrorKey = null;
    window.renderPrepChecklist();
  };

  window.renderPrepErrorBanner = function() {
    const en = window.isEn();
    const errEl = document.getElementById("prepErrorBanner");
    if (!errEl) return;
    if (!_prepLastErrorKey) {
      errEl.classList.remove("show");
      errEl.textContent = "";
      return;
    }
    errEl.classList.add("show");
    if (_prepLastErrorKey === "both_empty") {
      errEl.textContent = en ? "Both title and additional details cannot be empty." : "タイトルと詳細メモの両方が空欄です。";
    } else if (_prepLastErrorKey === "title_blank") {
      errEl.textContent = en ? "Title cannot be blank!" : "タイトルを入力してください！";
    }
  };

  window.submitNewPrepItem = function() {
    const en = window.isEn();
    const titleEl = document.getElementById("prepInputTitle");
    const detailsEl = document.getElementById("prepInputDetails");
    const titleVal = (titleEl ? titleEl.value : "").trim();
    const detailsVal = (detailsEl ? detailsEl.value : "").trim();

    if (!titleVal && !detailsVal) {
      _prepLastErrorKey = "both_empty";
      window.renderPrepErrorBanner();
      window.showToast(en ? "⚠️ Both title and additional details cannot be empty." : "⚠️ タイトルと詳細メモの両方が空欄です。");
      return;
    }
    if (!titleVal && detailsVal) {
      _prepLastErrorKey = "title_blank";
      window.renderPrepErrorBanner();
      window.showToast(en ? "⚠️ Title cannot be blank!" : "⚠️ タイトルを入力してください！");
      return;
    }

    _prepLastErrorKey = null;
    const newId = "prep_" + Date.now();
    state.dataEn.prep.push({ id: newId, title: titleVal, sub: detailsVal });
    state.dataJa.prep.push({ id: newId, title: titleVal, sub: detailsVal });

    if (titleEl) titleEl.value = "";
    if (detailsEl) detailsEl.value = "";
    window.saveState();
    window.renderPrepChecklist();
    window.showToast(en ? "✅ Added item to pre-trip checklist!" : "✅ チェックリストに項目を追加しました！");
  };

  window.deletePrepTask = function(taskId, evt) {
    if (evt && evt.stopPropagation) evt.stopPropagation();
    state.dataEn.prep = (state.dataEn.prep || []).filter(t => t.id !== taskId);
    state.dataJa.prep = (state.dataJa.prep || []).filter(t => t.id !== taskId);
    if (state.prepDone && state.prepDone[taskId]) delete state.prepDone[taskId];
    window.saveState();
    window.renderPrepChecklist();
    window.showToast(window.isEn() ? "🗑️ Deleted checklist item" : "🗑️ チェックリスト項目を削除しました");
  };

  window.renderPrepChecklist = function() {
    const en = window.isEn();
    const tasks = (window.curData().prep) || [];

    document.getElementById("prepCardTitle").textContent = en
      ? "🎒 Pre-Trip & Reservation Checklist"
      : "🎒 出発前＆現地手配チェックリスト";
    document.getElementById("prepCardLead").textContent = en
      ? "Click any item to mark complete, add custom reminders, or delete items."
      : "項目をクリックして完了チェック、または「新しい項目を追加」・削除ができます。";

    const addBtn = document.getElementById("btnAddNewPrepItem");
    if (addBtn) addBtn.textContent = en ? "Add new item" : "新しい項目を追加";

    const formWrap = document.getElementById("prepAddFormWrap");
    if (formWrap) formWrap.classList.toggle("open", _prepFormOpen);

    document.getElementById("lblPrepInputTitle").textContent = en ? "Title" : "タイトル";
    document.getElementById("prepInputTitle").placeholder = en ? "Enter checklist header / title..." : "タイトル（見出し）を入力...";
    document.getElementById("lblPrepInputDetails").textContent = en ? "Additional details" : "詳細メモ";
    document.getElementById("prepInputDetails").placeholder = en ? "Enter additional details (optional)..." : "詳細メモ・補足を入力（任意）...";
    document.getElementById("btnCancelPrepItem").textContent = en ? "Cancel" : "キャンセル";
    document.getElementById("btnUpdatePrepItem").textContent = en ? "Update" : "更新";

    window.renderPrepErrorBanner();

    const grid = document.getElementById("prepChecklistGrid");
    if (!grid) return;
    if (!state.prepDone) state.prepDone = {};

    if (tasks.length === 0) {
      grid.innerHTML = `
        <div id="prepEmptyStateMsg" style="grid-column: 1 / -1; text-align:center; padding: 18px; border-radius: 10px; border: 1px dashed var(--border-strong); background: var(--bg); color: var(--ink-muted); font-weight: 700; font-size: 13.5px;">
          ${en ? "No items pending action" : "対応待ちの項目はありません"}
        </div>
      `;
      document.getElementById("checklistProgressBadge").textContent = en ? "0 / 0 Done (0%)" : "0 / 0 完了 (0%)";
      document.getElementById("checklistProgressBar").style.width = "0%";
      return;
    }

    let doneCount = 0;
    grid.innerHTML = tasks.map(t => {
      const done = !!state.prepDone[t.id];
      if (done) doneCount++;
      const hasSub = t.sub && String(t.sub).trim().length > 0;
      const safeId = window.escapeAttr(t.id);
      return `
        <div data-task-id="${safeId}" onclick="togglePrepTask(this.dataset.taskId)" style="cursor:pointer;padding:10px 12px;border-radius:10px;border:1px solid ${done ? "var(--forest)" : "var(--border)"};background:${done ? "var(--forest-soft)" : "var(--bg)"};display:flex;align-items:flex-start;justify-content:space-between;gap:9px;">
          <div style="display:flex;align-items:flex-start;gap:9px;flex:1;">
            <span style="font-size:15px;line-height:1.2;">${done ? "✅" : "⬜"}</span>
            <div style="flex:1;">
              <div style="font-size:12.5px;font-weight:800;color:var(--ink);${done ? "text-decoration:line-through;opacity:0.75;" : ""}">${window.escapeHtml(t.title)}</div>
              ${hasSub ? `<div style="font-size:11px;color:var(--ink-muted);margin-top:2px;">${window.escapeHtml(t.sub)}</div>` : ""}
            </div>
          </div>
          <button type="button" class="btn btn-danger" style="padding:3px 7px;font-size:11px;flex-shrink:0;" data-task-id="${safeId}" onclick="deletePrepTask(this.dataset.taskId, event)" title="${en ? "Delete item" : "削除"}">🗑️</button>
        </div>
      `;
    }).join("");

    const pct = Math.round((doneCount / tasks.length) * 100);
    document.getElementById("checklistProgressBadge").textContent = en ? `${doneCount} / ${tasks.length} Done (${pct}%)` : `${doneCount} / ${tasks.length} 完了 (${pct}%)`;
    document.getElementById("checklistProgressBar").style.width = `${pct}%`;
  };
})();
