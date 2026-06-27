
import { NextResponse } from "next/server";
import { nowPaymentsClient } from "../../../../lib/nowpayments";

export async function GET() {
  try {
    const currencies = await nowPaymentsClient.getCurrencies();
    // Cache response for 1 hour using Next.js fetch cache (revalidate option)
    return NextResponse.json(currencies.sort(), { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800' } });
  } catch (error) {
    console.error("[NOWPayments Currencies API Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch NOWPayments currencies." },
      { status: 500 }
    );
  }
}

export function POST() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
