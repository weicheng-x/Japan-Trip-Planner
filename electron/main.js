const { app, BrowserWindow, Menu, ipcMain, dialog, shell } = require("electron");
const fs = require("fs");
const path = require("path");

const isSmokeTest = process.argv.includes("--smoke-test");

let mainWindow = null;

function getStateFilePath() {
  return path.join(app.getPath("userData"), "jp-trip-planner-state.json");
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    show: !isSmokeTest,
    title: "JP Trip Planner",
    icon: path.join(__dirname, "icon.ico"),
    backgroundColor: "#FAF7F2",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // Open external http/https links in the system's default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const appOrigin = "file://";
    if (!url.startsWith(appOrigin) && /^https?:\/\//i.test(url)) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  const indexHtml = path.join(__dirname, "..", "src", "index.html");
  mainWindow.loadFile(indexHtml);

  if (isSmokeTest) {
    const pageErrors = [];
    mainWindow.webContents.on("console-message", (_ev, level, message) => {
      if (level >= 3) pageErrors.push(message);
    });
    mainWindow.webContents.on("did-fail-load", (_ev, code, desc) => {
      pageErrors.push(`did-fail-load ${code}: ${desc}`);
    });
    mainWindow.webContents.on("did-finish-load", async () => {
      await new Promise(r => setTimeout(r, 900));
      try {
        const probe = await mainWindow.webContents.executeJavaScript(`(() => {
          const builtInIds = (window.PRESET_CATALOG_META || []).map(p => p.id);
          const customIds = (window.state && Array.isArray(window.state.savedCustomPresets)) ? window.state.savedCustomPresets.map(p => p.id) : [];
          const heroImg = document.getElementById("heroSceneImg");
          return {
            title: document.title,
            season: document.body.getAttribute("data-season"),
            presetCount: builtInIds.length,
            presetIds: builtInIds,
            customIds,
            hasFeb2027: customIds.includes("userpreset_feb2027_16d"),
            hasCustomBlankInCatalog: builtInIds.includes("customBlank"),
            kpiBaseline: document.getElementById("kpiBaselineJpy")?.textContent,
            kpiAllIn: document.getElementById("kpiReconciledJpy")?.textContent,
            heroImgComplete: !!(heroImg && heroImg.complete && heroImg.naturalWidth > 0),
            heroImgSize: heroImg ? [heroImg.naturalWidth, heroImg.naturalHeight] : [0, 0],
            hasDesktopAPI: !!(window.jpDesktopAPI && window.jpDesktopAPI.exportXlsx && window.jpDesktopAPI.exportPreset),
            hasAutoPopulateGuides: typeof window.syncRegionalCatalogsFromSchedule === "function",
            hasTransitLegEditor: typeof window.addDayTransitLeg === "function",
            prefectureCount: (window.JAPAN_PREFECTURES || []).length,
            prefCatalogCount: Object.keys(window.PREFECTURE_CATALOGS || {}).length,
            cityCatalogCount: Object.keys(window.CITY_CATALOGS || {}).length,
            prefGeoCount: Object.keys(window.JAPAN_PREF_PATHS || {}).length,
            cityGeoCount: Object.keys(window.JAPAN_CITY_PATHS || {}).length,
            shiCount: Object.values(window.JAPAN_CITY_PATHS || {}).filter(x => x && x.isShi).length,
            cityHotelsCount: Object.keys(window.CITY_HOTELS || {}).length,
            prefHotelsCount: Object.keys(window.PREFECTURE_HOTELS || {}).length,
            wizardCityCount: (window.WIZARD_CITIES || []).length,
            hasReorderDay: typeof window.reorderItineraryDay === "function",
            hasDisambiguate: typeof window.disambiguateLocationInput === "function",
            hasDismissPlaceCard: typeof window.dismissMapPlaceCard === "function",
            hasRomanization: typeof window.normalizeJapanRomaji === "function"
          };
        })()`);
        console.log("SMOKE_PROBE:", JSON.stringify(probe));
        if (pageErrors.length > 0) {
          console.error("SMOKE_ERRORS:", pageErrors);
          app.exit(1);
          return;
        }
        if (!probe.heroImgComplete || probe.presetCount !== 7 || probe.hasCustomBlankInCatalog || !probe.hasFeb2027 || !probe.hasDesktopAPI || !probe.hasAutoPopulateGuides || !probe.hasTransitLegEditor || probe.prefectureCount !== 47 || probe.prefCatalogCount !== 47 || probe.cityCatalogCount < 75 || probe.prefGeoCount !== 47 || probe.cityGeoCount < 820 || probe.shiCount !== 792 || probe.cityHotelsCount !== 80 || probe.prefHotelsCount !== 47 || probe.wizardCityCount !== 12 || !probe.hasReorderDay || !probe.hasDisambiguate || !probe.hasDismissPlaceCard || !probe.hasRomanization) {
          console.error("SMOKE_FAILED_ASSERTIONS", probe);
          app.exit(1);
          return;
        }
        console.log("SMOKE_TEST_OK");
        app.exit(0);
      } catch (err) {
        console.error("SMOKE_EXEC_ERROR:", err);
        app.exit(1);
      }
    });
  }

  buildMenu();
}

function buildMenu() {
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Blank Trip...",
          accelerator: "CmdOrCtrl+N",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.openNewTripModal && window.openNewTripModal()")
        },
        {
          label: "Save Preset (Overwrite / Save As New)...",
          accelerator: "CmdOrCtrl+S",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.openSavePresetModal && window.openSavePresetModal()")
        },
        { type: "separator" },
        {
          label: "Export / Share (App Preset or Excel)...",
          accelerator: "CmdOrCtrl+Shift+E",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.openShareExportModal && window.openShareExportModal()")
        },
        {
          label: "Export Excel Workbook (.xlsx)...",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.exportTripExcel && window.exportTripExcel()")
        },
        {
          label: "Import Preset / Backup (.jptrip.json / .json)...",
          accelerator: "CmdOrCtrl+O",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.triggerImportPresetFile && window.triggerImportPresetFile()")
        },
        {
          label: "Export Budget CSV...",
          accelerator: "CmdOrCtrl+E",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.exportCsv && window.exportCsv()")
        },
        {
          label: "Print / Save PDF...",
          accelerator: "CmdOrCtrl+P",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.printOrPdf && window.printOrPdf()")
        },
        { type: "separator" },
        { role: "quit" }
      ]
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        {
          label: "Undo Last Planner Change",
          accelerator: "CmdOrCtrl+Shift+Z",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.undoLastChange && window.undoLastChange()")
        },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    {
      label: "View",
      submenu: [
        {
          label: "Toggle Dark / Light Mode",
          accelerator: "CmdOrCtrl+D",
          click: () => mainWindow && mainWindow.webContents.executeJavaScript("window.toggleDarkMode && window.toggleDarkMode()")
        },
        { type: "separator" },
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "Help",
      submenu: [
        {
          label: "About JP Trip Planner",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "JP Trip Planner",
              message: "Japan Master Trip & Budget Planner (Desktop Edition)",
              detail: "Bilingual EN ⇄ JP holiday trip planner featuring seasonal Japanese backdrops, interactive multi-island map, rail pass optimizer, hotel ledger, gourmet & transit guides, and shopping tracker."
            });
          }
        }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Persistence & Native Dialog Handlers
