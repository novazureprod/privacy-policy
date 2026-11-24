"use client"

import { useEffect, useRef, useState } from "react"

/*
 * Portfolio en livre 3D (public/livre/livre.html : three.js, cuir, pages qui se tournent).
 * Le livre vit dans sa propre page, affichée ici en grand. Il ne se charge qu'à l'approche
 * de la section, pour que l'accueil reste rapide.
 */
export function BookPortfolio() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setShow(true)
      },
      { rootMargin: "0px 0px 40% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="mx-auto mt-10 w-full max-w-6xl px-3 sm:px-6">
      <div className="relative h-[78vh] min-h-[460px] max-h-[860px] overflow-hidden rounded-3xl border border-[#E0C58F]/25 bg-[#050608] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)]">
        {show ? (
          <iframe
            src="/livre/livre.html"
            title="Portfolio Novazure en livre 3D"
            className="absolute inset-0 h-full w-full"
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
