import type { CSSProperties } from "react";
import Link from "next/link";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { merchantSiteUrl } from "@/lib/subdomain";
import type { Merchant } from "@/lib/merchants";
import { MerchantCover } from "./MerchantCover";

const PLAN_STYLES: Record<string, string> = {
  Basic:
    "bg-stone-100 text-stone-700 ring-stone-200/80 dark:bg-stone-500/15 dark:text-stone-300 dark:ring-stone-500/20",
  Standard:
    "bg-sky-50 text-sky-800 ring-sky-200/80 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/25",
  Plus: "bg-violet-50 text-violet-800 ring-violet-200/80 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/25",
  Grand:
    "bg-amber-50 text-amber-900 ring-amber-200/80 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-500/25",
};

interface MerchantCardProps {
  merchant: Merchant;
  priority?: boolean;
}

export function MerchantCard({ merchant, priority = false }: MerchantCardProps) {
  const href = merchantSiteUrl(merchant.username);
  const accent = merchant.primaryColor ?? "#2c1810";
  const planClass =
    (merchant.plan && PLAN_STYLES[merchant.plan]) ??
    "bg-[var(--elevated)] text-[var(--muted)] ring-[var(--border)]";

  return (
    <Link
      href={href}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      style={{ "--merchant-accent": accent } as CSSProperties}
    >
      {/* Cover — z-0 so overlapping logo in body paints above */}
      <div className="relative z-0 h-[7.5rem] shrink-0 overflow-hidden">
        <div className="absolute inset-0">
          <MerchantCover merchant={merchant} priority={priority} />
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-[var(--surface)] via-transparent to-black/10" />

        {merchant.isActive && (
          <span className="absolute start-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
            فعال
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative z-10 flex flex-1 flex-col px-4 pb-4 pt-3">
        {/* Logo + title row — logo on the right (start in RTL) */}
        <div className="mb-3 flex items-start gap-3">
          <RemoteImage
            src={merchant.logo}
            alt={merchant.name}
            width={56}
            height={56}
            priority={priority}
            sizes="56px"
            variant="logo"
            containerClassName="relative z-10 -mt-9 h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-[var(--surface)] bg-[var(--surface)] shadow-md"
            className="object-cover"
          />
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-[var(--foreground)]">
              {merchant.name}
            </h3>
            <p
              className="mt-1 truncate text-[11px] text-[var(--muted-light)]"
              dir="ltr"
            >
              {merchant.domain}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-[var(--elevated)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]">
            {merchant.type}
          </span>
          {merchant.plan && (
            <span
              className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${planClass}`}
            >
              {merchant.plan}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto border-t border-[var(--border)] pt-3">
          <span className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-[color-mix(in_srgb,var(--merchant-accent)_12%,var(--elevated))] px-3 py-2.5 text-sm font-semibold text-[color-mix(in_srgb,var(--merchant-accent)_90%,var(--foreground))] transition group-hover:bg-[color-mix(in_srgb,var(--merchant-accent)_20%,var(--elevated))]">
            مشاهده منو
            <span aria-hidden className="text-base leading-none">
              ←
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
