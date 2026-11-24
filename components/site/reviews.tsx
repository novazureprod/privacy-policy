import { Counter } from "@/components/site/counter"
import { Reveal } from "@/components/site/reveal"

// Avis clients réels, repris de la vidéo « L'histoire de Novazure » (prénoms tels qu'affichés).
const REVIEWS: { quote: string; who: string; context?: string }[] = [
  { quote: "Louann a su capturer l'essence du lieu avec beaucoup de talent et de sensibilité. Ses prises de vues au drone sont tout simplement magnifiques.", who: "Client", context: "Immobilier" },
  { quote: "À l'écoute, précis dans ses réponses, ponctuel et rassurant avec mes clients… Il est même allé au-delà de mes attentes.", who: "Client", context: "Mise en valeur d'une villa" },
  { quote: "On n'a jamais eu l'impression qu'il était employé, on avait plutôt l'impression de travailler avec un vieil ami ! Je le recommande vivement !", who: "Laura", context: "Mariage" },
  { quote: "Une qualité excellente, des clichés inoubliables, un prestataire de qualité qui a su nous guider dans tous nos choix et envies.", who: "Timothée", context: "Mariage" },
  { quote: "Le résultat a dépassé nos attentes, tout était soigné et réalisé avec passion.", who: "Maxence" },
  { quote: "Il nous a mis très à l'aise et le film est magnifique. Aucuns regrets.", who: "Lili" },
  { quote: "Il sait capturer les plus beaux moments de votre journée en étant discret.", who: "Amandine" },
  { quote: "Un montage vidéo qui nous a fait revivre une journée toute en émotions.", who: "Nelly" },
  { quote: "Honnêtement aucuns regrets, il nous a offert nos plus beaux souvenirs.", who: "Alexis" },
  { quote: "Très professionnel et patient, merci beaucoup pour votre travail.", who: "Client" },
  { quote: "Nous avons visionné la vidéo, nous la trouvons remarquable.", who: "Client" },
  { quote: "Je suis satisfait, notamment par les montages réalisés.", who: "Client" },
  { quote: "Bonjour, la vidéo est magnifique ! À bientôt.", who: "Client" },
]

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`tracking-[0.15em] text-[#c9a35a] ${className}`} aria-hidden="true">★★★★★</span>
)

export function Reviews() {
  return (
    <section id="avis" className="px-5 py-24 sm:px-10" aria-labelledby="titre-avis">
      <Reveal className="text-center">
        <p className="eyebrow">Avis clients</p>
        <h2 id="titre-avis" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
          Ce sont eux qui en parlent le mieux
        </h2>
        {/* Compteur d'avis */}
        <div className="glass mx-auto mt-8 inline-flex items-center gap-5 rounded-full px-7 py-3">
          <span className="font-display text-3xl font-extrabold">
            <Counter to={REVIEWS.length} />
          </span>
          <span className="text-left leading-tight">
            <Stars className="text-base" />
            <span className="block font-sub text-[11px] tracking-[0.18em] text-[var(--nz-muted)] uppercase">avis · note 5/5</span>
          </span>
        </div>
      </Reveal>
      <ul className="mx-auto mt-12 max-w-6xl columns-1 gap-4 sm:columns-2 lg:columns-3">
        {REVIEWS.map((r, i) => (
          <li key={r.quote} className="mb-4 break-inside-avoid">
            <Reveal delay={(i % 3) * 100}>
              <figure className="glass lift rounded-2xl p-6">
                <Stars className="text-sm" />
                <blockquote className="mt-3 text-[15px] leading-relaxed italic">« {r.quote} »</blockquote>
                <figcaption className="mt-4 font-sub text-[11px] tracking-[0.18em] text-[var(--nz-gold)] uppercase">
                  {r.who}
                  {r.context ? ` · ${r.context}` : ""}
                </figcaption>
              </figure>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
