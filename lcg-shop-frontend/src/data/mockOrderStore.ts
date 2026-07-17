import type { Order } from "@/features/orders/types/order.types";
import { seedMockOrders } from "./mockOrders";

const ORDERS_KEY = "lcg-shop-mock-orders";

export function loadMockOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return structuredClone(seedMockOrders);
    return JSON.parse(raw) as Order[];
  } catch {
    return structuredClone(seedMockOrders);
  }
}

export function saveMockOrders(orders: Order[]): void {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}
