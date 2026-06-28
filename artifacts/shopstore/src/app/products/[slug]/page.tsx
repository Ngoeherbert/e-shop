import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { db } from "@/lib/db";
import { products, siteSettings } from "@/lib/db/schema";
import { and, desc, eq, ne } from "drizzle-orm";
import { JsonLd, absoluteUrl, buildMetadata, productSeoDescription } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.query.products
    .findFirst({ where: eq(products.slug, slug), with: { category: true } })
    .catch(() => null);

  if (!product) {
    return buildMetadata({ title: "Product Not Found", path: `/products/${slug}` });
  }

  return buildMetadata({
    title: product.name,
    description: productSeoDescription(product),
    path: `/products/${product.slug}`,
    image: product.images?.[0],
  });
}


export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
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
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: productSeoDescription(product),
          image: product.images ?? [],
          sku: String(product.id),
          category: product.category?.name,
          brand: {
            "@type": "Brand",
            name: "feel peptides",
          },
          offers: {
            "@type": "Offer",
            url: absoluteUrl(`/products/${product.slug}`),
            priceCurrency: "USD",
            price: product.price,
            availability: (product.stock ?? 0) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Shop", item: absoluteUrl("/shop") },
            { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/products/${product.slug}`) },
          ],
        },
      ]} />
      <ProductDetailClient product={product} settings={settings} relatedProducts={relatedProducts} />
    </StoreLayout>
  );
}
