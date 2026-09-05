"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const startsTransparent = pathname === "/";
  const [scrolledPast, setScrolledPast] = useState(
    () => typeof window !== "undefined" && window.scrollY > window.innerHeight * 0.7
  );

  useEffect(() => {
    if (!startsTransparent) return;

    function onScroll() {
      setScrolledPast(window.scrollY > window.innerHeight * 0.7);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [startsTransparent]);

  const solid = !startsTransparent || scrolledPast;

  return (
    <header
      className={`inset-x-0 top-0 z-40 transition-colors duration-300 ${
        startsTransparent ? "fixed" : "relative"
      } ${solid ? "border-b border-line bg-paper" : "border-b border-transparent bg-transparent"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-3">
          <span
            className={`font-display text-xl font-bold tracking-tight ${solid ? "text-ink" : "text-paper"}`}
          >
            {SITE_NAME}
          </span>
          <span
            className={`hidden text-[10px] font-bold tracking-[0.15em] uppercase sm:inline ${
              solid ? "text-ink-soft" : "text-paper/80"
            }`}
          >
            Gear ready for real adventures
          </span>
        </Link>
        <nav
          className={`flex items-center gap-5 text-sm font-semibold ${solid ? "text-ink-muted" : "text-paper"}`}
        >
          <Link href="/toyota/4runner" className="hidden hover:opacity-70 sm:inline">
            Toyota 4Runner
          </Link>
          <Link href="/#how-it-works" className="hidden hover:opacity-70 md:inline">
            How It Works
          </Link>
          <Link href="/toyota/4runner#faq" className="hidden hover:opacity-70 md:inline">
            FAQ
          </Link>
          <Link href="/toyota/4runner#methodology" className="hidden hover:opacity-70 lg:inline">
            Methodology
          </Link>
          <Link
            href="/toyota/4runner#finder"
            className="rounded-full bg-clay px-4 py-2 text-paper transition-colors hover:bg-clay-dark"
          >
            Find my rack
          </Link>
        </nav>
      </div>
    </header>
  );
}
