"use client"

import { useEffect, useRef } from "react"

/** Fond WebGL « vagues de poussière d'or » (three.js chargé à part, après l'affichage de la page). */
export function DustBackground() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let stop: (() => void) | undefined
    let gone = false
    import("@/lib/dust-waves").then(({ mountDustWaves }) => {
      if (!gone) stop = mountDustWaves(el)
    })
    return () => {
      gone = true
      stop?.()
    }
  }, [])
  return <div ref={ref} className="absolute inset-0" />
}
