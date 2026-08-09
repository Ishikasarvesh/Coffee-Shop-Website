import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useContent } from "@/lib/site-content";
import { useCart } from "@/hooks/useCart";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { content } = useContent();
  const { itemCount, setIsCartOpen } = useCart();
  const { favoriteCount } = useFavorites();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Reviews", href: "/reviews" },
    { name: "Offers", href: "/offers" },
    { name: "Orders", href: "/orders" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/latte-loca-logo.png"
            alt="Latte Loca"
            className="h-9 w-auto object-contain rounded-full border border-primary/30"
          />
          <span className="font-display text-xl font-extrabold tracking-[0.18em] text-cream sm:text-2xl">
            {content.brand}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-secondary text-accent font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-cream hover:bg-card/40"
                )}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Favorites, Cart, Order Button, Mobile Toggle) */}
        <div className="flex items-center gap-3">
          {/* Favorites link */}
          <Link
            to="/favorites"
            aria-label="View favorite coffees"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-cream transition-transform hover:scale-105 hover:border-primary/50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current"
              strokeWidth={2}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            {favoriteCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {favoriteCount}
              </span>
            )}
          </Link>

          {/* Cart Icon Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label={`View cart (${itemCount} items)`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/40 text-cream transition-transform hover:scale-105 hover:border-primary/50"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-none stroke-current"
              strokeWidth={2}
            >
              <path
                d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.2" />
              <circle cx="18" cy="20" r="1.2" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Order Now button -> navigates to /menu */}
          <Link
            to="/menu"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-105 hover:bg-primary/90 sm:inline-flex"
          >
            {content.navOrder}
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-border text-cream lg:hidden"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" stroke="currentColor" strokeWidth={2}>
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-card/95 px-5 py-4 backdrop-blur lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-2.5 text-base font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-accent font-semibold"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-cream"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="mt-2 pt-2 border-t border-border flex justify-between items-center">
              <Link
                to="/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                ❤️ Saved Favorites ({favoriteCount})
              </Link>
              <Link
                to="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
              >
                Order now →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
