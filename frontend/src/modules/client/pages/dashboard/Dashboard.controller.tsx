import { useState, useEffect } from "react";
import ClientDashboardView from "./Dashboard.view";
import { useNavigate } from "react-router-dom";
import type { AppointmentData } from "../../types/appointmentTypes";

const DashboardController = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    AppointmentData[]
  >([]);
  const [historyAppointments, setHistoryAppointments] = useState<
    AppointmentData[]
  >([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMockData = () => {
      setTimeout(() => {
        setUpcomingAppointments([]);

        setHistoryAppointments([
          {
            id: "1",
            scheduledAt: "2023-11-14T10:00:00Z",
            status: "COMPLETED",
            service: { id: "s1", name: "Corte Clássico" },
          },
          {
            id: "2",
            scheduledAt: "2023-11-09T14:30:00Z",
            status: "COMPLETED",
            service: { id: "s2", name: "Barba Terapia" },
          },
        ]);

        setIsLoading(false);
      }, 800);
    };

    loadMockData();
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem("@phbarber:token");
    localStorage.removeItem("@phbarber:user");
    navigate("/login");
  };

  const handleNewSchedule = (): void => {
    navigate("/schedule/new");
  };

  return (
    <ClientDashboardView
      isLoading={isLoading}
      upcomingAppointments={upcomingAppointments}
      historyAppointments={historyAppointments}
      onLogout={handleLogout}
      onNewSchedule={handleNewSchedule}
    />
  );
};

export default DashboardController;
