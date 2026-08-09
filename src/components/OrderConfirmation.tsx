import { Order } from "@/hooks/useOrders";
import { Link } from "@tanstack/react-router";

type OrderConfirmationProps = {
  order: Order;
  onClose: () => void;
};

export function OrderConfirmation({ order, onClose }: OrderConfirmationProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 shadow-2xl text-center space-y-5">
        {/* Animated Checkmark */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/20 text-primary text-3xl shadow-[var(--shadow-glow)] animate-bounce">
          ✓
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-accent">
            Order Confirmed!
          </span>
          <h2 className="font-display text-2xl font-bold text-cream mt-1">
            Order #{order.id}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Thank you, <strong className="text-cream">{order.customer.name}</strong>! Your coffee is being crafted with care.
          </p>
        </div>

        {/* Estimated Time Banner */}
        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-3 text-xs text-accent font-semibold flex justify-between items-center">
          <span>Estimated {order.customer.orderType === "delivery" ? "Delivery" : "Pickup"}:</span>
          <span className="font-display text-sm font-bold text-cream">{order.estimatedTime}</span>
        </div>

        {/* Receipt Box */}
        <div className="rounded-2xl border border-border bg-background/60 p-4 text-left space-y-2 text-xs max-h-48 overflow-y-auto">
          <div className="font-bold text-cream border-b border-border/50 pb-1.5 flex justify-between">
            <span>Items Ordered ({order.items.length})</span>
            <span>Total: ${order.total.toFixed(2)}</span>
          </div>
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex justify-between py-1 border-b border-border/20 text-muted-foreground">
              <div>
                <span className="text-cream font-medium">{item.quantity}x {item.product.name}</span>
                <span className="text-[10px] block text-accent">
                  {item.size} · {item.milk} {item.extras.length > 0 ? `(+${item.extras.length} extras)` : ""}
                </span>
              </div>
              <span className="text-cream font-semibold">${item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
          <div className="pt-2 text-[11px] text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span>Payment Method:</span>
              <span className="text-cream font-medium">{order.paymentMethod}</span>
            </div>
            {order.customer.address && (
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="text-cream font-medium truncate max-w-[200px]">
                  {order.customer.address}, {order.customer.city}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Link
            to="/orders"
            onClick={onClose}
            className="w-full rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            Track Order Status →
          </Link>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-cream py-1"
          >
            Close & Back to Shop
          </button>
        </div>
      </div>
    </div>
  );
}
