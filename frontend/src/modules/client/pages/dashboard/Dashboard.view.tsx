// import { useTranslation } from "react-i18next";
import Styles from "./Dashboard.styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import HistoryIcon from "@mui/icons-material/History";
import AddIcon from "@mui/icons-material/Add";
import { type AppointmentData } from "../../types/appointmentTypes";

interface ClientDashboardViewProps {
  isLoading: boolean;
  upcomingAppointments: AppointmentData[];
  historyAppointments: AppointmentData[];
  onLogout: () => void;
  onNewSchedule: () => void;
}

const DashboardView = ({
  isLoading,
  upcomingAppointments,
  historyAppointments,
  onNewSchedule,
}: ClientDashboardViewProps) => {
  // const { t } = useTranslation();

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
            Olá, Cliente
          </Styles.WelcomeTitle>
          <Styles.WelcomeSubtitle variant="subtitle1" component="p">
            Gerencie seus horários e agende novos serviços.
          </Styles.WelcomeSubtitle>
        </Box>

        {upcomingAppointments.length === 0 && (
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
            <Styles.ActionLink onClick={onNewSchedule}>
              Agendar agora →
            </Styles.ActionLink>
          </Styles.EmptyStateCard>
        )}

        <Grid container spacing={6}>
          <Grid sx={{ xs: 12, md: 6 }}>
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
                        {apt.service.name}
                      </Styles.ServiceName>
                      <Styles.ServiceDate variant="body2">
                        {new Date(apt.scheduledAt).toLocaleDateString("pt-BR")}
                      </Styles.ServiceDate>
                    </Box>
                    <Styles.StatusBadge variant="caption">
                      {apt.status}
                    </Styles.StatusBadge>
                  </Styles.HistoryCard>
                ))}
              </Box>
            )}
          </Grid>

          <Grid sx={{ xs: 12, md: 6 }}>
            <Styles.SectionHeader>
              <HistoryIcon sx={{ fontSize: 20 }} />
              <Styles.SectionTitle variant="subtitle1">
                Histórico Recente
              </Styles.SectionTitle>
            </Styles.SectionHeader>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {historyAppointments.map((apt) => (
                <Styles.HistoryCard key={apt.id}>
                  <Box>
                    <Styles.ServiceName variant="body1">
                      {apt.service.name}
                    </Styles.ServiceName>
                    <Styles.ServiceDate variant="body2">
                      {new Date(apt.scheduledAt).toLocaleDateString("pt-BR")}
                    </Styles.ServiceDate>
                  </Box>
                  <Styles.StatusBadge variant="caption">
                    {apt.status === "COMPLETED" ? "REALIZADO" : apt.status}
                  </Styles.StatusBadge>
                </Styles.HistoryCard>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Styles.MainContent>

      <Styles.FloatingButton aria-label="add" onClick={onNewSchedule}>
        <AddIcon />
      </Styles.FloatingButton>
    </Styles.PageWrapper>
  );
};

export default DashboardView;
