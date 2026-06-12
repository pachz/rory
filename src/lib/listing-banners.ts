import type { Merchant } from "@/lib/merchants";

export type BannerCategory =
  | "cafe"
  | "restaurant"
  | "lounge"
  | "fast-food"
  | "bakery"
  | "juice"
  | "sushi"
  | "tea-house"
  | "grill"
  | "shop"
  | "catering"
  | "takeaway"
  | "default";

const TYPE_TO_BANNER: Record<string, BannerCategory> = {
  Cafe: "cafe",
  "Cafe Restaurant": "restaurant",
  "Cafe & Restaurant": "restaurant",
  Restaurant: "restaurant",
  Lounge: "lounge",
  "Fast Food": "fast-food",
  Bakery: "bakery",
  Pastry: "bakery",
  "Juice / Ice Cream": "juice",
  "Sushi House": "sushi",
  "Traditional Tea House": "tea-house",
  "Barbecue / Grill": "grill",
  Shop: "shop",
  "Catering / Kitchen": "catering",
  Takeaway: "takeaway",
};

export function getBannerCategory(type: string): BannerCategory {
  return TYPE_TO_BANNER[type] ?? "default";
}

export function getStockBannerPath(type: string): string {
  return `/banners/${getBannerCategory(type)}.svg`;
}

export function resolveMerchantBanner(merchant: Merchant): {
  coverSrc: string | null;
  stockBannerPath: string;
  hasCover: boolean;
} {
  const cover = merchant.coverPhoto?.trim() || null;
  const stockBannerPath = getStockBannerPath(merchant.type);

  return {
    coverSrc: cover,
    stockBannerPath,
    hasCover: Boolean(cover),
  };
}
