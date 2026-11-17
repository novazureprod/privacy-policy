import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Novazure — vidéaste",
  description: "Films et vidéos pour restaurants, immobilier, mariages, entreprises, associations et domaines.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
