import type { CartAction, CartItem, CartState } from "../types/cart.types";

export const initialCartState: CartState = { items: [] };

function clampQuantity(quantity: number, stockQuantity: number): number {
  if (stockQuantity <= 0) return 0;
  return Math.min(Math.max(1, quantity), stockQuantity);
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId,
      );

      if (existing) {
        const nextQty = clampQuantity(
          existing.quantity + action.payload.quantity,
          existing.stockQuantity,
        );
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: nextQty }
              : i,
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...action.payload,
            quantity: clampQuantity(
              action.payload.quantity,
              action.payload.stockQuantity,
            ),
          },
        ],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (i) => i.productId !== action.payload.productId,
        ),
      };

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter((i) => i.productId !== productId),
        };
      }

      return {
        items: state.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: clampQuantity(quantity, i.stockQuantity) }
            : i,
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

export function getCartItemCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
