"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, Settings,
  LogOut, Store, BarChart3, Menu
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";
import { useSiteStore } from "@/store/site";
import { toast } from "sonner";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Store },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/admin/dashboard";
  const router = useRouter();
  const { data: session } = useSession();
  const { settings } = useSiteStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    router.push("/");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: settings.primaryColor }}>
            {settings.siteName.slice(0, 2).toLowerCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight truncate max-w-36">{settings.siteName}</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin") || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all whitespace-nowrap ${
                active
                  ? "text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
              style={active ? { backgroundColor: settings.primaryColor } : {}}
            >
              <item.icon size={17} className="shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 mb-1 transition-colors whitespace-nowrap">
          <Store size={17} className="shrink-0" /> <span className="truncate">View Store</span>
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap">
          <LogOut size={17} className="shrink-0" /> <span className="truncate">Sign Out</span>
        </button>
        {session && (
          <div className="mt-3 px-3 py-2.5 bg-gray-50 rounded-xl">
            <p className="text-xs font-medium text-gray-900 truncate">{session.user.name}</p>
            <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex w-56 bg-white border-r border-gray-100 flex-col fixed top-0 bottom-0 left-0 z-30">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
            <motion.div initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }} className="w-56 bg-white h-full" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-56">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 lg:hidden sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <span className="font-semibold text-gray-900 flex-1 min-w-0 truncate">{settings.siteName} Admin</span>
        </div>
        <main className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto overflow-x-hidden">
          <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
