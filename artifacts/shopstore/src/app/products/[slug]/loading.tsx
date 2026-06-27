import { StoreLayout } from "@/components/layout/StoreLayout";

export default function ProductLoading() {
  return (
    <StoreLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" aria-busy="true">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-gray-100" />
          <div className="space-y-5">
            <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-40 animate-pulse rounded bg-gray-100" />
            <div className="h-24 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-12 w-full animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </main>
    </StoreLayout>
  );
}
