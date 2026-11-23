import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { VideoGrid } from "@/components/site/video-grid"
import { Reveal } from "@/components/site/reveal"
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

export const metadata: Metadata = {
  title: "Réalisations — Novazure",
  description: "Films pour restaurants, villas, domaines, mariages, entreprises et associations, dans le Var et sur la Côte d'Azur.",
  alternates: { canonical: "/portfolio" },
}

// Le tunnel reprend les images des films ; la molette le traverse, puis la page défile.
const tunnelImages = PORTFOLIO_VIDEOS.slice(0, 12).map((v) => ({ src: `/films/${v.youtubeId}.jpg`, title: v.title }))

export default function PortfolioPage() {
  return (
    <main className="relative">
      <Header current="portfolio" />
      <PerspectiveTunnelHero
        images={tunnelImages}
        eyebrow="Réalisations"
        title={
          <>
            NOS
            <br />
            FILMS.
          </>
        }
        subtitle="Faites défiler pour traverser le tunnel, puis découvrez tous les films."
        prompt="Défiler"
      />
      <section className="px-5 py-24 sm:px-10" aria-labelledby="titre-tous">
        <Reveal className="text-center">
          <p className="eyebrow">Tous les films</p>
          <h2 id="titre-tous" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
            Choisissez une activité
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 max-w-6xl">
          <VideoGrid videos={PORTFOLIO_VIDEOS} filters />
        </div>
      </section>
      <Footer />
    </main>
  )
}
