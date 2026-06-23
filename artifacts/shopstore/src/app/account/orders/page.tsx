import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { OrdersPageClient } from "@/components/account/OrdersPageClient";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";

export default async function OrdersPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userOrders = session?.user?.id
    ? await db.query.orders.findMany({
        where: eq(orders.userId, session.user.id),
        with: { items: true },
        orderBy: [desc(orders.createdAt)],
      }).catch(() => [])
    : [];

  return <OrdersPageClient orders={userOrders} />;
}
