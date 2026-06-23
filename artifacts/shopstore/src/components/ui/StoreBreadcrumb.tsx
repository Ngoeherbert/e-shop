"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface StoreBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function StoreBreadcrumb({ items, className }: StoreBreadcrumbProps) {
  const all = [{ label: "Home", href: "/" }, ...items];

  return (
    <motion.nav
      aria-label="Breadcrumb"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex items-center gap-1 text-sm text-gray-500 mb-6", className)}
    >
      <ol className="flex items-center flex-wrap gap-1">
        {all.map((item, i) => {
          const isLast = i === all.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight
                  size={14}
                  className="text-gray-300 shrink-0"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span
                  className="font-medium text-gray-800 truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href!}
                  className="hover:text-gray-900 transition-colors flex items-center gap-1 hover:underline underline-offset-2"
                >
                  {i === 0 && <Home size={13} className="shrink-0" />}
                  <span>{i === 0 ? "" : item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
