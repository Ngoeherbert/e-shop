
export interface NowPaymentsInvoice {
  id: string;
  invoice_url: string;
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  order_id: string;
  order_description: string;
  status: PaymentStatus;
}

export interface NowPaymentsWebhookPayload {
  payment_id: string;
  payment_status: PaymentStatus;
  order_id: string;
  price_amount: number;
  pay_amount: number;
  pay_currency: string;
  actually_paid: number;
}

export enum PaymentStatus {
  Waiting = "waiting",
  Confirming = "confirming",
  Confirmed = "confirmed",
  Sending = "sending",
  PartiallyPaid = "partially_paid",
  Finished = "finished",
  Failed = "failed",
  Refunded = "refunded",
  Expired = "expired",
}

export interface CreatePaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  order_id: string;
  order_description: string;
  ipn_callback_url: string;
}
