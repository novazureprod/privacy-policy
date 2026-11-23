"use client"

import Link from "next/link"
import { useCallback, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Intro } from "./intro"
import { NICHES } from "@/lib/niches"
import { SITE } from "@/lib/site"

/** Accueil : intro du phénix, puis texte d'accueil, accès direct aux activités et invitation à défiler. */
export function HomeHero() {
  const [ready, setReady] = useState(false)
  const onDone = useCallback(() => setReady(true), [])

  return (
    <section className="relative w-full">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Intro onDone={onDone}>
          <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center px-6 pt-24 pb-24 text-center transition-all duration-[1400ms] ease-out ${
              ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            <p className="eyebrow">Vidéaste · Drone · Côte d&apos;Azur</p>
            <h1 className="metal-text mt-4 max-w-2xl font-display text-4xl leading-tight font-extrabold sm:text-6xl">
              Votre histoire, en mouvement.
            </h1>
            <p className="mt-4 max-w-md text-sm text-[var(--nz-muted)] sm:text-base">
              Choisissez votre activité pour voir ce que nous faisons pour vous.
            </p>
            <ul className="mt-6 hidden max-w-2xl flex-wrap justify-center gap-2 sm:flex" aria-label="Activités">
              {NICHES.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/${n.slug}`}
                    className="glass glass-gold inline-block rounded-full px-4 py-1.5 font-sub text-[11px] tracking-[0.14em] text-[var(--nz-text)] uppercase"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href={SITE.calendly}
              target="_blank"
              rel="noopener"
              className="glass glass-gold mt-7 rounded-full px-8 py-3 font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)] uppercase"
            >
              Prendre rendez-vous
            </a>
            <a
              href="#realisations"
              className="scroll-cue absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 font-sub text-[10px] tracking-[0.3em] text-[var(--nz-muted)] uppercase"
            >
              Réalisations
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </Intro>
      </div>
    </section>
  )
}
