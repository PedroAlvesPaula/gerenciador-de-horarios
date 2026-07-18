import Styles from "./Schedule.styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useSchedule } from "./Schedule.context";

const getTodayForDateInput = (): string => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const ScheduleView = () => {
  // A View busca tudo do contexto
  const {
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
  } = useSchedule();

  const isNextDisabled =
    (currentStep === 0 && (!selectedService || isLoadingServices)) ||
    (currentStep === 1 &&
      (!selectedDate || !selectedTime || isLoadingAvailability));

  return (
    <Styles.PageWrapper>
      <Styles.Header>
        <Styles.BackButton
          onClick={currentStep === 0 ? handleGoBack : handlePrevStep}
        >
          <ArrowBackIcon />
        </Styles.BackButton>
        <Styles.Title variant="h6" component="h1">
          {currentStep === 0 && "Escolha o Serviço"}
          {currentStep === 1 && "Escolha o Horário"}
          {currentStep === 2 && "Confirmar Agendamento"}
        </Styles.Title>
      </Styles.Header>

      <Styles.MainContent>
        {currentStep === 0 && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              O que vamos fazer hoje?
            </Styles.StepTitle>
            {isLoadingServices && (
              <Styles.CenteredState>
                <CircularProgress size={28} />
              </Styles.CenteredState>
            )}

            {servicesError && (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={reloadServices}>
                    Tentar novamente
                  </Button>
                }
              >
                {servicesError}
              </Alert>
            )}

            {!isLoadingServices && !servicesError && services.length === 0 && (
              <Alert severity="info">
                Nenhum serviço está disponível no catálogo.
              </Alert>
            )}

            {!isLoadingServices &&
              services.map((service) => (
                <Styles.SelectableCard
                  key={service.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={selectedService?.id === service.id}
                  isSelected={selectedService?.id === service.id}
                  onClick={() => handleSelectService(service)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSelectService(service);
                    }
                  }}
                >
                  <Styles.ServiceInfo>
                    <Typography variant="h6">{service.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.durationMinutes} minutos
                    </Typography>
                    {service.description && (
                      <Typography variant="body2" color="text.secondary">
                        {service.description}
                      </Typography>
                    )}
                  </Styles.ServiceInfo>
                  <Typography variant="h6" color="secondary.main">
                    R$ {service.price.toFixed(2).replace(".", ",")}
                  </Typography>
                </Styles.SelectableCard>
              ))}
          </Box>
        )}

        {currentStep === 1 && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              Quando você quer vir?
            </Styles.StepTitle>

            <Styles.DateInput
              label="Data"
              type="date"
              value={selectedDate}
              onChange={(e) => handleSelectDate(e.target.value)}
              slotProps={{
                htmlInput: { min: getTodayForDateInput() },
                inputLabel: { shrink: true },
              }}
            />

            {isLoadingAvailability && (
              <Styles.CenteredState>
                <CircularProgress size={28} />
                <Typography color="text.secondary">
                  Consultando horários...
                </Typography>
              </Styles.CenteredState>
            )}

            {availabilityError && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {availabilityError}
              </Alert>
            )}

            {selectedDate &&
              !isLoadingAvailability &&
              !availabilityError &&
              availableTimes.length === 0 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                  Não há horários disponíveis para esta data.
                </Alert>
              )}

            {!isLoadingAvailability && availableTimes.length > 0 && (
              <Styles.TimeGrid>
                {availableTimes.map((time) => (
                  <Styles.TimeChip
                    key={time}
                    aria-pressed={selectedTime === time}
                    isSelected={selectedTime === time}
                    onClick={() => handleSelectTime(time)}
                  >
                    {time}
                  </Styles.TimeChip>
                ))}
              </Styles.TimeGrid>
            )}
          </Box>
        )}

        {currentStep === 2 && selectedService && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              Resumo do seu horário
            </Styles.StepTitle>

            <Styles.SummaryBox>
              <Styles.SummaryRow>
                <Typography color="text.secondary">Serviço</Typography>
                <Typography>{selectedService.name}</Typography>
              </Styles.SummaryRow>
              <Styles.SummaryRow>
                <Typography color="text.secondary">Data</Typography>
                <Typography>
                  {selectedDate.split("-").reverse().join("/")}
                </Typography>
              </Styles.SummaryRow>
              <Styles.SummaryRow>
                <Typography color="text.secondary">Horário</Typography>
                <Typography>{selectedTime}</Typography>
              </Styles.SummaryRow>
              <Box
                sx={{ borderTop: "1px dashed rgba(61, 48, 33, 0.2)", my: 1 }}
              />
              <Styles.SummaryRow>
                <Typography color="text.secondary">Total a pagar</Typography>
                <Typography variant="h6" color="primary.main">
                  R$ {selectedService.price.toFixed(2).replace(".", ",")}
                </Typography>
              </Styles.SummaryRow>
            </Styles.SummaryBox>
          </Box>
        )}
      </Styles.MainContent>

      <Styles.BottomBar>
        {currentStep === 2 ? (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleConfirmSchedule}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirmar e Agendar"
            )}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleNextStep}
            disabled={isNextDisabled}
          >
            Avançar
          </Button>
        )}
      </Styles.BottomBar>
    </Styles.PageWrapper>
  );
};

export default ScheduleView;
