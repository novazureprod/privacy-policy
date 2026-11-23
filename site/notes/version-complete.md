# Version complète du site (branche `site-complet`)

Copie de travail du site, faite le 23/11/2026 pendant une absence de 1 h 30, carte blanche.
La branche d'origine (`ccr-a4b2a638-ugtgbi`) et son aperçu publié restent intacts.

## Ce qui a été ajouté

| Zone | Contenu |
|------|---------|
| En-tête | Fixe, transparent en haut puis en verre au défilement. Liens : Réalisations, Activités, Méthode, Histoire, Contact. Menu « Votre activité » conservé. Menu mobile (burger). |
| Accueil | Intro phénix, puis texte d'accueil, accès direct aux 7 activités, rendez-vous, invitation à défiler. Pellicule 3D (inchangée). Dossiers par activité. Chiffres animés. Méthode en 5 étapes. Histoire avec deux films. Avis. FAQ. Contact. |
| Pages activité | Visuel de fond tiré d'un film de l'activité, besoin, 3 points forts, films de l'activité avec lecteur intégré, offre, FAQ, rendez-vous, liens vers les autres activités. |
| Réalisations | Tunnel 3D avec les vraies images des films, puis grille de tous les films avec filtre par activité et lecteur intégré. |
| Pages légales | Mentions légales et politique de confidentialité (champs à compléter surlignés en or). Page 404. |
| Pied de page | Navigation, activités, contact, YouTube, pages légales. |
| Finitions | Bandeau des clients (noms tirés des films publiés), bouton « Rendez-vous » fixe sur téléphone, retour en haut, section active en or dans le menu, bouton « Passer l'intro », lecteur vidéo avec film précédent/suivant (flèches du clavier). |
| Performance | Images des films en WebP (−40 %), polices de la charte préchargées. |
| Référencement | Titre et description par page, image de partage (`public/og.jpg`), icône, `sitemap.xml`, `robots.txt`, données structurées (ProfessionalService). |
| Accessibilité | Lien « Aller au contenu », titres hiérarchisés, focus doré visible, lecteur vidéo fermable au clavier (Échap), mouvement réduit respecté, liste de liens cachée pour la pellicule 3D. |

## Décisions prises sans validation

- **Niches des films** : Wok 83, Les 2 Sœurs et le bar passent dans « Restaurants » ; Festic dans « Associations » ; la roulotte dans « Immobilier ».
- **Domaines viticoles** : aucun film dédié, la page montre des films de domaines et d'immobilier proches.
- **Chiffres** : uniquement des chiffres vrais (nombre de films en ligne, nombre d'activités, un seul interlocuteur). Les anciens chiffres d'exemple (120+, 48 h) sont retirés.
- **Avis clients** : toujours des exemples, signalés comme tels sous la section.
- **Textes** : courts et sobres, sans superlatifs (charte). Points forts et FAQ rédigés pour chaque activité : à relire.
- **Couleurs** : l'or reste réservé aux éléments cliquables et aux petits titres.
- **Tunnel de la page Réalisations** : la molette ne bloque plus la page ; une fois au bout du tunnel, la page défile.

## À compléter avant la mise en ligne

1. `lib/niches.ts` : l'adresse Calendly (`CALENDLY_URL`).
2. `lib/site.ts` : e-mail et téléphone de contact (vides = masqués).
3. `app/mentions-legales/page.tsx` : statut, SIRET, adresse, contact, hébergeur.
4. `app/confidentialite/page.tsx` : e-mail de contact.
5. Avis clients réels (avec l'accord des clients).
6. Hébergement et domaine `novazure.fr` (Vercel conseillé : la branche se déploie telle quelle).

## Aperçu

`python scripts/export-static.py <dossier>` construit la copie statique (`.next-export`), puis la rend
autonome (chemins relatifs) pour l'aperçu publié. Le site lui-même se déploie normalement (`next build`).
