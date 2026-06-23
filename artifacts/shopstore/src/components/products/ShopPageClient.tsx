"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useSiteStore } from "@/store/site";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { CustomSelect } from "@/components/ui/custom-select";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string | null;
  images: string[] | null;
  badge?: string | null;
  trending?: boolean | null;
  featured?: boolean | null;
  stock?: number | null;
  category?: Category | null;
  categoryId?: number | null;
}

interface Props {
  products: Product[];
  categories: Category[];
  searchQuery?: string;
  categoryFilter?: string;
}

const PRODUCTS_PER_PAGE = 12;

const sortOptions = [
  {
    value: "featured",
    label: "Featured",
    description: "Recommended picks first",
  },
  { value: "newest", label: "Newest", description: "Recently added products" },
  {
    value: "price-asc",
    label: "Price: Low to High",
    description: "Budget-friendly first",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    description: "Premium products first",
  },
];

function getPaginationItems(currentPage: number, totalPages: number) {
  const pages: Array<number | "ellipsis"> = [];
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  pages.push(1);
  if (currentPage > 4) pages.push("ellipsis");

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (currentPage < totalPages - 3) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

export function ShopPageClient({
  products: serverProducts,
  categories: serverCategories,
  searchQuery: initialSearch,
  categoryFilter: initialCategory,
}: Props) {
  const displayProducts = serverProducts;
  const displayCategories = serverCategories;

  const [search, setSearch] = useState(initialSearch ?? "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ?? "all",
  );
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch ?? "");
  const { settings } = useSiteStore();

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: displayProducts.length };
    displayProducts.forEach((p) => {
      if (p.category) {
        counts[p.category.slug] = (counts[p.category.slug] ?? 0) + 1;
      }
    });
    return counts;
  }, [displayProducts]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, sortBy]);

  const filteredProducts = useMemo(() => {
    let result = [...displayProducts];
    if (debouncedSearch) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }
    if (sortBy === "price-asc")
      result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    else if (sortBy === "price-desc")
      result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    else if (sortBy === "newest") result.reverse();
    else result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [displayProducts, debouncedSearch, selectedCategory, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [currentPage, filteredProducts]);

  const firstProductIndex =
    filteredProducts.length === 0
      ? 0
      : (currentPage - 1) * PRODUCTS_PER_PAGE + 1;
  const lastProductIndex = Math.min(
    currentPage * PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );
  const activeSort =
    sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0];

  const goToPage = (page: number) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <StoreBreadcrumb
          items={[
            { label: "Shop", href: "/shop" },
            {
              label:
                selectedCategory !== "all"
                  ? (displayCategories.find((c) => c.slug === selectedCategory)
                      ?.name ?? "Products")
                  : "All Products",
            },
          ]}
        />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">All Products</h1>
            <p className="text-gray-500 text-sm mt-1">
              {filteredProducts.length} products found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <CustomSelect
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              label="Sort by"
              className="min-w-48"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="mb-6">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-4 text-sm outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-2 focus:ring-red-500/20"
                />
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              CATEGORY
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold transition-colors ${selectedCategory === "all" ? "bg-gray-900 text-white shadow-md" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span>All Products</span>
                  <span className="text-xs opacity-70">
                    {categoryCounts.all}
                  </span>
                </button>
              </li>
              {displayCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition-colors ${selectedCategory === cat.slug ? "bg-gray-900 text-white font-semibold shadow-md" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-xs opacity-70">
                      {categoryCounts[cat.slug] ?? 0}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="mb-4 flex flex-col gap-2 rounded-3xl border border-gray-100 bg-white p-4 text-sm text-gray-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing{" "}
              <strong className="text-gray-900">
                {firstProductIndex}-{lastProductIndex}
              </strong>{" "}
              of{" "}
              <strong className="text-gray-900">
                {filteredProducts.length}
              </strong>{" "}
              products
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {PRODUCTS_PER_PAGE} per page
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No products found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-sm text-red-600 underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {paginatedProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      slug={product.slug}
                      price={parseFloat(product.price)}
                      originalPrice={
                        product.originalPrice
                          ? parseFloat(product.originalPrice)
                          : null
                      }
                      images={(product.images as string[]) ?? []}
                      category={product.category?.name}
                      badge={product.badge}
                      trending={product.trending ?? false}
                      stock={product.stock ?? 0}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {filteredProducts.length > PRODUCTS_PER_PAGE && (
            <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-900">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {totalPages}
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                {getPaginationItems(currentPage, totalPages).map(
                  (item, index) =>
                    item === "ellipsis" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-2 text-gray-400"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => goToPage(item)}
                        className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition-all ${currentPage === item ? "text-white shadow-md" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                        style={
                          currentPage === item
                            ? { backgroundColor: settings.primaryColor }
                            : undefined
                        }
                        aria-current={currentPage === item ? "page" : undefined}
                      >
                        {item}
                      </button>
                    ),
                )}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                CATEGORY
              </p>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setMobileFiltersOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-semibold ${selectedCategory === "all" ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span>All Products</span>
                    <span className="text-xs opacity-70">
                      {categoryCounts.all}
                    </span>
                  </button>
                </li>
                {displayCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setMobileFiltersOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm ${selectedCategory === cat.slug ? "bg-gray-900 text-white font-semibold" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs opacity-70">
                        {categoryCounts[cat.slug] ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
