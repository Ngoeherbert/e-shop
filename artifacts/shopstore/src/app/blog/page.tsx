import { StoreLayout } from "@/components/layout/StoreLayout";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { BlogSection } from "@/components/home/BlogSection";

export default function BlogPage() {
  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreBreadcrumb items={[{ label: "Blog" }]} />
        <div className="mb-2">
          <h1 className="text-4xl font-black text-gray-900">Store Journal</h1>
          <p className="mt-2 max-w-2xl text-gray-500">Buying guides, style notes, and product inspiration from the store.</p>
        </div>
      </div>
      <BlogSection limit={99} />
    </StoreLayout>
  );
}
