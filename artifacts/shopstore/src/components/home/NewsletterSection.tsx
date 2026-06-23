"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useSiteStore } from "@/store/site";

interface Props {
  settings: { announcementCode?: string | null; announcementDiscount?: number | null } | null;
}

export function NewsletterSection({ settings }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { settings: storeSettings } = useSiteStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're subscribed! Check your email for your discount code.");
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Get Exclusive Deals</h2>
          <p className="text-gray-500 mb-8">
            Subscribe to our newsletter and get{" "}
            <strong>{storeSettings.announcementDiscount}% off</strong> your first order.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 text-white font-semibold rounded-lg transition-opacity hover:opacity-90 whitespace-nowrap"
                style={{ backgroundColor: storeSettings.primaryColor }}
              >
                Subscribe & Save
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-green-50 border border-green-200 rounded-2xl"
            >
              <p className="text-green-700 font-semibold">
                🎉 Welcome! Use code{" "}
                <span className="font-black">{storeSettings.announcementCode}</span>{" "}
                for {storeSettings.announcementDiscount}% off.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
