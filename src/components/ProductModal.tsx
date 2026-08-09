import { useState, useEffect } from "react";
import { Product, ProductExtra, ProductSize, MilkOption } from "@/data/products";
import { useCart } from "@/hooks/useCart";

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<ProductSize>("Medium");
  const [selectedMilk, setSelectedMilk] = useState<MilkOption>("Whole Milk");
  const [selectedExtras, setSelectedExtras] = useState<ProductExtra[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]?.size || "Medium");
      setSelectedMilk(product.availableMilk[0] || "Whole Milk");
      setSelectedExtras([]);
      setQuantity(1);
    }
  }, [product]);

  // Handle Escape Key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && product) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const sizeExtra = product.sizes.find((s) => s.size === selectedSize)?.extraPrice || 0;
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const unitPrice = product.price + sizeExtra + extrasTotal;
  const totalPrice = Number((unitPrice * quantity).toFixed(2));

  const toggleExtra = (extra: ProductExtra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id)
        ? prev.filter((e) => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize, selectedMilk, selectedExtras, quantity);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-cream transition-transform hover:scale-110"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex gap-4 items-center">
          <img
            src={product.image}
            alt={product.name}
            className="h-24 w-24 object-contain drop-shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-accent uppercase">
                {product.category}
              </span>
              <span className="text-xs text-cream font-bold">★ {product.rating}</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-cream mt-1">{product.name}</h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Customization Options */}
        <div className="mt-6 space-y-5 border-t border-border/50 pt-4">
          {/* Size Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
              Select Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setSelectedSize(s.size)}
                  className={`rounded-2xl border p-3 text-center transition-all ${
                    selectedSize === s.size
                      ? "border-primary bg-primary/20 text-cream font-bold shadow-sm"
                      : "border-border/60 bg-background/50 text-muted-foreground hover:border-border"
                  }`}
                >
                  <div className="text-sm">{s.size}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {s.extraPrice > 0 ? `+$${s.extraPrice.toFixed(2)}` : "Base price"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Milk Selector */}
          {product.availableMilk.length > 0 && product.availableMilk[0] !== "No Milk" && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
                Milk Choice
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.availableMilk.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMilk(m)}
                    className={`rounded-xl border px-3 py-2 text-xs transition-all ${
                      selectedMilk === m
                        ? "border-primary bg-primary/20 text-cream font-semibold"
                        : "border-border/60 bg-background/50 text-muted-foreground hover:border-border"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Extras */}
          {product.availableExtras.length > 0 && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-accent block mb-2">
                Customize & Add-Ons
              </label>
              <div className="space-y-2">
                {product.availableExtras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <label
                      key={extra.id}
                      onClick={() => toggleExtra(extra)}
                      className={`flex items-center justify-between rounded-xl border p-2.5 text-xs cursor-pointer transition-all ${
                        isChecked
                          ? "border-primary bg-primary/10 text-cream font-medium"
                          : "border-border/60 bg-background/30 text-muted-foreground hover:bg-background/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-primary h-4 w-4"
                        />
                        <span>{extra.name}</span>
                      </div>
                      <span className="font-semibold text-cream">+${extra.price.toFixed(2)}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between border-t border-border/50 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Quantity</span>
            <div className="flex items-center gap-3 rounded-full border border-border bg-background px-3 py-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-lg font-bold text-muted-foreground hover:text-cream px-1"
              >
                -
              </button>
              <span className="text-sm font-bold text-cream min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-lg font-bold text-muted-foreground hover:text-cream px-1"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
          <div>
            <span className="text-xs text-muted-foreground block">Total Price</span>
            <span className="font-display text-2xl font-bold text-cream">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleAddToCart}
            className="rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-105"
          >
            Add to Cart (${totalPrice.toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
}
