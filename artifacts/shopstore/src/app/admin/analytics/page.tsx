import { AdminAnalyticsClient } from "@/components/admin/AdminAnalyticsClient";
import { db } from "@/lib/db";
import { analyticsEvents, orderItems, orders } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: "#22c55e",
  telegram: "#3b82f6",
  instagram: "#ec4899",
  facebook: "#1d4ed8",
  website: "#64748b",
};

export default async function AdminAnalyticsPage() {
  const [monthlyRows, topProducts, channelRows, totals, visitorRows] = await Promise.all([
    db.select({
      month: sql<string>`to_char(date_trunc('month', ${orders.createdAt}), 'Mon YYYY')`,
      monthStart: sql<Date>`date_trunc('month', ${orders.createdAt})`,
      revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
      orders: sql<number>`count(*)`,
    }).from(orders).groupBy(sql`date_trunc('month', ${orders.createdAt})`).orderBy(sql`date_trunc('month', ${orders.createdAt})`).catch(() => []),
    db.select({
      name: orderItems.productName,
      sales: sql<number>`coalesce(sum(${orderItems.quantity}), 0)`,
      revenue: sql<string>`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)`,
    }).from(orderItems).groupBy(orderItems.productName).orderBy(desc(sql`coalesce(sum(${orderItems.price} * ${orderItems.quantity}), 0)`)).limit(5).catch(() => []),
    db.select({ channel: orders.contactMethod, value: sql<number>`count(*)` }).from(orders).groupBy(orders.contactMethod).catch(() => []),
    db.select({ revenue: sql<string>`coalesce(sum(${orders.total}), 0)`, orders: sql<number>`count(*)` }).from(orders).catch(() => [{ revenue: "0", orders: 0 }]),
    db.select({ visitors: sql<number>`count(distinct coalesce(${analyticsEvents.userId}, ${analyticsEvents.metadata}::text, ${analyticsEvents.id}::text))` }).from(analyticsEvents).catch(() => [{ visitors: 0 }]),
  ]);

  const totalRevenue = Number(totals[0]?.revenue ?? 0);
  const totalOrders = Number(totals[0]?.orders ?? 0);
  const visitors = Number(visitorRows[0]?.visitors ?? 0);

  return (
    <AdminAnalyticsClient
      monthly={monthlyRows.map((row) => ({ month: row.month, revenue: Number(row.revenue), orders: Number(row.orders), visitors: 0 }))}
      topProducts={topProducts.map((row) => ({ name: row.name, sales: Number(row.sales), revenue: Number(row.revenue) }))}
      channels={channelRows.filter((row) => row.channel).map((row) => ({
        name: row.channel ?? "Unknown",
        value: Number(row.value),
        color: CHANNEL_COLORS[(row.channel ?? "").toLowerCase()] ?? "#64748b",
      }))}
      kpis={{ revenue: totalRevenue, orders: totalOrders, visitors, averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0 }}
    />
  );
}
