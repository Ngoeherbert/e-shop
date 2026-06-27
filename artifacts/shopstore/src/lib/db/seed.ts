import { eq } from "drizzle-orm";
import { db } from "./index";
import { categories, products, siteSettings } from "./schema";

const categorySeeds = [
  { name: "Sedan Parts", slug: "sedan-parts", description: "Everyday service parts for compact and midsize cars.", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1800&q=80" },
  { name: "SUV Parts", slug: "suv-parts", description: "Brakes, suspension, filters, and lighting for family SUVs.", image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1800&q=80" },
  { name: "Truck Parts", slug: "truck-parts", description: "Heavy-duty replacement parts for pickups and work trucks.", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=1800&q=80" },
  { name: "Performance Parts", slug: "performance-parts", description: "Upgrades for better handling, airflow, stopping power, and response.", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1800&q=80" },
  { name: "EV & Hybrid Parts", slug: "ev-hybrid-parts", description: "Cabin filters, tires, chargers, and service essentials for electrified cars.", image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1800&q=80" },
  { name: "Classic Car Parts", slug: "classic-car-parts", description: "Restoration-ready ignition, trim, and maintenance components.", image: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=1800&q=80" },
];

const productSeeds = [
  { name: "Ceramic Brake Pad Set", slug: "ceramic-brake-pad-set", description: "Low-dust ceramic pads with quiet stopping power for daily sedans and compact cars.", price: "79.00", originalPrice: "99.00", images: ["https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=900&q=80"], categorySlug: "sedan-parts", stock: 24, featured: true, trending: true, badge: "Best Seller", tags: ["brakes", "sedan", "maintenance"] },
  { name: "SUV Shock Absorber Pair", slug: "suv-shock-absorber-pair", description: "Gas-charged shocks designed to restore comfort and control on family SUVs.", price: "149.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=900&q=80"], categorySlug: "suv-parts", stock: 12, featured: true, trending: false, badge: null, tags: ["suspension", "suv"] },
  { name: "Heavy-Duty Truck Air Filter", slug: "heavy-duty-truck-air-filter", description: "High-flow replacement air filter for pickups that work hard on road and job sites.", price: "45.00", originalPrice: "59.00", images: ["https://images.unsplash.com/photo-1632823471565-1ecdf5c9a849?w=900&q=80"], categorySlug: "truck-parts", stock: 35, featured: true, trending: true, badge: "Save 24%", tags: ["filter", "truck", "engine"] },
  { name: "Performance Cold Air Intake", slug: "performance-cold-air-intake", description: "Bolt-on intake kit built to improve airflow and throttle response for performance builds.", price: "229.00", originalPrice: "279.00", images: ["https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=900&q=80"], categorySlug: "performance-parts", stock: 7, featured: true, trending: true, badge: "Upgrade", tags: ["performance", "intake"] },
  { name: "EV Cabin Air Filter", slug: "ev-cabin-air-filter", description: "Activated-carbon cabin filter that keeps dust and odors out of EV and hybrid interiors.", price: "32.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=900&q=80"], categorySlug: "ev-hybrid-parts", stock: 40, featured: true, trending: false, badge: "New", tags: ["ev", "hybrid", "filter"] },
  { name: "Classic Ignition Tune-Up Kit", slug: "classic-ignition-tune-up-kit", description: "Distributor cap, rotor, points, and condenser kit for classic car maintenance.", price: "89.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=900&q=80"], categorySlug: "classic-car-parts", stock: 9, featured: true, trending: false, badge: null, tags: ["classic", "ignition"] },
  { name: "All-Weather Floor Mat Set", slug: "all-weather-floor-mat-set", description: "Trim-to-fit mats that protect car interiors from mud, rain, snow, and workshop mess.", price: "69.00", originalPrice: "89.00", images: ["https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=900&q=80"], categorySlug: "suv-parts", stock: 20, featured: true, trending: true, badge: null, tags: ["interior", "mats"] },
  { name: "LED Headlight Conversion Kit", slug: "led-headlight-conversion-kit", description: "Bright, efficient LED bulbs for improved night visibility across common vehicle categories.", price: "119.00", originalPrice: "149.00", images: ["https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=900&q=80"], categorySlug: "sedan-parts", stock: 16, featured: true, trending: true, badge: "20% OFF", tags: ["lighting", "headlights"] },
];

const defaultSettings = {
  siteName: "ShopStore",
  siteTagline: "Quality Parts for Every Drive.",
  siteDescription: "Shop reliable automotive spare parts, accessories, deals, and maintenance essentials across every major vehicle category.",
  primaryColor: "#dc2626",
  secondaryColor: "#111827",
  defaultTheme: "light",
  heroHeadline: "Shop Parts.\nDrive Better.",
  heroSubtitle: "Find quality OEM-style and aftermarket spare parts for your daily driver, work truck, family SUV, or weekend project car.",
  heroImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1800&q=80",
};

const globalForSeed = globalThis as typeof globalThis & {
  storeSeedPromise?: Promise<void>;
};

function isEmptyArray(value: unknown) {
  return !Array.isArray(value) || value.length === 0;
}

async function seedCategories() {
  for (const category of categorySeeds) {
    const existing = await db.query.categories.findFirst({ where: eq(categories.slug, category.slug) });
    if (existing) {
      await db.update(categories).set({
        name: category.name,
        description: existing.description || category.description,
        image: existing.image || category.image,
        bannerImage: existing.bannerImage || category.bannerImage,
        updatedAt: new Date(),
      }).where(eq(categories.id, existing.id));
    } else {
      await db.insert(categories).values(category);
    }
  }
}

async function seedProducts() {
  const storedCategories = await db.query.categories.findMany();
  const categoryIds = new Map(storedCategories.map((category) => [category.slug, category.id]));

  for (const product of productSeeds) {
    const categoryId = categoryIds.get(product.categorySlug) ?? null;
    const values = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      categoryId,
      stock: product.stock,
      featured: product.featured,
      trending: product.trending,
      badge: product.badge,
      tags: product.tags,
    };
    const existing = await db.query.products.findFirst({ where: eq(products.slug, product.slug) });
    if (existing) {
      await db.update(products).set({
        description: existing.description || product.description,
        images: isEmptyArray(existing.images) ? product.images : existing.images,
        categoryId: existing.categoryId ?? categoryId,
        stock: existing.stock > 0 ? existing.stock : product.stock,
        featured: true,
        trending: existing.trending ?? product.trending,
        badge: existing.badge ?? product.badge,
        tags: isEmptyArray(existing.tags) ? product.tags : existing.tags,
        updatedAt: new Date(),
      }).where(eq(products.id, existing.id));
    } else {
      await db.insert(products).values(values);
    }
  }
}

async function seedSettings() {
  const existing = await db.query.siteSettings.findFirst();
  if (existing) {
    await db.update(siteSettings).set({
      siteName: existing.siteName || defaultSettings.siteName,
      siteTagline: existing.siteTagline || defaultSettings.siteTagline,
      siteDescription: existing.siteDescription || defaultSettings.siteDescription,
      primaryColor: existing.primaryColor || defaultSettings.primaryColor,
      secondaryColor: existing.secondaryColor || defaultSettings.secondaryColor,
      defaultTheme: existing.defaultTheme || defaultSettings.defaultTheme,
      heroHeadline: existing.heroHeadline || defaultSettings.heroHeadline,
      heroSubtitle: existing.heroSubtitle || defaultSettings.heroSubtitle,
      heroImage: existing.heroImage || defaultSettings.heroImage,
      updatedAt: new Date(),
    }).where(eq(siteSettings.id, existing.id));
  } else {
    await db.insert(siteSettings).values(defaultSettings);
  }
}

async function seedStoreCatalog() {
  await seedCategories();
  await seedProducts();
  await seedSettings();
}

export async function ensureStoreSeedData() {
  if (process.env.DISABLE_STORE_AUTO_SEED === "true") return;

  globalForSeed.storeSeedPromise ??= seedStoreCatalog().catch((error) => {
    globalForSeed.storeSeedPromise = undefined;
    console.error("Failed to seed store catalog", error);
  });

  await globalForSeed.storeSeedPromise;
}
