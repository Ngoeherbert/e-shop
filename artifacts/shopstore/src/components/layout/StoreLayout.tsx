
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { StoreLayoutShell } from "./StoreLayoutShell";

export async function StoreLayout({ children }: { children: React.ReactNode }) {
  const allCategories = await db.query.categories.findMany({ orderBy: [asc(categories.name)] }).catch(() => []);

  return (
    <StoreLayoutShell categories={allCategories}>
      {children}
    </StoreLayoutShell>
  );
}
