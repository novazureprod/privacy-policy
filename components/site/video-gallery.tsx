"use client"

import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

// Une carte par vidéo : miniature maison (sinon YouTube), titre et niche. Un clic ouvre la vidéo sur YouTube.
const items: GalleryItem[] = PORTFOLIO_VIDEOS.map((v) => ({
  common: v.title,
  binomial: v.niche ?? "Réalisation",
  photo: {
    url: v.thumbnail ?? `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    text: v.title,
    by: "Novazure",
  },
}))

export function VideoGallery() {
  const open = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('[role="group"]')
    if (!card) return
    const v = PORTFOLIO_VIDEOS.find((x) => x.title === card.getAttribute("aria-label"))
    if (v) window.open(`https://www.youtube.com/watch?v=${v.youtubeId}`, "_blank", "noopener")
  }
  return (
    <div className="h-[70svh] w-full cursor-pointer" onClick={open}>
      <CircularGallery items={items} radius={420} autoRotateSpeed={0.05} />
    </div>
  )
}
