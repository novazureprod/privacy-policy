import type { Metadata } from "next"
import { LegalPage, ToFill } from "@/components/site/legal-page"

export const metadata: Metadata = {
  title: "Mentions légales — Novazure",
  alternates: { canonical: "/mentions-legales" },
}

// Les éléments surlignés en or sont à compléter avant la mise en ligne.
export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated="novembre 2026">
      <h2>Éditeur du site</h2>
      <p>
        Novazure, entreprise de production vidéo représentée par Louann Mastrovito.
        <br />
        Statut juridique : <ToFill>à compléter (ex. micro-entreprise)</ToFill>
        <br />
        SIRET : <ToFill>à compléter</ToFill>
        <br />
        Adresse : <ToFill>à compléter</ToFill>
        <br />
        Contact : <ToFill>adresse e-mail à compléter</ToFill>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Louann Mastrovito.</p>

      <h2>Hébergement</h2>
      <p>
        <ToFill>Nom, adresse et téléphone de l&apos;hébergeur (par exemple Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis)</ToFill>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les films, photographies, textes et le logo présents sur ce site sont la propriété de Novazure ou de ses clients,
        qui en ont autorisé la diffusion. Toute reproduction sans autorisation écrite est interdite.
      </p>

      <h2>Vidéos</h2>
      <p>
        Les vidéos sont hébergées sur YouTube et intégrées en mode « confidentialité renforcée » (youtube-nocookie.com) :
        aucun cookie YouTube n&apos;est déposé tant que vous ne lancez pas une vidéo.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Novazure s&apos;efforce de fournir des informations exactes. Elle ne peut être tenue responsable d&apos;une erreur
        ou d&apos;une indisponibilité du site.
      </p>
    </LegalPage>
  )
}
