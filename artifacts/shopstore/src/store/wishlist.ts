import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  items: number[];
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  addItem: (id: number) => void;
  removeItem: (id: number) => void;
  toggleItem: (id: number) => Promise<boolean>;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
}

async function syncWishlist(productId: number) {
  const response = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId }),
  });

  if (!response.ok) throw new Error("Wishlist sync failed");
  return (await response.json()) as { wishlisted: boolean };
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      setHasHydrated: (v) => set({ _hasHydrated: v }),

      addItem: (id) =>
        set((state) => ({
          items: state.items.includes(id) ? state.items : [...state.items, id],
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i !== id) })),

      toggleItem: async (id) => {
        const wasWishlisted = get().items.includes(id);
        set((state) => ({
          items: wasWishlisted
            ? state.items.filter((i) => i !== id)
            : [...state.items, id],
        }));

        try {
          const result = await syncWishlist(id);
          set((state) => ({
            items: result.wishlisted
              ? state.items.includes(id)
                ? state.items
                : [...state.items, id]
              : state.items.filter((i) => i !== id),
          }));
          return result.wishlisted;
        } catch {
          // Rollback optimistic update
          set((state) => ({
            items: wasWishlisted
              ? state.items.includes(id)
                ? state.items
                : [...state.items, id]
              : state.items.filter((i) => i !== id),
          }));
          throw new Error("Sign in to save wishlist items.");
        }
      },

      isWishlisted: (id) => get().items.includes(id),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
