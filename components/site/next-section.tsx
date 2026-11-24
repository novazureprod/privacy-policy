import { ChevronDown } from "lucide-react"

/** Lien discret en bas de section : saute directement à la section suivante. */
export function NextSection({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex justify-center pb-6">
      <a
        href={href}
        className="scroll-cue next-section flex flex-col items-center gap-1 font-sub text-[10px] tracking-[0.3em] text-[var(--nz-muted)] uppercase"
      >
        {label}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  )
}
