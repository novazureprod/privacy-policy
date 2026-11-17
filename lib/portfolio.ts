// Vidéos du livre portfolio. Titres et niches à confirmer : ils sont génériques pour l'instant.
export type PortfolioVideo = {
  youtubeId: string
  title: string
  niche?: string
}

export const PORTFOLIO_VIDEOS: PortfolioVideo[] = [
  { youtubeId: "rBkvInnpaS8", title: "Vidéo 1" },
  { youtubeId: "OV3lPHHe0ZU", title: "Vidéo 2" },
  { youtubeId: "1dzJABebjl0", title: "Vidéo 3" },
  { youtubeId: "WQEPIkpcCCM", title: "Vidéo 4" },
]

export const youtubeEmbed = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
