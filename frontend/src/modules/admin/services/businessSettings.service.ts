import api from "../../../services/api";

export interface BusinessHourData {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface BusinessHourPayload {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  breakStart: string | null;
  breakEnd: string | null;
}

export interface DayOffData {
  id: string;
  date: string;
  reason: string | null;
}

export const listBusinessHours = async (): Promise<BusinessHourData[]> => {
  const { data } = await api.get<BusinessHourData[]>("/business-hours");
  return data;
};

export const createBusinessHour = async (
  payload: BusinessHourPayload,
): Promise<BusinessHourData> => {
  const { data } = await api.post<BusinessHourData>(
    "/business-hours",
    payload,
  );
  return data;
};

export const updateBusinessHour = async (
  id: string,
  payload: BusinessHourPayload,
): Promise<BusinessHourData> => {
  const { data } = await api.put<BusinessHourData>(
    `/business-hours/${id}`,
    payload,
  );
  return data;
};

export const deleteBusinessHour = async (id: string): Promise<void> => {
  await api.delete(`/business-hours/${id}`);
};

export const listDaysOff = async (): Promise<DayOffData[]> => {
  const { data } = await api.get<DayOffData[]>("/days-off");
  return data;
};

export const createDayOff = async (payload: {
  date: string;
  reason?: string;
}): Promise<DayOffData> => {
  const { data } = await api.post<DayOffData>("/days-off", payload);
  return data;
};

export const deleteDayOff = async (id: string): Promise<void> => {
  await api.delete(`/days-off/${id}`);
};
