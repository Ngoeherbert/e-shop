INSERT INTO "categories" ("name", "slug", "description", "image", "banner_image") VALUES
  ('Electronics', 'electronics', 'Latest tech essentials for work, play, and everyday convenience.', 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=800&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1600&q=80'),
  ('Fashion', 'fashion', 'Style staples and statement pieces for every wardrobe.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80'),
  ('Home & Living', 'home-living', 'Comfortable, functional pieces for beautiful spaces.', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1600&q=80'),
  ('Fitness', 'fitness', 'Gear and accessories for stronger daily routines.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80'),
  ('Accessories', 'accessories', 'Small details that complete every look.', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80')
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = COALESCE("categories"."description", EXCLUDED."description"),
  "image" = COALESCE("categories"."image", EXCLUDED."image"),
  "banner_image" = COALESCE("categories"."banner_image", EXCLUDED."banner_image"),
  "updated_at" = now();
--> statement-breakpoint
INSERT INTO "products" ("name", "slug", "description", "price", "original_price", "images", "category_id", "stock", "featured", "trending", "badge", "tags") VALUES
  (
    'Smart Fitness Watch',
    'smart-fitness-watch',
    'Track workouts, heart rate, sleep, and notifications with a polished smartwatch built for all-day wear.',
    '149.00',
    '199.00',
    '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80","https://images.unsplash.com/photo-1544117519-31a4b719223d?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'electronics'),
    10,
    true,
    false,
    '25% OFF',
    '["smartwatch","fitness","electronics"]'::json
  ),
  (
    'Noise Cancelling Headphones',
    'noise-cancelling-headphones',
    'Immersive wireless headphones with active noise cancellation, plush ear cushions, and long battery life.',
    '229.00',
    NULL,
    '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80","https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'electronics'),
    5,
    true,
    true,
    NULL,
    '["audio","wireless","electronics"]'::json
  ),
  (
    'Premium Cotton T-Shirt',
    'premium-cotton-tshirt',
    'A soft, breathable cotton tee with a clean everyday fit and durable stitching.',
    '39.00',
    NULL,
    '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'fashion'),
    20,
    true,
    false,
    NULL,
    '["shirt","cotton","fashion"]'::json
  ),
  (
    'Wireless Game Controller',
    'wireless-game-controller',
    'Responsive wireless controller with ergonomic grips, precise sticks, and low-latency play.',
    '79.00',
    '99.00',
    '["https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'electronics'),
    8,
    true,
    false,
    NULL,
    '["gaming","controller","electronics"]'::json
  ),
  (
    'Modern Bed Frame',
    'modern-bed-frame',
    'Minimal bed frame with a sturdy profile and modern finish for a calmer bedroom.',
    '499.00',
    NULL,
    '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'home-living'),
    3,
    true,
    false,
    NULL,
    '["bedroom","furniture","home"]'::json
  ),
  (
    'Diamond Necklace Set',
    'diamond-necklace-set',
    'Elegant necklace set with a refined sparkle made for occasions, gifting, and everyday shine.',
    '189.00',
    NULL,
    '["https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'accessories'),
    12,
    true,
    true,
    NULL,
    '["jewelry","necklace","accessories"]'::json
  ),
  (
    'Adjustable Dumbbells',
    'adjustable-dumbbells',
    'Compact adjustable dumbbells that save space while supporting progressive strength training.',
    '129.00',
    NULL,
    '["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'fitness'),
    6,
    true,
    false,
    NULL,
    '["weights","strength","fitness"]'::json
  ),
  (
    'Slim Fit Jeans',
    'slim-fit-jeans',
    'Versatile slim-fit denim with a comfortable stretch and timeless five-pocket styling.',
    '59.00',
    NULL,
    '["https://images.unsplash.com/photo-1542272604-787c3835535d?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'fashion'),
    15,
    true,
    true,
    NULL,
    '["denim","jeans","fashion"]'::json
  ),
  (
    'Running Shoes',
    'running-shoes',
    'Lightweight running shoes with cushioned support for training days and casual movement.',
    '89.00',
    '129.00',
    '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'fitness'),
    15,
    false,
    false,
    NULL,
    '["running","shoes","fitness"]'::json
  ),
  (
    'Yoga Mat Premium',
    'yoga-mat-premium',
    'Supportive non-slip yoga mat with comfortable cushioning for stretching, yoga, and floor workouts.',
    '39.00',
    '59.00',
    '["https://images.unsplash.com/photo-1601925228689-a5d40c0b37c0?w=900&q=80"]'::json,
    (SELECT "id" FROM "categories" WHERE "slug" = 'fitness'),
    20,
    false,
    false,
    NULL,
    '["yoga","mat","fitness"]'::json
  )
ON CONFLICT ("slug") DO NOTHING;
--> statement-breakpoint
INSERT INTO "site_settings" ("id", "site_name", "site_tagline", "site_description", "logo_url", "primary_color", "secondary_color", "default_theme", "announcement_text", "announcement_enabled", "announcement_code", "announcement_discount", "whatsapp_number", "telegram_username", "instagram_username", "facebook_page_id", "hero_headline", "hero_subtitle", "hero_image") VALUES
  (1, 'DN Design Store', 'Big Deals. Bigger Savings.', 'Discover premium products at unbeatable prices curated for quality, comfort and style.', NULL, '#dc2626', '#111827', 'light', 'Claim 10% off on orders with code SAVE10 - Limited time only!', true, 'SAVE10', 10, '+1234567890', 'shopstore', 'shopstore', 'shopstore', 'Big Deals.
Bigger Savings.', 'Discover premium products at unbeatable prices curated for quality, comfort and style.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80')
ON CONFLICT ("id") DO UPDATE SET
  "site_name" = COALESCE("site_settings"."site_name", EXCLUDED."site_name"),
  "site_tagline" = COALESCE("site_settings"."site_tagline", EXCLUDED."site_tagline"),
  "site_description" = COALESCE("site_settings"."site_description", EXCLUDED."site_description"),
  "primary_color" = COALESCE("site_settings"."primary_color", EXCLUDED."primary_color"),
  "secondary_color" = COALESCE("site_settings"."secondary_color", EXCLUDED."secondary_color"),
  "default_theme" = COALESCE("site_settings"."default_theme", EXCLUDED."default_theme"),
  "hero_headline" = COALESCE("site_settings"."hero_headline", EXCLUDED."hero_headline"),
  "hero_subtitle" = COALESCE("site_settings"."hero_subtitle", EXCLUDED."hero_subtitle"),
  "hero_image" = COALESCE("site_settings"."hero_image", EXCLUDED."hero_image"),
  "updated_at" = now();
--> statement-breakpoint
SELECT setval(pg_get_serial_sequence('site_settings', 'id'), COALESCE((SELECT max("id") FROM "site_settings"), 1));
