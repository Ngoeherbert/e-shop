import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";

async function getSessionUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to view your profile." }, { status: 401 });

  const profile = await db.query.user.findFirst({ where: eq(user.id, userId) });
  if (!profile) return NextResponse.json({ error: "Profile not found." }, { status: 404 });

  return NextResponse.json({ user: profile });
}

export async function PATCH(req: NextRequest) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "Please sign in to update your profile." }, { status: 401 });

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const phoneNumber = String(body.phoneNumber ?? "").trim();
  const newsletterSubscribed = Boolean(body.newsletterSubscribed);

  if (!name) return NextResponse.json({ error: "Full name is required." }, { status: 400 });

  const [updated] = await db.update(user).set({
    name,
    phoneNumber: phoneNumber || null,
    newsletterSubscribed,
    updatedAt: new Date(),
  }).where(eq(user.id, userId)).returning();

  return NextResponse.json({ user: updated });
}
