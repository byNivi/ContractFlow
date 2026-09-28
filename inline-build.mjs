import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = "dist";
const assets = join(dist, "assets");
let html = readFileSync(join(dist, "index.html"), "utf8");

const jsFile = readdirSync(assets).find((f) => f.endsWith(".js"));
const cssFile = readdirSync(assets).find((f) => f.endsWith(".css"));
let js = readFileSync(join(assets, jsFile), "utf8");
const css = readFileSync(join(assets, cssFile), "utf8");

// Escape any literal closing-script sequence so it can't terminate the inline tag.
js = js.replace(/<\/script>/gi, "<\\/script>");

// IMPORTANT: use replacer FUNCTIONS, not strings. A string replacement would
// interpret $&, $', $`, $1... sequences that appear inside the minified bundle
// (e.g. React's "$&/") and corrupt the output.
html = html.replace(
  /<link[^>]*rel="stylesheet"[^>]*href="\.?\/?assets\/[^"]+"[^>]*>/,
  () => `<style>\n${css}\n</style>`
);
html = html.replace(
  /<script[^>]*type="module"[^>]*src="\.?\/?assets\/[^"]+"[^>]*><\/script>/,
  () => `<script type="module">\n${js}\n</script>`
);

writeFileSync(join(dist, "index.html"), html, "utf8");

// Sanity check: no external asset references or unescaped $& splice artifacts.
const externalRefs = (html.match(/src="\.?\/?assets\//g) || []).length;
console.log("Inlined", jsFile, "+", cssFile, "->", "dist/index.html");
console.log("Size:", (html.length / 1024).toFixed(1), "kB | external asset refs:", externalRefs);
