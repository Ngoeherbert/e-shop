import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { db } from "@/lib/db";
import { products, siteSettings } from "@/lib/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  await ensureStoreSeedData();
  const { slug } = await params;

  const product = await db.query.products
    .findFirst({
      where: eq(products.slug, slug),
      with: { category: true },
    })
    .then((value) => value ?? null).catch(() => null);

  const settings = await db.query.siteSettings.findFirst().then((value) => value ?? null).catch(() => null);

  if (!product) {
    notFound();
  }

  const relatedProducts = await db.query.products.findMany({
    where: product.categoryId
      ? and(eq(products.categoryId, product.categoryId), ne(products.id, product.id))
      : ne(products.id, product.id),
    with: { category: true },
    limit: 4,
    orderBy: [desc(products.featured), desc(products.createdAt)],
  }).catch(() => []);

  return (
    <StoreLayout>
      <ProductDetailClient product={product} settings={settings} relatedProducts={relatedProducts} />
    </StoreLayout>
  );
}
