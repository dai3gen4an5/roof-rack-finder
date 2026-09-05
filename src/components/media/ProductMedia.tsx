import { PhotoSlot } from "@/components/media/PhotoSlot";
import { getProductPhotoAssetKey } from "@/lib/media";

/**
 * Product photography slot for a result/comparison card. Renders the
 * manufacturer's product photo once licensed; until then, PhotoSlot's flat
 * placeholder holds the space so the card layout never needs to change to
 * accommodate a real photo later. Never a generated/illustrated stand-in
 * for the actual product.
 */
export function ProductMedia({
  productName,
  className,
}: {
  productName: string;
  className?: string;
}) {
  return (
    <PhotoSlot
      assetKey={getProductPhotoAssetKey(productName)}
      alt={`${productName} product photo`}
      sizes="(min-width: 640px) 220px, 100vw"
      className={className}
    />
  );
}
