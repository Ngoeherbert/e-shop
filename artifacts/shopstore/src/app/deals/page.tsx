import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { DealsPageClient } from "@/components/products/DealsPageClient";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isNotNull } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";

export default async function DealsPage() {
  await ensureStoreSeedData();
  const dealProducts = await db.query.products.findMany({
    where: isNotNull(products.originalPrice),
    with: { category: true },
  }).catch(() => []);

  return (
    <StoreLayout>
      <DealsPageClient products={dealProducts} />
      <BlogSection />
    </StoreLayout>
  );
}
