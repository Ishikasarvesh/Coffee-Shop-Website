import { createFileRoute, Link } from "@tanstack/react-router";
import beans from "@/assets/beans.png";
import heroCup from "@/assets/hero-cup.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story & Coffee Craft — BODRIN" },
      {
        name: "description",
        content:
          "Learn about BODRIN coffee philosophy: single-origin direct farm sourcing, micro-batch drum roasting, and creating a warm cafe space.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen hero-surface py-12 px-5 overflow-hidden">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Our Coffee Philosophy
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-6xl leading-tight">
            Crafting Extraordinary Coffee Moments
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            BODRIN began with a simple belief: coffee isn't just a daily caffeine fix — it's an artisanal culinary journey connecting farm soil, skilled roasting, and human warmth.
          </p>
        </div>

        {/* Feature Grid Story */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="rounded-full bg-accent/20 px-3 py-1 text-xs font-bold text-accent">
              🌱 Direct Trade Sourcing
            </span>
            <h2 className="font-display text-3xl font-bold text-cream">
              Ethical Beans, Exceptional Quality
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We travel directly to high-altitude smallholder farms in Ethiopia, Colombia, and Guatemala. By purchasing directly from origin micro-lots, we support sustainable farming practices while securing beans rich with distinct natural sweetness, vibrant berry notes, and clean acidity.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-2xl border border-border bg-card/40 p-4">
                <span className="font-display text-3xl font-bold text-cream">100%</span>
                <p className="text-xs text-muted-foreground mt-1">Single-Origin Arabica</p>
              </div>
              <div className="rounded-2xl border border-border bg-card/40 p-4">
                <span className="font-display text-3xl font-bold text-accent">88+</span>
                <p className="text-xs text-muted-foreground mt-1">SCA Cupping Score</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <img
              src={beans}
              alt="Roasted Arabica beans"
              className="animate-float w-4/5 max-w-md drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Roasting Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1 relative flex justify-center">
            <img
              src={heroCup}
              alt="Handcrafted cup of coffee"
              className="animate-float w-3/4 max-w-sm drop-shadow-2xl"
            />
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary">
              🔥 Small-Batch Roasting
            </span>
            <h2 className="font-display text-3xl font-bold text-cream">
              Precision In Every Single Batch
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our master roasters adjust temperature curves down to the second on custom cast-iron drum roasters. We roast in small 5kg batches every morning so every cup served is at peak flavor maturity — preserving sweet caramelization without harsh bitterness.
            </p>
            <ul className="space-y-2 text-xs text-cream">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Daily morning roast profiles
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Precision TDS extraction ratio
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Organic micro-steamed milk texture
              </li>
            </ul>
          </div>
        </div>

        {/* Atmosphere Banner */}
        <div className="rounded-[2.5rem] border border-border bg-card/60 p-8 md:p-12 text-center space-y-6 backdrop-blur">
          <h2 className="font-display text-3xl font-extrabold text-cream sm:text-4xl">
            A Room That Warmly Welcomes You
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Soft ambient warm lighting, vinyl records playing slow jazz, comfortable leather armchairs, and baristas who genuinely care about dialing in your brew. Whether you stay for 10 minutes or 3 hours, BODRIN feels like home.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              to="/menu"
              className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] hover:scale-105 transition-transform"
            >
              Order Your Coffee Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
