"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useSiteStore } from "@/store/site";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";

interface Product {
  id: number; name: string; slug: string; price: string; originalPrice?: string | null;
  images: string[] | null; badge?: string | null; trending?: boolean | null; stock?: number | null;
  category?: { name: string } | null;
}

export function DealsPageClient({ products }: { products: Product[] }) {
  const { settings } = useSiteStore();
  const displayProducts = products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StoreBreadcrumb items={[{ label: "Deals" }]} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${settings.primaryColor}15` }}>
            <Tag size={20} style={{ color: settings.primaryColor }} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Today's Deals</h1>
        </div>
        <p className="text-gray-500">{displayProducts.length} exclusive deals — limited time only!</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {displayProducts.map((product, i) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
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
              stock={product.stock ?? 0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
