import type { Metadata } from "next";

export const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://e-shop-shopstore.vercel.app");
export const siteName = "ShopStore";
export const brandColor = "#dc2626";
export const defaultDescription =
  "ShopStore is your online destination for quality automotive spare parts, accessories, deals, and crypto-friendly checkout support.";

export const storeKeywords = [
  "ShopStore",
  "online auto parts store",
  "automotive spare parts",
  "car spare parts",
  "OEM replacement parts",
  "aftermarket automotive parts",
  "sedan parts",
  "SUV accessories",
  "truck replacement parts",
  "performance car parts",
  "EV and hybrid parts",
  "classic car restoration parts",
  "crypto checkout",
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
    `Buy ${product.name} from ShopStore. Find reliable ${product.category?.name ?? "automotive"} parts, fitment-focused product details, and quality components for your vehicle.`,
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
  const imageUrl = absoluteUrl(image ?? "/opengraph.jpg");

  return {
    title,
    description: metaDescription,
    keywords: storeKeywords,
    authors: [{ name: siteName, url: absoluteUrl("/") }],
    creator: siteName,
    publisher: siteName,
    alternates: { canonical },
    openGraph: {
      title,
      description: metaDescription,
      url: canonical,
      siteName,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: title }],
      locale: "en_US",
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: metaDescription,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
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
