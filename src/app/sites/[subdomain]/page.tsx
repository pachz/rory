import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRestaurantData } from "@/lib/api/restaurant";
import { RestaurantPage } from "@/components/restaurant/RestaurantPage";
import { isRtlLanguage } from "@/lib/format";

interface PageProps {
  params: Promise<{ subdomain: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { subdomain } = await params;
  const data = await getRestaurantData(subdomain);

  if (!data) {
    return { title: "Not Found" };
  }

  return {
    title: data.intro.name,
    description: data.intro.slogan || `${data.intro.name} — Menu`,
    openGraph: {
      title: data.intro.name,
      description: data.intro.slogan || undefined,
      images: data.intro.coverPhoto ? [data.intro.coverPhoto] : undefined,
    },
  };
}

export default async function SitePage({ params }: PageProps) {
  const { subdomain } = await params;
  const data = await getRestaurantData(subdomain);

  if (!data) {
    notFound();
  }

  const rtl = isRtlLanguage(data.intro.defaultLanguage);

  return (
    <div dir={rtl ? "rtl" : "ltr"} lang={rtl ? "fa" : "en"}>
      <RestaurantPage data={data} />
    </div>
  );
}
