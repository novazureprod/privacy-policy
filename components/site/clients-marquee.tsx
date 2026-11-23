// Bandeau des clients filmés par Novazure (noms tirés des films publiés), qui défile en continu.
const CLIENTS = [
  "Agence Boyer",
  "Domaine de la Toussane",
  "Domaine Astra",
  "Domaine de la Pommée",
  "Helios Spa",
  "Conciergerie DMP Excellence",
  "École de cirque Pitrerie",
  "Restaurant Wok 83",
  "Les 2 Sœurs",
  "Bières du Monde",
  "Festival Festic",
  "Association La Fvane",
  "MeilleursBiens",
  "iBox",
]

export function ClientsMarquee() {
  const row = (hidden: boolean) => (
    <ul className="marquee-row flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {CLIENTS.map((c) => (
        <li key={c} className="flex items-center gap-10 whitespace-nowrap font-display text-lg font-extrabold text-[var(--nz-text)]/80 sm:text-xl">
          {c}
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--nz-gold)]" />
        </li>
      ))}
    </ul>
  )
  return (
    <section className="py-14" aria-labelledby="titre-clients">
      <p id="titre-clients" className="eyebrow text-center">
        Ils nous ont confié leur image
      </p>
      <div className="marquee mt-8 flex overflow-hidden">
        {row(false)}
        {row(true)}
      </div>
    </section>
  )
}
