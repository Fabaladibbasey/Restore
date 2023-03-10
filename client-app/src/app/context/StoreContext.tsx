import { createContext, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
  basket: Basket | null;
  setBasket: (basket: Basket) => void;
  removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue>({
  basket: null,
  setBasket: () => {},
  removeItem: () => {},
});

export const useStoreContext = () => useContext(StoreContext);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [basket, setBasket] = useState<Basket | null>(null);

  const removeItem = (productId: number, quantity: number) => {
    if (!basket) return;

    const newBasket = { ...basket };
    const itemIndex = newBasket.items.findIndex(
      (x) => x.productId === productId
    );

    if (itemIndex < 0) return;

    const item = newBasket.items[itemIndex];

    if (item.quantity > quantity) {
      item.quantity -= quantity;
    } else {
      newBasket.items.splice(itemIndex, 1);
    }
    newBasket.subTotal -= item.price * quantity;
    setBasket(newBasket);
  };

  return (
    <StoreContext.Provider value={{ basket, setBasket, removeItem }}>
      {children}
    </StoreContext.Provider>
  );
}
