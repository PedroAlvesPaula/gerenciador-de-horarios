import type { InventoryItemCategory } from "../services/inventory.service";

export const inventoryCategories: InventoryItemCategory[] = [
  "RETORNAVEIS",
  "DESCARTAVEIS",
  "COSMETICOS",
];

export const inventoryCategoryLabels: Record<InventoryItemCategory, string> = {
  RETORNAVEIS: "Retornáveis",
  DESCARTAVEIS: "Descartáveis",
  COSMETICOS: "Cosméticos",
};
