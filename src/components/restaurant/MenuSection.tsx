"use client";

import { useEffect, useState } from "react";
import { RemoteImage } from "@/components/ui/RemoteImage";
import type { MenuCategory, MenuItem } from "@/lib/graphql/types";
import { CATEGORY_COMPACT_THRESHOLD } from "@/lib/menu-config";
import { MenuItemCard } from "./MenuItemCard";

interface MenuSectionProps {
  categories: MenuCategory[];
  currency: string;
  onSelectItem: (item: MenuItem) => void;
}

function visibleItems(category: MenuCategory) {
  return category.items.filter(
    (item) => !item.itemCategories.some((c) => c.isHidden),
  );
}

function CategoryHeader({
  category,
  compact,
  isOpen,
  itemCount,
  onToggle,
}: {
  category: MenuCategory;
  compact: boolean;
  isOpen: boolean;
  itemCount: number;
  onToggle: () => void;
}) {
  if (!compact) {
    return (
      <div className="mb-4 flex items-center gap-3">
        <RemoteImage
          src={category.thumbnail}
          alt={category.label}
          width={24}
          height={24}
          variant="category"
          objectFit="contain"
          containerClassName="h-6 w-6 shrink-0"
          className="opacity-70"
        />
        <h2 className="text-lg font-bold text-[var(--foreground)]">
          {category.label}
        </h2>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="mb-3 flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-start transition hover:border-[var(--brand-secondary)]/30"
    >
      <RemoteImage
        src={category.thumbnail}
        alt={category.label}
        width={32}
        height={32}
        variant="category"
        objectFit="contain"
        containerClassName="h-8 w-8 shrink-0"
        className="opacity-80"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-bold text-[var(--foreground)]">{category.label}</h2>
        <p className="text-xs text-[var(--muted-light)]">{itemCount} مورد</p>
      </div>
      <span
        className={`shrink-0 text-[var(--muted)] transition-transform ${isOpen ? "rotate-180" : ""}`}
      >
        ▾
      </span>
    </button>
  );
}

export function MenuSection({
  categories,
  currency,
  onSelectItem,
}: MenuSectionProps) {
  const compact = categories.length > CATEGORY_COMPACT_THRESHOLD;
  const visibleCategories = categories.filter(
    (cat) => visibleItems(cat).length > 0,
  );
  const [openIds, setOpenIds] = useState<Set<string>>(() => {
    const first = visibleCategories[0]?.id;
    return new Set(compact && first ? [first] : []);
  });

  useEffect(() => {
    const handler = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setOpenIds((prev) => new Set(prev).add(id));
    };
    window.addEventListener("rory:category-nav", handler);
    return () => window.removeEventListener("rory:category-nav", handler);
  }, []);

  const toggleCategory = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (visibleCategories.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-[var(--muted)]">
        منویی برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      {visibleCategories.map((category) => {
        const items = visibleItems(category);
        const isOpen = !compact || openIds.has(category.id);

        return (
          <section
            key={category.id}
            id={`category-${category.id}`}
            className="mb-6 scroll-mt-16"
          >
            <CategoryHeader
              category={category}
              compact={compact}
              isOpen={isOpen}
              itemCount={items.length}
              onToggle={() => toggleCategory(category.id)}
            />

            {isOpen && (
              <div className="flex flex-col gap-3 pb-4">
                {items.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    currency={currency}
                    onSelect={onSelectItem}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
