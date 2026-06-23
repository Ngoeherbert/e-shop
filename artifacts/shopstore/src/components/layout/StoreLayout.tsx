import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { AnnouncementBar } from "./AnnouncementBar";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export async function StoreLayout({ children }: { children: React.ReactNode }) {
  const allCategories = await db.query.categories.findMany({ orderBy: [asc(categories.name)] }).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Navbar categories={allCategories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
