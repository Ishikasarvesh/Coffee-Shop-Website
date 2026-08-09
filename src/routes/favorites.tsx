import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { products, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Saved Favorites — BODRIN Coffee" },
      {
        name: "description",
        content: "View and order your bookmarked favorite coffee drinks and bakery treats.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [favorites]);

  return (
    <div className="min-h-screen hero-surface py-12 px-5">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Saved Coffee Collection
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
            Your Favorite Drinks ({favoriteProducts.length})
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Quickly re-order the coffees and pastries you love most with a single tap.
          </p>
        </div>

        {/* Favorite Grid or Empty State */}
        {favoriteProducts.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-4 backdrop-blur">
            <div className="text-5xl">❤️</div>
            <h3 className="font-display text-xl font-bold text-cream">No favorites saved yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Tap the heart icon on any coffee or bakery item in our menu to save it here for quick access!
            </p>
            <Link
              to="/menu"
              className="inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:scale-105 transition-transform"
            >
              Explore Menu & Save Favorites
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCustomize={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
