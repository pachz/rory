import Link from "next/link";
import { merchantSiteUrl } from "@/lib/subdomain";
import type { Merchant } from "@/lib/merchants";

const PLAN_STYLES: Record<string, string> = {
  Basic: "bg-stone-500/10 text-stone-700 dark:text-stone-300",
  Standard: "bg-sky-500/10 text-sky-800 dark:text-sky-300",
  Plus: "bg-violet-500/10 text-violet-800 dark:text-violet-300",
  Grand: "bg-amber-500/15 text-amber-900 dark:text-amber-200",
};

interface MerchantCardProps {
  merchant: Merchant;
}

export function MerchantCard({ merchant }: MerchantCardProps) {
  const href = merchantSiteUrl(merchant.username);
  const planClass =
    (merchant.plan && PLAN_STYLES[merchant.plan]) ??
    "bg-[var(--elevated)] text-[var(--muted)]";

  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--brand-secondary)_25%,transparent)] hover:shadow-lg"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold leading-snug text-[var(--foreground)] group-hover:text-[var(--brand-secondary)]">
            {merchant.name}
          </h3>
          <p className="mt-1 truncate font-mono text-xs text-[var(--muted-light)]">
            {merchant.domain}
          </p>
        </div>
        <span
          className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
            merchant.isActive
              ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              : "bg-[var(--elevated)] ring-1 ring-[var(--border)]"
          }`}
          title={merchant.isActive ? "Active" : "Inactive"}
        />
      </div>

      <p className="mb-4 line-clamp-1 text-sm text-[var(--muted)]">
        {merchant.type}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        {merchant.plan && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${planClass}`}
          >
            {merchant.plan}
          </span>
        )}
        <span className="ms-auto text-xs font-medium text-[var(--muted-light)] transition group-hover:text-[var(--brand-secondary)]">
          مشاهده منو ←
        </span>
      </div>
    </Link>
  );
}
