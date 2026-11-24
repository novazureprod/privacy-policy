// Génère le fichier autonome du fond « poussière d'or » (un seul HTML, three.js par CDN)
// à partir de lib/dust-waves.ts. Usage : node scripts/build-dust-html.cjs <fichier.html>
const ts = require("typescript")
const fs = require("fs")
const path = require("path")

const out = process.argv[2] || "fond-particules.html"
const src = fs.readFileSync(path.join(__dirname, "..", "lib", "dust-waves.ts"), "utf8")
const js = ts
  .transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } })
  .outputText.replace("export function mountDustWaves", "function mountDustWaves")

const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fond poussière d'or</title>
<style>
  html { background: #020611; }
  body { margin: 0; min-height: 100%; background: transparent; }
  /* Le fond, à placer derrière n'importe quel site */
  #fond {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; overflow: hidden;
    background:
      radial-gradient(ellipse 90% 40% at 50% 100%, rgba(30, 98, 208, 0.28), transparent 70%),
      linear-gradient(180deg, #020611 0%, #020611 35%, #06132b 100%);
  }
</style>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js"}}</script>
</head>
<body>
<div id="fond" aria-hidden="true"></div>
<script type="module">
${js}
mountDustWaves(document.getElementById("fond"));
</script>
</body>
</html>
`
fs.writeFileSync(out, html)
console.log("écrit :", out)
