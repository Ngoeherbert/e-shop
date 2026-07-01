import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyShopWithUs } from "@/components/home/WhyShopWithUs";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { BlogSection } from "@/components/home/BlogSection";
import { db } from "@/lib/db";
import { products, categories, siteSettings } from "@/lib/db/schema";
import { desc } from "drizzle-orm";


export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Peptides, Medicines & Health Deals",
  description: "feel peptides helps shoppers find peptides, medicines, meds, health products, educational guides, WhatsApp support, and crypto checkout through NOWPayments.",
  path: "/",
  image: "/opengraph.jpg",
});

export default async function HomePage() {
  const [homeProducts, allCategories, settings] = await Promise.all([
    db.query.products.findMany({
      with: { category: true },
      limit: 8,
      orderBy: [desc(products.createdAt)],
    }).catch(() => []),
    db.query.categories.findMany({
      orderBy: [desc(categories.createdAt)],
    }).catch(() => []),
    db.query.siteSettings.findFirst().then((value) => value ?? null).catch(() => null),
  ]);

  return (
    <StoreLayout>
      <Hero settings={settings} />
      <CategoryGrid categories={allCategories} limit={5} />
      <FeaturedProducts products={homeProducts} />
      <WhyShopWithUs />
      <Testimonials />
      <BlogSection />
      <NewsletterSection settings={settings} />
    </StoreLayout>
  );
}
