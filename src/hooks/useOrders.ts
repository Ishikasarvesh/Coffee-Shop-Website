import { useState, useEffect, useCallback } from "react";
import { CartItem } from "./useCart";
import { toast } from "sonner";

export type OrderStatus = "Confirmed" | "Preparing" | "Ready for pickup" | "Out for delivery" | "Completed";

export type CustomerInfo = {
  name: string;
  phone: string;
  email: string;
  orderType: "pickup" | "delivery";
  address?: string;
  city?: string;
  pincode?: string;
  notes?: string;
};

export type Order = {
  id: string; // e.g. BOD-9412
  date: string;
  timestamp: number;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: "Cash on pickup" | "UPI" | "Card";
  status: OrderStatus;
  estimatedTime: string;
};

const ORDERS_KEY = "latte-loca-orders-v1";

export function computeLiveStatus(order: Order): OrderStatus {
  const elapsedSec = (Date.now() - order.timestamp) / 1000;
  const isDelivery = order.customer.orderType === "delivery";

  if (elapsedSec < 20) return "Confirmed";
  if (elapsedSec < 50) return "Preparing";
  if (elapsedSec < 120) return isDelivery ? "Out for delivery" : "Ready for pickup";
  return "Completed";
}

export function useOrders() {
  const [rawOrders, setRawOrders] = useState<Order[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      if (raw) setRawOrders(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const createOrder = useCallback(
    (
      customer: CustomerInfo,
      items: CartItem[],
      subtotal: number,
      discount: number,
      tax: number,
      total: number,
      paymentMethod: "Cash on pickup" | "UPI" | "Card"
    ): Order => {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `BOD-${randomNum}`;
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newOrder: Order = {
        id: orderId,
        date: dateStr,
        timestamp: now.getTime(),
        customer,
        items,
        subtotal,
        discount,
        tax,
        total,
        paymentMethod,
        status: "Confirmed",
        estimatedTime: customer.orderType === "delivery" ? "25-35 mins" : "10-15 mins",
      };

      setRawOrders((prev) => {
        const next = [newOrder, ...prev];
        try {
          localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });

      toast.success(`Order #${orderId} Confirmed!`, {
        description: `Estimated time: ${newOrder.estimatedTime}`,
      });

      return newOrder;
    },
    []
  );

  const orders = rawOrders.map((o) => ({
    ...o,
    status: computeLiveStatus(o),
  }));

  const getOrderById = useCallback(
    (orderId: string) => orders.find((o) => o.id === orderId),
    [orders]
  );

  return {
    orders,
    createOrder,
    getOrderById,
    orderCount: orders.length,
  };
}
