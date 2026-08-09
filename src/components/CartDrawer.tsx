import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    discount,
    tax,
    finalTotal,
    appliedOffer,
    promoCode,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    removeItem,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState("");

  // Handle Escape key close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      if (applyPromoCode(inputCode)) {
        setInputCode("");
      }
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-card text-foreground shadow-2xl flex flex-col border-l border-border z-10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-xl font-bold text-cream">Your Order</h2>
              <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Close cart"
              className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-cream transition-transform hover:scale-110"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-secondary/40 text-accent text-3xl">
                  ☕
                </div>
                <h3 className="font-display text-lg font-bold text-cream">Your cart is empty</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Looks like you haven't added any fresh coffee or pastries to your order yet.
                </p>
                <Link
                  to="/menu"
                  onClick={() => setIsCartOpen(false)}
                  className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
                >
                  Browse Coffee Menu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">
                    Order Items
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="flex gap-3 rounded-2xl border border-border/60 bg-background/40 p-3.5 backdrop-blur"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 object-contain shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-display text-sm font-bold text-cream truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label={`Remove ${item.product.name}`}
                          className="text-xs text-muted-foreground hover:text-destructive ml-2"
                        >
                          ✕
                        </button>
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Size: <span className="text-cream">{item.size}</span> · Milk:{" "}
                        <span className="text-cream">{item.milk}</span>
                      </p>
                      {item.extras.length > 0 && (
                        <p className="text-[10px] text-accent mt-0.5 truncate">
                          +{item.extras.map((e) => e.name).join(", ")}
                        </p>
                      )}

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/30">
                        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="text-xs font-bold text-muted-foreground hover:text-cream px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold text-cream">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            className="text-xs font-bold text-muted-foreground hover:text-cream px-1"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-display text-sm font-bold text-cream">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-border bg-card/90 p-6 space-y-4 backdrop-blur">
              {/* Promo Code Form */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs text-accent">
                    <span>
                      Code <strong>{promoCode}</strong> applied!
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-muted-foreground hover:text-cream underline ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCode} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. STUDENT10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-cream uppercase placeholder:normal-case placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-secondary px-3 py-1.5 text-xs font-semibold text-cream hover:bg-secondary/80"
                    >
                      Apply
                    </button>
                  </form>
                )}
              </div>

              {/* Offer Badge Notification */}
              {appliedOffer && (
                <div className="rounded-xl border border-accent/40 bg-accent/10 px-3 py-2 text-xs text-accent flex justify-between items-center">
                  <span>✨ {appliedOffer.title}</span>
                  <span className="font-bold">-{discount > 0 ? `$${discount.toFixed(2)}` : ""}</span>
                </div>
              )}

              {/* Calculation Rows */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-cream font-medium">${subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8.5%)</span>
                  <span className="text-cream font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-cream pt-2 border-t border-border/60">
                  <span>Total</span>
                  <span className="font-display text-xl text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
