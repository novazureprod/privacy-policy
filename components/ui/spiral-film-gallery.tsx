"use client"

import { useEffect, useRef, useState } from "react"

export type FilmFrame = {
  id: string
  image: string
  title: string
  subtitle?: string
}

type Props = {
  frames: FilmFrame[]
  onSelect?: (frame: FilmFrame) => void
  /** Vitesse de défilement automatique, en vignettes par seconde. */
  speed?: number
}

// Pellicule de cinéma enroulée en spirale (hélice) : chaque vignette a sa propre place
// le long de la bande. La bande tourne comme une vis, en boucle, sans superposition.
export function SpiralFilmGallery({ frames, onSelect, speed = 0.35 }: Props) {
  const stageRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<(HTMLDivElement | null)[]>([])
  const [dims, setDims] = useState({ w: 220, r: 380 })

  // Taille des vignettes et rayon de l'hélice selon la largeur disponible.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const fit = () => {
      const width = el.clientWidth
      const w = width < 480 ? 130 : width < 900 ? 165 : 190
      setDims({ w, r: Math.min(width * 0.38, w * 2.3) })
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const n = frames.length
    if (!n) return
    const frameW = dims.w + 8 // vignette + bord de pellicule
    const step = frameW / dims.r // angle (rad) entre deux vignettes : elles se touchent
    const perTurn = (2 * Math.PI) / step
    const frameH = dims.w * 1.25 + 44 // image 4:5 + bandes perforées
    const pitch = (frameH + 70) / perTurn // montée par vignette : un tour dépasse la hauteur d'une vignette
    const tilt = Math.atan2(pitch, frameW) * (180 / Math.PI)
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let pos = 0
    let paused = false
    let dragging = false
    let lastX = 0
    let velocity = 0
    let last = performance.now()
    let raf = 0

    const place = () => {
      for (let i = 0; i < n; i++) {
        const el = frameRefs.current[i]
        if (!el) continue
        // Position relative au centre, ramenée dans [-n/2, n/2) pour une boucle continue.
        let k = (((i - pos) % n) + n) % n
        if (k >= n / 2) k -= n
        const angle = k * step
        const facing = Math.cos(angle) // 1 devant, -1 derrière
        const edge = 1 - Math.min(1, Math.max(0, Math.abs(k) - (n / 2 - 2)) / 2) // fondu aux extrémités
        el.style.transform = `translate(-50%, -50%) translateY(${k * pitch}px) rotateY(${(angle * 180) / Math.PI}deg) translateZ(${dims.r}px) rotateZ(${tilt}deg)`
        el.style.opacity = String(Math.max(0, (facing > 0 ? 0.3 + 0.7 * facing : 0.1) * edge))
        el.style.zIndex = String(Math.round(facing * 100) + 100)
        el.style.pointerEvents = facing > 0.2 ? "auto" : "none"
      }
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      if (!dragging) {
        if (Math.abs(velocity) > 0.01) {
          pos += velocity * dt
          velocity *= Math.pow(0.04, dt)
        } else if (!paused && !reduce) {
          pos += speed * dt
        }
      }
      place()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const stage = stageRef.current!
    const pxPerFrame = frameW
    const down = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      velocity = 0
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const d = (lastX - e.clientX) / pxPerFrame
      pos += d
      velocity = d / 0.016
      lastX = e.clientX
    }
    const up = () => {
      dragging = false
    }
    const enter = () => (paused = true)
    const leave = () => {
      paused = false
      dragging = false
    }
    stage.addEventListener("pointerdown", down)
    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", up)
    stage.addEventListener("pointerenter", enter)
    stage.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(raf)
      stage.removeEventListener("pointerdown", down)
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      stage.removeEventListener("pointerenter", enter)
      stage.removeEventListener("pointerleave", leave)
    }
  }, [frames.length, dims, speed])

  // Un clic sans glisser ouvre la vidéo.
  const downAt = useRef(0)

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carrousel"
      aria-label="Réalisations Novazure"
      className="relative h-full w-full touch-pan-y select-none overflow-hidden"
      style={{ perspective: "1600px", perspectiveOrigin: "50% 40%" }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d", transform: "rotateX(8deg)" }}>
        {frames.map((f, i) => (
          <div
            key={f.id}
            ref={(el) => {
              frameRefs.current[i] = el
            }}
            role="group"
            aria-label={f.title}
            className="absolute top-1/2 left-1/2 cursor-pointer will-change-transform"
            style={{ width: dims.w + 8 }}
            onPointerDown={(e) => (downAt.current = e.clientX)}
            onClick={(e) => {
              if (Math.abs(e.clientX - downAt.current) < 6) onSelect?.(f)
            }}
          >
            <div className="film-frame bg-[#07080b] px-1 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
              <div className="film-holes h-[22px]" />
              <div className="relative overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
                <img src={f.image} alt={f.title} draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 text-white">
                  <p className="font-display text-sm leading-tight font-extrabold">{f.title}</p>
                  {f.subtitle && <p className="mt-1 font-sub text-[10px] tracking-[0.18em] text-[var(--nz-gold)] uppercase">{f.subtitle}</p>}
                </div>
              </div>
              <div className="film-holes h-[22px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
