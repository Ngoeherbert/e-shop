"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteStore } from "@/store/site";

export function AnnouncementBar() {
  const { settings, dismissedAnnouncement, dismissAnnouncement } = useSiteStore();

  if (!settings.announcementEnabled || dismissedAnnouncement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="relative flex flex-col items-center justify-center gap-2 px-10 py-3 text-center text-sm text-white sm:flex-row sm:gap-4 sm:px-4 sm:py-2.5"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <p className="text-center">
          <strong>{settings.announcementText.split(" ").slice(0, 2).join(" ")}</strong>{" "}
          {settings.announcementText.split(" ").slice(2).join(" ")}
        </p>
        <button
          className="shrink-0 rounded-md border border-white/40 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10"
          onClick={() => {
            const el = document.getElementById("promo-input");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              (el as HTMLInputElement).value = settings.announcementCode;
              (el as HTMLInputElement).focus();
            }
          }}
        >
          Claim Deal
        </button>
        <button
          onClick={dismissAnnouncement}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
