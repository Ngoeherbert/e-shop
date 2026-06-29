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
    slug: "how-to-read-medicine-labels",
    title: "How to Read Medicine Labels Before You Buy",
    excerpt: "Learn the key label details to review when comparing medicines, meds, drugs, and health products online.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80",
    category: "Medicine Guide",
    date: "June 1, 2026",
    readTime: "4 min read",
    content: [
      "Medicine labels help you understand active ingredients, dosage directions, warnings, storage requirements, and expiration dates before you place an order.",
      "When comparing drugs or meds, review ingredient strength, route of use, contraindications, and whether a licensed clinician should be consulted first.",
      "Always follow local laws and professional medical guidance. Online health information can support safer shopping, but it should not replace personalized care from a qualified provider."
    ],
  },
  {
    slug: "peptides-and-wellness-basics",
    title: "Peptides and Wellness: The Basics Shoppers Ask About",
    excerpt: "A beginner-friendly overview of peptides, research context, product quality signals, and health-related buying considerations.",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&q=80",
    category: "Peptides",
    date: "May 28, 2026",
    readTime: "3 min read",
    content: [
      "Peptides are short chains of amino acids discussed across wellness, research, and medical contexts. Product purpose, purity, handling, and documentation all matter.",
      "Look for clear product names, transparent descriptions, storage guidance, and responsible language that avoids unsupported health claims.",
      "If you are considering any peptide or medicine for personal health use, consult a qualified healthcare professional and follow applicable regulations."
    ],
  },
  {
    slug: "building-a-health-products-checklist",
    title: "Build a Safer Health Products Checklist",
    excerpt: "Use this checklist for medicines, wellness products, supplements, and drug-related purchases before checkout.",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=80",
    category: "Health",
    date: "May 20, 2026",
    readTime: "5 min read",
    content: [
      "A practical checklist starts with product identity, intended use, ingredients, warnings, expiration dates, storage needs, and seller support options.",
      "For medicines and drugs, add extra review steps: confirm dosage form, read safety warnings, check interactions, and ask a clinician if you are unsure.",
      "Responsible shopping means pairing convenient online checkout with accurate information, careful documentation, and professional health advice when needed."
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug) ?? null;
}
