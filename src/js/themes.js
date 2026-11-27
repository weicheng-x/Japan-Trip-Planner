// 4-Season Theme Mapper, Vivid Scenic Hero Assets & Realistic Canvas Particle Engine

(function() {
  let _seasonAnimFrame = null;
  let _lastAnimTs = 0;
  let _activeAnimSeason = null;
  let _heroParticles = [];
  let _bodyParticles = [];
  let _fireworkRockets = [];
  let _fireworkSparks = [];
  let _salvoCooldown = 90;
  const MAX_FIREWORK_SPARKS = 900;

  const SAKURA_PALETTES = [
    { base: "#FFE8F0", mid: "#FFB7CE", tip: "#FF8DB2", edge: "rgba(190, 48, 102, 0.52)", vein: "rgba(219, 39, 119, 0.35)" },
    { base: "#FFF5F8", mid: "#FFD1DF", tip: "#FFAAC5", edge: "rgba(199, 54, 110, 0.48)", vein: "rgba(236, 72, 153, 0.30)" },
    { base: "#FFE0EC", mid: "#FFA8C4", tip: "#F472B6", edge: "rgba(175, 34, 92, 0.55)", vein: "rgba(219, 39, 119, 0.35)" }
  ];
  const AUTUMN_PALETTES = [
    { fill: "#D9261C", fillDark: "#8F140E", vein: "#FCA5A5", stem: "#7C2D12", type: "momiji" },
    { fill: "#E03C1F", fillDark: "#991B1B", vein: "#FDBA74", stem: "#7C2D12", type: "momiji" },
    { fill: "#EA580C", fillDark: "#9A3412", vein: "#FDE047", stem: "#78350F", type: "momiji" },
    { fill: "#C83E2B", fillDark: "#7F1D1D", vein: "#FECACA", stem: "#7C2D12", type: "momiji" },
    { fill: "#EAB308", fillDark: "#B45309", vein: "#FEF9C3", stem: "#854D0E", type: "ginkgo" }
  ];
  const SUMMER_EMBER_COLORS = ["#FDE047", "#FB7185", "#38BDF8", "#FBBF24"];
  const FIREWORK_PALETTES = [
    { main: "#FDE047", sub: "#FB923C", core: "#FFFFFF", kind: "kiku" },
    { main: "#FB7185", sub: "#F43F5E", core: "#FFE4E6", kind: "botan" },
    { main: "#38BDF8", sub: "#818CF8", core: "#E0F2FE", kind: "botan" },
    { main: "#FBBF24", sub: "#F59E0B", core: "#FEF9C3", kind: "kamuro" },
    { main: "#34D399", sub: "#FDE047", core: "#ECFDF5", kind: "kiku" },
    { main: "#C084FC", sub: "#F472B6", core: "#FAE8FF", kind: "star" }
  ];
  const GINKGO_VEINS = [-6.5, -3.2, 3.2, 6.5];
  const MOMIJI_POINTS = [
    [0, 4.2], [-2.1, 4.8], [-8.2, 6.4], [-5.4, 2.8], [-10.2, 0.8], [-13.4, -2.2],
    [-9.6, -3.4], [-5.2, -3.0], [-8.8, -8.2], [-9.8, -11.8], [-6.2, -9.4], [-2.6, -5.8],
    [-2.2, -11.2], [0, -15.4], [2.2, -11.2], [2.6, -5.8], [6.2, -9.4], [9.8, -11.8],
    [8.8, -8.2], [5.2, -3.0], [9.6, -3.4], [13.4, -2.2], [10.2, 0.8], [5.4, 2.8],
    [8.2, 6.4], [2.1, 4.8]
  ];
  const MOMIJI_VEINS = [[0, -13.2], [-8.2, -10.0], [8.2, -10.0], [-11.2, -1.8], [11.2, -1.8], [-6.6, 5.4], [6.6, 5.4]];
  const SNOW_BRANCH_FRACS = [0.45, 0.72];

  window.SEASON_ASSETS = {
    sakura: "assets/hero-spring.jpg",
    summer: "assets/hero-summer.jpg",
    autumn: "assets/hero-autumn.jpg",
    winter: "assets/hero-winter.jpg"
  };

  window.getSeasonInfoFromDate = function(dateStr) {
    const clean = String(dateStr || "").trim();
    let month = 3; // Default to Spring Sakura when no start date is entered
    if (clean && clean.includes("-")) {
      const parsedM = parseInt(clean.split("-")[1], 10);
      if (!isNaN(parsedM) && parsedM >= 1 && parsedM <= 12) month = parsedM;
    }

    if (month >= 3 && month <= 5) {
      return {
        key: "sakura",
        heroIcon: "🌸",
        titlePrefixEn: "Spring",
        titlePrefixJa: "春",
        asset: (window.EMBEDDED_HERO_ASSETS && window.EMBEDDED_HERO_ASSETS.sakura) || window.SEASON_ASSETS.sakura
      };
    } else if (month >= 6 && month <= 8) {
      return {
        key: "summer",
        heroIcon: "🎆",
        titlePrefixEn: "Summer",
        titlePrefixJa: "夏",
        asset: (window.EMBEDDED_HERO_ASSETS && window.EMBEDDED_HERO_ASSETS.summer) || window.SEASON_ASSETS.summer
      };
    } else if (month >= 9 && month <= 11) {
      return {
        key: "autumn",
        heroIcon: "🍁",
        titlePrefixEn: "Autumn",
        titlePrefixJa: "秋",
        asset: (window.EMBEDDED_HERO_ASSETS && window.EMBEDDED_HERO_ASSETS.autumn) || window.SEASON_ASSETS.autumn
      };
    } else {
      return {
        key: "winter",
        heroIcon: "❄️",
        titlePrefixEn: "Winter",
        titlePrefixJa: "冬",
        asset: (window.EMBEDDED_HERO_ASSETS && window.EMBEDDED_HERO_ASSETS.winter) || window.SEASON_ASSETS.winter
      };
    }
  };

  function createSeasonalParticle(seasonKey, w, h, randomY) {
    if (seasonKey === "sakura") {
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -22,
        size: 7.2 + Math.random() * 6.4,
        vx: 0.45 + Math.random() * 0.78,
        vy: 0.65 + Math.random() * 0.85,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.028,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.022 + Math.random() * 0.030,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.45 + Math.random() * 0.60,
        pal: SAKURA_PALETTES[Math.floor(Math.random() * SAKURA_PALETTES.length)],
        alpha: 0.84 + Math.random() * 0.14
      };
    } else if (seasonKey === "autumn") {
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -28,
        size: 11.5 + Math.random() * 8.0,
        vx: 0.42 + Math.random() * 0.68,
        vy: 0.75 + Math.random() * 0.95,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.024,
        flip: Math.random() * Math.PI * 2,
        flipSpeed: 0.018 + Math.random() * 0.025,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.55 + Math.random() * 0.70,
        pal: AUTUMN_PALETTES[Math.floor(Math.random() * AUTUMN_PALETTES.length)],
        alpha: 0.88 + Math.random() * 0.12
      };
    } else if (seasonKey === "summer") {
      // Gentle night lantern sparkles for page body
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.6 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.22 + Math.random() * 0.35),
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.2,
        color: SUMMER_EMBER_COLORS[Math.floor(Math.random() * SUMMER_EMBER_COLORS.length)],
        alpha: 0.28 + Math.random() * 0.32
      };
    } else {
      // Winter crystalline snowflakes & soft snow flurries
      const isCrystal = Math.random() < 0.46;
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : -18,
        size: isCrystal ? (5.5 + Math.random() * 5.0) : (2.2 + Math.random() * 2.8),
        vx: (Math.random() - 0.38) * 0.52,
        vy: isCrystal ? (0.62 + Math.random() * 0.80) : (0.85 + Math.random() * 1.15),
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.018,
        swayPhase: Math.random() * Math.PI * 2,
        swayAmp: 0.32 + Math.random() * 0.44,
        isCrystal,
        alpha: isCrystal ? (0.82 + Math.random() * 0.18) : (0.55 + Math.random() * 0.35)
      };
    }
  }

  function createFireworkRocket(w, h, delayFrames, xOverride) {
    const pal = FIREWORK_PALETTES[Math.floor(Math.random() * FIREWORK_PALETTES.length)];
    const startX = xOverride !== undefined ? xOverride : w * (0.08 + Math.random() * 0.84);
    return {
      x: startX,
      y: h * 0.78, // Launch from across the river bank horizon
      targetY: h * (0.12 + Math.random() * 0.34),
      vx: (Math.random() - 0.5) * 0.40,
      vy: -(4.2 + Math.random() * 1.9),
      pal,
      trail: [],
      delay: delayFrames || 0
    };
  }

  // Authentic Notched Sakura Cherry Blossom Petal (桜の花びら)
  function drawRealisticSakuraPetal(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    const scaleY = 0.36 + 0.64 * Math.abs(Math.cos(p.flip));
    ctx.scale(1, scaleY);
    ctx.globalAlpha = p.alpha;

    const s = p.size;
    const grad = ctx.createLinearGradient(0, s * 0.9, 0, -s);
    grad.addColorStop(0, p.pal.base);
    grad.addColorStop(0.55, p.pal.mid);
    grad.addColorStop(1, p.pal.tip);

    ctx.fillStyle = grad;
    ctx.strokeStyle = p.pal.edge;
    ctx.lineWidth = 0.85;
    ctx.lineJoin = "round";

    // Tapered base claw -> rounded outer lobes -> signature V-notch at apex
    ctx.beginPath();
    ctx.moveTo(0, s * 0.92);
    ctx.bezierCurveTo(-s * 0.62, s * 0.52, -s * 0.82, -s * 0.35, -s * 0.36, -s * 0.92);
    ctx.quadraticCurveTo(-s * 0.14, -s * 0.98, 0, -s * 0.58); // Left petal lobe into V-notch
    ctx.quadraticCurveTo(s * 0.14, -s * 0.98, s * 0.36, -s * 0.92); // Right petal lobe
    ctx.bezierCurveTo(s * 0.82, -s * 0.35, s * 0.62, s * 0.52, 0, s * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Fine central blossom vein
    ctx.strokeStyle = p.pal.vein;
    ctx.lineWidth = 0.55;
    ctx.beginPath();
    ctx.moveTo(0, s * 0.72);
    ctx.lineTo(0, -s * 0.32);
    ctx.stroke();

    ctx.restore();
  }

  // Authentic 7-Lobed Iroha Momiji Maple Leaf & Cleft Ginkgo Leaf
  function drawRealisticAutumnLeaf(ctx, p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    const scaleX = 0.64 + 0.36 * Math.cos(p.flip);
    const scaleY = 0.78 + 0.22 * Math.sin(p.flip * 0.7);
    ctx.scale(scaleX, scaleY);
    ctx.globalAlpha = p.alpha || 0.92;
    const s = (p.size || 14) / 14;
    ctx.scale(s, s);
    const pal = p.pal;

    if (pal.type === "ginkgo") {
      const grad = ctx.createLinearGradient(0, -12, 0, 10);
      grad.addColorStop(0, "#FDE047");
      grad.addColorStop(0.75, pal.fill);
      grad.addColorStop(1, pal.fillDark || "#B45309");
      ctx.fillStyle = grad;
      ctx.strokeStyle = pal.fillDark || "#92400E";
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.bezierCurveTo(-5, 4, -12, -1, -11, -7);
      ctx.quadraticCurveTo(-6, -12, -1.2, -9.5);
      ctx.lineTo(0, -6.2);
      ctx.lineTo(1.2, -9.5);
      ctx.quadraticCurveTo(6, -12, 11, -7);
      ctx.bezierCurveTo(12, -1, 5, 4, 0, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = pal.vein;
      ctx.lineWidth = 0.55;
      GINKGO_VEINS.forEach(tx => {
        ctx.beginPath();
        ctx.moveTo(0, 5.2);
        ctx.quadraticCurveTo(tx * 0.5, -1, tx, -7.8);
        ctx.stroke();
      });
      ctx.strokeStyle = pal.stem;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(0, 5.8);
      ctx.quadraticCurveTo(0.8, 9.5, 2.0, 12.2);
      ctx.stroke();
    } else {
      const grad = ctx.createRadialGradient(0, 1, 1, 0, -2, 15);
      grad.addColorStop(0, pal.fillDark);
      grad.addColorStop(0.55, pal.fill);
      grad.addColorStop(1, "#F97316");
      ctx.fillStyle = grad;
      ctx.strokeStyle = pal.fillDark;
      ctx.lineWidth = 0.65;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(MOMIJI_POINTS[0][0], MOMIJI_POINTS[0][1]);
      for (let i = 1; i < MOMIJI_POINTS.length; i++) ctx.lineTo(MOMIJI_POINTS[i][0], MOMIJI_POINTS[i][1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = pal.vein;
      ctx.lineWidth = 0.65;
      ctx.lineCap = "round";
      MOMIJI_VEINS.forEach(vt => {
        ctx.beginPath();
        ctx.moveTo(0, 3.6);
        ctx.lineTo(vt[0], vt[1]);
        ctx.stroke();
      });
      ctx.strokeStyle = pal.stem;
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      ctx.moveTo(0, 3.8);
      ctx.quadraticCurveTo(0.9, 8.2, 2.4, 11.8);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Authentic 6-Pointed Dendritic Crystalline Snowflakes (雪の結晶)
  function drawRealisticSnowflake(ctx, p, isDark) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.globalAlpha = p.alpha;

    if (p.isCrystal) {
      ctx.rotate(p.angle);
      const r = p.size;
      ctx.strokeStyle = isDark ? "rgba(241, 245, 249, 0.94)" : "rgba(30, 82, 138, 0.68)";
      ctx.lineWidth = Math.max(0.9, r * 0.13);
      ctx.lineCap = "round";

      for (let k = 0; k < 6; k++) {
        ctx.save();
        ctx.rotate((Math.PI / 3) * k);
        // Main radial crystal arm
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.stroke();
        // Outer & inner dendritic side branches
        SNOW_BRANCH_FRACS.forEach(frac => {
          const yOff = -r * frac;
          const bLen = r * (frac < 0.6 ? 0.34 : 0.24);
          ctx.beginPath();
          ctx.moveTo(0, yOff);
          ctx.lineTo(-bLen * 0.68, yOff - bLen * 0.68);
          ctx.moveTo(0, yOff);
          ctx.lineTo(bLen * 0.68, yOff - bLen * 0.68);
          ctx.stroke();
        });
        ctx.restore();
      }
      // Crisp white inner crystal core
      ctx.fillStyle = isDark ? "#FFFFFF" : "rgba(224, 242, 254, 0.92)";
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1.2, r * 0.16), 0, Math.PI * 2);
      ctx.fill();
    } else {
      const r = p.size;
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.85)" : "rgba(186, 230, 253, 0.82)";
      ctx.strokeStyle = isDark ? "rgba(226, 232, 240, 0.35)" : "rgba(56, 128, 196, 0.45)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function spawnFireworkBurst(r) {
    if (_fireworkSparks.length >= MAX_FIREWORK_SPARKS) return;
    const kind = r.pal.kind;
    const outerCount = kind === "kamuro" ? 56 : 48;
    for (let k = 0; k < outerCount && _fireworkSparks.length < MAX_FIREWORK_SPARKS; k++) {
      const ang = (Math.PI * 2 * k) / outerCount + (Math.random() - 0.5) * 0.04;
      const spd = (kind === "kamuro" ? 1.8 : 2.3) + Math.random() * 1.5;
      _fireworkSparks.push({
        x: r.x, y: r.y, prevX: r.x, prevY: r.y,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        alpha: 1,
        decay: kind === "kamuro" ? (0.0085 + Math.random() * 0.004) : (0.013 + Math.random() * 0.006),
        gravity: kind === "kamuro" ? 0.052 : 0.036,
        color: k % 3 === 0 ? r.pal.sub : r.pal.main,
        size: kind === "kamuro" ? 2.2 : (1.8 + Math.random() * 1.0),
        twinkle: kind === "kamuro" || kind === "star" || Math.random() < 0.35
      });
    }
    // Inner peony pistil ring
    const innerCount = 24;
    for (let k = 0; k < innerCount && _fireworkSparks.length < MAX_FIREWORK_SPARKS; k++) {
      const ang = (Math.PI * 2 * k) / innerCount;
      const spd = 1.05 + Math.random() * 0.65;
      _fireworkSparks.push({
        x: r.x, y: r.y, prevX: r.x, prevY: r.y,
        vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd,
        alpha: 1, decay: 0.018 + Math.random() * 0.008, gravity: 0.028,
        color: r.pal.core, size: 1.6, twinkle: true
      });
    }
  }

  window.initSeasonParticles = function(seasonKey, wHero, hHero, wBody, hBody) {
    _heroParticles = [];
    _bodyParticles = [];
    _fireworkRockets = [];
    _fireworkSparks = [];
    _salvoCooldown = 80;

    if (seasonKey === "summer") {
      // Grand Hanabi Taikai: 9 staggered launches + summer night embers on body canvas
      for (let i = 0; i < 9; i++) {
        _fireworkRockets.push(createFireworkRocket(wHero, hHero, i * 11));
      }
      for (let i = 0; i < 24; i++) {
        _bodyParticles.push(createSeasonalParticle("summer", wBody, hBody, true));
      }
      return;
    }

    const countHero = seasonKey === "winter" ? 72 : 44;
    const countBody = seasonKey === "winter" ? 56 : 26;
    for (let i = 0; i < countHero; i++) _heroParticles.push(createSeasonalParticle(seasonKey, wHero, hHero, true));
    for (let i = 0; i < countBody; i++) _bodyParticles.push(createSeasonalParticle(seasonKey, wBody, hBody, true));
  };

  function stepSeasonAnimation(ts) {
    if ((state && state.animationsPaused) || (typeof document !== "undefined" && document.hidden)) {
      _seasonAnimFrame = null;
      return;
    }
    if (typeof ts === "number" && _lastAnimTs && (ts - _lastAnimTs) < 32) {
      _seasonAnimFrame = requestAnimationFrame(stepSeasonAnimation);
      return;
    }
    _lastAnimTs = typeof ts === "number" ? ts : Date.now();

    const heroCanvas = document.getElementById("heroSeasonalCanvas");
    const bodyCanvas = document.getElementById("bodySeasonalCanvas");
    if (!heroCanvas || !heroCanvas.parentElement || !bodyCanvas) return;

    const hRect = heroCanvas.parentElement.getBoundingClientRect();
    const isDark = document.body.classList.contains("dark-mode");
    const heroVisible = hRect.bottom > 0 && hRect.width > 0 && hRect.height > 0;
    if (heroVisible) {
      const targetW = Math.max(320, Math.floor(hRect.width));
      const targetH = Math.max(240, Math.floor(hRect.height));
      if (heroCanvas.width !== targetW || heroCanvas.height !== targetH) {
        heroCanvas.width = targetW;
        heroCanvas.height = targetH;
      }
    }
    if (bodyCanvas.width !== window.innerWidth || bodyCanvas.height !== window.innerHeight) {
      bodyCanvas.width = window.innerWidth;
      bodyCanvas.height = window.innerHeight;
    }

    const hCtx = heroVisible ? heroCanvas.getContext("2d") : null;
    const bCtx = bodyCanvas.getContext("2d");
    const sKey = _activeAnimSeason || "sakura";

    if (sKey === "summer") {
      if (heroVisible && hCtx) {
        // Trail fade using destination-out preserves vivid river backdrop beneath!
        hCtx.save();
        hCtx.globalCompositeOperation = "destination-out";
        hCtx.fillStyle = "rgba(0, 0, 0, 0.18)";
        hCtx.fillRect(0, 0, heroCanvas.width, heroCanvas.height);
        hCtx.restore();

        // Periodic synchronized 3-shell Starmine Salvo across the river
        _salvoCooldown--;
        if (_salvoCooldown <= 0 && _fireworkRockets.length < 14) {
          const baseX = heroCanvas.width * (0.22 + Math.random() * 0.56);
          [-95, 0, 95].forEach((dx, idx) => {
            _fireworkRockets.push(createFireworkRocket(heroCanvas.width, heroCanvas.height, idx * 4, Math.max(40, Math.min(heroCanvas.width - 40, baseX + dx))));
          });
          _salvoCooldown = 140 + Math.floor(Math.random() * 90);
        }

        for (let i = _fireworkRockets.length - 1; i >= 0; i--) {
          const r = _fireworkRockets[i];
          if (r.delay > 0) { r.delay--; continue; }
          r.trail.push({ x: r.x, y: r.y });
          if (r.trail.length > 10) r.trail.shift();
          r.x += r.vx;
          r.y += r.vy;
          r.vy *= 0.988;

          for (let t = 0; t < r.trail.length; t++) {
            const pt = r.trail[t];
            hCtx.save();
            hCtx.fillStyle = "#FEF08A";
            hCtx.globalAlpha = ((t + 1) / r.trail.length) * 0.9;
            hCtx.beginPath();
            hCtx.arc(pt.x, pt.y, 1.8, 0, Math.PI * 2);
            hCtx.fill();
            hCtx.restore();
          }

          if (r.y <= r.targetY || Math.abs(r.vy) < 1.2) {
            spawnFireworkBurst(r);
            if (i < 9) {
              _fireworkRockets[i] = createFireworkRocket(heroCanvas.width, heroCanvas.height, 8 + Math.floor(Math.random() * 24));
            } else {
              _fireworkRockets.splice(i, 1);
            }
          }
        }

        const waterTopY = heroCanvas.height * 0.74;
        for (let j = _fireworkSparks.length - 1; j >= 0; j--) {
          const sp = _fireworkSparks[j];
          sp.prevX = sp.x;
          sp.prevY = sp.y;
          sp.x += sp.vx;
          sp.y += sp.vy;
          sp.vx *= 0.968;
          sp.vy = sp.vy * 0.968 + (sp.gravity || 0.04);
          sp.alpha -= sp.decay;
          if (sp.alpha <= 0) {
            _fireworkSparks.splice(j, 1);
            continue;
          }
          const flicker = sp.twinkle && sp.alpha < 0.55 ? (Math.random() > 0.30 ? 1 : 0.25) : 1;
          hCtx.save();
          hCtx.globalAlpha = sp.alpha * flicker;
          hCtx.strokeStyle = sp.color;
          hCtx.lineWidth = sp.size;
          hCtx.lineCap = "round";
          hCtx.beginPath();
          hCtx.moveTo(sp.prevX, sp.prevY);
          hCtx.lineTo(sp.x, sp.y);
          hCtx.stroke();

          // Shimmering river reflection in bottom water zone
          if (sp.y < waterTopY && sp.alpha > 0.28 && (j % 4 === 0)) {
            const reflY = waterTopY + (waterTopY - sp.y) * 0.22 + (Math.random() - 0.5) * 4;
            if (reflY < heroCanvas.height - 2) {
              hCtx.globalAlpha = sp.alpha * 0.26 * flicker;
              hCtx.lineWidth = 1.4;
              hCtx.beginPath();
              hCtx.moveTo(sp.x - 4, reflY);
              hCtx.lineTo(sp.x + 4, reflY);
              hCtx.stroke();
            }
          }
          hCtx.restore();
        }
      }

      // Gentle summer embers on body canvas
      bCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);
      _bodyParticles.forEach(p => {
        p.swayPhase += 0.02;
        p.x += p.vx + Math.sin(p.swayPhase) * 0.2;
        p.y += p.vy;
        if (p.y < -12) { p.y = bodyCanvas.height + 10; p.x = Math.random() * bodyCanvas.width; }
        bCtx.save();
        bCtx.globalAlpha = p.alpha;
        bCtx.fillStyle = p.color;
        bCtx.beginPath();
        bCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.restore();
      });
    } else {
      if (heroVisible && hCtx) hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      bCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);

      const updateAndDrawList = (list, ctx, w, h) => {
        list.forEach(p => {
          p.swayPhase += 0.022;
          p.x += p.vx + Math.sin(p.swayPhase) * (p.swayAmp || 0.5);
          p.y += p.vy;
          if (p.angle !== undefined) p.angle += p.spin || 0;
          if (p.flip !== undefined) p.flip += p.flipSpeed || 0.025;
          if (p.y > h + 24) { p.y = -20; p.x = Math.random() * w; }
          if (p.x > w + 24) p.x = -18;
          if (p.x < -24) p.x = w + 18;

          if (sKey === "sakura") drawRealisticSakuraPetal(ctx, p);
          else if (sKey === "autumn") drawRealisticAutumnLeaf(ctx, p);
          else drawRealisticSnowflake(ctx, p, isDark);
        });
      };

      if (heroVisible && hCtx) updateAndDrawList(_heroParticles, hCtx, heroCanvas.width, heroCanvas.height);
      updateAndDrawList(_bodyParticles, bCtx, bodyCanvas.width, bodyCanvas.height);
    }

    _seasonAnimFrame = requestAnimationFrame(stepSeasonAnimation);
  }

  if (typeof document !== "undefined" && typeof document.addEventListener === "function") {
    document.addEventListener("visibilitychange", function() {
      if (document.hidden) {
        if (_seasonAnimFrame) {
          cancelAnimationFrame(_seasonAnimFrame);
          _seasonAnimFrame = null;
        }
      } else if (state && !state.animationsPaused && !_seasonAnimFrame) {
        _lastAnimTs = 0;
        _seasonAnimFrame = requestAnimationFrame(stepSeasonAnimation);
      }
    });
  }

  window.toggleSeasonalAnimation = function() {
    state.animationsPaused = !state.animationsPaused;
    window.saveState();
    const heroCanvas = document.getElementById("heroSeasonalCanvas");
    const bodyCanvas = document.getElementById("bodySeasonalCanvas");
    if (state.animationsPaused) {
      if (_seasonAnimFrame) { cancelAnimationFrame(_seasonAnimFrame); _seasonAnimFrame = null; }
      if (heroCanvas) heroCanvas.getContext("2d").clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      if (bodyCanvas) bodyCanvas.getContext("2d").clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);
    } else {
      window.applySeasonThemeFromStartDate();
    }
    window.renderStaticChrome();
  };

  window.applySeasonThemeFromStartDate = function() {
    const startInp = document.getElementById("tripStartDate");
    const rawDate = (state && state.startDate !== undefined) ? state.startDate : (startInp ? startInp.value : "2026-10-21");
    const sInfo = window.getSeasonInfoFromDate(rawDate);
    document.body.setAttribute("data-season", sInfo.key);

    const imgEl = document.getElementById("heroSceneImg");
    if (imgEl && imgEl.getAttribute("data-season-src") !== sInfo.key) {
      imgEl.src = sInfo.asset;
      imgEl.setAttribute("data-season-src", sInfo.key);
    }

    // Respect OS prefers-reduced-motion on first load if user hasn't explicitly toggled
    if (state && state.animationsPaused) {
      if (_seasonAnimFrame) { cancelAnimationFrame(_seasonAnimFrame); _seasonAnimFrame = null; }
      return;
    }

    if (_activeAnimSeason !== sInfo.key) {
      _activeAnimSeason = sInfo.key;
      const heroCanvas = document.getElementById("heroSeasonalCanvas");
      const wH = heroCanvas ? (heroCanvas.width || 1200) : 1200;
      const hH = heroCanvas ? (heroCanvas.height || 320) : 320;
      window.initSeasonParticles(sInfo.key, wH, hH, window.innerWidth || 1280, window.innerHeight || 800);
    }
    if (!_seasonAnimFrame) {
      _seasonAnimFrame = requestAnimationFrame(stepSeasonAnimation);
    }
  };
})();
