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
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current || !trackRef.current) return
    return mountFilmReel(
      ref.current,
      items,
      (it) => window.open(`https://www.youtube.com/watch?v=${it.id}`, "_blank", "noopener"),
      trackRef.current,
    )
  }, [])
  // Zone haute : la pellicule reste collée à l'écran et défile au rythme de la molette.
  return (
    <div ref={trackRef} className="relative h-[320svh]">
      <div ref={ref} className="sticky top-0 h-svh w-full overflow-hidden" role="region" aria-label="Pellicule des réalisations Novazure" />
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
