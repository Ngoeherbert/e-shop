import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { db } from "@/lib/db";
import { ensureStoreSeedData } from "@/lib/db/seed";


export const metadata: Metadata = buildMetadata({
  title: "Auto Parts Categories",
  description: "Explore automotive part categories for maintenance, repair, accessories, performance, EV, hybrid, truck, SUV, and sedan needs.",
  path: "/categories",
});
export default async function CategoriesPage() {
  await ensureStoreSeedData();
  const allCategories = await db.query.categories.findMany().catch(() => []);
  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreBreadcrumb items={[{ label: "Categories" }]} />
        <h1 className="text-3xl font-black text-gray-900 mb-10">All Categories</h1>
        <CategoryGrid categories={allCategories} />
      </div>
      <BlogSection />
    </StoreLayout>
  );
}
