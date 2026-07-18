import api from "../../../services/api";
import type { AppointmentData } from "../types/appointmentTypes";

interface CatalogItemApiResponse {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number | string;
}

interface AppointmentApiResponse {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentData["status"];
  items: Array<{
    catalogItem: {
      id: string;
      name: string;
    };
  }>;
}

export interface ServiceOptionData {
  id: string;
  name: string;
  description?: string | null;
  durationMinutes: number;
  price: number;
}

export interface AvailabilityData {
  date: string;
  availableSlots: string[];
}

export const listCatalogItems = async (): Promise<ServiceOptionData[]> => {
  const { data } = await api.get<CatalogItemApiResponse[]>("/catalog");

  return data.map((item) => ({
    ...item,
    price: Number(item.price),
  }));
};

export const getAvailability = async (
  date: string,
  catalogItemIds: string[],
): Promise<AvailabilityData> => {
  const { data } = await api.get<AvailabilityData>("/availability", {
    params: { date, catalogItemIds: catalogItemIds.join(",") },
  });

  return data;
};

export const createAppointment = async (payload: {
  scheduledAt: string;
  catalogItemIds: string[];
}): Promise<void> => {
  await api.post("/appointments", payload);
};

export const listMyAppointments = async (): Promise<AppointmentData[]> => {
  const { data } = await api.get<AppointmentApiResponse[]>("/appointments");

  return data.map(({ items, ...appointment }) => ({
    ...appointment,
    services: items.map(({ catalogItem }) => catalogItem),
  }));
};
