// Contenu de démonstration : les textes sont des brouillons à valider ensemble.
// Les chiffres et avis sont des exemples marqués « à valider ».

export type Niche = {
  slug: string
  label: string
  headline: string
  intro: string
  need: string
  offer: string[]
}

export const NICHES: Niche[] = [
  {
    slug: "restaurants",
    label: "Restaurants",
    headline: "Votre table, en mouvement.",
    intro: "L'ambiance, l'équipe et les plats, filmés pour donner envie avant même la première réservation.",
    need: "Vous voulez montrer votre salle, votre cuisine et votre équipe, sans passer des heures à filmer.",
    offer: ["Reels courts pour les réseaux", "Film de présentation de la maison", "Calendrier de publication"],
  },
  {
    slug: "immobilier",
    label: "Immobilier",
    headline: "Un bien, une histoire.",
    intro: "Une mise en valeur qui fait ressentir le lieu, pour attirer les acheteurs et les investisseurs.",
    need: "Vous devez vendre ou louer vite, à un prix juste, à des personnes qui se projettent déjà.",
    offer: ["Visite cinématique", "Film de quartier", "Version courte pour les annonces"],
  },
  {
    slug: "mariage",
    label: "Mariage",
    headline: "Le jour J, raconté avec justesse.",
    intro: "Un film qui garde les émotions, les regards et les détails d'un mariage.",
    need: "Vous voulez revivre ce jour, et le transmettre à votre famille.",
    offer: ["Film de mariage", "Teaser pour les réseaux", "Captation de la cérémonie"],
  },
  {
    slug: "societes",
    label: "Sociétés",
    headline: "Votre entreprise, en images claires.",
    intro: "Une présentation vidéo qui parle à vos clients, vos partenaires et vos investisseurs.",
    need: "Vous voulez présenter votre savoir-faire avec sérieux et modernité.",
    offer: ["Film institutionnel", "Portraits d'équipe", "Vidéos produit"],
  },
  {
    slug: "associations",
    label: "Associations",
    headline: "Votre cause, racontée.",
    intro: "Des vidéos qui donnent envie de rejoindre, de soutenir et de témoigner.",
    need: "Vous voulez toucher de nouveaux soutiens avec peu de moyens.",
    offer: ["Film de présentation", "Témoignages", "Captation d'événements"],
  },
  {
    slug: "domaines-viticoles",
    label: "Domaines viticoles",
    headline: "Le vin, le paysage, la main.",
    intro: "Vos vignes, vos chais et vos équipes, filmés pour la lumière qu'ils méritent.",
    need: "Vous voulez faire découvrir votre domaine et vos cuvées, en ligne et sur place.",
    offer: ["Film de domaine", "Vidéos vendanges", "Visite oenotouristique"],
  },
  {
    slug: "domaines-de-mariage",
    label: "Domaines de mariage",
    headline: "Votre lieu, le plus beau décor.",
    intro: "Présenter votre domaine comme le lieu où les couples se projettent.",
    need: "Vous voulez convaincre les couples dès la première visite en ligne.",
    offer: ["Film de domaine", "Visite des espaces", "Extraits de mariages réels"],
  },
]

export function getNiche(slug: string): Niche | undefined {
  return NICHES.find((n) => n.slug === slug)
}

export const CALENDLY_URL = "https://calendly.com/" // à remplacer par l'URL Calendly de Novazure
