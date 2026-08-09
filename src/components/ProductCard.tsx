import { useState } from "react";
import { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  onCustomize: (product: Product) => void;
};

export function ProductCard({ product, onCustomize }: ProductCardProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [popped, setPopped] = useState(false);

  const fav = isFavorite(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    setPopped(true);
    setTimeout(() => setPopped(false), 450);
  };

  return (
    <article
      onClick={() => onCustomize(product)}
      className="group relative cursor-pointer rounded-3xl border border-border bg-card/70 p-6 pt-14 text-center backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-[var(--shadow-glow)]"
    >
      {/* Heart Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(product.id, product.name);
        }}
        aria-label={`Favorite ${product.name}`}
        className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-background/60 text-cream border border-border/50 backdrop-blur transition-transform hover:scale-110"
      >
        <svg
          viewBox="0 0 24 24"
          className={cn(
            "h-4 w-4 transition-colors",
            fav ? "fill-accent stroke-accent" : "fill-none stroke-current"
          )}
          strokeWidth={2}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </button>

      {/* Steam Effect & Cup Image */}
      <div className="relative mx-auto -mt-24 mb-4 w-28">
        <span className="absolute left-1/2 top-0 h-6 w-1.5 -translate-x-1/2 rounded-full bg-cream/50 opacity-0 group-hover:animate-steam" />
        <img
          src={product.image}
          alt={`${product.name} cup`}
          loading="lazy"
          width={400}
          height={400}
          className="w-full object-contain transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 drop-shadow-lg"
        />
        <span className="absolute -right-1 bottom-1 rounded-md bg-cream px-1.5 py-0.5 text-xs font-bold text-primary-foreground">
          {product.rating} ★
        </span>
      </div>

      {/* Product Details */}
      <div className="space-y-1">
        <div className="flex flex-wrap justify-center gap-1 mb-2">
          {product.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider"
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="font-display text-xl font-bold text-cream group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Price & Action */}
      <div className="mt-5 flex items-center justify-between pt-2 border-t border-border/40">
        <span className="font-display text-2xl font-bold text-cream">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(product);
            }}
            className="text-xs text-muted-foreground hover:text-accent underline hidden sm:inline"
          >
            Customize
          </button>
          <button
            onClick={handleQuickAdd}
            aria-label={`Quick add ${product.name} to cart`}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground transition-transform shadow-md",
              popped ? "scale-125 rotate-90" : "hover:scale-110"
            )}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
