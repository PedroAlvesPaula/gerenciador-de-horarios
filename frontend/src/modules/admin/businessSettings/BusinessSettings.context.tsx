import { createContext, useContext } from "react";
import type { DayOffData } from "../services/businessSettings.service";

export interface BusinessHourDraft {
  id?: string;
  dayOfWeek: number;
  enabled: boolean;
  openTime: string;
  closeTime: string;
  breakStart: string;
  breakEnd: string;
}

export type BusinessHourField = keyof Pick<
  BusinessHourDraft,
  "openTime" | "closeTime" | "breakStart" | "breakEnd"
>;

interface BusinessSettingsContextData {
  businessHours: BusinessHourDraft[];
  daysOff: DayOffData[];
  isLoading: boolean;
  savingDay: number | null;
  isSavingDayOff: boolean;
  errorMessage: string | null;
  newDayOffDate: string;
  newDayOffReason: string;
  updateBusinessHourField: (
    dayOfWeek: number,
    field: BusinessHourField,
    value: string,
  ) => void;
  toggleBusinessDay: (dayOfWeek: number, enabled: boolean) => Promise<void>;
  saveBusinessDay: (dayOfWeek: number) => Promise<void>;
  setNewDayOffDate: (value: string) => void;
  setNewDayOffReason: (value: string) => void;
  addDayOff: () => Promise<void>;
  removeDayOff: (id: string) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

export const BusinessSettingsContext =
  createContext<BusinessSettingsContextData | undefined>(undefined);

export const useBusinessSettings = (): BusinessSettingsContextData => {
  const context = useContext(BusinessSettingsContext);

  if (!context) {
    throw new Error(
      "useBusinessSettings deve ser usado dentro de BusinessSettingsContext.Provider",
    );
  }

  return context;
};
