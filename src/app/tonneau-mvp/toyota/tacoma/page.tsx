import type { Metadata } from "next";
import { TonneauFinderWizard } from "@/components/tonneau/TonneauFinderWizard";

/**
 * TonneauFit Finder MVP — dev-verification route only.
 *
 * Deliberately NOT wired into sitemap.ts/robots.ts, has no per-year route
 * (unlike Roof Rack's `[make]/[model]/[year]`), and carries no canonical —
 * this is an internal validation route, not a production page, and must
 * never present as one. `robots: { index: false, follow: false }` below is
 * the page-level backstop for that even if this route were ever pushed to
 * Production by mistake: `sitemap.ts`/`robots.ts` staying untouched means
 * crawlers are never TOLD about this URL, and this metadata means they're
 * told not to index it even if they find it some other way (an internal
 * link, a direct URL guess, etc). Phase 2 Step 3's purpose is to verify
 * that `TonneauFinderWizard` correctly drives `recommendCovers` end to
 * end, not to stand up production SEO surface for this domain. See the
 * Step 3 report for what a real production rollout would still need.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TonneauMvpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-bold tracking-[0.2em] text-clay uppercase">Internal dev route</p>
      <h1 className="font-display mt-2 text-3xl font-semibold text-ink sm:text-4xl">
        TonneauFit Finder — Toyota Tacoma (MVP)
      </h1>
      <p className="mt-2 max-w-xl text-sm text-ink-muted">
        Verifies the TonneauFit domain (built on MMFE Core in Phase 2) end to
        end through a real Wizard UI. Not linked from anywhere production-facing.
      </p>
      <div className="mt-8">
        <TonneauFinderWizard />
      </div>
    </div>
  );
}
