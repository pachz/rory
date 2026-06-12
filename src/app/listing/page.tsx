import type { Metadata } from "next";
import { ListingDirectory } from "@/components/listing/ListingDirectory";
import {
  getMerchantCatalog,
  getMerchantPlans,
  getMerchants,
  getMerchantTypes,
} from "@/lib/merchants";

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

export default function ListingPage() {
  const catalog = getMerchantCatalog();
  const merchants = getMerchants();
  const types = getMerchantTypes();
  const plans = getMerchantPlans();

  return (
    <div dir="rtl" lang="fa">
      <ListingDirectory
        merchants={merchants}
        types={types}
        plans={plans}
        stats={{
          total: catalog.count,
          active: catalog.activeCount,
          generatedAt: catalog.generatedAt,
        }}
      />
    </div>
  );
}
