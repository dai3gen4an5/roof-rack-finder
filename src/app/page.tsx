import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <section className="flex flex-col items-start gap-6 text-left">
        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold tracking-wide text-orange-800 uppercase dark:bg-orange-950/50 dark:text-orange-300">
          Interactive fit finder, not a listicle
        </span>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl dark:text-stone-50">
          Find the right roof rack for your Toyota 4Runner
        </h1>
        <p className="max-w-xl text-lg text-stone-600 dark:text-stone-300">
          Tell us your model year, what you carry, and what matters most to you.
          We&apos;ll match you with roof racks whose fitment is confirmed directly by
          the manufacturer — not guessed.
        </p>
        <Link
          href="/toyota/4runner"
          className="inline-flex items-center justify-center rounded-full bg-orange-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-700"
        >
          Find your 4Runner&apos;s rack →
        </Link>
      </section>

      <section className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-semibold text-stone-900 dark:text-stone-50">1. Select your year</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            2010–2026 4Runners span two generations with different rack fitments.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-semibold text-stone-900 dark:text-stone-50">2. Tell us what you carry</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Rooftop tent, cargo, kayak, bikes, or general overlanding gear.
          </p>
        </div>
        <div className="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
          <h2 className="font-semibold text-stone-900 dark:text-stone-50">3. Compare verified fits</h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            See capacity, price, and installation type side by side, with a clear
            &quot;why this one&quot; explanation.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-stone-200 bg-white p-6 dark:border-stone-800 dark:bg-stone-900">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
          Currently supported vehicles
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
          Toyota 4Runner (2010–2026). More vehicles and manufacturers are planned as
          verified fitment data becomes available.
        </p>
      </section>
    </div>
  );
}
