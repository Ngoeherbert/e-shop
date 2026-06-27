"use client";

import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";

export default function ProductError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <StoreLayout>
      <main className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-gray-900">We couldn&apos;t load this product</h1>
        <p className="mt-3 text-gray-600">Please try again, or continue browsing ShopStore products.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white">Try again</button>
          <Link href="/shop" className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700">Back to shop</Link>
        </div>
      </main>
    </StoreLayout>
  );
}
