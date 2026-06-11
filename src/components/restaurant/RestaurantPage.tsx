"use client";

import { useMemo, useState } from "react";
import type { RestaurantData, MenuItem } from "@/lib/graphql/types";
import { CartProvider } from "@/context/cart-context";
import { Hero } from "./Hero";
import { CategoryNav } from "./CategoryNav";
import { MenuSection } from "./MenuSection";
import { ItemModal } from "./ItemModal";
import { CartDrawer } from "./CartDrawer";
import { CartButton } from "./CartButton";
import { InfoSection } from "./InfoSection";
import { Footer } from "./Footer";

interface RestaurantPageProps {
  data: RestaurantData;
}

function RestaurantContent({ data }: RestaurantPageProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categories = useMemo(() => {
    const activeMenus = data.menus.filter((m) => m.isActive);
    const menu = activeMenus[0] ?? data.menus[0];
    return menu?.categories.filter((c) => c.status === "V") ?? [];
  }, [data.menus]);

  return (
    <>
      <Hero intro={data.intro} />
      <CategoryNav categories={categories} />
      <MenuSection
        categories={categories}
        currency={data.intro.currency}
        onSelectItem={setSelectedItem}
      />
      <InfoSection intro={data.intro} amenities={data.amenities} />
      <Footer intro={data.intro} />

      <ItemModal
        key={selectedItem?.id ?? "closed"}
        item={selectedItem}
        currency={data.intro.currency}
        onClose={() => setSelectedItem(null)}
      />
      <CartDrawer currency={data.intro.currency} />
      <CartButton />
    </>
  );
}

export function RestaurantPage({ data }: RestaurantPageProps) {
  const { intro } = data;
  const primary = intro.primaryColor ?? "#f5f0e8";
  const secondary = intro.secondaryColor ?? "#2c1810";

  return (
    <CartProvider>
      <div
        className="min-h-screen bg-[var(--background)]"
        style={
          {
            "--brand-primary": primary,
            "--brand-secondary": secondary,
            "--surface": "#ffffff",
          } as React.CSSProperties
        }
      >
        <RestaurantContent data={data} />
      </div>
    </CartProvider>
  );
}
