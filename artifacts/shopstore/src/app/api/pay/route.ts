
import { NextResponse } from "next/server";
import { nowPaymentsClient } from "../../../lib/nowpayments";
import { CreatePaymentRequest } from "../../../types/nowpayments";
import { z } from "zod";
import { env } from "../../../lib/env";

const createPaymentSchema = z.object({
  price_amount: z.number().positive("Price amount must be a positive number"),
  price_currency: z.string().min(1, "Price currency is required"),
  pay_currency: z.string().min(1, "Pay currency is required"),
  order_id: z.string().min(1, "Order ID is required"),
  order_description: z.string().min(1, "Order description is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = createPaymentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { price_amount, price_currency, pay_currency, order_id, order_description } = validation.data;

    const ipn_callback_url = `${env.NEXT_PUBLIC_SITE_URL}/api/webhook/nowpayments`;

    const createRequest: CreatePaymentRequest = {
      price_amount,
      price_currency,
      pay_currency,
      order_id,
      order_description,
      ipn_callback_url,
    };

    const invoice = await nowPaymentsClient.createInvoice(createRequest);

    return NextResponse.json({
      invoiceUrl: invoice.invoice_url,
      paymentId: invoice.id,
      // expiresAt: invoice.expiration_estimate_date, // Assuming this field exists in the actual API response
    });
  } catch (error) {
    console.error("[NOWPayments Payment API Error]", error);
    return NextResponse.json(
      { error: "Failed to create NOWPayments invoice." },
      { status: 500 }
    );
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
