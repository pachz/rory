"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface SelectedOption {
  optionId: string;
  optionLabel: string;
  choiceId: string;
  choiceName: string;
  price: number;
}

export interface CartLineItem {
  cartId: string;
  itemId: string;
  name: string;
  thumbnail: string | null;
  basePrice: number;
  quantity: number;
  selectedOptions: SelectedOption[];
  isSoldOut: boolean;
}

interface CartContextValue {
  items: CartLineItem[];
  itemCount: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartLineItem, "cartId" | "quantity">) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function lineTotal(item: CartLineItem): number {
  const optionsTotal = item.selectedOptions.reduce(
    (sum, opt) => sum + opt.price,
    0,
  );
  return (item.basePrice + optionsTotal) * item.quantity;
}

function optionsKey(options: SelectedOption[]): string {
  return options
    .map((o) => o.choiceId)
    .sort()
    .join("-");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLineItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback(
    (item: Omit<CartLineItem, "cartId" | "quantity">) => {
      setItems((prev) => {
        const key = `${item.itemId}:${optionsKey(item.selectedOptions)}`;
        const existing = prev.find(
          (line) =>
            `${line.itemId}:${optionsKey(line.selectedOptions)}` === key,
        );

        if (existing) {
          return prev.map((line) =>
            line.cartId === existing.cartId
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }

        return [
          ...prev,
          {
            ...item,
            cartId: crypto.randomUUID(),
            quantity: 1,
          },
        ];
      });
      setIsOpen(true);
    },
    [],
  );

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => prev.filter((line) => line.cartId !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((line) => line.cartId !== cartId));
      return;
    }
    setItems((prev) =>
      prev.map((line) =>
        line.cartId === cartId ? { ...line, quantity } : line,
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const itemCount = items.reduce((sum, line) => sum + line.quantity, 0);
    const totalPrice = items.reduce((sum, line) => sum + lineTotal(line), 0);

    return {
      items,
      itemCount,
      totalPrice,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
  }, [items, isOpen, addItem, removeItem, updateQuantity, clearCart]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

export { lineTotal };
