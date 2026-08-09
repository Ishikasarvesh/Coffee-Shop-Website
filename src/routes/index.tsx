import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Editable } from "@/components/Editable";
import { useContent } from "@/lib/site-content";
import { products, Product } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";
import { ProductModal } from "@/components/ProductModal";
import { calculateRecommendation, TasteQuizState } from "@/data/taste-test";
import { useCart } from "@/hooks/useCart";
import { useReviews } from "@/hooks/useReviews";
import { activeOffers } from "@/data/offers";
import heroCup from "@/assets/hero-cup.png";
import beans from "@/assets/beans.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BODRIN Coffee — Specialty Coffee Bar & Fresh Roasts" },
      {
        name: "description",
        content:
          "Small-batch espresso, silky lattes and dark mochas at BODRIN. Take the taste test, browse our full menu, and order fresh coffee online.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { content, editing } = useContent();
  const { addItem } = useCart();
  const { reviews } = useReviews();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Taste Quiz State
  const [roastVal, setRoastVal] = useState(50);
  const [milkVal, setMilkVal] = useState(60);
  const [tempVal, setTempVal] = useState<"hot" | "cold">("hot");
  const [flavorVal, setFlavorVal] = useState<"classic" | "sweet" | "chocolate" | "nutty">("classic");

  const quizState: TasteQuizState = {
    strength: roastVal > 66 ? "strong" : roastVal < 34 ? "light" : "medium",
    milk: milkVal < 20 ? "none" : milkVal > 70 ? "oat" : "dairy",
    temperature: tempVal,
    flavor: flavorVal,
  };

  const matchResult = calculateRecommendation(quizState);

  const topDrinks = products.slice(0, 3);

  return (
    <div className="hero-surface min-h-screen overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-accent backdrop-blur">
            ✨ Handcrafted Small-Batch Roasts
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
            <Editable path="heroTitle" value={content.heroTitle} />
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
            <Editable path="heroBody" value={content.heroBody} />
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-105"
            >
              <Editable path="heroCta" value={content.heroCta} />
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-medium text-cream backdrop-blur transition-all hover:border-primary/50 hover:bg-card/70"
            >
              Our Coffee Story
            </Link>
          </div>
        </div>

        {/* Hero Visual artwork with subtle floating animation */}
        <div className="relative">
          <span className="font-display pointer-events-none absolute -left-6 top-16 select-none text-[10rem] font-extrabold leading-none text-foreground/5 lg:text-[14rem]">
            TOP
          </span>
          <img
            src={heroCup}
            alt="Takeaway coffee cup with a caramel coffee splash"
            width={1200}
            height={1408}
            className="animate-float relative mx-auto w-[78%] max-w-md drop-shadow-2xl lg:w-full"
          />
        </div>
      </section>

      {/* FEATURED DRINKS / TODAY'S TOP THREE */}
      <section id="menu" className="mx-auto max-w-6xl px-5 py-16">
        <div className="text-center space-y-2 mb-10">
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            <Editable path="menuKicker" value={content.menuKicker} />
          </p>
          <h2 className="font-display text-3xl font-extrabold text-cream sm:text-4xl">
            Customer Favorites
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Handcrafted with single-origin beans, organic micro-steamed milk, and velvety smooth foam.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {topDrinks.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onCustomize={(prod) => setSelectedProduct(prod)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-cream hover:border-primary hover:text-accent transition-all"
          >
            <span>Explore Full Coffee & Bakery Menu ({products.length} items)</span>
            <span>→</span>
          </Link>
        </div>

        {editing && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Tip: every highlighted word on this page can be rewritten — changes are saved in your browser.
          </p>
        )}
      </section>

      {/* OFFERS BANNER PROMO */}
      <section className="mx-auto max-w-6xl px-5 py-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/40 bg-gradient-to-r from-card via-card/90 to-secondary p-8 backdrop-blur shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
                🔥 Active Promotion
              </span>
              <h3 className="font-display text-2xl font-bold text-cream">
                {activeOffers[0]?.title}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md">
                {activeOffers[0]?.description}
              </p>
            </div>
            <Link
              to="/offers"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-md hover:scale-105 transition-transform shrink-0"
            >
              View All Offers & Combos
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION PREVIEW */}
      <section className="relative mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-center text-3xl font-extrabold text-cream sm:text-4xl">
          <Editable path="aboutTitle" value={content.aboutTitle} />
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {content.perks.map((p, i) => (
            <div
              key={p.id}
              className="relative flex min-w-0 gap-4 rounded-3xl border border-border/40 bg-card/40 p-6 backdrop-blur transition-all hover:border-primary/40"
            >
              <span className="font-display shrink-0 text-5xl font-extrabold leading-none text-foreground/10">
                0{i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-lg font-bold text-cream">
                  <Editable path={`perks.${i}.title`} value={p.title} />
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <Editable path={`perks.${i}.body`} value={p.body} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TASTE TEST RECOMMENDATION ENGINE */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="relative grid gap-8 overflow-hidden rounded-[2rem] border border-border bg-card/60 p-8 backdrop-blur md:grid-cols-[1.2fr_1fr] md:p-12">
          <div className="relative z-10 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">
                Interactive Taste Test
              </span>
              <h2 className="font-display text-3xl font-extrabold text-cream sm:text-4xl mt-1">
                <Editable path="quizTitle" value={content.quizTitle} />
              </h2>
            </div>

            {/* Sliders & Controls */}
            <div className="space-y-5 max-w-md">
              {/* Roast Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-cream mb-1">
                  <span>Roast Intensity</span>
                  <span className="text-accent">
                    {roastVal < 34 ? "Light & Floral" : roastVal > 66 ? "Dark & Bold" : "Medium Roasted"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={roastVal}
                  onChange={(e) => setRoastVal(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Light</span>
                  <span>Medium</span>
                  <span>Dark</span>
                </div>
              </div>

              {/* Milk Slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-cream mb-1">
                  <span>Milk Preference</span>
                  <span className="text-accent">
                    {milkVal < 20 ? "No Milk" : milkVal > 70 ? "Oat / Plant Milk" : "Whole Milk"}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={milkVal}
                  onChange={(e) => setMilkVal(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>Black</span>
                  <span>Creamy</span>
                  <span>Plant Milk</span>
                </div>
              </div>

              {/* Temp & Flavor Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Temperature</label>
                  <div className="flex rounded-xl border border-border bg-background/50 p-1">
                    <button
                      type="button"
                      onClick={() => setTempVal("hot")}
                      className={`flex-1 py-1 text-xs rounded-lg font-semibold transition-all ${
                        tempVal === "hot" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      🔥 Hot
                    </button>
                    <button
                      type="button"
                      onClick={() => setTempVal("cold")}
                      className={`flex-1 py-1 text-xs rounded-lg font-semibold transition-all ${
                        tempVal === "cold" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      }`}
                    >
                      ❄️ Iced
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-muted-foreground block mb-1">Flavor Notes</label>
                  <select
                    value={flavorVal}
                    onChange={(e) => setFlavorVal(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-cream focus:outline-none"
                  >
                    <option value="classic" className="bg-card">Classic Espresso</option>
                    <option value="sweet" className="bg-card">Sweet Caramel</option>
                    <option value="chocolate" className="bg-card">Belgian Chocolate</option>
                    <option value="nutty" className="bg-card">Toasted Almond</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Recommendation Result Card */}
            <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] text-accent font-bold uppercase">
                    Your {matchResult.matchPercentage}% Match
                  </span>
                  <h3 className="font-display text-xl font-bold text-cream">
                    {matchResult.product.name}
                  </h3>
                </div>
                <span className="font-display text-xl font-bold text-cream">
                  ${matchResult.product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {matchResult.reason}
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() =>
                    addItem(
                      matchResult.product,
                      matchResult.recommendedSize,
                      matchResult.recommendedMilk as any
                    )
                  }
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md transition-transform hover:scale-105"
                >
                  <Editable path="quizCta" value={content.quizCta} /> (${matchResult.product.price.toFixed(2)})
                </button>
                <button
                  onClick={() => setSelectedProduct(matchResult.product)}
                  className="text-xs text-cream hover:underline"
                >
                  Customize Drink
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <img
              src={beans}
              alt="Roasted coffee beans"
              loading="lazy"
              width={928}
              height={720}
              className="animate-float mx-auto w-2/3 max-w-xs self-center md:w-full md:max-w-none drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* REVIEWS PREVIEW */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              Real Guest Experiences
            </span>
            <h2 className="font-display text-3xl font-extrabold text-cream sm:text-4xl mt-1">
              Loved by Coffee Enthusiasts
            </h2>
          </div>
          <Link
            to="/reviews"
            className="text-sm font-semibold text-accent hover:underline flex items-center gap-1"
          >
            <span>Read all reviews ({reviews.length})</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="rounded-3xl border border-border bg-card/50 p-6 backdrop-blur space-y-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-amber-400 font-bold text-sm">
                  {"★".repeat(r.rating)}
                </span>
                <span className="text-[11px] text-muted-foreground">{r.date}</span>
              </div>
              <h4 className="font-display text-base font-bold text-cream">{r.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                "{r.comment}"
              </p>
              <div className="pt-2 border-t border-border/40 flex justify-between items-center text-xs">
                <span className="font-semibold text-cream">{r.author}</span>
                {r.favoriteDrink && (
                  <span className="text-[10px] text-accent font-medium">
                    ☕ {r.favoriteDrink}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Customization Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
