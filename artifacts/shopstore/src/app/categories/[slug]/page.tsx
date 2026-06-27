import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { BlogSection } from "@/components/home/BlogSection";
import { ShopPageClient } from "@/components/products/ShopPageClient";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ensureStoreSeedData } from "@/lib/db/seed";
import { JsonLd, absoluteUrl, buildMetadata, seoDescription } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

const categoryFaqs = (name: string) => [
  { question: `What ${name.toLowerCase()} should I replace first?`, answer: `Start with safety and wear items such as brakes, filters, suspension components, lighting, and fluids before upgrading accessories.` },
  { question: `How do I choose the right ${name.toLowerCase()}?`, answer: "Match the part to your vehicle year, make, model, engine, and OEM reference when available." },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await ensureStoreSeedData();
  const { slug } = await params;
  const category = await db.query.categories.findFirst({ where: eq(categories.slug, slug) }).catch(() => null);
  if (!category) return buildMetadata({ title: "Category Not Found", path: `/categories/${slug}` });
  return buildMetadata({
    title: `${category.name} Parts`,
    description: seoDescription(category.description, `Shop ${category.name.toLowerCase()} at ShopStore, including replacement, maintenance, performance, and accessory parts selected for fitment and reliability.`),
    path: `/categories/${category.slug}`,
    image: category.bannerImage ?? category.image,
  });
}

export default async function CategoryPage({ params }: Props) {
  await ensureStoreSeedData();
  const { slug } = await params;

  const category = await db.query.categories.findFirst({
    where: eq(categories.slug, slug),
  }).catch(() => null);

  if (!category) notFound();

  const categoryProducts = await db.query.products.findMany({
    where: eq(products.categoryId, category.id),
    with: { category: true },
  }).catch(() => []);
  const categoryHeroImage = category.bannerImage ?? category.image;

  return (
    <StoreLayout>
      <JsonLd data={[
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Categories", item: absoluteUrl("/categories") },
            { "@type": "ListItem", position: 3, name: category.name, item: absoluteUrl(`/categories/${category.slug}`) },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: categoryFaqs(category.name).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        },
      ]} />
      <div className="relative h-52 overflow-hidden bg-gray-900">
        {categoryHeroImage && (
          <Image
            src={categoryHeroImage}
            alt={`${category.name} automotive parts category`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
        <div className="relative z-10 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <span className="hover:text-white/90 cursor-pointer">Home</span>
              <span>›</span>
              <span className="hover:text-white/90 cursor-pointer">Categories</span>
              <span>›</span>
              <span className="text-white font-medium">{category.name}</span>
            </div>
            <h1 className="text-4xl font-black text-white">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 mt-2">{category.description}</p>
            )}
          </div>
        </div>
      </div>
      <ShopPageClient products={categoryProducts} categories={[]} categoryFilter={slug} />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="category-faq-heading">
        <h2 id="category-faq-heading" className="text-2xl font-black text-gray-900 mb-6">{category.name} FAQ</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {categoryFaqs(category.name).map((faq) => (
            <article key={faq.question} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="font-bold text-gray-900">{faq.question}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>
      <BlogSection />
    </StoreLayout>
  );
}
