// Main App Controller & Initialization

window.renderAll = function() {
  window.renderStaticChrome();
  window.renderKpis();
  window.renderOverviewTab();
  window.renderItineraryCards();
  window.renderHotelsTab();
  window.renderShoppingTab();
  window.renderBudgetTable();
  window.renderRailTable();
  window.renderGourmet();
  window.renderAccessTable();
  window.renderGuidesTable();
};

(async function bootPlanner() {
  // Respect OS reduced-motion preference on brand new sessions
  try {
    if (!localStorage.getItem(window.STORAGE_KEY) && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.animationsPaused = true;
    }
  } catch (e) {
    console.warn("[JP Trip Planner] Reduced-motion check failed:", e);
  }

  let hydratedFromDesktop = false;
  if (window.jpDesktopAPI && typeof window.jpDesktopAPI.loadState === "function") {
    try {
      const diskState = await window.jpDesktopAPI.loadState();
      if (diskState && window.applyStateFromParsed(diskState)) {
        hydratedFromDesktop = true;
      }
    } catch (e) {
      console.warn("[JP Trip Planner] Desktop state load failed:", e);
    }
  }

  if (!hydratedFromDesktop) {
    window.loadStateSync();
  }

  if (state.activeTab) {
    window.switchTab(state.activeTab, null);
  }

  window.ensureAllDaysHaveTimeSlots();
  window.renderAll();
})();
