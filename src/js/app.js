// Main App Controller, Active-Tab Dirty Rendering Dispatcher & Boot Initialization

(function() {
  const TAB_RENDERERS = {
    overview: () => window.renderOverviewTab && window.renderOverviewTab(),
    itinerary: () => window.renderItineraryCards && window.renderItineraryCards(),
    hotels: () => window.renderHotelsTab && window.renderHotelsTab(),
    budget: () => window.renderBudgetTable && window.renderBudgetTable(),
    rail: () => window.renderRailTable && window.renderRailTable(),
    gourmet: () => window.renderGourmet && window.renderGourmet(),
    access: () => window.renderAccessTable && window.renderAccessTable(),
    guides: () => window.renderGuidesTable && window.renderGuidesTable(),
    shopping: () => window.renderShoppingTab && window.renderShoppingTab()
  };

  window._dirtyTabs = new Set();

  window.renderTabById = function(tabId) {
    const fn = TAB_RENDERERS[tabId];
    if (fn) {
      window._dirtyTabs.delete(tabId);
      fn();
    }
  };

  window.flushDirtyTab = function(tabId) {
    if (window._dirtyTabs && window._dirtyTabs.has(tabId)) {
      window.renderTabById(tabId);
    }
  };

  // Fast active-tab render: updates chrome, KPIs & current visible tab now; defers hidden tabs until clicked
  window.renderActiveViews = function(alsoTabs) {
    window.renderStaticChrome();
    window.renderKpis();
    const curTab = (window.state && state.activeTab) || "overview";
    const eagerSet = new Set([curTab].concat(Array.isArray(alsoTabs) ? alsoTabs : []));
    Object.keys(TAB_RENDERERS).forEach(t => {
      if (eagerSet.has(t)) {
        window.renderTabById(t);
      } else {
        window._dirtyTabs.add(t);
      }
    });
  };

  window.renderAll = function() {
    if (window._dirtyTabs) window._dirtyTabs.clear();
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
})();

(async function bootPlanner() {
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
