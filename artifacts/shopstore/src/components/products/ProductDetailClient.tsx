"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, ShoppingCart, MessageCircle, Bitcoin,
  ChevronLeft, ChevronRight, Star, Minus, Plus
} from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSiteStore } from "@/store/site";
import { formatPrice } from "@/lib/utils";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { ProductCard } from "./ProductCard";
import { BlogSection } from "@/components/home/BlogSection";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  originalPrice?: string | null;
  images: string[] | null;
  badge?: string | null;
  trending?: boolean | null;
  featured?: boolean | null;
  stock: number | null;
  tags?: string[] | null;
  category?: { id: number; name: string; slug: string } | null;
}

interface Props {
  product: Product;
  settings: { whatsappNumber?: string | null; nowPaymentsUrl?: string | null } | null;
  relatedProducts?: Product[];
}

export function ProductDetailClient({ product, settings, relatedProducts = [] }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted } = useWishlistStore();
  const { settings: storeSettings } = useSiteStore();
  const wishlisted = isWishlisted(product.id);

  const images = (product.images as string[] | null) ?? [];
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discountPercent = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null;
  const inStock = (product.stock ?? 0) > 0;

  const siteSettings = {
    whatsappNumber: settings?.whatsappNumber ?? storeSettings.whatsappNumber,
    nowPaymentsUrl: settings?.nowPaymentsUrl ?? storeSettings.nowPaymentsUrl,
  };

  const orderMessage = encodeURIComponent(
    `Hi! I want to order: ${product.name} (x${quantity}) - Total: ${formatPrice(price * quantity)}. I need another payment option if crypto is not available.`
  );

  const handleAddToCart = () => {
    if (!inStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price,
        originalPrice: originalPrice ?? undefined,
        image: images[0] ?? "",
        category: product.category?.name,
      });
    }
    toast.success(`${product.name} added to cart!`);
  };

  const breadcrumbs = [
    { label: "Shop", href: "/shop" },
    ...(product.category ? [{ label: product.category.name, href: `/categories/${product.category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StoreBreadcrumb items={breadcrumbs} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative overflow-hidden rounded-3xl bg-gray-50 aspect-square mb-4">
            {images[imageIndex] ? (
              <AnimatePresence mode="wait">
                <motion.img
                  key={imageIndex}
                  src={images[imageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <ShoppingCart size={56} />
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  disabled={imageIndex === 0}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 rounded-full shadow-md hover:bg-white transition-colors"
                  disabled={imageIndex === images.length - 1}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
            {discountPercent && (
              <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {discountPercent}% OFF
                </span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImageIndex(i)}
                  className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === imageIndex ? "border-red-500 shadow-md" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">{product.category?.name}</p>
            <h1 className="text-3xl font-black text-gray-900 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-2 mt-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} size={16} className={s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              ))}
              <span className="text-sm text-gray-500">(24 reviews)</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-4xl font-black text-gray-900">{formatPrice(price)}</span>
            {originalPrice && (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-lg">{formatPrice(originalPrice)}</span>
                {discountPercent && (
                  <span className="text-green-600 text-sm font-semibold">Save {discountPercent}%</span>
                )}
              </div>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
            >
              <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"}`} />
              {inStock ? `In Stock (${product.stock})` : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-5 font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock ?? 10, q + 1))}
                className="p-3 hover:bg-gray-50 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddToCart}
              disabled={!inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white font-semibold rounded-xl disabled:opacity-50 transition-opacity hover:opacity-90"
              style={{ backgroundColor: storeSettings.primaryColor }}
            >
              <ShoppingCart size={18} />
              Add to Cart
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                try {
                  await toggleItem(product.id);
                  toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to update wishlist");
                }
              }}
              className={`p-3.5 rounded-xl border-2 transition-all ${wishlisted ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-gray-300"}`}
            >
              <Heart size={18} className={wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
            </motion.button>
          </div>

          <div>
            <p className="font-semibold text-gray-900 mb-3">Payment and support:</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <a
                href={siteSettings.nowPaymentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Bitcoin size={16} /> Pay Crypto
              </a>
              <a
                href={`https://wa.me/${siteSettings.whatsappNumber.replace(/\D/g, "")}?text=${orderMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp Help
              </a>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Crypto checkout is available through NOWPayments. If you do not have crypto, message us on WhatsApp and we&apos;ll share another payment option.
            </p>
          </div>

          {Array.isArray(product.tags) && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {(product.tags as string[]).map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: storeSettings.primaryColor }}>You may also like</p>
              <h2 className="mt-2 text-3xl font-black text-gray-900">Similar products</h2>
              <p className="mt-1 text-sm text-gray-500">More picks from {product.category?.name ?? "our store"}.</p>
            </div>
            <Link href={product.category ? `/categories/${product.category.slug}` : "/shop"} className="hidden text-sm font-semibold text-gray-700 hover:text-gray-900 sm:inline-flex">
              View more
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                id={related.id}
                name={related.name}
                slug={related.slug}
                price={parseFloat(related.price)}
                originalPrice={related.originalPrice ? parseFloat(related.originalPrice) : null}
                images={(related.images as string[]) ?? []}
                category={related.category?.name}
                badge={related.badge}
                trending={related.trending ?? false}
                featured={related.featured ?? false}
                stock={related.stock ?? 0}
              />
            ))}
          </div>
        </section>
      )}

      <BlogSection />
    </div>
  );
}
