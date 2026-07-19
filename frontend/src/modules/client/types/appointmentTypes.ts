export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELED";

export interface ServiceData {
  id: string;
  name: string;
}

export interface AppointmentAddressData {
  id: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string | null;
}

export interface AppointmentData {
  id: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  services: ServiceData[];
  address: AppointmentAddressData | null;
}
