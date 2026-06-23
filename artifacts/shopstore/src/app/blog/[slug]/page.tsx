import { notFound } from "next/navigation";
import { CalendarDays, Clock } from "lucide-react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { StoreBreadcrumb } from "@/components/ui/StoreBreadcrumb";
import { BlogSection } from "@/components/home/BlogSection";
import { getBlogPost } from "@/lib/blog/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <StoreLayout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <StoreBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700">{post.category}</span>
          <span className="inline-flex items-center gap-1"><CalendarDays size={15} /> {post.date}</span>
          <span className="inline-flex items-center gap-1"><Clock size={15} /> {post.readTime}</span>
        </div>
        <h1 className="text-4xl font-black leading-tight text-gray-900 md:text-5xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-8 text-gray-500">{post.excerpt}</p>
        <img src={post.image} alt={post.title} className="mt-8 h-[420px] w-full rounded-3xl object-cover" />
        <div className="prose prose-gray mt-8 max-w-none space-y-5 text-gray-600">
          {post.content.map((paragraph) => (
            <p key={paragraph} className="text-base leading-8">{paragraph}</p>
          ))}
        </div>
      </article>
      <BlogSection />
    </StoreLayout>
  );
}
