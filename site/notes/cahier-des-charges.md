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
