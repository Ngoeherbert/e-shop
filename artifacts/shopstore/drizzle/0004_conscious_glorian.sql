ALTER TABLE "site_settings" ALTER COLUMN "announcement_text" SET DEFAULT 'Pay with crypto via NOWPayments, or message us on WhatsApp for alternate payment options.';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "invoice_url" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "site_settings" ADD COLUMN "now_payments_url" text DEFAULT 'https://nowpayments.io/payment/?iid=replace-with-your-invoice';--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "telegram_username";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "instagram_username";--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN "facebook_page_id";--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_unique" UNIQUE("payment_id");