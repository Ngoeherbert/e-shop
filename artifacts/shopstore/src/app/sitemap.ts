import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { absoluteUrl } from "@/lib/seo";
import { ensureStoreSeedData } from "@/lib/db/seed";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await ensureStoreSeedData();
  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({ orderBy: [desc(products.updatedAt)] }).catch(() => []),
    db.query.categories.findMany({ orderBy: [desc(categories.updatedAt)] }).catch(() => []),
  ]);

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: "/", changeFrequency: "daily" as const, priority: 1 },
    { path: "/shop", changeFrequency: "daily" as const, priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/deals", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly" as const, priority: 0.7 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.5 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.5 },
  ].map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  return [
    ...staticRoutes,
    ...allCategories.map((category) => ({
      url: absoluteUrl(`/categories/${category.slug}`),
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...allProducts.map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
