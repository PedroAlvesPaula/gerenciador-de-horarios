import { useState } from "react";
import ScheduleView from "./Schedule.view";

export interface Appointment {
  id: string;
  clientName: string;
  time: string;
  address: string;
  service: string;
  status: "Pendente" | "A Caminho" | "Finalizado";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "João Silva",
    time: "09:00",
    address: "Rua das Flores, 123 - Centro",
    service: "Corte Degradê + Barba Lenhador",
    status: "Pendente",
  },
  {
    id: "2",
    clientName: "Marcos Paulo",
    time: "10:30",
    address: "Av. Paulista, 1500 - Apto 42",
    service: "Corte Clássico",
    status: "Pendente",
  },
  {
    id: "3",
    clientName: "Roberto Alves",
    time: "13:00",
    address: "Rua Augusta, 800",
    service: "Barba Terapia",
    status: "Pendente",
  },
];

const ScheduleController = () => {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);

  const handleStartRoute = (id: string) => {
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, status: "A Caminho" } : app,
      ),
    );
    console.log(`Starting route for appointment ID: ${id}`);
  };

  return (
    <ScheduleView appointments={appointments} onStartRoute={handleStartRoute} />
  );
};

export default ScheduleController;
