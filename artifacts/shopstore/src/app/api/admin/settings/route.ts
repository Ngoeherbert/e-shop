import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const existing = await db.query.siteSettings.findFirst();

  if (existing) {
    const [updated] = await db.update(siteSettings).set({
      siteName: body.siteName,
      siteTagline: body.siteTagline,
      siteDescription: body.siteDescription,
      primaryColor: body.primaryColor,
      secondaryColor: body.secondaryColor,
      defaultTheme: body.defaultTheme ?? "light",
      logoUrl: body.logoUrl || null,
      announcementText: body.announcementText,
      announcementEnabled: body.announcementEnabled,
      announcementCode: body.announcementCode,
      announcementDiscount: body.announcementDiscount,
      whatsappNumber: body.whatsappNumber,
      telegramUsername: body.telegramUsername,
      instagramUsername: body.instagramUsername,
      facebookPageId: body.facebookPageId,
      heroHeadline: body.heroHeadline,
      heroSubtitle: body.heroSubtitle,
      heroImage: body.heroImage || null,
      updatedAt: new Date(),
    }).returning();
    return NextResponse.json(updated);
  } else {
    const [created] = await db.insert(siteSettings).values({
      siteName: body.siteName ?? "DN Design Store",
      primaryColor: body.primaryColor ?? "#dc2626",
      secondaryColor: body.secondaryColor ?? "#111827",
      defaultTheme: body.defaultTheme ?? "light",
    }).returning();
    return NextResponse.json(created);
  }
}

export async function GET() {
  const settings = await db.query.siteSettings.findFirst();
  return NextResponse.json(settings ?? {});
}
