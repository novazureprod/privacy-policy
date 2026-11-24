"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { NicheMenu } from "./niche-menu"
import { NAV } from "@/lib/site"

/** En-tête fixe : transparent en haut de page, en verre dès que l'on défile. */
export function Header({ current }: { current?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [section, setSection] = useState("")

  // Sur l'accueil, le lien de la section affichée passe en or.
  useEffect(() => {
    const ids = ["activites", "process", "histoire", "contact"]
    const els = ids.map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    if (!els.length) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-[background,box-shadow,padding] duration-500 ${
        scrolled || open ? "header-glass py-3" : "py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-10">
        <Link href="/" className="font-display text-sm font-extrabold tracking-[0.3em] text-[var(--nz-text)]" aria-label="Novazure, accueil">
          NOVAZURE
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-7 lg:flex">
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-link font-sub text-[11px] tracking-[0.22em] uppercase ${
                (current === "portfolio" && l.href === "/portfolio") || (section && l.href === `/#${section}`)
                  ? "text-[var(--nz-gold)]"
                  : "text-[var(--nz-text)]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <NicheMenu current={current} />
          <button
            type="button"
            className="glass grid h-10 w-10 place-items-center rounded-full lg:hidden"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls="menu-mobile"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="glass mx-5 mt-3 grid gap-1 rounded-2xl !bg-[rgba(17,34,80,0.94)] p-2 lg:hidden">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-base hover:bg-white/5">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
