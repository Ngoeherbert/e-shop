
import { NextResponse } from "next/server";
import { nowPaymentsClient } from "../../../../lib/nowpayments";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const status = await nowPaymentsClient.getPaymentStatus(paymentId);
    return NextResponse.json(status);
  } catch (error) {
    console.error("[NOWPayments Status API Error]", error);
    return NextResponse.json(
      { error: "Failed to fetch payment status." },
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
