import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { Product } from "@/features/products/types/product.types";
import type { CartItem } from "./types/cart.types";
import {
  cartReducer,
  getCartItemCount,
  getCartSubtotal,
  initialCartState,
} from "./utils/cartReducer";
import { loadCartFromStorage, saveCartToStorage } from "./utils/cartStorage";

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function productToCartItem(product: Product, quantity: number): CartItem {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    price: product.price,
    quantity,
    stockQuantity: product.stockQuantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadCartFromStorage() });
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (product.stockQuantity <= 0) return;
    dispatch({
      type: "ADD_ITEM",
      payload: productToCartItem(product, quantity),
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { productId } });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: getCartItemCount(state.items),
      subtotal: getCartSubtotal(state.items),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [state.items, addToCart, removeFromCart, updateQuantity, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
