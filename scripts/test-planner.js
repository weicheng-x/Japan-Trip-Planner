// Automated Regression & Self-Audit Test Suite for JP Trip Planner v2.2.0
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
    console, Math, Date, Number, String, Array, Object, JSON, RegExp, Set, Map, WeakMap, URL, Blob,
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
    "data/romanization.js",
    "data/japan-geo.js",
    "data/gazetteer.js",
    "data/japan-places-index.js",
    "data/prefectures-catalog.js",
    "data/cities-catalog.js",
    "data/hotels-catalog.js",
    "data/catalogs.js",
    "data/presets.js",
    "data/feb2027-preset.js",
    "js/utils.js",
    "js/excel-export.js",
    "js/themes.js",
    "js/state.js",
    "js/preset-manager.js",
    "js/wizard-picker.js",
    "js/map.js",
    "js/map-interact.js",
    "js/render-rail.js",
    "js/render-chrome.js",
    "js/render-overview.js",
    "js/schedule-actions.js",
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
  delete getEl("newTripCityChips").querySelectorAll;

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
  assert.strictEqual(presetExport.envelope.appVersion, ctx.APP_VERSION);
  assert.strictEqual(ctx.APP_VERSION, "2.2.0");
  const xlsx = ctx.buildExcelWorkbookPayload();
  assert(xlsx.bytes.length > 20000);
  assert.strictEqual(xlsx.bytes[0], 0x50);
  assert.strictEqual(xlsx.bytes[1], 0x4B);

  // 13. Critique 2: All 47 Prefectures + 32 Requested Priority Cities + Complete City Catalogs
  assert.strictEqual(ctx.JAPAN_PREFECTURES.length, 47, "Expected all 47 Japan prefectures");
  assert.strictEqual(Object.keys(ctx.PREFECTURE_CATALOGS).length, 47, "Expected all 47 prefecture catalogs");
  const reqCityKeys = [
    "hachinohe", "shin_aomori", "hirosaki", "kaminoyama_onsen", "kinugawa_onsen",
    "nyuto_onsen", "arima_onsen", "izu", "atami", "hamamatsu", "naha", "hakone",
    "shizuoka", "yokohama", "azumino", "hakuba", "takasaki", "nikko", "sado_island",
    "matsushima", "zao", "tsuruoka", "sapporo", "chitose", "asahikawa", "rebun_island",
    "matsue", "shimonoseki", "kurashiki", "awaji_island", "takamatsu", "matsuyama"
  ];
  reqCityKeys.forEach(ck => {
    const p = ctx.CITY_CATALOGS[ck];
    assert(p, `Missing priority city catalog: ${ck}`);
    assert(p.food.length >= 3 && p.food.length <= 4, `${ck} food count out of range: ${p.food.length}`);
    assert(p.access.length >= 1 && p.access.length <= 2, `${ck} access count out of range`);
    assert(p.guides.length >= 1 && p.guides.length <= 2, `${ck} guides count out of range`);
  });
  Object.entries(Object.assign({}, ctx.PREFECTURE_CATALOGS, ctx.CITY_CATALOGS)).forEach(([k, p]) => {
    assert(p.food.length >= 3 && p.food.length <= 4, `${k} food invalid len ${p.food.length}`);
    assert(p.access.length >= 1 && p.access.length <= 2, `${k} access invalid len`);
    assert(p.guides.length >= 1 && p.guides.length <= 2, `${k} guides invalid len`);
    p.food.forEach((f, idx) => {
      assert(f.url && !f.url.includes("tabelog.com"), `${k} food[${idx}] url must be restaurant homepage`);
      assert(f.tabelogUrl && f.tabelogUrl.includes("tabelog.com"), `${k} food[${idx}] tabelogUrl must point to tabelog.com`);
    });
  });

  // 14. Critique 4: Forgiving Romanization & False Positive Guards
  ["Nyuto Onsen", "Nyuutou Onsen", "Nyuuto Onsen", "Nyutou Onsen", "Nyūtō Onsen"].forEach(variant => {
    const matched = ctx.findMatchingGazetteerStops(variant);
    assert(matched.some(m => m.id === "nyuto_onsen"), `Failed to recognize '${variant}' as nyuto_onsen`);
  });
  assert(ctx.findMatchingGazetteerStops("Sizuoka").some(m => m.id === "shizuoka"), "Sizuoka should match shizuoka");
  assert(ctx.findMatchingGazetteerStops("Simane").some(m => m.id === "pref_shimane"), "Simane should match Shimane Pref.");
  assert(ctx.findMatchingGazetteerStops("Matusima").some(m => m.id === "matsushima"), "Matusima should match matsushima");
  assert(ctx.findMatchingGazetteerStops("Kurasiki").some(m => m.id === "kurashiki"), "Kurasiki should match kurashiki");
  assert(ctx.findMatchingGazetteerStops("Shinaomori").some(m => m.id === "shin_aomori"), "Shinaomori should match shin_aomori");
  assert(!ctx.findMatchingGazetteerStops("Hotel Nikko Osaka").some(m => m.id === "nikko"), "Hotel Nikko must NOT trigger Nikko");
  assert(!ctx.findMatchingGazetteerStops("Saga-Arashiyama Bamboo Grove").some(m => m.id === "pref_saga" || m.id === "saga"), "Saga-Arashiyama must NOT trigger Saga Pref.");

  // 15. Critique 1: Un-lumped Cities, Tottori/Shimane Accuracy, Tab 2 Prefecture Grouping & Interactive Prefecture Zoom
  const kobeHits = ctx.findMatchingGazetteerStops("Kobe").map(m => m.id);
  assert(kobeHits.includes("kobe") && !kobeHits.includes("himeji") && !kobeHits.includes("arima_onsen"), "Kobe must not lump Himeji or Arima");
  const tottoriHits = ctx.findMatchingGazetteerStops("Tottori").map(m => m.id);
  assert(tottoriHits.includes("tottori_city") && !tottoriHits.includes("okayama_city"), "Tottori must map to tottori_city, not Okayama");
  const shimaneHits = ctx.findMatchingGazetteerStops("Shimane").map(m => m.id);
  assert(shimaneHits.includes("pref_shimane"), "Shimane must be recognized as pref_shimane");

  // Multi-stop Aomori + Miyagi schedule test
  ctx.state.mapScopeMode = "schedule";
  ctx.state.customMapLocations = [];
  ctx.state.focusedPrefId = null;
  ctx.state.activeRegionKey = "ALL";
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-04-01", dow: "Thu", region: "Hachinohe", routeJp: "Hachinohe Hasshoku Center", routeEn: "Market", hotel: "APA Hachinohe", stay: 8000, travelBase: 2000, fun: 3000, legs: [], timeSlots: [] },
    { day: 2, date: "2027-04-02", dow: "Fri", region: "Hirosaki", routeJp: "Hirosaki Castle Park", routeEn: "Cherry Blossoms", hotel: "APA Hirosaki", stay: 8000, travelBase: 1500, fun: 2000, legs: [], timeSlots: [] },
    { day: 3, date: "2027-04-03", dow: "Sat", region: "Mutsu Bay", routeJp: "Mutsu Bay & Oma Coast", routeEn: "Cape Oma", hotel: "Mutsu Hotel", stay: 8000, travelBase: 3000, fun: 4000, legs: [], timeSlots: [] },
    { day: 4, date: "2027-04-04", dow: "Sun", region: "Matsushima", routeJp: "Matsushima Bay Cruise", routeEn: "Three Views", hotel: "Matsushima Ryokan", stay: 12000, travelBase: 2000, fun: 4000, legs: [], timeSlots: [] },
    { day: 5, date: "2027-04-05", dow: "Mon", region: "Sendai", routeJp: "Sendai Castle & Gyutan", routeEn: "City Walk", hotel: "APA Sendai", stay: 8000, travelBase: 1000, fun: 3000, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  const mapStopsMulti = ctx.getMatchedJapanLocations().map(s => s.id);
  assert(mapStopsMulti.includes("hachinohe") && mapStopsMulti.includes("hirosaki") && mapStopsMulti.includes("mutsu_bay"), "All 3 Aomori stops must appear separately");
  assert(mapStopsMulti.includes("matsushima") && mapStopsMulti.includes("sendai"), "Matsushima and Sendai must appear separately");

  ctx.renderItineraryCards();
  const regPillsHtml = getEl("regionFilters").innerHTML;
  assert(regPillsHtml.includes("Aomori (3d)"), `Tab 2 must group Hachinohe/Hirosaki/Mutsu under Aomori (3d), got: ${regPillsHtml}`);
  assert(regPillsHtml.includes("Miyagi (2d)"), `Tab 2 must group Matsushima/Sendai under Miyagi (2d), got: ${regPillsHtml}`);
  const dayCardsHtml = getEl("itineraryList").innerHTML;
  assert(dayCardsHtml.includes("Aomori Pref.") && dayCardsHtml.includes("Miyagi Pref."), "Day cards must show prefecture badges");

  ctx.focusMapPrefecture("aomori");
  const aomoriZoomHtml = ctx.buildInteractiveJapanMapHtml();
  assert(aomoriZoomHtml.includes("Prefecture Zoom: Aomori (3 stops)"), "Focusing Aomori must display 3 stops zoomed header");
  assert(aomoriZoomHtml.includes("Back to Full Route"), "Focusing prefecture must render Back to Full Route button");
  ctx.focusMapPrefecture(null);
  const fullMapHtml = ctx.buildInteractiveJapanMapHtml();
  assert(fullMapHtml.includes('data-pref-id="aomori"') && fullMapHtml.includes("gmaps-pref has-stop") && fullMapHtml.includes("gmaps-pref-label"), "Full route map must include clickable Aomori prefecture boundary and multi-stop label");
  assert(!fullMapHtml.includes("<ellipse"), "Google Maps SVG must replace legacy ellipse circles with real boundaries");

  // 16. Critique 2: City Priority vs Prefecture Fallback Sync
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-05-01", dow: "Sat", region: "Matsue", routeJp: "Matsue Castle & Lake Shinji", routeEn: "Matsue", hotel: "Hotel Ichibata", stay: 9000, travelBase: 1000, fun: 3000, legs: [], timeSlots: [] },
    { day: 2, date: "2027-05-02", dow: "Sun", region: "Saga", routeJp: "Saga Prefecture Ceramic Tour", routeEn: "Saga", hotel: "Saga City Hotel", stay: 9000, travelBase: 2000, fun: 3000, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  ctx.state.dataEn.food = [];
  ctx.state.dataEn.access = [];
  ctx.state.dataEn.guides = [];
  ctx.state.dataJa.food = [];
  ctx.state.dataJa.access = [];
  ctx.state.dataJa.guides = [];
  const syncRes = ctx.syncRegionalCatalogsFromSchedule();
  assert(syncRes.detected.cityKeys.includes("matsue"), "Matsue should trigger city catalog");
  assert(!syncRes.detected.fallbackPrefIds.includes("shimane"), "Shimane prefecture fallback must NOT duplicate when Matsue matched");
  assert(syncRes.detected.fallbackPrefIds.includes("saga"), "Generic Saga day should fall back to Saga prefecture catalog");
  assert(ctx.state.dataEn.food.length >= 6, "Sync should populate gourmet items from Matsue + Saga");
  assert(ctx.state.dataEn.food.every(f => typeof f.id === "number" && f.transitText && f.sourceTag && f.tabelogUrl.includes("tabelog.com")), "Synced gourmet items must use exact UI fields and Tabelog links");

  // 17. Critiques 3 & 5: Offline (?) Disclaimer & Tabelog vs Restaurant Homepage Separation
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  ctx.renderOverviewTab();
  ctx.renderGourmet();
  ctx.renderAccessTable();
  ctx.renderGuidesTable();
  assert(getEl("overviewLeftCol").innerHTML.includes("info-tip-btn"), "Overview must include (?) offline data icon");
  assert(getEl("foodRegionPills").innerHTML.includes("info-tip-btn"), "Gourmet tab must include (?) offline data icon");
  assert(getEl("accessAreaPills").innerHTML.includes("info-tip-btn"), "Access tab must include (?) offline data icon");
  assert(getEl("guideAreaPills").innerHTML.includes("info-tip-btn"), "Guides tab must include (?) offline data icon");

  const tohokuGrid = getEl("gourmetGrid").innerHTML;
  assert(!tohokuGrid.includes("autoreserve.com") || tohokuGrid.indexOf("tabelog-badge") < tohokuGrid.indexOf("autoreserve.com"), "Gourmet rating badge must prioritize tabelog.com over autoreserve");
  const badgeHrefs = [...tohokuGrid.matchAll(/class="tabelog-badge"[\s\S]*?<a href="([^"]+)"/g)].map(m => m[1]);
  assert(badgeHrefs.length >= 5, "Tohoku Gourmet grid must render clickable rating links");
  badgeHrefs.forEach(u => assert(/^https:\/\/(?:[a-z0-9-]+\.)?tabelog\.com\//i.test(u), `Rating badge must link to Tabelog, got: ${u}`));
  assert(ctx.resolveTabelogUrlForItem({ place: "Aomori Gyosai Center Main Market", region: "Aomori & Morioka", tabelogUrl: "https://autoreserve.com/x" }, false).includes("/en/aomori/"), "Aomori Gyosai Center must resolve to /en/aomori/");
  assert(ctx.resolveTabelogUrlForItem({ place: "Hasshoku Center Shichirin-mura", region: "Aomori & Morioka", tabelogUrl: "https://autoreserve.com/x" }, false).includes("/en/aomori/"), "Hasshoku Center must resolve to /en/aomori/");
  assert(ctx.resolveTabelogUrlForItem({ place: "Sobadokoro Azumaya Morioka Ekimae", region: "Aomori & Morioka", tabelogUrl: "https://autoreserve.com/x" }, false).includes("/en/iwate/"), "Azumaya Morioka must resolve to /en/iwate/");

  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  ctx.renderGourmet();
  const grGrid = getEl("gourmetGrid").innerHTML;
  const grBadges = [...grGrid.matchAll(/class="tabelog-badge"[\s\S]*?<a href="([^"]+)"/g)].map(m => m[1]);
  assert(grBadges.length >= 5 && grBadges.every(u => u.includes("tabelog.com")), "Golden Route rating badges must all point to Tabelog");
  assert(getEl("foodFormBar").innerHTML.includes("newFoodTabelogUrl"), "Gourmet add form must accept separate restaurant & Tabelog URLs");

  // 18. v2.3.0 Google Maps MLIT Geography & City vs Prefecture Highlight
  assert.strictEqual(Object.keys(ctx.JAPAN_PREF_PATHS || {}).length, 47, "MLIT geometry must include all 47 prefectures");
  assert(Object.keys(ctx.JAPAN_CITY_PATHS || {}).length >= 820, "MLIT geometry must include all 792 shi + curated tourist areas");
  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  ctx.selectMapLocationPin("kyoto", "PREF:kyoto");
  const kyotoHighlightHtml = ctx.buildInteractiveJapanMapHtml();
  assert(kyotoHighlightHtml.includes('data-highlight-scope="city"') && kyotoHighlightHtml.includes('data-city-id="kyoto"'), "Selecting common city (Kyoto) must highlight its exact city boundary");
  assert(kyotoHighlightHtml.includes('id="gmapsPlaceCard"') && kyotoHighlightHtml.includes("City Boundary Highlight"), "City selection must open Google Maps Place Card with city scope");

  // Uncommon city or prefectural stop falls back to whole prefecture boundary
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-06-01", dow: "Tue", region: "Shimane", routeJp: "Tsuwano & Iwami Ginzan Coast", routeEn: "Shimane", hotel: "Tsuwano Heritage Inn", stay: 10000, travelBase: 2000, fun: 4000, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  ctx.selectMapLocationPin("pref_shimane", "PREF:shimane");
  const shimaneHighlightHtml = ctx.buildInteractiveJapanMapHtml();
  assert(shimaneHighlightHtml.includes('data-highlight-scope="prefecture"') && shimaneHighlightHtml.includes('data-pref-id="shimane"'), "Prefectural/uncommon stop must highlight the entire prefecture boundary");
  assert(!shimaneHighlightHtml.includes('data-highlight-scope="city"'), "Prefectural fallback must not claim city scope");
  ctx.clearMapBoundarySelection();

  // 19. v2.3.0 Tab 1 "+ Add Stop & Day" -> Appends Latest Day in Tab 2 + 3-4 Star Hotel Catalog Defaults
  assert.strictEqual(Object.keys(ctx.CITY_HOTELS || {}).length, 80, "Hotels catalog must include all 80 priority cities");
  assert.strictEqual(Object.keys(ctx.PREFECTURE_HOTELS || {}).length, 47, "Hotels catalog must include all 47 prefectures");
  assert(!/hotel nikko/i.test(ctx.CITY_HOTELS.nikko.nameEn), "Nikko default hotel must never be Hotel Nikko trap");

  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  const daysBeforeAdd = ctx.state.dataEn.days.length;
  const endBeforeAdd = ctx.state.endDate;
  getEl("mapLocationInput").value = "Takayama";
  ctx.addCustomMapLocation();
  assert.strictEqual(ctx.state.dataEn.days.length, daysBeforeAdd + 1, "Adding map stop must automatically append a new latest day to Tab 2");
  assert.strictEqual(ctx.state.dataJa.days.length, daysBeforeAdd + 1, "JA schedule must stay synchronized on map-stop add");
  assert(ctx.state.endDate > endBeforeAdd, "Appending map stop must advance trip endDate by 1 day");
  const appendedDay = ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1];
  const expectedTakayamaHotel = ctx.resolveDefaultHotelForLocation("Takayama");
  assert.strictEqual(appendedDay.hotel, expectedTakayamaHotel.nameEn, "Appended Takayama day must default to curated 3-4 star Takayama hotel");
  assert(appendedDay.stay > 0, "Estimated preset should populate nightly hotel rate on appended day");

  // Clean Blank ¥0 draft mode preserves stay === 0 while assigning real 3-4 star hotel
  getEl("newTripTitleInput").value = "Clean Blank Map Add";
  getEl("newTripStartInput").value = "2027-07-01";
  getEl("newTripDaysInput").value = "3";
  getEl("newTripCostMode").value = "blank";
  getEl("newTripEmptySlots").checked = true;
  getEl("newTripCityChips").querySelectorAll = () => [
    { classList: { contains: () => true }, dataset: { city: "Tokyo" } }
  ];
  ctx.submitNewBlankTrip();
  delete getEl("newTripCityChips").querySelectorAll;
  getEl("mapLocationInput").value = "Matsuyama";
  ctx.addCustomMapLocation();
  assert.strictEqual(ctx.state.dataEn.days.length, 4);
  const blankAddedDay = ctx.state.dataEn.days[3];
  assert.strictEqual(blankAddedDay.stay, 0, "Clean Blank ¥0 trip must preserve ¥0 stay rate when appending map stop");
  assert.strictEqual(blankAddedDay.hotel, ctx.CITY_HOTELS.matsuyama.nameEn, "Clean Blank day still defaults hotel name cleanly");

  // Direct region edit in Tab 2 resolves prefecture-level fallback hotel for non-common destinations
  ctx.updateDayRegionAndMap(1, "Shimane");
  assert.strictEqual(ctx.state.dataEn.days[1].hotel, ctx.PREFECTURE_HOTELS.shimane.nameEn, "Region edit to Shimane must resolve prefectural 3-4 star hotel");

  // Adding a prefecture/uncommon location via "+ Add Stop & Day" immediately opens full-prefecture Place Card
  getEl("mapLocationInput").value = "Shimane";
  ctx.addCustomMapLocation();
  const shimaneAddedMapHtml = ctx.buildInteractiveJapanMapHtml();
  assert(shimaneAddedMapHtml.includes('id="gmapsPlaceCard"') && shimaneAddedMapHtml.includes('data-highlight-scope="prefecture"') && shimaneAddedMapHtml.includes('data-pref-id="shimane"'), "Adding Shimane via map must auto-open Shimane prefecture highlight Place Card");

  // 20. v2.3.0 Drag-and-Drop Day Rearrangement & Sequential Re-dating + Undo
  ctx.loadTripPreset("userpreset_feb2027_16d", { skipUndo: true, force: true });
  const febDaysOrig = ctx.state.dataEn.days.map(d => d.routeJp);
  const day15Route = febDaysOrig[14];
  const day2Route = febDaysOrig[1];
  ctx.state.expandedDays = { 15: true };
  // Test direct drag-drop handler moving Day 15 (idx 14) -> Day 2 (idx 1)
  ctx.handleDayDragStart(14, { dataTransfer: { effectAllowed: "", setData() {} }, currentTarget: null });
  ctx.handleDayDrop(1, { preventDefault() {}, dataTransfer: { getData: () => "14" } });
  assert.strictEqual(ctx.state.dataEn.days[1].routeJp, day15Route, "Day 15 moved to Day 2 must sit at index 1");
  assert.strictEqual(ctx.state.dataEn.days[2].routeJp, day2Route, "Previous Day 2 must shift smoothly to Day 3");
  assert.strictEqual(ctx.state.expandedDays[2], true, "Expanded drawer state must follow moved day to Day 2");
  for (let i = 0; i < ctx.state.dataEn.days.length; i++) {
    assert.strictEqual(ctx.state.dataEn.days[i].day, i + 1, "Day numbers must remain strictly 1..N after reorder");
    const expectedDt = ctx.formatDateYMD(new Date(2027, 1, 21 + i));
    assert.strictEqual(ctx.state.dataEn.days[i].date, expectedDt, "Calendar dates must stay sequential after reorder");
  }
  ctx.undoLastChange();
  assert.strictEqual(ctx.state.dataEn.days[14].routeJp, day15Route, "Undo must revert drag-and-drop day reorder cleanly");

  // 21. v2.3.0 Memoization & Active-Tab Dirty Flush Optimization Checks
  const railCall1 = ctx.computeRailPassMetrics();
  const railCall2 = ctx.computeRailPassMetrics();
  assert.strictEqual(railCall1, railCall2, "Consecutive computeRailPassMetrics() calls without edits must hit memo cache");
  ctx.updateRailDayFare(1, "jr", 9800);
  const railCall3 = ctx.computeRailPassMetrics();
  assert.notStrictEqual(railCall1, railCall3, "Editing JR fare must invalidate rail metrics memo cache");

  ctx.loadTripPreset("userpreset_feb2027_16d", { skipUndo: true, force: true });
  const revBefore = ctx.state._rev;
  const dirty1 = ctx.isActiveTripDirty();
  const dirty2 = ctx.isActiveTripDirty();
  assert.strictEqual(dirty1, dirty2, "isActiveTripDirty() should agree across unchanged _rev");
  ctx.updateDayField(0, "hotel", "APA Hotel Test Optimization");
  assert(ctx.state._rev > revBefore, "saveState() must increment monotonic state._rev");
  assert.strictEqual(ctx.isActiveTripDirty(), true, "Dirty cache must invalidate on state._rev bump");

  ctx.switchTab("itinerary", null);
  ctx.renderActiveViews();
  assert(ctx._dirtyTabs && ctx._dirtyTabs.has("budget"), "renderActiveViews() on Schedule tab must defer hidden Budget tab in _dirtyTabs");
  ctx.switchTab("budget", null);
  assert(!ctx._dirtyTabs.has("budget"), "switchTab('budget') must flush deferred dirty Budget tab immediately");

  // 22. v2.0.0 12 Wizard Cities, Search, Map Picker & Smart Place Icons
  assert.strictEqual(
    ctx.WIZARD_CITIES.map(c => c.key).join(","),
    "Tokyo,Kyoto,Osaka,Hiroshima,Hakone,Kanazawa,Takayama,Aomori,Fukuoka,Sapporo,Okinawa,Sendai",
    "WIZARD_CITIES must match exact 12 city keys & order"
  );
  assert.strictEqual(ctx.getJapanPlaceIcon("achi_village"), "🌌", "Achi Village icon must be stargazing 🌌 instead of Nagano snow");
  assert.strictEqual(ctx.getJapanPlaceIcon("hokkaido"), "❄️");
  assert.strictEqual(ctx.getJapanPlaceIcon("niigata"), "❄️");
  assert.strictEqual(ctx.getJapanPlaceIcon("nagano"), "❄️");
  const achiSearchHits = ctx.searchAllJapanPlaces("Achi", 10);
  assert(achiSearchHits.some(x => x.id === "achi_village" && x.icon === "🌌"), "Searching 'Achi' must return Achi Village with 🌌 icon");
  const fuchuSearchHits = ctx.searchAllJapanPlaces("Fuchu", 10);
  assert(fuchuSearchHits.filter(x => /Fuchu/i.test(x.nameEn)).length >= 2, "Searching 'Fuchu' must list both Tokyo and Hiroshima options");
  const customWizPayload = ctx.buildBlankTripPayload({
    titleEn: "Alps Stars & Hokkaido",
    startDate: "2027-07-01",
    daysCount: 6,
    cities: ["Tokyo", "Achi Village", "Date (Hokkaido)"],
    costMode: "estimate"
  });
  assert(customWizPayload.dataEn.days.some(d => d.region === "Achi Village"), "buildBlankTripPayload must preserve custom searched/map cities");

  // 23. v2.0.0 All 792 Japanese Shi MLIT Geometry Coverage & Zero False Prose Positives
  const shiEntries = Object.values(ctx.JAPAN_CITY_PATHS || {}).filter(x => x && x.isShi);
  assert.strictEqual(shiEntries.length, 792, "JAPAN_CITY_PATHS must include all 792 Japanese shi");
  assert(shiEntries.every(x => typeof x.d === "string" && x.d.length > 5 && Array.isArray(x.bbox) && x.bbox.length === 4), "Every shi must have valid SVG path and bbox");
  assert(ctx.resolveLocationInputStops("Muko").some(x => x.prefId === "kyoto"), "Smallest city Muko-shi must resolve cleanly");
  assert(ctx.resolveLocationInputStops("Nakagawa").some(x => x.prefId === "fukuoka"), "Newest city Nakagawa-shi must resolve cleanly");
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  const tohokuStopIds = ctx.getMatchedJapanLocations().map(s => s.id);
  assert(!tohokuStopIds.includes("shi_date_fukushima") && !tohokuStopIds.includes("shi_date_hokkaido"), "Prose mentioning 'Date Masamune' must never trigger false Date City pin");

  // 24. v2.0.0 Ambiguous City Auto-Disambiguation & Bracket Prefecture Override
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-06-01", dow: "Tue", region: "Tokyo", routeJp: "Tokyo Arrival", routeEn: "", hotel: "Mitsui Garden Tokyo", stay: 15000, travelBase: 1000, fun: 4000, legs: [], timeSlots: [] },
    { day: 2, date: "2027-06-02", dow: "Wed", region: "Tokyo", routeJp: "Custom Day 2", routeEn: "", hotel: "Tokyo Hotel", stay: 12000, travelBase: 1000, fun: 3000, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  ctx.state.mapScopeMode = "schedule";
  ctx.state.customMapLocations = [];
  ctx.updateDayRegionAndMap(1, "Fuchu");
  assert.strictEqual(ctx.state.dataEn.days[1].region, "Fuchu (Tokyo)", "Bare 'Fuchu' must auto-correct to Fuchu (Tokyo)");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(ctx.state.dataEn.days[1]).id, "tokyo");
  ctx.updateDayRegionAndMap(1, "Fuchu (Hiroshima)");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(ctx.state.dataEn.days[1]).id, "hiroshima", "Changing brackets to Hiroshima must resolve Hiroshima Prefecture");
  const fuchuHiroStops = ctx.getMatchedJapanLocations().map(s => s.id);
  assert(fuchuHiroStops.includes("shi_fuchu_hiroshima"), "Fuchu (Hiroshima) must render shi_fuchu_hiroshima pin");
  assert(!fuchuHiroStops.includes("hiroshima"), "Fuchu (Hiroshima) must NOT leak Hiroshima City pin");

  getEl("mapLocationInput").value = "Date";
  ctx.addCustomMapLocation();
  const dateLast = ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1];
  assert.strictEqual(dateLast.region, "Date (Hokkaido)", "Bare 'Date' via map add must auto-correct to Date (Hokkaido)");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(dateLast).id, "hokkaido");
  ctx.updateDayRegionAndMap(ctx.state.dataEn.days.length - 1, "Date (Fukushima)");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1]).id, "fukushima");

  // 25. v2.0.0 Interactive Map Quirks (Unplanned Pref Zoom, Keep Zoom on Popup Close, Zoom LOD Cities)
  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  ctx.focusMapPrefecture("shimane");
  const unplannedShimaneHtml = ctx.buildInteractiveJapanMapHtml();
  assert.strictEqual(ctx.state.focusedPrefId, "shimane", "Clicking unplanned prefecture must focus it without zooming out");
  assert(unplannedShimaneHtml.includes('data-highlight-scope="prefecture" data-pref-id="shimane"'), "Unplanned prefecture must highlight its whole MLIT boundary");
  assert(unplannedShimaneHtml.includes('id="gmapsPlaceCard"') && unplannedShimaneHtml.includes("Shimane Prefecture"), "Unplanned prefecture must display top-left Place Card");
  assert(!unplannedShimaneHtml.includes('viewBox="26 28 895 922"'), "Focusing unplanned prefecture must zoom viewBox to prefecture bbox");

  ctx.dismissMapPlaceCard();
  assert.strictEqual(ctx.state.mapPopupDismissed, true);
  assert.strictEqual(ctx.state.focusedPrefId, "shimane", "Closing Place Card popup must preserve current prefecture focus & zoom");

  // Zoomed Miyagi LOD must show individual municipalities inside Miyagi (e.g. Sendai, Matsushima)
  const miyagiLod = ctx.buildDynamicCityLayerContent({ vx: 615, vy: 345, vw: 58, vh: 60 }, true);
  assert(miyagiLod.html.includes("gmaps-muni-poly") && miyagiLod.html.includes('data-pref-id="miyagi"'), "Further zoom inside Miyagi must render city boundaries");
  assert(miyagiLod.html.includes("gmaps-muni-label"), "Further zoom inside Miyagi must reveal city labels");

  // 26. v2.0.0 Bug #4 Regression: Akiu in Schedule Must Point Map to Akiu (Miyagi), NOT Kawaguchiko
  ctx.loadTripPreset("userpreset_feb2027_16d", { skipUndo: true, force: true });
  ctx.updateDayRegionAndMap(1, "Akiu");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(ctx.state.dataEn.days[1]).id, "miyagi", "Akiu must register in Miyagi Prefecture");
  const febStopsAfterAkiu = ctx.getMatchedJapanLocations().map(s => s.id);
  assert(febStopsAfterAkiu.includes("akiu"), "Map must include Akiu pin in Miyagi");
  assert(!febStopsAfterAkiu.includes("kawaguchiko"), "Map must NOT falsely show Kawaguchiko after Day 2 region changed to Akiu");

  // 27. v2.1.0 Complete All-1,747 Municipalities (792 市 + 23 区 + 743 町 + 189 村) Zero-Gap Map Coverage
  const allMunisGeo = Object.values(ctx.JAPAN_CITY_PATHS || {}).filter(x => x && x.isMuni);
  assert.strictEqual(allMunisGeo.length, 1747, "JAPAN_CITY_PATHS must contain all 1,747 Japanese municipalities");
  assert.strictEqual(allMunisGeo.filter(x => x.muniType === "city").length, 792);
  assert.strictEqual(allMunisGeo.filter(x => x.muniType === "ward").length, 23);
  assert.strictEqual(allMunisGeo.filter(x => x.muniType === "town").length, 743);
  assert.strictEqual(allMunisGeo.filter(x => x.muniType === "village").length, 189);
  assert(allMunisGeo.every(x => typeof x.d === "string" && x.d.length > 5 && Array.isArray(x.bbox) && x.bbox.length === 4), "Every municipality must have valid SVG path & bbox");

  const yamagataMunis = ctx.getMunisForPrefecture("yamagata");
  assert.strictEqual(yamagataMunis.length, 35, "Yamagata Prefecture must have all 35 cities, towns & villages");
  assert(yamagataMunis.some(m => m.rawNameEn === "Mogami" && m.muniType === "town"), "Yamagata must include Mogami Town");
  assert(yamagataMunis.some(m => m.rawNameEn === "Oishida" && m.muniType === "town"), "Yamagata must include Oishida Town");
  assert(yamagataMunis.some(m => m.rawNameEn === "Okura" && m.muniType === "village"), "Yamagata must include Okura Village");

  // Deep zoom inside Yamagata (north + south viewports) must reveal towns & villages with labels
  const yamagataBbox = ctx.JAPAN_PREF_PATHS.yamagata.bbox;
  const ymNorth = { vx: yamagataBbox[0] - 2, vy: yamagataBbox[1] - 2, vw: 42, vh: 42 };
  const ymSouth = { vx: yamagataBbox[0] - 2, vy: yamagataBbox[1] + 22, vw: 42, vh: 42 };
  const ymLodN = ctx.buildDynamicCityLayerContent(ymNorth, true, "yamagata");
  const ymLodS = ctx.buildDynamicCityLayerContent(ymSouth, true, "yamagata");
  assert(ymLodN.html.includes("cho_mogami_yamagata") && ymLodN.html.includes("Mogami"), "Deep zoom in north Yamagata must render Mogami Town polygon & label");
  assert(ymLodS.html.includes("cho_takahata_yamagata") && ymLodS.html.includes("Takahata"), "Deep zoom in south Yamagata must render Takahata Town polygon & label");

  // Entering towns/villages in Schedule & Map must resolve prefecture, hotel & catalogs accurately
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-06-01", dow: "Tue", region: "Tokyo", routeJp: "Arrival", routeEn: "", hotel: "Tokyo Hotel", stay: 12000, travelBase: 500, fun: 3000, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  ctx.updateDayRegionAndMap(0, "Mogami");
  assert.strictEqual(ctx.getPrimaryPrefectureForDay(ctx.state.dataEn.days[0]).id, "yamagata", "Mogami Town must resolve to Yamagata Prefecture");
  assert.strictEqual(ctx.state.dataEn.days[0].hotel, ctx.PREFECTURE_HOTELS.yamagata.nameEn, "Town entry must default to Yamagata 3-4 star prefectural hotel");
  const syncResMogami = ctx.syncRegionalCatalogsFromSchedule();
  assert(syncResMogami.detected.allMatchedPrefs.includes("yamagata"), "Catalog sync must detect Yamagata for town-level stop");

  // Cross-prefecture colliding towns (e.g. Asahi) must auto-disambiguate cleanly without false prose matches
  const asahiDis = ctx.disambiguateLocationInput("Asahi", false);
  assert(asahiDis.corrected && /\(/.test(asahiDis.text) && asahiDis.alternatives.length >= 2, "Bare colliding town Asahi must auto-disambiguate with alternatives");
  assert.strictEqual(ctx.resolveLocationInputStops("Mogami (Yamagata)")[0].prefId, "yamagata");

  // 28. v2.1.0 Wizard Drag-and-Drop Route Reordering & Set-Based DOM Reconciliation
  ctx.openNewTripModal();
  ctx.renderNewTripWizardChips(["Tokyo", "Kyoto", "Osaka"]);
  assert.strictEqual(ctx.reorderWizardSelection(2, 0), true, "Dragging item 2 -> index 0 must succeed");
  const selBarAfterReorder = getEl("wizardSelectedBar").innerHTML;
  assert(selBarAfterReorder.includes('draggable="true"') && selBarAfterReorder.indexOf("Osaka") < selBarAfterReorder.indexOf("Tokyo"), "Wizard selected bar must show Osaka reordered before Tokyo");
  getEl("newTripDaysInput").value = "7";
  ctx.submitNewBlankTrip();
  assert(ctx.state.dataEn.days[0].region.includes("Osaka"), "New blank trip Day 1 must start at dragged-first stop Osaka");
  assert(ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1].region.includes("Kyoto"), "New blank trip final day must end at Kyoto");

  // 29. v2.1.0 Wizard Enlarged Interactive Pan/Zoom Pick-by-Map
  ctx.openNewTripModal();
  ctx.setWizardPickerMode("map");
  const wizMapWrapHtml = getEl("wizardMapPickerWrap").innerHTML;
  assert(wizMapWrapHtml.includes('id="wizardJapanMapSvg"'), "Wizard Pick on Map must render full #wizardJapanMapSvg");
  assert(wizMapWrapHtml.includes("gmaps-zoom-controls"), "Wizard Pick on Map must render floating zoom controls");
  ctx.wizardSelectMapPref("yamagata");
  const ymWizHtml = getEl("wizardMapPickerWrap").innerHTML;
  assert(ymWizHtml.includes("cho_mogami_yamagata") && ymWizHtml.includes("cho_oishida_yamagata"), "Wizard map focused on Yamagata must show all towns & villages");
  ctx.wizardZoomMap(0.6);
  ctx.wizardTogglePlaceId("cho_mogami_yamagata");
  assert(getEl("wizardSelectedBar").innerHTML.includes("Mogami"), "Clicking town on wizard map must add Mogami to route");
  assert(getEl("wizardMapPickerWrap").innerHTML.includes("cho_mogami_yamagata"), "Selecting town must keep wizard zoomed view intact");
  ctx.wizardResetMapView();

  // 30. v2.2.0 Rail Pass Performance, Town/Region Override Scope & Badge Clear Fix
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  ctx.bumpStateRev(); // Force cold cache evaluation
  const tRailStart = performance.now();
  const coldRail = ctx.computeRailPassMetrics();
  const coldRailMs = performance.now() - tRailStart;
  assert(coldRailMs < 50, `computeRailPassMetrics cold compute must finish < 50ms on 22d trip (got ${coldRailMs.toFixed(2)}ms)`);
  assert(coldRail && coldRail.noPassEval.jrSum > 0);

  // Town-level Mogami must map to Yamagata -> eligible for jreast5; Akiu with _regionOverridden must not leak Kawaguchiko/Chubu
  ctx.state.dataEn.days = [
    { day: 1, date: "2027-06-01", dow: "Tue", region: "Mogami", _regionOverridden: true, routeJp: "Mogami River Boat", routeEn: "", hotel: "Yamagata Hotel", stay: 10000, travelBase: 18000, jrOnly: 18000, totalAllLegs: 18000, passCovered: false, legs: [], timeSlots: [] },
    { day: 2, date: "2027-06-02", dow: "Wed", region: "Akiu", _regionOverridden: true, routeJp: "Day 2: Old Kawaguchiko Express Bus", routeEn: "", hotel: "Akiu Hotel", stay: 10000, travelBase: 22000, jrOnly: 22000, totalAllLegs: 22000, passCovered: false, legs: [], timeSlots: [] }
  ];
  ctx.state.dataJa.days = JSON.parse(JSON.stringify(ctx.state.dataEn.days));
  ctx.selectJapanPass("jreast5");
  ctx.updatePassStartDay(1);
  const ovRail = ctx.computeRailPassMetrics();
  assert.strictEqual(ovRail.currentEval.coveredJrSum, 40000, "Mogami (Yamagata) & overridden Akiu (Miyagi) must both be covered by JR East Tohoku Pass without stale Kawaguchiko leak");
  ctx.syncRailFaresToBudget();
  assert.strictEqual(ctx.state.dataEn.days[0].passCovered, true);
  assert.strictEqual(ctx.state.dataEn.days[1].passCovered, true);

  // Switching to "none" and clicking Sync must clear passCovered badges
  ctx.selectJapanPass("none");
  ctx.syncRailFaresToBudget();
  assert.strictEqual(ctx.state.dataEn.days[0].passCovered, false, "Sync under No Rail Pass must clear passCovered badge on Day 1");
  assert.strictEqual(ctx.state.dataEn.days[1].passCovered, false, "Sync under No Rail Pass must clear passCovered badge on Day 2");

  // 31. v2.2.0 String Gourmet IDs, Filter Auto-Reset on Lang Switch, Integer Shopping & Minor-Unit FX
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  ctx.state.dataEn.food.unshift({
    id: "custom_food_str_1", region: "Tokyo", dish: "Str Ramen", place: "Menya Test",
    url: "", tabelogScore: "★ 3.7", tabelogUrl: "https://tabelog.com/tokyo/",
    transitLevel: "easy", transitText: "🟢 2m", sourceTag: "Custom", note: "Test", tried: false
  });
  ctx.state.dataJa.food.unshift(Object.assign({}, ctx.state.dataEn.food[0]));
  ctx.renderGourmet();
  assert(getEl("gourmetGrid").innerHTML.includes(`data-id="custom_food_str_1"`), "Gourmet card buttons must bind string IDs via data-id");
  ctx.toggleFoodTried("custom_food_str_1");
  assert.strictEqual(ctx.state.dataEn.food[0].tried, true, "toggleFoodTried must work with non-numeric string IDs");
  ctx.deleteFood("custom_food_str_1");
  assert(!ctx.state.dataEn.food.some(f => f.id === "custom_food_str_1"), "deleteFood must remove string-ID food item");

  // Filter auto-reset across Tabs 6/7/8 when language switches (EN region filter -> JP)
  const firstEnFoodReg = ctx.state.dataEn.food[0].region;
  const firstEnAccArea = ctx.state.dataEn.access[0].area;
  const firstEnGuideArea = ctx.state.dataEn.guides[0].area;
  ctx.filterFoodKey(firstEnFoodReg);
  ctx.filterAccessKey(firstEnAccArea);
  ctx.filterGuideKey(firstEnGuideArea);
  ctx.setLanguage("ja");
  assert.strictEqual(ctx.state.activeFoodKey, "ALL", "Switching EN->JP must reset stale Gourmet filter to ALL instead of showing empty grid");
  assert.strictEqual(ctx.state.activeAccessKey, "ALL", "Switching EN->JP must reset stale Access filter to ALL");
  assert.strictEqual(ctx.state.activeGuideKey, "ALL", "Switching EN->JP must reset stale Guides filter to ALL");
  assert(getEl("gourmetGrid").innerHTML.includes("food-card"), "Gourmet grid must remain populated after language switch");
  ctx.setLanguage("en");

  // Shopping integer yen rounding & minor-unit FX helper
  ctx.state.shoppingList = [];
  getEl("newShopName").value = "Matcha Tin";
  getEl("newShopPrice").value = "1250.7";
  getEl("newShopQty").value = "2";
  ctx.addShoppingItem();
  assert.strictEqual(ctx.state.shoppingList[0].price, 1251, "Shopping unit price must round to integer JPY");
  assert.strictEqual(ctx.convertJpyToCurrency(10000, 122), 81.97, "Minor-unit FX conversion must match rounded 2 d.p.");
  assert.strictEqual(ctx.convertJpyToCurrency(10000, 0), 0, "Zero FX rate must safely return 0");
  assert.notStrictEqual(ctx.makeUid("x"), ctx.makeUid("x"), "Back-to-back makeUid calls must never collide");

  // 32. v2.2.0 Undo Completeness, Expanded Drawer & Hotel Edge Cases
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  ctx.state.budgetMode = "per_person";
  ctx.state.paxCount = 3;
  ctx.state.shareHotelRoom = false;
  ctx.state.budgetTargetJpy = 450000;
  ctx.state.taxFreeEnabled = true;
  ctx.pushUndoSnapshot("Before reset test");
  ctx.state.budgetMode = "group";
  ctx.state.shareHotelRoom = true;
  ctx.state.budgetTargetJpy = 0;
  ctx.state.taxFreeEnabled = false;
  ctx.undoLastChange();
  assert.strictEqual(ctx.state.budgetMode, "per_person", "Undo must restore budgetMode");
  assert.strictEqual(ctx.state.shareHotelRoom, false, "Undo must restore shareHotelRoom");
  assert.strictEqual(ctx.state.budgetTargetJpy, 450000, "Undo must restore budgetTargetJpy");
  assert.strictEqual(ctx.state.taxFreeEnabled, true, "Undo must restore taxFreeEnabled");

  // deleteSpecificDay remaps expandedDays and clamps passStartDay; updateTripDates keeps hotel split notes
  ctx.state.expandedDays = { 2: true, 22: true };
  ctx.state.passStartDay = 22;
  let capturedConfirm = null;
  const origShowConfirm = ctx.showConfirmModal;
  ctx.showConfirmModal = (_t, _m, onConfirm) => { capturedConfirm = onConfirm; };
  ctx.deleteSpecificDay(0);
  assert(typeof capturedConfirm === "function");
  capturedConfirm();
  ctx.showConfirmModal = origShowConfirm;
  assert.strictEqual(ctx.state.dataEn.days.length, 21);
  assert.strictEqual(ctx.state.expandedDays[1], true, "Day 2 expanded drawer must shift down to Day 1 after deleting Day 1");
  assert.strictEqual(ctx.state.expandedDays[21], true, "Day 22 expanded drawer must shift down to Day 21");
  assert.strictEqual(ctx.state.expandedDays[22], undefined, "Deleted/stale Day 22 key must be cleaned up");
  assert.strictEqual(ctx.state.passStartDay, 21, "passStartDay must clamp to new day count after deletion");

  // Hotel checkOut parenthetical note preserved on updateTripDates shift & departure-day stay cleared on partial hotel sync
  ctx.loadTripPreset("tohoku22", { skipUndo: true, force: true });
  const splitOutSample = "2026-11-11 (Split: returns Day 20)";
  ctx.state.dataEn.hotels[0].checkOut = splitOutSample;
  ctx.updateTripDates("2026-10-22", null);
  assert(ctx.state.dataEn.hotels[0].checkOut.startsWith("2026-11-12") && ctx.state.dataEn.hotels[0].checkOut.includes("(Split: returns Day 20)"),
    "Shifting trip start date must preserve parenthetical hotel notes");
  ctx.state.dataEn.hotels = [ctx.state.dataEn.hotels[0]]; // Fewer nights than 21
  ctx.state.dataEn.hotels[0].nights = 2;
  ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1].stay = 9999;
  ctx.syncHotelsToDailyBudget();
  assert.strictEqual(ctx.state.dataEn.days[ctx.state.dataEn.days.length - 1].stay, 0, "Partial hotel sync must still zero out departure-day stay");

  // 33. v2.2.0 Shared LOD Layer & Updated Overview Copy
  ctx.loadTripPreset("goldenRoute", { skipUndo: true, force: true });
  ctx.renderOverviewTab();
  assert(getEl("overviewLeftCol").innerHTML.includes("1,747 municipalities"), "Overview How-To copy must reflect 1,747 municipalities");
  const mainLodOut = ctx.buildDynamicCityLayerContent(ymNorth, true, "yamagata");
  assert(typeof ctx.renderMunicipalityLodLayer === "function" && mainLodOut.html.includes("cho_mogami_yamagata"), "Shared renderMunicipalityLodLayer must power both maps");

  console.log("ALL_UNIT_AND_AUDIT_TESTS_PASSED");
}

run();
