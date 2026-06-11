import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#faf8f5] px-6">
      <p className="text-6xl font-bold text-[#2c1810]/15">404</p>
      <h1 className="mt-4 text-2xl font-bold text-[#2c1810]">
        Restaurant not found
      </h1>
      <p className="mt-2 max-w-sm text-center text-black/55">
        This subdomain doesn&apos;t match any restaurant on our platform.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/5"
      >
        Go home
      </Link>
    </div>
  );
}
