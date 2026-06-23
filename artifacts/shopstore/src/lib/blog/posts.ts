export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-everyday-tech",
    title: "How to Choose Everyday Tech That Actually Lasts",
    excerpt: "A practical guide to picking useful gadgets, avoiding clutter, and getting more value from your electronics.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    category: "Buying Guide",
    date: "June 1, 2026",
    readTime: "4 min read",
    content: [
      "Great everyday tech should solve a real problem, fit naturally into your routine, and be easy to maintain. Before buying, think about the moments where your current setup slows you down.",
      "Battery life, warranty coverage, compatibility, and replacement parts matter more than flashy specs. A product that works reliably every day is usually more valuable than one packed with features you never use.",
      "When comparing products, prioritize trusted materials, clear charging standards, and reviews that mention long-term use. This helps you build a setup that stays useful instead of becoming clutter."
    ],
  },
  {
    slug: "style-staples-for-a-simple-wardrobe",
    title: "Style Staples for a Simple, Flexible Wardrobe",
    excerpt: "Build outfits faster with versatile pieces that work across seasons, occasions, and daily routines.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    category: "Style",
    date: "May 28, 2026",
    readTime: "3 min read",
    content: [
      "A flexible wardrobe starts with pieces that mix easily: clean tees, denim, soft knits, practical bags, and accessories that add personality without overpowering the outfit.",
      "Neutral foundations help you get dressed quickly, while one or two statement pieces keep the look fresh. Focus on fit, fabric feel, and how often you can realistically wear each item.",
      "The best staples are the ones you reach for repeatedly. If a piece works with three outfits you already own, it is more likely to become part of your regular rotation."
    ],
  },
  {
    slug: "refresh-your-home-with-small-upgrades",
    title: "Refresh Your Home With Small Upgrades",
    excerpt: "Small decor and comfort updates can make a space feel new without a full renovation.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
    category: "Home",
    date: "May 20, 2026",
    readTime: "5 min read",
    content: [
      "You do not need a major redesign to make a room feel better. Lighting, texture, scent, and storage can dramatically change how a space feels day to day.",
      "Start with the surfaces you see most: bedside tables, entry consoles, desks, and shelves. A vase, candle, tray, or better organizer can make those spots feel intentional.",
      "The goal is to reduce friction and add warmth. Choose items that are both useful and beautiful, especially in rooms you use every morning or evening."
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
