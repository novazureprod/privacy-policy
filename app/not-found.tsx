import Link from "next/link"
import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"

export const metadata: Metadata = { title: "Page introuvable — Novazure" }

export default function NotFound() {
  return (
    <main className="relative">
      <Header />
      <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="metal-text mt-4 font-display text-5xl font-extrabold sm:text-7xl">Plan coupé au montage.</h1>
        <p className="mt-5 max-w-md text-[var(--nz-muted)]">Cette page n&apos;existe pas, ou plus. Les films, eux, sont toujours là.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="glass glass-gold rounded-full px-9 py-3.5 font-sub text-xs tracking-[0.2em] uppercase">
            Accueil
          </Link>
          <Link href="/portfolio" className="glass glass-gold rounded-full px-9 py-3.5 font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)] uppercase">
            Réalisations
          </Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
