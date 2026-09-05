import Link from "next/link";
import type { Generation } from "@/lib/types";
import { VehicleGenerationMedia } from "@/components/media/VehicleGenerationMedia";
import { RevealOnScroll } from "@/components/media/RevealOnScroll";

/**
 * A single generation treated as its own large editorial feature — large
 * photography with monumental year-range typography, not a small card in a
 * grid. Used twice in sequence on Home (5th Gen, then 6th Gen).
 */
export function GenerationFeature({ generation, href }: { generation: Generation; href: string }) {
  return (
    <RevealOnScroll>
      <Link href={href} className="group block">
        <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden">
          <VehicleGenerationMedia
            generationId={generation.id as "4runner-5th-gen" | "4runner-6th-gen"}
            alt={`${generation.name} Toyota 4Runner with roof rack`}
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10 lg:p-14">
            <p className="font-hero text-6xl leading-none font-bold text-paper sm:text-8xl">
              {generation.yearStart}–{generation.yearEnd}
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
                {generation.name}
              </h3>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-paper underline decoration-paper/40 underline-offset-4 group-hover:decoration-paper">
                Explore this generation
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L11.29 6.16a.75.75 0 1 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06l3.098-3.09H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </RevealOnScroll>
  );
}
