import type { Metadata } from "next"
import "./globals.css"
import { AmbientBackground } from "@/components/site/ambient-background"

export const metadata: Metadata = {
  title: "Novazure — vidéaste",
  description: "Films et vidéos pour restaurants, immobilier, mariages, entreprises, associations et domaines.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className="relative min-h-screen antialiased">
        <AmbientBackground />
        {children}
      </body>
    </html>
  )
}
