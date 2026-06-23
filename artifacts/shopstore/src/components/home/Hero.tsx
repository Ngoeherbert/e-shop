"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSiteStore } from "@/store/site";

interface HeroProps {
  settings: {
    heroHeadline?: string | null;
    heroSubtitle?: string | null;
    heroImage?: string | null;
    primaryColor?: string;
    siteName?: string;
  } | null;
}

export function Hero({ settings }: HeroProps) {
  const { settings: storeSettings } = useSiteStore();
  const headline = settings?.heroHeadline ?? storeSettings.heroHeadline;
  const subtitle = settings?.heroSubtitle ?? storeSettings.heroSubtitle;
  const heroImage = settings?.heroImage ?? storeSettings.heroImage;
  const primaryColor = settings?.primaryColor ?? storeSettings.primaryColor;

  return (
    <div className="relative overflow-hidden h-[540px] md:h-[600px] bg-gray-900">
      {heroImage ? (
        <img
          src={heroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-800 to-gray-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {headline?.split("\n").map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </motion.h1>
          <motion.p
            className="text-white/90 text-lg mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/shop"
              className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor }}
            >
              Shop Spare Parts <ArrowRight size={18} />
            </Link>
            <Link
              href="/shop?featured=true"
              className="px-6 py-3 text-white font-semibold rounded-lg border-2 border-white/40 hover:bg-white/10 transition-all hover:scale-105 active:scale-95"
            >
              Featured Parts
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
