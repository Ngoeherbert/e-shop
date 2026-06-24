"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useSiteStore } from "@/store/site";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number | null;
  images: string[];
  category?: string | null;
  badge?: string | null;
  trending?: boolean;
  featured?: boolean;
  stock?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  originalPrice,
  images,
  category,
  badge,
  trending,
  stock = 1,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isWishlisted, _hasHydrated } = useWishlistStore();
  const { settings } = useSiteStore();
  const wishlisted = _hasHydrated && isWishlisted(id);

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (stock <= 0) {
      toast.error("Out of stock");
      return;
    }
    addItem({
      id,
      name,
      price,
      originalPrice: originalPrice ?? undefined,
      image: images[0] ?? "",
      category: category ?? undefined,
    });
    toast.success("Added to cart!", { duration: 2000 });
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleItem(id);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist", { duration: 1500 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to update wishlist");
    }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link href={`/products/${slug}`} className="group block">
        <div className="relative bg-gray-50 rounded-2xl overflow-hidden mb-3">
          <div className="relative aspect-square">
            {images[0] ? (
              <Image
                src={images[0]}
                alt={`${name} automotive spare part`}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <ShoppingCart className="text-gray-400" size={40} />
              </div>
            )}
          </div>

          {(badge || discountPercent || trending) && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercent && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {discountPercent}% OFF
                </span>
              )}
              {badge && !discountPercent && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {badge}
                </span>
              )}
              {trending && !discountPercent && !badge && (
                <span
                  className="text-white text-xs font-bold px-2 py-1 rounded-full"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  Trending
                </span>
              )}
            </div>
          )}

          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleWishlist}
              className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
              aria-label="Wishlist"
            >
              <Heart
                size={16}
                className={
                  wishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                }
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
              aria-label="Add to cart"
            >
              <ShoppingCart size={16} className="text-gray-600" />
            </button>
          </div>

          {stock === 0 && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
            {category}
          </p>
          <h3 className="font-medium text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && originalPrice > price && (
              <span className="text-gray-400 text-sm line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
