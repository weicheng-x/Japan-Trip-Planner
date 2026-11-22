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
- **Preset Management & Sharing:**
  - **Save Preset Modal:** Overwrite the active custom preset in place or Save as New (with duplicate-name guard).
  - **`➕ New` Blank Trip Wizard:** Start a fresh custom trip with configurable title, start date, and duration.
  - **Share / Export & Import:** Export/import portable `.jptrip.json` trip presets or generate an **8-sheet `.xlsx` Excel workbook** (`Overview`, `Daily Schedule`, `Hourly Time Slots`, `Hotels & Stays`, `Budget & Rail Pass`, `Gourmet Guide`, `Transit & Guides`, `Shopping List`).

---

## 3 Ways to Run

### 1. Live in Your Browser (GitHub Pages)
Open **https://weicheng-x.github.io/Japan-Trip-Planner/** directly — no installation or backend required.

### 2. Portable Windows Desktop App or Offline Single-File HTML
Download the latest assets from **[GitHub Releases](https://github.com/weicheng-x/Japan-Trip-Planner/releases/latest)**:
- **`JP Trip Planner 2.0.0.exe`** — Portable Windows Electron desktop app (run directly with no installer required; supports native file dialogs and local desktop persistence).
- **`JP_Trip_Planner.html`** — Standalone single-file offline HTML bundle with embedded styles, scripts, and seasonal hero images.

### 3. Run or Build from Source
Requires **Node.js 22+** and **npm**:

```bash
# Install dependencies
npm install

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
- **Windows Release Builder (`.github/workflows/release.yml`):** Pushing a version tag (`v*`, e.g. `v2.1.0`) or triggering manually builds `dist-web/JP_Trip_Planner.html` and the portable Windows `.exe`, then creates or updates the GitHub Release assets automatically.

---

## License

Released under the [MIT License](LICENSE).
