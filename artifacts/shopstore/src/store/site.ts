import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  defaultTheme: "light" | "dark";
  announcementText: string;
  announcementEnabled: boolean;
  announcementCode: string;
  announcementDiscount: number;
  whatsappNumber: string;
  telegramUsername: string;
  instagramUsername: string;
  facebookPageId: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImage: string | null;
}

interface SiteStore {
  settings: SiteSettings;
  dismissedAnnouncement: boolean;
  updateSettings: (settings: Partial<SiteSettings>) => void;
  dismissAnnouncement: () => void;
  resetAnnouncement: () => void;
}

const defaultSettings: SiteSettings = {
  siteName: "AutoParts Hub",
  siteTagline: "Quality Spare Parts for Every Drive.",
  siteDescription: "Find quality OEM-style and aftermarket spare parts for your daily driver, work truck, family SUV, or weekend project car.",
  logoUrl: null,
  primaryColor: "#dc2626",
  secondaryColor: "#111827",
  defaultTheme: "light",
  announcementText: "Get 10% off brake pads, filters, and service parts with code DRIVE10!",
  announcementEnabled: true,
  announcementCode: "DRIVE10",
  announcementDiscount: 10,
  whatsappNumber: "+1234567890",
  telegramUsername: "autopartshub",
  instagramUsername: "autopartshub",
  facebookPageId: "autopartshub",
  heroHeadline: "Find Parts.\nDrive Better.",
  heroSubtitle: "Find quality OEM-style and aftermarket spare parts for your daily driver, work truck, family SUV, or weekend project car.",
  heroImage: null,
};

export const useSiteStore = create<SiteStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      dismissedAnnouncement: false,

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      dismissAnnouncement: () => set({ dismissedAnnouncement: true }),
      resetAnnouncement: () => set({ dismissedAnnouncement: false }),
    }),
    {
      name: "site-settings",
    }
  )
);
