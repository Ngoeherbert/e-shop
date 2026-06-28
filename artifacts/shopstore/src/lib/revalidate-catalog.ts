import { revalidatePath } from "next/cache";

const CATALOG_PATHS = [
  "/",
  "/shop",
  "/categories",
  "/deals",
  "/admin/products",
  "/admin/categories",
];

export function revalidateCatalogPaths() {
  for (const path of CATALOG_PATHS) {
    revalidatePath(path);
  }
  revalidatePath("/products/[slug]", "page");
  revalidatePath("/categories/[slug]", "page");
}
