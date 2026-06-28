"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { blogPosts } from "@/lib/blog/posts";
import { useSiteStore } from "@/store/site";

export function BlogSection({ limit = 3 }: { limit?: number }) {
  const { settings } = useSiteStore();
  const posts = blogPosts.slice(0, limit);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: settings.primaryColor }}>Health Journal</p>
            <h2 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">Ideas, guides, and inspiration</h2>
            <p className="mt-2 max-w-2xl text-gray-500">Helpful reads for choosing products, styling your space, and getting more from your favorites.</p>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 hover:opacity-70">
            View all posts <ArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-transform hover:-translate-y-1"
            >
              <Link href={`/blog/${post.slug}`}>
                <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700">{post.category}</span>
                    <CalendarDays size={13} />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="line-clamp-2 text-lg font-bold text-gray-900">{post.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-500">{post.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold" style={{ color: settings.primaryColor }}>
                    Read more <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
