import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ScheduleView from "./Schedule.view";
import {
  ScheduleContext,
  type AddressOption,
  type ServiceOption,
} from "./Schedule.context";
import {
  createAppointment,
  getAvailability,
  listCatalogItems,
} from "../../services/scheduling.service";
import { notifyError, notifySuccess } from "../../../../utils/toast";
import { getApiErrorMessage } from "../../../../utils/getApiErrorMessage";
import { listAddresses } from "../../services/addresses.service";

const ScheduleController = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [addresses, setAddresses] = useState<AddressOption[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedAddress, setSelectedAddress] =
    useState<AddressOption | null>(null);

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

  const reloadAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    setAddressesError(null);

    try {
      const savedAddresses = await listAddresses();
      setAddresses(savedAddresses);
      setSelectedAddress((current) =>
        current
          ? (savedAddresses.find(({ id }) => id === current.id) ?? null)
          : null,
      );
    } catch (error: unknown) {
      setAddressesError(
        getApiErrorMessage(error, "Não foi possível carregar seus endereços."),
      );
    } finally {
      setIsLoadingAddresses(false);
    }
  }, []);

  useEffect(() => {
    void reloadServices();
    void reloadAddresses();
  }, [reloadAddresses, reloadServices]);

  useEffect(() => {
    let isCurrentRequest = true;

    if (!selectedDate || selectedServices.length === 0) {
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

    void getAvailability(
      selectedDate,
      selectedServices.map(({ id }) => id),
    )
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
  }, [selectedDate, selectedServices]);

  const handleNextStep = useCallback(
    () => setCurrentStep((previous) => Math.min(previous + 1, 3)),
    [],
  );
  const handlePrevStep = useCallback(
    () => setCurrentStep((previous) => Math.max(previous - 1, 0)),
    [],
  );

  const handleToggleService = useCallback((service: ServiceOption) => {
    setSelectedServices((current) =>
      current.some(({ id }) => id === service.id)
        ? current.filter(({ id }) => id !== service.id)
        : [...current, service],
    );
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
  const handleSelectAddress = useCallback((address: AddressOption) => {
    setSelectedAddress(address);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate("/client");
  }, [navigate]);

  const handleManageAddresses = useCallback(() => {
    navigate("/client/enderecos");
  }, [navigate]);

  const handleConfirmSchedule = useCallback(async () => {
    if (
      selectedServices.length === 0 ||
      !selectedDate ||
      !selectedTime ||
      !selectedAddress
    ) {
      notifyError("Selecione os serviços, a data, o horário e o endereço.");
      return;
    }

    setIsLoading(true);

    try {
      const scheduledAt = new Date(
        `${selectedDate}T${selectedTime}:00`,
      ).toISOString();

      await createAppointment({
        catalogItemIds: selectedServices.map(({ id }) => id),
        scheduledAt,
        addressId: selectedAddress.id,
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
  }, [navigate, selectedAddress, selectedDate, selectedServices, selectedTime]);

  const totalDurationMinutes = useMemo(
    () =>
      selectedServices.reduce(
        (total, service) => total + service.durationMinutes,
        0,
      ),
    [selectedServices],
  );
  const totalPrice = useMemo(
    () =>
      selectedServices.reduce((total, service) => total + service.price, 0),
    [selectedServices],
  );

  const providerValue = useMemo(
    () => ({
      currentStep,
      isLoading,
      isLoadingServices,
      isLoadingAvailability,
      isLoadingAddresses,
      servicesError,
      availabilityError,
      addressesError,
      services,
      availableTimes,
      addresses,
      selectedServices,
      totalDurationMinutes,
      totalPrice,
      selectedDate,
      selectedTime,
      selectedAddress,
      handleNextStep,
      handlePrevStep,
      handleToggleService,
      handleSelectDate,
      handleSelectTime,
      handleSelectAddress,
      handleConfirmSchedule,
      handleGoBack,
      handleManageAddresses,
      reloadServices,
      reloadAddresses,
    }),
    [
      availabilityError,
      addresses,
      addressesError,
      availableTimes,
      currentStep,
      handleConfirmSchedule,
      handleGoBack,
      handleManageAddresses,
      handleNextStep,
      handlePrevStep,
      handleSelectDate,
      handleToggleService,
      handleSelectTime,
      handleSelectAddress,
      isLoading,
      isLoadingAvailability,
      isLoadingAddresses,
      isLoadingServices,
      reloadServices,
      reloadAddresses,
      selectedAddress,
      selectedDate,
      selectedServices,
      selectedTime,
      services,
      servicesError,
      totalDurationMinutes,
      totalPrice,
    ],
  );

  return (
    <ScheduleContext.Provider value={providerValue}>
      <ScheduleView />
    </ScheduleContext.Provider>
  );
};

export default ScheduleController;
