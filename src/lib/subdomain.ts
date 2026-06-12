export const LISTING_SUBDOMAIN = "listing";

export function getMainDomain(): string {
  return process.env.MAIN_DOMAIN ?? "rory.ir";
}

export function isListingSubdomain(subdomain: string): boolean {
  return subdomain === LISTING_SUBDOMAIN;
}

/** URL to open a merchant mini-site (dev uses query param). */
export function merchantSiteUrl(username: string): string {
  const domain = getMainDomain();
  if (process.env.NODE_ENV === "development") {
    return `/?subdomain=${encodeURIComponent(username)}`;
  }
  return `https://${username}.${domain}`;
}

/** URL for the merchant directory listing page. */
export function listingSiteUrl(): string {
  const domain = getMainDomain();
  if (process.env.NODE_ENV === "development") {
    return `/?subdomain=${LISTING_SUBDOMAIN}`;
  }
  return `https://${LISTING_SUBDOMAIN}.${domain}`;
}

export function extractSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0]?.toLowerCase() ?? "";
  const mainDomain = getMainDomain().toLowerCase();

  if (host.endsWith(".localhost")) {
    const sub = host.replace(".localhost", "");
    return sub && sub !== "www" ? sub : null;
  }

  if (
    host === "localhost" ||
    host === mainDomain ||
    host === `www.${mainDomain}`
  ) {
    return null;
  }

  if (host.endsWith(`.${mainDomain}`)) {
    const sub = host.slice(0, -(mainDomain.length + 1));
    return sub && sub !== "www" ? sub : null;
  }

  return null;
}
