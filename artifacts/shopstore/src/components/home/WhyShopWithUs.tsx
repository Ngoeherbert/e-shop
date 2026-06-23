"use client";

import { motion } from "framer-motion";
import { Trophy, Truck, RotateCcw, Shield } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Fitment-focused Quality",
    description: "Trusted OEM-style and aftermarket brands selected for dependable repairs.",
  },
  {
    icon: Truck,
    title: "Fast Parts Delivery",
    description: "In-stock service parts are processed quickly so repairs stay on schedule.",
  },
  {
    icon: RotateCcw,
    title: "Easy Fitment Returns",
    description: "Simple returns when a part does not match your vehicle or project.",
  },
  {
    icon: Shield,
    title: "Secure Parts Ordering",
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
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Why buy parts from us?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Find reliable parts for sedans, SUVs, trucks, performance builds, EVs, and classic restorations.
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
