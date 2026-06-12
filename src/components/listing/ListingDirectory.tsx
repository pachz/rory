"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { MerchantCard } from "@/components/listing/MerchantCard";
import type { Merchant } from "@/lib/merchants";

const PAGE_SIZE = 60;

type SortKey = "name" | "active" | "type";

interface ListingDirectoryProps {
  merchants: Merchant[];
  types: string[];
  plans: string[];
  stats: {
    total: number;
    active: number;
    generatedAt: string;
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
      <header className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, color-mix(in srgb, var(--brand-secondary) 18%, transparent), transparent 45%),
              radial-gradient(circle at 80% 0%, color-mix(in srgb, #c4a574 22%, transparent), transparent 40%),
              radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--brand-secondary) 12%, transparent), transparent 50%)
            `,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-light)]">
            Rory Directory
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[var(--foreground)] sm:text-5xl">
            Every menu, one place
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
            Browse {stats.total.toLocaleString("fa-IR")} restaurants, cafés, and
            lounges on Rory — pick a spot and explore their digital menu.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <StatPill label="Total" value={stats.total} />
            <StatPill label="Active" value={stats.active} accent />
            <StatPill label="Categories" value={types.length} />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] backdrop-blur-xl">
        <div className="mx-auto max-w-6xl space-y-4 px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <span className="pointer-events-none absolute inset-y-0 start-4 flex items-center text-[var(--muted-light)]">
                ⌕
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPagination();
                }}
                placeholder="Search name, username, or type…"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] py-3 ps-10 pe-4 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-light)] focus:border-[color-mix(in_srgb,var(--brand-secondary)_40%,transparent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-secondary)_12%,transparent)]"
              />
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <FilterToggle
                active={activeOnly}
                onClick={() => {
                  setActiveOnly((v) => !v);
                  resetPagination();
                }}
                label="Active only"
              />
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as SortKey);
                  resetPagination();
                }}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 text-sm text-[var(--foreground)] outline-none"
              >
                <option value="active">Sort: active first</option>
                <option value="name">Sort: name</option>
                <option value="type">Sort: category</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Chip
              active={typeFilter === "all"}
              onClick={() => {
                setTypeFilter("all");
                resetPagination();
              }}
              label="All types"
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

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Chip
              active={planFilter === "all"}
              onClick={() => {
                setPlanFilter("all");
                resetPagination();
              }}
              label="All plans"
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
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <p className="mb-6 text-sm text-[var(--muted)]">
          Showing{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {visible.length.toLocaleString("fa-IR")}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {filtered.length.toLocaleString("fa-IR")}
          </span>{" "}
          venues
          {deferredQuery !== query && (
            <span className="ms-2 text-[var(--muted-light)]">Searching…</span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
            <p className="text-lg font-semibold text-[var(--foreground)]">
              No venues match your filters
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Try clearing search or turning off &ldquo;Active only&rdquo;.
            </p>
          </div>
        ) : (
          <>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((merchant) => (
                <li key={merchant.id}>
                  <MerchantCard merchant={merchant} />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-8 py-3 text-sm font-semibold text-[var(--foreground)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--brand-secondary)_30%,transparent)] hover:shadow-md"
                >
                  Load {Math.min(PAGE_SIZE, filtered.length - visibleCount)}{" "}
                  more
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--muted-light)]">
        Catalog synced {stats.generatedAt} · Powered by Rory
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
      className={`rounded-2xl border px-4 py-3 ${
        accent
          ? "border-[color-mix(in_srgb,var(--brand-secondary)_25%,transparent)] bg-[color-mix(in_srgb,var(--brand-secondary)_8%,var(--surface))]"
          : "border-[var(--border)] bg-[var(--surface)]"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-light)]">
        {label}
      </p>
      <p className="mt-0.5 text-2xl font-bold tabular-nums text-[var(--foreground)]">
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
      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
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
      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
        active
          ? "border-[var(--brand-secondary)] bg-[var(--brand-secondary)] text-white"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[color-mix(in_srgb,var(--brand-secondary)_25%,transparent)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </button>
  );
}
