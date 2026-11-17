"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Page = { title: string; caption: string }

// Pages de démonstration : à remplacer par les vraies vidéos du portfolio.
const PAGES: Page[] = [
  { title: "Restaurant", caption: "Ambiance et cuisine" },
  { title: "Immobilier", caption: "Visite cinématique" },
  { title: "Mariage", caption: "Le jour J" },
  { title: "Domaine viticole", caption: "Vignes et chai" },
  { title: "Entreprise", caption: "Présentation institutionnelle" },
]

/** Livre 3D interactif : les pages se tournent au clic, au clavier ou au doigt. */
export function Book3D() {
  const [index, setIndex] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const next = () => setIndex((i) => Math.min(PAGES.length, i + 1))
  const prev = () => setIndex((i) => Math.max(0, i - 1))

  return (
    <div
      className="relative mx-auto w-full max-w-3xl select-none"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next()
        if (e.key === "ArrowLeft") prev()
      }}
      tabIndex={0}
      aria-label="Portfolio : livre interactif, utilisez les flèches pour tourner les pages"
      role="region"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({
          x: ((e.clientY - r.top) / r.height - 0.5) * -6,
          y: ((e.clientX - r.left) / r.width - 0.5) * 8,
        })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="relative aspect-[16/10] w-full" style={{ perspective: "1600px" }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Couverture de fond */}
          <div className="glass absolute inset-y-0 left-1/2 w-[52%] -translate-x-1/2 rounded-r-xl bg-gradient-to-br from-[#1e3a8a] to-[#0a0c10]" />

          {PAGES.map((p, i) => {
            const turned = i < index
            return (
              <button
                key={p.title}
                type="button"
                onClick={() => (turned ? prev() : next())}
                aria-label={`Page ${i + 1} : ${p.title}`}
                className="absolute inset-y-0 left-1/2 w-[50%] origin-left rounded-r-xl border border-[rgba(147,197,253,0.2)] bg-[linear-gradient(160deg,#111827,#0a0c10_70%)] text-left transition-transform duration-700 ease-in-out"
                style={{
                  transform: turned ? "rotateY(-172deg)" : "rotateY(0deg)",
                  zIndex: turned ? i : PAGES.length - i,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="flex h-full flex-col justify-end gap-3 p-6 sm:p-8">
                  <span className="font-sub text-[10px] tracking-[0.3em] uppercase text-[var(--nz-gold)]">
                    Vidéo à venir
                  </span>
                  <span className="metal-text font-display text-2xl font-extrabold sm:text-3xl">{p.title}</span>
                  <span className="text-sm text-[var(--nz-muted)]">{p.caption}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Page précédente"
          className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-muted)]">
          {Math.min(index + 1, PAGES.length)} / {PAGES.length}
        </span>
        <button
          type="button"
          onClick={next}
          disabled={index === PAGES.length}
          aria-label="Page suivante"
          className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
