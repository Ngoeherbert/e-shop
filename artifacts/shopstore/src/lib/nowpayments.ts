
import { env } from "./env";
import { CreatePaymentRequest, NowPaymentsInvoice, NowPaymentsWebhookPayload, PaymentStatus } from "../types/nowpayments";
import crypto from "crypto";

export class NowPaymentsClientError extends Error {
  constructor(message: string, public readonly details?: any) {
    super(message);
    this.name = "NowPaymentsClientError";
  }
}

export class NowPaymentsClient {
  private readonly apiKey: string;
  private readonly apiUrl: string;
  private readonly ipnSecret: string;

  constructor() {
    this.apiKey = env.NOWPAYMENTS_API_KEY;
    this.apiUrl = env.NOWPAYMENTS_API_URL;
    this.ipnSecret = env.NOWPAYMENTS_IPN_SECRET;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.apiUrl.replace(/\/$/, "")}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "x-api-key": this.apiKey,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.message || `NOWPayments API error: ${response.status} ${response.statusText}`;
      throw new NowPaymentsClientError(errorMessage, data);
    }
    return data as T;
  }

  /**
   * Creates a new NOWPayments invoice.
   * @param payload - The payment request details.
   * @returns A promise that resolves to the created invoice.
   */
  async createInvoice(payload: CreatePaymentRequest): Promise<NowPaymentsInvoice> {
    const response = await this.request<NowPaymentsInvoice>("/v1/invoice", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  }

  /**
   * Retrieves the status of a payment.
   * @param paymentId - The ID of the payment to retrieve.
   * @returns A promise that resolves to the payment status payload.
   */
  async getPaymentStatus(paymentId: string): Promise<NowPaymentsWebhookPayload> {
    const response = await this.request<NowPaymentsWebhookPayload>(`/v1/payment/${paymentId}`);
    return response;
  }

  /**
   * Retrieves a list of available currencies.
   * @returns A promise that resolves to an array of currency codes.
   */
  async getCurrencies(): Promise<string[]> {
    const response = await this.request<{ currencies: string[] }>("/v1/currencies");
    return response.currencies;
  }

  /**
   * Verifies the signature of a NOWPayments webhook payload.
   * @param payload - The raw webhook payload (as a string or object).
   * @param signature - The `x-nowpayments-sig` header value.
   * @returns True if the signature is valid, false otherwise.
   */
  verifyWebhookSignature(payload: string | object, signature: string): boolean {
    const hmac = crypto.createHmac("sha512", this.ipnSecret);
    const body = typeof payload === "string" ? payload : JSON.stringify(payload);
    hmac.update(body);
    const hash = hmac.digest("hex");
    return hash === signature;
  }
}

export const nowPaymentsClient = new NowPaymentsClient();
