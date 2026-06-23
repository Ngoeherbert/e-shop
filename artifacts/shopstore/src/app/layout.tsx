import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SiteProvider } from "@/components/providers/SiteProvider";
import { RouteProgress } from "@/components/providers/RouteProgress";
import { Suspense } from "react";


export const metadata: Metadata = {
  title: "AutoParts Hub - Quality Spare Parts for Every Drive.",
  description: "Shop reliable spare parts across sedan, SUV, truck, performance, EV, and classic car categories.",
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
