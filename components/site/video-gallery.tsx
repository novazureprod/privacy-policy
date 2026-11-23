"use client"

import { useEffect, useRef } from "react"
import { mountFilmReel, type ReelItem } from "@/lib/film-reel"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

// Une image par vidéo, au format paysage, dans public/films (miniatures Novazure ou captures).
const items: ReelItem[] = PORTFOLIO_VIDEOS.map((v) => ({
  id: v.youtubeId,
  image: `/films/${v.youtubeId}.jpg`,
  title: v.title,
}))

export function VideoGallery() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    return mountFilmReel(ref.current, items, (it) =>
      window.open(`https://www.youtube.com/watch?v=${it.id}`, "_blank", "noopener"),
    )
  }, [])
  return (
    <div>
      <div ref={ref} className="h-[80svh] min-h-[520px] w-full overflow-hidden" role="region" aria-label="Pellicule des réalisations Novazure" />
      <ul className="sr-only">
        {PORTFOLIO_VIDEOS.map((v) => (
          <li key={v.youtubeId}>
            <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`}>{v.title}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
