import Link from "next/link"
import { NICHES } from "@/lib/niches"
import { NAV, SITE } from "@/lib/site"
import { FloatingActions } from "./floating-actions"

/** Pied de page commun : navigation, activités, contact et pages légales. */
export function Footer() {
  return (
    <footer className="relative border-t border-[rgba(245,240,233,0.12)] px-5 pt-16 pb-28 sm:px-10 lg:pb-10">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="metal-text font-display text-lg font-extrabold tracking-[0.3em]">NOVAZURE</p>
          <p className="mt-3 max-w-xs text-sm text-[var(--nz-muted)]">{SITE.tagline}.</p>
          <p className="mt-3 font-sub text-[11px] tracking-[0.2em] text-[var(--nz-muted)] uppercase">{SITE.area}</p>
        </div>
        <div>
          <p className="font-sub text-[11px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">Le site</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="footer-link">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sub text-[11px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">Activités</p>
          <ul className="mt-4 grid gap-2 text-sm">
            {NICHES.map((n) => (
              <li key={n.slug}>
                <Link href={`/${n.slug}`} className="footer-link">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sub text-[11px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">Contact</p>
          <ul className="mt-4 grid gap-2 text-sm">
            <li>
              <a href="/#rdv" className="footer-link !text-[var(--nz-gold)]">
                Prendre rendez-vous
              </a>
            </li>
            {SITE.email && (
              <li>
                <a href={`mailto:${SITE.email}`} className="footer-link">
                  {SITE.email}
                </a>
              </li>
            )}
            {SITE.phone && (
              <li>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="footer-link">
                  {SITE.phone}
                </a>
              </li>
            )}
            <li>
              <a href={SITE.youtube} target="_blank" rel="noopener" className="footer-link">
                Chaîne YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-[rgba(245,240,233,0.08)] pt-6 text-xs text-[var(--nz-muted)] sm:flex-row">
        <p>© 2026 Novazure. Tous droits réservés.</p>
        <p className="flex gap-5">
          <Link href="/mentions-legales" className="footer-link">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="footer-link">
            Confidentialité
          </Link>
        </p>
      </div>
      <FloatingActions />
    </footer>
  )
}
