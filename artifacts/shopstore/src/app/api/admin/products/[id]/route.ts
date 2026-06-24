import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderItems, products, reviews, wishlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const productId = parseInt(id, 10);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  const [updated] = await db.update(products).set({
    name: body.name,
    slug: body.name ? `${slugify(body.name)}-${productId}` : undefined,
    description: body.description || null,
    price: body.price,
    originalPrice: body.originalPrice || null,
    images: body.images || [],
    categoryId: body.categoryId ? parseInt(body.categoryId, 10) : null,
    stock: parseInt(body.stock, 10) || 0,
    featured: body.featured ?? false,
    trending: body.trending ?? false,
    updatedAt: new Date(),
  }).where(eq(products.id, productId)).returning();

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const productId = parseInt(id, 10);
  if (Number.isNaN(productId)) {
    return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
  }

  await db.transaction(async (tx) => {
    await tx.delete(wishlist).where(eq(wishlist.productId, productId));
    await tx.delete(reviews).where(eq(reviews.productId, productId));
    await tx.update(orderItems).set({ productId: null }).where(eq(orderItems.productId, productId));
    await tx.delete(products).where(eq(products.id, productId));
  });

  return NextResponse.json({ success: true });
}
