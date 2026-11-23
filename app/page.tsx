import Link from "next/link"
import { Header } from "@/components/site/header"
import { HomeHero } from "@/components/site/home-hero"
import { VideoGallery } from "@/components/site/video-gallery"
import { NICHES, CALENDLY_URL } from "@/lib/niches"
import { NicheFolders } from "@/components/site/niche-folders"


// Contenus de démonstration : chiffres et avis à remplacer par des données réelles.
const STATS = [
  { value: "120+", label: "vidéos livrées" },
  { value: "7", label: "secteurs accompagnés" },
  { value: "48 h", label: "délai moyen de première version" },
]

const REVIEWS = [
  { quote: "Un film qui nous ressemble, livré dans les temps.", who: "Exemple — restaurateur" },
  { quote: "Des images élégantes qui ont vraiment aidé à vendre.", who: "Exemple — immobilier" },
  { quote: "Le jour de notre mariage revécu avec justesse.", who: "Exemple — couple" },
]

const PROCESS = [
  { step: "01", title: "Échange", text: "Nous définissons votre besoin et le message à faire passer." },
  { step: "02", title: "Tournage", text: "Un vidéaste sur place, discret, avec un plan précis." },
  { step: "03", title: "Montage", text: "Une première version, puis vos retours intégrés." },
  { step: "04", title: "Livraison", text: "Les fichiers prêts pour vos supports et vos réseaux." },
]

export default function HomePage() {
  return (
    <main className="relative">
      <Header />
      <HomeHero />

      <section className="py-24">
        <p className="mb-6 text-center font-sub text-xs tracking-[0.3em] text-[var(--nz-muted)] uppercase">Nos réalisations</p>
        <VideoGallery />
      </section>

      <section className="px-5 py-24 sm:px-10">
        <h2 className="metal-text text-center font-display text-3xl font-extrabold sm:text-4xl">Votre activité</h2>
        <NicheFolders />
      </section>

      <section className="px-5 py-24 sm:px-10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-8 text-center">
              <div className="metal-text font-display text-4xl font-extrabold sm:text-5xl">{s.value}</div>
              <div className="mt-3 font-sub text-xs tracking-[0.2em] text-[var(--nz-muted)] uppercase">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-center text-xs text-[var(--nz-muted)]">Chiffres d'exemple, à valider.</p>
      </section>

      <section className="px-5 py-24 sm:px-10">
        <h2 className="metal-text text-center font-display text-3xl font-extrabold sm:text-4xl">Comment nous travaillons</h2>
        <ol className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <li key={p.step} className="glass rounded-2xl p-6">
              <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)]">{p.step}</span>
              <h3 className="mt-3 font-display text-lg font-extrabold">{p.title}</h3>
              <p className="mt-2 text-sm text-[var(--nz-muted)]">{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="px-5 py-24 sm:px-10">
        <h2 className="metal-text text-center font-display text-3xl font-extrabold sm:text-4xl">Avis clients</h2>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.who} className="glass rounded-2xl p-6">
              <p className="text-base leading-relaxed">« {r.quote} »</p>
              <p className="mt-4 font-sub text-xs tracking-[0.15em] text-[var(--nz-gold)] uppercase">{r.who}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-28 text-center sm:px-10">
        <h2 className="metal-text font-display text-3xl font-extrabold sm:text-4xl">Parlons de votre projet</h2>
        <a
          href={CALENDLY_URL}
          className="glass glass-gold mt-8 inline-block rounded-full px-10 py-4 font-sub text-xs tracking-[0.2em] uppercase"
        >
          Prendre rendez-vous
        </a>
      </section>

      <footer className="px-5 py-10 text-center text-xs text-[var(--nz-muted)] sm:px-10">
        Novazure · Aix-en-Provence · Mentions légales à venir
      </footer>
    </main>
  )
}
