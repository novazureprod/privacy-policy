import { Particles } from "./particles"

/**
 * Fond commun à toutes les pages : nappes de lumière bleue et or qui dérivent lentement,
 * trame de points, et particules lumineuses. Fixe, derrière le contenu, sans interaction.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ambient-blob ambient-blob--blue" />
      <Particles />
    </div>
  )
}
