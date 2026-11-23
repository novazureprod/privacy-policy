"use client"

import { useEffect, useRef } from "react"
import type { ReelItem } from "@/lib/film-reel"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

// Une image par vidéo, au format paysage, dans public/films (miniatures Novazure ou captures).
const items: ReelItem[] = PORTFOLIO_VIDEOS.map((v) => ({
  id: v.youtubeId,
  image: `/films/${v.youtubeId}.webp`,
  title: v.title,
}))

export function VideoGallery() {
  const ref = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    const track = trackRef.current
    if (!el || !track) return
    // La scène 3D, three.js et les 26 images ne se chargent qu'à l'approche de la section :
    // l'accueil s'affiche plus vite.
    let stop: (() => void) | undefined
    let unmounted = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        import("@/lib/film-reel").then(({ mountFilmReel }) => {
          if (unmounted) return
          stop = mountFilmReel(
            el,
            items,
            (it) => window.open(`https://www.youtube.com/watch?v=${it.id}`, "_blank", "noopener"),
            track,
          )
        })
      },
      { rootMargin: "0px 0px 15% 0px" },
    )
    io.observe(track)
    return () => {
      unmounted = true
      io.disconnect()
      stop?.()
    }
  }, [])
  // Zone haute : la pellicule reste collée à l'écran et défile au rythme de la molette.
  return (
    <div ref={trackRef} className="relative h-[320svh]">
      <div ref={ref} className="sticky top-0 h-svh w-full overflow-hidden" role="region" aria-label="Pellicule des réalisations Novazure" />
      <ul className="sr-only">
        {PORTFOLIO_VIDEOS.map((v) => (
          <li key={v.youtubeId}>
            {/* Lue par les lecteurs d'écran ; au clavier, la grille de la page Réalisations prend le relais. */}
            <a href={`https://www.youtube.com/watch?v=${v.youtubeId}`} tabIndex={-1}>
              {v.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
