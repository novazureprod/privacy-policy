import type { Metadata, Viewport } from "next"
import "./globals.css"
import { AmbientBackground } from "@/components/site/ambient-background"
import { SITE } from "@/lib/site"

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Novazure — vidéaste et drone dans le Var et sur la Côte d'Azur",
  description:
    "Films et vidéos pour restaurants, immobilier, mariages, entreprises, associations et domaines. Tournage, drone, FPV et montage dans le Var et sur la Côte d'Azur.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Novazure",
    title: "Novazure — votre histoire, en mouvement",
    description: "Vidéaste et pilote de drone dans le Var et sur la Côte d'Azur.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Logo Novazure" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
  icons: { icon: "/icon.png", apple: "/icon.png" },
}

export const viewport: Viewport = {
  themeColor: "#112250",
  colorScheme: "dark",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <head>
        {/* Polices de la charte : préchargées pour éviter le changement de police à l'affichage */}
        <link rel="preload" href="/fonts/OpenSans-ExtraBold-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/PTSans-Regular-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body className="relative min-h-screen antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-[var(--nz-gold)] focus:px-5 focus:py-2 focus:text-[#112250]"
        >
          Aller au contenu
        </a>
        <AmbientBackground />
        <div id="contenu">{children}</div>
      </body>
    </html>
  )
}
