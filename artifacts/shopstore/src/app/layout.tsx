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
    default: "feel peptides | Peptides, Medicines & Health Products",
    template: "%s | feel peptides",
  },
  description: defaultDescription,
  keywords: [
    "feel peptides",
    "peptides",
    "medicines",
    "meds",
    "drugs",
    "health products",
    "crypto checkout",
  ],
  authors: [{ name: siteName, url: absoluteUrl("/") }],
  creator: siteName,
  publisher: siteName,
  alternates: { canonical: absoluteUrl("/") },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "feel peptides | Peptides, Medicines & Health Products",
    description: defaultDescription,
    url: absoluteUrl("/"),
    siteName,
    images: [{ url: absoluteUrl("/opengraph.jpg"), width: 1200, height: 630, alt: "feel peptides health products storefront" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "feel peptides | Peptides, Medicines & Health Products",
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
