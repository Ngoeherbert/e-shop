"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, MessageCircle, Tag, Bitcoin } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart";
import { useSiteStore } from "@/store/site";
import { formatPrice } from "@/lib/utils";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";

export function CartPageClient() {
  const { items, removeItem, updateQuantity, clearCart, promoCode, promoDiscount, applyPromoCode, removePromoCode, getSubtotal, getTotal } = useCartStore();
  const { settings } = useSiteStore();
  const [promoInput, setPromoInput] = useState("");

  const subtotal = getSubtotal();
  const total = getTotal();
  const discount = subtotal - total;

  const handlePromo = () => {
    const code = promoInput.toUpperCase();
    if (code === settings.announcementCode) {
      applyPromoCode(code, settings.announcementDiscount);
      toast.success(`${settings.announcementDiscount}% discount applied!`);
      setPromoInput("");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const orderSummary = items.map((i) => `${i.name} x${i.quantity} - ${formatPrice(i.price * i.quantity)}`).join("\n");
  const orderMessage = encodeURIComponent(
    `Hi! I want to place an order:\n\n${orderSummary}\n\nSubtotal: ${formatPrice(subtotal)}${promoCode ? `\nPromo: ${promoCode} (-${promoDiscount}%)` : ""}\nTotal: ${formatPrice(total)}\n\nI can pay with crypto via NOWPayments. If crypto is not convenient, please send another payment option on WhatsApp.`
  );

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreBreadcrumb items={[{ label: "Cart" }]} />
        <div className="py-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Start Shopping
          </Link>
        </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <StoreBreadcrumb items={[{ label: "Cart" }]} />
      <h1 className="text-3xl font-black text-gray-900 mb-8">
        Shopping Cart{" "}
        <span className="text-gray-400 font-normal text-xl">({items.length} {items.length === 1 ? "item" : "items"})</span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl p-4 sm:flex-row sm:items-center"
              >
                <Link href={`/products/${item.id}`}>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-50 shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gray-50 shrink-0 flex items-center justify-center text-gray-300">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">{item.category}</p>
                  <Link href={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-gray-700 line-clamp-2">
                    {item.name}
                  </Link>
                  <p className="font-bold text-gray-900 mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden self-start shrink-0">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 hover:bg-gray-50 text-gray-600">−</button>
                  <span className="px-4 py-2 font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 hover:bg-gray-50 text-gray-600">+</button>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                  )}
                </div>
                <button
                  onClick={() => { removeItem(item.id); toast.success("Removed from cart"); }}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({promoCode})</span>
                  <span className="font-medium">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <div className="relative flex-1">
                <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="promo-input"
                  type="text"
                  placeholder="Promo code"
                  value={promoCode || promoInput}
                  onChange={(e) => !promoCode && setPromoInput(e.target.value)}
                  readOnly={!!promoCode}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none"
                />
              </div>
              {promoCode ? (
                <button onClick={removePromoCode} className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                  Remove
                </button>
              ) : (
                <button onClick={handlePromo} className="px-4 py-2.5 text-white text-sm font-medium rounded-lg" style={{ backgroundColor: settings.primaryColor }}>
                  Apply
                </button>
              )}
            </div>

            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose a payment option:</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <a
                  href={settings.nowPaymentsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <Bitcoin size={16} /> Pay Crypto
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}?text=${orderMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={clearCart}
                  className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp Help
                </a>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500">
                Pay securely with crypto through NOWPayments. Don&apos;t have crypto? Message us on WhatsApp and we&apos;ll send another payment option.
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            No payment is processed on this platform. You&apos;ll be connected with the seller directly to complete your purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
