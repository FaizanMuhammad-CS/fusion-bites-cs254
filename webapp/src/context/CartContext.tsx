"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

type CartItem = {
  item_id: number;
  name: string;
  price: number;
  quantity: number;
  /** Used to resolve /public/photos/{category} paths; optional for older saved carts */
  category?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (item_id: number) => void;
  increaseQuantity: (item_id: number) => void;
  decreaseQuantity: (item_id: number) => void;
  clearCart: () => void;
  totalPrice: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const CART_STORAGE_KEY = "fusion_bites_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  // Used to prevent hydration mismatches in Next.js
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load cart from localStorage on initial mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Sync cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((prev) => {
      const existing = prev.find((i) => i.item_id === item.item_id);

      if (existing) {
        return prev.map((i) =>
          i.item_id === item.item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(item_id: number) {
    setCart((prev) => prev.filter((item) => item.item_id !== item_id));
  }

  function increaseQuantity(item_id: number) {
    setCart((prev) =>
      prev.map((item) =>
        item.item_id === item_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseQuantity(item_id: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.item_id === item_id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  // 3. Memoize the context value to prevent unnecessary re-renders in consumer components
  const contextValue = useMemo(() => {
    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return {
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalPrice,
      isLoaded, // Exposing this allows UI to show a loader instead of an empty cart briefly during hydration
    };
  }, [cart, isLoaded]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}