import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/site/header"
import { Particles } from "@/components/site/particles"
import { NICHES, getNiche, CALENDLY_URL } from "@/lib/niches"

type Props = { params: Promise<{ niche: string }> }

export function generateStaticParams() {
  return NICHES.map((n) => ({ niche: n.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { niche } = await params
  const n = getNiche(niche)
  return { title: n ? `${n.label} — Novazure` : "Novazure" }
}

export default async function NichePage({ params }: Props) {
  const { niche } = await params
  const n = getNiche(niche)
  if (!n) notFound()

  return (
    <main className="relative">
      <Header current={n.slug} />

      <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-20 text-center">
        <Particles />
        <div className="relative z-10 max-w-2xl">
          <p className="font-sub text-xs tracking-[0.35em] text-[var(--nz-gold)] uppercase">{n.label}</p>
          <h1 className="metal-text mt-4 font-display text-4xl leading-tight font-extrabold sm:text-6xl">{n.headline}</h1>
          <p className="mt-6 text-base text-[var(--nz-muted)] sm:text-lg">{n.intro}</p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-10">
        <div className="glass mx-auto max-w-3xl rounded-2xl p-8">
          <h2 className="font-display text-xl font-extrabold">Votre besoin</h2>
          <p className="mt-3 text-[var(--nz-muted)]">{n.need}</p>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-10">
        <h2 className="metal-text text-center font-display text-3xl font-extrabold">Ce que nous proposons</h2>
        <ul className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
          {n.offer.map((o) => (
            <li key={o} className="glass rounded-2xl p-6 text-sm">
              {o}
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-28 text-center sm:px-10">
        <a
          href={CALENDLY_URL}
          className="glass glass-gold inline-block rounded-full px-10 py-4 font-sub text-xs tracking-[0.2em] uppercase"
        >
          Prendre rendez-vous
        </a>
        <p className="mt-8">
          <Link href="/" className="text-sm text-[var(--nz-muted)] underline">
            Retour à l'accueil
          </Link>
        </p>
      </section>
    </main>
  )
}
