
import { NextResponse } from "next/server";
import { nowPaymentsClient } from "@/lib/nowpayments";
import { NowPaymentsWebhookPayload, PaymentStatus } from "@/types/nowpayments";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-nowpayments-sig");
    if (!signature) {
      console.warn("NOWPayments Webhook: Missing signature header");
      return NextResponse.json({ message: "Missing signature" }, { status: 401 });
    }

    const rawBody = await req.text();

    if (!nowPaymentsClient.verifyWebhookSignature(rawBody, signature)) {
      console.warn("NOWPayments Webhook: Invalid signature");
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    const payload: NowPaymentsWebhookPayload = JSON.parse(rawBody);

    // Idempotency check (assuming payment_id is unique for each payment attempt)
    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, payload.order_id),
    });

    if (!existingOrder) {
      console.warn(`NOWPayments Webhook: Order with ID ${payload.order_id} not found`);
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Check if the payment has already been processed to prevent double-processing
    // This is a basic check, more robust idempotency might involve a separate table for webhook events
    if (existingOrder.status === "paid" && (payload.payment_status === PaymentStatus.Finished || payload.payment_status === PaymentStatus.Confirmed)) {
      console.info(`NOWPayments Webhook: Payment for order ${payload.order_id} already processed as paid`);
      return NextResponse.json({ message: "Payment already processed" }, { status: 200 });
    }

    let newStatus: 'pending' | 'paid' | 'failed' | 'review' = existingOrder.status as 'pending' | 'paid' | 'failed' | 'review';

    switch (payload.payment_status) {
      case PaymentStatus.Finished:
      case PaymentStatus.Confirmed:
        newStatus = "paid";
        break;
      case PaymentStatus.Failed:
      case PaymentStatus.Expired:
        newStatus = "failed";
        break;
      case PaymentStatus.PartiallyPaid:
        newStatus = "review";
        break;
      default:
        // For other statuses like waiting, confirming, sending, we might not need to update the order status immediately
        // Or we can set it to 'pending' if it's not already
        break;
    }

    if (newStatus !== existingOrder.status) {
      await db.update(orders)
        .set({ status: newStatus, updatedAt: new Date() })
        .where(eq(orders.orderNumber, payload.order_id));
      console.log(`NOWPayments Webhook: Order ${payload.order_id} status updated to ${newStatus}`);
    }

    return NextResponse.json({ message: "Webhook received and processed" }, { status: 200 });
  } catch (error) {
    console.error("[NOWPayments Webhook Error]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export function PUT() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

export function DELETE() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
