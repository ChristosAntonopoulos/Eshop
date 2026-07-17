import { apiClient } from "@/services/api/apiClient";
import type {
  CreateOrderRequest,
  Order,
  OrderStatus,
} from "@/features/orders/types/order.types";
import type { OrderRepository, OrderQueryParams } from "./orderRepository";

export const httpOrderRepository: OrderRepository = {
  async list(params?: OrderQueryParams) {
    return apiClient.get<Order[]>("/orders", {
      params: params?.status ? { status: params.status } : undefined,
    });
  },

  async getById(id: string) {
    return apiClient.get<Order | null>(`/orders/${id}`);
  },

  async create(request: CreateOrderRequest) {
    const body: CreateOrderRequest = {
      customer: request.customer,
      shippingAddress: request.shippingAddress,
      items: request.items.map(({ productId, quantity, unitPrice }) => ({
        productId,
        quantity,
        unitPrice,
      })),
      notes: request.notes,
    };
    return apiClient.post<Order>("/orders", body);
  },

  async updateStatus(id: string, status: OrderStatus) {
    return apiClient.patch<Order>(`/orders/${id}/status`, { status });
  },
};
