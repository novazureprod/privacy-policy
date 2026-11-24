"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, MotionConfig, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { CALENDLY_URL } from "@/lib/niches"

/*
 * Prise de rendez-vous sur le site (calendrier inspiré de « schedule-calendar »).
 * On choisit un jour puis un créneau ; la réservation s'ouvre ensuite dans une fenêtre Calendly
 * intégrée à la page, déjà positionnée sur ce créneau : le visiteur ne quitte jamais le site.
 * Créneaux : 30 min, de 9 h à 19 h 30, heure de Paris (horaires du Calendly de Novazure).
 * Calendly vérifie la disponibilité réelle au moment de réserver.
 */
const TZ = "Europe/Paris"
const FIRST = 9 * 60, LAST = 19 * 60 + 30, STEP = 30
const DAYS_SHOWN = 14
const WEEK = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"]
const MONTHS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

// Date du jour à Paris (année, mois, jour)
function parisParts(d: Date) {
  const p = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(d)
  const g = (t: string) => Number(p.find((x) => x.type === t)?.value)
  return { y: g("year"), m: g("month"), d: g("day"), min: (g("hour") % 24) * 60 + g("minute") }
}
// Heure de Paris → instant UTC (gère l'heure d'été)
function parisToUtc(y: number, m: number, d: number, minutes: number) {
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60)
  const p = parisParts(new Date(guess))
  const shown = Date.UTC(p.y, p.m - 1, p.d, Math.floor(p.min / 60), p.min % 60)
  return new Date(guess - (shown - guess))
}

type Day = { y: number; m: number; d: number; weekday: string; key: string }

function buildDays(): Day[] {
    const now = parisParts(new Date())
    return Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const dt = new Date(Date.UTC(now.y, now.m - 1, now.d + i))
      return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), weekday: WEEK[dt.getUTCDay()], key: dt.toISOString().slice(0, 10) }
    })
}

export function BookingCalendar() {
  // Les jours dépendent de la date du visiteur : calculés après le chargement (la page est statique).
  const [days, setDays] = useState<Day[] | null>(null)
  useEffect(() => setDays(buildDays()), [])
  if (!days) return <div className="mx-auto h-[360px] w-full max-w-[420px] rounded-[28px] border border-[rgba(201,163,90,.6)] bg-[#0b1838]" aria-hidden="true" />
  return <Calendar days={days} />
}

function Calendar({ days }: { days: Day[] }) {
  const [page, setPage] = useState(0)
  const [active, setActive] = useState(0)
  const [dir, setDir] = useState(0)
  const [slot, setSlot] = useState<Date | null>(null)
  const visible = days.slice(page * 7, page * 7 + 7)
  const day = days[active]

  const slots = useMemo(() => {
    const now = parisParts(new Date())
    const today = active === 0
    const out: { label: string; at: Date }[] = []
    for (let t = FIRST; t <= LAST; t += STEP) {
      if (today && t <= now.min + 60) continue // au moins une heure à l'avance
      out.push({ label: `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`, at: parisToUtc(day.y, day.m, day.d, t) })
    }
    return out
  }, [active, day])

  const choose = (i: number) => { setDir(i >= active ? 1 : -1); setActive(i) }
  const iso = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, "Z")
  const embed = slot
    ? `${CALENDLY_URL}/${iso(slot)}?embed_type=Inline&hide_gdpr_banner=1&hide_landing_page_details=1&background_color=f5f0e9&text_color=112250&primary_color=c9a35a`
    : ""

  return (
    <MotionConfig reducedMotion="user">
      <div className="booking mx-auto w-full max-w-[420px] rounded-[28px] border border-[rgba(201,163,90,.6)] bg-[#0b1838] p-1.5 pt-5 text-left shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)]">
        <header className="flex items-center justify-between px-4 pb-4">
          <h3 className="font-display text-base font-extrabold text-[#f5f0e9] capitalize">
            {MONTHS[visible[0].m - 1]} {visible[0].y}
          </h3>
          <div className="flex gap-1">
            <button type="button" aria-label="Semaine précédente" disabled={page === 0} onClick={() => { setPage(0); choose(0) }} className="grid h-8 w-8 place-items-center rounded-full text-[#e0c58f] disabled:opacity-30">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Semaine suivante" disabled={page === 1} onClick={() => { setPage(1); choose(7) }} className="grid h-8 w-8 place-items-center rounded-full text-[#e0c58f] disabled:opacity-30">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div role="tablist" aria-label="Jours" className="grid grid-cols-7 px-2 pb-3">
          {visible.map((dd, j) => {
            const i = page * 7 + j, on = i === active
            return (
              <div key={dd.key} className="flex flex-col items-center">
                <span aria-hidden="true" className="mb-2 text-[11px] font-medium text-[#c9c2b6]">{dd.weekday}</span>
                <motion.button
                  type="button" role="tab" aria-selected={on} aria-label={`${dd.weekday} ${dd.d}`}
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} onClick={() => choose(i)}
                  className="relative grid h-10 w-10 place-items-center rounded-full text-[13px] tabular-nums"
                >
                  {on && <motion.span layoutId="booking-pill" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f6e2ad] via-[#e0c58f] to-[#c9a35a] shadow-[0_0_18px_rgba(224,197,143,.55)]" />}
                  <span className={`relative z-10 ${on ? "font-bold text-[#112250]" : "text-[#f5f0e9]"}`}>{dd.d}</span>
                </motion.button>
              </div>
            )
          })}
        </div>

        <div className="relative h-[230px] overflow-y-auto rounded-[22px] bg-[#f5f0e9] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={day.key}
              initial={{ opacity: 0, x: dir * 14, filter: "blur(2px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: dir * -14, filter: "blur(2px)" }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="p-4"
            >
              <p className="mb-3 font-sub text-[11px] tracking-[0.18em] text-[#3e4a6b] uppercase">
                Appel découverte · 30 min · Visio
              </p>
              {slots.length ? (
                <ul className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <li key={s.label}>
                      <button type="button" onClick={() => setSlot(s.at)} className="slot w-full rounded-xl border border-[rgba(201,163,90,.55)] bg-white/70 py-2 text-sm font-semibold text-[#112250] tabular-nums">
                        {s.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-16 text-center text-sm text-[#3e4a6b]">Plus de créneau aujourd&apos;hui : choisissez un autre jour.</p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {slot && (
          <motion.div
            className="fixed inset-0 z-[80] grid place-items-center bg-[rgba(4,8,20,.78)] p-3 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={(e) => { if (e.target === e.currentTarget) setSlot(null) }}
            role="dialog" aria-modal="true" aria-label="Réserver le créneau"
          >
            <motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, scale: 0.98 }} className="relative h-[min(720px,90svh)] w-full max-w-[720px] overflow-hidden rounded-3xl border border-[rgba(201,163,90,.7)] bg-[#f5f0e9]">
              <button type="button" onClick={() => setSlot(null)} aria-label="Fermer" className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-[rgba(201,163,90,.7)] bg-white text-[#112250]">
                <X className="h-4 w-4" />
              </button>
              <iframe src={embed} title="Réservation Calendly" className="h-full w-full border-0" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  )
}
