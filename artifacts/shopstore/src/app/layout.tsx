import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { RouteProgress } from "@/components/providers/RouteProgress";
import { Suspense } from "react";
import { JsonLd, absoluteUrl, siteName, defaultDescription } from "@/lib/seo";


const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://autoparts-hub.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "AutoParts Hub",
  title: {
    default: "AutoParts Hub | Quality Automotive Spare Parts",
    template: "%s | AutoParts Hub",
  },
  description: "Shop quality automotive spare parts for sedans, SUVs, trucks, performance builds, EVs, hybrids, and classic cars with fast support from AutoParts Hub.",
  keywords: [
    "auto parts online",
    "car spare parts",
    "OEM replacement parts",
    "aftermarket automotive parts",
    "performance car parts",
    "EV and hybrid parts",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "AutoParts Hub | Quality Automotive Spare Parts",
    description: "Shop reliable spare parts across sedan, SUV, truck, performance, EV, hybrid, and classic car categories.",
    url: "/",
    siteName: "AutoParts Hub",
    images: [{ url: "/opengraph.jpg", width: 1200, height: 630, alt: "AutoParts Hub automotive spare parts" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoParts Hub | Quality Automotive Spare Parts",
    description: "Shop quality automotive spare parts for sedans, SUVs, trucks, performance builds, EVs, hybrids, and classic cars.",
    images: ["/opengraph.jpg"],
  },
  robots: { index: true, follow: true },
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
