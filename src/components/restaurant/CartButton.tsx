"use client";

import { useCart } from "@/context/cart-context";

export function CartButton() {
  const { itemCount, openCart } = useCart();

  if (itemCount === 0) return null;

  return (
    <button
      type="button"
      onClick={openCart}
      className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full px-6 py-3.5 text-sm font-bold text-white shadow-xl transition hover:scale-[1.02] active:scale-[0.98]"
      style={{ backgroundColor: "var(--brand-secondary)" }}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs">
        {itemCount}
      </span>
      مشاهده سبد
    </button>
  );
}
