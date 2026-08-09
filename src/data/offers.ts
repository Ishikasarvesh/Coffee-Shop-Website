export type Offer = {
  id: string;
  code?: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  discountType: "percentage" | "fixed" | "combo";
  discountValue: number; // percentage (e.g. 10 for 10%) or fixed amount (e.g. 2.50)
  minItems?: number;
  applicableCategory?: string;
  tag: string;
  terms: string;
};

export const activeOffers: Offer[] = [
  {
    id: "morning-combo",
    title: "Morning Artisan Combo",
    subtitle: "Coffee + Fresh Pastry Bundle",
    description: "Start your morning with any handcrafted hot coffee paired with a freshly baked french croissant or muffin.",
    badge: "Save $2.50",
    discountType: "combo",
    discountValue: 2.5,
    tag: "Daily 7 AM - 11 AM",
    terms: "Automatically calculated when any coffee and bakery item are added to cart.",
  },
  {
    id: "coffee-duo",
    title: "Coffee Duo Offer",
    subtitle: "Buy 2 Selected Coffees = 10% Off",
    description: "Grab a drink for you and a friend! Enjoy 10% off the total coffee price when ordering 2 or more drinks.",
    badge: "10% OFF",
    discountType: "percentage",
    discountValue: 10,
    minItems: 2,
    tag: "Popular",
    terms: "Applies automatically to beverage items when quantity is 2 or more.",
  },
  {
    id: "weekend-cold",
    title: "Weekend Cold Chill",
    subtitle: "15% Off All Cold Brews & Iced Lattes",
    description: "Beat the heat during weekends. Get 15% discount on 24-Hour Nitro Cold Brew and Iced Caramel Lattes.",
    badge: "15% OFF",
    discountType: "percentage",
    discountValue: 15,
    applicableCategory: "cold",
    tag: "Sat & Sun Special",
    terms: "Valid on all drinks in the Cold Brew & Iced section.",
  },
  {
    id: "student-offer",
    code: "STUDENT10",
    title: "Student Coffee Boost",
    subtitle: "Flat 10% Off with Code: STUDENT10",
    description: "Studying hard? Use code STUDENT10 during checkout to get 10% off your entire coffee shop order.",
    badge: "Code: STUDENT10",
    discountType: "percentage",
    discountValue: 10,
    tag: "Student Special",
    terms: "Enter promo code STUDENT10 in your cart before checking out.",
  },
  {
    id: "welcome-bodrin",
    code: "WELCOMEBODRIN",
    title: "First Time Visitor",
    subtitle: "$3 OFF Orders over $15 with Code: WELCOMEBODRIN",
    description: "Welcome to BODRIN Specialty Coffee! Get an instant $3 discount on your order.",
    badge: "Code: WELCOMEBODRIN",
    discountType: "fixed",
    discountValue: 3.0,
    tag: "New Customer",
    terms: "Valid on orders with subtotal of $15 or higher.",
  },
];
