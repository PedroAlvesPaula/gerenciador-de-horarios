import Styles from "./Dashboard.styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useDashboard } from "./Dashboard.context";
import type { AppointmentAddressData } from "../../types/appointmentTypes";
import { Typography } from "@mui/material";

const statusLabels = {
  PENDING: "PENDENTE",
  CONFIRMED: "CONFIRMADO",
  COMPLETED: "REALIZADO",
  CANCELED: "CANCELADO",
} as const;

const formatAppointmentDate = (value: string): string =>
  new Date(value).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });

const formatServices = (services: { name: string }[]): string =>
  services.map(({ name }) => name).join(" + ");

const formatAddress = (address: AppointmentAddressData | null): string => {
  if (!address) return "Endereço não informado";

  return [
    `${address.street}, ${address.number}`,
    address.complement,
    `${address.neighborhood}, ${address.city}/${address.state}`,
  ]
    .filter(Boolean)
    .join(" • ");
};

const DashboardView = () => {
  const {
    isLoading,
    errorMessage,
    upcomingAppointments,
    historyAppointments,
    userName,
    handleNewSchedule,
    reloadAppointments,
  } = useDashboard();

  if (isLoading) {
    return (
      <Styles.PageWrapper
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <CircularProgress color="primary" />
      </Styles.PageWrapper>
    );
  }

  return (
    <Styles.PageWrapper>
      <Styles.MainContent>
        <Box sx={{ mb: 4 }}>
          <Styles.WelcomeTitle variant="h4" component="h2">
            Olá, {userName}
          </Styles.WelcomeTitle>
          <Styles.WelcomeSubtitle variant="subtitle1" component="p">
            Gerencie seus horários e agende novos serviços.
          </Styles.WelcomeSubtitle>
        </Box>

        {errorMessage && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
            action={
              <Button color="inherit" size="small" onClick={reloadAppointments}>
                Tentar novamente
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {!errorMessage && upcomingAppointments.length === 0 && (
          <Styles.EmptyStateCard>
            <CalendarTodayIcon
              sx={{ fontSize: 50, color: "action.disabled", mb: 2 }}
            />
            <Styles.EmptyStateTitle variant="h6">
              Nenhum agendamento futuro
            </Styles.EmptyStateTitle>
            <Styles.EmptyStateSubtitle variant="body2">
              Que tal renovar o visual hoje?
            </Styles.EmptyStateSubtitle>
            <Styles.ActionLink onClick={handleNewSchedule}>
              Agendar agora →
            </Styles.ActionLink>
          </Styles.EmptyStateCard>
        )}

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Styles.SectionHeader>
              <CalendarTodayIcon sx={{ fontSize: 20 }} />
              <Styles.SectionTitle variant="subtitle1">
                Próximos Horários
              </Styles.SectionTitle>
            </Styles.SectionHeader>

            {upcomingAppointments.length === 0 ? (
              <Styles.ServiceDate sx={{ fontStyle: "italic" }}>
                Sem outros agendamentos.
              </Styles.ServiceDate>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {upcomingAppointments.map((apt) => (
                  <Styles.HistoryCard key={apt.id}>
                    <Box>
                      <Styles.ServiceName variant="body1">
                        {formatServices(apt.services)}
                      </Styles.ServiceName>
                      <Styles.ServiceDate variant="body2">
                        {formatAppointmentDate(apt.scheduledAt)} •{" "}
                        {apt.durationMinutes} min
                      </Styles.ServiceDate>
                      <Styles.AddressRow>
                        <PlaceOutlinedIcon />
                        <Typography variant="body2">
                          {formatAddress(apt.address)}
                        </Typography>
                      </Styles.AddressRow>
                    </Box>
                    <Styles.StatusBadge variant="caption">
                      {statusLabels[apt.status]}
                    </Styles.StatusBadge>
                  </Styles.HistoryCard>
                ))}
              </Box>
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Styles.SectionHeader>
              <HistoryIcon sx={{ fontSize: 20 }} />
              <Styles.SectionTitle variant="subtitle1">
                Histórico Recente
              </Styles.SectionTitle>
            </Styles.SectionHeader>

            {historyAppointments.length === 0 ? (
              <Styles.ServiceDate sx={{ fontStyle: "italic" }}>
                Seu histórico ainda está vazio.
              </Styles.ServiceDate>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {historyAppointments.map((apt) => (
                  <Styles.HistoryCard key={apt.id}>
                    <Box>
                      <Styles.ServiceName variant="body1">
                        {formatServices(apt.services)}
                      </Styles.ServiceName>
                      <Styles.ServiceDate variant="body2">
                        {formatAppointmentDate(apt.scheduledAt)} •{" "}
                        {apt.durationMinutes} min
                      </Styles.ServiceDate>
                      <Styles.AddressRow>
                        <PlaceOutlinedIcon />
                        <Typography variant="body2">
                          {formatAddress(apt.address)}
                        </Typography>
                      </Styles.AddressRow>
                    </Box>
                    <Styles.StatusBadge variant="caption">
                      {statusLabels[apt.status]}
                    </Styles.StatusBadge>
                  </Styles.HistoryCard>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Styles.MainContent>

      <Styles.FloatingButton
        aria-label="Novo agendamento"
        onClick={handleNewSchedule}
      >
        <AddIcon />
      </Styles.FloatingButton>
    </Styles.PageWrapper>
  );
};

export default DashboardView;
