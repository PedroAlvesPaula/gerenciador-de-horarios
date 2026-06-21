import { useState, useMemo } from "react";
import InventoryView from "./Inventory.view";

export type ItemCategory = "Disposable" | "Cosmetic" | "Linen";

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  minThreshold: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Lâminas (Caixa)",
    category: "Disposable",
    quantity: 2,
    minThreshold: 3,
  },
  {
    id: "2",
    name: "Golas Higiênicas",
    category: "Disposable",
    quantity: 45,
    minThreshold: 20,
  },
  {
    id: "3",
    name: "Toalhas Limpas",
    category: "Linen",
    quantity: 8,
    minThreshold: 5,
  },
  {
    id: "4",
    name: "Shaving Gel",
    category: "Cosmetic",
    quantity: 1,
    minThreshold: 1,
  },
  {
    id: "5",
    name: "Pomada Modeladora",
    category: "Cosmetic",
    quantity: 0,
    minThreshold: 1,
  },
];

const InventoryController = () => {
  const [items, setItems] = useState<InventoryItem[]>(mockInventory);

  const handleUpdateQuantity = (id: string, delta: number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );
  };

  const criticalItemsCount = useMemo(() => {
    return items.filter((item) => item.quantity === 0).length;
  }, [items]);

  const alertMessage =
    criticalItemsCount > 0
      ? `Atenção: Você tem ${criticalItemsCount} item(ns) esgotado(s) na maleta!`
      : null;

  return (
    <InventoryView
      items={items}
      onUpdateQuantity={handleUpdateQuantity}
      alertMessage={alertMessage}
    />
  );
};

export default InventoryController;
