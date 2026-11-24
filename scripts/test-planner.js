// Automated Regression & Self-Audit Test Suite for JP Trip Planner v2.1.0
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const zlib = require("zlib");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");

function createDomSandbox() {
  const noop = () => {};
  const storage = new Map();
  const els = new Map();
  const makeEl = (id) => {
    const el = {
      id, value: "", textContent: "", innerHTML: "", checked: false, disabled: false, scrollHeight: 44,
      style: {}, attrs: {}, dataset: {},
      classList: {
        _s: new Set(),
        add(c) { this._s.add(c); },
        remove(c) { this._s.delete(c); },
        toggle(c, f) {
          if (f === undefined) { if (this._s.has(c)) this._s.delete(c); else this._s.add(c); }
          else if (f) this._s.add(c);
          else this._s.delete(c);
        },
        contains(c) { return this._s.has(c); }
      },
      setAttribute(k, v) { this.attrs[k] = String(v); },
      getAttribute(k) { return this.attrs[k] || null; },
      querySelectorAll() { return []; },
      querySelector() { return makeEl("q"); },
      parentElement: { getBoundingClientRect: () => ({ width: 1200, height: 320 }) },
      getContext: () => ({
        clearRect: noop, fillRect: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
        beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, bezierCurveTo: noop, quadraticCurveTo: noop,
        arc: noop, fill: noop, stroke: noop,
        createLinearGradient: () => ({ addColorStop: noop }),
        createRadialGradient: () => ({ addColorStop: noop })
      }),
      focus: noop, click: noop, scrollIntoView: noop
    };
    return el;
  };
  const getEl = (id) => {
    if (!els.has(id)) els.set(id, makeEl(id));
    return els.get(id);
  };
  const body = makeEl("body");
  body.appendChild = noop;
  body.removeChild = noop;

  const ctx = {
    console, Math, Date, Number, String, Array, Object, JSON, RegExp, Set, Map, URL, Blob,
    Uint8Array, Uint32Array, DataView, Buffer,
    btoa: (s) => Buffer.from(s, "binary").toString("base64"),
    unescape, encodeURIComponent, parseInt, parseFloat, isNaN, isFinite, Infinity,
    setTimeout: () => 1, clearTimeout: noop, requestAnimationFrame: () => 1, cancelAnimationFrame: noop,
    localStorage: {
      getItem: (k) => storage.has(k) ? storage.get(k) : null,
      setItem: (k, v) => storage.set(k, String(v))
    },
    document: {
      title: "",
      documentElement: makeEl("html"),
      body,
      activeElement: null,
      addEventListener: noop,
      getElementById: getEl,
      querySelector: () => makeEl("q"),
      querySelectorAll: () => [],
      createElement: () => makeEl("created")
    },
    innerWidth: 1440, innerHeight: 900, scrollTo: noop,
    addEventListener: noop
  };
  ctx.window = ctx;
  ctx.self = ctx;
  vm.createContext(ctx);

  const loadOrder = [
    "data/tohoku22.js",
    "data/gazetteer.js",
    "data/catalogs.js",
    "data/presets.js",
    "data/feb2027-preset.js",
    "js/utils.js",
    "js/excel-export.js",
    "js/themes.js",
    "js/state.js",
    "js/preset-manager.js",
    "js/map.js",
    "js/render-rail.js",
    "js/render-chrome.js",
    "js/render-overview.js",
    "js/render-schedule.js",
    "js/render-hotels.js",
    "js/render-budget.js",
    "js/render-extras.js",
    "js/app.js"
  ];
  loadOrder.forEach(rel => {
    vm.runInContext(fs.readFileSync(path.join(srcDir, rel), "utf8"), ctx, { filename: rel });
  });
  return { ctx, els, getEl, storage };
}

