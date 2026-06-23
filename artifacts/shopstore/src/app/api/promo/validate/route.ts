import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { promoCodes, siteSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  if (!code) return NextResponse.json({ error: "Code required" }, { status: 400 });

  const upperCode = code.toUpperCase();
  const promo = await db.query.promoCodes.findFirst({ where: eq(promoCodes.code, upperCode) }).catch(() => null);

  if (promo && promo.active) {
    const now = new Date();
    if (promo.expiresAt && promo.expiresAt < now) {
      return NextResponse.json({ error: "Code expired" }, { status: 400 });
    }
    if (promo.maxUses && (promo.usedCount ?? 0) >= promo.maxUses) {
      return NextResponse.json({ error: "Code fully used" }, { status: 400 });
    }
    return NextResponse.json({ discount: promo.discount, code: promo.code });
  }

  const settings = await db.query.siteSettings.findFirst().catch(() => null);
  if (settings?.announcementCode && settings.announcementCode.toUpperCase() === upperCode) {
    return NextResponse.json({ discount: settings.announcementDiscount ?? 10, code: upperCode });
  }

  return NextResponse.json({ error: "Invalid promo code" }, { status: 404 });
}
