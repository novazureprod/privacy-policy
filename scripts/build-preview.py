"""Transforme l'export statique (.next-export) en copie autonome, à chemins relatifs.

Usage : python scripts/build-preview.py <dossier-de-sortie>

L'aperçu publié n'est pas servi à la racine d'un domaine : tous les chemins absolus
(« /_next/… », « /films/… », liens internes) sont rendus relatifs, et un petit script
remplace la navigation interne de Next par une navigation classique entre fichiers .html.
"""

import re
import shutil
import sys
from pathlib import Path

SRC = Path(".next-export")
OUT = Path(sys.argv[1])

PAGES = [p.stem for p in SRC.glob("*.html")]
ASSET_DIRS = ["films", "fonts", "intro"]
ASSET_FILES = ["icon.png", "og.jpg"]

NAV_SCRIPT = """<script>
// Aperçu statique : chaque lien interne ouvre directement le fichier .html correspondant.
addEventListener("click", function (e) {
  var a = e.target && e.target.closest ? e.target.closest("a[href]") : null;
  if (!a || a.target === "_blank" || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
  var href = a.getAttribute("href");
  if (!href) return;
  // Lien déjà réécrit vers un fichier .html : on laisse le navigateur l'ouvrir, sans le routeur de Next.
  if (/^\\.\\/[^/]*\\.html(#.*)?$/.test(href)) { e.stopPropagation(); return; }
  if (href.charAt(0) !== "/" || href.charAt(1) === "/") return;
  var m = href.match(/^\\/([^#?]*)(#.*)?$/);
  if (!m) return;
  var page = m[1] ? m[1].replace(/\\/$/, "") + ".html" : "index.html";
  var here = location.pathname.split("/").pop() || "index.html";
  e.preventDefault();
  e.stopPropagation();
  if (page === here && m[2]) { location.hash = m[2]; return; }
  location.href = page + (m[2] || "");
}, true);
</script>"""


def relink(text: str) -> str:
    # L'hébergeur de l'aperçu réserve les noms commençant par « _ » : _next devient next-assets.
    text = text.replace('"/_next/', '"./next-assets/').replace("'/_next/", "'./next-assets/")
    for d in ASSET_DIRS:
        text = text.replace(f'"/{d}/', f'"./{d}/').replace(f"`/{d}/", f"`./{d}/").replace(f"'/{d}/", f"'./{d}/")
    for f in ASSET_FILES:
        text = text.replace(f'"/{f}"', f'"./{f}"')
    return text


def relink_html(text: str) -> str:
    text = relink(text)

    def page_href(m: re.Match) -> str:
        path, frag = m.group(1), m.group(2) or ""
        if path == "":
            return f'href="./index.html{frag}"'
        if path in PAGES:
            return f'href="./{path}.html{frag}"'
        return m.group(0)

    text = re.sub(r'href="/([a-z0-9-]*)(#[^"]*)?"', page_href, text)
    return text.replace("</body>", NAV_SCRIPT + "</body>", 1)


if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir(parents=True)

for page in SRC.glob("*.html"):
    if page.name.startswith("_"):
        continue
    (OUT / page.name).write_text(relink_html(page.read_text(encoding="utf-8")), encoding="utf-8")

for f in (SRC / "_next").rglob("*"):
    if f.is_dir():
        continue
    dest = OUT / "next-assets" / f.relative_to(SRC / "_next")
    dest.parent.mkdir(parents=True, exist_ok=True)
    if f.suffix == ".js":
        # Le caractère de remplacement (U+FFFD) des bibliothèques est écrit en échappement
        # (il n'apparaît que dans des chaînes) : l'hébergeur de l'aperçu le refuse tel quel.
        dest.write_text(relink(f.read_text(encoding="utf-8")).replace(chr(0xFFFD), chr(92) + "ufffd"), encoding="utf-8")
    elif f.suffix == ".css":
        # Les feuilles de style sont dans _next/static/chunks : on remonte de trois niveaux.
        css = f.read_text(encoding="utf-8")
        for d in ASSET_DIRS:
            css = css.replace(f"url(/{d}/", f"url(../../../{d}/")
        dest.write_text(css, encoding="utf-8")
    else:
        shutil.copy2(f, dest)

for d in ASSET_DIRS:
    if (SRC / d).exists():
        # Seule la dernière version de l'intro est utilisée par le site.
        shutil.copytree(SRC / d, OUT / d, ignore=shutil.ignore_patterns("phenix-intro.*", "phenix-intro-v2.*", "logo-frame*"))
for f in ASSET_FILES:
    if (SRC / f).exists():
        shutil.copy2(SRC / f, OUT / f)

# La page d'entrée de l'aperçu est enveloppée par l'hébergeur : on y met une simple
# redirection vers l'accueil complet (accueil.html), servi tel quel comme les autres pages.
for page in OUT.glob("*.html"):
    page.write_text(page.read_text(encoding="utf-8").replace("./index.html", "./accueil.html").replace('"index.html"', '"accueil.html"'), encoding="utf-8")
(OUT / "index.html").rename(OUT / "accueil.html")
(OUT / "index.html").write_text(
    '<meta charset="utf-8"><title>Novazure, version complète</title>'
    '<style>html,body{margin:0;background:#0a0c10}</style>'
    '<script>location.replace("accueil.html" + location.hash)</script>'
    '<p style="color:#9aa6ba;font:14px sans-serif;text-align:center;margin-top:40vh">'
    '<a href="accueil.html" style="color:#c9a227">Ouvrir le site Novazure</a></p>',
    encoding="utf-8",
)

count = sum(1 for _ in OUT.rglob("*") if _.is_file())
print(f"{count} fichiers dans {OUT}")
