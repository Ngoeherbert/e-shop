import { StoreLayout } from "@/components/layout/StoreLayout";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { BlogSection } from "@/components/home/BlogSection";

export default function BlogPage() {
  return (
    <StoreLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreBreadcrumb items={[{ label: "Blog" }]} />
        <div className="mb-2">
          <h1 className="text-4xl font-black text-gray-900">Health Journal</h1>
          <p className="mt-2 max-w-2xl text-gray-500">Medicine guides, peptide education, drug safety basics, and health product insights from feel peptides.</p>
        </div>
      </div>
      <BlogSection limit={99} />
    </StoreLayout>
  );
}
