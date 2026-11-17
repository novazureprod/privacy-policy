import Link from "next/link"
import { NicheMenu } from "./niche-menu"

export function Header({ current }: { current?: string }) {
  return (
    <header className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-5 sm:px-10">
      <Link href="/" className="font-display text-sm font-extrabold tracking-[0.3em] text-[var(--nz-text)]">
        NOVAZURE
      </Link>
      <NicheMenu current={current} />
    </header>
  )
}
