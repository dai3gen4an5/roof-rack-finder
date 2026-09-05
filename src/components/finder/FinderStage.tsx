import { FinderStageMedia } from "@/components/media/FinderStageMedia";
import { FinderWizard } from "@/components/finder/FinderWizard";

/**
 * Stages the finder in front of its own photography rather than a flat
 * color panel — but the wizard stays a modest, side-anchored panel over the
 * open part of the frame, never a giant card floating centered on top of
 * the photo.
 */
export function FinderStage({
  vehicleId,
  vehicleLabel,
  vehiclePath,
}: {
  vehicleId: string;
  vehicleLabel: string;
  vehiclePath: string;
}) {
  return (
    <div className="relative min-h-[720px] w-full overflow-hidden">
      <FinderStageMedia
        alt="Toyota 4Runner with roof rack overlooking a mountain valley"
        className="absolute inset-0 h-full w-full"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-transparent" />
      <div className="relative flex min-h-[720px] items-center px-4 py-16 sm:px-6 lg:px-16">
        <div className="w-full max-w-md">
          <FinderWizard vehicleId={vehicleId} vehicleLabel={vehicleLabel} vehiclePath={vehiclePath} />
        </div>
      </div>
    </div>
  );
}
