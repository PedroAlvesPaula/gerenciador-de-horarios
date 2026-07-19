import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  type BusinessHourData,
  type BusinessHourPayload,
  type DayOffData,
} from "../services/businessSettings.service";
import {
  getAdminSnapshot,
  setAdminSnapshot,
} from "../services/adminOfflineDb";
import {
  getPendingAdminMutationsCount,
  isNetworkUnavailableError,
  queueAdminMutation,
  requestAdminBackgroundSync,
  subscribeToAdminSync,
} from "../services/adminOffline.client";
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

const toBusinessHourDrafts = (
  savedHours: BusinessHourData[],
): BusinessHourDraft[] => {
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
  return week;
};

const sortDaysOff = (daysOff: DayOffData[]): DayOffData[] =>
  [...daysOff].sort((first, second) => first.date.localeCompare(second.date));

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
  const cacheHydratedRef = useRef(false);

  const reloadSettings = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const [cachedHours, cachedDaysOff] = await Promise.all([
      getAdminSnapshot<BusinessHourDraft[]>("business-hours"),
      getAdminSnapshot<DayOffData[]>("days-off"),
    ]);
    cacheHydratedRef.current = true;
    if (cachedHours) setBusinessHours(cachedHours);
    if (cachedDaysOff) setDaysOff(sortDaysOff(cachedDaysOff));

    if (!navigator.onLine) {
      setIsLoading(false);
      return;
    }

    const [pendingHours, pendingDaysOff] = await Promise.all([
      getPendingAdminMutationsCount("business-hours"),
      getPendingAdminMutationsCount("days-off"),
    ]);
    if (pendingHours + pendingDaysOff > 0) {
      setIsLoading(false);
      void requestAdminBackgroundSync();
      return;
    }

    try {
      const [savedHours, savedDaysOff] = await Promise.all([
        listBusinessHours(),
        listDaysOff(),
      ]);
      setBusinessHours(toBusinessHourDrafts(savedHours));
      setDaysOff(sortDaysOff(savedDaysOff));
    } catch (error: unknown) {
      if (!cachedHours && !cachedDaysOff) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Não foi possível carregar as configurações do negócio.",
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadSettings();
  }, [reloadSettings]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("business-hours", businessHours);
    }
  }, [businessHours]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("days-off", daysOff);
    }
  }, [daysOff]);

  useEffect(
    () =>
      subscribeToAdminSync((result) => {
        if (
          navigator.onLine &&
          (result.resources.includes("business-hours") ||
            result.resources.includes("days-off"))
        ) {
          void reloadSettings();
        }
      }),
    [reloadSettings],
  );

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
      const previousHour = businessHours.find(
        (hour) => hour.dayOfWeek === dayOfWeek,
      );
      if (!previousHour) return;

      setBusinessHours((hours) =>
        hours.map((hour) =>
          hour.dayOfWeek === dayOfWeek
            ? { ...hour, enabled, id: enabled ? hour.id : undefined }
            : hour,
        ),
      );

      if (enabled || !previousHour.id) return;

      setSavingDay(dayOfWeek);
      const mutation = {
        resource: "business-hours" as const,
        method: "DELETE" as const,
        path: `/business-hours/${previousHour.id}`,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            await deleteBusinessHour(previousHour.id);
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }
        notifySuccess("Dia removido do expediente.");
      } catch (error: unknown) {
        setBusinessHours((hours) =>
          hours.map((hour) =>
            hour.dayOfWeek === dayOfWeek ? previousHour : hour,
          ),
        );
        notifyError(
          getApiErrorMessage(error, "Não foi possível fechar este dia."),
        );
      } finally {
        setSavingDay(null);
      }
    },
    [businessHours],
  );

  const saveBusinessDay = useCallback(
    async (dayOfWeek: number) => {
      const previousHour = businessHours.find(
        (item) => item.dayOfWeek === dayOfWeek,
      );
      if (!previousHour?.enabled) return;

      if (Boolean(previousHour.breakStart) !== Boolean(previousHour.breakEnd)) {
        notifyError(
          "Preencha o início e o fim do intervalo, ou deixe ambos vazios.",
        );
        return;
      }

      const id = previousHour.id ?? crypto.randomUUID();
      const payload: BusinessHourPayload = {
        ...(previousHour.id ? {} : { id }),
        dayOfWeek,
        openTime: previousHour.openTime,
        closeTime: previousHour.closeTime,
        breakStart: previousHour.breakStart || null,
        breakEnd: previousHour.breakEnd || null,
      };

      setBusinessHours((hours) =>
        hours.map((hour) =>
          hour.dayOfWeek === dayOfWeek ? { ...hour, id } : hour,
        ),
      );
      setSavingDay(dayOfWeek);

      const mutation = {
        resource: "business-hours" as const,
        method: previousHour.id ? ("PUT" as const) : ("POST" as const),
        path: previousHour.id
          ? `/business-hours/${previousHour.id}`
          : "/business-hours",
        body: payload,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            const saved = previousHour.id
              ? await updateBusinessHour(previousHour.id, payload)
              : await createBusinessHour(payload);
            setBusinessHours((hours) =>
              hours.map((hour) =>
                hour.dayOfWeek === dayOfWeek
                  ? { ...hour, id: saved.id }
                  : hour,
              ),
            );
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }
        notifySuccess("Horário salvo com sucesso.");
      } catch (error: unknown) {
        setBusinessHours((hours) =>
          hours.map((hour) =>
            hour.dayOfWeek === dayOfWeek ? previousHour : hour,
          ),
        );
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

    const previousDate = newDayOffDate;
    const previousReason = newDayOffReason;
    const id = crypto.randomUUID();
    const reason = previousReason.trim() || null;
    const optimisticDayOff: DayOffData = {
      id,
      date: `${previousDate}T00:00:00.000Z`,
      reason,
    };
    const payload = {
      id,
      date: previousDate,
      ...(reason ? { reason } : {}),
    };

    setDaysOff((current) => sortDaysOff([...current, optimisticDayOff]));
    setNewDayOffDate("");
    setNewDayOffReason("");
    setIsSavingDayOff(true);

    const mutation = {
      resource: "days-off" as const,
      method: "POST" as const,
      path: "/days-off",
      body: payload,
    };

    try {
      if (!navigator.onLine) {
        await queueAdminMutation(mutation);
      } else {
        try {
          const saved = await createDayOff(payload);
          setDaysOff((current) =>
            sortDaysOff(
              current.map((dayOff) => (dayOff.id === id ? saved : dayOff)),
            ),
          );
        } catch (error: unknown) {
          if (!isNetworkUnavailableError(error)) throw error;
          await queueAdminMutation(mutation);
        }
      }
      notifySuccess("Folga adicionada ao calendário.");
    } catch (error: unknown) {
      setDaysOff((current) => current.filter((dayOff) => dayOff.id !== id));
      setNewDayOffDate(previousDate);
      setNewDayOffReason(previousReason);
      notifyError(
        getApiErrorMessage(error, "Não foi possível adicionar esta folga."),
      );
    } finally {
      setIsSavingDayOff(false);
    }
  }, [newDayOffDate, newDayOffReason]);

  const removeDayOff = useCallback(
    async (id: string) => {
      const deletedDayOff = daysOff.find((dayOff) => dayOff.id === id);
      if (!deletedDayOff) return;

      setDaysOff((current) => current.filter((dayOff) => dayOff.id !== id));
      const mutation = {
        resource: "days-off" as const,
        method: "DELETE" as const,
        path: `/days-off/${id}`,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            await deleteDayOff(id);
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }
        notifySuccess("Folga removida do calendário.");
      } catch (error: unknown) {
        setDaysOff((current) =>
          sortDaysOff(
            current.some((dayOff) => dayOff.id === id)
              ? current
              : [...current, deletedDayOff],
          ),
        );
        notifyError(
          getApiErrorMessage(error, "Não foi possível remover esta folga."),
        );
      }
    },
    [daysOff],
  );

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
