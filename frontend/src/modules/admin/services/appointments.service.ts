import api from "../../../services/api";
import type { CatalogItemData } from "./catalog.service";

export type AdminAppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export interface AdminAddressData {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string | null;
}

export interface AppointmentClientData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  addresses: AdminAddressData[];
}

export interface AdminAppointmentData {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AdminAppointmentStatus;
  clientId: string;
  addressId: string | null;
  client: Omit<AppointmentClientData, "addresses">;
  address: AdminAddressData | null;
  items: Array<{ catalogItem: CatalogItemData }>;
}

export interface AdminAppointmentPayload {
  id?: string;
  clientId: string;
  scheduledAt: string;
  catalogItemIds: string[];
  addressId: string;
}

export const listAdminAppointments = async (): Promise<
  AdminAppointmentData[]
> => {
  const { data } = await api.get<AdminAppointmentData[]>("/appointments/all");
  return data;
};

export const listAppointmentClients = async (): Promise<
  AppointmentClientData[]
> => {
  const { data } = await api.get<AppointmentClientData[]>("/users/clients");
  return data;
};

export const createAdminAppointment = async (
  payload: AdminAppointmentPayload,
): Promise<AdminAppointmentData> => {
  const { data } = await api.post<AdminAppointmentData>(
    "/appointments/admin",
    payload,
  );
  return data;
};

export const updateAdminAppointment = async (
  id: string,
  payload: AdminAppointmentPayload,
): Promise<AdminAppointmentData> => {
  const { data } = await api.put<AdminAppointmentData>(
    `/appointments/${id}`,
    payload,
  );
  return data;
};

export const updateAdminAppointmentStatus = async (
  id: string,
  status: AdminAppointmentStatus,
): Promise<AdminAppointmentData> => {
  const { data } = await api.patch<AdminAppointmentData>(
    `/appointments/${id}/status`,
    { status },
  );
  return data;
};

export const deleteAdminAppointment = async (id: string): Promise<void> => {
  await api.delete(`/appointments/${id}`);
};
