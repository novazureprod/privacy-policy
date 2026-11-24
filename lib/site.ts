// Informations générales du site, réunies ici pour être modifiées en un seul endroit.
import { CALENDLY_URL } from "@/lib/niches"

export const SITE = {
  name: "Novazure",
  url: "https://novazure.fr",
  tagline: "Vidéaste et pilote de drone sur la Côte d'Azur et dans le Var",
  area: "Var · Côte d'Azur · Provence",
  youtube: "https://www.youtube.com/@Novazure83",
  calendly: CALENDLY_URL,
  // À compléter : adresse e-mail et téléphone de contact. Laissés vides, ils ne s'affichent pas.
  email: "",
  phone: "",
}

export const NAV = [
  { href: "/portfolio", label: "Réalisations" },
  { href: "/#process", label: "Méthode" },
  { href: "/#histoire", label: "Histoire" },
  { href: "/#contact", label: "Contact" },
]
