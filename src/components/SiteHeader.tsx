import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {SITE_NAME}
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-stone-600 dark:text-stone-300">
          <Link href="/toyota/4runner" className="hover:text-orange-700 dark:hover:text-orange-400">
            4Runner Rack Finder
          </Link>
        </nav>
      </div>
    </header>
  );
}
