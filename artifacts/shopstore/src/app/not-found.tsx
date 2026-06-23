import Link from "next/link";
import { StoreLayout } from "@/components/layout/StoreLayout";

export default function NotFound() {
  return (
    <StoreLayout>
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-8xl font-black text-gray-100 mb-6">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Page not found</h2>
          <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
          <Link href="/" className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
}
