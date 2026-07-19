import AddIcon from "@mui/icons-material/Add";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EventIcon from "@mui/icons-material/Event";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonIcon from "@mui/icons-material/Person";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip, { type ChipProps } from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { EntityCard } from "../../../components/sysCard/sysCard.view";
import SysConfirmDialog from "../../../components/sysConfirmDialog/SysConfirmDialog";
import type {
  AdminAddressData,
  AdminAppointmentStatus,
} from "../services/appointments.service";
import { useAdminSchedule } from "./Schedule.context";
import Styles from "./Schedule.styles";
import AppointmentDetailsDialog from "./components/AppointmentDetailsDialog";
import AppointmentStatusDialog from "./components/AppointmentStatusDialog";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
  timeStyle: "short",
});

const statusConfig: Record<
  AdminAppointmentStatus,
  { label: string; color: ChipProps["color"] }
> = {
  PENDING: { label: "Pendente", color: "warning" },
  CONFIRMED: { label: "Confirmado", color: "info" },
  COMPLETED: { label: "Concluído", color: "success" },
  CANCELED: { label: "Cancelado", color: "default" },
};

const formatAddress = (address: AdminAddressData | null) =>
  address
    ? `${address.street}, ${address.number} — ${address.neighborhood}, ${address.city}/${address.state}`
    : "Endereço não informado";

const ScheduleView = () => {
  const {
    appointments,
    clients,
    catalogItems,
    isLoading,
    isSaving,
    deletingAppointmentId,
    errorMessage,
    statusAppointment,
    detailsMode,
    detailsAppointment,
    appointmentToDelete,
    reloadAppointments,
    openCreate,
    openStatus,
    closeStatus,
    saveStatus,
    openDetailsFromStatus,
    closeDetails,
    saveDetails,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useAdminSchedule();

  return (
    <Styles.PageWrapper>
      <Styles.PageHeader>
        <Box>
          <Styles.PageTitle variant="h4" component="h1">
            Agendamentos
          </Styles.PageTitle>
          <Typography color="text.secondary">
            Consulte e gerencie a agenda da barbearia.
          </Typography>
        </Box>
        <Tooltip title="Novo agendamento">
          <IconButton
            color="primary"
            size="large"
            aria-label="Criar novo agendamento"
            onClick={openCreate}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Styles.PageHeader>

      <Box component="section" aria-labelledby="appointments-list-title">
        <Styles.ListHeader>
          <Typography id="appointments-list-title" variant="h6" component="h2">
            Agenda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointments.length} item(ns)
          </Typography>
        </Styles.ListHeader>

        {isLoading && (
          <Styles.CenteredState>
            <CircularProgress aria-label="Carregando agendamentos" />
          </Styles.CenteredState>
        )}

        {!isLoading && errorMessage && (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void reloadAppointments()}
              >
                Tentar novamente
              </Button>
            }
          >
            {errorMessage}
          </Alert>
        )}

        {!isLoading && !errorMessage && appointments.length === 0 && (
          <Alert severity="info">Nenhum agendamento encontrado.</Alert>
        )}

        {!isLoading && !errorMessage && appointments.length > 0 && (
          <Styles.AppointmentsGrid>
            {appointments.map((appointment) => {
              const status = statusConfig[appointment.status];
              const serviceNames = appointment.items
                .map((item) => item.catalogItem.name)
                .join(", ");

              return (
                <EntityCard
                  key={appointment.id}
                  title={dateTimeFormatter.format(
                    new Date(appointment.scheduledAt),
                  )}
                  leading={<EventIcon color="secondary" />}
                  meta={
                    <>
                      <Chip
                        size="small"
                        color={status.color}
                        label={status.label}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {appointment.durationMinutes} min
                      </Typography>
                    </>
                  }
                  actions={[
                    {
                      label: "Editar",
                      icon: <EditOutlinedIcon />,
                      iconOnly: true,
                      onClick: () => openStatus(appointment),
                      ariaLabel: `Editar agendamento de ${appointment.client.name}`,
                    },
                    {
                      label: "Excluir",
                      icon: <DeleteOutlinedIcon />,
                      iconOnly: true,
                      color: "error",
                      disabled: deletingAppointmentId === appointment.id,
                      onClick: () => requestDelete(appointment),
                      ariaLabel: `Excluir agendamento de ${appointment.client.name}`,
                    },
                  ]}
                >
                  <Styles.CardDetails>
                    <Styles.IconTextRow>
                      <PersonIcon />
                      <Typography variant="body2">
                        {appointment.client.name}
                      </Typography>
                    </Styles.IconTextRow>
                    <Styles.IconTextRow>
                      <ContentCutIcon />
                      <Typography variant="body2">
                        {serviceNames || "Serviço não informado"}
                      </Typography>
                    </Styles.IconTextRow>
                    <Styles.IconTextRow>
                      <LocationOnOutlinedIcon />
                      <Typography variant="body2">
                        {formatAddress(appointment.address)}
                      </Typography>
                    </Styles.IconTextRow>
                  </Styles.CardDetails>
                </EntityCard>
              );
            })}
          </Styles.AppointmentsGrid>
        )}
      </Box>

      {statusAppointment && (
        <AppointmentStatusDialog
          appointment={statusAppointment}
          isSaving={isSaving}
          onClose={closeStatus}
          onEdit={openDetailsFromStatus}
          onSave={saveStatus}
        />
      )}

      {detailsMode && (
        <AppointmentDetailsDialog
          mode={detailsMode}
          appointment={detailsAppointment}
          clients={clients}
          catalogItems={catalogItems}
          isSaving={isSaving}
          onClose={closeDetails}
          onSubmit={saveDetails}
        />
      )}

      {appointmentToDelete && (
        <SysConfirmDialog
          title="Excluir agendamento?"
          description={`O agendamento de ${appointmentToDelete.client.name} será excluído permanentemente.`}
          isLoading={deletingAppointmentId === appointmentToDelete.id}
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </Styles.PageWrapper>
  );
};

export default ScheduleView;
