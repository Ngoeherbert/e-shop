import { NextResponse } from "next/server";

interface NowPaymentsInvoiceResponse {
  invoice_url?: string;
  payment_url?: string;
  id?: string | number;
  invoice_id?: string | number;
  [key: string]: unknown;
}

const NOWPAYMENTS_API_URL = process.env.NOWPAYMENTS_API_URL ?? "https://api.nowpayments.io";
const DEFAULT_PRICE_CURRENCY = process.env.NOWPAYMENTS_PRICE_CURRENCY ?? "usd";

function getBaseUrl(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.NOWPAYMENTS_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "NOWPayments is not configured. Add NOWPAYMENTS_API_KEY to your environment." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => null) as {
    amount?: unknown;
    currency?: unknown;
    orderDescription?: unknown;
    orderId?: unknown;
  } | null;

  const amount = Number(body?.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "A valid payment amount is required." }, { status: 400 });
  }

  const baseUrl = getBaseUrl(request);
  const currency = typeof body?.currency === "string" && body.currency.trim()
    ? body.currency.trim().toLowerCase()
    : DEFAULT_PRICE_CURRENCY;
  const orderId = typeof body?.orderId === "string" && body.orderId.trim()
    ? body.orderId.trim()
    : `order-${Date.now()}`;
  const orderDescription = typeof body?.orderDescription === "string" && body.orderDescription.trim()
    ? body.orderDescription.trim().slice(0, 500)
    : "Store checkout";

  const response = await fetch(`${NOWPAYMENTS_API_URL.replace(/\/$/, "")}/v1/invoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      price_amount: Number(amount.toFixed(2)),
      price_currency: currency,
      order_id: orderId,
      order_description: orderDescription,
      success_url: `${baseUrl}/cart?payment=success`,
      cancel_url: `${baseUrl}/cart?payment=cancelled`,
    }),
  });

  const data = await response.json().catch(() => ({})) as NowPaymentsInvoiceResponse;

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to create NOWPayments invoice.", details: data },
      { status: response.status },
    );
  }

  const checkoutUrl = data.invoice_url ?? data.payment_url;
  if (!checkoutUrl) {
    return NextResponse.json(
      { error: "NOWPayments did not return a checkout URL.", details: data },
      { status: 502 },
    );
  }

  return NextResponse.json({ checkoutUrl, invoiceId: data.id ?? data.invoice_id ?? null });
}
