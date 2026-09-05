import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 text-sm text-stone-500 sm:px-6 dark:text-stone-400">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/toyota/4runner#methodology" className="hover:text-stone-800 dark:hover:text-stone-100">
            About &amp; Methodology
          </Link>
          <Link href="/toyota/4runner#faq" className="hover:text-stone-800 dark:hover:text-stone-100">
            FAQ
          </Link>
          <Link
            href="/toyota/4runner#affiliate-disclosure"
            className="hover:text-stone-800 dark:hover:text-stone-100"
          >
            Affiliate Disclosure
          </Link>
        </div>
        <p>
          {SITE_NAME} is an independent roof rack fit finder and is not affiliated with Toyota
          Motor Corporation or any rack manufacturer. &quot;4Runner&quot; is a trademark of Toyota
          Motor Corporation, referenced here for identification purposes only.
        </p>
        <p>&copy; {new Date().getFullYear()} {SITE_NAME}.</p>
      </div>
    </footer>
  );
}
