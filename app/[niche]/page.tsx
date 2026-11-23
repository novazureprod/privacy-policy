import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { VideoGrid } from "@/components/site/video-grid"
import { Reveal } from "@/components/site/reveal"
import { NICHES, getNiche } from "@/lib/niches"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"
import { SITE } from "@/lib/site"

type Props = { params: Promise<{ niche: string }> }

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { niche } = await params
  const n = getNiche(niche)
  if (!n) return { title: "Novazure" }
  return {
    title: `Vidéo ${n.label.toLowerCase()} — Novazure`,
    description: `${n.headline} ${n.intro}`,
    alternates: { canonical: `/${n.slug}` },
    openGraph: { title: `${n.label} — Novazure`, description: n.intro, url: `/${n.slug}` },
  }
}

export default async function NichePage({ params }: Props) {
  const { niche } = await params
  const n = getNiche(niche)
  if (!n) notFound()

  const own = PORTFOLIO_VIDEOS.filter((v) => v.niche === n.label)
  // Sans film dans cette activité, on montre une sélection de réalisations proches.
  const videos = own.length ? own : PORTFOLIO_VIDEOS.filter((v) => v.niche === "Domaines de mariage" || v.niche === "Immobilier").slice(0, 6)
  const hero = videos[0]

  return (
    <main className="relative">
      <Header current={n.slug} />

      <section className="relative flex min-h-[88svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
        {hero && (
          <div className="absolute inset-0 -z-10">
            <img src={`/films/${hero.youtubeId}.jpg`} alt="" className="h-full w-full scale-105 object-cover opacity-30 blur-[2px]" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--nz-black)]/70 via-[var(--nz-black)]/40 to-[var(--nz-black)]" />
          </div>
        )}
        <div className="relative z-10 max-w-3xl">
          <p className="eyebrow">{n.label}</p>
          <h1 className="metal-text mt-4 font-display text-4xl leading-tight font-extrabold sm:text-6xl">{n.headline}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-[var(--nz-muted)] sm:text-lg">{n.intro}</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={SITE.calendly}
              target="_blank"
              rel="noopener"
              className="glass glass-gold rounded-full px-9 py-3.5 font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)] uppercase"
            >
              Prendre rendez-vous
            </a>
            <a href="#films" className="glass glass-gold rounded-full px-9 py-3.5 font-sub text-xs tracking-[0.2em] uppercase">
              Voir les films
            </a>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-10">
        <Reveal>
          <div className="glass mx-auto max-w-3xl rounded-2xl p-8 text-center">
            <p className="eyebrow">Votre besoin</p>
            <p className="mt-4 font-display text-xl leading-snug font-extrabold sm:text-2xl">{n.need}</p>
          </div>
        </Reveal>
      </section>

      <section className="px-5 py-16 sm:px-10" aria-labelledby="titre-pourquoi">
        <Reveal className="text-center">
          <p className="eyebrow">Pourquoi Novazure</p>
          <h2 id="titre-pourquoi" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Ce qui fait la différence
          </h2>
        </Reveal>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {n.benefits.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 120} className="h-full">
                <div className="glass h-full rounded-2xl p-7">
                  <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)]">0{i + 1}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--nz-muted)]">{b.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="films" className="px-5 py-20 sm:px-10" aria-labelledby="titre-films">
        <Reveal className="text-center">
          <p className="eyebrow">{own.length ? "Réalisations" : "Réalisations proches"}</p>
          <h2 id="titre-films" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            {own.length ? `Nos films · ${n.label}` : "Quelques films pour vous projeter"}
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 max-w-6xl">
          <VideoGrid videos={videos} />
        </div>
      </section>

      <section className="px-5 py-20 sm:px-10" aria-labelledby="titre-offre">
        <Reveal className="text-center">
          <p className="eyebrow">L&apos;offre</p>
          <h2 id="titre-offre" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Ce que nous proposons
          </h2>
        </Reveal>
        <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {n.offer.map((o, i) => (
            <li key={o}>
              <Reveal delay={i * 100} className="h-full">
                <div className="glass flex h-full items-center gap-4 rounded-2xl p-6">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[var(--nz-gold)]" />
                  <span className="text-sm">{o}</span>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 py-20 sm:px-10" aria-labelledby="titre-faq">
        <Reveal className="text-center">
          <h2 id="titre-faq" className="metal-text font-display text-3xl font-extrabold sm:text-4xl">
            Questions fréquentes
          </h2>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {n.faq.map((f) => (
            <details key={f.q} className="glass group rounded-2xl px-6 py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-extrabold">
                {f.q}
                <span aria-hidden="true" className="text-xl text-[var(--nz-gold)] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[var(--nz-muted)]">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 sm:px-10">
        <Reveal>
          <div className="glass mx-auto max-w-4xl rounded-3xl px-6 py-14 text-center sm:px-14">
            <h2 className="metal-text font-display text-3xl font-extrabold sm:text-4xl">Votre projet, en images</h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--nz-muted)]">Un premier échange, sans engagement.</p>
            <a
              href={SITE.calendly}
              target="_blank"
              rel="noopener"
              className="glass glass-gold mt-8 inline-block rounded-full px-10 py-4 font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)] uppercase"
            >
              Prendre rendez-vous
            </a>
          </div>
        </Reveal>
      </section>

      <nav aria-label="Autres activités" className="px-5 pb-24 sm:px-10">
        <p className="text-center font-sub text-[11px] tracking-[0.25em] text-[var(--nz-muted)] uppercase">Autres activités</p>
        <ul className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">
          {NICHES.filter((o) => o.slug !== n.slug).map((o) => (
            <li key={o.slug}>
              <Link href={`/${o.slug}`} className="glass glass-gold inline-block rounded-full px-5 py-2 text-sm">
                {o.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Footer />
    </main>
  )
}
