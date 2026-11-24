import { Reveal } from "@/components/site/reveal"
import { Calculator, Handshake, Film, Box, HeartHandshake, CalendarCheck, Camera, Plane } from "lucide-react"

/*
 * L'équipe Novazure. Pour compléter une fiche : renseigner `name` et `photo`
 * (fichier dans public/equipe/). Sans photo, une silhouette dorée avec l'icône du métier s'affiche.
 */
const TEAM: { role: string; name?: string; photo?: string; text: string; icon: typeof Film }[] = [
  { role: "Fondateur · Réalisateur & pilote de drone", name: "Louann Mastrovito", text: "Il imagine chaque film et vous accompagne du premier appel à la livraison.", icon: Plane },
  { role: "Responsable client", text: "Votre interlocuteur au quotidien : suivi, planning et retours.", icon: HeartHandshake },
  { role: "Commercial", text: "Il comprend vos besoins et construit l'offre qui vous correspond.", icon: Handshake },
  { role: "Monteur vidéo", text: "Rythme, étalonnage, musique : il donne au film son émotion.", icon: Film },
  { role: "Responsable 3D & motion design", text: "Titres animés, logos en 3D, effets : la touche qui fait la différence.", icon: Box },
  { role: "Photographe", text: "Des photos haut de gamme pour vos réseaux, votre site et vos annonces.", icon: Camera },
  { role: "Secrétariat", text: "Rendez-vous, devis, documents : tout reste simple et rapide.", icon: CalendarCheck },
  { role: "Comptabilité", text: "Des devis et des factures clairs, sans surprise.", icon: Calculator },
]

export function Team() {
  return (
    <section id="equipe" className="px-5 py-24 sm:px-10" aria-labelledby="titre-equipe">
      <Reveal className="text-center">
        <p className="eyebrow">L&apos;équipe</p>
        <h2 id="titre-equipe" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
          Les visages derrière vos images
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-[var(--nz-muted)]">
          Une équipe complète, de la stratégie à la livraison, pour que vous n&apos;ayez rien à gérer.
        </p>
      </Reveal>
      <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m, i) => (
          <li key={m.role}>
            <Reveal delay={(i % 4) * 100} className="h-full">
              <figure className="glass lift team-card flex h-full flex-col overflow-hidden rounded-2xl">
                <div className="relative aspect-[4/3.4] overflow-hidden border-b border-[rgba(201,163,90,.5)] bg-[radial-gradient(ellipse_at_50%_30%,#1e3a8a,#0b1838_70%)]">
                  {m.photo ? (
                    <img src={m.photo} alt={m.name ?? m.role} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full place-items-center">
                      <span className="grid h-20 w-20 place-items-center rounded-full border border-[rgba(241,215,154,.7)] text-[#f1d79a] shadow-[0_0_24px_rgba(224,197,143,.35)]">
                        <m.icon className="h-9 w-9" aria-hidden="true" />
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="flex flex-1 flex-col p-5">
                  <span className="font-display text-lg font-extrabold">{m.name ?? "Bientôt présenté"}</span>
                  <span className="mt-1 font-sub text-[11px] tracking-[0.16em] text-[var(--nz-gold)] uppercase">{m.role}</span>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--nz-muted)]">{m.text}</p>
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
