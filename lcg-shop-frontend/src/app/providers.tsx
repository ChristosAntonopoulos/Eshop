import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "@/features/cart/CartContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <CartProvider>{children}</CartProvider>
    </BrowserRouter>
  );
}
