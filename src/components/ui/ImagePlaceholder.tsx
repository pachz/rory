type PlaceholderVariant = "item" | "category" | "hero" | "logo";

interface ImagePlaceholderProps {
  variant?: PlaceholderVariant;
  label?: string;
  className?: string;
}

function PlaceholderIcon({ variant }: { variant: PlaceholderVariant }) {
  if (variant === "logo") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-1/3 w-1/3 opacity-40"
        aria-hidden
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M8 12h8M12 8v8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "category") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-1/2 w-1/2 opacity-35"
        aria-hidden
      >
        <path
          d="M4 6h16M4 12h16M4 18h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "hero") {
    return (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className="h-16 w-16 opacity-20"
        aria-hidden
      >
        <path
          d="M20 44V28a12 12 0 0124 0v16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 44h32"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M24 20v-4M32 18v-6M40 20v-4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-1/2 w-1/2 opacity-35"
      aria-hidden
    >
      <path
        d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 18v3M9 21h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4 8h2M18 8h2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImagePlaceholder({
  variant = "item",
  label,
  className = "",
}: ImagePlaceholderProps) {
  const initial = label?.trim().charAt(0) || "?";

  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-[color-mix(in_srgb,var(--brand-primary)_55%,var(--elevated))] text-[var(--brand-secondary)] ${className}`}
      aria-hidden
    >
      {variant === "logo" ? (
        <span className="text-2xl font-bold opacity-60 sm:text-3xl">
          {initial}
        </span>
      ) : (
        <PlaceholderIcon variant={variant} />
      )}
    </div>
  );
}

export type { PlaceholderVariant };
