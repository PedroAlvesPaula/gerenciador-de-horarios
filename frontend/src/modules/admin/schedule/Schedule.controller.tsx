import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScheduleContext } from "./Schedule.context";
import ScheduleView from "./Schedule.view";
import type { AppointmentFormData } from "./appointmentSchema";
import {
  listAdminCatalogItems,
  type CatalogItemData,
} from "../services/catalog.service";
import {
  createAdminAppointment,
  deleteAdminAppointment,
  listAdminAppointments,
  listAppointmentClients,
  updateAdminAppointment,
  updateAdminAppointmentStatus,
  type AdminAppointmentData,
  type AdminAppointmentPayload,
  type AdminAppointmentStatus,
  type AppointmentClientData,
} from "../services/appointments.service";
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

const sortAppointments = (
  appointments: AdminAppointmentData[],
): AdminAppointmentData[] =>
  [...appointments].sort(
    (first, second) =>
      new Date(first.scheduledAt).getTime() -
      new Date(second.scheduledAt).getTime(),
  );

const toScheduledAt = ({ date, time }: AppointmentFormData): string =>
  new Date(`${date}T${time}:00-03:00`).toISOString();

const ScheduleController = () => {
  const [appointments, setAppointments] = useState<AdminAppointmentData[]>([]);
  const [clients, setClients] = useState<AppointmentClientData[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusAppointment, setStatusAppointment] =
    useState<AdminAppointmentData | null>(null);
  const [detailsMode, setDetailsMode] = useState<"create" | "edit" | null>(
    null,
  );
  const [detailsAppointment, setDetailsAppointment] =
    useState<AdminAppointmentData | null>(null);
  const [appointmentToDelete, setAppointmentToDelete] =
    useState<AdminAppointmentData | null>(null);
  const cacheHydratedRef = useRef(false);

  const reloadAppointments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const [cachedAppointments, cachedClients, cachedCatalogItems] =
      await Promise.all([
        getAdminSnapshot<AdminAppointmentData[]>("appointments"),
        getAdminSnapshot<AppointmentClientData[]>("appointment-clients"),
        getAdminSnapshot<CatalogItemData[]>("catalog"),
      ]);
    cacheHydratedRef.current = true;
    if (cachedAppointments) {
      setAppointments(sortAppointments(cachedAppointments));
    }
    if (cachedClients) setClients(cachedClients);
    if (cachedCatalogItems) setCatalogItems(cachedCatalogItems);

    if (!navigator.onLine) {
      setIsLoading(false);
      return;
    }

    const [pendingAppointments, pendingCatalog] = await Promise.all([
      getPendingAdminMutationsCount("appointments"),
      getPendingAdminMutationsCount("catalog"),
    ]);
    if (pendingAppointments + pendingCatalog > 0) {
      setIsLoading(false);
      void requestAdminBackgroundSync();
      return;
    }

    try {
      const [savedAppointments, savedClients, savedCatalogItems] =
        await Promise.all([
          listAdminAppointments(),
          listAppointmentClients(),
          listAdminCatalogItems(),
        ]);
      setAppointments(sortAppointments(savedAppointments));
      setClients(savedClients);
      setCatalogItems(savedCatalogItems);
    } catch (error: unknown) {
      if (!cachedAppointments && !cachedClients && !cachedCatalogItems) {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Não foi possível carregar os agendamentos.",
          ),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAppointments();
  }, [reloadAppointments]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("appointments", appointments);
    }
  }, [appointments]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("appointment-clients", clients);
    }
  }, [clients]);

  useEffect(() => {
    if (cacheHydratedRef.current) {
      void setAdminSnapshot("catalog", catalogItems);
    }
  }, [catalogItems]);

  useEffect(
    () =>
      subscribeToAdminSync((result) => {
        if (
          navigator.onLine &&
          (result.resources.includes("appointments") ||
            result.resources.includes("catalog"))
        ) {
          void reloadAppointments();
        }
      }),
    [reloadAppointments],
  );

  const openCreate = useCallback(() => {
    setDetailsAppointment(null);
    setDetailsMode("create");
  }, []);

  const openStatus = useCallback((appointment: AdminAppointmentData) => {
    setStatusAppointment(appointment);
  }, []);

  const closeStatus = useCallback(() => {
    if (!isSaving) setStatusAppointment(null);
  }, [isSaving]);

  const saveStatus = useCallback(
    async (status: AdminAppointmentStatus) => {
      if (!statusAppointment) return;

      const previousAppointment = statusAppointment;
      const optimisticAppointment = { ...previousAppointment, status };
      setAppointments((current) =>
        sortAppointments(
          current.map((appointment) =>
            appointment.id === previousAppointment.id
              ? optimisticAppointment
              : appointment,
          ),
        ),
      );
      setStatusAppointment(null);
      setIsSaving(true);

      const mutation = {
        resource: "appointments" as const,
        method: "PATCH" as const,
        path: `/appointments/${previousAppointment.id}/status`,
        body: { status },
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            const updated = await updateAdminAppointmentStatus(
              previousAppointment.id,
              status,
            );
            setAppointments((current) =>
              sortAppointments(
                current.map((appointment) =>
                  appointment.id === updated.id ? updated : appointment,
                ),
              ),
            );
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }
        notifySuccess("Status atualizado com sucesso.");
      } catch (error: unknown) {
        setAppointments((current) =>
          sortAppointments(
            current.map((appointment) =>
              appointment.id === previousAppointment.id
                ? previousAppointment
                : appointment,
            ),
          ),
        );
        setStatusAppointment(previousAppointment);
        notifyError(
          getApiErrorMessage(error, "Não foi possível atualizar o status."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [statusAppointment],
  );

  const openDetailsFromStatus = useCallback(() => {
    if (!statusAppointment) return;
    setDetailsAppointment(statusAppointment);
    setStatusAppointment(null);
    setDetailsMode("edit");
  }, [statusAppointment]);

  const closeDetails = useCallback(() => {
    if (isSaving) return;
    setDetailsMode(null);
    setDetailsAppointment(null);
  }, [isSaving]);

  const saveDetails = useCallback(
    async (data: AppointmentFormData) => {
      const isEdit = detailsMode === "edit" && detailsAppointment !== null;
      const previousAppointment = isEdit ? detailsAppointment : null;
      const id = previousAppointment?.id ?? crypto.randomUUID();
      const selectedClient = clients.find(
        (client) => client.id === data.clientId,
      );
      const selectedAddress = selectedClient?.addresses.find(
        (address) => address.id === data.addressId,
      );
      const selectedItems = data.catalogItemIds
        .map((catalogItemId) =>
          catalogItems.find((item) => item.id === catalogItemId),
        )
        .filter((item): item is CatalogItemData => item !== undefined);

      if (
        !selectedClient ||
        !selectedAddress ||
        selectedItems.length !== data.catalogItemIds.length
      ) {
        notifyError("Cliente, endereço ou serviço selecionado não está disponível.");
        return;
      }

      const payload: AdminAppointmentPayload = {
        ...(isEdit ? {} : { id }),
        clientId: data.clientId,
        catalogItemIds: data.catalogItemIds,
        addressId: data.addressId,
        scheduledAt: toScheduledAt(data),
      };
      const { addresses: _addresses, ...clientDetails } = selectedClient;
      const optimisticAppointment: AdminAppointmentData = {
        id,
        scheduledAt: payload.scheduledAt,
        durationMinutes: selectedItems.reduce(
          (total, item) => total + item.durationMinutes,
          0,
        ),
        status: previousAppointment?.status ?? "PENDING",
        clientId: selectedClient.id,
        addressId: selectedAddress.id,
        client: clientDetails,
        address: selectedAddress,
        items: selectedItems.map((catalogItem) => ({ catalogItem })),
      };

      setAppointments((current) =>
        sortAppointments(
          isEdit
            ? current.map((appointment) =>
                appointment.id === id ? optimisticAppointment : appointment,
              )
            : [...current, optimisticAppointment],
        ),
      );
      setDetailsMode(null);
      setDetailsAppointment(null);
      setIsSaving(true);

      const mutation = {
        resource: "appointments" as const,
        method: isEdit ? ("PUT" as const) : ("POST" as const),
        path: isEdit ? `/appointments/${id}` : "/appointments/admin",
        body: payload,
      };

      try {
        if (!navigator.onLine) {
          await queueAdminMutation(mutation);
        } else {
          try {
            const saved = isEdit
              ? await updateAdminAppointment(id, payload)
              : await createAdminAppointment(payload);
            setAppointments((current) =>
              sortAppointments(
                current.map((appointment) =>
                  appointment.id === id ? saved : appointment,
                ),
              ),
            );
          } catch (error: unknown) {
            if (!isNetworkUnavailableError(error)) throw error;
            await queueAdminMutation(mutation);
          }
        }
        notifySuccess(
          isEdit
            ? "Agendamento atualizado com sucesso."
            : "Agendamento criado com sucesso.",
        );
      } catch (error: unknown) {
        setAppointments((current) =>
          sortAppointments(
            previousAppointment
              ? current.map((appointment) =>
                  appointment.id === id ? previousAppointment : appointment,
                )
              : current.filter((appointment) => appointment.id !== id),
          ),
        );
        setDetailsMode(isEdit ? "edit" : "create");
        setDetailsAppointment(previousAppointment);
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o agendamento."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [catalogItems, clients, detailsAppointment, detailsMode],
  );

  const requestDelete = useCallback((appointment: AdminAppointmentData) => {
    setAppointmentToDelete(appointment);
  }, []);

  const cancelDelete = useCallback(() => {
    if (!deletingAppointmentId) setAppointmentToDelete(null);
  }, [deletingAppointmentId]);

  const confirmDelete = useCallback(async () => {
    if (!appointmentToDelete) return;

    const deletedAppointment = appointmentToDelete;
    setAppointments((current) =>
      current.filter(
        (appointment) => appointment.id !== deletedAppointment.id,
      ),
    );
    setAppointmentToDelete(null);
    setDeletingAppointmentId(deletedAppointment.id);

    const mutation = {
      resource: "appointments" as const,
      method: "DELETE" as const,
      path: `/appointments/${deletedAppointment.id}`,
    };

    try {
      if (!navigator.onLine) {
        await queueAdminMutation(mutation);
      } else {
        try {
          await deleteAdminAppointment(deletedAppointment.id);
        } catch (error: unknown) {
          if (!isNetworkUnavailableError(error)) throw error;
          await queueAdminMutation(mutation);
        }
      }
      notifySuccess("Agendamento excluído com sucesso.");
    } catch (error: unknown) {
      setAppointments((current) =>
        sortAppointments(
          current.some(
            (appointment) => appointment.id === deletedAppointment.id,
          )
            ? current
            : [...current, deletedAppointment],
        ),
      );
      setAppointmentToDelete(deletedAppointment);
      notifyError(
        getApiErrorMessage(error, "Não foi possível excluir o agendamento."),
      );
    } finally {
      setDeletingAppointmentId(null);
    }
  }, [appointmentToDelete]);

  const providerValue = useMemo(
    () => ({
      appointments,
      clients,
      catalogItems,
      isLoading,
      isSaving,
      deletingAppointmentId,
      errorMessage,
      statusAppointment,
      detailsMode,
      detailsAppointment,
      appointmentToDelete,
      reloadAppointments,
      openCreate,
      openStatus,
      closeStatus,
      saveStatus,
      openDetailsFromStatus,
      closeDetails,
      saveDetails,
      requestDelete,
      cancelDelete,
      confirmDelete,
    }),
    [
      appointmentToDelete,
      appointments,
      cancelDelete,
      catalogItems,
      clients,
      closeDetails,
      closeStatus,
      confirmDelete,
      deletingAppointmentId,
      detailsAppointment,
      detailsMode,
      errorMessage,
      isLoading,
      isSaving,
      openCreate,
      openDetailsFromStatus,
      openStatus,
      reloadAppointments,
      requestDelete,
      saveDetails,
      saveStatus,
      statusAppointment,
    ],
  );

  return (
    <ScheduleContext.Provider value={providerValue}>
      <ScheduleView />
    </ScheduleContext.Provider>
  );
};

export default ScheduleController;
