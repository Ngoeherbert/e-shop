"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { ProductCard } from "@/components/products/ProductCard";
import { useWishlistStore } from "@/store/wishlist";

interface WishlistItem {
  id: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    originalPrice: string | null;
    images: string[] | null;
    badge: string | null;
    trending: boolean | null;
    featured: boolean | null;
    stock: number;
    category?: { name: string } | null;
  } | null;
}

export function WishlistPageClient({ items }: { items: WishlistItem[] }) {
  const { removeItem } = useWishlistStore();
  const products = items.map((item) => item.product).filter((product): product is NonNullable<WishlistItem["product"]> => Boolean(product));

  const handleRemove = async (productId: number) => {
    removeItem(productId);
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).catch(() => null);
    toast.success("Removed from wishlist");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StoreBreadcrumb items={[{ label: "Wishlist" }]} />
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Wishlist</h1>
          <p className="mt-2 text-sm text-gray-500">Keep track of products you want to revisit later.</p>
        </div>
        <div className="hidden rounded-full bg-red-50 p-3 text-red-500 sm:block">
          <Heart className="fill-current" size={24} />
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white py-20 text-center">
          <ShoppingBag size={52} className="mx-auto mb-4 text-gray-200" />
          <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-gray-500">Browse the store and tap the heart icon on products you like.</p>
          <Link href="/shop" className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={parseFloat(product.price)}
                originalPrice={product.originalPrice ? parseFloat(product.originalPrice) : null}
                images={product.images ?? []}
                category={product.category?.name}
                badge={product.badge}
                trending={product.trending ?? false}
                featured={product.featured ?? false}
                stock={product.stock}
              />
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-500 shadow-md transition-transform hover:scale-105"
                aria-label={`Remove ${product.name} from wishlist`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
