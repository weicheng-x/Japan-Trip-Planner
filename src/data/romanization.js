// Forgiving Japanese Romanization, Kunrei/Hepburn & Long-Vowel Equivalence Engine

(function() {
  const ROMAJI_NORM_CACHE = new Map();
  const REGEX_CACHE = new Map();

  window.stripFalsePositivePlaces = function(rawText) {
    return String(rawText || "")
      .replace(/\bhotel\s+nikko\b/gi, " ")
      .replace(/\bsaga[\s-]*arashiyama\b/gi, " arashiyama ")
      .replace(/\bsaga\s+scenic\s+railway\b/gi, " arashiyama ");
  };

  window.normalizeJapanRomaji = function(str) {
    const raw = String(str || "");
    if (!raw) return "";
    if (ROMAJI_NORM_CACHE.has(raw)) return ROMAJI_NORM_CACHE.get(raw);

    let s = raw
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // Treat hyphens, underscores, apostrophes, slashes and brackets as spaces
    s = s.replace(/[-_'’`./\\()（）【】\[\],:;!?]+/g, " ").replace(/\s+/g, " ").trim();
    if (!s) {
      if (ROMAJI_NORM_CACHE.size < 4000) ROMAJI_NORM_CACHE.set(raw, "");
      return "";
    }

    // Long vowels: ou/oo/oh -> o, uu -> u, aa -> a, ii -> i, ee -> e
    s = s
      .replace(/ou|oo|oh/g, "o")
      .replace(/uu/g, "u")
      .replace(/aa/g, "a")
      .replace(/ii/g, "i")
      .replace(/ee/g, "e");

    // Kunrei-shiki / Nihon-shiki vs Hepburn palatal variants
    s = s
      .replace(/sya/g, "sha").replace(/syu/g, "shu").replace(/syo/g, "sho")
      .replace(/tya/g, "cha").replace(/tyu/g, "chu").replace(/tyo/g, "cho")
      .replace(/zya/g, "ja").replace(/zyu/g, "ju").replace(/zyo/g, "jo")
      .replace(/jya/g, "ja").replace(/jyu/g, "ju").replace(/jyo/g, "jo");

    // Canonical Hepburn <-> Kunrei-shiki syllable mapping
    s = s
      .replace(/dzu/g, "du")
      .replace(/zu/g, "du")
      .replace(/shi/g, "si")
      .replace(/chi/g, "ti")
      .replace(/tsu/g, "tu")
      .replace(/fu/g, "hu")
      .replace(/ji/g, "zi");

    // Syllabic n/m before bilabials m/b/p (Gunma/Gumma, Namba/Nanba, Tenmangu/Temmangu)
    s = s.replace(/m([bmp])/g, "n$1");

    // Forgiving double-consonant reduction on multi-syllable words (>= 5 chars)
    s = s.split(" ").map(tok => {
      if (tok.length >= 5) {
        return tok
          .replace(/tch/g, "ch")
          .replace(/kk/g, "k")
          .replace(/pp/g, "p")
          .replace(/tt/g, "t")
          .replace(/ss/g, "s")
          .replace(/cc/g, "c");
      }
      return tok;
    }).join(" ").replace(/\s+/g, " ").trim();

    if (ROMAJI_NORM_CACHE.size < 4000) ROMAJI_NORM_CACHE.set(raw, s);
    return s;
  };

  function getCompiledNormRegex(normKey) {
    if (REGEX_CACHE.has(normKey)) return REGEX_CACHE.get(normKey);
    const parts = normKey.split(" ").filter(Boolean).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const body = parts.join("\\s*");
    const rx = new RegExp("(^|[^a-z0-9])" + body + "(?=$|[^a-z0-9])");
    REGEX_CACHE.set(normKey, rx);
    return rx;
  }

  window.compileGazetteerEntryMatcher = function(keys) {
    const cjkSet = new Set();
    const asciiBodySet = new Set();
    (keys || []).forEach(keyRaw => {
      const keyStr = String(keyRaw || "").trim();
      if (!keyStr) return;
      if (/[^\x00-\x7F]/.test(keyStr)) {
        cjkSet.add(keyStr.toLowerCase());
        return;
      }
      const normKey = window.normalizeJapanRomaji(keyStr);
      if (!normKey) return;
      const body = normKey.split(" ").filter(Boolean).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
      if (body) asciiBodySet.add(body);
    });
    const asciiBodies = Array.from(asciiBodySet).sort((a, b) => b.length - a.length);
    return {
      cjkKeys: Array.from(cjkSet),
      asciiRx: asciiBodies.length > 0
        ? new RegExp("(?:^|[^a-z0-9])(?:" + asciiBodies.join("|") + ")(?=$|[^a-z0-9])")
        : null
    };
  };

  window.prepareGazetteerText = function(rawText) {
    const cleaned = window.stripFalsePositivePlaces(rawText);
    const rawLower = cleaned.toLowerCase();
    const normText = window.normalizeJapanRomaji(cleaned);
    return {
      rawLower,
      normText,
      hasNonAscii: /[^\x00-\x7F]/.test(rawLower),
      hasAscii: /[a-z0-9]/.test(normText)
    };
  };

  window.gazetteerKeyMatches = function(textOrPrepared, keyRaw) {
    if (!textOrPrepared || !keyRaw) return false;
    const keyStr = String(keyRaw).trim();
    if (!keyStr) return false;

    const prepared = (typeof textOrPrepared === "object" && "rawLower" in textOrPrepared)
      ? textOrPrepared
      : window.prepareGazetteerText(textOrPrepared);

    if (/[^\x00-\x7F]/.test(keyStr)) {
      return prepared.rawLower.includes(keyStr.toLowerCase());
    }

    const normKey = window.normalizeJapanRomaji(keyStr);
    if (!normKey) return false;
    const rx = getCompiledNormRegex(normKey);
    return rx.test(prepared.normText);
  };
})();
