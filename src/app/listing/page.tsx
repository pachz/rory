import type { Metadata } from "next";
import { getMerchantCatalog } from "@/lib/api/listing";
import { ListingDirectory } from "@/components/listing/ListingDirectory";
import { getMerchantPlans, getMerchantTypes } from "@/lib/merchants";
import { formatPersianDateTime } from "@/lib/persian-format";

/** ISR — matches CACHE_REVALIDATE_SECONDS default (300s). */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Restaurant Directory | Rory",
  description:
    "Browse every restaurant, café, and lounge on Rory — discover digital menus near you.",
  openGraph: {
    title: "Restaurant Directory | Rory",
    description:
      "Browse every restaurant, café, and lounge on Rory — discover digital menus near you.",
  },
};

export default async function ListingPage() {
  const catalog = await getMerchantCatalog();
  const types = getMerchantTypes(catalog.merchants);
  const plans = getMerchantPlans(catalog.merchants);

  return (
    <div dir="rtl" lang="fa">
      <ListingDirectory
        merchants={catalog.merchants}
        types={types}
        plans={plans}
        stats={{
          total: catalog.count,
          active: catalog.activeCount,
          fetchedAtLabel: formatPersianDateTime(catalog.fetchedAt),
        }}
      />
    </div>
  );
}
