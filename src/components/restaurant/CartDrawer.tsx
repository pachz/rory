"use client";

import { RemoteImage } from "@/components/ui/RemoteImage";
import { useCart, lineTotal } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";

interface CartDrawerProps {
  currency: string;
}

export function CartDrawer({ currency }: CartDrawerProps) {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    clearCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close cart"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside className="relative flex h-full w-full max-w-md flex-col bg-[var(--surface)] shadow-2xl">
        <header className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="text-lg font-bold">سبد منو</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="py-12 text-center text-sm text-[var(--muted)]">
              هنوز آیتمی اضافه نکرده‌اید.
              <br />
              منو را مرور کنید و علاقه‌مندی‌هایتان را اضافه کنید.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((line) => (
                <li
                  key={line.cartId}
                  className="flex gap-3 rounded-2xl border border-[var(--border)] p-3"
                >
                  <RemoteImage
                    src={line.thumbnail}
                    alt={line.name}
                    fill
                    variant="item"
                    sizes="64px"
                    containerClassName="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="font-semibold leading-snug">{line.name}</p>
                    {line.selectedOptions.length > 0 && (
                      <p className="mt-0.5 text-xs text-[var(--muted-light)]">
                        {line.selectedOptions
                          .map((o) => o.choiceName)
                          .join("، ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.cartId, line.quantity - 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--elevated)] text-sm"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-medium">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(line.cartId, line.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--elevated)] text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[var(--brand-accent)]">
                        {formatPrice(lineTotal(line), currency)}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(line.cartId)}
                    className="self-start text-xs text-[var(--muted-light)] hover:text-red-500"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[var(--border)] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">جمع کل</span>
              <span className="text-lg font-bold text-[var(--brand-accent)]">
                {formatPrice(totalPrice, currency)}
              </span>
            </div>
            <p className="mb-4 text-center text-xs text-[var(--muted-light)]">
              این سبد فقط برای مرور منو است — ثبت سفارش در این نسخه فعال نیست.
            </p>
            <button
              type="button"
              onClick={clearCart}
              className="w-full rounded-xl border border-[var(--border)] py-2.5 text-sm text-[var(--muted)] hover:bg-[var(--elevated)]"
            >
              پاک کردن سبد
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
