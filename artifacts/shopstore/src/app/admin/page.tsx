import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { db } from "@/lib/db";
import { products, orders, user, categories } from "@/lib/db/schema";
import { sql, desc } from "drizzle-orm";

const CATEGORY_COLORS = ["#dc2626", "#f97316", "#3b82f6", "#22c55e", "#a855f7", "#0891b2"];

export default async function AdminDashboardPage() {
  const [productCount, orderCount, userCount, recentOrders, categoryCount, revenueRows, revenueData, categoryData] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(products).catch(() => [{ count: 0 }]),
    db.select({ count: sql<number>`count(*)` }).from(orders).catch(() => [{ count: 0 }]),
    db.select({ count: sql<number>`count(*)` }).from(user).catch(() => [{ count: 0 }]),
    db.query.orders.findMany({ with: { items: true }, limit: 5, orderBy: [desc(orders.createdAt)] }).catch(() => []),
    db.select({ count: sql<number>`count(*)` }).from(categories).catch(() => [{ count: 0 }]),
    db.select({ revenue: sql<string>`coalesce(sum(${orders.total}), 0)` }).from(orders).catch(() => [{ revenue: "0" }]),
    db.select({
      month: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'Mon YYYY')`,
      revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
      orders: sql<number>`count(*)`,
    }).from(orders).groupBy(sql`date_trunc('month', ${orders.createdAt})`).orderBy(sql`date_trunc('month', ${orders.createdAt})`).limit(7).catch(() => []),
    db.select({ name: categories.name, value: sql<number>`count(${products.id})` })
      .from(categories)
      .leftJoin(products, sql`${products.categoryId} = ${categories.id}`)
      .groupBy(categories.name)
      .catch(() => []),
  ]);

  return (
    <AdminDashboardClient
      stats={{
        products: Number(productCount[0]?.count ?? 0),
        orders: Number(orderCount[0]?.count ?? 0),
        users: Number(userCount[0]?.count ?? 0),
        categories: Number(categoryCount[0]?.count ?? 0),
        revenue: Number(revenueRows[0]?.revenue ?? 0),
      }}
      recentOrders={recentOrders}
      revenueData={revenueData.map((row) => ({ month: row.month, revenue: Number(row.revenue), orders: Number(row.orders) }))}
      categoryData={categoryData.map((row, index) => ({ name: row.name, value: Number(row.value), color: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }))}
    />
  );
}
