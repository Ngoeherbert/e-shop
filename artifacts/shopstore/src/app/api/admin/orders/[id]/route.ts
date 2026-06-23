import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const [updated] = await db.update(orders).set({
    status: body.status,
    updatedAt: new Date(),
  }).where(eq(orders.id, parseInt(id))).returning();
  return NextResponse.json(updated);
}
