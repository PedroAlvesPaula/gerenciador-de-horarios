import api from "../../../services/api";

export interface AddressData {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string | null;
}

export interface AddressPayload {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string | null;
}

export const listAddresses = async (): Promise<AddressData[]> => {
  const { data } = await api.get<AddressData[]>("/addresses");
  return data;
};

export const createAddress = async (
  payload: AddressPayload,
): Promise<AddressData> => {
  const { data } = await api.post<AddressData>("/addresses", payload);
  return data;
};

export const updateAddress = async (
  id: string,
  payload: AddressPayload,
): Promise<AddressData> => {
  const { data } = await api.patch<AddressData>(`/addresses/${id}`, payload);
  return data;
};

export const deleteAddress = async (id: string): Promise<void> => {
  await api.delete(`/addresses/${id}`);
};
