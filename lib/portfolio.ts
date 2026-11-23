// Vidéos du portfolio : chaîne YouTube Novazure (liste non répertoriée/publique).
// Les niches sont proposées d'après les titres : à valider.
export type PortfolioVideo = {
  youtubeId: string
  title: string
  niche?: string
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  { youtubeId: "OV3lPHHe0ZU", title: "L'histoire de Novazure", niche: "Sociétés" },
  { youtubeId: "rBkvInnpaS8", title: "Pourquoi filmer votre mariage", niche: "Mariage" },
  { youtubeId: "B2SCWc1xTyg", title: "Teaser mariage mai 2026 J&C", niche: "Mariage" },
  { youtubeId: "m3k6rtkDQ9M", title: "Teaser mariage mai 2025 A&D", niche: "Mariage" },
  { youtubeId: "WQEPIkpcCCM", title: "Teaser 5 juin 2026 L&J", niche: "Mariage" },
  { youtubeId: "REelqCfvayQ", title: "Roulotte du lac de Saint-Croix", niche: "Immobilier" },
  { youtubeId: "xjstJouBkw0", title: "Cap Canaille à Cassis", niche: "Immobilier" },
  { youtubeId: "s_Wh7X1xLY0", title: "Chaîne humaine au tombolo de Hyères", niche: "Associations" },
  { youtubeId: "ucXhK4i0u-M", title: "Timelapse villa", niche: "Immobilier" },
  { youtubeId: "CuymaOLmh4g", title: "Agence Boyer – Bandol", niche: "Immobilier" },
  { youtubeId: "_L4_nintiIA", title: "École de cirque Pitrerie", niche: "Sociétés" },
  { youtubeId: "TevdZq2GGI0", title: "Domaine de la Toussane", niche: "Domaines de mariage" },
  { youtubeId: "Cwt52xlHZZ4", title: "Conciergerie DMP Excellence", niche: "Sociétés" },
  { youtubeId: "ShdGc_cOh7Q", title: "Helios spa", niche: "Sociétés" },
  { youtubeId: "D47ijCVV8s4", title: "Domaine Astra", niche: "Domaines de mariage" },
  { youtubeId: "d-FN7cHAfos", title: "Domaine de la Pommée", niche: "Domaines de mariage" },
  { youtubeId: "vfAhIxz4dsg", title: "Villa d'exception, Var", niche: "Immobilier" },
  { youtubeId: "81I7ZjSea4k", title: "Villa d'architecte, Sanary-sur-Mer", niche: "Immobilier" },
  { youtubeId: "gj3GYJ9TNmc", title: "Vidéo immobilière et drone", niche: "Immobilier" },
  { youtubeId: "1bZuWZWbQ2M", title: "Valorisation immobilière, showtour 2025", niche: "Immobilier" },
  { youtubeId: "su4XqYeRDyQ", title: "Introduction to Novazure", niche: "Sociétés" },
]

export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
