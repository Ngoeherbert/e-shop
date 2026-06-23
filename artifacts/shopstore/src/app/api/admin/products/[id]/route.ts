import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db.update(products).set({
    name: body.name,
    description: body.description || null,
    price: body.price,
    originalPrice: body.originalPrice || null,
    images: body.images || [],
    categoryId: body.categoryId ? parseInt(body.categoryId) : null,
    stock: parseInt(body.stock) || 0,
    featured: body.featured ?? false,
    trending: body.trending ?? false,
    updatedAt: new Date(),
  }).where(eq(products.id, parseInt(id))).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.delete(products).where(eq(products.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
