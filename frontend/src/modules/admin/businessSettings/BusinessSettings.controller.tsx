import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BusinessSettingsContext,
  type BusinessHourDraft,
  type BusinessHourField,
} from "./BusinessSettings.context";
import BusinessSettingsView from "./BusinessSettings.view";
import {
  createBusinessHour,
  createDayOff,
  deleteBusinessHour,
  deleteDayOff,
  listBusinessHours,
  listDaysOff,
  updateBusinessHour,
  type BusinessHourPayload,
  type DayOffData,
} from "../services/businessSettings.service";
import { getApiErrorMessage } from "../../../utils/getApiErrorMessage";
import { notifyError, notifySuccess } from "../../../utils/toast";

const createEmptyWeek = (): BusinessHourDraft[] =>
  Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    enabled: false,
    openTime: "09:00",
    closeTime: "19:00",
    breakStart: "",
    breakEnd: "",
  }));

const BusinessSettingsController = () => {
  const [businessHours, setBusinessHours] =
    useState<BusinessHourDraft[]>(createEmptyWeek);
  const [daysOff, setDaysOff] = useState<DayOffData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [isSavingDayOff, setIsSavingDayOff] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newDayOffDate, setNewDayOffDate] = useState("");
  const [newDayOffReason, setNewDayOffReason] = useState("");

  const reloadSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [savedHours, savedDaysOff] = await Promise.all([
        listBusinessHours(),
        listDaysOff(),
      ]);
      const week = createEmptyWeek();

      savedHours.forEach((hour) => {
        week[hour.dayOfWeek] = {
          id: hour.id,
          dayOfWeek: hour.dayOfWeek,
          enabled: true,
          openTime: hour.openTime,
          closeTime: hour.closeTime,
          breakStart: hour.breakStart ?? "",
          breakEnd: hour.breakEnd ?? "",
        };
      });

      setBusinessHours(week);
      setDaysOff(savedDaysOff);
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Não foi possível carregar as configurações do negócio.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadSettings();
  }, [reloadSettings]);

  const updateBusinessHourField = useCallback(
    (dayOfWeek: number, field: BusinessHourField, value: string) => {
      setBusinessHours((current) =>
        current.map((hour) =>
          hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour,
        ),
      );
    },
    [],
  );

  const toggleBusinessDay = useCallback(
    async (dayOfWeek: number, enabled: boolean) => {
      const current = businessHours.find(
        (hour) => hour.dayOfWeek === dayOfWeek,
      );

      if (!current) return;

      if (!enabled && current.id) {
        setSavingDay(dayOfWeek);
        try {
          await deleteBusinessHour(current.id);
          notifySuccess("Dia removido do expediente.");
        } catch (error: unknown) {
          notifyError(
            getApiErrorMessage(error, "Não foi possível fechar este dia."),
          );
          return;
        } finally {
          setSavingDay(null);
        }
      }

      setBusinessHours((hours) =>
        hours.map((hour) =>
          hour.dayOfWeek === dayOfWeek
            ? { ...hour, enabled, id: enabled ? hour.id : undefined }
            : hour,
        ),
      );
    },
    [businessHours],
  );

  const saveBusinessDay = useCallback(
    async (dayOfWeek: number) => {
      const hour = businessHours.find(
        (item) => item.dayOfWeek === dayOfWeek,
      );

      if (!hour?.enabled) return;

      if (Boolean(hour.breakStart) !== Boolean(hour.breakEnd)) {
        notifyError("Preencha o início e o fim do intervalo, ou deixe ambos vazios.");
        return;
      }

      const payload: BusinessHourPayload = {
        dayOfWeek,
        openTime: hour.openTime,
        closeTime: hour.closeTime,
        breakStart: hour.breakStart || null,
        breakEnd: hour.breakEnd || null,
      };

      setSavingDay(dayOfWeek);
      try {
        const saved = hour.id
          ? await updateBusinessHour(hour.id, payload)
          : await createBusinessHour(payload);

        setBusinessHours((hours) =>
          hours.map((item) =>
            item.dayOfWeek === dayOfWeek ? { ...item, id: saved.id } : item,
          ),
        );
        notifySuccess("Horário salvo com sucesso.");
      } catch (error: unknown) {
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar este horário."),
        );
      } finally {
        setSavingDay(null);
      }
    },
    [businessHours],
  );

  const addDayOff = useCallback(async () => {
    if (!newDayOffDate) {
      notifyError("Escolha a data da folga ou feriado.");
      return;
    }

    setIsSavingDayOff(true);
    try {
      const saved = await createDayOff({
        date: newDayOffDate,
        reason: newDayOffReason.trim() || undefined,
      });
      setDaysOff((current) =>
        [...current, saved].sort((first, second) =>
          first.date.localeCompare(second.date),
        ),
      );
      setNewDayOffDate("");
      setNewDayOffReason("");
      notifySuccess("Folga adicionada ao calendário.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível adicionar esta folga."),
      );
    } finally {
      setIsSavingDayOff(false);
    }
  }, [newDayOffDate, newDayOffReason]);

  const removeDayOff = useCallback(async (id: string) => {
    try {
      await deleteDayOff(id);
      setDaysOff((current) => current.filter((dayOff) => dayOff.id !== id));
      notifySuccess("Folga removida do calendário.");
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível remover esta folga."),
      );
    }
  }, []);

  const providerValue = useMemo(
    () => ({
      businessHours,
      daysOff,
      isLoading,
      savingDay,
      isSavingDayOff,
      errorMessage,
      newDayOffDate,
      newDayOffReason,
      updateBusinessHourField,
      toggleBusinessDay,
      saveBusinessDay,
      setNewDayOffDate,
      setNewDayOffReason,
      addDayOff,
      removeDayOff,
      reloadSettings,
    }),
    [
      addDayOff,
      businessHours,
      daysOff,
      errorMessage,
      isLoading,
      isSavingDayOff,
      newDayOffDate,
      newDayOffReason,
      reloadSettings,
      removeDayOff,
      saveBusinessDay,
      savingDay,
      toggleBusinessDay,
      updateBusinessHourField,
    ],
  );

  return (
    <BusinessSettingsContext.Provider value={providerValue}>
      <BusinessSettingsView />
    </BusinessSettingsContext.Provider>
  );
};

export default BusinessSettingsController;
