"use client"

import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PORTFOLIO_VIDEOS, youtubeEmbed } from "@/lib/portfolio"

/** Livre 3D interactif : chaque page contient une vidéo. Tourner au clic, au clavier ou au doigt. */
export function Book3D() {
  const [index, setIndex] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const startX = useRef<number | null>(null)
  const pages = PORTFOLIO_VIDEOS
  const total = pages.length

  const next = () => setIndex((i) => Math.min(total, i + 1))
  const prev = () => setIndex((i) => Math.max(0, i - 1))

  return (
    <div
      className="relative mx-auto w-full max-w-4xl select-none"
      tabIndex={0}
      role="region"
      aria-label="Portfolio : livre interactif, flèches du clavier pour tourner les pages"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next()
        if (e.key === "ArrowLeft") prev()
      }}
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (dx < -60) next()
        if (dx > 60) prev()
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({
          x: ((e.clientY - r.top) / r.height - 0.5) * -5,
          y: ((e.clientX - r.left) / r.width - 0.5) * 7,
        })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="relative aspect-video w-full" style={{ perspective: "1800px" }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {pages.map((p, i) => {
            const turned = i < index
            // on ne charge la vidéo que pour la page visible et ses voisines
            const loaded = Math.abs(i - index) <= 1 || (index === total && i === total - 1)
            return (
              <div
                key={p.youtubeId}
                className="glass absolute inset-0 origin-left overflow-hidden rounded-r-xl border border-[rgba(147,197,253,0.2)] transition-transform duration-700 ease-in-out"
                style={{
                  transform: turned ? "rotateY(-172deg)" : "rotateY(0deg)",
                  zIndex: turned ? i : total - i,
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex h-full flex-col gap-3 p-4 sm:p-6">
                  <div className="relative min-h-0 flex-1 overflow-hidden rounded-lg bg-black">
                    {loaded && (
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={youtubeEmbed(p.youtubeId)}
                        title={p.title}
                        loading="lazy"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    )}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="metal-text font-display text-lg font-extrabold">{p.title}</span>
                    <span className="font-sub text-[10px] tracking-[0.25em] text-[var(--nz-gold)] uppercase">
                      {p.niche ?? "Portfolio"}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Vidéo précédente"
          className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-muted)]">
          {Math.min(index + 1, total)} / {total}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={index >= total - 1}
          aria-label="Vidéo suivante"
          className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
