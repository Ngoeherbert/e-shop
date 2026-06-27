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
      nowPaymentsUrl: body.nowPaymentsUrl,
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
      whatsappNumber: body.whatsappNumber ?? "+1234567890",
      nowPaymentsUrl: body.nowPaymentsUrl ?? "https://nowpayments.io/payment/?iid=replace-with-your-invoice",
      announcementText: body.announcementText ?? "Pay with crypto via NOWPayments, or message us on WhatsApp for alternate payment options.",
      announcementEnabled: body.announcementEnabled ?? true,
      announcementCode: body.announcementCode ?? "SAVE10",
      announcementDiscount: body.announcementDiscount ?? 10,
    }).returning();
    return NextResponse.json(created);
  }
}

export async function GET() {
  const settings = await db.query.siteSettings.findFirst();
  return NextResponse.json(settings ?? {});
}
