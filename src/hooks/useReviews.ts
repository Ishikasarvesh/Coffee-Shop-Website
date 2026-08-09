import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

export type Review = {
  id: string;
  author: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  favoriteDrink?: string;
  date: string;
  verified?: boolean;
};

export const initialReviews: Review[] = [
  {
    id: "rev-1",
    author: "Elena Rostova",
    rating: 5,
    title: "Unmatched cappuccino micro-foam!",
    comment: "BODRIN has ruined all other coffee shops for me. The cappuccino milk texture is pure silk and the espresso flavor notes are subtly floral with zero bitterness.",
    favoriteDrink: "Classic Cappuccino",
    date: "2 days ago",
    verified: true,
  },
  {
    id: "rev-2",
    author: "Marcus Chen",
    rating: 5,
    title: "Best Nitro Cold Brew in town",
    comment: "The 24-hour nitro cold brew cascading texture is incredible. Perfect atmosphere for focused morning work or catchups with friends.",
    favoriteDrink: "24-Hour Nitro Cold Brew",
    date: "5 days ago",
    verified: true,
  },
  {
    id: "rev-3",
    author: "Sophia Sterling",
    rating: 5,
    title: "Oat milk latte perfection",
    comment: "Their oat milk latte paired with the french almond croissant is a ritual for me every weekend. Staff is super warm and helpful!",
    favoriteDrink: "Silky Velvet Latte",
    date: "1 week ago",
    verified: true,
  },
  {
    id: "rev-4",
    author: "David Miller",
    rating: 4,
    title: "Indulgent Dark Chocolate Mocha",
    comment: "Real Belgian chocolate makes a massive difference. Highly recommended if you love rich, dark cocoa coffee combinations.",
    favoriteDrink: "Dark Chocolate Mocha",
    date: "2 weeks ago",
    verified: true,
  },
];

const REVIEWS_KEY = "bodrin-reviews-v1";

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(REVIEWS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const addReview = useCallback((newReview: Omit<Review, "id" | "date" | "verified">) => {
    const reviewItem: Review = {
      ...newReview,
      id: `rev-${Date.now()}`,
      date: "Just now",
      verified: true,
    };

    setReviews((prev) => {
      const next = [reviewItem, ...prev];
      try {
        localStorage.setItem(REVIEWS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });

    toast.success("Thank you for your review!", {
      description: "Your review has been published.",
    });
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { average: 5.0, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = Number((sum / total).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      distribution[star] += 1;
    });

    return { average, count: total, distribution };
  }, [reviews]);

  return {
    reviews,
    addReview,
    stats,
  };
}
