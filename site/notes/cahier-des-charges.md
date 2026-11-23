# Cahier des charges — novazure.fr (brouillon v0)

Mots-clés : azur · innovation · investissement
Charte : voir `charte-novazure.md` et `charte/fonts.css`

## Arborescence

| Page | Contenu | Remarque |
|------|---------|----------|
| Accueil | hero animé avec logo, fond dynamique, portfolio en vedette, chiffres clés, avis clients, appel à réserver | effets verre et lumière |
| Menu « Votre activité » | choix de la niche au premier niveau | menu clair dès l'entrée |
| Niche ×N | speech, portfolio filtré, cas concrets, offre adaptée | une page par niche |
| Portfolio | book 3D (style « lamplit ») + grille de vidéos | à partir des fichiers Drive |
| Process | étapes du tournage au livrable | — |
| Histoire | présentation de Novazure | — |
| Avis clients | témoignages | — |
| Chiffres clés | compteurs animés | — |
| Agenda | prise de rendez-vous | intégration à choisir |
| Contact / mentions légales | formulaire, infos légales | — |

## Niches (validées)

1. Immobilier
2. Restaurants
3. Mariage
4. Sociétés
5. Associations
6. Domaines viticoles
7. Domaines de mariage

À clarifier : « Mariage » (prestataires, couples) et « Domaines de mariage » (lieux) sont proches. Je les garde séparées, avec un speech distinct pour chacune.

## Effets visuels

- Logo animé à l'arrivée (tracé puis apparition).
- Fond dynamique : le tunnel 3D reçu, ou une version plus sobre.
- Boutons et cartes en verre : flou, reflet bleuté, halo doré au survol (zones cliquables).
- Animations au défilement, discrètes, réduites si l'utilisateur préfère moins de mouvement.

## Décisions à prendre

1. **Agenda** : Calendly (un connecteur est déjà disponible) ou Cal.com, intégré à la page.
2. **Portfolio 3D** : confirmer le style visé (le « book » de la capture lamplit).
3. **Hébergement et domaine** : novazure.fr, hébergement à choisir.
4. **Ordre de travail** : proposition ci-dessous.

## Ordre de travail proposé

1. Mise en place du projet (Next.js, TypeScript, Tailwind, shadcn, framer-motion) et des tokens de charte.
2. Accueil : hero, logo animé, fond, navigation.
3. Menu des niches et une page-modèle de niche.
4. Portfolio, puis les autres niches.
5. Process, histoire, avis, chiffres clés.
6. Agenda, contact, mentions légales.
7. Revue responsive (téléphone d'abord), accessibilité, performances.

## Décisions

- **Agenda** : Calendly.
- **Textes** (histoire, process, avis, chiffres) : rédigés ensemble, page par page.

## Questions ouvertes

- Lancer la mise en place du projet (Next.js, TypeScript, Tailwind, shadcn, framer-motion) à la racine du dépôt ?

## Décisions de théorie (v1)

- **Parcours** : le visiteur choisit sa niche dès l'accueil, via un menu déroulant qui permet de revenir en arrière à tout moment.
- **Structure** : une page d'accueil commune, puis une page spécifique par niche.
- **Ton** : premium.
- **Niche prioritaire** : restaurants. Elle sert de modèle pour la première page de niche.

## Vocabulaire et accueil (v1)

- **Vocabulaire** : court et sobre. Phrases courtes, pas de superlatifs.
- **Accueil, ordre de lecture** :
  1. Animation du logo Novazure, sur fond dynamique.
  2. Texte d'accueil très court (une phrase, une ligne d'action).
  3. Portfolio « book » en vedette, en 3D.
  4. Menu déroulant des niches, toujours accessible.
- **Page restaurant** : à définir plus tard.

## Effets retenus (v2)

- **Fond** : particules lumineuses.
- **Book 3D** : livre interactif, type « livre magique », avec les vidéos dans les pages. Le visiteur le tourne au curseur ou au doigt, et ouvre une vidéo en la touchant.
- **Logo** : un phénix qui arrive en vol, puis se fixe à sa place. Au même moment, le texte d'accueil apparaît, avec l'animation de référence reçue plus tôt.
- **À vérifier** : le logo en vectoriel (SVG), pour animer le tracé. Le fichier disponible est un PNG transparent (`logo-novazure-transparent-800.png`).

## Animation du phénix (v3)

- **Source** : vidéo générée par IA, fournie par Novazure.
- **Intégration** : la vidéo sert d'intro. Elle se termine sur la frame du logo, puis le logo statique prend le relais. Le texte d'accueil apparaît à ce moment.
- **Fond** : vidéo sans fond (WebM avec transparence) si le phénix doit se détacher des particules, sinon vidéo sur fond noir mat, avec un fondu.
- **Format souhaité** : MP4 pour le fond noir, WebM VP9 avec alpha pour la transparence, avec une version de secours MP4.
- **Durée** : 3 à 4 secondes, pour ne pas retarder l'accueil.
- **Mobile** : même vidéo, plus légère, ou une image fixe si le téléchargement est lent.

## Animations intégrées (v4)

- **Accueil — phénix** : intro vidéo, puis logo fixe et texte d'accueil.
- **Accueil — particules** : fond lumineux bleu et or.
- **Accueil — livre 3D** : pages à tourner (clic, clavier, doigt).
- **Accueil — dossiers en verre** : une carte par niche, avec le composant glass-folder-cards. Les fichiers du dossier pointent vers la page de la niche.
- **Page portfolio — tunnel 3D** : composant perspective-tunnel-hero. Les images sont des exemples à remplacer par les vraies images du portfolio.
- **À revoir** : le tunnel capte la molette sur toute la page portfolio, ce qui bloque le défilement de la page. À corriger avant mise en ligne.

