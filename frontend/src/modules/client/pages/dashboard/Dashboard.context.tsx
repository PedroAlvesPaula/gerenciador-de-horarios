import { createContext, useContext } from "react";
import { type TFunction } from "i18next";
import { type AppointmentData } from "../../types/appointmentTypes";

export interface DashboardContextData {
  upcomingAppointments: AppointmentData[];
  historyAppointments: AppointmentData[];
  isLoading: boolean;
  t: TFunction<"translation", undefined>;
}

export const DashboardContext = createContext<DashboardContextData>(
  {} as DashboardContextData,
);

export const useDashboard = () => useContext(DashboardContext);
