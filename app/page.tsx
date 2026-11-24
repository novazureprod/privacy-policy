import Link from "next/link"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { HomeHero } from "@/components/site/home-hero"
import { BookPortfolio } from "@/components/site/book-portfolio"
import { VideoGallery } from "@/components/site/video-gallery"
import { Reveal } from "@/components/site/reveal"
import { StoryTimeline } from "@/components/site/story-timeline"
import { Reviews } from "@/components/site/reviews"
import { Team } from "@/components/site/team"
import { ImpactDashboard } from "@/components/site/impact-dashboard"
import { BookingCalendar } from "@/components/site/booking-calendar"
import { NextSection } from "@/components/site/next-section"
import { ClientsMarquee } from "@/components/site/clients-marquee"
import { NICHES } from "@/lib/niches"
import { PORTFOLIO_VIDEOS } from "@/lib/portfolio"
import { SITE } from "@/lib/site"

const PROCESS = [
  { step: "01", title: "Échange", text: "Un appel pour comprendre votre besoin, votre public et le message à faire passer." },
  { step: "02", title: "Préparation", text: "Un plan de tournage clair : lieux, horaires, plans clés, autorisations de vol." },
  { step: "03", title: "Tournage", text: "Caméra, stabilisateur, drone et FPV. Une présence discrète, un rythme maîtrisé." },
  { step: "04", title: "Montage", text: "Étalonnage, musique, sous-titres. Une première version, puis vos retours." },
  { step: "05", title: "Livraison", text: "Les fichiers prêts pour votre site, vos annonces et chaque réseau social." },
]

const FAQ = [
  { q: "Où vous déplacez-vous ?", a: "Dans le Var, sur la Côte d'Azur et en Provence. Plus loin sur demande." },
  { q: "Quel est le délai de livraison ?", a: "Une première version arrive en général en quelques jours. Le délai exact est fixé avant le tournage." },
  { q: "Faites-vous les images de drone ?", a: "Oui. Drone et FPV, dans le respect de la réglementation et des zones de vol." },
  { q: "Combien coûte une vidéo ?", a: "Chaque projet est différent. Après un premier échange, vous recevez un devis détaillé." },
  { q: "Les vidéos sont-elles adaptées aux réseaux sociaux ?", a: "Oui. Nous livrons les formats horizontaux et verticaux, avec sous-titres si besoin." },
]


export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE.name,
    description: SITE.tagline,
    url: SITE.url,
    areaServed: ["Var", "Côte d'Azur", "Provence"],
    sameAs: [SITE.youtube],
    knowsAbout: NICHES.map((n) => n.label),
  }

  // Questions fréquentes en données structurées : elles peuvent apparaître dans les résultats Google.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  }

  return (
    <main className="relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <Header />
      <HomeHero />

      <section id="realisations" className="pt-16" aria-labelledby="titre-realisations">
        <Reveal className="px-5 text-center">
          <p className="eyebrow">Nos réalisations</p>
          <h2 id="titre-realisations" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
            <span className="hidden md:inline">Feuilletez le portfolio.</span>
            <span className="md:hidden">Faites défiler la pellicule.</span>
          </h2>
        </Reveal>
        {/* Ordinateur : livre 3D. Téléphone : pellicule. Chacun ne se charge que s'il est affiché. */}
        <div className="hidden md:block">
          <BookPortfolio />
        </div>
        <div className="md:hidden">
          <VideoGallery />
        </div>
        <div className="px-5 pt-10 pb-8 text-center">
          <Link href="/portfolio" className="glass glass-gold inline-block rounded-full px-8 py-3 font-sub text-xs tracking-[0.2em] uppercase">
            Toutes les réalisations
          </Link>
        </div>
      </section>
      <NextSection href="#chiffres" label="Résultats" />

      <ClientsMarquee />

      <ImpactDashboard />
      <NextSection href="#process" label="Méthode" />

      <div className="divider" aria-hidden="true"><span /></div>

      <section id="process" className="px-5 py-24 sm:px-10" aria-labelledby="titre-process">
        <Reveal className="text-center">
          <p className="eyebrow">Méthode</p>
          <h2 id="titre-process" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
            Comment nous travaillons
          </h2>
        </Reveal>
        <ol className="mx-auto mt-14 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((p, i) => (
            <li key={p.step}>
              <Reveal delay={i * 100} className="h-full">
                <div className="glass lift h-full rounded-2xl p-6">
                  <span className="font-sub text-xs tracking-[0.2em] text-[var(--nz-gold)]">{p.step}</span>
                  <h3 className="mt-3 font-display text-lg font-extrabold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--nz-muted)]">{p.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <NextSection href="#histoire" label="Histoire" />

      <div className="divider" aria-hidden="true"><span /></div>

      <StoryTimeline />
      <NextSection href="#equipe" label="L'équipe" />

      <Team />
      <NextSection href="#avis" label="Avis clients" />

      <Reviews />
      <NextSection href="#faq" label="Questions fréquentes" />

      <div className="divider" aria-hidden="true"><span /></div>

      <section id="faq" className="px-5 py-24 sm:px-10" aria-labelledby="titre-faq">
        <Reveal className="text-center">
          <p className="eyebrow">Questions fréquentes</p>
          <h2 id="titre-faq" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
            Avant de commencer
          </h2>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-3xl gap-3">
          {FAQ.map((f) => (
            <details key={f.q} className="faq glass group rounded-2xl px-6 py-5">
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
      <NextSection href="#contact" label="Prendre rendez-vous" />

      <section id="contact" className="px-5 py-28 sm:px-10" aria-labelledby="titre-contact">
        <Reveal>
          <div className="glass mx-auto max-w-4xl rounded-3xl px-6 py-14 text-center sm:px-14">
            <p className="eyebrow">Contact</p>
            <h2 id="titre-contact" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
              Parlons de votre projet
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[var(--nz-muted)]">
              Un premier appel de trente minutes, sans engagement, pour voir ce que la vidéo peut faire pour vous.
              Choisissez votre créneau, tout se fait ici.
            </p>
            <div id="rdv" className="mt-10 scroll-mt-28">
              <BookingCalendar />
            </div>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {SITE.email && (
                <a href={`mailto:${SITE.email}`} className="glass glass-gold rounded-full px-10 py-4 font-sub text-xs tracking-[0.2em] uppercase">
                  Écrire un e-mail
                </a>
              )}
              <a
                href={SITE.youtube}
                target="_blank"
                rel="noopener"
                className="glass glass-gold rounded-full px-10 py-4 font-sub text-xs tracking-[0.2em] uppercase"
              >
                Voir la chaîne YouTube
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  )
}
