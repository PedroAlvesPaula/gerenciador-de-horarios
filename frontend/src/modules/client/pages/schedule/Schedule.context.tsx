import { createContext, useContext } from "react";
import { type TFunction } from "i18next";

export interface ServiceOption {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface ScheduleContextData {
  currentStep: number;
  isLoading: boolean;
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
  t: TFunction<"translation", undefined>;
}

export const ScheduleContext = createContext<ScheduleContextData>(
  {} as ScheduleContextData,
);

export const useSchedule = () => useContext(ScheduleContext);
