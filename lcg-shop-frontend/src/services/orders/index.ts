import { mockOrderRepository } from "./mockOrderRepository";
import { httpOrderRepository } from "./httpOrderRepository";

const useMockOrders = import.meta.env.VITE_USE_MOCK_ORDERS !== "false";

export const orderRepository = useMockOrders
  ? mockOrderRepository
  : httpOrderRepository;
