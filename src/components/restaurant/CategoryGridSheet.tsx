"use client";

import { RemoteImage } from "@/components/ui/RemoteImage";
import type { MenuCategory } from "@/lib/graphql/types";

interface CategoryGridSheetProps {
  categories: MenuCategory[];
  activeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
}

export function CategoryGridSheet({
  categories,
  activeId,
  isOpen,
  onClose,
  onSelect,
}: CategoryGridSheetProps) {
  if (!isOpen) return null;

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end sm:items-center sm:justify-center sm:p-6">
      <button
        type="button"
        aria-label="Close categories"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[80vh] w-full flex-col overflow-hidden rounded-t-3xl bg-[var(--surface)] shadow-2xl sm:max-w-lg sm:rounded-3xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-lg font-bold">دسته‌بندی‌ها</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </header>

        <div className="overflow-y-auto p-4">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {categories.map((category) => {
              const isActive = activeId === category.id;
              const itemCount = category.items.filter(
                (item) => !item.itemCategories.some((c) => c.isHidden),
              ).length;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleSelect(category.id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition ${
                    isActive
                      ? "border-[var(--brand-secondary)] bg-[color-mix(in_srgb,var(--brand-primary)_35%,transparent)]"
                      : "border-[var(--border)] hover:border-[var(--brand-secondary)]/40 hover:bg-[var(--elevated)]"
                  }`}
                >
                  <RemoteImage
                    src={category.thumbnail}
                    alt={category.label}
                    fill
                    variant="category"
                    objectFit="contain"
                    sizes="48px"
                    containerClassName="h-12 w-12 overflow-hidden rounded-xl"
                    className="p-1.5 opacity-80"
                  />
                  <span className="line-clamp-2 text-xs font-medium leading-tight">
                    {category.label}
                  </span>
                  <span className="text-[10px] text-[var(--muted-light)]">
                    {itemCount} مورد
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
