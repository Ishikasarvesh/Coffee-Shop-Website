import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Product, ProductExtra, ProductSize, MilkOption } from "@/data/products";
import { activeOffers, Offer } from "@/data/offers";
import { toast } from "sonner";

export type CartItem = {
  cartItemId: string;
  product: Product;
  size: ProductSize;
  milk: MilkOption;
  extras: ProductExtra[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  finalTotal: number;
  appliedOffer: Offer | null;
  promoCode: string;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  addItem: (
    product: Product,
    size?: ProductSize,
    milk?: MilkOption,
    extras?: ProductExtra[],
    quantity?: number
  ) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "bodrin-cart-v1";
const PROMO_KEY = "bodrin-promo-v1";
const TAX_RATE = 0.085; // 8.5% sales tax

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Hydrate from LocalStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      if (savedItems) setItems(JSON.parse(savedItems));

      const savedPromo = localStorage.getItem(PROMO_KEY);
      if (savedPromo) setPromoCode(savedPromo);
    } catch {
      /* ignore */
    }
  }, []);

  // Save to LocalStorage
  const persistCart = useCallback((newItems: CartItem[], code: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      localStorage.setItem(PROMO_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const calculateItemPrice = (
    product: Product,
    size: ProductSize,
    extras: ProductExtra[]
  ) => {
    const sizeConfig = product.sizes.find((s) => s.size === size);
    const extraPrice = sizeConfig ? sizeConfig.extraPrice : 0;
    const extrasTotal = extras.reduce((sum, e) => sum + e.price, 0);
    return Number((product.price + extraPrice + extrasTotal).toFixed(2));
  };

  const addItem = useCallback(
    (
      product: Product,
      size: ProductSize = product.sizes[0]?.size || "Medium",
      milk: MilkOption = product.availableMilk[0] || "Whole Milk",
      extras: ProductExtra[] = [],
      quantity = 1
    ) => {
      setItems((prev) => {
        const unitPrice = calculateItemPrice(product, size, extras);
        const extrasKey = extras
          .map((e) => e.id)
          .sort()
          .join("-");
        const cartItemId = `${product.id}-${size}-${milk}-${extrasKey}`;

        const existingIndex = prev.findIndex((i) => i.cartItemId === cartItemId);
        let next: CartItem[];

        if (existingIndex > -1) {
          next = [...prev];
          const existing = next[existingIndex]!;
          const newQty = existing.quantity + quantity;
          next[existingIndex] = {
            ...existing,
            quantity: newQty,
            totalPrice: Number((unitPrice * newQty).toFixed(2)),
          };
        } else {
          const newItem: CartItem = {
            cartItemId,
            product,
            size,
            milk,
            extras,
            quantity,
            unitPrice,
            totalPrice: Number((unitPrice * quantity).toFixed(2)),
          };
          next = [...prev, newItem];
        }

        persistCart(next, promoCode);
        return next;
      });

      toast.success(`Added ${product.name} to your cart`, {
        description: `${size} · ${milk}`,
      });
    },
    [persistCart, promoCode]
  );

  const removeItem = useCallback(
    (cartItemId: string) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.cartItemId !== cartItemId);
        persistCart(next, promoCode);
        return next;
      });
      toast.info("Item removed from cart");
    },
    [persistCart, promoCode]
  );

  const updateQuantity = useCallback(
    (cartItemId: string, qty: number) => {
      if (qty <= 0) {
        removeItem(cartItemId);
        return;
      }

      setItems((prev) => {
        const next = prev.map((item) => {
          if (item.cartItemId === cartItemId) {
            return {
              ...item,
              quantity: qty,
              totalPrice: Number((item.unitPrice * qty).toFixed(2)),
            };
          }
          return item;
        });
        persistCart(next, promoCode);
        return next;
      });
    },
    [persistCart, promoCode, removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setPromoCode("");
    persistCart([], "");
  }, [persistCart]);

  const applyPromoCode = useCallback(
    (code: string): boolean => {
      const cleanCode = code.trim().toUpperCase();
      const matchedOffer = activeOffers.find(
        (o) => o.code && o.code.toUpperCase() === cleanCode
      );

      if (matchedOffer) {
        setPromoCode(cleanCode);
        persistCart(items, cleanCode);
        toast.success(`Promo code '${cleanCode}' applied!`, {
          description: matchedOffer.subtitle,
        });
        return true;
      } else {
        toast.error("Invalid promo code", {
          description: "Try STUDENT10 or WELCOMEBODRIN",
        });
        return false;
      }
    },
    [items, persistCart]
  );

  const removePromoCode = useCallback(() => {
    setPromoCode("");
    persistCart(items, "");
    toast.info("Promo code removed");
  }, [items, persistCart]);

  // Derived Calculations
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => Number(items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2)),
    [items]
  );

  // Automatic Combo & Discount Logic
  const { discount, appliedOffer } = useMemo(() => {
    if (subtotal === 0) return { discount: 0, appliedOffer: null };

    // Check Promo code offer first
    if (promoCode) {
      const promoOffer = activeOffers.find(
        (o) => o.code && o.code.toUpperCase() === promoCode.toUpperCase()
      );
      if (promoOffer) {
        if (promoOffer.discountType === "percentage") {
          const disc = Number(((subtotal * promoOffer.discountValue) / 100).toFixed(2));
          return { discount: disc, appliedOffer: promoOffer };
        } else if (promoOffer.discountType === "fixed") {
          if (subtotal >= 15) {
            return { discount: promoOffer.discountValue, appliedOffer: promoOffer };
          }
        }
      }
    }

    // Automatic Weekend Special check (cold drinks)
    const hasColdDrinks = items.some((i) => i.product.category === "cold");
    if (hasColdDrinks) {
      const coldSubtotal = items
        .filter((i) => i.product.category === "cold")
        .reduce((sum, i) => sum + i.totalPrice, 0);
      if (coldSubtotal > 0) {
        const weekendOffer = activeOffers.find((o) => o.id === "weekend-cold") || null;
        const disc = Number(((coldSubtotal * 15) / 100).toFixed(2));
        return { discount: disc, appliedOffer: weekendOffer };
      }
    }

    // Automatic Morning Combo check (coffee + pastry)
    const hasCoffee = items.some((i) => i.product.category !== "pastries");
    const hasPastry = items.some((i) => i.product.category === "pastries");
    if (hasCoffee && hasPastry) {
      const comboOffer = activeOffers.find((o) => o.id === "morning-combo") || null;
      return { discount: 2.5, appliedOffer: comboOffer };
    }

    // Automatic Coffee Duo check (2+ drinks)
    const totalDrinks = items
      .filter((i) => i.product.category !== "pastries")
      .reduce((sum, i) => sum + i.quantity, 0);

    if (totalDrinks >= 2) {
      const duoOffer = activeOffers.find((o) => o.id === "coffee-duo") || null;
      const coffeeSubtotal = items
        .filter((i) => i.product.category !== "pastries")
        .reduce((sum, i) => sum + i.totalPrice, 0);
      const disc = Number(((coffeeSubtotal * 10) / 100).toFixed(2));
      return { discount: disc, appliedOffer: duoOffer };
    }

    return { discount: 0, appliedOffer: null };
  }, [items, subtotal, promoCode]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return Number((taxableAmount * TAX_RATE).toFixed(2));
  }, [subtotal, discount]);

  const finalTotal = useMemo(() => {
    const raw = subtotal - discount + tax;
    return Number(Math.max(0, raw).toFixed(2));
  }, [subtotal, discount, tax]);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      discount,
      tax,
      finalTotal,
      appliedOffer,
      promoCode,
      isCartOpen,
      isCheckoutOpen,
      setIsCartOpen,
      setIsCheckoutOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
    }),
    [
      items,
      itemCount,
      subtotal,
      discount,
      tax,
      finalTotal,
      appliedOffer,
      promoCode,
      isCartOpen,
      isCheckoutOpen,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
