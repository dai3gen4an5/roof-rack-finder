import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getYearsForVehicle } from "@/domains/roof-rack/data/generations";
import { vehicles } from "@/domains/roof-rack/data/vehicles";

export default function sitemap(): MetadataRoute.Sitemap {
  const vehicleEntries: MetadataRoute.Sitemap = vehicles.flatMap((vehicle) => {
    const vehiclePath = `/${vehicle.slug[0]}/${vehicle.slug[1]}`;
    const yearEntries: MetadataRoute.Sitemap = getYearsForVehicle(vehicle.id).map((year) => ({
      url: `${SITE_URL}${vehiclePath}/${year}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [
      {
        url: `${SITE_URL}${vehiclePath}`,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      ...yearEntries,
    ];
  });

  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...vehicleEntries,
  ];
}
