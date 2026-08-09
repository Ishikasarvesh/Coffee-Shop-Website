import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useOrders, CustomerInfo, Order } from "@/hooks/useOrders";
import { toast } from "sonner";
import { OrderConfirmation } from "./OrderConfirmation";

export function CheckoutModal() {
  const {
    items,
    subtotal,
    discount,
    tax,
    finalTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
  } = useCart();
  const { createOrder } = useOrders();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash on pickup" | "UPI" | "Card">(
    "Cash on pickup"
  );

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCheckoutOpen && !completedOrder) {
        setIsCheckoutOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCheckoutOpen, completedOrder, setIsCheckoutOpen]);

  if (!isCheckoutOpen && !completedOrder) return null;

  if (completedOrder) {
    return (
      <OrderConfirmation
        order={completedOrder}
        onClose={() => {
          setCompletedOrder(null);
          setIsCheckoutOpen(false);
        }}
      />
    );
  }

  const validateStep1 = () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!phone.trim() || phone.length < 7) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (orderType === "delivery") {
      if (!address.trim()) {
        toast.error("Please enter delivery street address");
        return false;
      }
      if (!city.trim()) {
        toast.error("Please enter city");
        return false;
      }
      if (!pincode.trim()) {
        toast.error("Please enter pincode/ZIP code");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as 1 | 2);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const customer: CustomerInfo = {
      name,
      phone,
      email,
      orderType,
      address: orderType === "delivery" ? address : undefined,
      city: orderType === "delivery" ? city : undefined,
      pincode: orderType === "delivery" ? pincode : undefined,
      notes,
    };

    const newOrder = createOrder(
      customer,
      items,
      subtotal,
      discount,
      tax,
      finalTotal,
      paymentMethod
    );

    clearCart();
    setCompletedOrder(newOrder);
  };

  return (
    <div
      onClick={() => setIsCheckoutOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsCheckoutOpen(false)}
          aria-label="Close checkout"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-secondary text-cream transition-transform hover:scale-110"
        >
          ✕
        </button>

        {/* Header & Steps Timeline */}
        <div>
          <h2 className="font-display text-2xl font-bold text-cream">Checkout</h2>
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step >= 1 ? "bg-primary" : "bg-border"
              }`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step >= 2 ? "bg-primary" : "bg-border"
              }`}
            />
            <div
              className={`flex-1 h-1.5 rounded-full transition-all ${
                step >= 3 ? "bg-primary" : "bg-border"
              }`}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
            <span className={step === 1 ? "text-accent font-bold" : ""}>1. Contact</span>
            <span className={step === 2 ? "text-accent font-bold" : ""}>2. Delivery</span>
            <span className={step === 3 ? "text-accent font-bold" : ""}>3. Payment</span>
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmitOrder} className="mt-6 space-y-6">
          {/* STEP 1: CONTACT */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                Customer Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-cream block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-cream block mb-1 font-medium">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 019-2834"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream block mb-1 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ORDER TYPE & ADDRESS */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                Order Type & Location
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("pickup")}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    orderType === "pickup"
                      ? "border-primary bg-primary/20 text-cream font-bold"
                      : "border-border/60 bg-background/40 text-muted-foreground"
                  }`}
                >
                  <div className="text-2xl mb-1">🏃‍♂️</div>
                  <div className="text-sm font-semibold">Store Pickup</div>
                  <div className="text-[11px] text-muted-foreground">Ready in 10-15 mins</div>
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("delivery")}
                  className={`rounded-2xl border p-4 text-center transition-all ${
                    orderType === "delivery"
                      ? "border-primary bg-primary/20 text-cream font-bold"
                      : "border-border/60 bg-background/40 text-muted-foreground"
                  }`}
                >
                  <div className="text-2xl mb-1">🛵</div>
                  <div className="text-sm font-semibold">Door Delivery</div>
                  <div className="text-[11px] text-muted-foreground">Est. 25-35 mins</div>
                </button>
              </div>

              {orderType === "delivery" && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs text-cream block mb-1 font-medium">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="Flat / Building / Street name"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-cream block mb-1 font-medium">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-cream block mb-1 font-medium">Pincode / ZIP</label>
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-cream block mb-1 font-medium">
                  Special Instructions / Barista Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Extra hot milk, sugar on the side..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-cream placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT & SUMMARY */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-accent">
                Payment Method
              </h3>
              <div className="space-y-2">
                {[
                  {
                    id: "Cash on pickup",
                    title: orderType === "delivery" ? "Cash on Delivery" : "Cash on Pickup",
                    desc: "Pay directly at store counter or to delivery barista",
                    icon: "💵",
                  },
                  {
                    id: "UPI",
                    title: "UPI / Instant Transfer",
                    desc: "GPay, PhonePe, Paytm or any BHIM UPI QR",
                    icon: "📱",
                  },
                  {
                    id: "Card",
                    title: "Credit / Debit Card",
                    desc: "Visa, Mastercard, Amex, Apple Pay",
                    icon: "💳",
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    onClick={() =>
                      setPaymentMethod(pm.id as "Cash on pickup" | "UPI" | "Card")
                    }
                    className={`flex items-center justify-between rounded-2xl border p-3.5 cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? "border-primary bg-primary/10 text-cream font-semibold"
                        : "border-border/60 bg-background/30 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pm.icon}</span>
                      <div>
                        <div className="text-sm text-cream font-bold">{pm.title}</div>
                        <div className="text-[11px] text-muted-foreground">{pm.desc}</div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pm.id}
                      onChange={() => {}}
                      className="accent-primary h-4 w-4"
                    />
                  </label>
                ))}
              </div>

              {/* Order Summary Box */}
              <div className="rounded-2xl border border-border bg-background/50 p-4 space-y-2 text-xs">
                <div className="flex justify-between font-bold text-cream">
                  <span>Order Items ({items.length})</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
                <div className="text-muted-foreground line-clamp-1">
                  {items.map((i) => `${i.quantity}x ${i.product.name}`).join(", ")}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-border pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-cream hover:bg-secondary"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:scale-105"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-all hover:scale-105"
              >
                Confirm Order (${finalTotal.toFixed(2)})
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
