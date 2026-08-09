import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useContent } from "@/lib/site-content";
import { toast } from "sonner";

export function Footer() {
  const { content } = useContent();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const saved = localStorage.getItem("latte-loca-newsletter") || "[]";
      const list = JSON.parse(saved);
      list.push({ email, date: new Date().toISOString() });
      localStorage.setItem("latte-loca-newsletter", JSON.stringify(list));
    } catch {
      /* ignore */
    }

    setSubscribed(true);
    toast.success("Welcome to the LATTE LOCA Coffee Club!", {
      description: "You will receive our Friday roasts & news.",
    });
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-card/40 pt-16 pb-12 text-muted-foreground">
      <div className="mx-auto max-w-6xl px-5 grid gap-10 md:grid-cols-4">
        {/* Brand & Mission */}
        <div className="space-y-4 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <img
              src="/latte-loca-logo.png"
              alt="Latte Loca"
              className="h-10 w-auto object-contain rounded-full border border-primary/30"
            />
            <span className="font-display text-2xl font-extrabold tracking-[0.18em] text-cream">
              {content.brand}
            </span>
          </Link>
          <p className="text-sm leading-relaxed">
            Specialty coffee roasted in small batches. Craft brewing, velvety micro-foams, and an atmosphere built for good conversations.
          </p>
          <div className="flex gap-3 text-cream">
            {["Instagram", "Twitter", "Facebook"].map((soc) => (
              <a
                key={soc}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info(`Follow us on ${soc}! @lattelocacoffee`);
                }}
                className="rounded-full border border-border p-2 text-xs transition-colors hover:border-primary hover:text-accent"
              >
                {soc}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="transition-colors hover:text-cream">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="transition-colors hover:text-cream">
                Full Menu
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-cream">
                Our Story & Beans
              </Link>
            </li>
            <li>
              <Link to="/reviews" className="transition-colors hover:text-cream">
                Customer Reviews
              </Link>
            </li>
            <li>
              <Link to="/offers" className="transition-colors hover:text-cream">
                Special Offers & Combos
              </Link>
            </li>
            <li>
              <Link to="/orders" className="transition-colors hover:text-cream">
                Track My Order
              </Link>
            </li>
          </ul>
        </div>

        {/* Opening Hours & Contact */}
        <div className="space-y-3">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
            Visit Us
          </h4>
          <p className="text-sm">
            <strong className="text-cream">Address:</strong> 104 Roastery Lane, Brew District
          </p>
          <p className="text-sm">
            <strong className="text-cream">Mon - Fri:</strong> 7:00 AM - 8:00 PM
          </p>
          <p className="text-sm">
            <strong className="text-cream">Sat - Sun:</strong> 8:00 AM - 9:00 PM
          </p>
          <p className="text-sm">
            <strong className="text-cream">Phone:</strong> +1 (555) 273-9824
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h4 className="font-display text-sm font-bold uppercase tracking-wider text-cream">
            Fresh Roasts Newsletter
          </h4>
          <p className="text-xs text-muted-foreground">
            {content.footerNote}
          </p>
          {subscribed ? (
            <div className="rounded-xl border border-primary/40 bg-primary/10 p-3 text-xs text-accent">
              ✓ You are subscribed! Check your inbox this Friday.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 mt-12 pt-6 border-t border-border/50 text-center text-xs text-foreground/40">
        <p>© {new Date().getFullYear()} LATTE LOCA Coffee Bar. All rights reserved.</p>
      </div>
    </footer>
  );
}
