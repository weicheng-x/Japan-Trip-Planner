const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("jpDesktopAPI", {
  loadState: () => ipcRenderer.invoke("load-state"),
  saveState: (stateObj) => ipcRenderer.invoke("save-state", stateObj),
  exportJson: (defaultName, content) => ipcRenderer.invoke("export-json", defaultName, content),
  importJson: () => ipcRenderer.invoke("import-json"),
  exportPreset: (defaultName, content) => ipcRenderer.invoke("export-preset", defaultName, content),
  importPreset: () => ipcRenderer.invoke("import-preset"),
  exportXlsx: (defaultName, base64) => ipcRenderer.invoke("export-xlsx", defaultName, base64),
  exportCsv: (defaultName, content) => ipcRenderer.invoke("export-csv", defaultName, content),
  printToPdf: () => ipcRenderer.invoke("print-pdf")
});
