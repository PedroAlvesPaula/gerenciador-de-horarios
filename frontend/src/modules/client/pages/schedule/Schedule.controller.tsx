import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleView from "./Schedule.view";
import { ScheduleContext, type ServiceOption } from "./Schedule.context";
import {
  createAppointment,
  getAvailability,
  listCatalogItems,
} from "../../services/scheduling.service";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";

const ScheduleController = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const reloadServices = useCallback(async () => {
    setIsLoadingServices(true);
    setServicesError(null);

    try {
      setServices(await listCatalogItems());
    } catch (error: unknown) {
      setServicesError(
        getApiErrorMessage(error, "Não foi possível carregar os serviços."),
      );
    } finally {
      setIsLoadingServices(false);
    }
  }, []);

  useEffect(() => {
    void reloadServices();
  }, [reloadServices]);

  useEffect(() => {
    let isCurrentRequest = true;

    if (!selectedDate || !selectedService) {
      setAvailableTimes([]);
      setAvailabilityError(null);
      setIsLoadingAvailability(false);
      return () => {
        isCurrentRequest = false;
      };
    }

    setSelectedTime("");
    setAvailableTimes([]);
    setAvailabilityError(null);
    setIsLoadingAvailability(true);

    void getAvailability(selectedDate, selectedService.id)
      .then(({ availableSlots }) => {
        if (isCurrentRequest) setAvailableTimes(availableSlots);
      })
      .catch((error: unknown) => {
        if (!isCurrentRequest) return;

        setAvailabilityError(
          getApiErrorMessage(
            error,
            "Não foi possível consultar os horários disponíveis.",
          ),
        );
      })
      .finally(() => {
        if (isCurrentRequest) setIsLoadingAvailability(false);
      });

    return () => {
      isCurrentRequest = false;
    };
  }, [selectedDate, selectedService]);

  const handleNextStep = useCallback(
    () => setCurrentStep((previous) => Math.min(previous + 1, 2)),
    [],
  );
  const handlePrevStep = useCallback(
    () => setCurrentStep((previous) => Math.max(previous - 1, 0)),
    [],
  );

  const handleSelectService = useCallback((service: ServiceOption) => {
    setSelectedService(service);
    setSelectedTime("");
  }, []);
  const handleSelectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedTime("");
  }, []);
  const handleSelectTime = useCallback(
    (time: string) => setSelectedTime(time),
    [],
  );

  const handleGoBack = useCallback(() => {
    navigate("/client");
  }, [navigate]);

  const handleConfirmSchedule = useCallback(async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      notifyError("Selecione o serviço, a data e o horário.");
      return;
    }

    setIsLoading(true);

    try {
      const scheduledAt = new Date(
        `${selectedDate}T${selectedTime}:00`,
      ).toISOString();

      await createAppointment({
        catalogItemId: selectedService.id,
        scheduledAt,
      });

      notifySuccess("Agendamento realizado com sucesso!");
      navigate("/client", { replace: true });
    } catch (error: unknown) {
      notifyError(
        getApiErrorMessage(error, "Não foi possível realizar o agendamento."),
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate, selectedDate, selectedService, selectedTime]);

  const providerValue = useMemo(
    () => ({
      currentStep,
      isLoading,
      isLoadingServices,
      isLoadingAvailability,
      servicesError,
      availabilityError,
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
      reloadServices,
    }),
    [
      availabilityError,
      availableTimes,
      currentStep,
      handleConfirmSchedule,
      handleGoBack,
      handleNextStep,
      handlePrevStep,
      handleSelectDate,
      handleSelectService,
      handleSelectTime,
      isLoading,
      isLoadingAvailability,
      isLoadingServices,
      reloadServices,
      selectedDate,
      selectedService,
      selectedTime,
      services,
      servicesError,
    ],
  );

  return (
    <ScheduleContext.Provider value={providerValue}>
      <ScheduleView />
    </ScheduleContext.Provider>
  );
};

export default ScheduleController;
