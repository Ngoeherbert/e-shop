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
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_36%),linear-gradient(135deg,_rgba(15,23,42,0.98),_rgba(30,64,175,0.72))]" />
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-30 [background-image:linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_46%),linear-gradient(60deg,transparent_0%,rgba(255,255,255,0.08)_50%,transparent_51%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="mb-6 text-white/70">
              <StoreBreadcrumb items={[{ label: "Categories" }]} />
            </div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-blue-200">Health categories</p>
            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">Shop peptides, meds, and health essentials by category</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-blue-50/85 sm:text-lg">
              Browse feel peptides categories for medicines, wellness support, supplements, care guides, and health-focused products with clear details before checkout.
            </p>
          </div>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-3xl font-black text-gray-900 mb-10">All Categories</h2>
        <CategoryGrid categories={allCategories} />
      </div>
      <BlogSection />
    </StoreLayout>
  );
}
