"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MerchantCard } from "@/components/listing/MerchantCard";
import type { Merchant } from "@/lib/merchants";

const PAGE_SIZE = 48;

type SortKey = "name" | "active" | "type";

interface ListingDirectoryProps {
  merchants: Merchant[];
  types: string[];
  plans: string[];
  stats: {
    total: number;
    active: number;
    fetchedAt: string;
  };
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function formatFetchedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--brand-secondary)_22%,transparent),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-light)] backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Rory Directory
              </p>
              <h1 className="text-4xl font-bold leading-[1.15] text-[var(--foreground)] sm:text-5xl lg:text-6xl">
                کشف بهترین
                <span className="block text-[color-mix(in_srgb,var(--brand-secondary)_88%,#c4a574)]">
                  کافه‌ها و رستوران‌ها
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--muted)] sm:text-lg">
                {stats.total.toLocaleString("fa-IR")} مجموعه غذایی با منوی
                دیجیتال — جستجو کنید، فیلتر بزنید و مستقیم وارد منو شوید.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:min-w-[320px]">
              <StatPill label="کل مجموعه‌ها" value={stats.total} />
              <StatPill label="فعال" value={stats.active} accent />
              <StatPill label="دسته‌بندی" value={types.length} />
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 border-y border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_90%,transparent)] shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl space-y-3 px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-[var(--muted-light)]">
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
                placeholder="جستجو در نام، نام کاربری یا دسته…"
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-3.5 ps-11 pe-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--muted-light)] focus:border-[color-mix(in_srgb,var(--brand-secondary)_35%,transparent)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--brand-secondary)_8%,transparent)]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5 text-sm text-[var(--foreground)] shadow-sm outline-none"
              >
                <option value="active">مرتب‌سازی: فعال‌ها اول</option>
                <option value="name">مرتب‌سازی: نام</option>
                <option value="type">مرتب‌سازی: دسته</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
            <Chip
              active={typeFilter === "all"}
              onClick={() => {
                setTypeFilter("all");
                resetPagination();
              }}
              label="همه دسته‌ها"
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

          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
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

      {/* Results */}
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-[var(--muted)]">
            نمایش{" "}
            <span className="font-bold text-[var(--foreground)]">
              {visible.length.toLocaleString("fa-IR")}
            </span>{" "}
            از{" "}
            <span className="font-bold text-[var(--foreground)]">
              {filtered.length.toLocaleString("fa-IR")}
            </span>{" "}
            مجموعه
            {deferredQuery !== query && (
              <span className="ms-2 text-[var(--muted-light)]">در حال جستجو…</span>
            )}
          </p>
          <p className="text-[11px] text-[var(--muted-light)]">
            بروزرسانی: {formatFetchedAt(stats.fetchedAt)}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-20 text-center">
            <p className="text-xl font-bold text-[var(--foreground)]">
              نتیجه‌ای پیدا نشد
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              فیلترها را تغییر دهید یا گزینه «فقط فعال» را خاموش کنید.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((merchant, index) => (
                <li key={merchant.id} className="flex">
                  <MerchantCard
                    merchant={merchant}
                    priority={index < 6}
                  />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full bg-[var(--brand-secondary)] px-10 py-3.5 text-sm font-bold text-white shadow-md transition hover:opacity-90 hover:shadow-lg"
                >
                  نمایش {Math.min(PAGE_SIZE, filtered.length - visibleCount).toLocaleString("fa-IR")} مورد
                  بیشتر
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-10 text-center">
        <p className="text-xs text-[var(--muted-light)]">
          Rory · فهرست منوهای دیجیتال
        </p>
      </footer>
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
      className={`rounded-2xl border px-3 py-3 text-center sm:px-4 ${
        accent
          ? "border-[color-mix(in_srgb,var(--brand-secondary)_30%,transparent)] bg-[color-mix(in_srgb,var(--brand-secondary)_10%,var(--surface))]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <p className="text-[10px] font-medium text-[var(--muted-light)]">{label}</p>
      <p className="mt-1 text-xl font-bold tabular-nums text-[var(--foreground)] sm:text-2xl">
        {value.toLocaleString("fa-IR")}
      </p>
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
      className={`rounded-2xl border px-4 py-3.5 text-sm font-semibold shadow-sm transition ${
        active
          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--foreground)]"
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
      className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
        active
          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-white shadow-sm"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[color-mix(in_srgb,var(--brand-secondary)_25%,transparent)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
