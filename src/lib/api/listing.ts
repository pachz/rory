import { unstable_cache } from "next/cache";
import { graphqlRequest } from "@/lib/graphql/client";
import { GET_MERCHANT_CATALOG } from "@/lib/graphql/queries";
import {
  merchantDomain,
  type Merchant,
  type MerchantCatalog,
} from "@/lib/merchants";

const REVALIDATE_SECONDS = Number(
  process.env.CACHE_REVALIDATE_SECONDS ?? 300,
);

interface CatalogEntity {
  id: string;
  username: string | null;
  name: string;
  logo: string | null;
  coverPhoto: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean;
  isMapActive: boolean;
  type: { label: string } | null;
  activePlan: { label: string } | null;
}

async function fetchMerchantCatalogUncached(): Promise<MerchantCatalog> {
  const data = await graphqlRequest<{
    plans: { entities: CatalogEntity[] }[];
  }>(GET_MERCHANT_CATALOG, {}, "getMerchantCatalog");

  const merchants = new Map<string, Merchant>();

  for (const plan of data?.plans ?? []) {
    for (const entity of plan.entities ?? []) {
      const username = entity.username?.trim();
      if (!username || merchants.has(username)) continue;

      merchants.set(username, {
        id: entity.id,
        username,
        name: entity.name,
        domain: merchantDomain(username),
        logo: entity.logo,
        coverPhoto: entity.coverPhoto,
        primaryColor: entity.primaryColor,
        secondaryColor: entity.secondaryColor,
        isActive: entity.isActive,
        isMapActive: entity.isMapActive,
        type: entity.type?.label ?? "Restaurant",
        plan: entity.activePlan?.label ?? null,
      });
    }
  }

  const list = Array.from(merchants.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "fa"),
  );

  return {
    fetchedAt: new Date().toISOString(),
    source: process.env.CITADEL_API_URL ?? "https://citadel.menew.ir/api",
    domainSuffix: process.env.MAIN_DOMAIN ?? "rory.ir",
    count: list.length,
    activeCount: list.filter((m) => m.isActive).length,
    merchants: list,
  };
}

export function getMerchantCatalog(): Promise<MerchantCatalog> {
  return unstable_cache(
    fetchMerchantCatalogUncached,
    ["merchant-catalog"],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: ["merchant-catalog"],
    },
  )();
}
