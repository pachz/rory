"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { MenuItem, ProductOption } from "@/lib/graphql/types";
import { useCart, type SelectedOption } from "@/context/cart-context";
import {
  formatPrice,
  hasDiscount,
  stripHtml,
} from "@/lib/format";

interface ItemModalProps {
  item: MenuItem | null;
  currency: string;
  onClose: () => void;
}

function validateOptions(
  options: ProductOption[],
  selected: Record<string, string[]>,
): boolean {
  for (const option of options) {
    if (!option.isActive) continue;
    const choices = selected[option.id] ?? [];
    if (choices.length < option.minimumSelectableChoices) return false;
    if (choices.length > option.maximumSelectableChoices) return false;
  }
  return true;
}

export function ItemModal({ item, currency, onClose }: ItemModalProps) {
  const { addItem } = useCart();
  const [selected, setSelected] = useState<Record<string, string[]>>({});

  const activeOptions = useMemo(
    () => item?.shopItem?.productOptions.filter((o) => o.isActive) ?? [],
    [item],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = item ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const basePrice = item.shopItem?.shopItemPrice?.price ?? 0;
  const originalPrice = item.shopItem?.shopItemPrice?.originalPrice;
  const description = stripHtml(item.description);
  const image = item.thumbnail ?? item.itemMedias[0]?.url;
  const isValid = validateOptions(activeOptions, selected);

  const selectedOptions: SelectedOption[] = activeOptions.flatMap((option) => {
    const choiceIds = selected[option.id] ?? [];
    return choiceIds.flatMap((choiceId) => {
      const poc = option.productOptionChoices.find((c) => c.id === choiceId);
      if (!poc || poc.choice.isSoldOut) return [];
      return [
        {
          optionId: option.id,
          optionLabel: option.label,
          choiceId: poc.id,
          choiceName: poc.choice.item.name,
          price: poc.choice.shopItemPrice?.price ?? 0,
        },
      ];
    });
  });

  const optionsTotal = selectedOptions.reduce((s, o) => s + o.price, 0);
  const displayTotal = basePrice + optionsTotal;

  const toggleChoice = (option: ProductOption, choiceId: string) => {
    setSelected((prev) => {
      const current = prev[option.id] ?? [];
      const isSelected = current.includes(choiceId);

      if (option.maximumSelectableChoices === 1) {
        return { ...prev, [option.id]: isSelected ? [] : [choiceId] };
      }

      if (isSelected) {
        return {
          ...prev,
          [option.id]: current.filter((id) => id !== choiceId),
        };
      }

      if (current.length >= option.maximumSelectableChoices) {
        return prev;
      }

      return { ...prev, [option.id]: [...current, choiceId] };
    });
  };

  const handleAdd = () => {
    if (!isValid || item.shopItem?.isSoldOut) return;

    addItem({
      itemId: item.id,
      name: item.name,
      thumbnail: item.thumbnail,
      basePrice,
      selectedOptions,
      isSoldOut: item.shopItem?.isSoldOut ?? false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-[var(--surface)] shadow-2xl sm:rounded-3xl">
        {image && (
          <div className="relative h-52 w-full shrink-0 bg-black/5">
            <Image
              src={image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="512px"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute start-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {!image && (
            <button
              type="button"
              onClick={onClose}
              className="mb-3 text-sm text-black/50"
            >
              ✕ بستن
            </button>
          )}

          <h2 className="text-xl font-bold">{item.name}</h2>

          {description && (
            <p className="mt-2 text-sm leading-relaxed text-black/60">
              {description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="text-lg font-bold text-[var(--brand-secondary)]">
              {formatPrice(displayTotal, currency)}
            </span>
            {originalPrice != null && hasDiscount(originalPrice, basePrice) && (
              <span className="text-sm text-black/40 line-through">
                {formatPrice(originalPrice, currency)}
              </span>
            )}
          </div>

          {activeOptions.map((option) => (
            <div key={option.id} className="mt-6">
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="font-semibold">{option.label}</h3>
                <span className="text-xs text-black/45">
                  {option.minimumSelectableChoices > 0
                    ? `حداقل ${option.minimumSelectableChoices}`
                    : "اختیاری"}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {option.productOptionChoices.map((poc) => {
                  const choice = poc.choice;
                  const isSelected = (selected[option.id] ?? []).includes(
                    poc.id,
                  );
                  const choicePrice = choice.shopItemPrice?.price ?? 0;

                  return (
                    <button
                      key={poc.id}
                      type="button"
                      disabled={choice.isSoldOut}
                      onClick={() => toggleChoice(option, poc.id)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                        isSelected
                          ? "border-[var(--brand-secondary)] bg-[var(--brand-primary)]/30"
                          : "border-black/8 hover:border-black/15"
                      } ${choice.isSoldOut ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      <span>{choice.item.name}</span>
                      <span className="text-black/55">
                        {choicePrice > 0
                          ? `+${formatPrice(choicePrice, currency)}`
                          : choice.isSoldOut
                            ? "تمام شد"
                            : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-black/5 p-4">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!isValid || item.shopItem?.isSoldOut}
            className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: "var(--brand-secondary)" }}
          >
            {item.shopItem?.isSoldOut
              ? "ناموجود"
              : isValid
                ? "افزودن به سبد"
                : "گزینه‌ها را انتخاب کنید"}
          </button>
        </div>
      </div>
    </div>
  );
}
