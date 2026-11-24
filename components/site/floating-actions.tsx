"use client"

import { useEffect, useState } from "react"
import { ArrowUp, CalendarDays } from "lucide-react"
import { SITE } from "@/lib/site"

/**
 * Actions flottantes, visibles une fois l'accueil dépassé :
 * « Rendez-vous » en bas de l'écran sur téléphone, et retour en haut de page.
 */
export function FloatingActions() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-4 z-30 flex items-end justify-between px-4 transition-all duration-500 sm:bottom-6 sm:px-6 ${
        shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      aria-hidden={!shown}
    >
      <a
        href="/#rdv"
        tabIndex={shown ? 0 : -1}
        className="glass glass-gold pointer-events-auto mx-auto flex items-center gap-2 rounded-full px-6 py-3 font-sub text-[11px] tracking-[0.2em] text-[var(--nz-gold)] uppercase lg:hidden"
      >
        <CalendarDays className="h-4 w-4" aria-hidden="true" />
        Rendez-vous
      </a>
      <button
        type="button"
        tabIndex={shown ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="glass glass-gold pointer-events-auto ml-auto hidden h-11 w-11 place-items-center rounded-full lg:grid"
        aria-label="Revenir en haut de la page"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
