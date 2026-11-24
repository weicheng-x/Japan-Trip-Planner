// Pure-JS Zero-Dependency Multi-Sheet Excel (.xlsx / OOXML) Workbook Exporter

(function() {
  const CRC_TABLE = (() => {
    const tbl = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      tbl[i] = c >>> 0;
    }
    return tbl;
  })();

  function crc32(bytes) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < bytes.length; i++) {
      crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function encodeUtf8(str) {
    if (typeof TextEncoder !== "undefined") {
      return new TextEncoder().encode(str);
    }
    const utf8 = unescape(encodeURIComponent(str));
    const arr = new Uint8Array(utf8.length);
    for (let i = 0; i < utf8.length; i++) arr[i] = utf8.charCodeAt(i);
    return arr;
  }

  function buildZipStore(entries) {
    const fileParts = [];
    const centralParts = [];
    let offset = 0;

    entries.forEach(entry => {
      const nameBytes = encodeUtf8(entry.name);
      const dataBytes = typeof entry.data === "string" ? encodeUtf8(entry.data) : entry.data;
      const crc = crc32(dataBytes);

      const lfh = new Uint8Array(30 + nameBytes.length);
      const lv = new DataView(lfh.buffer);
      lv.setUint32(0, 0x04034B50, true);
      lv.setUint16(4, 20, true);       // version needed: 2.0
      lv.setUint16(6, 0x0800, true);   // UTF-8 filename flag
      lv.setUint16(8, 0, true);        // store (uncompressed)
      lv.setUint16(10, 0, true);
      lv.setUint16(12, 0, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, dataBytes.length, true);
      lv.setUint32(22, dataBytes.length, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      lfh.set(nameBytes, 30);

      fileParts.push(lfh, dataBytes);

      const cdh = new Uint8Array(46 + nameBytes.length);
      const cv = new DataView(cdh.buffer);
      cv.setUint32(0, 0x02014B50, true);
      cv.setUint16(4, 20, true);
      cv.setUint16(6, 20, true);
      cv.setUint16(8, 0x0800, true);
      cv.setUint16(10, 0, true);
      cv.setUint16(12, 0, true);
      cv.setUint16(14, 0, true);
      cv.setUint32(16, crc, true);
      cv.setUint32(20, dataBytes.length, true);
      cv.setUint32(24, dataBytes.length, true);
      cv.setUint16(28, nameBytes.length, true);
      cv.setUint16(30, 0, true);
      cv.setUint16(32, 0, true);
      cv.setUint16(34, 0, true);
      cv.setUint16(36, 0, true);
      cv.setUint32(38, 0, true);
      cv.setUint32(42, offset, true);
      cdh.set(nameBytes, 46);

      centralParts.push(cdh);
      offset += lfh.length + dataBytes.length;
    });

    let cdSize = 0;
    centralParts.forEach(p => { cdSize += p.length; });

    const eocd = new Uint8Array(22);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054B50, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, entries.length, true);
    ev.setUint16(10, entries.length, true);
    ev.setUint32(12, cdSize, true);
    ev.setUint32(16, offset, true);
    ev.setUint16(20, 0, true);

    const totalLen = offset + cdSize + eocd.length;
    const out = new Uint8Array(totalLen);
    let pos = 0;
    fileParts.forEach(p => { out.set(p, pos); pos += p.length; });
    centralParts.forEach(p => { out.set(p, pos); pos += p.length; });
    out.set(eocd, pos);
    return out;
  }

  function bytesToBase64(bytes) {
    let bin = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
    }
    if (typeof btoa === "function") return btoa(bin);
    if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
    return "";
  }

  function escXml(val) {
    // Strip invalid XML 1.0 control characters before escaping entities
    const clean = String(val == null ? "" : val).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
    return clean
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function colLetter(idx0) {
    let n = idx0 + 1;
    let s = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      s = String.fromCharCode(65 + rem) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  }

  // Styles: 0=Normal, 1=Header, 2=WrapText, 3=BoldLabel, 4=JPY, 5=HomeFX, 6=JPYTotal, 7=HomeFXTotal, 8=Title, 9=Int
  function buildStylesXml() {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <numFmts count="2">
    <numFmt numFmtId="164" formatCode="&quot;¥&quot;#,##0"/>
    <numFmt numFmtId="165" formatCode="#,##0.00"/>
  </numFmts>
  <fonts count="4">
    <font><sz val="11"/><color rgb="FF1A2228"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FF1A2228"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="13"/><color rgb="FF1E3A5F"/><name val="Calibri"/></font>
  </fonts>
  <fills count="4">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1E3A5F"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF1F5F9"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFCBD5E1"/></left>
      <right style="thin"><color rgb="FFCBD5E1"/></right>
      <top style="thin"><color rgb="FFCBD5E1"/></top>
      <bottom style="thin"><color rgb="FFCBD5E1"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="10">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0"/>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="164" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="165" fontId="1" fillId="3" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right" vertical="center"/></xf>
    <xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1"/>
    <xf numFmtId="1" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
  }

  function buildWorksheetXml(sheet) {
    const cols = sheet.cols || [];
    const colsXml = cols.length > 0
      ? `<cols>${cols.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>`
      : "";
    const freezeXml = sheet.freezeTopRow
      ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
      : `<sheetViews><sheetView workbookViewId="0"/></sheetViews>`;

    const rowsXml = (sheet.rows || []).map((row, rIdx0) => {
      const rNum = rIdx0 + 1;
      const cellsXml = row.map((cell, cIdx0) => {
        const cObj = (cell && typeof cell === "object" && "v" in cell) ? cell : { v: cell, s: rIdx0 === 0 && sheet.freezeTopRow ? 1 : 2 };
        const ref = colLetter(cIdx0) + rNum;
        const styleId = cObj.s != null ? cObj.s : 2;
        if (typeof cObj.v === "number" && isFinite(cObj.v)) {
          return `<c r="${ref}" s="${styleId}"><v>${cObj.v}</v></c>`;
        }
        return `<c r="${ref}" t="inlineStr" s="${styleId}"><is><t xml:space="preserve">${escXml(cObj.v)}</t></is></c>`;
      }).join("");
      const ht = rIdx0 === 0 && sheet.freezeTopRow ? ` ht="24" customHeight="1"` : "";
      return `<row r="${rNum}"${ht}>${cellsXml}</row>`;
    }).join("");

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  ${freezeXml}
  <sheetFormatPr defaultRowHeight="18"/>
  ${colsXml}
  <sheetData>${rowsXml}</sheetData>
</worksheet>`;
  }

  window.buildExcelWorkbookPayload = function() {
    const en = window.isEn();
    const d = window.curData();
    const daysList = d.days || [];
    const hotelsList = d.hotels || [];
    const foodList = d.food || [];
    const accessList = d.access || [];
    const guidesList = d.guides || [];
    const prepList = d.prep || [];
    const shopList = state.shoppingList || [];

    const cCode = state.currencyCode || "SGD";
    const meta = (window.CURRENCY_META && window.CURRENCY_META[cCode]) || { defaultRate: 122 };
    const rate = (state.fxRate !== undefined && state.fxRate !== null) ? Number(state.fxRate) : meta.defaultRate;
    const conv = (jpy) => (rate > 0 ? Math.round(((Number(jpy) || 0) / rate) * 100) / 100 : 0);
    const num = (v, style) => ({ v: Math.round(Number(v) || 0), s: style || 4 });
    const fx = (v, style) => ({ v: conv(v), s: style || 5 });
    const intCell = (v) => ({ v: parseInt(v, 10) || 0, s: 9 });

    const startStr = state.startDate || (daysList[0] && daysList[0].date) || "";
    const endStr = state.endDate || (daysList[daysList.length - 1] && daysList[daysList.length - 1].date) || "";
    const desc = typeof window.sanitizeTripDescriptor === "function"
      ? window.sanitizeTripDescriptor(en ? state.customTitleEn : state.customTitleJa)
      : ((en ? state.customTitleEn : state.customTitleJa) || "Japan Trip");
    const fullTitle = typeof window.formatPresetLabel === "function"
      ? window.formatPresetLabel(desc, startStr, daysList.length, !en)
      : desc;
    const subtitle = (en ? state.customSubtitleEn : state.customSubtitleJa) || "";

    const b = window.computeBudgetSummary();
    const rail = typeof window.computeRailPassMetrics === "function" ? window.computeRailPassMetrics() : null;
    const sInfo = window.getSeasonInfoFromDate(startStr);

    // 1. Overview Sheet
    const doneCount = prepList.filter(p => state.prepDone && state.prepDone[p.id]).length;
    const overviewRows = [
      [{ v: fullTitle, s: 8 }, { v: "", s: 0 }],
      [{ v: subtitle, s: 2 }, { v: "", s: 0 }],
      [{ v: en ? "Field" : "項目", s: 1 }, { v: en ? "Value" : "設定・数値", s: 1 }],
      [{ v: en ? "Seasonal Theme" : "季節テーマ", s: 3 }, sInfo.key],
      [{ v: en ? "Travel Dates" : "日程", s: 3 }, `${startStr} -> ${endStr} (${daysList.length} ${en ? "Days" : "日間"} / ${Math.max(0, daysList.length - 1)} ${en ? "Nights" : "泊"})`],
      [{ v: en ? "Travelers (Pax)" : "人数", s: 3 }, intCell(b.pax)],
      [{ v: en ? "Ledger Mode" : "集計モード", s: 3 }, b.isPerPersonMode ? (en ? "Per-Person Rates x Pax" : "1名単価 x 人数") : (en ? "Group Total Ledger" : "グループ合計基準")],
      [{ v: en ? "Home Currency & FX Rate" : "基準通貨・為替", s: 3 }, `1 ${cCode} = ${rate} JPY`],
      [{ v: en ? "Stay Total (JPY)" : "宿泊費合計 (円)", s: 3 }, num(b.stayGroup, 4)],
      [{ v: en ? "Transport Baseline (JPY)" : "交通費基本計 (円)", s: 3 }, num(b.travelGroup, 4)],
      [{ v: en ? "Dining & Fun Total (JPY)" : "食事・観光計 (円)", s: 3 }, num(b.funGroup, 4)],
      [{ v: en ? "Itinerary Baseline (JPY)" : "旅程基本予算 (円)", s: 3 }, num(b.itineraryBaselineGroup, 6)],
      [{ v: en ? "Unmerged Local Transit (JPY)" : "未合算現地交通 (円)", s: 3 }, num(b.unmergedTransitGroup, 4)],
      [{ v: en ? "Net Shopping List (JPY)" : "買い物合計・税控除後 (円)", s: 3 }, num(b.shoppingNet, 4)],
      [{ v: en ? `Final Grand Total (JPY / ${cCode})` : `最終総合計 (円)`, s: 3 }, num(b.finalGrandTotalGroup, 6)],
      [{ v: en ? `Final Grand Total (${cCode})` : `最終総合計 (${cCode})`, s: 3 }, fx(b.finalGrandTotalGroup, 7)],
      [{ v: en ? "Per-Person Average (JPY)" : "1名あたり総額 (円)", s: 3 }, num(b.perPaxFinal, 4)],
      [{ v: en ? "Active Rail Pass" : "選択中の鉄道パス", s: 3 }, rail ? (en ? rail.passObj.nameEn : rail.passObj.nameJa) : "None"],
      [{ v: en ? "Hotels Count / Checklist Progress" : "宿泊拠点・チェックリスト", s: 3 }, `${hotelsList.length} ${en ? "Bases" : "拠点"} / ${doneCount}/${prepList.length} ${en ? "Ready" : "完了"}`]
    ];

    // 2. Daily Schedule Sheet
    const schedRows = [[
      en ? "Day" : "日",
      en ? "Date" : "日付",
      en ? "DOW" : "曜日",
      en ? "Region" : "エリア",
      en ? "Route / Highlight" : "ルート・見どころ",
      en ? "Summary" : "概要",
      en ? "Hotel Base" : "宿泊ホテル",
      en ? "Stay (JPY)" : "宿泊費(円)",
      en ? "Travel (JPY)" : "交通費(円)",
      en ? "Dining/Fun (JPY)" : "食遊(円)",
      en ? "Day Total (JPY)" : "日計(円)",
      en ? `Day Total (${cCode})` : `日計(${cCode})`,
      en ? "JR Fare (JPY)" : "JR運賃(円)",
      en ? "Unmerged Local (JPY)" : "未合算現地(円)",
      en ? "Transit Legs" : "移動区間",
      en ? "Traveler Tip" : "メモ・予約ヒント"
    ]];
    let sStay = 0, sTravel = 0, sFun = 0, sJr = 0, sUnbooked = 0;
    daysList.forEach(dayObj => {
      const stay = Number(dayObj.stay) || 0;
      const travel = Number(dayObj.travelBase) || 0;
      const fun = Number(dayObj.fun) || 0;
      const tot = stay + travel + fun;
      const jr = Number(dayObj.jrOnly) || 0;
      const add = Number(dayObj.travelActualAdd) || 0;
      sStay += stay; sTravel += travel; sFun += fun; sJr += jr; sUnbooked += add;
      schedRows.push([
        intCell(dayObj.day),
        dayObj.date || "",
        dayObj.dow || "",
        dayObj.region || "",
        dayObj.routeJp || "",
        dayObj.routeEn || "",
        dayObj.hotel || "",
        num(stay), num(travel), num(fun), num(tot), fx(tot), num(jr), num(add),
        (dayObj.legs || []).join(" | "),
        dayObj.tip || ""
      ]);
    });
    schedRows.push([
      { v: en ? "TOTAL" : "合計", s: 3 }, "", "", "",
      { v: `${daysList.length} ${en ? "Days Raw Ledger" : "日間ベース合計"}`, s: 3 },
      "", "",
      num(sStay, 6), num(sTravel, 6), num(sFun, 6), num(sStay + sTravel + sFun, 6), fx(sStay + sTravel + sFun, 7),
      num(sJr, 6), num(sUnbooked, 6), "", ""
    ]);

    // 3. Hourly Time Slots Sheet
    const slotRows = [[
      en ? "Day" : "日",
      en ? "Date" : "日付",
      en ? "Start" : "開始",
      en ? "End" : "終了",
      en ? "Category" : "種別",
      en ? "From -> To" : "移動・場所",
      en ? "Activity Description" : "詳細内容"
    ]];
    daysList.forEach(dayObj => {
      (dayObj.timeSlots || []).forEach(sl => {
        slotRows.push([
          intCell(dayObj.day),
          dayObj.date || "",
          sl.timeFrom || "",
          sl.timeTo || "",
          sl.category || "other",
          `${sl.locFrom || ""} -> ${sl.locTo || ""}`.replace(/^ -> $/, ""),
          sl.desc || ""
        ]);
      });
    });

    // 4. Hotels Sheet
    const hotelRows = [[
      en ? "Order" : "順",
      en ? "Region" : "エリア",
      en ? "Hotel Name" : "宿泊ホテル名",
      en ? "Check-In" : "チェックイン",
      en ? "Check-Out" : "チェックアウト",
      en ? "Nights" : "泊数",
      en ? "Per Night (JPY)" : "1泊単価(円)",
      en ? "Total Stay (JPY)" : "宿泊計(円)",
      en ? `Total (${cCode})` : `換算(${cCode})`,
      en ? "Station Access" : "駅アクセス",
      en ? "Highlights" : "特徴・ポイント",
      en ? "Official URL" : "公式サイト"
    ]];
    let hNights = 0, hTot = 0;
    hotelsList.forEach((h, idx) => {
      hNights += Number(h.nights) || 0;
      hTot += Number(h.totalJpy) || 0;
      hotelRows.push([
        intCell(h.order || idx + 1),
        h.region || "",
        h.name || "",
        h.checkIn || "",
        h.checkOut || "",
        intCell(h.nights),
        num(h.perNightJpy),
        num(h.totalJpy),
        fx(h.totalJpy),
        h.access || "",
        h.highlights || "",
        h.url || ""
      ]);
    });
    hotelRows.push([
      { v: en ? "TOTAL" : "合計", s: 3 }, "", "", "", "", intCell(hNights), "", num(hTot, 6), fx(hTot, 7), "", "", ""
    ]);

    // 5. Budget & Rail Pass Sheet
    const budgetRows = [
      [{ v: en ? "Category" : "費用区分", s: 1 }, { v: "JPY", s: 1 }, { v: cCode, s: 1 }, { v: en ? "Notes" : "備考", s: 1 }],
      [{ v: en ? "Accommodation" : "宿泊費", s: 3 }, num(b.stayGroup), fx(b.stayGroup), `${hotelsList.length} ${en ? "bases" : "拠点"}`],
      [{ v: en ? "Ground & Air Transit" : "交通費・航空券", s: 3 }, num(b.travelGroup), fx(b.travelGroup), en ? "Schedule baseline travel" : "日程表の交通費計"],
      [{ v: en ? "Dining & Attractions" : "食事・観光・体験", s: 3 }, num(b.funGroup), fx(b.funGroup), en ? "Food, ropes & tickets" : "グルメ・ロープウェイ・入場料"],
      [{ v: en ? "Unmerged Local Transit" : "未合算現地交通費", s: 3 }, num(b.unmergedTransitGroup), fx(b.unmergedTransitGroup), state.syncedLocalTransit ? (en ? "Already merged into days" : "日程表に合算済") : (en ? "Pending merge" : "未合算分")],
      [{ v: en ? "Shopping List (Net)" : "買い物リスト合計", s: 3 }, num(b.shoppingNet), fx(b.shoppingNet), `${shopList.length} ${en ? "items" : "件"}`],
      [{ v: en ? "Final Grand Total" : "最終総合計", s: 3 }, num(b.finalGrandTotalGroup, 6), fx(b.finalGrandTotalGroup, 7), `${b.pax} ${en ? "pax" : "名"}`],
      ["", "", "", ""],
      [{ v: en ? "Rail Pass Optimizer Comparison" : "鉄道パス比較シミュレーション", s: 1 }, { v: en ? "Covered / Pay (JPY)" : "対象・支払額(円)", s: 1 }, { v: en ? "Pass Price (JPY)" : "パス価格(円)", s: 1 }, { v: en ? "Verdict" : "判定", s: 1 }]
    ];
    if (rail) {
      budgetRows.push([
        { v: en ? rail.passObj.nameEn : rail.passObj.nameJa, s: 3 },
        num(rail.currentEval.coveredJrSum),
        num(rail.passPrice),
        rail.passObj.days > 0
          ? (rail.currentEval.netSavings >= 0 ? `Save ¥${Math.round(rail.currentEval.netSavings)}` : `Point-to-point beats pass by ¥${Math.round(Math.abs(rail.currentEval.netSavings))}`)
          : `Point-to-Point Total ¥${Math.round(rail.noPassEval.allSum)} (JR ¥${Math.round(rail.noPassEval.jrSum)} / Local ¥${Math.round(rail.noPassEval.nonJrSum)})`
      ]);
      if (rail.bestAlt && rail.bestAlt.eval.netSavings > 0) {
        budgetRows.push([
          { v: `Alt: ${en ? rail.bestAlt.pass.nameEn : rail.bestAlt.pass.nameJa}`, s: 3 },
          num(rail.bestAlt.eval.coveredJrSum),
          num(rail.bestAlt.pass.price),
          `Saves ¥${Math.round(rail.bestAlt.eval.netSavings)} (Days ${rail.bestAlt.eval.startDay}-${Math.min(daysList.length, rail.bestAlt.eval.endDay)})`
        ]);
      }
    }

    // 6. Gourmet Guide Sheet
    const foodRows = [[
      en ? "Region" : "エリア",
      en ? "Specialty Dish" : "名物料理",
      en ? "Restaurant / Spot" : "名店・スポット",
      en ? "Rating (Tabelog)" : "評価(食べログ等)",
      en ? "Access Notes" : "アクセス",
      en ? "Tag" : "分類",
      en ? "Notes" : "コメント",
      en ? "Link" : "URL"
    ]];
    foodList.forEach(f => {
      foodRows.push([f.region || "", f.dish || "", f.place || "", f.tabelogScore || "", f.transitText || "", f.sourceTag || "", f.note || "", f.url || ""]);
    });

    // 7. Transit & Guides Sheet
    const guideRows = [[
      en ? "Type" : "種別",
      en ? "Area" : "エリア",
      en ? "Scope / Day" : "対象日・区間",
      en ? "Title" : "名称",
      en ? "Details" : "詳細メモ",
      en ? "Official URL" : "公式URL"
    ]];
    accessList.forEach(a => {
      guideRows.push([en ? "Transit / PDF" : "交通・路線図", a.area || "", a.day || "", a.place || "", a.note || "", a.url || ""]);
    });
    guidesList.forEach(g => {
      guideRows.push([en ? "Sightseeing Guide" : "観光ガイド", g.area || "", g.day || "", g.location || "", g.note || "", g.url || ""]);
    });

    // 8. Shopping List Sheet
    const shopRows = [[
      en ? "Bought" : "購入済",
      en ? "Item Name" : "商品名",
      en ? "Store / Area" : "店舗・エリア",
      en ? "Unit (JPY)" : "単価(円)",
      en ? "Qty" : "数量",
      en ? "Subtotal (JPY)" : "小計(円)",
      en ? `Subtotal (${cCode})` : `小計(${cCode})`,
      en ? "Product URL" : "商品URL"
    ]];
    if (shopList.length === 0) {
      shopRows.push(["", en ? "(No shopping items listed)" : "（買い物リストは空です）", "", num(0), intCell(0), num(0), fx(0), ""]);
    } else {
      shopList.forEach(it => {
        const sub = (Number(it.price) || 0) * (parseInt(it.qty, 10) || 1);
        shopRows.push([it.bought ? "YES" : "NO", it.name || "", it.store || "", num(it.price), intCell(it.qty || 1), num(sub), fx(sub), it.url || ""]);
      });
    }
    shopRows.push([{ v: en ? "Net Shopping Total" : "買い物合計（免税反映後）", s: 3 }, "", "", "", "", num(b.shoppingNet, 6), fx(b.shoppingNet, 7), ""]);

    const sheets = [
      { name: en ? "Overview" : "旅の概要", freezeTopRow: false, cols: [30, 56], rows: overviewRows },
      { name: en ? "Daily Schedule" : "日別スケジュール", freezeTopRow: true, cols: [6, 12, 6, 18, 44, 42, 34, 13, 13, 13, 14, 14, 13, 15, 42, 46], rows: schedRows },
      { name: en ? "Hourly Time Slots" : "時間帯別プラン", freezeTopRow: true, cols: [6, 12, 9, 9, 14, 30, 54], rows: slotRows },
      { name: en ? "Hotels & Stays" : "宿泊ホテル", freezeTopRow: true, cols: [7, 16, 36, 13, 22, 8, 15, 15, 14, 38, 46, 28], rows: hotelRows },
      { name: en ? "Budget & Rail Pass" : "予算・鉄道パス", freezeTopRow: true, cols: [38, 22, 18, 54], rows: budgetRows },
      { name: en ? "Gourmet Guide" : "グルメ案内", freezeTopRow: true, cols: [22, 36, 36, 14, 38, 20, 48, 30], rows: foodRows },
      { name: en ? "Transit & Guides" : "交通PDF・観光ガイド", freezeTopRow: true, cols: [18, 24, 22, 42, 52, 34], rows: guideRows },
      { name: en ? "Shopping List" : "買い物リスト", freezeTopRow: true, cols: [10, 32, 26, 13, 8, 14, 14, 32], rows: shopRows }
    ];

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("\n  ")}
</Types>`;

    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

    const workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    ${sheets.map((s, i) => `<sheet name="${escXml(s.name.slice(0, 31))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("\n    ")}
  </sheets>
</workbook>`;

    const wbRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("\n  ")}
  <Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

    const zipEntries = [
      { name: "[Content_Types].xml", data: contentTypesXml },
      { name: "_rels/.rels", data: rootRelsXml },
      { name: "xl/workbook.xml", data: workbookXml },
      { name: "xl/_rels/workbook.xml.rels", data: wbRelsXml },
      { name: "xl/styles.xml", data: buildStylesXml() }
    ];
    sheets.forEach((s, i) => {
      zipEntries.push({ name: `xl/worksheets/sheet${i + 1}.xml`, data: buildWorksheetXml(s) });
    });

    const bytes = buildZipStore(zipEntries);
    const base64 = bytesToBase64(bytes);
    const safeBase = (desc || "Japan_Trip_Plan").replace(/[\\/:*?"<>|\[\]]+/g, "_").replace(/\s+/g, "_").replace(/^_+|_+$/g, "").slice(0, 52) || "Japan_Trip_Plan";
    const filename = `${safeBase}_${daysList.length}d.xlsx`;
    return { bytes, base64, filename };
  };

  window.exportTripExcel = async function() {
    const en = window.isEn();
    const { bytes, base64, filename } = window.buildExcelWorkbookPayload();
    if (window.jpDesktopAPI && typeof window.jpDesktopAPI.exportXlsx === "function") {
      const res = await window.jpDesktopAPI.exportXlsx(filename, base64);
      if (res && res.ok) {
        if (typeof window.closeAllModals === "function") window.closeAllModals();
        window.showToast(en ? `📊 Exported Excel workbook: ${res.filePath}` : `📊 Excelブックを保存しました: ${res.filePath}`);
      } else if (res && res.error) {
        window.showToast(en ? `⚠️ Excel export failed: ${res.error}` : `⚠️ Excel書き出しに失敗しました: ${res.error}`);
      }
      return;
    }
    const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (typeof window.closeAllModals === "function") window.closeAllModals();
    window.showToast(en ? `📊 Downloaded Excel workbook: ${filename}` : `📊 Excelブック ${filename} を保存しました`);
  };
})();
