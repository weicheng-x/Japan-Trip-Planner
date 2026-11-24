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
    "data/romanization.js",
    "data/gazetteer.js",
    "data/prefectures-catalog.js",
    "data/cities-catalog.js",
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
  assert.strictEqual(presetExport.envelope.appVersion, "2.2.0");
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
  assert(fullMapHtml.includes('data-pref-id="aomori"') && fullMapHtml.includes("map-pref-cluster"), "Full route map must include clickable Aomori prefecture cluster halo");

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

  console.log("ALL_UNIT_AND_AUDIT_TESTS_PASSED");
}

run();
