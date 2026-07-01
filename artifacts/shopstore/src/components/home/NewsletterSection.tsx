"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";
import { toast } from "sonner";

interface Props {
  settings: {
    announcementCode?: string | null;
    announcementDiscount?: number | null;
    primaryColor?: string | null;
  } | null;
}

export function NewsletterSection({ settings }: Props) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const promoCode = settings?.announcementCode?.trim();
  const promoDiscount = settings?.announcementDiscount;
  const hasPromo = Boolean(promoCode && typeof promoDiscount === "number" && promoDiscount > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're subscribed! Check your email for updates.");
  };

  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-950 text-white shadow-2xl shadow-gray-950/15"
      >
        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
          <div className="flex flex-col justify-between gap-10">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                <Mail size={14} /> Store updates
              </div>
              <h2 className="max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Get early access to new arrivals and limited offers.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70">
                Join the mailing list for product drops, health-focused shopping updates, and member-only promotions.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-white/75 sm:grid-cols-3">
              {["New product alerts", "Private offers", "No spam"].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3">
                  <CheckCircle2 size={16} className="text-emerald-300" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white p-5 text-gray-950 shadow-xl sm:p-6">
            {hasPromo ? (
              <div className="mb-5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Subscriber offer</p>
                <p className="mt-2 text-2xl font-black text-gray-950">
                  {promoDiscount}% off with <span className="font-mono">{promoCode}</span>
                </p>
              </div>
            ) : null}

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="newsletter-email" className="text-sm font-semibold text-gray-800">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-4 text-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-950/5"
                  required
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-gray-800 active:translate-y-0"
                  style={settings?.primaryColor ? { backgroundColor: settings.primaryColor } : undefined}
                >
                  Join the list <ArrowRight size={17} />
                </button>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800"
              >
                <p className="font-bold">You're on the list.</p>
                <p className="mt-1 text-sm">Check your inbox for the next update.</p>
              </motion.div>
            )}

            <Link href="/shop" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-5 py-4 text-sm font-bold text-gray-900 transition hover:bg-gray-50">
              Shop current deals <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
