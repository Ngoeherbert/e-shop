import { StoreLayout } from "@/components/layout/StoreLayout";

export default function CategoryLoading() {
  return (
    <StoreLayout>
      <main aria-busy="true">
        <div className="h-52 animate-pulse bg-gray-200" />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </section>
      </main>
    </StoreLayout>
  );
}
