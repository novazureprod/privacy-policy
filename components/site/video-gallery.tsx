"use client"

import { SpiralFilmGallery, type FilmFrame } from "@/components/ui/spiral-film-gallery"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

// Une vignette par vidéo : miniature maison (sinon YouTube), titre et niche.
// Un clic ouvre la vidéo sur YouTube.
const frames: FilmFrame[] = PORTFOLIO_VIDEOS.map((v) => ({
  id: v.youtubeId,
  image: v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
  title: v.title,
  subtitle: v.niche ?? "Réalisation",
}))

export function VideoGallery() {
  return (
    <div className="h-[85svh] min-h-[560px] w-full">
      <SpiralFilmGallery
        frames={frames}
        onSelect={(f) => window.open(`https://www.youtube.com/watch?v=${f.id}`, "_blank", "noopener")}
      />
    </div>
  )
}
