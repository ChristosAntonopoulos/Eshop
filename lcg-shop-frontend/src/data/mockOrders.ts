import type { Order } from "@/features/orders/types/order.types";

export const seedMockOrders: Order[] = [
  {
    id: "ord-1001",
    status: "DELIVERED",
    customer: {
      firstName: "Maria",
      lastName: "Papadopoulou",
      email: "maria@example.com",
      phone: "+30 210 1234567",
    },
    shippingAddress: {
      address: "Leoforos Kifisias 45",
      city: "Marousi",
      postalCode: "15125",
    },
    items: [
      {
        productId: "1",
        productName: "Whey Protein Chocolate 1kg",
        quantity: 2,
        unitPrice: 34.9,
      },
      {
        productId: "3",
        productName: "Protein Cookie Chocolate Chip",
        quantity: 3,
        unitPrice: 2.8,
      },
    ],
    notes: "Leave at reception if not home.",
    subtotal: 78.2,
    shipping: 3.5,
    total: 81.7,
    createdAt: "2026-06-10T09:15:00Z",
  },
  {
    id: "ord-1002",
    status: "SHIPPED",
    customer: {
      firstName: "Dimitris",
      lastName: "Nikolaou",
      email: "dimitris@example.com",
      phone: "+30 694 1234567",
    },
    shippingAddress: {
      address: "Kifisias Ave 12",
      city: "Marousi",
      postalCode: "15123",
    },
    items: [
      {
        productId: "2",
        productName: "Electrolytes Lemon",
        quantity: 4,
        unitPrice: 14.5,
      },
    ],
    subtotal: 58,
    shipping: 3.5,
    total: 61.5,
    createdAt: "2026-07-01T14:30:00Z",
  },
  {
    id: "ord-1003",
    status: "PENDING",
    customer: {
      firstName: "Eleni",
      lastName: "Georgiou",
      email: "eleni@example.com",
      phone: "+30 697 5551234",
    },
    shippingAddress: {
      address: "Ermou 8",
      city: "Athens",
      postalCode: "10563",
    },
    items: [
      {
        productId: "4",
        productName: "Creatine Monohydrate 300g",
        quantity: 1,
        unitPrice: 18.9,
      },
      {
        productId: "8",
        productName: "Swim Goggles Pro",
        quantity: 1,
        unitPrice: 19.9,
      },
    ],
    notes: "Call before delivery.",
    subtotal: 38.8,
    shipping: 3.5,
    total: 42.3,
    createdAt: "2026-07-15T11:00:00Z",
  },
];
