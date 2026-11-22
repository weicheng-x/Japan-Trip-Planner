// Bundles src/ into a single standalone portable HTML file at dist-web/JP_Trip_Planner.html
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const outDir = path.join(rootDir, "dist-web");
const outFile = path.join(outDir, "JP_Trip_Planner.html");

fs.mkdirSync(outDir, { recursive: true });

let html = fs.readFileSync(path.join(srcDir, "index.html"), "utf8");

// Inline CSS files
const themesCss = fs.readFileSync(path.join(srcDir, "styles", "themes.css"), "utf8");
const baseCss = fs.readFileSync(path.join(srcDir, "styles", "base.css"), "utf8");
html = html.replace(
  /<link rel="stylesheet" href="styles\/themes\.css">\s*<link rel="stylesheet" href="styles\/base\.css">/,
  `<style>\n${themesCss}\n\n${baseCss}\n</style>`
);

// Build base64 data URI map for the 4 seasonal hero backdrops
const assetMap = {
  sakura: "hero-spring.jpg",
  summer: "hero-summer.jpg",
  autumn: "hero-autumn.jpg",
  winter: "hero-winter.jpg"
};
const embedded = {};
for (const [k, fname] of Object.entries(assetMap)) {
  const buf = fs.readFileSync(path.join(srcDir, "assets", fname));
  embedded[k] = "data:image/jpeg;base64," + buf.toString("base64");
}
const assetScript = `window.EMBEDDED_HERO_ASSETS = ${JSON.stringify(embedded)};\n`;

// Set initial <img> src to autumn data URI so zero broken image flash occurs offline
html = html.replace('src="assets/hero-autumn.jpg"', `src="${embedded.autumn}"`);

// Collect & inline all local <script src="..."> blocks in order
const scriptTags = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)];
let bundledJs = assetScript;
for (const m of scriptTags) {
  const relPath = m[1];
  const fullPath = path.join(srcDir, relPath);
  const code = fs.readFileSync(fullPath, "utf8");
  bundledJs += `\n// === ${relPath} ===\n${code}\n`;
}

// Replace the block of external script tags with one single inline <script>
const firstTag = scriptTags[0][0];
const lastTag = scriptTags[scriptTags.length - 1][0];
const startIdx = html.indexOf(firstTag);
const endIdx = html.indexOf(lastTag) + lastTag.length;
// Escape </script> inside JS string literals if any exist
const safeJs = bundledJs.replace(/<\/script>/gi, "<\\/script>");
html = html.slice(0, startIdx) + `<script>\n${safeJs}\n</script>` + html.slice(endIdx);

fs.writeFileSync(outFile, html, "utf8");
const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
console.log(`Built standalone portable HTML: ${outFile} (${sizeKb} KB)`);
