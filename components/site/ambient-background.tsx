import { DustBackground } from "./dust-background"

/** Fond commun à toutes les pages : vagues de poussière d'or en WebGL. Fixe, derrière le contenu. */
export function AmbientBackground() {
  return (
    <div aria-hidden="true" className="ambient pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <DustBackground />
    </div>
  )
}
