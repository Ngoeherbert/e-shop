import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { DealsPageClient } from "@/components/products/DealsPageClient";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { isNotNull } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";


export const metadata: Metadata = buildMetadata({
  title: "Health Product Deals",
  description: "Find discounted peptides, medicines, meds, and health products with crypto checkout through NOWPayments or request another payment option on WhatsApp.",
  path: "/deals",
});
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
