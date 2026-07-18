import { createContext, useContext } from "react";
import type { ServiceOptionData } from "../../services/scheduling.service";

export type ServiceOption = ServiceOptionData;

export interface ScheduleContextData {
  currentStep: number;
  isLoading: boolean;
  isLoadingServices: boolean;
  isLoadingAvailability: boolean;
  servicesError: string | null;
  availabilityError: string | null;
  services: ServiceOption[];
  availableTimes: string[];

  selectedService: ServiceOption | null;
  selectedDate: string;
  selectedTime: string;

  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleSelectService: (service: ServiceOption) => void;
  handleSelectDate: (date: string) => void;
  handleSelectTime: (time: string) => void;
  handleConfirmSchedule: () => Promise<void>;
  handleGoBack: () => void;
  reloadServices: () => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleContextData | undefined>(
  undefined,
);

export const useSchedule = (): ScheduleContextData => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error("useSchedule deve ser usado dentro de ScheduleContext.Provider");
  }

  return context;
};
