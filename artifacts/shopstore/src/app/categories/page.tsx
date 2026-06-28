import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { db } from "@/lib/db";


export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Health Product Categories",
  description: "Explore peptides, medicines, meds, drugs, health support, supplements, wellness tools, and care guide categories.",
  path: "/categories",
});
export default async function CategoriesPage() {
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
