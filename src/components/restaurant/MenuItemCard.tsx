"use client";

import type { MenuItem } from "@/lib/graphql/types";
import { RemoteImage } from "@/components/ui/RemoteImage";
import {
  formatPrice,
  hasDiscount,
  stripHtml,
} from "@/lib/format";

interface MenuItemCardProps {
  item: MenuItem;
  currency: string;
  onSelect: (item: MenuItem) => void;
}

export function MenuItemCard({ item, currency, onSelect }: MenuItemCardProps) {
  const isHidden = item.itemCategories.some((c) => c.isHidden);
  if (isHidden) return null;

  const isSoldOut = item.shopItem?.isSoldOut ?? false;
  const price = item.shopItem?.shopItemPrice?.price;
  const originalPrice = item.shopItem?.shopItemPrice?.originalPrice;
  const description = stripHtml(item.description);
  const hasOptions =
    (item.shopItem?.productOptions.filter((o) => o.isActive).length ?? 0) > 0;

  return (
    <button
      type="button"
      onClick={() => !isSoldOut && onSelect(item)}
      disabled={isSoldOut}
      className={`group flex w-full gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-start shadow-sm transition hover:shadow-md ${
        isSoldOut ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <RemoteImage
        src={item.thumbnail}
        alt={item.name}
        fill
        variant="item"
        sizes="96px"
        containerClassName="h-24 w-24 shrink-0 overflow-hidden rounded-xl"
        className="transition group-hover:scale-105"
        overlay={
          isSoldOut ? (
            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-bold text-white">
              تمام شد
            </span>
          ) : undefined
        }
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-semibold leading-snug text-[var(--foreground)] ${
                item.itemCategories.some((c) => c.isBold) ? "text-base" : "text-sm"
              }`}
            >
              {item.name}
            </h3>
            {hasOptions && !isSoldOut && (
              <span className="shrink-0 rounded-md bg-[var(--elevated)] px-1.5 py-0.5 text-[10px] text-[var(--muted-light)]">
                سفارشی
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--muted)]">
              {description}
            </p>
          )}
        </div>

        {price != null && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-bold text-[var(--brand-accent)]">
              {formatPrice(price, currency)}
            </span>
            {originalPrice != null && hasDiscount(originalPrice, price) && (
              <span className="text-xs text-[var(--muted-light)] line-through">
                {formatPrice(originalPrice, currency)}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
