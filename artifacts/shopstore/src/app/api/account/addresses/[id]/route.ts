import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

function parseId(id: string) {
  const parsed = Number(id);
  return Number.isInteger(parsed) ? parsed : null;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to update addresses." }, { status: 401 });
  const { id } = await params;
  const addressId = parseId(id);
  if (!addressId) return NextResponse.json({ error: "Invalid address." }, { status: 400 });
  const body = await req.json();

  if (body.isDefault) await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));

  const [updated] = await db.update(addresses).set({ isDefault: Boolean(body.isDefault) }).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).returning();
  if (!updated) return NextResponse.json({ error: "Address not found." }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to delete addresses." }, { status: 401 });
  const { id } = await params;
  const addressId = parseId(id);
  if (!addressId) return NextResponse.json({ error: "Invalid address." }, { status: 400 });

  const [deleted] = await db.delete(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).returning();
  if (!deleted) return NextResponse.json({ error: "Address not found." }, { status: 404 });

  const remaining = await db.query.addresses.findMany({ where: eq(addresses.userId, userId), orderBy: (addresses, { asc }) => [asc(addresses.createdAt)] });
  if (deleted.isDefault && remaining[0]) await db.update(addresses).set({ isDefault: true }).where(eq(addresses.id, remaining[0].id));

  return NextResponse.json({ ok: true });
}
