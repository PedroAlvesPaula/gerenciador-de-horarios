export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export interface ServiceData {
  id: string;
  name: string;
}

export interface AppointmentData {
  id: string;
  scheduledAt: string;
  status: AppointmentStatus;
  service: ServiceData;
}
