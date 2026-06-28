import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";


export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {

  const allCategories = await db.query.categories.findMany({
    orderBy: [desc(categories.createdAt)],
  });

  return <AdminCategoriesClient categories={allCategories} />;
}
