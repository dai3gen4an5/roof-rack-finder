import type { ComponentType, SVGProps } from "react";
import type { PreferenceId, UseCaseId } from "@/lib/types";
import {
  BikeIcon,
  CargoBoxIcon,
  CompactRackIcon,
  CompassIcon,
  KayakIcon,
  ScaleIcon,
  StarBalanceIcon,
  TagIcon,
  TentIcon,
} from "@/components/visuals/Icons";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

export const USE_CASE_ICONS: Record<UseCaseId, Icon> = {
  "rooftop-tent": TentIcon,
  "cargo-storage": CargoBoxIcon,
  "kayak-surf": KayakIcon,
  "bike-ski": BikeIcon,
  overlanding: CompassIcon,
};

export const PREFERENCE_ICONS: Record<PreferenceId, Icon> = {
  "best-overall": StarBalanceIcon,
  "max-capacity": ScaleIcon,
  "lower-cost": TagIcon,
  "smaller-three-quarter": CompactRackIcon,
};
