"use client"

import { useEffect, useRef, useState } from "react"

/*
 * Portfolio en livre 3D (public/livre/livre.html : three.js, cuir, pages qui se tournent).
 * Le livre vit dans sa propre page (mode ?embed : fond transparent, il flotte sur le site). Il se charge dès la fin du chargement de l'accueil.
 */
export function BookPortfolio() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    // Le livre se prépare dès l'arrivée sur la page (pendant que l'on lit l'accueil) :
    // quand on arrive à la section, il est déjà prêt.
    // Sur téléphone la section est masquée (pellicule à la place) : on ne charge rien.
    if (!window.matchMedia("(min-width: 768px)").matches) return
    const start = () => setShow(true)
    if (document.readyState === "complete") start()
    else window.addEventListener("load", start, { once: true })
    return () => window.removeEventListener("load", start)
  }, [])
  return (
    <div ref={ref} className="mx-auto mt-10 w-full max-w-6xl px-3 sm:px-6">
      <div className="relative h-[80vh] min-h-[480px] max-h-[880px]">
        {show ? (
          <iframe
            src="/livre/livre.html?embed"
            title="Portfolio Novazure en livre 3D"
            className="absolute inset-0 h-full w-full border-0 bg-transparent"
            allow="fullscreen"
          />
        ) : (
          <p className="absolute inset-0 grid place-items-center font-sub text-xs tracking-[0.25em] text-[#E0C58F]/70 uppercase">
            Ouverture du livre…
          </p>
        )}
      </div>
    </div>
  )
}
