"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const testimonials = [
  { id: 1, name: "Sarah Johnson", handle: "@sarahjohnson", avatar: "https://randomuser.me/api/portraits/women/32.jpg", text: "Found brake pads and filters for my sedan in minutes. Fitment notes were clear and delivery was fast!" },
  { id: 2, name: "Mike Chen", handle: "@mikechen", avatar: "https://randomuser.me/api/portraits/men/45.jpg", text: "Great selection for my pickup. The replacement sensors arrived quickly and worked perfectly." },
  { id: 3, name: "Emma Wilson", handle: "@emmawilson", avatar: "https://randomuser.me/api/portraits/women/67.jpg", text: "I compared SUV suspension parts by category and found exactly what my mechanic requested." },
  { id: 4, name: "David Park", handle: "@davidpark", avatar: "https://randomuser.me/api/portraits/men/23.jpg", text: "The classic car parts section helped me source hard-to-find ignition components without hassle." },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500 max-w-xl mx-auto">
            Find reliable parts for sedans, SUVs, trucks, performance builds, EVs, and classic restorations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`;
                  }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                    <CheckCircle2 size={14} className="text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-400">{t.handle}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{t.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
