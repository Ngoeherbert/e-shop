"use client";

import Link from "next/link";
import { MessageCircle, Bitcoin } from "lucide-react";
import { useSiteStore } from "@/store/site";

export function Footer() {
  const { settings } = useSiteStore();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.siteName} className="h-9 w-auto" />
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: settings.primaryColor }}
                  >
                    {settings.siteName.slice(0, 2).toLowerCase()}
                  </div>
                  <span className="font-semibold text-lg text-white">
                    {settings.siteName.split(" ")[0].toLowerCase()}
                  </span>
                </div>
              )}
            </Link>
            <p className="text-sm leading-relaxed">{settings.siteDescription}</p>
            <div className="flex gap-3 mt-5">
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-green-600 rounded-lg transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={settings.nowPaymentsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-yellow-500 rounded-lg transition-colors"
                aria-label="NOWPayments crypto checkout"
              >
                <Bitcoin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {["All Products", "Electronics", "Fashion", "Home & Living", "Fitness", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/categories/${item.toLowerCase().replace(/\s+/g, "-").replace("&", "")}`}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2.5">
              {[
                { label: "My Profile", href: "/account" },
                { label: "My Orders", href: "/account/orders" },
                { label: "Addresses", href: "/account/addresses" },
                { label: "Wishlist", href: "/wishlist" },
                { label: "Settings", href: "/account/settings" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Contact Us</h4>
            <p className="text-sm mb-4">Pay with crypto through NOWPayments or message us on WhatsApp for another payment option.</p>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle size={15} className="text-green-400" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={settings.nowPaymentsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Bitcoin size={15} className="text-yellow-400" />
                  NOWPayments Crypto
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} {settings.siteName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
