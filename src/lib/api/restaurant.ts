import { unstable_cache } from "next/cache";
import { graphqlRequest } from "@/lib/graphql/client";
import {
  GET_ENTITY_AMENITIES,
  GET_ENTITY_ITEMS,
  GET_INTRO,
} from "@/lib/graphql/queries";
import type {
  Amenity,
  EntityIntro,
  Menu,
  RestaurantData,
} from "@/lib/graphql/types";

const REVALIDATE_SECONDS = Number(
  process.env.CACHE_REVALIDATE_SECONDS ?? 300,
);

async function fetchIntro(link: string): Promise<EntityIntro | null> {
  const data = await graphqlRequest<{ entity: EntityIntro | null }>(
    GET_INTRO,
    { link, language: null },
    "getIntro",
  );
  return data?.entity ?? null;
}

async function fetchMenus(entityId: string): Promise<Menu[]> {
  const data = await graphqlRequest<{ entity: { menus: Menu[] } | null }>(
    GET_ENTITY_ITEMS,
    { id: entityId, language: null, flavour: "VILLAGE" },
    "getEntityItems",
  );
  return data?.entity?.menus ?? [];
}

async function fetchAmenities(username: string): Promise<Amenity[]> {
  const data = await graphqlRequest<{
    entity: { amenities: Amenity[] } | null;
  }>(GET_ENTITY_AMENITIES, { username }, "GetEntityAmenities");
  return data?.entity?.amenities ?? [];
}

async function fetchRestaurantUncached(
  subdomain: string,
): Promise<RestaurantData | null> {
  const intro = await fetchIntro(subdomain);
  if (!intro) {
    return null;
  }

  const [menus, amenities] = await Promise.all([
    fetchMenus(intro.id),
    fetchAmenities(intro.username),
  ]);

  return { intro, menus, amenities };
}

export function getRestaurantData(
  subdomain: string,
): Promise<RestaurantData | null> {
  return unstable_cache(
    () => fetchRestaurantUncached(subdomain),
    ["restaurant", subdomain],
    {
      revalidate: REVALIDATE_SECONDS,
      tags: [`restaurant:${subdomain}`],
    },
  )();
}
