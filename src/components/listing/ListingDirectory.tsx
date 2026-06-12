"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { MerchantCard } from "@/components/listing/MerchantCard";
import type { Merchant } from "@/lib/merchants";
import { formatPersianNumber } from "@/lib/persian-format";

const PAGE_SIZE = 48;

type SortKey = "name" | "active" | "type";

interface ListingDirectoryProps {
  merchants: Merchant[];
  types: string[];
  plans: string[];
  stats: {
    total: number;
    active: number;
    fetchedAtLabel: string;
  };
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

export function ListingDirectory({
  merchants,
  types,
  plans,
  stats,
}: ListingDirectoryProps) {
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("active");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = normalize(deferredQuery);

    let list = merchants.filter((m) => {
      if (activeOnly && !m.isActive) return false;
      if (typeFilter !== "all" && m.type !== typeFilter) return false;
      if (planFilter !== "all" && m.plan !== planFilter) return false;
      if (!q) return true;
      return (
        normalize(m.name).includes(q) ||
        normalize(m.username).includes(q) ||
        normalize(m.domain).includes(q) ||
        normalize(m.type).includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "active") {
        if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
        return a.name.localeCompare(b.name, "fa");
      }
      if (sort === "type") {
        const typeCmp = a.type.localeCompare(b.type);
        return typeCmp !== 0 ? typeCmp : a.name.localeCompare(b.name, "fa");
      }
      return a.name.localeCompare(b.name, "fa");
    });

    return list;
  }, [merchants, deferredQuery, activeOnly, typeFilter, planFilter, sort]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function resetPagination() {
    setVisibleCount(PAGE_SIZE);
  }

  const loadMore = useCallback(() => {
    setVisibleCount((count) =>
      Math.min(count + PAGE_SIZE, filtered.length),
    );
  }, [filtered.length]);

  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero — single column, stats inline below title */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="mb-2 text-xs font-semibold tracking-wide text-[var(--muted-light)]">
            Rory · فهرست منوها
          </p>
          <h1 className="text-3xl font-bold leading-tight text-[var(--foreground)] sm:text-4xl">
            کافه‌ها و رستوران‌ها
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)] sm:text-base">
            {formatPersianNumber(stats.total)} مجموعه — جستجو کنید و مستقیم
            وارد منوی دیجیتال شوید.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <StatPill label="کل" value={stats.total} />
            <StatPill label="فعال" value={stats.active} accent />
            <StatPill label="دسته" value={types.length} />
          </div>
        </div>
      </header>

      {/* Filters — same max-width as grid */}
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-4 sm:px-6">
          {/* Row 1: search + controls */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-center">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 start-3 flex items-center text-[var(--muted-light)]">
                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPagination();
                }}
                placeholder="جستجو…"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-2.5 ps-10 pe-4 text-sm outline-none focus:border-[color-mix(in_srgb,var(--brand-secondary)_40%,transparent)]"
              />
            </div>

            <FilterToggle
              active={activeOnly}
              onClick={() => {
                setActiveOnly((v) => !v);
                resetPagination();
              }}
              label="فقط فعال"
            />

            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                resetPagination();
              }}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm outline-none"
            >
              <option value="active">فعال‌ها اول</option>
              <option value="name">بر اساس نام</option>
              <option value="type">بر اساس دسته</option>
            </select>
          </div>

          {/* Row 2: type chips — wrap instead of scroll */}
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={typeFilter === "all"}
              onClick={() => {
                setTypeFilter("all");
                resetPagination();
              }}
              label="همه"
            />
            {types.map((type) => (
              <Chip
                key={type}
                active={typeFilter === type}
                onClick={() => {
                  setTypeFilter(type);
                  resetPagination();
                }}
                label={type}
              />
            ))}
          </div>

          {/* Row 3: plan chips */}
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={planFilter === "all"}
              onClick={() => {
                setPlanFilter("all");
                resetPagination();
              }}
              label="همه پلن‌ها"
            />
            {plans.map((plan) => (
              <Chip
                key={plan}
                active={planFilter === plan}
                onClick={() => {
                  setPlanFilter(plan);
                  resetPagination();
                }}
                label={plan}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 text-sm text-[var(--muted)]">
          <p>
            <span className="font-bold text-[var(--foreground)]">
              {formatPersianNumber(visible.length)}
            </span>
            {" / "}
            <span className="font-bold text-[var(--foreground)]">
              {formatPersianNumber(filtered.length)}
            </span>
            {" مجموعه"}
            {deferredQuery !== query && (
              <span className="ms-2 opacity-60">…</span>
            )}
          </p>
          <p className="text-xs text-[var(--muted-light)]">
            {stats.fetchedAtLabel}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] px-6 py-16 text-center">
            <p className="font-bold text-[var(--foreground)]">نتیجه‌ای نیست</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              فیلترها را تغییر دهید.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((merchant, index) => (
                <li key={merchant.id}>
                  <MerchantCard merchant={merchant} priority={index < 6} />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div
                ref={loadMoreRef}
                className="mt-8 flex h-16 items-center justify-center text-sm text-[var(--muted-light)]"
                aria-hidden
              >
                در حال بارگذاری…
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 ${
        accent
          ? "border-[color-mix(in_srgb,var(--brand-secondary)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand-secondary)_8%,var(--surface))]"
          : "border-[var(--border)] bg-[var(--background)]"
      }`}
    >
      <span className="text-lg font-bold tabular-nums text-[var(--foreground)]">
        {formatPersianNumber(value)}
      </span>
      <span className="text-xs text-[var(--muted-light)]">{label}</span>
    </div>
  );
}

function FilterToggle({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
        active
          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]"
      }`}
    >
      {label}
    </button>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
