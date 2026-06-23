import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ScheduleView from "./Schedule.view";
import { ScheduleContext, type ServiceOption } from "./Schedule.context";

const ScheduleController = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Estados
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  // Seleções
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Efeito para carregar serviços iniciais (Mock)
  useEffect(() => {
    setServices([
      { id: "1", name: "Corte Clássico", durationMinutes: 45, price: 40.0 },
      { id: "2", name: "Barba Terapia", durationMinutes: 30, price: 35.0 },
      { id: "3", name: "Corte + Barba", durationMinutes: 75, price: 70.0 },
    ]);
  }, []);

  // Efeito para buscar horários quando o usuário escolhe a data (Mock)
  useEffect(() => {
    if (selectedDate) {
      // Simula uma busca na API baseada na data escolhida
      setAvailableTimes(["09:00", "09:45", "10:30", "14:00", "15:30", "17:00"]);
      setSelectedTime(""); // Reseta a hora se trocar a data
    }
  }, [selectedDate]);

  // Ações
  const handleNextStep = () => setCurrentStep((prev) => prev + 1);
  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const handleSelectService = (service: ServiceOption) =>
    setSelectedService(service);
  const handleSelectDate = (date: string) => setSelectedDate(date);
  const handleSelectTime = (time: string) => setSelectedTime(time);

  const handleGoBack = () => {
    navigate("/client");
  };

  const handleConfirmSchedule = async () => {
    setIsLoading(true);
    try {
      // Simula POST na API
      // await api.post("/appointments", { serviceId, date, time });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Sucesso! Redireciona para o dashboard
      navigate("/client");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScheduleContext.Provider
      value={{
        currentStep,
        isLoading,
        services,
        availableTimes,
        selectedService,
        selectedDate,
        selectedTime,
        handleNextStep,
        handlePrevStep,
        handleSelectService,
        handleSelectDate,
        handleSelectTime,
        handleConfirmSchedule,
        handleGoBack,
        t,
      }}
    >
      <ScheduleView />
    </ScheduleContext.Provider>
  );
};

export default ScheduleController;
