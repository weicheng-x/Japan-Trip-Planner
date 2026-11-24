# Japan Trip Planner (EN ⇄ JP)

Interactive **Japan Master Trip & Budget Planner** available as a live **Web App**, an offline single-file HTML bundle, and a portable **Windows Electron Desktop App**.

- **Live Web App (GitHub Pages):** https://weicheng-x.github.io/Japan-Trip-Planner/
- **Download Desktop App (`.exe`) & Offline Web App (`.html`):** https://github.com/weicheng-x/Japan-Trip-Planner/releases/latest

---

## Key Features

- **Bilingual Interface (`EN ⇄ JP`):** Toggle seamlessly between English and Japanese across schedules, maps, hotels, budgets, gourmet picks, transit notes, and UI controls.
- **4 Seasonal Themes + Light / Dark Modes:** Spring Sakura, Summer Fireworks, Autumn Foliage, and Winter Snow scenes with matching typography, palettes, and light/dark appearance toggles.
- **7 Built-In Japan Regional Presets + Pre-Seeded Feb 2027 Itinerary:** Start from curated regional itineraries or explore the included **16-Day Winter + Early Sakura Itinerary (Feb 21 – Mar 8, 2027)** (`itineraries/Winter_Sakura_16d_Feb2027.jptrip.json` and `.xlsx`).
- **Interactive Japan Route Map & Schedule Builder:** SVG route map synced with daily/hourly time-slot editing and city stops.
- **Hotels, Multi-Currency Budget & Rail Pass Optimizer:** Track nightly stays, reconcile transport/accommodation/dining/shopping budgets across currencies, and compare Pay-As-You-Go vs. JR Pass options.
- **Curated Tabelog Gourmet Guide, Transit & Shopping Tabs:** Built-in dining highlights, local transit references, and shopping checklist.
- **Google Maps Aesthetics, Real MLIT Geography & Fast Workflow (`v2.3.0`):**
  - **Survey-Grade Japan Map & City vs. Prefecture Highlights:** Real 47-prefecture + 95-city coastlines and borders (`src/data/japan-geo.js`) styled in Google Maps Light/Night palettes with smooth drag-pan, cursor-centered wheel zoom, and a floating Place Card. Clicking a common city highlights its exact municipality boundary; clicking an uncommon city or prefectural stop highlights the full prefecture boundary.
  - **One-Click Map Stop → Schedule Day + 3–4★ Hotel Defaults:** Adding any stop on Tab 1 appends a new latest Day in Tab 2 and automatically assigns a curated 3–4★ hotel (covering all 80 priority cities and all 47 prefectures in `src/data/hotels-catalog.js`, preserving `¥0` rates in Clean Blank mode).
  - **Drag-and-Drop Day Rearrangement:** Drag any day card (`⠿` handle) or quick-jump strip pill (`D15 → D2`) or use the direct `Move → D#` selector in Tab 2 to reorder days instantaneously with automatic date re-indexing and single-step Undo.
  - **Modular Architecture & Speed Optimizations:** Split domain actions cleanly (`schedule-actions.js`, `map-interact.js`) and added active-tab lazy dirty rendering, `WeakMap`/`_rev` memoized metrics (`computeRailPassMetrics`, `isActiveTripDirty`, `getMatchedJapanLocations`), and visibility-aware canvas throttling.
- **Preset Management, 47-Prefecture Regional Engine & Sharing (`v2.2.0`):**
  - **All 47 Prefectures + 80 Sightseeing City Catalogs:** Covers every prefecture plus 32+ priority cities (`Hachinohe`, `Shin-Aomori`, `Hirosaki`, `Nyuto Onsen`, `Kaminoyama`, `Kinugawa`, `Arima`, `Izu`, `Atami`, `Hamamatsu`, `Naha`, `Hakone`, `Shizuoka`, `Yokohama`, `Azumino`, `Hakuba`, `Takasaki`, `Nikko`, `Sado Island`, `Matsushima`, `Zao`, `Tsuruoka`, `Sapporo`, `Chitose`, `Asahikawa`, `Rebun Island`, `Matsue`, `Shimonoseki`, `Kurashiki`, `Awaji Island`, `Takamatsu`, `Matsuyama`, etc.) — city catalogs take priority when visited, falling back cleanly to prefectural guides.
  - **Prefecture Grouping, Un-Lumped Map Pins & Prefecture Zoom:** Distinct city pins (`Hachinohe`/`Hirosaki`/`Mutsu Bay`, `Sendai`/`Matsushima`, `Kobe`/`Himeji`/`Arima`, `Tottori`, `Shimane`), prefecture-grouped Schedule filter pills, and clickable Prefecture Zoom chips/halos on the interactive map.
  - **Forgiving Japanese Romanization:** Recognizes long-vowel and Hepburn/Kunrei-shiki variants (`Nyuto Onsen`, `Nyuutou Onsen`, `Nyuuto Onsen`, `Nyutou Onsen`, `Sizuoka`, `Simane`, `Matusima`, `Kurasiki`, etc.).
  - **Tabelog vs Restaurant Homepages & Offline `(?)` Disclaimer:** Clicking the gourmet Rating badge goes to **Tabelog** reviews while clicking the restaurant name opens its homepage; an inline `(?)` info popover beside Sync clarifies that synced entries come from offline pre-populated data.
  - **`➕ New` Multi-City Trip Wizard & Dual Export/Import:** Choose destinations, Clean Blank (`¥0`) vs. estimates, Overwrite/Save-as-New guard, `.jptrip.json` import/export, and an **8-sheet `.xlsx` Excel workbook** (including separate Restaurant Website & Tabelog columns).

---

## 3 Ways to Run

### 1. Live in Your Browser (GitHub Pages)
Open **https://weicheng-x.github.io/Japan-Trip-Planner/** directly — no installation or backend required.

### 2. Portable Windows Desktop App or Offline Single-File HTML
Download the latest assets from **[GitHub Releases](https://github.com/weicheng-x/Japan-Trip-Planner/releases/latest)**:
- **`JP Trip Planner 2.3.0.exe`** — Portable Windows Electron desktop app (run directly with no installer required; supports native file dialogs and local desktop persistence).
- **`JP_Trip_Planner.html`** — Standalone single-file offline HTML bundle with embedded styles, scripts, and seasonal hero images.

### 3. Run or Build from Source
Requires **Node.js 22+** and **npm**:

```bash
# Install dependencies
npm install

# Run automated unit & regression tests
npm test

# Launch the Electron desktop app in development mode (or double-click run-dev.bat on Windows)
npm start

# Run the Electron smoke test
npm run smoke

# Build standalone offline HTML bundle -> dist-web/JP_Trip_Planner.html
npm run build:html

# Build both standalone HTML and portable Windows EXE -> dist/
npm run build:win
```

---

## Automated GitHub Workflows

- **GitHub Pages (`.github/workflows/pages.yml`):** Automatically deploys `src/` to GitHub Pages on pushes to `main`.
- **Windows Release Builder (`.github/workflows/release.yml`):** Pushing a version tag (`v*`, e.g. `v2.2.0`) or triggering manually builds `dist-web/JP_Trip_Planner.html` and the portable Windows `.exe`, then creates or updates the GitHub Release assets automatically.

---

## License

Released under the [MIT License](LICENSE).
