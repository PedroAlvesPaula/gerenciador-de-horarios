import { createContext, useContext } from "react";
import { type AppointmentData } from "../../types/appointmentTypes";

export interface DashboardContextData {
  upcomingAppointments: AppointmentData[];
  historyAppointments: AppointmentData[];
  isLoading: boolean;
  errorMessage: string | null;
  userName: string;
  handleNewSchedule: () => void;
  reloadAppointments: () => Promise<void>;
}

export const DashboardContext = createContext<DashboardContextData | undefined>(
  undefined,
);

export const useDashboard = (): DashboardContextData => {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      "useDashboard deve ser usado dentro de DashboardContext.Provider",
    );
  }

  return context;
};
