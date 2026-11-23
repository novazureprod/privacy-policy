// Vidéos du portfolio : chaîne YouTube Novazure (liste non répertoriée/publique).
// Les niches sont proposées d'après les titres : à valider.
export type PortfolioVideo = {
  youtubeId: string
  title: string
  niche?: string
  /** Miniature maison (public/miniatures). Sans elle, la miniature YouTube est utilisée. */
  thumbnail?: string
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  { youtubeId: "OV3lPHHe0ZU", title: "L'histoire de Novazure", niche: "Sociétés" },
  { youtubeId: "rBkvInnpaS8", title: "Pourquoi filmer votre mariage", niche: "Mariage" },
  { youtubeId: "B2SCWc1xTyg", title: "Teaser mariage mai 2026 J&C", niche: "Mariage", thumbnail: "/miniatures/B2SCWc1xTyg.jpg" },
  { youtubeId: "m3k6rtkDQ9M", title: "Teaser mariage mai 2025 A&D", niche: "Mariage" },
  { youtubeId: "WQEPIkpcCCM", title: "Teaser 5 juin 2026 L&J", niche: "Mariage", thumbnail: "/miniatures/WQEPIkpcCCM.jpg" },
  { youtubeId: "1dzJABebjl0", title: "Restaurant Wok 83", niche: "Restaurants", thumbnail: "/miniatures/1dzJABebjl0.jpg" },
  { youtubeId: "XjjGsIawjPE", title: "Aftermovie Festival Festic", niche: "Associations", thumbnail: "/miniatures/XjjGsIawjPE.jpg" },
  { youtubeId: "REelqCfvayQ", title: "Roulotte du lac de Sainte-Croix", niche: "Immobilier", thumbnail: "/miniatures/REelqCfvayQ.jpg" },
  { youtubeId: "xjstJouBkw0", title: "Cap Canaille à Cassis", niche: "Immobilier" },
  { youtubeId: "7G_h-Qu7LUI", title: "Chaîne humaine au tombolo de Hyères", niche: "Associations", thumbnail: "/miniatures/7G_h-Qu7LUI.jpg" },
  { youtubeId: "mmqL9GzWYC0", title: "Forum des associations, Solliès-Pont", niche: "Associations", thumbnail: "/miniatures/mmqL9GzWYC0.jpg" },
  { youtubeId: "ucXhK4i0u-M", title: "Timelapse villa", niche: "Immobilier" },
  { youtubeId: "CuymaOLmh4g", title: "Agence Boyer – Bandol", niche: "Immobilier", thumbnail: "/miniatures/CuymaOLmh4g.jpg" },
  { youtubeId: "_L4_nintiIA", title: "École de cirque Pitrerie", niche: "Sociétés", thumbnail: "/miniatures/_L4_nintiIA.jpg" },
  { youtubeId: "TevdZq2GGI0", title: "Domaine de la Toussane", niche: "Domaines de mariage", thumbnail: "/miniatures/TevdZq2GGI0.jpg" },
  { youtubeId: "Cwt52xlHZZ4", title: "Conciergerie DMP Excellence", niche: "Sociétés", thumbnail: "/miniatures/Cwt52xlHZZ4.jpg" },
  { youtubeId: "2zS5lJnR3WQ", title: "Restaurant Les 2 Sœurs", niche: "Restaurants", thumbnail: "/miniatures/2zS5lJnR3WQ.jpg" },
  { youtubeId: "sfRZxRNz7xc", title: "Bar Bières du Monde", niche: "Restaurants", thumbnail: "/miniatures/sfRZxRNz7xc.jpg" },
  { youtubeId: "ShdGc_cOh7Q", title: "Helios Spa", niche: "Sociétés", thumbnail: "/miniatures/ShdGc_cOh7Q.jpg" },
  { youtubeId: "D47ijCVV8s4", title: "Domaine Astra", niche: "Domaines de mariage", thumbnail: "/miniatures/D47ijCVV8s4.jpg" },
  { youtubeId: "d-FN7cHAfos", title: "Domaine de la Pommée", niche: "Domaines de mariage", thumbnail: "/miniatures/d-FN7cHAfos.jpg" },
  { youtubeId: "vfAhIxz4dsg", title: "Villa d'exception, Var", niche: "Immobilier", thumbnail: "/miniatures/vfAhIxz4dsg.jpg" },
  { youtubeId: "81I7ZjSea4k", title: "Villa d'architecte, Sanary-sur-Mer", niche: "Immobilier", thumbnail: "/miniatures/81I7ZjSea4k.jpg" },
  { youtubeId: "gj3GYJ9TNmc", title: "Vidéo immobilière et drone", niche: "Immobilier" },
  { youtubeId: "1bZuWZWbQ2M", title: "Valorisation immobilière, showtour 2025", niche: "Immobilier" },
  { youtubeId: "su4XqYeRDyQ", title: "Introduction à Novazure", niche: "Sociétés" },
]

export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
