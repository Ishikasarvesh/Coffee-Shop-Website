import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

const FAVORITES_KEY = "bodrin-favorites-v1";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleFavorite = useCallback((productId: string, productName?: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];

      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }

      if (productName) {
        if (exists) {
          toast.info(`Removed ${productName} from favorites`);
        } else {
          toast.success(`Saved ${productName} to favorites!`);
        }
      }

      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.includes(productId),
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    favoriteCount: favorites.length,
  };
}
