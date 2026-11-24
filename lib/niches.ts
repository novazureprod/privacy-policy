// Textes par activité. Ton : court, sobre, premium. Brouillons à valider ensemble.

export type Niche = {
  slug: string
  label: string
  headline: string
  intro: string
  need: string
  offer: string[]
  /** Trois raisons concrètes de faire appel à Novazure pour cette activité. */
  benefits: { title: string; text: string }[]
  /** Questions fréquentes propres à l'activité. */
  faq: { q: string; a: string }[]
}

export const NICHES: Niche[] = [
  {
    slug: "restaurants",
    label: "Restaurants",
    headline: "Votre table, en mouvement.",
    intro: "L'ambiance, l'équipe et les plats, filmés pour donner envie avant même la première réservation.",
    need: "Vous voulez montrer votre salle, votre cuisine et votre équipe, sans passer des heures à filmer.",
    offer: ["Reels courts pour les réseaux", "Film de présentation de la maison", "Calendrier de publication"],
    benefits: [
      { title: "Tournage discret", text: "Pendant le service ou avant l'ouverture, sans gêner vos clients." },
      { title: "Formats réseaux", text: "Des vidéos verticales prêtes pour Instagram, TikTok et Google." },
      { title: "Plats qui donnent faim", text: "Lumière, gros plans et mouvements choisis pour la cuisine." },
    ],
    faq: [
      { q: "Combien de temps dure un tournage ?", a: "Une demi-journée suffit pour la plupart des restaurants." },
      { q: "Faut-il fermer le restaurant ?", a: "Non. Nous filmons pendant le service ou juste avant l'ouverture." },
    ],
  },
  {
    slug: "immobilier",
    label: "Immobilier",
    headline: "Un bien, une histoire.",
    intro: "Une mise en valeur qui fait ressentir le lieu, pour attirer les acheteurs et les investisseurs.",
    need: "Vous devez vendre ou louer vite, à un prix juste, à des personnes qui se projettent déjà.",
    offer: ["Visite cinématique", "Images de drone et FPV", "Version courte pour les annonces"],
    benefits: [
      { title: "Drone et FPV", text: "Le bien dans son environnement : vue, accès, jardin, piscine." },
      { title: "Visite fluide", text: "Un parcours continu qui fait comprendre les volumes." },
      { title: "Livré vite", text: "Une première version en quelques jours, pour publier sans attendre." },
    ],
    faq: [
      { q: "Le drone est-il autorisé partout ?", a: "Nous vérifions les zones de vol et faisons les démarches avant chaque tournage." },
      { q: "Peut-on filmer un bien occupé ?", a: "Oui, avec une préparation simple que nous vous envoyons à l'avance." },
    ],
  },
  {
    slug: "mariage",
    label: "Mariage",
    headline: "Le jour J, raconté avec justesse.",
    intro: "Un film qui garde les émotions, les regards et les détails d'un mariage.",
    need: "Vous voulez revivre ce jour, et le transmettre à votre famille.",
    offer: ["Film de mariage", "Teaser pour les réseaux", "Captation de la cérémonie"],
    benefits: [
      { title: "Présence discrète", text: "Nous suivons la journée sans la mettre en scène." },
      { title: "Son soigné", text: "Vœux, discours et rires enregistrés proprement." },
      { title: "Teaser rapide", text: "Un premier extrait quelques jours après, à partager." },
    ],
    faq: [
      { q: "Quand faut-il réserver ?", a: "Le plus tôt possible : les dates d'été partent vite." },
      { q: "Combien de temps pour recevoir le film ?", a: "Le teaser arrive en quelques jours, le film complet en quelques semaines." },
    ],
  },
  {
    slug: "societes",
    label: "Sociétés",
    headline: "Votre entreprise, en images claires.",
    intro: "Une présentation vidéo qui parle à vos clients, vos partenaires et vos investisseurs.",
    need: "Vous voulez présenter votre savoir-faire avec sérieux et modernité.",
    offer: ["Film institutionnel", "Portraits d'équipe", "Vidéos produit"],
    benefits: [
      { title: "Message clair", text: "Nous partons de votre objectif, puis nous écrivons le film." },
      { title: "Équipe à l'aise", text: "Des interviews guidées, sans texte à apprendre." },
      { title: "Déclinaisons", text: "Une version longue, des formats courts et des extraits." },
    ],
    faq: [
      { q: "Écrivez-vous le scénario ?", a: "Oui. Nous proposons un plan de film à valider avant le tournage." },
      { q: "Peut-on tourner sur plusieurs sites ?", a: "Oui, en une ou plusieurs journées selon les distances." },
    ],
  },
  {
    slug: "associations",
    label: "Associations",
    headline: "Votre cause, racontée.",
    intro: "Des vidéos qui donnent envie de rejoindre, de soutenir et de témoigner.",
    need: "Vous voulez toucher de nouveaux soutiens avec peu de moyens.",
    offer: ["Film de présentation", "Témoignages", "Captation d'événements"],
    benefits: [
      { title: "Événements", text: "Forums, festivals, actions sur le terrain, filmés sur le vif." },
      { title: "Témoignages", text: "Bénévoles et bénéficiaires racontent, simplement." },
      { title: "Budget adapté", text: "Une offre pensée pour les associations." },
    ],
    faq: [
      { q: "Filmez-vous les événements en extérieur ?", a: "Oui, au sol et au drone, de jour comme en soirée." },
      { q: "Pouvez-vous livrer pour les réseaux ?", a: "Oui, en formats verticaux et carrés, sous-titrés." },
    ],
  },
  {
    slug: "domaines-viticoles",
    label: "Domaines viticoles",
    headline: "Le vin, le paysage, la main.",
    intro: "Vos vignes, vos chais et vos équipes, filmés pour la lumière qu'ils méritent.",
    need: "Vous voulez faire découvrir votre domaine et vos cuvées, en ligne et sur place.",
    offer: ["Film de domaine", "Vidéos vendanges", "Visite œnotouristique"],
    benefits: [
      { title: "Au fil des saisons", text: "Taille, floraison, vendanges : un domaine vivant toute l'année." },
      { title: "Vues aériennes", text: "Le drone révèle le paysage et la forme des parcelles." },
      { title: "Pour l'œnotourisme", text: "Des films qui donnent envie de venir déguster." },
    ],
    faq: [
      { q: "Pouvez-vous filmer pendant les vendanges ?", a: "Oui, en suivant votre planning, sans ralentir les équipes." },
      { q: "Les vidéos peuvent-elles servir à l'export ?", a: "Oui, avec des sous-titres dans la langue de votre choix." },
    ],
  },
  {
    slug: "domaines-de-mariage",
    label: "Domaines de mariage",
    headline: "Votre lieu, le plus beau décor.",
    intro: "Présenter votre domaine comme le lieu où les couples se projettent.",
    need: "Vous voulez convaincre les couples dès la première visite en ligne.",
    offer: ["Film de domaine", "Visite des espaces", "Extraits de mariages réels"],
    benefits: [
      { title: "Chaque espace", text: "Cérémonie, cocktail, dîner, soirée : le parcours d'une journée." },
      { title: "Lumière dorée", text: "Tournage aux heures où le lieu est le plus beau." },
      { title: "Pour vos salons", text: "Un film à diffuser en rendez-vous et sur les salons." },
    ],
    faq: [
      { q: "Faut-il un mariage pour filmer le lieu ?", a: "Non. Nous filmons le domaine seul, puis ajoutons des extraits de mariages si vous le souhaitez." },
      { q: "Combien de temps dure le tournage ?", a: "Une journée, idéalement du matin au coucher du soleil." },
    ],
  },
]

export function getNiche(slug: string): Niche | undefined {
  return NICHES.find((n) => n.slug === slug)
}

export const CALENDLY_URL = "https://calendly.com/novazure-contact/30min"
