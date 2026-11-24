"use client"

import { useLayoutEffect, useRef } from "react"

/*
 * Frise chronologique de l'histoire de Novazure.
 * La section reste épinglée à l'écran pendant que l'on fait défiler la page :
 * la frise avance de gauche à droite, le fil doré se dessine et chaque étape s'allume en passant au centre.
 * Animation : GSAP ScrollTrigger (chargé à la demande). Sans mouvement réduit, la frise se lit au doigt (défilement horizontal).
 */

type Step = { tag: string; title: string; text: string; image?: string; big?: string }

const STEPS: Step[] = [
  { tag: "Moi, c'est Louann", title: "22 ans, vidéaste et pilote de drone", text: "Installé dans le Var, je raconte en images les lieux, les projets et les gens d'ici.", image: "/histoire/louann.webp" },
  { tag: "Étape 1", title: "Tout commence avec ma mère", text: "À 8 ans, ma mère me transmet la photographie. C'est grâce à elle que j'ai pris goût à l'image.", image: "/histoire/photo.webp" },
  { tag: "Étape 2", title: "L'exemple de mon père", text: "Je le vois travailler 80 heures par semaine pour ses entreprises. L'entrepreneuriat, je l'ai vu de près.", image: "/histoire/pere.webp" },
  { tag: "Étape 3", title: "Tout perdre", text: "Plus de parents, plus de domicile, plus rien. Il faut tout reconstruire.", image: "/histoire/chute.webp" },
  { tag: "Étape 4", title: "Quatre entreprises avant 18 ans", text: "Dès 14 ans, je me relance : achat-revente sur Vinted en troisième, shootings photo au lycée, e-commerce en prépa BCPST. Elles n'ont pas marché : je n'aimais pas ce que je faisais.", image: "/histoire/essais.webp" },
  { tag: "Étape 5", title: "Le déclic, à Bali", text: "En voyage, un imprévu : 2 000 € d'impôts à payer. Je comprends que la liberté financière, c'est à moi de la créer.", big: "2 000 €" },
  { tag: "Étape 6", title: "Faire ce que j'aime", text: "De retour, je prends un job alimentaire chez McDo. Entre deux services, j'écris le projet Novazure : le drone au service de l'immobilier.", image: "/histoire/passion.webp" },
  { tag: "Étape 7", title: "Le grand saut", text: "Renvoyé de McDo parce que je pensais trop à Novazure. Je me lance pour de bon.", image: "/histoire/lancement.webp" },
  { tag: "Étape 8", title: "Les premiers clients", text: "La conciergerie de luxe Homanie est la première à me faire confiance. Puis les tournages s'enchaînent.", image: "/histoire/clients.webp" },
  { tag: "Étape 9", title: "Bien plus que de la vidéo", text: "Je change de modèle : un accompagnement sur mesure et dans la durée. Stratégie, tournage et réseaux sociaux, pour vous faire gagner du temps, des clients et une image haut de gamme.", image: "/histoire/sur-mesure.webp" },
  { tag: "Aujourd'hui", title: "Plus de 40 entreprises accompagnées", text: "Et autant d'histoires à raconter. La prochaine, c'est peut-être la vôtre.", image: "/histoire/quarante.webp" },
]

export function StoryTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current, track = trackRef.current, line = lineRef.current
    if (!section || !track || !line) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add("tl-static")
      return
    }
    let cleanup = () => {}
    let alive = true
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      if (!alive) return
      gsap.registerPlugin(ScrollTrigger)
      const ctx = gsap.context(() => {
        const distance = () => track.scrollWidth - window.innerWidth
        // Hauteur de défilement proportionnelle à la longueur de la frise
        const setHeight = () => { section.style.height = `${distance() + window.innerHeight * 1.2}px` }
        setHeight()
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6, invalidateOnRefresh: true, onRefreshInit: setHeight },
        })
        gsap.fromTo(line, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 } })
        // Chaque étape se dévoile au fur et à mesure qu'elle entre à l'écran :
        // le point s'allume, puis le titre, l'image se découvre de gauche à droite, enfin le texte.
        track.querySelectorAll<HTMLElement>(".tl-step").forEach((el) => {
          const st = (start: string, end: string) => ({ trigger: el, containerAnimation: tween, start, end, scrub: true })
          ScrollTrigger.create({ trigger: el, containerAnimation: tween, start: "left 85%", end: "right 15%", onToggle: (s) => el.classList.toggle("is-on", s.isActive || s.progress > 0) })
          gsap.fromTo(el.querySelector(".tl-head"), { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: st("left 98%", "left 72%") })
          gsap.fromTo(el.querySelector(".tl-img"), { clipPath: "inset(0 100% 0 0 round 16px)", opacity: 0.4 }, { clipPath: "inset(0 0% 0 0 round 16px)", opacity: 1, ease: "none", scrollTrigger: st("left 90%", "left 55%") })
          gsap.fromTo(el.querySelector(".tl-text"), { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: "none", scrollTrigger: st("left 78%", "left 48%") })
        })
      }, section)
      cleanup = () => ctx.revert()
    })
    return () => {
      alive = false
      cleanup()
    }
  }, [])

  return (
    <section ref={sectionRef} id="histoire" className="timeline relative" aria-labelledby="titre-histoire">
      <div className="tl-sticky sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="px-5 sm:px-10">
          <p className="eyebrow">Histoire</p>
          <h2 id="titre-histoire" className="metal-text mt-3 font-display text-3xl font-extrabold sm:text-5xl">
            De la photo de famille à Novazure
          </h2>
        </div>
        <div className="relative mt-10">
          {/* Fil doré qui se dessine avec le défilement */}
          <div className="pointer-events-none absolute top-[22px] right-0 left-0 h-px bg-[rgba(224,197,143,.18)]" aria-hidden="true">
            <div ref={lineRef} className="h-px origin-left bg-gradient-to-r from-[#c9a35a] via-[#f1d79a] to-[#c9a35a] shadow-[0_0_12px_rgba(224,197,143,.8)]" />
          </div>
          <div ref={trackRef} className="tl-track flex w-max gap-8 px-5 sm:gap-12 sm:px-10">
            {STEPS.map((s, i) => (
              <article key={s.title} className="tl-step relative w-[78vw] shrink-0 pt-12 sm:w-[46vw] lg:w-[30vw]">
                <span className="tl-dot absolute top-[16px] left-0 h-3 w-3 rounded-full" aria-hidden="true" />
                <div className="tl-head">
                  <p className="font-sub text-[11px] tracking-[0.25em] text-[var(--nz-gold)] uppercase">{s.tag}</p>
                  <h3 className="mt-2 font-display text-xl font-extrabold sm:text-2xl">{s.title}</h3>
                </div>
                {s.image ? (
                  <img src={s.image} alt="" loading="lazy" className="tl-img mt-4 aspect-[16/8.2] w-full rounded-2xl border border-[rgba(224,197,143,.35)] object-cover" />
                ) : (
                  <div className="tl-img mt-4 grid aspect-[16/8.2] w-full place-items-center rounded-2xl border border-[rgba(224,197,143,.35)] bg-[radial-gradient(ellipse_at_center,rgba(224,197,143,.16),transparent_70%)]">
                    <span className="metal-text font-display text-5xl font-extrabold sm:text-6xl">{s.big}</span>
                  </div>
                )}
                <p className="tl-text mt-4 max-w-md text-base leading-relaxed sm:text-[17px]">{s.text}</p>
                <span className="sr-only">{`${i + 1} sur ${STEPS.length}`}</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
