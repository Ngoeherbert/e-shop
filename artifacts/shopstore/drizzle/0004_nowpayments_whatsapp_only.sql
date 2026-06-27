ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "now_payments_url" text DEFAULT 'https://nowpayments.io/payment/?iid=replace-with-your-invoice';
--> statement-breakpoint
UPDATE "site_settings"
SET "announcement_text" = 'Pay with crypto via NOWPayments, or message us on WhatsApp for alternate payment options.',
    "now_payments_url" = COALESCE("now_payments_url", 'https://nowpayments.io/payment/?iid=replace-with-your-invoice');
--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "telegram_username";
--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "instagram_username";
--> statement-breakpoint
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "facebook_page_id";
