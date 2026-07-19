import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import type {
  AdminAppointmentData,
  AdminAppointmentStatus,
} from "../../services/appointments.service";
import Styles from "../Schedule.styles";

interface AppointmentStatusDialogProps {
  appointment: AdminAppointmentData;
  isSaving: boolean;
  onClose: () => void;
  onEdit: () => void;
  onSave: (status: AdminAppointmentStatus) => Promise<void>;
}

const statusOptions: Array<{
  value: AdminAppointmentStatus;
  label: string;
}> = [
  { value: "PENDING", label: "Pendente" },
  { value: "CONFIRMED", label: "Confirmado" },
  { value: "COMPLETED", label: "Concluído" },
  { value: "CANCELED", label: "Cancelado" },
];

const AppointmentStatusDialog = ({
  appointment,
  isSaving,
  onClose,
  onEdit,
  onSave,
}: AppointmentStatusDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [status, setStatus] = useState<AdminAppointmentStatus>(
    appointment.status,
  );

  return (
    <Dialog
      open
      fullWidth
      fullScreen={fullScreen}
      maxWidth="xs"
      aria-labelledby="status-dialog-title"
      onClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <Styles.DialogTitleRow>
        <DialogTitle id="status-dialog-title">Alterar status</DialogTitle>
        <Tooltip title="Fechar">
          <span>
            <IconButton
              aria-label="Fechar modal de status"
              disabled={isSaving}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Styles.DialogTitleRow>

      <DialogContent dividers>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {appointment.client.name}
        </Typography>
        <FormControl fullWidth disabled={isSaving}>
          <InputLabel id="appointment-status-label">Status</InputLabel>
          <Select
            labelId="appointment-status-label"
            value={status}
            label="Status"
            onChange={(event) =>
              setStatus(event.target.value as AdminAppointmentStatus)
            }
          >
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ px: 2, py: 1.5 }}>
        <Tooltip title="Editar todas as informações">
          <span>
            <IconButton
              color="primary"
              aria-label="Editar informações do agendamento"
              disabled={isSaving}
              onClick={onEdit}
            >
              <EditOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Salvar status">
          <span>
            <IconButton
              color="primary"
              aria-label="Salvar status do agendamento"
              disabled={isSaving || status === appointment.status}
              onClick={() => void onSave(status)}
            >
              {isSaving ? (
                <CircularProgress color="inherit" size={22} />
              ) : (
                <SaveOutlinedIcon />
              )}
            </IconButton>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentStatusDialog;
