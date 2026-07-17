export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrderShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  items: OrderItem[];
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
  productName?: string;
}

export interface CreateOrderRequest {
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  items: CreateOrderItemInput[];
  notes?: string;
}

export const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const SHIPPING_FLAT_RATE = 3.5;
