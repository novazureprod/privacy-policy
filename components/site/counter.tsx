"use client"

import { useEffect, useRef, useState } from "react"

/** Compteur animé : affiche la vraie valeur (lisible sans JavaScript), puis remonte depuis 0 quand il apparaît à l'écran. */
export function Counter({ to, suffix = "", duration = 1600 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const step = (now: number) => {
        const t = instant ? 1 : Math.min(1, (now - start) / duration)
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))))
        if (t < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [to, duration])
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
