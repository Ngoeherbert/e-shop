import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wishlist } from "@/lib/db/schema";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ items: [] });

  const items = await db.query.wishlist.findMany({
    where: eq(wishlist.userId, userId),
    with: { product: { with: { category: true } } },
    orderBy: (wishlist, { desc }) => [desc(wishlist.createdAt)],
  });

  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please log in to use your wishlist." }, { status: 401 });

  const { productId } = await req.json();
  const parsedProductId = Number(productId);
  if (!Number.isInteger(parsedProductId)) return NextResponse.json({ error: "Invalid product." }, { status: 400 });

  const existing = await db.query.wishlist.findFirst({
    where: and(eq(wishlist.userId, userId), eq(wishlist.productId, parsedProductId)),
  });

  if (existing) {
    await db.delete(wishlist).where(eq(wishlist.id, existing.id));
    return NextResponse.json({ wishlisted: false });
  }

  await db.insert(wishlist).values({ userId, productId: parsedProductId }).onConflictDoNothing();
  return NextResponse.json({ wishlisted: true });
}
