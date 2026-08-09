# LATTE LOCA Coffee Shop — Specialty Coffee Bar Web Application

LATTE LOCA is a specialty coffee shop web application built with React, TypeScript, TanStack Start / TanStack Router, and Tailwind CSS.

## Features

- **Interactive Menu**: Filter by categories (Hot Coffee, Espresso, Cold Brew, Artisanal Tea, Fresh Bakery), instant search, and price/rating sorting.
- **Product Customization**: Select size, milk choice (Whole, Oat, Almond, Coconut, Skim, No Milk), and extra shots/syrups with live price calculations.
- **Cart & Slide-Over Drawer**: Real-time quantity controls, promo code discount engine (`STUDENT10`, `WELCOMELATTE`), automatic combo deal detection (Morning Combo, Coffee Duo, Weekend Cold Special), tax calculations, and persistent state.
- **Multi-Step Checkout**: Customer contact information, delivery/pickup location selection, and payment UI with mock order receipt generation.
- **Order History & Live Status Tracking**: Dynamic status timeline (*Confirmed → Preparing → Ready → Completed*) auto-updating over time with quick re-order capability.
- **Taste Test Quiz**: Interactive roast, milk, temperature, and flavor sliders matching users to recommended drinks.
- **Guest Reviews System**: 5-star distribution chart breakdown, overall rating score, rating filters, and review submission modal.
- **Saved Favorites**: Heart bookmarking on coffee cards with a dedicated collection page.

## Development

Requires Node.js and npm / bun.

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

## Tech Stack

- **Framework**: TanStack Start & TanStack Router
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons, Sonner Toasters
- **State & Storage**: React Context, LocalStorage
