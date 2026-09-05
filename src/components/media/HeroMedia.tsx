"use client";

import { useEffect, useRef } from "react";
import { PhotoSlot } from "@/components/media/PhotoSlot";

/**
 * Full-bleed hero photo with a very subtle scroll-tied "Ken Burns" scale
 * (1 → ~1.05) — meant to read as a slow, almost-still camera move, not a
 * SaaS parallax effect. Pure rAF-batched scroll listener, no library,
 * disconnected via IntersectionObserver while off-screen, and fully
 * skipped under prefers-reduced-motion.
 */
export function HeroMedia({ alt }: { alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    let inView = true;

    function update() {
      ticking = false;
      if (!inView || !wrap) return;
      const rect = wrap.getBoundingClientRect();
      const progress = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1);
      const scale = 1 + progress * 0.05;
      wrap.style.transform = `scale(${scale.toFixed(4)})`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) onScroll();
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 h-full w-full will-change-transform">
      <PhotoSlot
        assetKey="home-hero"
        alt={alt}
        priority
        sizes="100vw"
        quality={85}
        className="h-full w-full"
      />
    </div>
  );
}
