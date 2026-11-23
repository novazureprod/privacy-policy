"use client"

import { useRouter } from "next/navigation"
import GlassFolder, { type ArtPreset, type FolderMenuItem } from "@/components/ui/glass-folder-cards"
import { NICHES, CALENDLY_URL } from "@/lib/niches"

// Une couleur de dossier par niche, dans la palette bleu / or de la charte.
const FOLDER_ART: Record<string, ArtPreset> = {
  restaurants: "ember",
  immobilier: "glacier",
  mariage: "dusk",
  societes: "glacier",
  associations: "verdant",
  "domaines-viticoles": "verdant",
  "domaines-de-mariage": "dusk",
}

/** Une carte de dossier par niche, comme dans la démo : ouverture au clic, fichiers à l'intérieur, menu ···. */
export function NicheFolders() {
  const router = useRouter()

  return (
    <div className="mx-auto mt-14 grid max-w-6xl grid-cols-1 justify-items-center gap-x-10 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
      {NICHES.map((n, i) => {
        const menu: FolderMenuItem[] = [
          { label: `Découvrir ${n.label.toLowerCase()}`, onSelect: () => router.push(`/${n.slug}`) },
          { label: "Prendre rendez-vous", onSelect: () => window.open(CALENDLY_URL, "_blank", "noopener") },
        ]
        return (
          <GlassFolder
            key={n.slug}
            label={n.label}
            tone={i % 2 === 0 ? "dark" : "light"}
            art={FOLDER_ART[n.slug] ?? "glacier"}
            seed={n.label.length}
            action="more"
            menu={menu}
            labelPlacement="bottom-left"
            width={320}
            files={n.offer.map((o) => ({ name: o, meta: n.label, href: `/${n.slug}` }))}
          />
        )
      })}
    </div>
  )
}
