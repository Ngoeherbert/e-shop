"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Props {
  categories: Category[];
  limit?: number;
}

export function CategoryGrid({ categories, limit }: Props) {
  const displayCategories = typeof limit === "number" ? categories.slice(0, limit) : categories;
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Shop Health Categories</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find reliable parts for sedans, SUVs, trucks, performance builds, EVs, and classic restorations.
          </p>
        </motion.div>

        {displayCategories.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 py-12 text-center text-sm text-gray-500">
            No categories have been added yet.
          </div>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square mb-3">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-4xl text-gray-400">{cat.name[0]}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
