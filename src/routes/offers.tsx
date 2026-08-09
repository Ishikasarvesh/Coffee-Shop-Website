import { createFileRoute, Link } from "@tanstack/react-router";
import { activeOffers, Offer } from "@/data/offers";
import { useCart } from "@/hooks/useCart";
import { products } from "@/data/products";
import { toast } from "sonner";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Special Offers & Promotions — BODRIN Coffee" },
      {
        name: "description",
        content:
          "Save on your favorite coffee & bakery combos! Explore Morning Artisan Combos, Coffee Duos, Weekend Cold Brew specials, and promo codes.",
      },
    ],
  }),
  component: OffersPage,
});

function OffersPage() {
  const { addItem, applyPromoCode, setIsCartOpen } = useCart();

  const handleClaimOffer = (offer: Offer) => {
    if (offer.code) {
      applyPromoCode(offer.code);
      setIsCartOpen(true);
    } else if (offer.id === "morning-combo") {
      // Add coffee + pastry combo directly
      const coffee = products.find((p) => p.id === "cappuccino") || products[0];
      const pastry = products.find((p) => p.id === "almond-croissant") || products[9];
      addItem(coffee);
      addItem(pastry);
      toast.success("Added Morning Artisan Combo to your cart! ($2.50 discount applied)", {
        description: `${coffee.name} + ${pastry.name}`,
      });
      setIsCartOpen(true);
    } else if (offer.id === "coffee-duo") {
      const c1 = products[0];
      const c2 = products[1];
      addItem(c1);
      addItem(c2);
      toast.success("Added Coffee Duo to your cart! (10% discount applied)");
      setIsCartOpen(true);
    } else {
      toast.info(`Offer ${offer.title} active! Browse menu items to redeem.`);
    }
  };

  return (
    <div className="min-h-screen hero-surface py-12 px-5">
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Promotions & Combos
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
            Special Coffee Deals
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Treat yourself or share with friends. Automatic discounts apply directly at checkout!
          </p>
        </div>

        {/* Promo Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="relative flex flex-col justify-between rounded-3xl border border-border bg-card/60 p-6 backdrop-blur space-y-6 hover:border-primary/50 transition-all hover:shadow-[var(--shadow-glow)]"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                    {offer.tag}
                  </span>
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-extrabold text-primary-foreground shadow-sm">
                    {offer.badge}
                  </span>
                </div>
                <h3 className="font-display text-2xl font-bold text-cream pt-1">
                  {offer.title}
                </h3>
                <p className="text-xs font-semibold text-accent">{offer.subtitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-4">
                <span className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {offer.terms}
                </span>
                <button
                  onClick={() => handleClaimOffer(offer)}
                  className="rounded-full bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-105 transition-transform shrink-0"
                >
                  {offer.code ? `Copy Code: ${offer.code}` : "Claim Combo Deal"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Banner CTA */}
        <div className="rounded-3xl border border-primary/40 bg-gradient-to-r from-card to-secondary p-8 text-center space-y-4">
          <h2 className="font-display text-2xl font-bold text-cream">Ready to order your brew?</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Discounts will be calculated automatically in your shopping cart.
          </p>
          <Link
            to="/menu"
            className="inline-block rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
          >
            Explore Full Menu →
          </Link>
        </div>
      </div>
    </div>
  );
}
