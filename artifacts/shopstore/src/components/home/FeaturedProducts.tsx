"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { useSiteStore } from "@/store/site";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  images: string[] | null;
  badge?: string | null;
  trending?: boolean | null;
  featured?: boolean | null;
  stock?: number | null;
  category?: { name: string } | null;
}

interface Props {
  products: Product[];
}

export function FeaturedProducts({ products }: Props) {
  const { settings } = useSiteStore();
  const displayProducts = products;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <h2 className="text-4xl font-bold text-gray-900">Featured Spare Parts</h2>
            <p className="text-gray-500 mt-2">Popular replacement parts selected for fit, quality, and value</p>
          </div>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
            style={{ color: settings.primaryColor }}
          >
            View All <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={parseFloat(product.price)}
                originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : null}
                images={(product.images as string[]) ?? []}
                category={product.category?.name}
                badge={product.badge}
                trending={product.trending ?? false}
                featured={product.featured ?? false}
                stock={product.stock ?? 0}
              />
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium"
            style={{ backgroundColor: settings.primaryColor }}
          >
            View All Parts <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
