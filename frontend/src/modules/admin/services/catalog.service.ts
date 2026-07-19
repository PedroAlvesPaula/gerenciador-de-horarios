import api from "../../../services/api";

interface CatalogItemApiResponse {
  id: string;
  name: string;
  description: string | null;
  price: number | string;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItemData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogItemPayload {
  id?: string;
  name: string;
  description?: string | null;
  price: number;
  durationMinutes: number;
}

const normalizeCatalogItem = (
  item: CatalogItemApiResponse,
): CatalogItemData => ({
  ...item,
  price: Number(item.price),
});

export const listAdminCatalogItems = async (): Promise<CatalogItemData[]> => {
  const { data } = await api.get<CatalogItemApiResponse[]>("/catalog");
  return data.map(normalizeCatalogItem);
};

export const createCatalogItem = async (
  payload: CatalogItemPayload,
): Promise<CatalogItemData> => {
  const { data } = await api.post<CatalogItemApiResponse>("/catalog", payload);
  return normalizeCatalogItem(data);
};

export const updateCatalogItem = async (
  id: string,
  payload: CatalogItemPayload,
): Promise<CatalogItemData> => {
  const { data } = await api.patch<CatalogItemApiResponse>(
    `/catalog/${id}`,
    payload,
  );
  return normalizeCatalogItem(data);
};

export const deleteCatalogItem = async (id: string): Promise<void> => {
  await api.delete(`/catalog/${id}`);
};
