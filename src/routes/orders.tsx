import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useOrders, OrderStatus } from "@/hooks/useOrders";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "My Orders & Status — BODRIN Coffee" },
      {
        name: "description",
        content: "Track your active coffee shop orders and view your order history.",
      },
    ],
  }),
  component: OrdersPage,
});

const statusSteps: OrderStatus[] = [
  "Confirmed",
  "Preparing",
  "Ready for pickup",
  "Completed",
];

function getStatusIndex(status: OrderStatus) {
  if (status === "Completed") return 3;
  if (status === "Ready for pickup" || status === "Out for delivery") return 2;
  if (status === "Preparing") return 1;
  return 0; // Confirmed
}

function OrdersPage() {
  const { orders } = useOrders();
  const { addItem, setIsCartOpen } = useCart();
  const [, setTick] = useState(0);

  // Auto tick every 3 seconds to update live order status timeline
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleReorder = (order: typeof orders[0]) => {
    order.items.forEach((item) => {
      addItem(item.product, item.size, item.milk, item.extras, item.quantity);
    });
    toast.success(`Reordered items from Order #${order.id}`);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen hero-surface py-12 px-5">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-accent">
            Order Tracking & History
          </span>
          <h1 className="font-display text-4xl font-extrabold text-cream sm:text-5xl">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            View live status updates for your coffee orders or quickly reorder your favorite drinks.
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card/40 p-12 text-center space-y-4 backdrop-blur">
            <div className="text-5xl">🛍️</div>
            <h3 className="font-display text-xl font-bold text-cream">No orders placed yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You haven't placed any coffee or bakery orders yet. Head to the menu to craft your perfect drink!
            </p>
            <Link
              to="/menu"
              className="inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:scale-105 transition-transform"
            >
              Browse Coffee Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStepIdx = getStatusIndex(order.status);

              return (
                <div
                  key={order.id}
                  className="rounded-3xl border border-border bg-card/60 p-6 md:p-8 backdrop-blur space-y-6 shadow-lg"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/50 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-2xl font-bold text-cream">
                          Order #{order.id}
                        </h3>
                        <span className="rounded-full bg-primary/20 px-3 py-0.5 text-xs font-bold text-accent">
                          {order.customer.orderType === "delivery" ? "🛵 Delivery" : "🏃 Store Pickup"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Placed on <span className="text-cream">{order.date}</span>
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-display text-2xl font-bold text-cream">
                        ${order.total.toFixed(2)}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  {/* Order Status Timeline Tracker */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold uppercase tracking-wider text-accent">
                        Live Status: <span className="text-cream font-extrabold">{order.status}</span>
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Est. Time: {order.estimatedTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {statusSteps.map((stepLabel, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div key={stepLabel} className="flex-1 space-y-1.5">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                isDone
                                  ? isCurrent
                                    ? "bg-primary animate-pulse shadow-[var(--shadow-glow)]"
                                    : "bg-primary"
                                  : "bg-border/60"
                              }`}
                            />
                            <span
                              className={`text-[10px] block truncate text-center ${
                                isDone ? "text-cream font-bold" : "text-muted-foreground"
                              }`}
                            >
                              {stepLabel}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Items Summary Table */}
                  <div className="rounded-2xl border border-border/60 bg-background/40 p-4 space-y-2 text-xs">
                    <span className="font-bold text-cream block border-b border-border/40 pb-2">
                      Item Breakdown ({order.items.length})
                    </span>
                    {order.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex justify-between items-center py-1 text-muted-foreground"
                      >
                        <div>
                          <span className="text-cream font-semibold">
                            {item.quantity}x {item.product.name}
                          </span>
                          <span className="text-[11px] block text-accent">
                            {item.size} · {item.milk}{" "}
                            {item.extras.length > 0 ? `(+${item.extras.map((e) => e.name).join(", ")})` : ""}
                          </span>
                        </div>
                        <span className="font-bold text-cream">${item.totalPrice.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="pt-2 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-accent">
                          <span>Discount applied:</span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span>${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-cream pt-1 text-xs">
                        <span>Total Paid:</span>
                        <span className="text-primary">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Info & Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <div className="text-xs text-muted-foreground w-full sm:w-auto">
                      <span className="text-cream font-medium">Recipient:</span> {order.customer.name} ({order.customer.phone})
                      {order.customer.address && (
                        <span className="block text-[11px]">
                          📍 {order.customer.address}, {order.customer.city}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleReorder(order)}
                      className="w-full sm:w-auto rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-md hover:scale-105 transition-transform"
                    >
                      🔁 Reorder These Items
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
