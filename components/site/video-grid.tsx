"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import { youtubeEmbed, type PortfolioVideo } from "@/lib/portfolio"

/**
 * Grille de vidéos, avec filtre par activité (facultatif) et lecteur plein écran :
 * un clic ouvre la vidéo dans une fenêtre, sans quitter le site (YouTube sans cookies).
 */
export function VideoGrid({
  videos,
  filters = false,
  cols = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  videos: PortfolioVideo[]
  filters?: boolean
  /** Classes de colonnes de la grille (par défaut : 1, 2 puis 3 colonnes). */
  cols?: string
}) {
  const [active, setActive] = useState<PortfolioVideo | null>(null)
  const [niche, setNiche] = useState("Toutes")
  const closeRef = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  const niches = useMemo(() => ["Toutes", ...Array.from(new Set(videos.map((v) => v.niche ?? "Réalisation")))], [videos])
  const shown = niche === "Toutes" ? videos : videos.filter((v) => v.niche === niche)
  const isOpen = active !== null
  const shownRef = useRef(shown)
  useEffect(() => {
    shownRef.current = shown
  })

  // Film précédent ou suivant dans la liste affichée (en boucle).
  const step = (dir: number) =>
    setActive((cur) => {
      const list = shownRef.current
      if (!cur || list.length < 2) return cur
      const i = list.findIndex((v) => v.youtubeId === cur.youtubeId)
      return list[(i + dir + list.length) % list.length]
    })

  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null)
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
      opener.current?.focus()
    }
  }, [isOpen])

  return (
    <div>
      {filters && (
        <div role="group" aria-label="Filtrer par activité" className="mb-10 flex flex-wrap justify-center gap-2">
          {niches.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={niche === n}
              onClick={() => setNiche(n)}
              className={`glass glass-gold rounded-full px-5 py-2 font-sub text-[11px] tracking-[0.2em] uppercase ${
                niche === n ? "!border-[var(--nz-gold)] text-[var(--nz-gold)]" : "text-[var(--nz-text)]"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      )}

      <ul className={`grid grid-cols-1 gap-6 ${cols}`}>
        {shown.map((v) => (
          <li key={v.youtubeId}>
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget
                setActive(v)
              }}
              className="video-card glass group block w-full overflow-hidden rounded-2xl text-left"
              aria-label={`Lire la vidéo : ${v.title}`}
            >
              <span className="relative block aspect-video overflow-hidden">
                <img src={`/films/${v.youtubeId}.webp`} alt="" loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="play absolute top-1/2 left-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#14203a]">
                  <Play className="ml-0.5 h-5 w-5" aria-hidden="true" />
                </span>
              </span>
              <span className="block p-5">
                <span className="eyebrow">{v.niche ?? "Réalisation"}</span>
                <span className="mt-2 block font-display text-lg leading-snug font-extrabold">{v.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="font-display text-base font-extrabold sm:text-lg">{active.title}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActive(null)}
                className="glass glass-gold grid h-10 w-10 shrink-0 place-items-center rounded-full"
                aria-label="Fermer la vidéo"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-video overflow-hidden rounded-2xl border border-[rgba(147,197,253,0.22)] bg-black">
              <iframe
                key={active.youtubeId}
                src={`${youtubeEmbed(active.youtubeId)}&autoplay=1`}
                title={active.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
            {shown.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <button type="button" onClick={() => step(-1)} className="glass glass-gold grid h-11 w-11 place-items-center rounded-full" aria-label="Film précédent">
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <span className="font-sub text-[11px] tracking-[0.2em] text-[var(--nz-muted)] uppercase">
                  {shown.findIndex((v) => v.youtubeId === active.youtubeId) + 1} / {shown.length}
                </span>
                <button type="button" onClick={() => step(1)} className="glass glass-gold grid h-11 w-11 place-items-center rounded-full" aria-label="Film suivant">
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
