// Exports the pre-built 16-day Feb 2027 itinerary to both:
//   - itineraries/Winter_Sakura_16d_Feb2027.jptrip.json (App Preset)
//   - itineraries/Winter_Sakura_16d_Feb2027.xlsx (8-sheet Excel Workbook)
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const outDir = path.join(rootDir, "itineraries");
fs.mkdirSync(outDir, { recursive: true });

const noop = () => {};
const storage = new Map();
const makeEl = (id) => ({
  id, value: "", textContent: "", innerHTML: "", checked: false, disabled: false, scrollHeight: 44,
  style: {}, attrs: {},
  classList: { _s: new Set(), add(c) { this._s.add(c); }, remove(c) { this._s.delete(c); }, toggle(c, f) { if (f === undefined) { if (this._s.has(c)) this._s.delete(c); else this._s.add(c); } else if (f) this._s.add(c); else this._s.delete(c); }, contains(c) { return this._s.has(c); } },
  setAttribute(k, v) { this.attrs[k] = String(v); },
  getAttribute(k) { return this.attrs[k] || null; },
  parentElement: { getBoundingClientRect: () => ({ width: 1200, height: 320 }) },
  getContext: () => ({ clearRect: noop, fillRect: noop, save: noop, restore: noop, translate: noop, rotate: noop, scale: noop, beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, bezierCurveTo: noop, quadraticCurveTo: noop, arc: noop, fill: noop, stroke: noop, createLinearGradient: () => ({ addColorStop: noop }), createRadialGradient: () => ({ addColorStop: noop }) }),
  focus: noop, click: noop, scrollIntoView: noop
});
const els = new Map();
const getEl = (id) => { if (!els.has(id)) els.set(id, makeEl(id)); return els.get(id); };
const body = makeEl("body");
body.appendChild = noop;
body.removeChild = noop;

const ctx = {
  console, Math, Date, Number, String, Array, Object, JSON, RegExp, Set, Map, URL, Blob,
  Uint8Array, Uint32Array, DataView, Buffer, btoa: (s) => Buffer.from(s, "binary").toString("base64"),
  unescape, encodeURIComponent, parseInt, parseFloat, isNaN, isFinite, Infinity,
  setTimeout: () => 1, clearTimeout: noop, requestAnimationFrame: () => 1, cancelAnimationFrame: noop,
  localStorage: { getItem: (k) => storage.get(k) || null, setItem: (k, v) => storage.set(k, String(v)) },
  document: { title: "", documentElement: makeEl("html"), body, activeElement: null, getElementById: getEl, querySelector: () => makeEl("q"), querySelectorAll: () => [], createElement: () => makeEl("c") },
  innerWidth: 1440, innerHeight: 900, scrollTo: noop
};
ctx.window = ctx;
ctx.self = ctx;
vm.createContext(ctx);

[
  "data/tohoku22.js",
  "data/romanization.js",
  "data/japan-geo.js",
  "data/gazetteer.js",
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
].forEach(rel => {
  vm.runInContext(fs.readFileSync(path.join(srcDir, rel), "utf8"), ctx, { filename: rel });
});

ctx.ensureSeededUserPresets();
ctx.loadTripPreset("userpreset_feb2027_16d", { silent: true, skipUndo: true });
ctx.renderAll();

const presetOut = ctx.buildPresetExportPayload();
const xlsxOut = ctx.buildExcelWorkbookPayload();

const jptripPath = path.join(outDir, "Winter_Sakura_16d_Feb2027.jptrip.json");
const xlsxPath = path.join(outDir, "Winter_Sakura_16d_Feb2027.xlsx");

fs.writeFileSync(jptripPath, presetOut.json, "utf8");
fs.writeFileSync(xlsxPath, Buffer.from(xlsxOut.bytes));

console.log(`Exported App Preset: ${jptripPath} (${(fs.statSync(jptripPath).size / 1024).toFixed(1)} KB)`);
console.log(`Exported Excel Workbook: ${xlsxPath} (${(fs.statSync(xlsxPath).size / 1024).toFixed(1)} KB)`);
