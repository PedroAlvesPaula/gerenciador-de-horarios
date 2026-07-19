import api from "../../../services/api";

export type InventoryItemCategory =
  | "RETORNAVEIS"
  | "DESCARTAVEIS"
  | "COSMETICOS";

export interface InventoryItemData {
  id: string;
  name: string;
  category: InventoryItemCategory;
  minRecommended: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryItemPayload {
  name: string;
  category: InventoryItemCategory;
  minRecommended: number;
  quantity: number;
}

export const listInventoryItems = async (): Promise<InventoryItemData[]> => {
  const { data } = await api.get<InventoryItemData[]>("/inventory");
  return data;
};

export const createInventoryItem = async (
  payload: InventoryItemPayload,
): Promise<InventoryItemData> => {
  const { data } = await api.post<InventoryItemData>("/inventory", payload);
  return data;
};

export const updateInventoryItem = async (
  id: string,
  payload: InventoryItemPayload,
): Promise<InventoryItemData> => {
  const { data } = await api.patch<InventoryItemData>(
    `/inventory/${id}`,
    payload,
  );
  return data;
};

export const updateInventoryQuantity = async (
  id: string,
  delta: number,
): Promise<InventoryItemData> => {
  const { data } = await api.patch<InventoryItemData>(
    `/inventory/${id}/quantity`,
    { delta },
  );
  return data;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  await api.delete(`/inventory/${id}`);
};
