import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import Styles from "./Schedule.styles";
import { type Appointment } from "./Schedule.controller";

interface ScheduleViewProps {
  appointments: Appointment[];
  onStartRoute: (id: string) => void;
}

const ScheduleView = ({ appointments, onStartRoute }: ScheduleViewProps) => {
  return (
    <Styles.PageWrapper>
      <Styles.HeaderTitle variant="h5">Agenda do Dia</Styles.HeaderTitle>

      {appointments.map((appointment) => (
        <Styles.AppointmentCard key={appointment.id}>
          {/* Cabeçalho do Card: Horário e Status */}
          <Styles.TimeRow>
            <Styles.TimeText>{appointment.time}</Styles.TimeText>
            <Styles.StatusBadge>{appointment.status}</Styles.StatusBadge>
          </Styles.TimeRow>

          {/* Informações do Cliente */}
          <Styles.ClientInfo>
            <Styles.ClientName>{appointment.clientName}</Styles.ClientName>

            <Styles.IconTextRow>
              <ContentCutIcon fontSize="small" />
              <Typography variant="body2">{appointment.service}</Typography>
            </Styles.IconTextRow>

            <Styles.IconTextRow>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{appointment.address}</Typography>
            </Styles.IconTextRow>
          </Styles.ClientInfo>

          {/* Ação do Barbeiro */}
          <Button
            variant={
              appointment.status === "Pendente" ? "contained" : "outlined"
            }
            color="primary"
            fullWidth
            onClick={() => onStartRoute(appointment.id)}
            disabled={appointment.status !== "Pendente"}
            sx={{ mt: 1 }}
          >
            {appointment.status === "Pendente" ? "Iniciar Rota" : "A Caminho"}
          </Button>
        </Styles.AppointmentCard>
      ))}
    </Styles.PageWrapper>
  );
};

export default ScheduleView;
