import catalog from "../../data/merchants.rory.ir.json";

export interface Merchant {
  id: string;
  username: string;
  name: string;
  domain: string;
  isActive: boolean;
  isMapActive: boolean;
  type: string;
  plan: string | null;
}

export interface MerchantCatalog {
  generatedAt: string;
  source: string;
  domainSuffix: string;
  count: number;
  activeCount: number;
  merchants: Merchant[];
}

const data = catalog as MerchantCatalog;

export function getMerchantCatalog(): MerchantCatalog {
  return data;
}

export function getMerchants(): Merchant[] {
  return data.merchants;
}

export function getMerchantTypes(): string[] {
  const types = new Set(data.merchants.map((m) => m.type).filter(Boolean));
  return Array.from(types).sort((a, b) => a.localeCompare(b));
}

export function getMerchantPlans(): string[] {
  const plans = new Set(
    data.merchants.map((m) => m.plan).filter((p): p is string => Boolean(p)),
  );
  const order = ["Basic", "Standard", "Plus", "Grand"];
  return order.filter((p) => plans.has(p));
}
