INSERT INTO "categories" ("name", "slug", "description", "image", "banner_image") VALUES
  ('Electronics', 'electronics', 'Latest tech essentials for work, play, and everyday convenience.', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=900&q=80', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=80'),
  ('Fashion', 'fashion', 'Style staples and statement pieces for every wardrobe.', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80'),
  ('Home & Living', 'home-living', 'Comfortable, functional pieces for beautiful spaces.', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=900&q=80', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1800&q=80'),
  ('Fitness', 'fitness', 'Gear and accessories for stronger daily routines.', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=80', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1800&q=80'),
  ('Accessories', 'accessories', 'Small details that complete every look.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80', 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=1800&q=80'),
  ('Beauty & Care', 'beauty-care', 'Daily care, skincare, and self-care essentials.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1800&q=80'),
  ('Outdoor', 'outdoor', 'Durable picks for travel, hiking, and everyday adventures.', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900&q=80', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1800&q=80'),
  ('Toys & Games', 'toys-games', 'Fun, creative, and educational finds for all ages.', 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&q=80', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1800&q=80'),
  ('Office', 'office', 'Smart workspace upgrades for focus, comfort, and productivity.', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1800&q=80')
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = COALESCE(NULLIF("categories"."description", ''), EXCLUDED."description"),
  "image" = CASE WHEN "categories"."image" IS NULL OR "categories"."image" = '' THEN EXCLUDED."image" ELSE "categories"."image" END,
  "banner_image" = CASE WHEN "categories"."banner_image" IS NULL OR "categories"."banner_image" = '' THEN EXCLUDED."banner_image" ELSE "categories"."banner_image" END,
  "updated_at" = now();
--> statement-breakpoint
INSERT INTO "products" ("name", "slug", "description", "price", "original_price", "images", "category_id", "stock", "featured", "trending", "badge", "tags") VALUES
  ('Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Compact speaker with rich sound, splash resistance, and all-day battery life for home or travel.', '69.00', '89.00', '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&q=80","https://images.unsplash.com/photo-1545454675-3531b543be5d?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'electronics'), 18, true, true, 'Best Seller', '["speaker","audio","electronics"]'::json),
  ('USB-C Charging Hub', 'usb-c-charging-hub', 'Multi-port charging hub with USB-C power delivery and compact cable management for every desk.', '49.00', NULL, '["https://images.unsplash.com/photo-1625842268584-8f3296236761?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'electronics'), 24, true, false, NULL, '["charging","usb-c","electronics"]'::json),
  ('Classic Sunglasses', 'classic-sunglasses', 'Lightweight UV-protection sunglasses with a timeless frame for sunny days and daily wear.', '45.00', '65.00', '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'accessories'), 30, true, true, '30% OFF', '["sunglasses","style","accessories"]'::json),
  ('Minimalist Backpack', 'minimalist-backpack', 'Water-resistant backpack with padded laptop storage and clean everyday styling.', '74.00', '99.00', '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80","https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'outdoor'), 16, true, true, NULL, '["backpack","travel","outdoor"]'::json),
  ('Insulated Travel Bottle', 'insulated-travel-bottle', 'Double-wall stainless bottle that keeps drinks cold or hot while you commute, train, or travel.', '32.00', NULL, '["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'outdoor'), 40, true, false, NULL, '["bottle","travel","outdoor"]'::json),
  ('Ceramic Vase Set', 'ceramic-vase-set', 'Two-piece ceramic vase set with warm neutral tones for shelves, dining tables, and entryways.', '58.00', NULL, '["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'home-living'), 11, true, false, NULL, '["decor","vase","home"]'::json),
  ('Scented Candle Trio', 'scented-candle-trio', 'Three calming candle scents poured in reusable glass jars for cozy evenings and gifting.', '34.00', '48.00', '["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'home-living'), 22, true, true, NULL, '["candles","decor","home"]'::json),
  ('Daily Skincare Set', 'daily-skincare-set', 'A simple cleanser, serum, and moisturizer routine designed for easy daily care.', '64.00', '82.00', '["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=80","https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'beauty-care'), 20, true, true, 'New', '["skincare","beauty","self-care"]'::json),
  ('Makeup Brush Kit', 'makeup-brush-kit', 'Soft synthetic brush kit for smooth blending, precise detail work, and everyday routines.', '29.00', NULL, '["https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'beauty-care'), 28, false, false, NULL, '["makeup","brushes","beauty"]'::json),
  ('Ergonomic Office Chair', 'ergonomic-office-chair', 'Supportive office chair with adjustable height, breathable back support, and smooth-rolling casters.', '219.00', '279.00', '["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'office'), 7, true, false, NULL, '["chair","office","workspace"]'::json),
  ('Adjustable Laptop Stand', 'adjustable-laptop-stand', 'Foldable aluminum laptop stand that improves screen height and airflow in any workspace.', '42.00', NULL, '["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'office'), 19, true, true, NULL, '["laptop","stand","office"]'::json),
  ('Building Blocks Set', 'building-blocks-set', 'Colorful building blocks set for open-ended play, motor skills, and creative problem solving.', '54.00', NULL, '["https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'toys-games'), 25, true, false, NULL, '["blocks","kids","toys"]'::json),
  ('Wooden Puzzle Board', 'wooden-puzzle-board', 'Tactile wooden puzzle board with bright shapes for learning, matching, and playtime.', '26.00', '35.00', '["https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'toys-games'), 32, false, false, NULL, '["puzzle","learning","toys"]'::json),
  ('Premium Resistance Bands', 'premium-resistance-bands', 'Durable resistance bands with multiple tension levels for warmups, rehab, and strength work.', '24.00', NULL, '["https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'fitness'), 35, true, false, NULL, '["bands","training","fitness"]'::json),
  ('Ribbed Knit Sweater', 'ribbed-knit-sweater', 'Soft ribbed knit sweater with a relaxed fit for layering through cooler days.', '68.00', '88.00', '["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=900&q=80"]'::json, (SELECT "id" FROM "categories" WHERE "slug" = 'fashion'), 14, true, true, NULL, '["sweater","knit","fashion"]'::json)
ON CONFLICT ("slug") DO UPDATE SET
  "description" = COALESCE(NULLIF("products"."description", ''), EXCLUDED."description"),
  "images" = CASE WHEN "products"."images" IS NULL OR "products"."images"::text = '[]' THEN EXCLUDED."images" ELSE "products"."images" END,
  "category_id" = COALESCE("products"."category_id", EXCLUDED."category_id"),
  "stock" = CASE WHEN "products"."stock" = 0 THEN EXCLUDED."stock" ELSE "products"."stock" END,
  "featured" = true,
  "trending" = COALESCE("products"."trending", EXCLUDED."trending"),
  "badge" = COALESCE("products"."badge", EXCLUDED."badge"),
  "tags" = CASE WHEN "products"."tags" IS NULL OR "products"."tags"::text = '[]' THEN EXCLUDED."tags" ELSE "products"."tags" END,
  "updated_at" = now();
--> statement-breakpoint
UPDATE "products"
SET "featured" = true,
    "updated_at" = now()
WHERE "slug" IN (
  'smart-fitness-watch',
  'noise-cancelling-headphones',
  'premium-cotton-tshirt',
  'wireless-game-controller',
  'modern-bed-frame',
  'diamond-necklace-set',
  'adjustable-dumbbells',
  'slim-fit-jeans',
  'running-shoes',
  'yoga-mat-premium'
);
--> statement-breakpoint
UPDATE "site_settings"
SET "hero_image" = COALESCE(NULLIF("hero_image", ''), 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=80'),
    "hero_headline" = COALESCE(NULLIF("hero_headline", ''), 'Big Deals.
Bigger Savings.'),
    "hero_subtitle" = COALESCE(NULLIF("hero_subtitle", ''), 'Discover premium products, featured favorites, and category essentials curated for quality, comfort and style.'),
    "updated_at" = now()
WHERE "id" = (SELECT "id" FROM "site_settings" ORDER BY "id" LIMIT 1);