function run() {
  const { ctx, getEl } = createDomSandbox();

  // 1. Preset catalog check (7 built-in, no customBlank, pre-seeded Feb 2027)
  assert.strictEqual(ctx.PRESET_CATALOG_META.length, 7, "Expected 7 built-in presets");
  assert(!ctx.PRESET_CATALOG_META.some(p => p.id === "customBlank"), "customBlank must not be in dropdown");
  assert(ctx.state.savedCustomPresets.some(p => p.id === "userpreset_feb2027_16d"), "Feb 2027 preset must be pre-seeded");

  // Verify every built-in preset renders cleanly without exceptions
  ctx.PRESET_CATALOG_META.forEach(meta => {
    ctx.loadTripPreset(meta.id, { skipUndo: true, force: true });
    ctx.renderAll();
    assert((ctx.state.dataEn.days || []).length >= 7, `${meta.id} should have days`);
    const rail = ctx.computeRailPassMetrics();
    assert(rail && rail.noPassEval.allSum >= 0, `${meta.id} rail metrics invalid`);
  });

  // 2. Formatting & CSV formula-injection guard
  assert.strictEqual(ctx.formatRegionLabel("Shirakawa-go", true), "Shirakawa-go");
  assert.strictEqual(ctx.formatRegionLabel("Onna-son", true), "Onna-son");
  assert.strictEqual(ctx.formatRegionLabel("Iwate-Aomori", true), "Iwate & Aomori");
  assert.strictEqual(ctx.formatRegionLabel("Tochigi-Ibaraki", true), "Tochigi & Ibaraki");
  assert.strictEqual(ctx.csvSafeCell("=SUM(A1:A2)"), `"'=SUM(A1:A2)"`);
  assert.strictEqual(ctx.csvSafeCell("+cmd"), `"'+cmd"`);
  assert.strictEqual(ctx.csvSafeCell("-123"), `"'-123"`);
  assert.strictEqual(ctx.csvSafeCell("@evil"), `"'@evil"`);
  assert.strictEqual(ctx.csvSafeCell('Hello "Kyoto"'), `"Hello ""Kyoto"""`);

  // 3. Exact 10% tax-free math (floor(gross / 11))
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  ctx.state.shoppingList = [{ id: "s1", name: "Watch", price: 11000, qty: 1, bought: false }];
  ctx.state.taxFreeEnabled = true;
  let bSum = ctx.computeBudgetSummary();
  assert.strictEqual(bSum.taxFreeDiscount, 1000, "¥11,000 tax-inclusive -> ¥1,000 tax");
  assert.strictEqual(bSum.shoppingNet, 10000);
  ctx.state.shoppingList = [{ id: "s2", name: "Snack", price: 4999, qty: 1, bought: false }];
  bSum = ctx.computeBudgetSummary();
  assert.strictEqual(bSum.taxFreeDiscount, 0, "< ¥5,000 must not trigger tax-free");
  ctx.state.shoppingList = [];
  ctx.state.taxFreeEnabled = false;

  // 4. XSS hardening on Custom Map Stop
  ctx.state.customMapLocations = [`Test');alert(1);//`];
  const mapHtml = ctx.buildInteractiveJapanMapHtml();
  assert(!mapHtml.includes("Test');alert(1);//'"), "Raw payload must never be inside onclick JS string");
  assert(mapHtml.includes('data-loc-id="unrec_custom_0"'), "Sanitized index-only id required");
  ctx.jumpToLocationFilter("unrec_custom_0", "Tokyo");
  ctx.state.customMapLocations = [];

  // 5. Title tag separation & no duplicate (XX days)
  assert.strictEqual(ctx.sanitizeTripDescriptor("[Autumn] Japan Autumn Foliage (22 days) AAAAA (22 days)"), "Japan Autumn Foliage AAAAA");
  assert.strictEqual(ctx.formatPresetLabel("Japan Autumn Foliage AAAAA", "2026-10-21", 22, false), "[Autumn] Japan Autumn Foliage AAAAA (22 days)");

  // 6. Fresh-itinerary multi-city Wizard (Clean Blank ¥0 & Empty Slots)
  getEl("newTripTitleInput").value = "Spring Tokyo Kyoto Draft";
  getEl("newTripStartInput").value = "2027-04-01";
  getEl("newTripDaysInput").value = "5";
  getEl("newTripCostMode").value = "blank";
  getEl("newTripEmptySlots").checked = true;
  getEl("newTripCityChips").querySelectorAll = () => [
    { classList: { contains: () => true }, dataset: { city: "Tokyo" } },
    { classList: { contains: () => true }, dataset: { city: "Kyoto" } }
  ];
  ctx.submitNewBlankTrip();

  assert.strictEqual(ctx.state.activePreset, "__draft__");
  assert.strictEqual(ctx.state.activeTab, "itinerary", "Wizard must switch user to Schedule tab");
  assert.strictEqual(ctx.state.dataEn.days.length, 5);
  assert.strictEqual(ctx.state.dataEn.hotels.length, 2, "Should seed 2 chained hotel bases (Tokyo + Kyoto)");
  assert.strictEqual(ctx.state.dataEn.hotels[0].checkIn, "2027-04-01");
  assert.strictEqual(ctx.state.dataEn.hotels[0].checkOut, "2027-04-03");
  assert.strictEqual(ctx.state.dataEn.hotels[1].checkIn, "2027-04-03");
  assert.strictEqual(ctx.state.dataEn.hotels[1].checkOut, "2027-04-05");
  assert.strictEqual(ctx.computeBudgetSummary().finalGrandTotalGroup, 0, "Clean blank mode must start at ¥0");
  assert.strictEqual(ctx.state.dataEn.days[0].timeSlots.length, 0, "Empty slots option must keep slots empty");
  assert(ctx.state.dataEn.food.some(f => /Kyoto/i.test(f.region)), "Multi-city wizard must populate Kyoto gourmet too");
  assert.strictEqual(ctx.isActiveTripDirty(), true);
  assert(getEl("btnSaveCustomPreset").textContent.includes("●"), "Save button must show unsaved indicator on draft");

  // Draft guard check on loadTripPreset without force
  ctx.loadTripPreset("tohoku22");
  assert.strictEqual(ctx.state.activePreset, "__draft__", "Draft guard must block unforced preset switch");
  assert(getEl("confirmModalBackdrop").classList.contains("open"), "Confirm modal must open for unsaved draft");
  ctx.closeAllModals();

  // 7. Save as New, Duplicate Guard, Overwrite, Dirty state reset
  getEl("savePresetNameInput").value = "Spring Tokyo Kyoto Draft";
  const created = ctx.confirmSaveAsNewPreset();
  assert(created && created.id.startsWith("userpreset_"));
  assert.strictEqual(ctx.isActiveTripDirty(), false);
  const countAfterNew = ctx.state.savedCustomPresets.length;

  // Duplicate save blocked
  const dup = ctx.confirmSaveAsNewPreset();
  assert.strictEqual(dup, null, "Duplicate name must be blocked");
  assert.strictEqual(ctx.state.savedCustomPresets.length, countAfterNew);

  // Bilingual custom text mirroring + Transit legs inline editor + Duplicate Day + Smart time slots
  ctx.updateDayField(0, "hotel", "APA Hotel Shinjuku");
  assert.strictEqual(ctx.state.dataJa.days[0].hotel, "APA Hotel Shinjuku", "Custom edit must mirror across EN/JA");
  assert.strictEqual(ctx.isActiveTripDirty(), true, "Editing saved preset marks dirty again");

  getEl("newLegInput_1").value = "Narita Express → Shinjuku (¥3,250)";
  ctx.addDayTransitLeg(0);
  assert.strictEqual(ctx.state.dataEn.days[0].legs[0], "Narita Express → Shinjuku (¥3,250)");
  assert.strictEqual(ctx.state.dataJa.days[0].legs[0], "Narita Express → Shinjuku (¥3,250)");
  ctx.removeDayTransitLeg(0, 0);
  assert.strictEqual(ctx.state.dataEn.days[0].legs.length, 0);

  ctx.duplicateDay(0);
  assert.strictEqual(ctx.state.dataEn.days.length, 6, "Duplicate Day should increase day count");
  assert.strictEqual(ctx.state.dataEn.days[1].date, "2027-04-02");

  // Starter fill & smart slot chaining
  ctx.fillStarterTimeSlots(0);
  assert(ctx.state.dataEn.days[0].timeSlots.length >= 3);
  const lastEnd = ctx.state.dataEn.days[0].timeSlots[ctx.state.dataEn.days[0].timeSlots.length - 1].timeTo;
  ctx.renderItineraryCards();
  assert(getEl("itineraryList").innerHTML.includes(`value="${lastEnd}"`), "Quick-add slot input must pre-fill from previous slot's timeTo");

  // Update dates shrink & clear check
  ctx.updateTripDates("2027-04-01", "2027-04-05");
  assert.strictEqual(ctx.state.dataEn.days.length, 5);
  assert.strictEqual(ctx.state.passStartDay, 1);

  // Overwrite keeps count unchanged
  getEl("savePresetNameInput").value = "Spring Tokyo Kyoto Renamed";
  const updated = ctx.confirmOverwritePreset();
  assert.strictEqual(updated.id, created.id);
  assert.strictEqual(ctx.state.savedCustomPresets.length, countAfterNew);
  assert.strictEqual(ctx.isActiveTripDirty(), false);

  // 8. Auto-populate gourmet/transit/guides from schedule changes (no duplicates)
  ctx.updateDayRegionAndMap(3, "Kanazawa");
  const sync1 = ctx.syncRegionalCatalogsFromSchedule();
  assert(sync1.foodAdded > 0 && sync1.guidesAdded > 0, "Kanazawa food & guides should auto-merge");
  const sync2 = ctx.syncRegionalCatalogsFromSchedule();
  assert.strictEqual(sync2.foodAdded + sync2.accessAdded + sync2.guidesAdded, 0, "Second sync must add 0 duplicates");

  // 9. Hotels auto-chaining, reorder & non-destructive region sync
  getEl("newHotelName").value = "Kanazawa APA Hotel";
  getEl("newHotelRegion").value = "Kanazawa";
  getEl("newHotelNights").value = "1";
  getEl("newHotelRate").value = "9500";
  ctx.addCustomHotel();
  const hLast = ctx.state.dataEn.hotels[ctx.state.dataEn.hotels.length - 1];
  assert.strictEqual(hLast.checkIn, "2027-04-05", "New hotel should auto-chain checkIn from previous hotel checkOut");
  assert.strictEqual(hLast.checkOut, "2027-04-06");
  ctx.updateHotelField(2, "nights", "2");
  assert.strictEqual(ctx.state.dataEn.hotels[2].checkOut, "2027-04-07");

  // Safe sync test on goldenRoute (Day 3 Mt. Fuji stays "Mt. Fuji" / "Chubu", not overwritten to "Tokyo")
  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  const day3RegionBefore = ctx.state.dataEn.days[2].region;
  ctx.syncHotelsToDailyBudget();
  assert.strictEqual(ctx.state.dataEn.days[2].region, day3RegionBefore, "syncHotelsToDailyBudget must preserve sub-trip region like Chubu/Mt. Fuji");

  // 10. Undo snapshot completeness (subtitle, mapLocations, fxRate)
  ctx.state.fxRate = 122;
  ctx.pushUndoSnapshot("test-undo");
  ctx.state.fxRate = 150;
  ctx.state.customSubtitleEn = "Changed Subtitle";
  ctx.state.customMapLocations = ["Sapporo"];
  ctx.undoLastChange();
  assert.strictEqual(ctx.state.fxRate, 122);
  assert.notStrictEqual(ctx.state.customSubtitleEn, "Changed Subtitle");
  assert.strictEqual(ctx.state.customMapLocations.length, 0);

  // 11. Feb 2027 16-Day Itinerary + Accurate Rail Pass Optimizer (no Nagoya, no false Kansai Wide recommendation)
  ctx.loadTripPreset("userpreset_feb2027_16d", { skipUndo: true, force: true });
  ctx.renderAll();
  const febDays = ctx.state.dataEn.days;
  assert.strictEqual(febDays.length, 16);
  assert.strictEqual(ctx.state.startDate, "2027-02-21");
  assert.strictEqual(ctx.state.endDate, "2027-03-08");
  assert.strictEqual(ctx.state.shoppingList.length, 0);
  const allFebStr = JSON.stringify({ days: ctx.state.dataEn.days, hotels: ctx.state.dataEn.hotels, food: ctx.state.dataEn.food });
  assert(!/nagoya/i.test(allFebStr), "Nagoya must be completely excluded");

  const febRail = ctx.computeRailPassMetrics();
  assert(!febRail.bestAlt || febRail.bestAlt.eval.netSavings <= 0,
    `Feb 2027 must NOT falsely recommend Kansai Wide Pass over Tokaido/Hokuriku cross-border rides (got ${febRail.bestAlt && febRail.bestAlt.pass.id} saving ${febRail.bestAlt && febRail.bestAlt.eval.netSavings})`);

  // Test goldenRoute: kansaiHiroshima5 SHOULD save on Osaka<->Hiroshima & Haruka, NOT claim Day 5 Odawara->Kyoto Tokaido Shinkansen
  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  const grRail = ctx.computeRailPassMetrics();
  assert(grRail.bestAlt && grRail.bestAlt.pass.id === "kansaiHiroshima5" && grRail.bestAlt.eval.netSavings > 0, "Golden Route should recommend kansaiHiroshima5");
  // Test syncRailFaresToBudget preserves flight + reflects pass savings
  ctx.selectJapanPass("kansaiHiroshima5");
  ctx.updatePassStartDay(6);
  ctx.syncRailFaresToBudget();
  assert.strictEqual(ctx.state.dataEn.days[7].travelBase, 0, "Day 8 Hiroshima covered by Kansai-Hiroshima Pass -> ¥0 out-of-pocket after sync");
  assert.strictEqual(ctx.state.dataEn.days[5].travelBase, 17600, "Pass start Day 6 includes pass price (¥17,000) + non-JR Kyoto local (¥600)");

  // 12. Share / Export (.jptrip.json + .xlsx OOXML ZIP verification)
  ctx.loadTripPreset("userpreset_feb2027_16d", { skipUndo: true, force: true });
  const presetExport = ctx.buildPresetExportPayload();
  assert.strictEqual(presetExport.envelope.schema, "jp-trip-planner-preset-v2");
  assert.strictEqual(presetExport.envelope.appVersion, "2.1.0");
  const xlsx = ctx.buildExcelWorkbookPayload();
  assert(xlsx.bytes.length > 20000);
  assert.strictEqual(xlsx.bytes[0], 0x50);
  assert.strictEqual(xlsx.bytes[1], 0x4B);

  console.log("ALL_UNIT_AND_AUDIT_TESTS_PASSED");
}

run();
