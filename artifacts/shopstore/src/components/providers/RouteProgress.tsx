"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSiteStore } from "@/store/site";
import { WifiOff } from "lucide-react";

function isModifiedEvent(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
}

export function RouteProgress() {
  const [loading, setLoading] = useState(false);
  const [slowNetwork, setSlowNetwork] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { settings } = useSiteStore();

  useEffect(() => {
    setLoading(false);
    setSlowNetwork(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isModifiedEvent(event)) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (`${url.pathname}${url.search}` === `${window.location.pathname}${window.location.search}`) return;
      setLoading(true);
      setSlowNetwork(false);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setSlowNetwork(true), 8000);
    };

    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("click", onClick, true);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (slowNetwork) {
    return (
      <div className="slow-network-panel fixed inset-0 z-[250] flex items-center justify-center p-6 text-center">
        <div className="max-w-md rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur">
          <WifiOff className="mx-auto mb-4 h-12 w-12" />
          <h2 className="mb-2 text-2xl font-bold">Site cannot be reached</h2>
          <p className="mb-6 text-sm leading-6 text-white/80">Your network is taking longer than expected. Please check your internet connection and try again.</p>
          <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-white/90">Retry</button>
        </div>
      </div>
    );
  }

  return loading ? (
    <div className="fixed left-0 right-0 top-0 z-[200] h-1 overflow-hidden bg-transparent">
      <div className="route-progress-bar h-full w-1/3 rounded-r-full" style={{ backgroundColor: settings.primaryColor }} />
    </div>
  ) : null;
}
