"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PORTFOLIO_VIDEOS, youtubeEmbed } from "@/lib/portfolio"

/**
 * Livre « Nos réalisations » avec une physique de pages :
 * - couverture rigide, tranche des feuilles visible, reliure centrale ;
 * - chaque feuille pivote sur la reliure avec une courbe d'accélération douce ;
 * - l'ombrage du recto et du verso varie pendant le tournage ;
 * - une ombre portée suit la feuille qui passe au-dessus.
 * Clic, flèches du clavier ou glissement au doigt.
 */
const TURN_MS = 1100
const EASE = "cubic-bezier(.45,.05,.2,1)"

export function Book3D() {
  const n = PORTFOLIO_VIDEOS.length
  // f = nombre de feuilles tournées : 0 = fermé, n + 1 = dernière page affichée
  const [f, setF] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  // sens du dernier tournage : sert à choisir la déformation de la feuille qui bouge
  const [dir, setDir] = useState<"fwd" | "back">("fwd")
  const startX = useRef<number | null>(null)
  const go = (to: number) => {
    setDir(to > f ? "fwd" : "back")
    setF(to)
  }
  const next = () => go(Math.min(n + 1, f + 1))
  const prev = () => go(Math.max(0, f - 1))

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  // Feuille 0 : couverture (recto) et sommaire (verso). Feuille i : vidéo i (recto) et sa fiche (verso).
  const sheets = [
    { kind: "cover" as const, index: -1 },
    ...PORTFOLIO_VIDEOS.map((_, i) => ({ kind: "video" as const, index: i })),
  ]
  const near = (i: number) => Math.abs(i - f) <= 1
  const total = sheets.length

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
      {/* Ombre de sol : le livre pose sur une surface */}
      <div className="pointer-events-none absolute inset-x-[8%] -bottom-4 h-10 rounded-[50%] bg-black/70 blur-2xl" />

      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]" style={{ perspective: "2400px" }}>
        <div
          className="absolute inset-0 transition-transform duration-700 ease-out"
          style={{ transformStyle: "preserve-3d", transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          {/* Planche de fond : tranche des pages à droite et à gauche */}
          <div className="absolute inset-y-[2%] left-[1%] right-[1%] rounded-[14px] bg-[linear-gradient(180deg,#1b2535,#0a0c10)] shadow-[0_30px_60px_-20px_rgba(0,0,0,.9)]" />
          <div className="absolute inset-y-[3%] left-[2%] right-[2%] rounded-md bg-[repeating-linear-gradient(90deg,#d9dde4_0,#d9dde4_1px,#9aa3b2_1px,#9aa3b2_2px)] opacity-80" />

          {/* Feuilles */}
          {sheets.map((s, i) => {
            const turned = i < f
            const isCover = s.kind === "cover"
            const z = turned ? i + 1 : total - i
            // la feuille qui vient de bouger se plie comme du papier journal
            const moving = dir === "fwd" ? i === f - 1 : i === f
            const bend = moving
              ? `${dir === "fwd" ? "page-bend-fwd" : "page-bend-back"} ${TURN_MS}ms ${EASE} both`
              : undefined
            return (
              <div
                key={i}
                className="absolute inset-y-[3%] left-1/2 w-1/2 origin-left"
                style={{
                  transformStyle: "preserve-3d",
                  transform: turned ? "rotateY(-180deg)" : "rotateY(0deg)",
                  transition: `transform ${TURN_MS}ms ${EASE}`,
                  animation: bend,
                  zIndex: z,
                }}
              >
                {/* Recto */}
                <div
                  className={`absolute inset-0 overflow-hidden ${isCover ? "rounded-r-[10px] border-[3px] border-[#c9a227]/70 bg-[linear-gradient(160deg,#1b2535,#0a0c10_75%)] shadow-[inset_0_0_30px_rgba(0,0,0,.6)]" : "rounded-r-md bg-[linear-gradient(90deg,#0f1521_0%,#111827_12%,#0d1320_100%)]"}`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {!isCover && (
                    <div className="absolute inset-0 bg-gradient-to-l from-black/0 via-black/0 to-black/60" />
                  )}
                  {/* ombrage qui s'accentue quand la page part */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.75),rgba(0,0,0,0)_60%)] transition-opacity"
                    style={{ opacity: turned ? 0.55 : 0, transitionDuration: `${TURN_MS}ms`, transitionTimingFunction: EASE }}
                  />
                  {isCover ? (
                    <button
                      type="button"
                      onClick={next}
                      disabled={f > 0}
                      aria-label="Ouvrir le livre"
                      className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center disabled:cursor-default"
                    >
                      <span className="font-sub text-[10px] tracking-[0.35em] text-[var(--nz-gold)] uppercase">Novazure</span>
                      <span className="metal-text font-display text-3xl font-extrabold sm:text-5xl">Réalisations</span>
                      {f === 0 && (
                        <span className="font-sub text-[10px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">
                          Cliquez pour ouvrir
                        </span>
                      )}
                    </button>
                  ) : (
                    <div className="flex h-full flex-col justify-center gap-3 p-3 sm:p-6">
                      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black shadow-[0_0_0_1px_rgba(147,197,253,.2)]">
                        {near(i) && (
                          <iframe
                            className="absolute inset-0 h-full w-full"
                            src={youtubeEmbed(PORTFOLIO_VIDEOS[s.index].youtubeId)}
                            title={PORTFOLIO_VIDEOS[s.index].title}
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
                  className={`absolute inset-0 overflow-hidden ${isCover ? "rounded-l-[10px] bg-[linear-gradient(200deg,#111827,#0a0c10)]" : "rounded-l-md bg-[linear-gradient(270deg,#0f1521,#111827_12%,#0d1320)]"}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(270deg,rgba(0,0,0,.75),rgba(0,0,0,0)_60%)] transition-opacity"
                    style={{ opacity: turned ? 0 : 0.5, transitionDuration: `${TURN_MS}ms`, transitionTimingFunction: EASE }}
                  />
                  {isCover ? (
                    <div className="flex h-full flex-col gap-3 p-5 sm:p-8">
                      <span className="font-sub text-[10px] tracking-[0.3em] text-[var(--nz-gold)] uppercase">Sommaire</span>
                      <ul className="grid gap-1">
                        {PORTFOLIO_VIDEOS.map((v, k) => (
                          <li key={v.youtubeId}>
                            <button
                              type="button"
                              onClick={() => go(k + 2)}
                              className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-white/5"
                            >
                              <span className="text-[var(--nz-muted)]">{String(k + 1).padStart(2, "0")}</span>
                              <span className="ml-3">{v.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex h-full flex-col justify-end gap-2 p-5 sm:p-8">
                      <span className="font-sub text-[10px] tracking-[0.25em] text-[var(--nz-gold)] uppercase">
                        {PORTFOLIO_VIDEOS[s.index].niche ?? "Réalisation"}
                      </span>
                      <span className="metal-text font-display text-xl font-extrabold sm:text-2xl">
                        {PORTFOLIO_VIDEOS[s.index].title}
                      </span>
                      <a
                        href={`https://www.youtube.com/watch?v=${PORTFOLIO_VIDEOS[s.index].youtubeId}`}
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