## Vidéos du livre (v5)

- Quatre vidéos YouTube dans `lib/portfolio.ts`, intégrées sans cookies (youtube-nocookie).
- Titres et niches génériques (« Vidéo 1 » à « Vidéo 4 ») : à confirmer.
- Lecture non vérifiée depuis l'environnement de travail : à tester dans un navigateur, et vérifier que les vidéos ne sont pas privées.
- Ajout des vingt vidéos prévues : une entrée par vidéo dans `lib/portfolio.ts`.

## Responsive (v6)

- Vérifié sans débordement horizontal à 1920, 1280, 768 et 390 px.
- Livre : format 4/3 sur téléphone, 16/9 au-delà ; l'inclinaison ne se déclenche qu'à la souris, pour ne pas décaler la carte au toucher.
- Logo d'intro : fondu sur les bords, pour masquer le cadre du PNG.
- Restent à faire : tester le tunnel sur téléphone réel, et le défilement dans la page portfolio.

## Intro v2 (v7)

- Nouvelle vidéo du phénix dans `public/intro/phenix-intro-v2.{mp4,webm}`, sans son.
- Fondu au noir sur les 1,4 dernières secondes : le logo disparaît proprement à la fin.
- Le site n'affiche plus le logo fixe : après la vidéo, seul le texte d'accueil apparaît.
- `public/intro/logo-frame-v2.png` : image du logo extraite à 7,9 s, gardée pour un usage futur (ex. vignette).

## Intro v3 (v8)

- Vidéo coupée à 8,8 s, avant l'éclair final, avec fondu au noir sur la seconde précédant la coupe.
- Fichiers : `public/intro/phenix-intro-v3.{mp4,webm}`. Le site pointe désormais vers la v3.

## Dossiers par niche (v9)

- Alignés sur la vidéo de référence (composant glass-folder-cards) : dossiers clairs et sombres alternés, ouverture au clic, fichiers qui sortent du dossier, menu ··· (découvrir la niche, prendre rendez-vous).
- Chaque fichier du dossier ouvre la page de la niche.
- Sous-ligne : compteur de fichiers, pour ne pas passer sous le bouton ···.

## Fond dynamique commun (v10)

- Fond unique pour toutes les pages : nappes bleues et dorées qui dérivent lentement, trame de points, particules lumineuses.
- Calque fixe derrière le contenu (`components/site/ambient-background.tsx`). Le fond du `body` est devenu transparent, sinon il masquait le calque.
- Mouvement désactivé si l'utilisateur préfère moins d'animations.

## Réalisations en livre (v11)

- Section « Nos réalisations » sur l'accueil : livre fermé à ouvrir (couverture), table des matières cliquable, puis une feuille par vidéo.
- Chaque feuille : vidéo YouTube à droite, fiche (niche, titre, lien YouTube) à gauche. Pages tournées en 3D, clic, flèches, glissement.
- Vidéos chargées seulement pour la page affichée et ses voisines.
- À remplacer : titres et niches (« Vidéo 1 » à « Vidéo 4 »), à compléter jusqu'à vingt.

## Livre : pages qui se déforment (v12)

- Le livre est une section à part, juste après l'intro.
- Pendant le tournage, la feuille se courbe comme du papier journal (inclinaison et compression alternées), puis se pose.
- Tranche des pages visible, ombrage qui varie, reliure centrale.

## Livre en 3D réelle (v13)

- Scène Three.js : double page sur table en bois, tranche des feuilles, reliure, ombres portées.
- Pages déformables : pendant le tournage, le papier se courbe et ondule, avec une bombe au centre.
- Textures générées : papier avec fibres, cuir de couverture, bois de table.
- Clic sur la page de droite : page suivante, ou ouverture de la vidéo sur les pages vidéo (fenêtre YouTube).
- Miniatures YouTube chargées depuis i.ytimg.com (non vérifiable depuis l'environnement de travail) ; un dégradé reste affiché si elles ne se chargent pas.
- Dépendance ajoutée : three (et @types/three).

## Physique du livre — version PC (v14)

- Couverture rigide : pivote sans se courber, avec un léger dégagement pour ne pas traverser la table.
- Feuilles souples : courbure progressive depuis la reliure, bombe au centre pendant le tournage.
- Creux de reliure : les pages s'abaissent près de la couture.
- Grain de papier : texture de relief qui accroche la lumière rasante ; couverture satinée.
- Glisser : la page suit le curseur, puis se pose si on dépasse la moitié, sinon elle revient.
- Maillage plus fin (42 × 4) pour les courbes.
- La version téléphone sera traitée à part.

## Photoréalisme — tracé de chemins (v15)

- Une fois le livre posé, le rendu passe en tracé de chemins (three-gpu-pathtracer) : lumière indirecte, ombres douces, reflets physiques. Pendant les pages qui bougent, le rendu reste temps réel.
- Environnement de studio désactivé : il provoquait une erreur de shader (« cube_uv_reflection_fragment ») avec le tracé de chemins. À corriger.
- Non vérifié visuellement : le tracé de chemins demande un GPU. Le test ici (rendu logiciel) ne permet pas de voir le résultat.
- Pour un vrai photoréalisme, il faut des photos réelles (papier, cuir, bois) à la place des textures générées.
