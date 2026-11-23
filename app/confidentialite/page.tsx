import type { Metadata } from "next"
import { LegalPage, ToFill } from "@/components/site/legal-page"

export const metadata: Metadata = {
  title: "Politique de confidentialité — Novazure",
  alternates: { canonical: "/confidentialite" },
}

export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated="novembre 2026">
      <h2>En bref</h2>
      <p>
        Ce site ne vous demande aucun compte et ne dépose aucun cookie publicitaire. Les seules données traitées sont celles
        que vous choisissez de nous transmettre pour un rendez-vous ou un devis.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        Novazure, représentée par Louann Mastrovito. Contact : <ToFill>adresse e-mail à compléter</ToFill>
      </p>

      <h2>Prise de rendez-vous</h2>
      <p>
        La prise de rendez-vous passe par Calendly. Les informations saisies (nom, e-mail, message) servent uniquement à
        préparer l&apos;échange et à vous répondre. Calendly applique sa propre politique de confidentialité.
      </p>

      <h2>Vidéos YouTube</h2>
      <p>
        Les vidéos sont intégrées via youtube-nocookie.com. YouTube ne dépose de cookies qu&apos;au lancement d&apos;une
        vidéo. Les règles de confidentialité de Google s&apos;appliquent alors.
      </p>

      <h2>Durée de conservation</h2>
      <p>Les échanges liés à un projet sont conservés trois ans après le dernier contact, puis supprimés.</p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données en écrivant à l&apos;adresse
        ci-dessus. Vous pouvez aussi saisir la CNIL (cnil.fr).
      </p>
    </LegalPage>
  )
}
