export function SafetyNotice({ vehicleLabel = "4Runner" }: { vehicleLabel?: string }) {
  return (
    <div className="border border-sand bg-sand/30 p-4 text-sm text-ink">
      <p className="font-bold">Two different limits apply — check both.</p>
      <p className="mt-1 text-ink-muted">
        A rack&apos;s manufacturer-stated load capacity is not the same as your{" "}
        {vehicleLabel}&apos;s roof-load limit set by Toyota. Before loading a rack,
        confirm your vehicle&apos;s roof-load limit in your owner&apos;s manual or
        with Toyota, and never exceed whichever limit — rack or vehicle — is
        lower.
      </p>
    </div>
  );
}
