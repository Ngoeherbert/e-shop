import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { db } from "@/lib/db";
import { ensureStoreSeedData } from "@/lib/db/seed";

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
