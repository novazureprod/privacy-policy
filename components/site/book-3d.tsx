"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PORTFOLIO_VIDEOS, youtubeEmbed } from "@/lib/portfolio"

/**
 * Livre « Réalisations » : couverture, table des matières, puis une feuille par vidéo.
 * Chaque feuille se tourne en 3D. Clic, flèches du clavier ou glissement au doigt.
 * Une vidéo n'est chargée que si sa page est affichée ou toute proche.
 */
export function Book3D() {
  const n = PORTFOLIO_VIDEOS.length
  // f = nombre de feuilles tournées : 0 = livre fermé, n + 1 = dernière page affichée
  const [f, setF] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const startX = useRef<number | null>(null)
  const next = () => setF((v) => Math.min(n + 1, v + 1))
  const prev = () => setF((v) => Math.max(0, v - 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  // Feuille 0 : couverture (recto) et table des matières (verso).
  // Feuille i (1..n) : vidéo i (recto) et sa fiche (verso).
  const sheets: { front: "cover" | "video"; back: "contents" | "info"; index: number }[] = [
    { front: "cover", back: "contents", index: -1 },
    ...PORTFOLIO_VIDEOS.map((_, i) => ({ front: "video" as const, back: "info" as const, index: i })),
  ]
  const near = (i: number) => Math.abs(i - f) <= 1

  return (
    <div
      className="relative mx-auto w-full max-w-4xl select-none"
      tabIndex={0}
      role="region"
      aria-label="Réalisations : livre interactif, flèches du clavier pour tourner les pages"
      onPointerDown={(e) => (startX.current = e.clientX)}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (dx < -50) next()
        if (dx > 50) prev()
      }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return
        const r = e.currentTarget.getBoundingClientRect()
        setTilt({ x: ((e.clientY - r.top) / r.height - 0.5) * -4, y: ((e.clientX - r.left) / r.width - 0.5) * 6 })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]" style={{ perspective: "2000px" }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Fond du livre : deux pages de chaque côté du dos */}
          <div className="glass absolute inset-y-[3%] left-[2%] right-[2%] rounded-xl bg-[linear-gradient(180deg,#111827,#0a0c10)]" />

          {sheets.map((s, i) => {
            const turned = i < f
            const isCover = s.front === "cover"
            return (
              <div
                key={i}
                className="absolute inset-y-[3%] left-1/2 w-1/2 origin-left transition-transform duration-[900ms] ease-in-out"
                style={{
                  transformStyle: "preserve-3d",
                  transform: turned ? "rotateY(-180deg)" : "rotateY(0deg)",
                  zIndex: turned ? i : sheets.length - i,
                }}
              >
                {/* Recto */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-r-xl border border-[rgba(147,197,253,0.2)] bg-[linear-gradient(160deg,#111827,#0a0c10_70%)]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {isCover ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={f > 0}
                      aria-label="Ouvrir le livre"
                      className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center disabled:cursor-default"
                    >
                      <span className="font-sub text-[10px] tracking-[0.35em] text-[var(--nz-gold)] uppercase">Novazure</span>
                      <span className="metal-text font-display text-3xl font-extrabold sm:text-4xl">Réalisations</span>
                      {f === 0 && <span className="font-sub text-[10px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">Cliquez pour ouvrir</span>}
                    </button>
                  ) : (
                    <div className="flex h-full flex-col justify-center gap-3 p-3 sm:p-5">
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                        {near(i) && (
                          <iframe
                            className="absolute inset-0 h-full w-full"
                            src={youtubeEmbed(PORTFOLIO_VIDEOS[s.index!].youtubeId)}
                            title={PORTFOLIO_VIDEOS[s.index!].title}
                            loading="lazy"
                            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Verso */}
                <div
                  className="absolute inset-0 overflow-hidden rounded-l-xl border border-[rgba(147,197,253,0.2)] bg-[linear-gradient(200deg,#111827,#0a0c10_70%)]"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {s.back === "contents" ? (
                    <div className="flex h-full flex-col gap-3 p-5 sm:p-8">
                      <span className="font-sub text-[10px] tracking-[0.3em] text-[var(--nz-gold)] uppercase">Sommaire</span>
                      <ul className="grid gap-1">
                        {PORTFOLIO_VIDEOS.map((v, k) => (
                          <li key={v.youtubeId}>
                            <button
                              type="button"
                              onClick={() => setF(k + 2)}
                              className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5"
                            >
                              <span className="text-[var(--nz-muted)]">{String(k + 1).padStart(2, "0")}</span>{" "}
                              <span className="ml-2">{v.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col justify-end gap-2 p-5 sm:p-8">
                      <span className="font-sub text-[10px] tracking-[0.25em] text-[var(--nz-gold)] uppercase">
                        {PORTFOLIO_VIDEOS[s.index!].niche ?? "Réalisation"}
                      </span>
                      <span className="metal-text font-display text-xl font-extrabold sm:text-2xl">
                        {PORTFOLIO_VIDEOS[s.index!].title}
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${PORTFOLIO_VIDEOS[s.index!].youtubeId}`}
                        target="_blank"
                        rel="noopener"
                        className="text-xs text-[var(--nz-muted)] underline underline-offset-4"
                      >
                        Voir sur YouTube
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={prev} disabled={f === 0} aria-label="Page précédente" className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30">
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-muted)]">
          {f === 0 ? "Fermé" : f > n ? "Fin" : `Réalisation ${f} / ${n}`}
        </span>
        <button type="button" onClick={next} disabled={f >= n + 1} aria-label="Page suivante" className="glass glass-gold grid h-11 w-11 place-items-center rounded-full disabled:opacity-30">
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
