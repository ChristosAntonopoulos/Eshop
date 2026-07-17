import { loadMockOrders, saveMockOrders } from "@/data/mockOrderStore";
import { loadMockProducts } from "@/data/mockCatalogStore";
import {
  SHIPPING_FLAT_RATE,
  type CreateOrderRequest,
  type Order,
} from "@/features/orders/types/order.types";
import type { OrderRepository, OrderQueryParams } from "./orderRepository";

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function resolveProductName(
  productId: string,
  fallback?: string,
): string {
  if (fallback) return fallback;
  const product = loadMockProducts().find((p) => p.id === productId);
  return product?.name ?? `Product ${productId}`;
}

function buildOrder(request: CreateOrderRequest): Order {
  const items = request.items.map((item) => ({
    productId: item.productId,
    productName: resolveProductName(item.productId, item.productName),
    quantity: item.quantity,
    unitPrice: item.unitPrice,
  }));

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const shipping = subtotal > 0 ? SHIPPING_FLAT_RATE : 0;

  return {
    id: `ord-${Date.now()}`,
    status: "PENDING",
    customer: request.customer,
    shippingAddress: request.shippingAddress,
    items,
    notes: request.notes?.trim() || undefined,
    subtotal: Math.round(subtotal * 100) / 100,
    shipping,
    total: Math.round((subtotal + shipping) * 100) / 100,
    createdAt: new Date().toISOString(),
  };
}

export const mockOrderRepository: OrderRepository = {
  async list(params?: OrderQueryParams) {
    await delay();
    let orders = loadMockOrders();
    if (params?.status) {
      orders = orders.filter((o) => o.status === params.status);
    }
    return orders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  async getById(id: string) {
    await delay();
    return loadMockOrders().find((o) => o.id === id) ?? null;
  },

  async create(request: CreateOrderRequest) {
    await delay(500);
    if (!request.items.length) {
      throw new Error("Order must contain at least one item.");
    }
    const order = buildOrder(request);
    const orders = loadMockOrders();
    orders.unshift(order);
    saveMockOrders(orders);
    return order;
  },

  async updateStatus(id: string, status) {
    await delay();
    const orders = loadMockOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) {
      throw new Error(`Order ${id} not found.`);
    }
    orders[index] = { ...orders[index], status };
    saveMockOrders(orders);
    return orders[index];
  },
};
