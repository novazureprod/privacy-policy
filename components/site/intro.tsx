"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Intro : le phénix vole, le logo se fixe, puis la vidéo se termine par un fondu au noir.
 * Le logo disparaît avec la vidéo ; le texte d'accueil apparaît ensuite, seul.
 * Sans mouvement réduit ou si la vidéo ne peut pas être lue, on passe directement à la suite.
 */
export function Intro({ onDone, children }: { onDone?: () => void; children?: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [done, setDone] = useState(false)

  const finish = () => {
    setDone(true)
    onDone?.()
  }

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish()
      return
    }
    // sécurité : si la vidéo ne démarre pas, on affiche le texte après 12 s
    const fallback = window.setTimeout(finish, 12000)
    return () => window.clearTimeout(fallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden ">
      {!done && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain mix-blend-screen"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={finish}
          onError={finish}
          aria-label="Animation du phénix Novazure"
        >
          <source src="/intro/phenix-intro-v3.webm" type="video/webm" />
          <source src="/intro/phenix-intro-v3.mp4" type="video/mp4" />
        </video>
      )}
      {children}
    </div>
  )
}
