import Styles from "./Schedule.styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useSchedule } from "./Schedule.context";

const ScheduleView = () => {
  // A View busca tudo do contexto
  const {
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
  } = useSchedule();

  const isNextDisabled =
    (currentStep === 0 && !selectedService) ||
    (currentStep === 1 && (!selectedDate || !selectedTime));

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
        {/* PASSO 0: Escolher Serviço */}
        {currentStep === 0 && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              O que vamos fazer hoje?
            </Styles.StepTitle>
            {services.map((service) => (
              <Styles.SelectableCard
                key={service.id}
                isSelected={selectedService?.id === service.id}
                onClick={() => handleSelectService(service)}
              >
                <Styles.ServiceInfo>
                  <Typography variant="h6">{service.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {service.durationMinutes} minutos
                  </Typography>
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
              type="date"
              value={selectedDate}
              onChange={(e) => handleSelectDate(e.target.value)}
              inputProps={{ min: new Date().toISOString().split("T")[0] }}
            />

            {selectedDate && (
              <Styles.TimeGrid>
                {availableTimes.map((time) => (
                  <Styles.TimeChip
                    key={time}
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

      {/* FOOTER FIXO DE AÇÃO */}
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
