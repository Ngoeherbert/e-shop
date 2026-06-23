import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export default async function AdminOrdersPage() {
  const allOrders = await db.query.orders.findMany({
    with: { user: true, items: true },
    orderBy: [desc(orders.createdAt)],
  }).catch(() => []);
  return <AdminOrdersClient orders={allOrders} />;
}
