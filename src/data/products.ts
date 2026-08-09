import cupCappuccino from "@/assets/cup-cappuccino.png";
import cupLatte from "@/assets/cup-latte.png";
import cupMocha from "@/assets/cup-mocha.png";
import heroCup from "@/assets/hero-cup.png";

export type ProductCategory = "espresso" | "hot" | "cold" | "tea" | "pastries";

export type ProductSize = "Small" | "Medium" | "Large";
export type MilkOption = "Whole Milk" | "Skim Milk" | "Oat Milk" | "Almond Milk" | "Coconut Milk" | "No Milk";

export type ProductExtra = {
  id: string;
  name: string;
  price: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  rating: number;
  image: string;
  sizes: { size: ProductSize; extraPrice: number }[];
  availableMilk: MilkOption[];
  availableExtras: ProductExtra[];
  isPopular?: boolean;
  isNew?: boolean;
  prepTime: string;
  tags: string[];
};

export const standardExtras: ProductExtra[] = [
  { id: "extra-shot", name: "Extra Espresso Shot", price: 0.8 },
  { id: "caramel-syrup", name: "Caramel Syrup", price: 0.5 },
  { id: "vanilla-syrup", name: "Vanilla Syrup", price: 0.5 },
  { id: "hazelnut-syrup", name: "Hazelnut Syrup", price: 0.5 },
  { id: "whipped-cream", name: "Whipped Cream", price: 0.5 },
];

