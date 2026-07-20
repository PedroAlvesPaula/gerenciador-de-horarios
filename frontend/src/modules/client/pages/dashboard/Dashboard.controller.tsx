import { useCallback, useEffect, useMemo, useState } from "react";
import ClientDashboardView from "./Dashboard.view";
import { useNavigate } from "react-router-dom";
import type { AppointmentData } from "../../types/appointmentTypes";
import { useAuth } from "../../../../contexts/useAuth";
import { DashboardContext } from "./Dashboard.context";
import { listMyAppointments } from "../../services/scheduling.service";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const DashboardController = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    AppointmentData[]
  >([]);
  const [historyAppointments, setHistoryAppointments] = useState<
    AppointmentData[]
  >([]);
  const navigate = useNavigate();

  const { user } = useAuth();

  const reloadAppointments = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const appointments = await listMyAppointments();
      const now = Date.now();
      const upcoming = appointments
        .filter(
          (appointment) =>
            ["PENDING", "CONFIRMED"].includes(appointment.status) &&
            new Date(appointment.scheduledAt).getTime() >= now,
        )
        .sort(
          (first, second) =>
            new Date(first.scheduledAt).getTime() -
            new Date(second.scheduledAt).getTime(),
        );
      const upcomingIds = new Set(upcoming.map(({ id }) => id));
      const history = appointments.filter(
        (appointment) => !upcomingIds.has(appointment.id),
      );

      setUpcomingAppointments(upcoming);
      setHistoryAppointments(history);
    } catch (error: unknown) {
      setErrorMessage(
        getApiErrorMessage(
          error,
          "Não foi possível carregar seus agendamentos.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadAppointments();
  }, [reloadAppointments]);

  const handleNewSchedule = useCallback((): void => {
    navigate("/schedule/new");
  }, [navigate]);

  const providerValue = useMemo(
    () => ({
      isLoading,
      errorMessage,
      upcomingAppointments,
      historyAppointments,
      userName: user?.name ?? "Cliente",
      handleNewSchedule,
      reloadAppointments,
    }),
    [
      errorMessage,
      handleNewSchedule,
      historyAppointments,
      isLoading,
      reloadAppointments,
      upcomingAppointments,
      user?.name,
    ],
  );

  return (
    <DashboardContext.Provider value={providerValue}>
      <ClientDashboardView />
    </DashboardContext.Provider>
  );
};

export default DashboardController;
