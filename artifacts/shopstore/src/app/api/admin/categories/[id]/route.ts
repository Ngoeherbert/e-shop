import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories, orderItems, products, reviews, wishlist } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { slugify } from "@/lib/utils";
import { revalidateCatalogPaths } from "@/lib/revalidate-catalog";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    
    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
    }

    const updateData: any = {
      name: body.name,
      description: body.description || null,
      image: body.image || null,
      bannerImage: body.bannerImage || null,
      updatedAt: new Date(),
    };

    // Update slug if name changed
    if (body.name) {
      updateData.slug = slugify(body.name) + "-" + categoryId;
    }

    const [updated] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    revalidateCatalogPaths();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = parseInt(id, 10);
    if (Number.isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
    }

    const categoryProducts = await db.query.products.findMany({
      where: eq(products.categoryId, categoryId),
      columns: { id: true },
    });
    const productIds = categoryProducts.map((product) => product.id);

    await db.transaction(async (tx) => {
      for (const productId of productIds) {
        await tx.delete(wishlist).where(eq(wishlist.productId, productId));
        await tx.delete(reviews).where(eq(reviews.productId, productId));
        await tx.update(orderItems).set({ productId: null }).where(eq(orderItems.productId, productId));
        await tx.delete(products).where(eq(products.id, productId));
      }
      await tx.delete(categories).where(eq(categories.id, categoryId));
    });
    revalidateCatalogPaths();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
