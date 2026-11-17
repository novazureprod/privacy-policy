import { Header } from "@/components/site/header"
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero"

export const metadata = { title: "Portfolio — Novazure" }

// Le tunnel 3D reprend les images de démonstration du composant.
// À remplacer par les images extraites des vidéos du portfolio.
export default function PortfolioPage() {
  return (
    <main className="relative">
      <Header current="portfolio" />
      <PerspectiveTunnelHero />
    </main>
  )
}
