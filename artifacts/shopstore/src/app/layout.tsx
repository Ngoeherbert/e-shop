import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { RouteProgress } from "@/components/providers/RouteProgress";
import { Suspense } from "react";
import { JsonLd, absoluteUrl, siteName, defaultDescription } from "@/lib/seo";


export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  applicationName: siteName,
  title: {
    default: "ShopStore | Quality Automotive Parts & Accessories",
    template: "%s | ShopStore",
  },
  description: defaultDescription,
  keywords: [
    "ShopStore",
    "online auto parts store",
    "automotive spare parts",
    "car accessories",
    "replacement car parts",
    "performance parts",
    "crypto checkout",
  ],
  authors: [{ name: "ShopStore", url: absoluteUrl("/") }],
  creator: "ShopStore",
  publisher: "ShopStore",
  alternates: { canonical: absoluteUrl("/") },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "ShopStore | Quality Automotive Parts & Accessories",
    description: defaultDescription,
    url: absoluteUrl("/"),
    siteName,
    images: [{ url: absoluteUrl("/opengraph.jpg"), width: 1200, height: 630, alt: "ShopStore automotive parts storefront" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopStore | Quality Automotive Parts & Accessories",
    description: defaultDescription,
    images: [absoluteUrl("/opengraph.jpg")],
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <JsonLd data={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteName,
            url: absoluteUrl("/"),
            logo: absoluteUrl("/favicon.svg"),
            sameAs: [],
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteName,
            url: absoluteUrl("/"),
            description: defaultDescription,
            potentialAction: {
              "@type": "SearchAction",
              target: `${absoluteUrl("/shop")}?search={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          },
        ]} />
        <SiteProvider>
          <Suspense fallback={null}>
            <RouteProgress />
          </Suspense>
          {children}
          <Toaster position="top-right" richColors />
        </SiteProvider>
      </body>
    </html>
  );
}
