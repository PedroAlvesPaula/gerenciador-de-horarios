import { createContext, useContext } from "react";
import type { ServiceOptionData } from "../../services/scheduling.service";
import type { AddressData } from "../../services/addresses.service";

export type ServiceOption = ServiceOptionData;
export type AddressOption = AddressData;

export interface ScheduleContextData {
  currentStep: number;
  isLoading: boolean;
  isLoadingServices: boolean;
  isLoadingAvailability: boolean;
  isLoadingAddresses: boolean;
  servicesError: string | null;
  availabilityError: string | null;
  addressesError: string | null;
  services: ServiceOption[];
  availableTimes: string[];
  addresses: AddressOption[];

  selectedServices: ServiceOption[];
  totalDurationMinutes: number;
  totalPrice: number;
  selectedDate: string;
  selectedTime: string;
  selectedAddress: AddressOption | null;

  handleNextStep: () => void;
  handlePrevStep: () => void;
  handleToggleService: (service: ServiceOption) => void;
  handleSelectDate: (date: string) => void;
  handleSelectTime: (time: string) => void;
  handleSelectAddress: (address: AddressOption) => void;
  handleConfirmSchedule: () => Promise<void>;
  handleGoBack: () => void;
  handleManageAddresses: () => void;
  reloadServices: () => Promise<void>;
  reloadAddresses: () => Promise<void>;
}

export const ScheduleContext = createContext<ScheduleContextData | undefined>(
  undefined,
);

export const useSchedule = (): ScheduleContextData => {
  const context = useContext(ScheduleContext);

  if (!context) {
    throw new Error(
      "useSchedule deve ser usado dentro de ScheduleContext.Provider",
    );
  }

  return context;
};
