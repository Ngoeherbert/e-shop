import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SiteSettings {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl: string | null;
  faviconUrl: string | null;
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
  siteName: "feel peptides",
  siteTagline: "Peptides, meds, and health essentials.",
  siteDescription: "Explore peptides, medicines, wellness products, drug information, med guides, and health-focused support in one trusted shop.",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#2563eb",
  secondaryColor: "#111827",
  defaultTheme: "light",
  announcementText: "Pay with crypto via NOWPayments, or message us on WhatsApp for alternate payment options.",
  announcementEnabled: true,
  announcementCode: "HEALTH10",
  announcementDiscount: 10,
  whatsappNumber: "+1234567890",
  nowPaymentsUrl: "https://nowpayments.io/payment/?iid=replace-with-your-invoice",
  heroHeadline: "Shop Health.\nFeel Better.",
  heroSubtitle: "Find peptides, meds, medicines, wellness products, and health resources with clear product details and supportive checkout options.",
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