ipcMain.handle("load-state", async () => {
  try {
    const p = getStateFilePath();
    if (!fs.existsSync(p)) return null;
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
});

ipcMain.handle("save-state", async (_evt, stateObj) => {
  try {
    const p = getStateFilePath();
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(stateObj), "utf8");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle("export-json", async (_evt, defaultName, content) => {
  try {
    const res = await dialog.showSaveDialog(mainWindow, {
      title: "Save Japan Trip Backup (JSON)",
      defaultPath: defaultName || "Japan_Trip_Plan.json",
      filters: [{ name: "JSON Files", extensions: ["json"] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, content, "utf8");
    return { ok: true, filePath: res.filePath };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("import-json", async () => {
  try {
    const res = await dialog.showOpenDialog(mainWindow, {
      title: "Open Japan Trip Backup (JSON)",
      properties: ["openFile"],
      filters: [{ name: "JSON Files", extensions: ["json"] }]
    });
    if (res.canceled || !res.filePaths || !res.filePaths[0]) return { ok: false, canceled: true };
    const content = fs.readFileSync(res.filePaths[0], "utf8");
    return { ok: true, content, filePath: res.filePaths[0] };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("export-preset", async (_evt, defaultName, content) => {
  try {
    const res = await dialog.showSaveDialog(mainWindow, {
      title: "Share / Export Trip Preset (for JP Trip Planner)",
      defaultPath: defaultName || "Japan_Trip_Preset.jptrip.json",
      filters: [
        { name: "JP Trip Preset (*.jptrip.json)", extensions: ["jptrip.json", "json"] },
        { name: "All JSON Files", extensions: ["json"] }
      ]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, content, "utf8");
    return { ok: true, filePath: res.filePath };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("import-preset", async () => {
  try {
    const res = await dialog.showOpenDialog(mainWindow, {
      title: "Import Shared Trip Preset or Backup",
      properties: ["openFile"],
      filters: [
        { name: "JP Trip Preset & JSON", extensions: ["jptrip.json", "json"] }
      ]
    });
    if (res.canceled || !res.filePaths || !res.filePaths[0]) return { ok: false, canceled: true };
    const content = fs.readFileSync(res.filePaths[0], "utf8");
    return { ok: true, content, filePath: res.filePaths[0] };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("export-xlsx", async (_evt, defaultName, base64Data) => {
  try {
    const res = await dialog.showSaveDialog(mainWindow, {
      title: "Export Trip Workbook (Excel .xlsx)",
      defaultPath: defaultName || "Japan_Trip_Plan.xlsx",
      filters: [{ name: "Excel Workbook (*.xlsx)", extensions: ["xlsx"] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, Buffer.from(base64Data, "base64"));
    return { ok: true, filePath: res.filePath };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("export-csv", async (_evt, defaultName, content) => {
  try {
    const res = await dialog.showSaveDialog(mainWindow, {
      title: "Export Trip Budget CSV",
      defaultPath: defaultName || "Japan_Trip_Budget.csv",
      filters: [{ name: "CSV Spreadsheet", extensions: ["csv"] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    fs.writeFileSync(res.filePath, content, "utf8");
    return { ok: true, filePath: res.filePath };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

ipcMain.handle("print-pdf", async () => {
  try {
    if (!mainWindow) return { ok: false, error: "Window unavailable" };
    const res = await dialog.showSaveDialog(mainWindow, {
      title: "Export Itinerary & Budget as PDF",
      defaultPath: "Japan_Trip_Plan.pdf",
      filters: [{ name: "PDF Document", extensions: ["pdf"] }]
    });
    if (res.canceled || !res.filePath) return { ok: false, canceled: true };
    const pdfBuf = await mainWindow.webContents.printToPDF({
      printBackground: true,
      landscape: false,
      margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 }
    });
    fs.writeFileSync(res.filePath, pdfBuf);
    return { ok: true, filePath: res.filePath };
  } catch (err) {
    return { ok: false, error: err && err.message ? err.message : String(err) };
  }
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
