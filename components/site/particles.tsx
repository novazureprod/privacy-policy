"use client"

import { useEffect, useRef } from "react"

/**
 * Fond animé « satin et poussière d'or » : un drap de satin bleu fait de fines lignes qui
 * ondulent comme un tissu (les plis accrochent la lumière), une poussière d'or posée sur la crête
 * qui s'élève lentement vers le haut, et un bokeh flou au premier plan.
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
    let small = false
    const LINES = 54

    // Forme du drap : chaque ligne i est un fil du tissu ; les plis viennent de plusieurs ondes.
    const fold = (x: number, i: number, time: number) => {
      const u = x / w
      const k = i / LINES
      const base = h * (0.42 + k * 0.5) - h * 0.22 * u * (1 - k * 0.6)
      return (
        base +
        Math.sin(u * 4.2 + time * 0.22 + k * 1.6) * h * 0.05 * (1 - k * 0.4) +
        Math.sin(u * 9.5 - time * 0.16 + k * 3.1) * h * 0.018 +
        Math.sin(u * 2.1 + time * 0.12 - k * 2.4) * h * 0.04
      )
    }

    // Grain posé sur le tissu (suit les plis) ou grain qui s'élève vers le haut.
    type Grain = { u: number; i: number; r: number; ph: number; gold: boolean }
    type Rise = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number; gold: boolean }
    type Bokeh = { x: number; y: number; r: number; vy: number; a: number; gold: boolean }
    let grains: Grain[] = []
    let rising: Rise[] = []
    let bokeh: Bokeh[] = []

    const spawnRise = (anywhere = false): Rise => {
      const x = Math.random() * w
      const i = Math.abs((Math.random() + Math.random() - 1) * 10)
      const y = anywhere ? Math.random() * h : fold(x, i, t)
      // Montée lente : les grains flottent longtemps dans l'air avant de s'éteindre.
      const max = 700 + Math.random() * 900
      return {
        x,
        y,
        vx: (Math.random() - 0.4) * 0.12,
        vy: -(0.05 + Math.random() * 0.16),
        r: Math.random() < 0.15 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.1 + 0.4,
        life: anywhere ? Math.random() * max : 0,
        max,
        gold: Math.random() < 0.85,
      }
    }

    const size = () => {
      const d = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      small = w < 700
      canvas.width = w * d
      canvas.height = h * d
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(d, 0, 0, d, 0, 0)
      grains = Array.from({ length: small ? 520 : 1100 }, () => ({
        u: Math.random(),
        // Concentrés sur les premiers fils (la crête), plus rares en descendant.
        i: Math.pow(Math.random(), 2.2) * LINES * 0.55,
        r: Math.random() < 0.1 ? Math.random() * 1.6 + 1.1 : Math.random() * 1.1 + 0.35,
        ph: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.85,
      }))
      rising = Array.from({ length: small ? 110 : 240 }, () => spawnRise(true))
      bokeh = Array.from({ length: small ? 14 : 24 }, () => ({
        x: Math.random() * w,
        y: h * (0.7 + Math.random() * 0.35),
        r: Math.random() * (small ? 12 : 20) + 6,
        vy: -(0.05 + Math.random() * 0.12),
        a: Math.random() * 0.2 + 0.07,
        gold: Math.random() < 0.7,
      }))
    }

    const satin = () => {
      const step = small ? 18 : 12
      const stops = 9
      for (let i = 0; i < LINES; i++) {
        // Éclairage du fil : plus clair là où le pli monte (pente), comme la lumière sur du satin.
        const grad = ctx.createLinearGradient(0, 0, w, 0)
        for (let s = 0; s <= stops; s++) {
          const x = (s / stops) * w
          const slope = (fold(x + 6, i, t) - fold(x - 6, i, t)) / 12
          const light = Math.max(0, Math.min(1, 0.25 - slope * 3.2))
          const depth = 1 - i / LINES
          const a = (0.025 + light * 0.16) * (0.35 + depth * 0.65)
          grad.addColorStop(s / stops, `rgba(${Math.round(40 + light * 70)}, ${Math.round(90 + light * 90)}, ${Math.round(200 + light * 55)}, ${a})`)
        }
        ctx.beginPath()
        for (let x = -step; x <= w + step; x += step) {
          const y = fold(x, i, t)
          if (x === -step) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = grad
        // Fils larges qui se chevauchent : la surface paraît continue, comme un tissu.
        ctx.lineWidth = ((h * 0.5) / LINES) * 2.2
        ctx.stroke()
      }
    }

    const dot = (x: number, y: number, r: number, gold: boolean, a: number) => {
      ctx.fillStyle = gold ? `rgba(246, 190, 98, ${a})` : `rgba(240, 226, 200, ${a})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const frame = () => {
      ctx.clearRect(0, 0, w, h)

      ctx.globalCompositeOperation = "lighter"
      ctx.filter = small ? "none" : "blur(1.5px)"
      satin()
      ctx.filter = "none"
      ctx.globalCompositeOperation = "source-over"

      // Poussière posée sur le tissu : suit les plis et scintille
      for (const g of grains) {
        const x = g.u * w
        const y = fold(x, g.i, t) - 2
        const tw = 0.5 + 0.5 * Math.sin(t * 2.2 + g.ph)
        dot(x, y, g.r, g.gold, Math.min(1, tw * (1 - g.i / LINES) * 1.25))
      }

      // Poussière qui s'élève vers le haut, se balance un peu et s'éteint
      for (let k = 0; k < rising.length; k++) {
        const p = rising[k]
        if (!reduce) {
          p.life++
          p.x += p.vx + Math.sin((p.life + k * 13) / 90) * 0.12
          p.y += p.vy
        }
        const f = p.life / p.max
        if (f >= 1 || p.y < -10) {
          rising[k] = spawnRise()
          continue
        }
        dot(p.x, p.y, p.r, p.gold, Math.sin(Math.PI * f) * 0.9)
      }

      // Bokeh flou du premier plan, qui monte lui aussi très lentement
      ctx.globalCompositeOperation = "lighter"
      for (const b of bokeh) {
        if (!reduce) {
          b.y += b.vy
          if (b.y < h * 0.55) b.y = h * (1 + Math.random() * 0.1)
        }
        const col = b.gold ? "232, 176, 96" : "90, 140, 230"
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        g.addColorStop(0, `rgba(${col}, ${b.a})`)
        g.addColorStop(0.7, `rgba(${col}, ${b.a * 0.55})`)
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
