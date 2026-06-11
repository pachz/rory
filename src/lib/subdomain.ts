export function getMainDomain(): string {
  return process.env.MAIN_DOMAIN ?? "rory.ir";
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
