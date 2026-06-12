"use client";

import { useState } from "react";
import Image from "next/image";
import { resolveMerchantBanner } from "@/lib/listing-banners";
import type { Merchant } from "@/lib/merchants";
import { StockCategoryBanner } from "./StockCategoryBanner";

interface MerchantCoverProps {
  merchant: Merchant;
  priority?: boolean;
}

export function MerchantCover({ merchant, priority = false }: MerchantCoverProps) {
  const { coverSrc, hasCover } = resolveMerchantBanner(merchant);
  const [coverFailed, setCoverFailed] = useState(false);

  if (!hasCover || coverFailed) {
    return (
      <StockCategoryBanner
        type={merchant.type}
        accent={merchant.primaryColor}
        priority={priority}
      />
    );
  }

  return (
    <div className="relative h-full min-h-[7.5rem] w-full">
      <Image
        src={coverSrc!}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition duration-500 group-hover:scale-105"
        onError={() => setCoverFailed(true)}
      />
    </div>
  );
}
