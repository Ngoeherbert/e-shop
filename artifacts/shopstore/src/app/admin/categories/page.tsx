import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";
import { ensureStoreSeedData } from "@/lib/db/seed";

export default async function AdminCategoriesPage() {
  // Ensure seed data exists
  await ensureStoreSeedData();

  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  });

  return <AdminCategoriesClient categories={allCategories} />;
}
