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
import { eq, desc } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";

const homeCategorySlugs = ["sedan-parts", "suv-parts", "truck-parts", "performance-parts", "ev-hybrid-parts"];

export default async function HomePage() {
  await ensureStoreSeedData();
  const [featuredProducts, allCategories, settings] = await Promise.all([
    db.query.products.findMany({
      where: eq(products.featured, true),
      with: { category: true },
      limit: 8,
      orderBy: [desc(products.createdAt)],
    }).catch(() => []),
    db.query.categories.findMany().catch(() => []),
    db.query.siteSettings.findFirst().then((value) => value ?? null).catch(() => null),
  ]);

  const homeCategories = homeCategorySlugs
    .map((slug) => allCategories.find((category) => category.slug === slug))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));

  return (
    <StoreLayout>
      <Hero settings={settings} />
      <CategoryGrid categories={homeCategories} limit={5} />
      <FeaturedProducts products={featuredProducts} />
      <WhyShopWithUs />
      <Testimonials />
      <BlogSection />
      <NewsletterSection settings={settings} />
    </StoreLayout>
  );
}
