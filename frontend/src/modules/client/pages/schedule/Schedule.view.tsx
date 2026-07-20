import Styles from "./Schedule.styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
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
  const {
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
  } = useSchedule();

  const isNextDisabled =
    (currentStep === 0 &&
      (selectedServices.length === 0 || isLoadingServices)) ||
    (currentStep === 1 &&
      (!selectedDate || !selectedTime || isLoadingAvailability)) ||
    (currentStep === 2 && (!selectedAddress || isLoadingAddresses));

  return (
    <Styles.PageWrapper>
      <Styles.MainContent>
        <Styles.StepNavigation>
          <Styles.BackButton
            aria-label={currentStep === 0 ? "Voltar ao início" : "Voltar etapa"}
            onClick={currentStep === 0 ? handleGoBack : handlePrevStep}
          >
            <ArrowBackIcon />
          </Styles.BackButton>
          <Styles.Title variant="h6" component="h1">
            {currentStep === 0 && "Escolha os Serviços"}
            {currentStep === 1 && "Escolha o Horário"}
            {currentStep === 2 && "Escolha o Endereço"}
            {currentStep === 3 && "Confirmar Agendamento"}
          </Styles.Title>
        </Styles.StepNavigation>

        {currentStep === 0 && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              Selecione um ou mais serviços
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
              services.map((service) => {
                const isSelected = selectedServices.some(
                  ({ id }) => id === service.id,
                );

                return (
                  <Styles.SelectableCard
                    key={service.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    isSelected={isSelected}
                    onClick={() => handleToggleService(service)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleToggleService(service);
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
                    <Styles.ServiceSelection>
                      <Typography variant="h6" color="secondary.main">
                        R$ {service.price.toFixed(2).replace(".", ",")}
                      </Typography>
                      {isSelected && (
                        <CheckCircleOutlinedIcon color="secondary" />
                      )}
                    </Styles.ServiceSelection>
                  </Styles.SelectableCard>
                );
              })}

            {selectedServices.length > 0 && (
              <Styles.SelectionSummary>
                <Typography fontWeight={700}>
                  {selectedServices.length} serviço(s) selecionado(s)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {totalDurationMinutes} minutos • R${" "}
                  {totalPrice.toFixed(2).replace(".", ",")}
                </Typography>
              </Styles.SelectionSummary>
            )}
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

        {currentStep === 2 && (
          <Box>
            <Styles.StepTitle variant="h5" component="h2">
              Onde os serviços serão prestados?
            </Styles.StepTitle>

            {isLoadingAddresses && (
              <Styles.CenteredState>
                <CircularProgress size={28} />
              </Styles.CenteredState>
            )}

            {addressesError && (
              <Alert
                severity="error"
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={reloadAddresses}
                  >
                    Tentar novamente
                  </Button>
                }
              >
                {addressesError}
              </Alert>
            )}

            {!isLoadingAddresses &&
              !addressesError &&
              addresses.length === 0 && (
                <Alert
                  severity="info"
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleManageAddresses}
                    >
                      Cadastrar
                    </Button>
                  }
                >
                  Cadastre um endereço antes de continuar o agendamento.
                </Alert>
              )}

            {!isLoadingAddresses &&
              !addressesError &&
              addresses.map((address) => {
                const isSelected = selectedAddress?.id === address.id;

                return (
                  <Styles.SelectableCard
                    key={address.id}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    isSelected={isSelected}
                    onClick={() => handleSelectAddress(address)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSelectAddress(address);
                      }
                    }}
                  >
                    <Styles.AddressInfo>
                      <PlaceOutlinedIcon color="secondary" />
                      <Box>
                        <Typography variant="h6">
                          {address.street}, {address.number}
                        </Typography>
                        {address.complement && (
                          <Typography variant="body2" color="text.secondary">
                            {address.complement}
                          </Typography>
                        )}
                        <Typography variant="body2" color="text.secondary">
                          {address.neighborhood} • {address.city}/
                          {address.state}
                        </Typography>
                        {address.zipCode && (
                          <Typography variant="body2" color="text.secondary">
                            CEP {address.zipCode}
                          </Typography>
                        )}
                      </Box>
                    </Styles.AddressInfo>
                    {isSelected && (
                      <CheckCircleOutlinedIcon color="secondary" />
                    )}
                  </Styles.SelectableCard>
                );
              })}

            {addresses.length > 0 && (
              <Button onClick={handleManageAddresses}>
                Gerenciar endereços
              </Button>
            )}
          </Box>
        )}

        {currentStep === 3 &&
          selectedServices.length > 0 &&
          selectedAddress && (
            <Box>
              <Styles.StepTitle variant="h5" component="h2">
                Resumo do seu horário
              </Styles.StepTitle>

              <Styles.SummaryBox>
                <Box>
                  <Typography color="text.secondary" sx={{ mb: 1 }}>
                    Serviços
                  </Typography>
                  {selectedServices.map((service) => (
                    <Styles.SummaryRow key={service.id}>
                      <Typography>{service.name}</Typography>
                      <Typography>
                        R$ {service.price.toFixed(2).replace(".", ",")}
                      </Typography>
                    </Styles.SummaryRow>
                  ))}
                </Box>
                <Styles.SummaryRow>
                  <Typography color="text.secondary">Duração total</Typography>
                  <Typography>{totalDurationMinutes} minutos</Typography>
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
                <Styles.SummaryRow>
                  <Typography color="text.secondary">Endereço</Typography>
                  <Styles.SummaryAddress>
                    {selectedAddress.street}, {selectedAddress.number}
                    {selectedAddress.complement
                      ? ` • ${selectedAddress.complement}`
                      : ""}
                    <br />
                    {selectedAddress.neighborhood} • {selectedAddress.city}/
                    {selectedAddress.state}
                  </Styles.SummaryAddress>
                </Styles.SummaryRow>
                <Box
                  sx={{ borderTop: "1px dashed rgba(61, 48, 33, 0.2)", my: 1 }}
                />
                <Styles.SummaryRow>
                  <Typography color="text.secondary">Total a pagar</Typography>
                  <Typography variant="h6" color="primary.main">
                    R$ {totalPrice.toFixed(2).replace(".", ",")}
                  </Typography>
                </Styles.SummaryRow>
              </Styles.SummaryBox>
            </Box>
          )}
      </Styles.MainContent>

      <Styles.BottomBar>
        {currentStep === 3 ? (
          <Styles.ActionButton
            variant="contained"
            onClick={handleConfirmSchedule}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirmar e Agendar"
            )}
          </Styles.ActionButton>
        ) : (
          <Styles.ActionButton
            variant="contained"
            onClick={handleNextStep}
            disabled={isNextDisabled}
          >
            Avançar
          </Styles.ActionButton>
        )}
      </Styles.BottomBar>
    </Styles.PageWrapper>
  );
};

export default ScheduleView;
