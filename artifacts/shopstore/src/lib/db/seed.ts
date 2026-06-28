import { eq } from "drizzle-orm";
import { db } from "./index";
import { categories, products, siteSettings } from "./schema";

const categorySeeds = [
  { name: "Peptides", slug: "peptides", description: "Peptide products and research-focused wellness essentials with clear handling details.", image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1800&q=80" },
  { name: "Medicines", slug: "medicines", description: "Medicine and med essentials organized with dosage, safety, and storage details.", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1800&q=80" },
  { name: "Health Support", slug: "health-support", description: "Everyday health products, wellness support, and care essentials.", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1800&q=80" },
  { name: "Supplements", slug: "supplements", description: "Supplement and wellness products for health-focused routines.", image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=1800&q=80" },
  { name: "Wellness Tools", slug: "wellness-tools", description: "Tools and accessories that support safe storage, tracking, and daily wellness habits.", image: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1800&q=80" },
  { name: "Care Guides", slug: "care-guides", description: "Educational health guides covering medicines, drugs, peptides, and product safety basics.", image: "https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?w=900&q=80", bannerImage: "https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?w=1800&q=80" },
];

const productSeeds = [
  { name: "Peptide Storage Kit", slug: "peptide-storage-kit", description: "A wellness storage kit for organizing peptide products with cold-chain friendly handling notes.", price: "79.00", originalPrice: "99.00", images: ["https://images.unsplash.com/photo-1579154204601-01588f351e67?w=900&q=80"], categorySlug: "peptides", stock: 24, featured: true, trending: true, badge: "Best Seller", tags: ["peptides", "storage", "health"] },
  { name: "Medicine Safety Organizer", slug: "medicine-safety-organizer", description: "A labeled organizer for meds and medicines with space for dosage reminders and safety notes.", price: "39.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=80"], categorySlug: "medicines", stock: 30, featured: true, trending: false, badge: null, tags: ["medicine", "meds", "organizer"] },
  { name: "Health Essentials Bundle", slug: "health-essentials-bundle", description: "A curated health support bundle for everyday wellness routines and care planning.", price: "59.00", originalPrice: "79.00", images: ["https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=900&q=80"], categorySlug: "health-support", stock: 35, featured: true, trending: true, badge: "Save 25%", tags: ["health", "wellness", "care"] },
  { name: "Wellness Supplement Pack", slug: "wellness-supplement-pack", description: "Supplement-focused wellness support with transparent ingredient and storage information.", price: "49.00", originalPrice: "65.00", images: ["https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=900&q=80"], categorySlug: "supplements", stock: 18, featured: true, trending: true, badge: "Popular", tags: ["supplements", "wellness"] },
  { name: "Digital Dose Tracker", slug: "digital-dose-tracker", description: "A simple tracker for logging health routines, medicine timing, and wellness notes.", price: "32.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1576671081837-49000212a370?w=900&q=80"], categorySlug: "wellness-tools", stock: 40, featured: true, trending: false, badge: "New", tags: ["tracker", "meds", "health"] },
  { name: "Drug Interaction Checklist", slug: "drug-interaction-checklist", description: "A practical educational checklist to help shoppers prepare better questions for licensed healthcare professionals.", price: "19.00", originalPrice: null, images: ["https://images.unsplash.com/photo-1511174511562-5f97f4f4e0c8?w=900&q=80"], categorySlug: "care-guides", stock: 50, featured: true, trending: false, badge: null, tags: ["drugs", "medicine guide", "safety"] },
];

const defaultSettings = {
  siteName: "feel peptides",
  siteTagline: "Peptides, meds, and health essentials.",
  siteDescription: "Explore peptides, medicines, wellness products, drug information, med guides, and health-focused support in one trusted shop.",
  primaryColor: "#2563eb",
  secondaryColor: "#111827",
  defaultTheme: "light",
  heroHeadline: "Shop Health.\nFeel Better.",
  heroSubtitle: "Peptides, meds, medicines, wellness products, and health resources with clear product details and supportive checkout options.",
  heroImage: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1800&q=80",
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
