import type { MenuCategory } from "@/lib/graphql/types";
import { MenuItemCard } from "./MenuItemCard";
import type { MenuItem } from "@/lib/graphql/types";

interface MenuSectionProps {
  categories: MenuCategory[];
  currency: string;
  onSelectItem: (item: MenuItem) => void;
}

export function MenuSection({
  categories,
  currency,
  onSelectItem,
}: MenuSectionProps) {
  const visibleCategories = categories.filter((cat) =>
    cat.items.some((item) => !item.itemCategories.some((c) => c.isHidden)),
  );

  if (visibleCategories.length === 0) {
    return (
      <div className="px-5 py-16 text-center text-black/50">
        منویی برای نمایش وجود ندارد.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-32 pt-6">
      {visibleCategories.map((category) => (
        <section
          key={category.id}
          id={`category-${category.id}`}
          className="mb-10 scroll-mt-16"
        >
          <div className="mb-4 flex items-center gap-3">
            {category.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={category.thumbnail}
                alt=""
                className="h-6 w-6 opacity-70"
              />
            )}
            <h2 className="text-lg font-bold text-[var(--foreground)]">
              {category.label}
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {category.items.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currency={currency}
                onSelect={onSelectItem}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
