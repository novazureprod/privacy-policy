"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Intro : le phénix vole (vidéo muette), puis le logo se fixe au centre,
 * et le texte d'accueil apparaît en même temps. La vidéo est ignorée si
 * l'utilisateur préfère moins de mouvement ou si elle ne peut pas être lue.
 */
export function Intro({ onDone, children }: { onDone?: () => void; children?: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<"video" | "logo">("video")

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setPhase("logo")
      onDone?.()
      return
    }
    // sécurité : si la vidéo ne démarre pas, on affiche le logo après 8 s
    const fallback = window.setTimeout(() => setPhase("logo"), 8000)
    return () => window.clearTimeout(fallback)
  }, [onDone])

  // À 6,5 s, le logo est fixe dans la vidéo : on passe au logo statique
  const onTime = () => {
    const v = videoRef.current
    if (v && v.currentTime >= 6.5 && phase === "video") {
      setPhase("logo")
      onDone?.()
    }
  }

  return (
    <div className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-[var(--nz-black)]">
      {phase === "video" && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen"
          src="/intro/phenix-intro.mp4"
          autoPlay
          muted
          playsInline
          onTimeUpdate={onTime}
          onEnded={() => {
            setPhase("logo")
            onDone?.()
          }}
          onError={() => {
            setPhase("logo")
            onDone?.()
          }}
        />
      )}

      {phase === "logo" && (
        <div className="intro-logo absolute inset-x-0 top-0 flex h-[62svh] items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/intro/logo-frame.png"
            alt="Novazure"
            className="h-full w-full object-contain mix-blend-screen [mask-image:radial-gradient(ellipse_30%_46%_at_center,black_50%,transparent_100%)]"
          />
        </div>
      )}

      {children}
    </div>
  )
}
