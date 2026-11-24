"use client"

import { useEffect, useRef } from "react"

/**
 * Fond animé « poussière d'or » : une vague de particules dorées et beiges posée sur un voile
 * de soie bleue, des grains qui se détachent et s'envolent, et un bokeh flou au premier plan.
 * Une seule image fixe si l'utilisateur préfère moins de mouvement.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let w = 0
    let h = 0
    let raf = 0
    let t = 0

    // Grain de la vague : position le long de la vague (u), écart à la crête (v), taille, scintillement.
    type Dust = { u: number; v: number; r: number; s: number; ph: number; gold: boolean }
    // Grain qui s'est détaché et s'envole.
    type Spark = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number }
    // Bokeh flou du premier plan.
    type Bokeh = { x: number; y: number; r: number; vx: number; a: number; gold: boolean }
    let dust: Dust[] = []
    let sparks: Spark[] = []
    let bokeh: Bokeh[] = []

    // Crête de la vague principale : monte de gauche à droite, ondule lentement.
    const wave = (x: number, time: number, k = 1) =>
      h * (0.62 - 0.2 * (x / w) * k) + Math.sin(x / (w * 0.22) + time * 0.35) * h * 0.035 + Math.sin(x / (w * 0.09) - time * 0.5) * h * 0.012

    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5

    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * d
      canvas.height = h * d
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(d, 0, 0, d, 0, 0)
      const small = w < 700
      const n = small ? 650 : 1400
      dust = Array.from({ length: n }, () => {
        // Plus dense juste sous la crête, plus clairsemé en descendant.
        const below = Math.abs(gauss()) * h * (Math.random() < 0.75 ? 0.18 : 0.42)
        return {
          u: Math.random(),
          v: Math.random() < 0.12 ? -Math.random() * h * 0.05 : below,
          r: Math.random() < 0.1 ? Math.random() * 2 + 1.4 : Math.random() * 1.3 + 0.45,
          s: (Math.random() * 0.6 + 0.4) * 0.00012,
          ph: Math.random() * Math.PI * 2,
          gold: Math.random() < 0.85,
        }
      })
      bokeh = Array.from({ length: small ? 14 : 26 }, () => ({
        x: Math.random() * w,
        y: h * (0.72 + Math.random() * 0.3),
        r: Math.random() * (small ? 12 : 18) + 6,
        vx: (Math.random() - 0.5) * 0.08,
        a: Math.random() * 0.22 + 0.08,
        gold: Math.random() < 0.7,
      }))
      sparks = []
    }

    const silk = (time: number, offset: number, width: number, alpha: number, k: number) => {
      // Voile de soie : plusieurs traits larges et transparents qui suivent la vague.
      for (let layer = 0; layer < 6; layer++) {
        ctx.beginPath()
        for (let x = -20; x <= w + 20; x += 24) {
          const y = wave(x, time + offset, k) + offset * h * 0.25 + layer * 4
          if (x === -20) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.lineWidth = width * (1 - layer * 0.12)
        ctx.strokeStyle = `rgba(52, 104, 214, ${alpha * (1 - layer * 0.14)})`
        ctx.stroke()
      }
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"

      silk(t, 0, h * 0.09, 0.085, 1)
      silk(t * 0.8, 0.55, h * 0.12, 0.06, 0.6)
      // Les grains restent dorés : pas de mélange additif qui les blanchirait.
      ctx.globalCompositeOperation = "source-over"

      // Poussière d'or le long de la vague
      for (const p of dust) {
        if (!reduce) p.u = (p.u + p.s * 16) % 1.08
        const x = p.u * (w + 40) - 20
        const y = wave(x, t) + p.v
        const tw = 0.55 + 0.45 * Math.sin(t * 2 + p.ph)
        const depth = Math.max(0.25, 1 - p.v / (h * 0.5))
        const a = Math.min(1, tw * depth * (p.gold ? 1.15 : 0.8))
        ctx.fillStyle = p.gold ? `rgba(246, 188, 96, ${a})` : `rgba(240, 228, 205, ${a})`
        ctx.beginPath()
        ctx.arc(x, y, p.r, 0, Math.PI * 2)
        ctx.fill()
        // Quelques grains de la crête se détachent et s'envolent
        if (!reduce && p.v < h * 0.02 && Math.random() < 0.0009 && sparks.length < 60) {
          const max = 180 + Math.random() * 160
          sparks.push({ x, y, vx: 0.15 + Math.random() * 0.35, vy: -(0.25 + Math.random() * 0.45), r: p.r * 0.9 + 0.4, life: 0, max })
        }
      }

      ctx.globalCompositeOperation = "lighter"
      // Grains détachés : montent, ralentissent, s'éteignent
      sparks = sparks.filter((s) => s.life < s.max)
      for (const s of sparks) {
        s.life++
        s.x += s.vx
        s.y += s.vy
        s.vy *= 0.996
        const k = s.life / s.max
        const a = Math.sin(Math.PI * k) * 0.9
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4)
        g.addColorStop(0, `rgba(240, 205, 135, ${a})`)
        g.addColorStop(1, "rgba(240, 205, 135, 0)")
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Bokeh flou du premier plan
      for (const b of bokeh) {
        if (!reduce) {
          b.x += b.vx
          if (b.x < -40) b.x = w + 40
          if (b.x > w + 40) b.x = -40
        }
        const pulse = 0.8 + 0.2 * Math.sin(t * 0.8 + b.x)
        const col = b.gold ? "232, 176, 96" : "90, 140, 230"
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, `rgba(${col}, ${b.a * pulse})`)
        g.addColorStop(0.7, `rgba(${col}, ${b.a * pulse * 0.55})`)
        g.addColorStop(1, `rgba(${col}, 0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = "source-over"
      t += 0.016
      if (!reduce) raf = requestAnimationFrame(frame)
    }

    size()
    frame()
    window.addEventListener("resize", size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", size)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0" />
}
