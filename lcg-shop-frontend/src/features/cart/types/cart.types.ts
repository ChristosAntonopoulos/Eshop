export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stockQuantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };
