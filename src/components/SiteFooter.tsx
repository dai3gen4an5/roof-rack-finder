import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-warmgray">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-ink">{SITE_NAME}</p>
          <p className="mt-2 text-sm text-ink-muted">
            An independent roof rack fit finder — not a listicle, not a review farm. Just
            manufacturer-verified fitment, compared clearly.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">Navigate</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/" className="hover:text-ink">
                Home
              </Link>
            </li>
            <li>
              <Link href="/toyota/4runner" className="hover:text-ink">
                4Runner Rack Finder
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">Trust</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-muted">
            <li>
              <Link href="/toyota/4runner#methodology" className="hover:text-ink">
                About &amp; Methodology
              </Link>
            </li>
            <li>
              <Link href="/toyota/4runner#faq" className="hover:text-ink">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/toyota/4runner#affiliate-disclosure" className="hover:text-ink">
                Affiliate Disclosure
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-bold tracking-wide text-ink-soft uppercase">Vehicle coverage</p>
          <p className="mt-3 text-sm text-ink-muted">Toyota 4Runner, 2010–2026 (5th &amp; 6th Gen).</p>
          <p className="mt-2 text-sm text-ink-muted">More vehicles planned as verified data becomes available.</p>
        </div>
      </div>

      <div className="border-t border-line-strong">
        <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-ink-soft sm:px-6">
          <p>
            {SITE_NAME} is an independent roof rack fit finder and is not affiliated with Toyota
            Motor Corporation or any rack manufacturer. &quot;4Runner&quot; is a trademark of Toyota
            Motor Corporation, referenced here for identification purposes only.
          </p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} {SITE_NAME}.
          </p>
        </div>
      </div>
    </footer>
  );
}
