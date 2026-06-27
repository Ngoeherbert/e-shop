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
  nowPaymentsUrl: string;
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
  announcementText: "Pay with crypto via NOWPayments, or message us on WhatsApp for alternate payment options.",
  announcementEnabled: true,
  announcementCode: "DRIVE10",
  announcementDiscount: 10,
  whatsappNumber: "+1234567890",
  nowPaymentsUrl: "https://nowpayments.io/payment/?iid=replace-with-your-invoice",
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
