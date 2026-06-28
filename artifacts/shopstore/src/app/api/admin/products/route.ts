import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { revalidateCatalogPaths } from "@/lib/revalidate-catalog";

export async function GET() {
  const all = await db.query.products.findMany({ with: { category: true } });
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const slug = slugify(body.name) + "-" + Date.now();
  const [product] = await db.insert(products).values({
    name: body.name,
    slug,
    description: body.description || null,
    price: body.price,
    originalPrice: body.originalPrice || null,
    images: body.images || [],
    categoryId: body.categoryId ? parseInt(body.categoryId) : null,
    stock: parseInt(body.stock) || 0,
    featured: body.featured ?? false,
    trending: body.trending ?? false,
    tags: body.tags || [],
  }).returning();
  revalidateCatalogPaths();
  return NextResponse.json(product);
}
