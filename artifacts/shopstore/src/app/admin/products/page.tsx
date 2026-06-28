import { AdminProductsClient } from "@/components/admin/AdminProductsClient";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";


export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [allProducts, allCategories] = await Promise.all([
    db.query.products.findMany({ with: { category: true }, orderBy: [desc(products.createdAt)] }).catch(() => []),
    db.query.categories.findMany().catch(() => []),
  ]);
  return <AdminProductsClient products={allProducts} categories={allCategories} />;
}
