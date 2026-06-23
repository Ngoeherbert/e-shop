import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { WishlistPageClient } from "@/components/wishlist/WishlistPageClient";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";

export default async function WishlistPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const items = session?.user?.id
    ? await db.query.wishlist.findMany({
        where: eq(wishlist.userId, session.user.id),
        with: { product: { with: { category: true } } },
        orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
      }).catch(() => [])
    : [];

  return (
    <StoreLayout>
      <WishlistPageClient items={items} />
    </StoreLayout>
  );
}
