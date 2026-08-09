import { useState, useEffect } from "react";
import { useReviews } from "@/hooks/useReviews";
import { products } from "@/data/products";
import { toast } from "sonner";

type ReviewFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function ReviewFormModal({ isOpen, onClose }: ReviewFormModalProps) {
  const { addReview } = useReviews();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [favoriteDrink, setFavoriteDrink] = useState(products[0]?.name || "Classic Cappuccino");

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a review headline");
      return;
    }
    if (!comment.trim() || comment.length < 10) {
      toast.error("Please write a review of at least 10 characters");
      return;
    }

    addReview({
      author,
      rating,
      title,
      comment,
      favoriteDrink,
    });

    onClose();
    setAuthor("");
    setTitle("");
    setComment("");
    setRating(5);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close review dialog"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary text-cream transition-transform hover:scale-110"
        >
          ✕
        </button>

        <h2 className="font-display text-2xl font-bold text-cream">Write a Customer Review</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Share your experience with the LATTE LOCA coffee community.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Star Rating Interactive Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
              Your Overall Rating
            </label>
            <div className="flex gap-2 items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition-transform hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      (hoverRating || rating) >= star ? "text-amber-400" : "text-border"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
              <span className="text-sm font-bold text-cream ml-2">{rating}.0 / 5.0</span>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="text-xs text-cream block mb-1 font-medium">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Favorite Drink Selector */}
          <div>
            <label className="text-xs text-cream block mb-1 font-medium">Favorite Coffee / Pastry</label>
            <select
              value={favoriteDrink}
              onChange={(e) => setFavoriteDrink(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream focus:border-primary focus:outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.name} className="bg-card text-cream">
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Review Title */}
          <div>
            <label className="text-xs text-cream block mb-1 font-medium">Review Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Phenomenal roast and warm ambience!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="text-xs text-cream block mb-1 font-medium">Your Review</label>
            <textarea
              rows={3}
              required
              placeholder="Tell us what you loved about the roast, flavor, baristas, or atmosphere..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-cream hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:scale-105"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
