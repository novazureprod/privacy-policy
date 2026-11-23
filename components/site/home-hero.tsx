"use client"

import { useCallback, useState } from "react"
import { Intro } from "./intro"
import { CALENDLY_URL } from "@/lib/niches"

/** Accueil : fond de particules, intro du phénix, texte d'accueil, puis le livre portfolio. */
export function HomeHero() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  return (
    <section className="relative w-full">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Intro onDone={onDone}>
          <div
            className={`absolute inset-x-0 top-1/2 bottom-0 z-10 flex flex-col items-center justify-start px-6 pt-4 text-center transition-all duration-[1400ms] ease-out ${
              ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="font-sub text-xs tracking-[0.35em] text-[var(--nz-gold)] uppercase">Vidéaste · Azur</p>
            <h1 className="metal-text mt-4 max-w-2xl font-display text-4xl leading-tight font-extrabold sm:text-6xl">
              Votre histoire, en mouvement.
            </h1>
            <p className="mt-4 max-w-md text-sm text-[var(--nz-muted)] sm:text-base">
              Choisissez votre activité pour voir ce que nous faisons pour vous.
            </p>
            <a
              href={CALENDLY_URL}
              className="glass glass-gold mt-8 rounded-full px-8 py-3 font-sub text-xs tracking-[0.2em] text-[var(--nz-text)] uppercase"
            >
              Prendre rendez-vous
            </a>
          </div>
        </Intro>
      </div>

    </section>
  )
}
