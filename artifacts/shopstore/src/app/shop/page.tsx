import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { ShopPageClient } from "@/components/products/ShopPageClient";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { desc, ilike, eq, and, or } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";

interface Props {
  searchParams: Promise<{ search?: string; category?: string; sort?: string; page?: string }>;
}

export default async function ShopPage({ searchParams }: Props) {
  await ensureStoreSeedData();
  const params = await searchParams;

  const allCategories = await db.query.categories.findMany().catch(() => []);

  const conditions = [];
  if (params.search) {
    conditions.push(
      or(
        ilike(products.name, `%${params.search}%`),
        ilike(products.description, `%${params.search}%`)
      )
    );
  }
  if (params.category && params.category !== "all") {
    const cat = allCategories.find((c) => c.slug === params.category);
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }

  const allProducts = await db.query.products
    .findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      with: { category: true },
      orderBy: [desc(products.createdAt)],
    })
    .catch(() => []);

  return (
    <StoreLayout>
      <ShopPageClient
        products={allProducts}
        categories={allCategories}
        searchQuery={params.search}
        categoryFilter={params.category}
      />
      <BlogSection />
    </StoreLayout>
  );
}
