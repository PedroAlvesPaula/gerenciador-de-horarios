import { useCallback, useEffect, useMemo, useState } from "react";
import { ScheduleContext } from "./Schedule.context";
import ScheduleView from "./Schedule.view";
import type { AppointmentFormData } from "./appointmentSchema";
import { listAdminCatalogItems, type CatalogItemData } from "../services/catalog.service";
import {
  createAdminAppointment,
  deleteAdminAppointment,
  listAdminAppointments,
  listAppointmentClients,
  updateAdminAppointment,
  updateAdminAppointmentStatus,
  type AdminAppointmentData,
  type AdminAppointmentStatus,
  type AppointmentClientData,
} from "../services/appointments.service";
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

  const reloadAppointments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

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
      setErrorMessage(
        getApiErrorMessage(error, "Não foi possível carregar os agendamentos."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAppointments();
  }, [reloadAppointments]);

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
      setIsSaving(true);

      try {
        const updated = await updateAdminAppointmentStatus(
          statusAppointment.id,
          status,
        );
        setAppointments((current) =>
          sortAppointments(
            current.map((appointment) =>
              appointment.id === updated.id ? updated : appointment,
            ),
          ),
        );
        setStatusAppointment(null);
        notifySuccess("Status atualizado com sucesso.");
      } catch (error: unknown) {
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
      setIsSaving(true);

      try {
        const payload = {
          clientId: data.clientId,
          catalogItemIds: data.catalogItemIds,
          addressId: data.addressId,
          scheduledAt: toScheduledAt(data),
        };
        const saved =
          detailsMode === "edit" && detailsAppointment
            ? await updateAdminAppointment(detailsAppointment.id, payload)
            : await createAdminAppointment(payload);

        setAppointments((current) =>
          sortAppointments(
            detailsMode === "edit"
              ? current.map((appointment) =>
                  appointment.id === saved.id ? saved : appointment,
                )
              : [...current, saved],
          ),
        );
        setDetailsMode(null);
        setDetailsAppointment(null);
        notifySuccess(
          detailsMode === "edit"
            ? "Agendamento atualizado com sucesso."
            : "Agendamento criado com sucesso.",
        );
      } catch (error: unknown) {
        notifyError(
          getApiErrorMessage(error, "Não foi possível salvar o agendamento."),
        );
      } finally {
        setIsSaving(false);
      }
    },
    [detailsAppointment, detailsMode],
  );

  const requestDelete = useCallback((appointment: AdminAppointmentData) => {
    setAppointmentToDelete(appointment);
  }, []);

  const cancelDelete = useCallback(() => {
    if (!deletingAppointmentId) setAppointmentToDelete(null);
  }, [deletingAppointmentId]);

  const confirmDelete = useCallback(async () => {
    if (!appointmentToDelete) return;
    setDeletingAppointmentId(appointmentToDelete.id);

    try {
      await deleteAdminAppointment(appointmentToDelete.id);
      setAppointments((current) =>
        current.filter(
          (appointment) => appointment.id !== appointmentToDelete.id,
        ),
      );
      setAppointmentToDelete(null);
      notifySuccess("Agendamento excluído com sucesso.");
    } catch (error: unknown) {
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
