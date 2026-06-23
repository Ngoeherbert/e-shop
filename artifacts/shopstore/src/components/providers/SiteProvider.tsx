"use client";

import { useEffect } from "react";
import { useSiteStore } from "@/store/site";
import { useThemeStore } from "@/store/theme";

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSiteStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", settings.primaryColor);
    root.style.setProperty("--site-primary", settings.primaryColor);
    root.style.setProperty("--site-name", `"${settings.siteName}"`);
    document.title = `${settings.siteName} - ${settings.siteTagline}`;
  }, [settings.primaryColor, settings.siteName, settings.siteTagline]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
