import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  extractSubdomain,
  isListingSubdomain,
} from "@/lib/subdomain";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  let subdomain = extractSubdomain(hostname);

  if (!subdomain && process.env.NODE_ENV === "development") {
    subdomain = request.nextUrl.searchParams.get("subdomain");
  }

  if (!subdomain) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const pathSuffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = isListingSubdomain(subdomain)
    ? `/listing${pathSuffix}`
    : `/sites/${subdomain}${pathSuffix}`;
  url.searchParams.delete("subdomain");

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
