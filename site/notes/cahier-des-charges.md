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
