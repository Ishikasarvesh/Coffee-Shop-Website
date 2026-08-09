import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useReviews } from "@/hooks/useReviews";
import { ReviewFormModal } from "@/components/ReviewFormModal";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews & Ratings — BODRIN Coffee" },
      {
        name: "description",
        content:
          "Read genuine reviews and ratings from BODRIN coffee shop guests. Share your own coffee experience.",
      },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { reviews, stats } = useReviews();
  const [filterStar, setFilterStar] = useState<number | "all">("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const filteredReviews = useMemo(() => {
    if (filterStar === "all") return reviews;
    return reviews.filter((r) => r.rating === filterStar);
  }, [reviews, filterStar]);

  return (
    <div className="min-h-screen hero-surface py-12 px-5">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Guest Testimonials
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
            Customer Reviews & Ratings
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            See what coffee lovers say about our specialty roasts, atmosphere, and barista craft.
          </p>
        </div>

        {/* Rating Breakdown Overview Box */}
        <div className="rounded-3xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur grid md:grid-cols-3 gap-8 items-center">
          {/* Average Score */}
          <div className="text-center md:border-r border-border/50 md:pr-6 space-y-2">
            <span className="font-display text-6xl font-extrabold text-cream">
              {stats.average}
            </span>
            <div className="text-amber-400 text-xl font-bold">★★★★★</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats.count} verified customer reviews
            </p>
          </div>

          {/* Star Distribution Bars */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage = stats.count > 0 ? (count / stats.count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-medium text-cream flex items-center gap-1">
                    {star} <span className="text-amber-400">★</span>
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-background overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Write a Review Action */}
          <div className="text-center md:border-l border-border/50 md:pl-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-cream">Have you visited us?</h3>
            <p className="text-xs text-muted-foreground">
              We'd love to hear your feedback on your latest cup or visit!
            </p>
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
            >
              ✍️ Write a Review
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-between items-center border-b border-border/50 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs text-muted-foreground font-medium mr-2">Filter:</span>
            <button
              onClick={() => setFilterStar("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filterStar === "all"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card/40 text-muted-foreground hover:text-cream"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                onClick={() => setFilterStar(star)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  filterStar === star
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card/40 text-muted-foreground hover:text-cream"
                }`}
              >
                {star} ★ ({stats.distribution[star as 1 | 2 | 3 | 4 | 5] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Review Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredReviews.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-muted-foreground text-xs">
              No reviews found for this rating filter.
            </div>
          ) : (
            filteredReviews.map((r) => (
              <div
                key={r.id}
                className="rounded-3xl border border-border bg-card/60 p-6 backdrop-blur space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold text-sm">
                      {"★".repeat(r.rating)}
                    </span>
                    <span className="text-xs text-cream font-bold">{r.rating}.0</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                </div>
                <h4 className="font-display text-lg font-bold text-cream">{r.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground">{r.comment}</p>
                <div className="pt-3 border-t border-border/40 flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-cream">{r.author}</span>
                    {r.verified && (
                      <span className="text-[10px] bg-primary/20 text-accent px-2 py-0.5 rounded-full">
                        ✓ Verified Guest
                      </span>
                    )}
                  </div>
                  {r.favoriteDrink && (
                    <span className="text-[11px] text-accent font-medium">
                      ☕ {r.favoriteDrink}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Submission Modal */}
      <ReviewFormModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
      />
    </div>
  );
}
