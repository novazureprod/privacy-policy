import type { ReactNode } from "react"
import { Header } from "./header"
import { Footer } from "./footer"

/** Mise en page sobre des pages légales : titre, date de mise à jour, sections lisibles. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <main className="relative">
      <Header />
      <article className="legal mx-auto max-w-3xl px-5 pt-36 pb-24 sm:px-10">
        <p className="eyebrow">Informations</p>
        <h1 className="metal-text mt-3 font-display text-4xl font-extrabold sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-[var(--nz-muted)]">Mise à jour : {updated}</p>
        <div className="glass mt-10 rounded-2xl p-7 sm:p-10">{children}</div>
      </article>
      <Footer />
    </main>
  )
}

/** Champ à compléter, mis en évidence pour ne pas être oublié avant la mise en ligne. */
export function ToFill({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-[rgba(92,184,255,0.18)] px-1.5 py-0.5 text-[var(--nz-gold)]">{children}</mark>
}
