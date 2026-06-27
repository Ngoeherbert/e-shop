"use client";

import Link from "next/link";
import { Heart, ShoppingCart, User, Menu, X, Search, ChevronDown, Settings } from "lucide-react";
import { useState, useEffect, type CSSProperties, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart";
import { useSiteStore } from "@/store/site";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

interface NavCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface NavCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface NavCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/deals", label: "Deals" },
  { href: "/blog", label: "Blog" },
];

export function Navbar({ categories = [] }: { categories?: NavCategory[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const itemCount = useCartStore((s) => s.getItemCount());
  const { settings } = useSiteStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const submitSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    submitSearch(searchQuery);
  };

  return (
    <>
      <motion.nav
        className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={settings.siteName}>
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-9 w-9 sm:w-auto rounded-lg object-contain" />
              ) : (
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {settings.siteName.slice(0, 2).toLowerCase()}
                </div>
              )}
              <span className="hidden sm:inline font-semibold text-lg text-gray-900">
                {settings.siteName}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors relative group"
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{ backgroundColor: settings.primaryColor }}
                  />
                </Link>
              ))}

              <div className="group relative">
                <Link href="/categories" className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Categories <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-1/2 top-full z-50 w-[720px] -translate-x-1/2 pt-5 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Shop by category</p>
                        <h3 className="font-bold text-gray-900">Explore every department</h3>
                      </div>
                      <Link href="/categories" className="text-sm font-semibold" style={{ color: settings.primaryColor }}>View all</Link>
                    </div>
                    {categories.length === 0 ? (
                      <p className="rounded-2xl bg-gray-50 p-6 text-center text-sm text-gray-500">No categories have been added yet.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-3">
                        {categories.map((category) => (
                          <Link key={category.id} href={`/categories/${category.slug}`} className="group/item flex gap-3 rounded-2xl p-2 transition-colors hover:bg-gray-50">
                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              {category.image ? <img src={category.image} alt={category.name} className="h-full w-full object-cover" /> : null}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-gray-900 group-hover/item:text-gray-700">{category.name}</p>
                              <p className="line-clamp-2 text-xs leading-5 text-gray-500">{category.description}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <form onSubmit={handleSearch} className="hidden lg:flex w-56 items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-gray-300 focus-within:bg-white">
                <Search size={16} className="text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                />
              </form>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors lg:hidden"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link href="/wishlist" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Wishlist">
                <Heart size={20} />
              </Link>

              <Link href="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors" aria-label="Cart">
                <ShoppingCart size={20} />
                {isMounted && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </Link>

              {session ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/account"
                    className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:bg-gray-100"
                    aria-label="User profile"
                    title={session.user.name ?? "User profile"}
                  >
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name ?? "User profile"} className="h-full w-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </Link>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white">
                    Login
                  </Link>
                </div>
              )}

              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {[...navLinks, { href: "/categories", label: "Categories" }].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-medium text-gray-700 py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t flex flex-col gap-2">
                  {session ? (
                    <>
                      <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}>{session.user.image ? <img src={session.user.image} alt={session.user.name ?? "Profile"} className="h-7 w-7 rounded-full object-cover" /> : <User size={17} />} Profile</Link>
                      <Link href="/account/settings" className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}><Settings size={17} /> Settings</Link>
                      <Link href="/wishlist" className="flex items-center gap-2 text-sm font-medium text-gray-700 py-2" onClick={() => setMobileOpen(false)}><Heart size={17} /> Wishlist</Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-gray-900 px-4 py-3 text-sm font-semibold text-white"
                        onClick={() => setMobileOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="text-sm font-medium text-gray-700 py-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20 px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="bg-white rounded-3xl p-6 w-full max-w-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:bg-white focus-within:ring-2" style={{ "--tw-ring-color": `${settings.primaryColor}33` } as CSSProperties}>
                <Search size={20} className="ml-2 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, deals..."
                  className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                />
                <button type="submit" className="rounded-xl px-5 py-3 font-semibold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: settings.primaryColor }}>
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
