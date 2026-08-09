import { Product, products } from "./products";

export type TasteQuizState = {
  strength: "light" | "medium" | "strong"; // 0-33: light, 34-66: medium, 67-100: strong
  milk: "none" | "dairy" | "oat" | "almond";
  temperature: "hot" | "cold";
  flavor: "classic" | "sweet" | "chocolate" | "nutty";
};

export type RecommendationResult = {
  product: Product;
  matchPercentage: number;
  reason: string;
  recommendedSize: "Small" | "Medium" | "Large";
  recommendedMilk: string;
};

export function calculateRecommendation(quiz: TasteQuizState): RecommendationResult {
  const { strength, milk, temperature, flavor } = quiz;

  // Cold temperature preference
  if (temperature === "cold") {
    if (flavor === "sweet" || milk === "oat" || milk === "almond") {
      const p = products.find((x) => x.id === "iced-latte") || products[5];
      return {
        product: p,
        matchPercentage: 98,
        reason: "Your preference for cool refreshing temperature and silky milk notes pairs perfectly with our Iced Salted Caramel Latte.",
        recommendedSize: "Medium",
        recommendedMilk: milk === "none" ? "Oat Milk" : milk === "oat" ? "Oat Milk" : milk === "almond" ? "Almond Milk" : "Whole Milk",
      };
    } else {
      const p = products.find((x) => x.id === "cold-brew") || products[6];
      return {
        product: p,
        matchPercentage: 96,
        reason: "Your desire for a crisp cold brew with smooth natural coffee notes matches our 24-Hour Draught Nitro Cold Brew.",
        recommendedSize: "Medium",
        recommendedMilk: milk === "none" ? "No Milk" : milk === "oat" ? "Oat Milk" : "Whole Milk",
      };
    }
  }

  // Hot temperature preference
  if (flavor === "chocolate") {
    const p = products.find((x) => x.id === "mocha") || products[2];
    return {
      product: p,
      matchPercentage: 99,
      reason: "Your love for rich cocoa notes and warming velvety milk is a match made in heaven for our Dark Chocolate Mocha.",
      recommendedSize: "Medium",
      recommendedMilk: milk === "oat" ? "Oat Milk" : milk === "almond" ? "Almond Milk" : "Whole Milk",
    };
  }

  if (strength === "strong" && milk === "none") {
    const p = products.find((x) => x.id === "espresso-single") || products[3];
    return {
      product: p,
      matchPercentage: 97,
      reason: "You appreciate pure coffee intensity without distractions. Our Ethiopian Single-Origin Espresso delivers pristine floral and bright berry crema notes.",
      recommendedSize: "Small",
      recommendedMilk: "No Milk",
    };
  }

  if (strength === "strong" && (milk === "dairy" || milk === "oat")) {
    const p = products.find((x) => x.id === "cappuccino") || products[0];
    return {
      product: p,
      matchPercentage: 95,
      reason: "A balanced ratio of deep double shot espresso with velvety thick microfoam suits your bold preference perfectly.",
      recommendedSize: "Medium",
      recommendedMilk: milk === "oat" ? "Oat Milk" : "Whole Milk",
    };
  }

  if (milk === "oat" || milk === "almond" || flavor === "sweet") {
    const p = products.find((x) => x.id === "latte") || products[1];
    return {
      product: p,
      matchPercentage: 98,
      reason: "Smooth, gentle, and silky — our Creamy Latte provides a sweet, harmonious cup tailored to your milk preference.",
      recommendedSize: "Medium",
      recommendedMilk: milk === "oat" ? "Oat Milk" : milk === "almond" ? "Almond Milk" : "Whole Milk",
    };
  }

  // Default fallback match
  const p = products.find((x) => x.id === "americano") || products[4];
  return {
    product: p,
    matchPercentage: 94,
    reason: "Clean, rich, and versatile — the BODRIN Americano highlights subtle chocolate and nutty tones in every single sip.",
    recommendedSize: "Medium",
    recommendedMilk: milk === "none" ? "No Milk" : "Whole Milk",
  };
}
