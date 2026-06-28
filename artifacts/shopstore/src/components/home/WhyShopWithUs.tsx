"use client";

import { motion } from "framer-motion";
import { Trophy, Truck, RotateCcw, Shield } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Health-focused Quality",
    description: "Carefully presented peptides, medicines, wellness products, and health essentials with clear product details.",
  },
  {
    icon: Truck,
    title: "Fast Health Delivery",
    description: "In-stock health products are processed quickly with support-focused checkout options.",
  },
  {
    icon: RotateCcw,
    title: "Helpful Product Support",
    description: "Clear support when a health product, med guide, or wellness item needs follow-up.",
  },
  {
    icon: Shield,
    title: "Secure Health Ordering",
    description: "Your privacy and security are our top priority. Safe and protected.",
  },
];

export function WhyShopWithUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Why buy from feel peptides?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find peptides, medicines, meds, wellness products, drug information, and health resources with responsible support.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow"
            >
              <div className="p-3 bg-gray-50 rounded-xl shrink-0">
                <feature.icon size={24} className="text-gray-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
