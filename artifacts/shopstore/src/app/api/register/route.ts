import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { account, user } from "@/lib/db/schema";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 });
  }

  if (!emailPattern.test(email)) {
    return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existingUser = await db.query.user.findFirst({ where: eq(user.email, email) });
  if (existingUser) {
    return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  }

  const now = new Date();
  const userId = crypto.randomUUID();
  const accountId = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.transaction(async (tx) => {
    await tx.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: false,
      image: null,
      createdAt: now,
      updatedAt: now,
      role: "user",
      banned: false,
      banReason: null,
      banExpires: null,
      phoneNumber: body.phoneNumber ? String(body.phoneNumber) : null,
      newsletterSubscribed: Boolean(body.newsletterSubscribed ?? false),
    });

    await tx.insert(account).values({
      id: accountId,
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      createdAt: now,
      updatedAt: now,
    });
  });

  return NextResponse.json({
    user: {
      id: userId,
      name,
      email,
      emailVerified: false,
      role: "user",
    },
  }, { status: 201 });
}
