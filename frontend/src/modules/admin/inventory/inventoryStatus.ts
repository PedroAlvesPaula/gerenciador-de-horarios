export type InventoryStockLevel = "critical" | "warning" | "healthy";

export const getInventoryStockLevel = (
  quantity: number,
  minRecommended: number,
): InventoryStockLevel => {
  if (quantity < minRecommended) return "critical";
  if (quantity <= minRecommended + 5) return "warning";
  return "healthy";
};
