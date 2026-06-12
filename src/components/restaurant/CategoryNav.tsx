"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/graphql/types";
import { CATEGORY_COMPACT_THRESHOLD } from "@/lib/menu-config";
import { CategoryGridSheet } from "./CategoryGridSheet";

interface CategoryNavProps {
  categories: MenuCategory[];
  compact?: boolean;
}

export function CategoryNav({
  categories,
  compact = categories.length > CATEGORY_COMPACT_THRESHOLD,
}: CategoryNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id.replace("category-", ""));
          }
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: 0 },
    );

    for (const category of categories) {
      const el = document.getElementById(`category-${category.id}`);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [categories]);

  const scrollToCategory = (id: string) => {
    window.dispatchEvent(new CustomEvent("rory:category-nav", { detail: id }));
    const el = document.getElementById(`category-${id}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollTopButton = showScrollTop ? (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="بازگشت به بالا"
      className="fixed bottom-6 end-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--foreground)] shadow-lg backdrop-blur-md transition hover:scale-[1.05] active:scale-[0.95]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  ) : null;

  if (categories.length === 0) return null;

  const activeCategory = categories.find((c) => c.id === activeId);

  if (compact) {
    return (
      <>
        <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-4 py-2 text-sm font-medium transition hover:border-[var(--brand-secondary)]/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-[var(--muted)]"
              >
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              همه دسته‌ها
            </button>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {activeCategory?.label ?? "منو"}
              </p>
              <p className="text-xs text-[var(--muted-light)]">
                {categories.length} دسته‌بندی
              </p>
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                aria-label="Previous category"
                onClick={() => {
                  const idx = categories.findIndex((c) => c.id === activeId);
                  const prev = categories[Math.max(0, idx - 1)];
                  if (prev) scrollToCategory(prev.id);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--elevated)] text-[var(--muted)]"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next category"
                onClick={() => {
                  const idx = categories.findIndex((c) => c.id === activeId);
                  const next = categories[Math.min(categories.length - 1, idx + 1)];
                  if (next) scrollToCategory(next.id);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--elevated)] text-[var(--muted)]"
              >
                ›
              </button>
            </div>
          </div>
        </nav>

        <CategoryGridSheet
          categories={categories}
          activeId={activeId}
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onSelect={scrollToCategory}
        />
        {scrollTopButton}
      </>
    );
  }

  return (
    <>
      <nav className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
          {categories.map((category) => {
            const isActive = activeId === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => scrollToCategory(category.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--brand-secondary)] text-white shadow-md"
                    : "bg-[var(--elevated)] text-[var(--foreground)] hover:bg-[var(--border)]"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>
      </nav>
      {scrollTopButton}
    </>
  );
}
