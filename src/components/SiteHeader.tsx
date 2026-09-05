import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-ink">{SITE_NAME}</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-semibold text-ink-muted">
          <Link href="/toyota/4runner" className="hover:text-clay">
            4Runner Finder
          </Link>
          <Link
            href="/toyota/4runner#finder"
            className="hidden rounded-full bg-clay px-4 py-2 text-paper transition-colors hover:bg-clay-dark sm:inline-flex"
          >
            Find my rack
          </Link>
        </nav>
      </div>
    </header>
  );
}
