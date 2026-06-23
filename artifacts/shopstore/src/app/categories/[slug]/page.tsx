import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { ShopPageClient } from "@/components/products/ShopPageClient";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  await ensureStoreSeedData();
  const { slug } = await params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  }).catch(() => null);

  if (!category) notFound();

  const categoryProducts = await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: { category: true },
  }).catch(() => []);
  const categoryHeroImage = category.bannerImage ?? category.image;

  return (
    <StoreLayout>
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {categoryHeroImage && (
          <img
            src={categoryHeroImage}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <span className="hover:text-white/90 cursor-pointer">Home</span>
              <span>›</span>
              <span className="hover:text-white/90 cursor-pointer">Categories</span>
              <span>›</span>
              <span className="text-white font-medium">{category.name}</span>
            </div>
            <h1 className="text-4xl font-black text-white">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 mt-2">{category.description}</p>
            )}
          </div>
        </div>
      </div>
      <ShopPageClient products={categoryProducts} categories={[]} categoryFilter={slug} />
      <BlogSection />
    </StoreLayout>
  );
}
