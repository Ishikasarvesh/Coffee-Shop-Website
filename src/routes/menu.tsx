import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { products, ProductCategory, categoryLabels, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { useFavorites } from "@/hooks/useFavorites";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — BODRIN Coffee Shop" },
      {
        name: "description",
        content:
          "Browse the complete BODRIN specialty coffee menu: espresso, cappuccinos, silky lattes, cold brew, matcha, and fresh French bakery pastries.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { favorites } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all" | "favorites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category Filter
      if (selectedCategory === "favorites") {
        if (!favorites.includes(p.id)) return false;
      } else if (selectedCategory !== "all") {
        if (p.category !== selectedCategory) return false;
      }

      // Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesTag) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // default order
    });
  }, [selectedCategory, searchQuery, sortBy, favorites]);

  const categories: (ProductCategory | "all" | "favorites")[] = [
    "all",
    "hot",
    "espresso",
    "cold",
    "tea",
    "pastries",
    "favorites",
  ];

  return (
    <div className="min-h-screen hero-surface py-12 px-5">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Page Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Handcrafted Menu
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
            Pick Your Coffee & Pastries
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Single-origin espresso, micro-steamed silky lattes, draught cold brew, and fresh artisan baked goods.
          </p>
        </div>

        {/* Controls: Search Bar & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/60 p-4 rounded-3xl border border-border backdrop-blur">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search coffee, tea, pastries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-border bg-background/80 pl-10 pr-8 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-cream"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-muted-foreground font-medium shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-full border border-border bg-background px-4 py-2 text-xs text-cream focus:border-primary focus:outline-none"
            >
              <option value="featured" className="bg-card text-cream">Featured</option>
              <option value="rating" className="bg-card text-cream">Highest Rated ★</option>
              <option value="price-low" className="bg-card text-cream">Price: Low to High</option>
              <option value="price-high" className="bg-card text-cream">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            const label = cat === "favorites" ? `❤️ Saved (${favorites.length})` : categoryLabels[cat];
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "border border-border bg-card/40 text-muted-foreground hover:border-primary/50 hover:text-cream"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-4">
            <div className="text-4xl">🔍</div>
            <h3 className="font-display text-xl font-bold text-cream">No matching items found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              We couldn't find any coffee or pastry matching "{searchQuery}". Try clearing search or selecting another category.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-md hover:scale-105"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Customization Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
