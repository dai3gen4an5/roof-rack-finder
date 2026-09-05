import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getYearsForVehicle } from "@/lib/data/generations";

export default function sitemap(): MetadataRoute.Sitemap {
  const yearEntries: MetadataRoute.Sitemap = getYearsForVehicle("toyota-4runner").map((year) => ({
    url: `${SITE_URL}/toyota/4runner/${year}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/toyota/4runner`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...yearEntries,
  ];
}
