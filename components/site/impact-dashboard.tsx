import { Reveal } from "@/components/site/reveal"
import { NICHES } from "@/lib/niches"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"

/*
 * Résultats, en graphiques. Les animations partent quand la carte apparaît (classe .is-in posée par Reveal).
 * Hypothèses à faire valider : 4 h par mois de votre côté (une demi-journée) contre ~40 h pour tout gérer seul.
 */

/** Compteur à rouleaux : chaque chiffre défile jusqu'à sa valeur. */
function Odometer({ value, prefix = "" }: { value: number; prefix?: string }) {
  const digits = String(value).split("").map(Number)
  return (
    <span className="odometer inline-flex items-baseline" aria-label={`${prefix}${value}`}>
      {prefix && <span aria-hidden="true">{prefix}</span>}
      {digits.map((d, i) => (
        <span key={i} className="odo-window" aria-hidden="true">
          <span className="odo-strip" style={{ ["--d" as string]: d, transitionDelay: `${i * 120}ms` }}>
            {Array.from({ length: 10 }, (_, n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  )
}

const card = "glass lift flex h-full flex-col rounded-2xl p-6"
const label = "font-sub text-xs tracking-[0.18em] text-[var(--nz-gold)] uppercase"
const note = "mt-2 text-sm leading-relaxed text-[var(--nz-muted)]"

export function ImpactDashboard() {
  const thumbs = PORTFOLIO_VIDEOS.slice(0, 6).map((v) => `/films/${v.youtubeId}.webp`)
  return (
    <section id="chiffres" className="px-5 py-24 sm:px-10" aria-labelledby="titre-chiffres">
      <Reveal className="text-center">
        <p className="eyebrow">Résultats</p>
        <h2 id="titre-chiffres" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
          Ce que la vidéo change pour vous
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--nz-muted)]">
          Du temps, des clients, du chiffre et une image de marque haut de gamme.
        </p>
      </Reveal>

      <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 1. Entreprises accompagnées : anneau + compteur à rouleaux */}
        <li>
          <Reveal className="h-full">
            <div className={`${card} items-center text-center`}>
              <div className="relative grid h-44 w-44 place-items-center">
                <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(201,163,90,.18)" strokeWidth="6" />
                  <circle className="ring-fill" cx="60" cy="60" r="52" fill="none" stroke="url(#gold-ring)" strokeWidth="6" strokeLinecap="round" pathLength="100" />
                  <defs>
                    <linearGradient id="gold-ring" x1="0" x2="1">
                      <stop offset="0" stopColor="#c9a35a" /><stop offset=".5" stopColor="#f1d79a" /><stop offset="1" stopColor="#c9a35a" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="font-display text-5xl font-extrabold text-[var(--nz-text)]">
                  <Odometer value={40} prefix="+" />
                </span>
              </div>
              <div className={`${label} mt-4`}>Entreprises accompagnées</div>
              <p className={note}>Restaurants, immobilier, domaines, mariages, associations, sociétés…</p>
            </div>
          </Reveal>
        </li>

        {/* 2. Temps : camembert */}
        <li>
          <Reveal className="h-full" delay={120}>
            <div className={card}>
              <div className={label}>Votre temps</div>
              <div className="mt-4 flex items-center gap-5">
                <svg viewBox="0 0 42 42" className="h-28 w-28 shrink-0 -rotate-90" aria-hidden="true">
                  <circle cx="21" cy="21" r="15.9" fill="none" stroke="#112250" strokeWidth="7" />
                  <circle className="pie-gold" cx="21" cy="21" r="15.9" fill="none" stroke="#c9a35a" strokeWidth="7" pathLength="100" />
                </svg>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#112250]" />
                    <span><b className="font-display text-base">½ journée</b><br /><span className="text-[var(--nz-muted)]">par mois de votre côté</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#c9a35a]" />
                    <span><b className="font-display text-base">~ 40 h</b><br /><span className="text-[var(--nz-muted)]">s&apos;il fallait tout gérer seul</span></span>
                  </li>
                </ul>
              </div>
              <p className={`${note} mt-4`}>Stratégie, tournage, montage, publication : on s&apos;occupe de tout. Vous gagnez des dizaines d&apos;heures chaque mois.</p>
            </div>
          </Reveal>
        </li>

        {/* 3. Chiffre d'affaires : courbe qui monte */}
        <li>
          <Reveal className="h-full" delay={240}>
            <div className={card}>
              <div className={label}>Objectif chiffre d&apos;affaires</div>
              <svg viewBox="0 0 220 120" className="mt-4 h-36 w-full" aria-hidden="true">
                {[30, 60, 90].map((y) => <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="rgba(17,34,80,.12)" strokeDasharray="3 4" />)}
                <path className="curve-area" d="M0,110 C40,104 60,96 90,84 C120,72 140,52 170,38 C190,28 205,16 220,8 L220,120 L0,120 Z" fill="url(#ca-fill)" />
                <path className="curve-line" d="M0,110 C40,104 60,96 90,84 C120,72 140,52 170,38 C190,28 205,16 220,8" fill="none" stroke="#c9a35a" strokeWidth="3" strokeLinecap="round" pathLength="100" />
                <circle className="curve-dot" cx="220" cy="8" r="5" fill="#f1d79a" stroke="#c9a35a" strokeWidth="2" />
                <defs>
                  <linearGradient id="ca-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="rgba(201,163,90,.35)" /><stop offset="1" stopColor="rgba(201,163,90,0)" /></linearGradient>
                </defs>
              </svg>
              <div className="mt-1 flex justify-between font-sub text-[10px] tracking-[0.15em] text-[var(--nz-muted)] uppercase">
                <span>Aujourd&apos;hui</span><span>6 mois</span><span>12 mois</span>
              </div>
              <p className={`${note} mt-3`}>Des vidéos pensées pour vendre : l&apos;objectif est une hausse de votre chiffre d&apos;affaires, mesurée avec vous.</p>
            </div>
          </Reveal>
        </li>

        {/* 4. Abonnés : maquette de compte Instagram */}
        <li>
          <Reveal className="h-full">
            <div className={card}>
              <div className={label}>Votre communauté</div>
              <div className="insta mt-4 rounded-2xl border border-[rgba(17,34,80,.15)] bg-white/80 p-4 text-[#112250]">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-gradient-to-tr from-[#c9a35a] via-[#f1d79a] to-[#c9a35a] p-[2px]">
                    <img src="/logo/logo-mark.webp" alt="" className="h-12 w-12 rounded-full bg-[#112250] object-contain p-1" />
                  </span>
                  <div className="grid flex-1 grid-cols-3 text-center text-[10px] leading-tight">
                    <span><b className="block text-sm">96</b>publications</span>
                    <span className="insta-followers"><b className="block text-sm"><span className="f-before">1 200</span><span className="f-after">3 600</span></b>abonnés</span>
                    <span><b className="block text-sm">180</b>suivi(e)s</span>
                  </div>
                </div>
                <p className="mt-2 text-xs font-semibold">votre.entreprise</p>
                <div className="mt-3 grid grid-cols-3 gap-1">
                  {thumbs.map((t) => <img key={t} src={t} alt="" loading="lazy" className="aspect-square w-full rounded-sm object-cover" />)}
                </div>
              </div>
              <p className={`${note} mt-4`}>Une présence régulière et soignée sur les réseaux peut tripler votre nombre d&apos;abonnés.</p>
            </div>
          </Reveal>
        </li>

        {/* 5. Secteurs */}
        <li>
          <Reveal className="h-full" delay={120}>
            <div className={card}>
              <div className={label}>Secteurs maîtrisés</div>
              <div className="mt-3 font-display text-5xl font-extrabold text-[var(--nz-text)]"><Odometer value={NICHES.length} /></div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {NICHES.map((n) => <li key={n.slug} className="rounded-full border border-[rgba(201,163,90,.6)] px-3 py-1 text-xs">{n.label}</li>)}
              </ul>
              <p className={`${note} mt-3`}>Chaque métier a ses codes : on les connaît.</p>
            </div>
          </Reveal>
        </li>

        {/* 6. Avis */}
        <li>
          <Reveal className="h-full" delay={240}>
            <div className={`${card} items-center text-center`}>
              <div className={label}>Avis clients</div>
              <div className="mt-3 font-display text-5xl font-extrabold text-[var(--nz-text)]"><Odometer value={40} prefix="+" /></div>
              <div className="stars-47 mt-3 text-2xl" aria-label="Note moyenne 4,7 sur 5"><span>★★★★★</span></div>
              <div className="mt-1 font-display text-xl font-extrabold">4,7 / 5</div>
              <p className={note}>Note moyenne de nos clients.</p>
            </div>
          </Reveal>
        </li>
      </ul>
    </section>
  )
}
