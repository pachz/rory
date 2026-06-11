import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6">
      <p className="text-6xl font-bold text-[var(--elevated)]">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[var(--foreground)]">
        Restaurant not found
      </h1>
      <p className="mt-2 max-w-sm text-center text-[var(--muted)]">
        This subdomain doesn&apos;t match any restaurant on our platform.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-[var(--border)] px-6 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--elevated)]"
      >
        Go home
      </Link>
    </div>
  );
}
