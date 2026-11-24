import { Counter } from "@/components/site/counter"
import { Reveal } from "@/components/site/reveal"
import { Clock, Layers, TrendingUp, Users, Star, Handshake } from "lucide-react"

/*
 * Tableau de bord des résultats.
 * `confirmed: false` = valeur provisoire, à remplacer par les chiffres réels de Novazure
 * (temps gagné, effet sur le chiffre d'affaires, abonnés gagnés).
 */
const KPIS = [
  { icon: Handshake, value: 40, prefix: "+", suffix: "", label: "Entreprises accompagnées", detail: "Restaurants, immobilier, domaines, mariages, associations…", bars: [3, 5, 6, 8, 10], confirmed: true },
  { icon: Clock, value: 10, prefix: "", suffix: " h", label: "Gagnées chaque mois", detail: "Stratégie, tournage, montage et publication : on s'occupe de tout.", bars: [2, 4, 5, 7, 9], confirmed: false },
  { icon: TrendingUp, value: 30, prefix: "+", suffix: " %", label: "De chiffre d'affaires visé", detail: "Des vidéos pensées pour vendre : un retour sur investissement mesuré.", bars: [3, 4, 6, 7, 10], confirmed: false },
  { icon: Users, value: 3, prefix: "×", suffix: "", label: "Abonnés en moyenne", detail: "Une présence régulière et soignée sur vos réseaux.", bars: [2, 3, 5, 8, 10], confirmed: false },
  { icon: Layers, value: 7, prefix: "", suffix: "", label: "Secteurs maîtrisés", detail: "Chaque métier a ses codes : on les connaît.", bars: [4, 5, 6, 7, 7], confirmed: true },
  { icon: Star, value: 5, prefix: "", suffix: "/5", label: "Note moyenne", detail: "Sur les avis de nos clients.", bars: [10, 10, 10, 10, 10], confirmed: true },
]

export function ImpactDashboard() {
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
      <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KPIS.map((k, i) => (
          <li key={k.label}>
            <Reveal delay={(i % 3) * 120} className="h-full">
              <div className="glass lift flex h-full flex-col rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-[rgba(201,163,90,.6)] text-[var(--nz-gold)]">
                    <k.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {/* Mini graphique décoratif */}
                  <span className="flex h-10 items-end gap-1" aria-hidden="true">
                    {k.bars.map((b, j) => (
                      <span key={j} className="kpi-bar w-2 rounded-sm bg-gradient-to-t from-[#c9a35a] to-[#f1d79a]" style={{ height: `${b * 10}%`, animationDelay: `${j * 90}ms` }} />
                    ))}
                  </span>
                </div>
                <div className="mt-5 font-display text-4xl font-extrabold text-[var(--nz-text)] sm:text-5xl">
                  {k.prefix}
                  <Counter to={k.value} suffix={k.suffix} />
                </div>
                <div className="mt-2 font-sub text-xs tracking-[0.18em] text-[var(--nz-gold)] uppercase">{k.label}</div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--nz-muted)]">{k.detail}</p>
                {!k.confirmed && <p className="mt-auto pt-3 text-[11px] text-[var(--nz-muted)] italic">Chiffre provisoire, à confirmer</p>}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
