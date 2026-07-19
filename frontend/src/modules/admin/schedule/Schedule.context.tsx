import { createContext, useContext } from "react";
import type { CatalogItemData } from "../services/catalog.service";
import type {
  AdminAppointmentData,
  AdminAppointmentStatus,
  AppointmentClientData,
} from "../services/appointments.service";
import type { AppointmentFormData } from "./appointmentSchema";

interface ScheduleContextData {
  appointments: AdminAppointmentData[];
  clients: AppointmentClientData[];
  catalogItems: CatalogItemData[];
  isLoading: boolean;
  isSaving: boolean;
  deletingAppointmentId: string | null;
  errorMessage: string | null;
  statusAppointment: AdminAppointmentData | null;
  detailsMode: "create" | "edit" | null;
  detailsAppointment: AdminAppointmentData | null;
  appointmentToDelete: AdminAppointmentData | null;
  reloadAppointments: () => Promise<void>;
  openCreate: () => void;
  openStatus: (appointment: AdminAppointmentData) => void;
  closeStatus: () => void;
  saveStatus: (status: AdminAppointmentStatus) => Promise<void>;
  openDetailsFromStatus: () => void;
  closeDetails: () => void;
  saveDetails: (data: AppointmentFormData) => Promise<void>;
  requestDelete: (appointment: AdminAppointmentData) => void;
  cancelDelete: () => void;
  confirmDelete: () => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleContextData | undefined>(
  undefined,
);

export const useAdminSchedule = (): ScheduleContextData => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error(
      "useAdminSchedule deve ser usado dentro de ScheduleContext.Provider",
    );
  }

  return context;
};
