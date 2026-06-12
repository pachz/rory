import { getMainDomain } from "@/lib/subdomain";

export interface Merchant {
  id: string;
  username: string;
  name: string;
  domain: string;
  logo: string | null;
  coverPhoto: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  isActive: boolean;
  isMapActive: boolean;
  type: string;
  plan: string | null;
}

export interface MerchantCatalog {
  fetchedAt: string;
  source: string;
  domainSuffix: string;
  count: number;
  activeCount: number;
  merchants: Merchant[];
}

export function merchantDomain(username: string): string {
  return `${username}.${getMainDomain()}`;
}

export function getMerchantTypes(merchants: Merchant[]): string[] {
  const types = new Set(merchants.map((m) => m.type).filter(Boolean));
  return Array.from(types).sort((a, b) => a.localeCompare(b));
}

export function getMerchantPlans(merchants: Merchant[]): string[] {
  const plans = new Set(
    merchants.map((m) => m.plan).filter((p): p is string => Boolean(p)),
  );
  const order = ["Basic", "Standard", "Plus", "Grand"];
  return order.filter((p) => plans.has(p));
}
