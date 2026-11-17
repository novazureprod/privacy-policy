"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { NICHES } from "@/lib/niches"

/** Menu déroulant des niches : accessible depuis chaque page, pour revenir en arrière. */
export function NicheMenu({ current }: { current?: string }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const currentLabel = NICHES.find((n) => n.slug === current)?.label ?? "Votre activité"

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="glass glass-gold flex items-center gap-2 rounded-full px-5 py-2.5 font-sub text-xs tracking-[0.2em] uppercase text-[var(--nz-text)]"
      >
        {currentLabel}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="menu"
          className="glass absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl p-2"
        >
          <li role="none">
            <Link
              role="menuitem"
              href="/"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 font-body text-sm hover:bg-white/5"
            >
              Accueil
            </Link>
          </li>
          {NICHES.map((n) => (
            <li role="none" key={n.slug}>
              <Link
                role="menuitem"
                href={`/${n.slug}`}
                onClick={() => setOpen(false)}
                className={`block rounded-xl px-4 py-3 font-body text-sm hover:bg-white/5 ${
                  n.slug === current ? "text-[var(--nz-gold)]" : ""
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
