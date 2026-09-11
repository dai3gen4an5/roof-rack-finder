import type { Generation, Vehicle } from "@/domains/roof-rack/types";

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface GenerationCopy {
  intro: string;
  faqs: FaqEntry[];
}

/**
 * Real, per-vehicle marketing/trust copy for the vehicle-level and
 * per-year pages — deliberately not derived/templated from the vehicle's
 * name alone, so every vehicle gets pages that read as genuinely written
 * for it (real FAQs, real generation-specific notes) rather than a thin
 * find/replace of "4Runner" -> "Tacoma".
 */
export interface VehicleContent {
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  faqs: FaqEntry[];
  /** e.g. "5th Generation (2010–2024) and 6th Generation (2025–2026)." — the
   * detail half of the "{Make} {Model} generations covered: ..." sentence
   * in the methodology accordion. */
  generationsCoveredDetail: string;
  generationCopy: Record<Generation["id"], GenerationCopy>;
}

export const VEHICLE_CONTENT: Record<Vehicle["id"], VehicleContent> = {
  "toyota-4runner": {
    metaTitle: "Toyota 4Runner Roof Rack Fit Finder",
    metaDescription:
      "Find a manufacturer-verified roof rack for your 2010–2026 Toyota 4Runner. Compare fitment, load capacity, installation type, and reference price by use case.",
    heroSubtitle: "Covers 2010–2026 (5th & 6th Gen). Manufacturer-verified fitment only.",
    generationsCoveredDetail: "5th Generation (2010–2024) and 6th Generation (2025–2026).",
    faqs: [
      {
        question: "How do you decide a rack \"fits\" my 4Runner?",
        answer:
          "We only list a fitment when the rack manufacturer states it directly for a given model year range on their own product page. We don't infer fitment from vehicle dimensions, other model years, or similar-looking parts.",
      },
      {
        question: "What's the difference between dynamic and static capacity?",
        answer:
          "Dynamic capacity is the manufacturer-rated load limit while the vehicle is being driven. Static capacity is the rated limit while the vehicle is parked (e.g. camping in a rooftop tent). Both are set by the rack manufacturer for that specific rack.",
      },
      {
        question: "Is the rack's load capacity the same as my 4Runner's roof-load limit?",
        answer:
          "No. Those are two separate limits. The rack manufacturer only rates the rack itself. Toyota separately publishes a roof-load limit for the vehicle in the owner's manual. Always follow whichever limit is lower — check your owner's manual before loading anything.",
      },
      {
        question: "Why is there no 3/4-length rack shown for the 2025–2026 4Runner?",
        answer:
          "As of our last data check, Prinsu has not published a 3/4-length rack for the 6th generation 4Runner. We show an honest empty result rather than suggesting a rack that hasn't been confirmed to fit.",
      },
      {
        question: "Should I get the Original or the Pro rack?",
        answer:
          "Both are full-length, non-drill, manufacturer-verified fits. The Original is the lower-cost, still-capable option; the Pro costs more but carries a higher manufacturer-stated capacity. Pick \"Maximum capacity\" in the finder if you specifically need the extra headroom, or \"Lower cost\" if the Original's capacity already covers your load.",
      },
      {
        question: "Are the listed prices guaranteed?",
        answer:
          "No. Prices are labeled \"reference price\" because manufacturers change pricing over time, and change even faster during sales. Always confirm the current price on the manufacturer's page before buying.",
      },
      {
        question: "Do you earn money if I buy through your links?",
        answer: "Not currently. See the Affiliate Disclosure section below.",
      },
    ],
    generationCopy: {
      "4runner-5th-gen": {
        intro:
          "Three manufacturer-verified Prinsu rack fitments exist for this generation: two full-length racks (Original and Pro) and one 3/4-length rack, all installing through factory mounting points with no drilling.",
        faqs: [
          {
            question: "What's different between the Original and Pro racks for the 5th Gen 4Runner?",
            answer:
              "Both are full-length and non-drill. The Pro carries a higher manufacturer-stated capacity (700 lb dynamic / 1,200 lb static vs. 600 lb / 1,000 lb) at a higher reference price. Use the finder's \"Maximum capacity\" or \"Lower cost\" preference to see which one fits your budget and load.",
          },
          {
            question: "Is the 3/4-length rack a good fit for a rooftop tent?",
            answer:
              "It carries the same manufacturer-stated capacity as the full-length Original (600 lb dynamic / 1,000 lb static), so it can work for lighter rooftop tents — but a full-length rack gives the tent's mounting hardware more surface to spread across. Check the tent manufacturer's own mounting requirements too.",
          },
        ],
      },
      "4runner-6th-gen": {
        intro:
          "Two manufacturer-verified Prinsu full-length rack fitments exist so far (Original and Pro), both bolt-on/non-drill. No 3/4-length rack has been published for this generation yet.",
        faqs: [
          {
            question: "Why isn't there a 3/4-length rack for this generation yet?",
            answer:
              "As of our last check, Prinsu hasn't published one for the 6th Gen 4Runner. Rather than guess at a fitment that hasn't been confirmed, the finder shows an honest empty result if you select \"Smaller / 3/4 rack\" for this generation.",
          },
          {
            question: "Which rack should I get for a new 6th Gen 4Runner?",
            answer:
              "Both the Original and Pro are full-length and non-drill. The Pro's higher manufacturer-stated capacity (700 lb dynamic / 1,200 lb static) costs more than the Original (600 lb / 1,000 lb). Use the finder to compare them against your specific use case and budget.",
          },
        ],
      },
    },
  },

  "toyota-tacoma": {
    metaTitle: "Toyota Tacoma Roof Rack Fit Finder",
    metaDescription:
      "Find a manufacturer-verified roof rack for your 2005–2026 Toyota Tacoma. Compare fitment by generation and cab configuration, load capacity, installation type, and reference price.",
    heroSubtitle: "Covers 2005–2026 (2nd, 3rd & 4th Gen). Manufacturer-verified fitment only.",
    generationsCoveredDetail:
      "2nd Generation (2005–2015), 3rd Generation (2016–2023), and 4th Generation (2024–2026).",
    faqs: [
      {
        question: "How do you decide a rack \"fits\" my Tacoma?",
        answer:
          "We only list a fitment when the rack manufacturer states it directly for a given model year range on their own product page. We don't infer fitment from vehicle dimensions, other model years, or similar-looking parts.",
      },
      {
        question: "Does a Prinsu rack fit both Double Cab and Access Cab?",
        answer:
          "It depends on the specific rack. The Prinsu Cab Rack (Original and Pro) doesn't state any cab-specific restriction on its own product page for 2005–2023, so it's shown for either cab configuration. The Prinsu Access Rack is different — it's built specifically for Access Cab and only appears once you select Access Cab.",
      },
      {
        question: "Why doesn't the Access Rack show up for my 2023 Tacoma?",
        answer:
          "Prinsu's own product page for the Access Rack states two different year ranges in different places on the same page (2005–2022 in the title and feature list, 2010–2023 in the body description). Since we won't guess which one is correct, RackFit only shows this fitment for the years both statements agree on: 2010–2022. A 2023 Access Cab Tacoma won't see this rack until Prinsu clarifies its stated fitment.",
      },
      {
        question: "What's the difference between the Cab Rack and the Access Rack?",
        answer:
          "The Cab Rack (Original and Pro) mounts through factory or bolt-on points with no drilling. The Access Rack requires a drilled installation. Manufacturer-stated capacity is otherwise similar between the non-Pro versions of each.",
      },
      {
        question: "What's the difference between dynamic and static capacity?",
        answer:
          "Dynamic capacity is the manufacturer-rated load limit while the vehicle is being driven. Static capacity is the rated limit while the vehicle is parked (e.g. camping in a rooftop tent). Both are set by the rack manufacturer for that specific rack.",
      },
      {
        question: "Is the rack's load capacity the same as my Tacoma's roof-load limit?",
        answer:
          "No. Those are two separate limits. The rack manufacturer only rates the rack itself. Toyota separately publishes a roof-load limit for the vehicle in the owner's manual. Always follow whichever limit is lower — check your owner's manual before loading anything.",
      },
      {
        question: "Are the listed prices guaranteed?",
        answer:
          "No. Prices are labeled \"reference price\" because manufacturers change pricing over time, and change even faster during sales. Always confirm the current price on the manufacturer's page before buying.",
      },
      {
        question: "Do you earn money if I buy through your links?",
        answer: "Not currently. See the Affiliate Disclosure section below.",
      },
    ],
    generationCopy: {
      "tacoma-2nd-gen": {
        intro:
          "Two manufacturer-verified Prinsu fitments exist for this generation: the Cab Rack (Original and Pro), which Prinsu's own page doesn't restrict to a specific cab configuration, and the Access Cab-specific Access Rack, verified for 2010–2015 within this generation (drilled installation).",
        faqs: [
          {
            question: "Does the Cab Rack fit my Double Cab 2nd Gen Tacoma?",
            answer:
              "Yes — Prinsu's product page for the Cab Rack (Original and Pro) doesn't restrict fitment to a specific cab configuration across 2005–2023, so it's shown for both Double Cab and Access Cab.",
          },
          {
            question: "Is the Access Rack available for every 2nd Gen model year?",
            answer:
              "No. Prinsu's own page for the Access Rack only supports the years where its title/features and body description agree — that's 2010–2015 within this generation. Earlier 2nd Gen years (2005–2009) aren't covered by this specific rack.",
          },
        ],
      },
      "tacoma-3rd-gen": {
        intro:
          "Two manufacturer-verified Prinsu Cab Rack fitments (Original and Pro) cover this whole generation regardless of cab configuration. The Access Cab-specific Access Rack is verified only through 2022 — Prinsu's own product page states conflicting year ranges, and RackFit only shows this fitment where both statements agree.",
        faqs: [
          {
            question: "Why isn't the Access Rack shown for a 2023 Tacoma?",
            answer:
              "Prinsu's Access Rack page states 2005–2022 in its title/features and 2010–2023 in its body description — a genuine conflict on the manufacturer's own page. RackFit only shows this fitment for the overlap both statements agree on (2010–2022), so 2023 Access Cab is excluded until Prinsu clarifies it.",
          },
          {
            question: "Which rack should I get for a Double Cab 3rd Gen Tacoma?",
            answer:
              "The Cab Rack (Original or Pro) — Prinsu's Access Rack is only stated for Access Cab. Use the finder's \"Maximum capacity\" or \"Lower cost\" preference to choose between Original and Pro.",
          },
        ],
      },
      "tacoma-4th-gen": {
        intro:
          "Two manufacturer-verified Prinsu full-length rack fitments exist so far (Original and Pro), both bolt-on/non-drill. Neither product page states a cab-specific restriction, so no vehicle configuration selection is needed for this generation.",
        faqs: [
          {
            question: "Do I need to select a cab configuration for a 2024+ Tacoma?",
            answer:
              "No — neither Prinsu rack currently published for this generation states a cab restriction, so results are the same regardless of Double Cab or Access Cab.",
          },
          {
            question: "Which rack should I get for a new 4th Gen Tacoma?",
            answer:
              "Both the Original and Pro are full-length and bolt-on/non-drill. The Pro carries a higher manufacturer-stated capacity (700 lb dynamic / 1,200 lb static vs. 600 lb / 1,000 lb) at a higher reference price. Use the finder's \"Maximum capacity\" or \"Lower cost\" preference to compare them against your budget and load.",
          },
        ],
      },
    },
  },
};

export function getVehicleContent(vehicleId: Vehicle["id"]): VehicleContent | undefined {
  return VEHICLE_CONTENT[vehicleId];
}
