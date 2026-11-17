# Charte graphique — Novazure (brouillon v0)

Site : novazure.fr
Mots-clés : azur · innovation · investissement
Public : variés, avec un besoin commun de vidéaste

## Direction

Noir mat moderne, relief métallique discret, reflets bleutés. Les zones cliquables sont dorées.

## Répartition des couleurs

| Part | Rôle | Couleurs |
|------|------|----------|
| 60 % | Noir et bleu nuit (fonds, surfaces) | noir mat `#0A0C10`, bleu nuit `#111827` |
| 30 % | Dégradés de bleu (boutons, surfaces, reflets) | `#1E3A8A` → `#3B82F6` → `#93C5FD` (reflet) |
| 10 % | Or (zones cliquables, appels à l'action) | `#C9A227`, survol `#E0B94A` |

Les reflets métalliques s'obtiennent par un dégradé linéaire bleu acier (`#1B2535` → `#5B7DB1`), en surcouche faible (5 à 12 %).

## Typographie

Polices : **à confirmer** — je n'ai pas trouvé de fichier de charte dans Notion ni dans le dépôt.
Pour le moment, des valeurs de substitution sont indiquées ci-dessous.

| Usage | Police | Statut |
|-------|--------|--------|
| Titres | à confirmer | — |
| Texte | à confirmer | — |
| Détails techniques | monospace système | substitution |

## Règles d'usage (brouillon)

- Or réservé aux éléments cliquables et aux appels à l'action. Pas de texte courant en or.
- Bleus en dégradé pour les surfaces ; à plat pour le texte.
- Texte clair (`#F5F7FA`) sur fond noir ; contrastes WCAG AA minimum.

## Tokens CSS (brouillon)

```css
:root {
  --nz-black: #0a0c10;
  --nz-night: #111827;
  --nz-blue-900: #1e3a8a;
  --nz-blue-500: #3b82f6;
  --nz-blue-200: #93c5fd;
  --nz-steel-1: #1b2535;
  --nz-steel-2: #5b7db1;
  --nz-gold: #c9a227;
  --nz-gold-hover: #e0b94a;
  --nz-text: #f5f7fa;
  --nz-font-display: "à confirmer", system-ui, sans-serif;
  --nz-font-body: "à confirmer", system-ui, sans-serif;
  --nz-font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}
```

## À faire

1. Confirmer les polices (noms exacts, ou fichiers à déposer dans `site/notes/` ou via le chat).
2. Valider la répartition 60/30/10 et les valeurs hexadécimales.
3. Remplacer dans les composants reçus (tunnel, dossiers) les couleurs en dur par ces tokens.
