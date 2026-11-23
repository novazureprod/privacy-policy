"""Construit la copie statique du site (.next-export) pour l'aperçu, puis la rend autonome.

Usage : python scripts/export-static.py <dossier-de-sortie>

L'export statique de Next n'accepte ni le rendu partiel, ni `instant`, ni les routes
sitemap/robots dynamiques : on les met de côté le temps du build, puis on les restaure.
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
out = sys.argv[1]

aside = ROOT.parent / "_export_tmp"
aside.mkdir(exist_ok=True)
moved = []
patched = {}
try:
    for name in ("app/sitemap.ts", "app/robots.ts"):
        if Path(name).exists():
            shutil.move(name, aside / Path(name).name)
            moved.append(name)
    niche = Path("app/[niche]/page.tsx")
    text = niche.read_text(encoding="utf-8")
    patched[niche] = text
    niche.write_text(text.replace("export const instant = false", "// export const instant = false"), encoding="utf-8")

    env = dict(os.environ, STATIC_EXPORT="1")
    subprocess.run("npx next build", shell=True, check=True, env=env)
finally:
    for path, text in patched.items():
        path.write_text(text, encoding="utf-8")
    for name in moved:
        shutil.move(aside / Path(name).name, name)
    shutil.rmtree(aside, ignore_errors=True)

subprocess.run([sys.executable, "scripts/build-preview.py", out], check=True)