export const products: Product[] = [
  {
    id: "cappuccino",
    name: "Classic Cappuccino",
    description: "Rich espresso topped with equal parts steamed milk and silky velvety micro-foam, dusted with organic cocoa powder.",
    category: "hot",
    price: 4.2,
    rating: 4.9,
    image: cupCappuccino,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.6 },
      { size: "Large", extraPrice: 1.2 },
    ],
    availableMilk: ["Whole Milk", "Skim Milk", "Oat Milk", "Almond Milk"],
    availableExtras: standardExtras,
    isPopular: true,
    prepTime: "3-5 mins",
    tags: ["Classic", "Frothy", "Popular"],
  },
  {
    id: "latte",
    name: "Silky Velvet Latte",
    description: "30% smooth specialty espresso and 70% freshly micro-steamed milk poured with delicate latte art.",
    category: "hot",
    price: 4.8,
    rating: 5.0,
    image: cupLatte,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.7 },
      { size: "Large", extraPrice: 1.4 },
    ],
    availableMilk: ["Whole Milk", "Skim Milk", "Oat Milk", "Almond Milk", "Coconut Milk"],
    availableExtras: standardExtras,
    isPopular: true,
    prepTime: "4-5 mins",
    tags: ["Smooth", "Creamy", "Best Seller"],
  },
  {
    id: "mocha",
    name: "Dark Chocolate Mocha",
    description: "Full-bodied double espresso blended with premium Belgian dark chocolate sauce and textured warm milk.",
    category: "hot",
    price: 5.1,
    rating: 4.7,
    image: cupMocha,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.8 },
      { size: "Large", extraPrice: 1.5 },
    ],
    availableMilk: ["Whole Milk", "Oat Milk", "Almond Milk"],
    availableExtras: standardExtras,
    isPopular: true,
    prepTime: "4-6 mins",
    tags: ["Indulgent", "Chocolatey", "Rich"],
  },
  {
    id: "espresso-single",
    name: "Single-Origin Espresso",
    description: "Concentrated double shot pulled from our roasted Ethiopian Yirgacheffe beans with notes of jasmine and bright citrus.",
    category: "espresso",
    price: 3.5,
    rating: 4.8,
    image: heroCup,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.5 },
    ],
    availableMilk: ["No Milk"],
    availableExtras: [standardExtras[0]],
    isPopular: false,
    prepTime: "2-3 mins",
    tags: ["Intense", "Single Origin", "Pure"],
  },
  {
    id: "americano",
    name: "LATTE LOCA Americano",
    description: "Double shot of espresso diluted with purified hot water, producing a smooth cup preserving light subtle crema.",
    category: "espresso",
    price: 3.8,
    rating: 4.6,
    image: cupCappuccino,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.5 },
      { size: "Large", extraPrice: 1.0 },
    ],
    availableMilk: ["No Milk", "Whole Milk", "Oat Milk"],
    availableExtras: standardExtras,
    prepTime: "2-3 mins",
    tags: ["Bold", "Clean", "Zero Sugar"],
  },
  {
    id: "iced-latte",
    name: "Iced Salted Caramel Latte",
    description: "Espresso over crystal cold milk, crushed ice, and homemade slow-cooked salted caramel syrup.",
    category: "cold",
    price: 5.2,
    rating: 4.9,
    image: cupLatte,
    sizes: [
      { size: "Medium", extraPrice: 0 },
      { size: "Large", extraPrice: 0.8 },
    ],
    availableMilk: ["Whole Milk", "Oat Milk", "Almond Milk", "Coconut Milk"],
    availableExtras: standardExtras,
    isPopular: true,
    isNew: true,
    prepTime: "3-4 mins",
    tags: ["Cold", "Sweet", "Trending"],
  },
  {
    id: "cold-brew",
    name: "24-Hour Nitro Cold Brew",
    description: "Steeped in small glass barrels for 24 hours, infused with pure nitrogen for a cascading velvet draught texture.",
    category: "cold",
    price: 5.5,
    rating: 4.9,
    image: heroCup,
    sizes: [
      { size: "Medium", extraPrice: 0 },
      { size: "Large", extraPrice: 0.9 },
    ],
    availableMilk: ["No Milk", "Oat Milk", "Almond Milk"],
    availableExtras: standardExtras,
    isPopular: true,
    prepTime: "2 mins",
    tags: ["Nitro", "Smooth", "Refreshing"],
  },
  {
    id: "matcha-latte",
    name: "Ceremonial Uji Matcha Latte",
    description: "Grade-A stone-ground Uji matcha whisked with warm oat milk and organic agave nectar.",
    category: "tea",
    price: 5.4,
    rating: 4.8,
    image: cupLatte,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.7 },
      { size: "Large", extraPrice: 1.3 },
    ],
    availableMilk: ["Oat Milk", "Almond Milk", "Coconut Milk", "Whole Milk"],
    availableExtras: [standardExtras[1], standardExtras[2]],
    isNew: true,
    prepTime: "4-5 mins",
    tags: ["Matcha", "Antioxidant", "Superfood"],
  },
  {
    id: "chai-latte",
    name: "Spiced Micro-Brew Chai Latte",
    description: "Slow-brewed Assam tea leaves infused with cardamoms, cinnamon sticks, ginger, and steamed creamy milk.",
    category: "tea",
    price: 4.9,
    rating: 4.7,
    image: cupMocha,
    sizes: [
      { size: "Small", extraPrice: 0 },
      { size: "Medium", extraPrice: 0.6 },
      { size: "Large", extraPrice: 1.2 },
    ],
    availableMilk: ["Whole Milk", "Oat Milk", "Almond Milk"],
    availableExtras: standardExtras,
    prepTime: "4 mins",
    tags: ["Spiced", "Warming", "Aromatic"],
  },
  {
    id: "almond-croissant",
    name: "French Almond Croissant",
    description: "Flaky golden butter croissant baked fresh daily, filled with sweet almond frangipane cream and toasted sliced almonds.",
    category: "pastries",
    price: 3.9,
    rating: 4.9,
    image: cupCappuccino,
    sizes: [{ size: "Medium", extraPrice: 0 }],
    availableMilk: ["No Milk"],
    availableExtras: [],
    isPopular: true,
    prepTime: "1-2 mins",
    tags: ["Fresh Baked", "Flaky", "Sweet"],
  },
  {
    id: "dark-chocolate-muffin",
    name: "Triple Chocolate Chunk Muffin",
    description: "Rich dark cocoa sponge filled with molten chocolate chips and crowned with dark chocolate drizzle.",
    category: "pastries",
    price: 3.6,
    rating: 4.8,
    image: cupMocha,
    sizes: [{ size: "Medium", extraPrice: 0 }],
    availableMilk: ["No Milk"],
    availableExtras: [],
    prepTime: "1-2 mins",
    tags: ["Bakery", "Decadent", "Pastry"],
  },
  {
    id: "cinnamon-roll",
    name: "Warm Brioche Cinnamon Roll",
    description: "Hand-rolled soft brioche dough with Ceylon cinnamon spice and topped with vanilla bean cream cheese frosting.",
    category: "pastries",
    price: 4.1,
    rating: 4.9,
    image: cupLatte,
    sizes: [{ size: "Medium", extraPrice: 0 }],
    availableMilk: ["No Milk"],
    availableExtras: [],
    isPopular: true,
    prepTime: "2 mins",
    tags: ["Warm", "Comforting", "Signature"],
  },
];

export const categoryLabels: Record<ProductCategory | "all", string> = {
  all: "All Items",
  hot: "Hot Coffee",
  espresso: "Espresso Bar",
  cold: "Cold Brew & Iced",
  tea: "Artisanal Tea",
  pastries: "Fresh Bakery",
};
