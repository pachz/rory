import Link from "next/link";
import { getMainDomain } from "@/lib/subdomain";

export default function HomePage() {
  const domain = getMainDomain();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] px-6">
      <div className="max-w-md text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-[var(--muted-light)]">
          Rory
        </p>
        <h1 className="text-3xl font-bold text-[var(--foreground)]">
          Restaurant menus, beautifully served
        </h1>
        <p className="mt-4 leading-relaxed text-[var(--muted)]">
          Visit a restaurant subdomain to browse their menu — for example{" "}
          <code className="rounded bg-[var(--elevated)] px-1.5 py-0.5 text-sm">
            kaban.{domain}
          </code>
        </p>

        {process.env.NODE_ENV === "development" && (
          <Link
            href="/?subdomain=kaban"
            className="mt-8 inline-block rounded-full bg-[var(--brand-secondary)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Try kaban (dev)
          </Link>
        )}
      </div>
    </div>
  );
}
