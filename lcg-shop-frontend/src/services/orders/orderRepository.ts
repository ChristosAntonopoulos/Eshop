import type {
  CreateOrderRequest,
  Order,
  OrderStatus,
} from "@/features/orders/types/order.types";

export interface OrderQueryParams {
  status?: OrderStatus;
}

export interface OrderRepository {
  list(params?: OrderQueryParams): Promise<Order[]>;
  getById(id: string): Promise<Order | null>;
  create(request: CreateOrderRequest): Promise<Order>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
}
