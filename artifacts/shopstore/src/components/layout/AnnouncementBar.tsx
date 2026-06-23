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
        className="text-white text-sm py-2.5 px-4 flex items-center justify-center gap-4 relative"
        style={{ backgroundColor: settings.primaryColor }}
      >
        <p className="text-center">
          <strong>{settings.announcementText.split(" ").slice(0, 2).join(" ")}</strong>{" "}
          {settings.announcementText.split(" ").slice(2).join(" ")}
        </p>
        <button
          className="border border-white/40 text-white text-xs font-medium px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
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
          className="absolute right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
