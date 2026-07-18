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
  status: AppointmentData["status"];
  catalogItem: {
    id: string;
    name: string;
  };
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
  catalogItemId: string,
): Promise<AvailabilityData> => {
  const { data } = await api.get<AvailabilityData>("/availability", {
    params: { date, catalogItemId },
  });

  return data;
};

export const createAppointment = async (payload: {
  scheduledAt: string;
  catalogItemId: string;
}): Promise<void> => {
  await api.post("/appointments", payload);
};

export const listMyAppointments = async (): Promise<AppointmentData[]> => {
  const { data } = await api.get<AppointmentApiResponse[]>("/appointments");

  return data.map(({ catalogItem, ...appointment }) => ({
    ...appointment,
    service: catalogItem,
  }));
};
