import Image from "next/image";
import { getBannerCategory } from "@/lib/listing-banners";

interface StockCategoryBannerProps {
  type: string;
  accent?: string | null;
  priority?: boolean;
}

export function StockCategoryBanner({
  type,
  accent,
  priority = false,
}: StockCategoryBannerProps) {
  const category = getBannerCategory(type);
  const path = `/banners/${category}.svg`;

  return (
    <div className="relative h-full min-h-[7.5rem] w-full overflow-hidden">
      <Image
        src={path}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover"
      />
      {accent && (
        <div
          className="absolute inset-0 mix-blend-multiply opacity-30"
          style={{ backgroundColor: accent }}
          aria-hidden
        />
      )}
    </div>
  );
}
