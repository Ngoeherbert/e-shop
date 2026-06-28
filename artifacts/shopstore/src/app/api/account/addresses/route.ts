import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ addresses: [] });

  const savedAddresses = await db.query.addresses.findMany({
    where: eq(addresses.userId, userId),
    orderBy: (addresses, { desc }) => [desc(addresses.isDefault), desc(addresses.createdAt)],
  });

  return NextResponse.json({ addresses: savedAddresses });
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to save addresses." }, { status: 401 });

  const body = await req.json();
  const fullName = String(body.fullName ?? "").trim();
  const street = String(body.street ?? "").trim();
  const city = String(body.city ?? "").trim();
  const country = String(body.country ?? "").trim();
  if (!fullName || !street || !city || !country) return NextResponse.json({ error: "Full name, street, city, and country are required." }, { status: 400 });

  const existing = await db.query.addresses.findMany({ where: eq(addresses.userId, userId) });
  const shouldBeDefault = existing.length === 0 || Boolean(body.isDefault);
  if (shouldBeDefault) await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));

  const [created] = await db.insert(addresses).values({
    userId,
    label: String(body.label ?? "Home").trim() || "Home",
    fullName,
    phone: String(body.phone ?? "").trim() || null,
    street,
    city,
    state: String(body.state ?? "").trim() || null,
    country,
    zipCode: String(body.zipCode ?? "").trim() || null,
    isDefault: shouldBeDefault,
  }).returning();

  return NextResponse.json(created, { status: 201 });
}
