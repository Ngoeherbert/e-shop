import type { Metadata } from "next";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://autoparts-hub.example.com");
export const siteName = "AutoParts Hub";
export const defaultDescription =
  "Shop quality automotive spare parts for sedans, SUVs, trucks, performance builds, EVs, hybrids, and classic cars with fast support from AutoParts Hub.";

export const automotiveKeywords = [
  "auto parts online",
  "car spare parts",
  "OEM replacement parts",
  "aftermarket automotive parts",
  "sedan parts",
  "SUV accessories",
  "truck replacement parts",
  "performance car parts",
  "EV and hybrid parts",
  "classic car restoration parts",
];

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function seoDescription(text?: string | null, fallback = defaultDescription) {
  const clean = (text ?? fallback).replace(/\s+/g, " ").trim();
  return clean.length > 158 ? `${clean.slice(0, 155).trim()}...` : clean;
}

export function productSeoDescription(product: { name: string; description?: string | null; category?: { name: string } | null }) {
  return seoDescription(
    product.description,
    `Buy ${product.name} from AutoParts Hub. Find reliable ${product.category?.name ?? "automotive"} parts, fitment-focused product details, and quality components for your vehicle.`,
  );
}

export function buildMetadata({
  title,
  description,
  path,
  image,
  type = "website",
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  type?: "website" | "article";
}): Metadata {
  const canonical = absoluteUrl(path);
  const metaDescription = seoDescription(description);
  const images = image ? [{ url: absoluteUrl(image), alt: title }] : [{ url: absoluteUrl("/opengraph.jpg"), alt: siteName }];

  return {
    title,
    description: metaDescription,
    keywords: automotiveKeywords,
    alternates: { canonical },
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      siteName,
      images,
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: images.map((item) => item.url),
    },
    robots: { index: true, follow: true },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
