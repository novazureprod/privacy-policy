# Reprise du projet — état au 17/11

## Fait
- Projet Next.js 16 (App Router, TypeScript, Tailwind v4, ESLint) à la racine ; framer-motion, lucide-react, clsx, tailwind-merge, cva.
- shadcn configuré à la main (`components.json`, `lib/utils.ts`) : le registre ui.shadcn.com est bloqué depuis cette session.
- Composants reçus : `components/ui/glass-folder-cards.tsx`, `components/ui/perspective-tunnel-hero.tsx`, démos dans `components/examples/`.
- Charte : tokens CSS dans `app/globals.css`, polices dans `public/fonts/` (Open Sans ExtraBold, Cooper Hewitt Light, PT Sans).
- Intro : vidéo phénix dans `public/intro/` (MP4 + WebM), logo extrait `logo-frame.png`.
- Pages : accueil (`app/page.tsx`), pages niches (`app/[niche]/page.tsx`, sept niches dans `lib/niches.ts`), portfolio (`app/portfolio/page.tsx`).
- Livre portfolio : quatre vidéos YouTube dans `lib/portfolio.ts` (titres génériques).
- Responsive vérifié à 1920, 1280, 768 et 390 px, sans débordement horizontal.
- Aperçu statique publié (privé) : https://claude.ai/artifact/KgAuHmc5xnib3idvRVeT8m

## Non vérifié
- Lecture des vidéos YouTube (YouTube injoignable depuis la session).
- Tunnel 3D sur téléphone réel.

## À faire
1. Mise en ligne : hébergement (Vercel conseillé), puis domaine novazure.fr (racine, car il n'y a pas de site actuel).
2. Vraies vidéos : titres, niches, ordre des vingt films.
3. Textes : histoire, process, avis, chiffres (à rédiger ensemble).
4. Calendly : remplacer `https://calendly.com/` dans `lib/niches.ts`.
5. Bug à corriger : le tunnel capte la molette sur la page portfolio (défilement bloqué).
6. Images du tunnel : remplacer les images de démonstration par des images de vos films.
7. Mentions légales (page absente).
8. Vérifier l'alignement du logo d'intro sur grand écran.
