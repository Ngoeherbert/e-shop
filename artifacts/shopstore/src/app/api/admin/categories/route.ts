import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";

export async function GET() {
  const all = await db.query.categories.findMany();
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = slugify(body.name) + "-" + Date.now();
    
    const [category] = await db.insert(categories).values({
      name: body.name,
      slug,
      description: body.description || null,
      image: body.image || null,
      bannerImage: body.bannerImage || null,
    }).returning();
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
