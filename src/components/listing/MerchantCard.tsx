import type { CSSProperties } from "react";
import Link from "next/link";
import { RemoteImage } from "@/components/ui/RemoteImage";
import { merchantSiteUrl } from "@/lib/subdomain";
import type { Merchant } from "@/lib/merchants";

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
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={
        {
          "--merchant-accent": accent,
        } as CSSProperties
      }
    >
      {/* Cover strip */}
      <div className="relative h-28 overflow-hidden">
        <RemoteImage
          src={merchant.coverPhoto}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          variant="hero"
          containerClassName="absolute inset-0 scale-105 transition duration-500 group-hover:scale-110"
          className="object-cover"
        />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${accent} 55%, transparent), color-mix(in srgb, ${merchant.secondaryColor ?? accent} 35%, transparent))`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-black/10" />

        {merchant.isActive && (
          <span className="absolute start-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            فعال
          </span>
        )}
      </div>

      {/* Logo + identity */}
      <div className="relative px-5 pb-5 pt-0">
        <div className="-mt-10 mb-4 flex items-end gap-4">
          <RemoteImage
            src={merchant.logo}
            alt={merchant.name}
            width={72}
            height={72}
            priority={priority}
            sizes="72px"
            variant="logo"
            containerClassName="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl border-[3px] border-[var(--surface)] bg-[var(--surface)] shadow-lg ring-1 ring-black/5"
            className="object-cover"
          />
          <div className="min-w-0 flex-1 pb-1">
            <h3 className="line-clamp-2 text-lg font-bold leading-snug text-[var(--foreground)] transition group-hover:text-[color-mix(in_srgb,var(--merchant-accent)_85%,var(--foreground))]">
              {merchant.name}
            </h3>
            <p className="mt-1 truncate font-mono text-[11px] text-[var(--muted-light)]">
              {merchant.domain}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            {merchant.type}
          </span>
          {merchant.plan && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${planClass}`}
            >
              {merchant.plan}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-xs text-[var(--muted-light)]">منوی دیجیتال</span>
          <span className="text-sm font-semibold text-[color-mix(in_srgb,var(--merchant-accent)_90%,var(--foreground))] transition group-hover:translate-x-[-2px]">
            مشاهده منو ←
          </span>
        </div>
      </div>
    </Link>
  );
}
