
import { z } from "zod";

const envSchema = z.object({
  NOWPAYMENTS_API_KEY: z.string().min(1, "NOWPAYMENTS_API_KEY is required"),
  NOWPAYMENTS_IPN_SECRET: z.string().min(1, "NOWPAYMENTS_IPN_SECRET is required"),
  NOWPAYMENTS_API_URL: z.string().url().default("https://api.nowpayments.io"),
  NOWPAYMENTS_PRICE_CURRENCY: z.string().min(1).default("usd"),
  NEXT_PUBLIC_SITE_URL: z.string().url().min(1, "NEXT_PUBLIC_SITE_URL is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

export const env = envSchema.parse(process.env);
