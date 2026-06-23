ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "default_theme" text DEFAULT 'light' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_user_product_unique" ON "wishlist" USING btree ("user_id","product_id");
