import CloseIcon from "@mui/icons-material/Close";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AddIcon from "@mui/icons-material/Add";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Controller } from "react-hook-form";
import { FormWrapper } from "../../../../components/formWrapper/FormWrapper";
import SysInput from "../../../../components/sysInput/SysInput";
import type { CatalogItemData } from "../../services/catalog.service";
import type {
  AdminAppointmentData,
  AppointmentClientData,
} from "../../services/appointments.service";
import {
  appointmentSchema,
  type AppointmentFormData,
} from "../appointmentSchema";
import Styles from "../Schedule.styles";

interface AppointmentDetailsDialogProps {
  mode: "create" | "edit";
  appointment: AdminAppointmentData | null;
  clients: AppointmentClientData[];
  catalogItems: CatalogItemData[];
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
}

const getZonedDateParts = (date: Date) => {
  const parts = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    time: `${get("hour")}:${get("minute")}`,
  };
};

const getDefaultValues = (
  appointment: AdminAppointmentData | null,
): AppointmentFormData => {
  const dateParts = getZonedDateParts(
    appointment ? new Date(appointment.scheduledAt) : new Date(),
  );

  return {
    clientId: appointment?.clientId ?? "",
    catalogItemIds:
      appointment?.items.map((item) => item.catalogItem.id) ?? [],
    addressId: appointment?.addressId ?? "",
    date: dateParts.date,
    time: appointment ? dateParts.time : "09:00",
  };
};

const formatAddress = (address: AppointmentClientData["addresses"][number]) =>
  `${address.street}, ${address.number} — ${address.neighborhood}`;

const AppointmentDetailsDialog = ({
  mode,
  appointment,
  clients,
  catalogItems,
  isSaving,
  onClose,
  onSubmit,
}: AppointmentDetailsDialogProps) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open
      fullWidth
      fullScreen={fullScreen}
      maxWidth="sm"
      aria-labelledby="details-dialog-title"
      onClose={() => {
        if (!isSaving) onClose();
      }}
    >
      <FormWrapper<AppointmentFormData>
        schema={appointmentSchema}
        defaultValues={getDefaultValues(appointment)}
        onSubmit={onSubmit}
        mode="onChange"
      >
        {({
          control,
          register,
          setValue,
          watch,
          formState: { errors, isSubmitting },
        }) => {
          const selectedClient = clients.find(
            (client) => client.id === watch("clientId"),
          );
          const disabled = isSaving || isSubmitting;

          return (
            <>
              <Styles.DialogTitleRow>
                <DialogTitle id="details-dialog-title">
                  {mode === "edit" ? "Editar agendamento" : "Novo agendamento"}
                </DialogTitle>
                <Tooltip title="Fechar">
                  <span>
                    <IconButton
                      aria-label="Fechar formulário de agendamento"
                      disabled={disabled}
                      onClick={onClose}
                    >
                      <CloseIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Styles.DialogTitleRow>

              <DialogContent dividers>
                <Styles.FormFields>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth error={Boolean(errors.clientId)}>
                        <InputLabel id="appointment-client-label">
                          Cliente
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="appointment-client-label"
                          label="Cliente"
                          disabled={disabled}
                          onChange={(event) => {
                            field.onChange(event.target.value);
                            setValue("addressId", "", {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        >
                          {clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>
                              {client.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>{errors.clientId?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="catalogItemIds"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.catalogItemIds)}
                      >
                        <InputLabel id="appointment-services-label">
                          Serviços
                        </InputLabel>
                        <Select
                          {...field}
                          multiple
                          labelId="appointment-services-label"
                          label="Serviços"
                          disabled={disabled}
                          renderValue={(selected) =>
                            catalogItems
                              .filter((item) => selected.includes(item.id))
                              .map((item) => item.name)
                              .join(", ")
                          }
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(
                              typeof value === "string" ? value.split(",") : value,
                            );
                          }}
                        >
                          {catalogItems.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              <Checkbox checked={field.value.includes(item.id)} />
                              <ListItemText
                                primary={item.name}
                                secondary={`${item.durationMinutes} min`}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.catalogItemIds?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="addressId"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={Boolean(errors.addressId)}
                        disabled={disabled || !selectedClient}
                      >
                        <InputLabel id="appointment-address-label">
                          Endereço
                        </InputLabel>
                        <Select
                          {...field}
                          labelId="appointment-address-label"
                          label="Endereço"
                        >
                          {selectedClient?.addresses.map((address) => (
                            <MenuItem key={address.id} value={address.id}>
                              {formatAddress(address)}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {errors.addressId?.message ??
                            (selectedClient?.addresses.length === 0
                              ? "Este cliente ainda não possui endereço."
                              : undefined)}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Styles.DateTimeFields>
                    <SysInput
                      registration={register("date")}
                      errorMessage={errors.date?.message}
                      label="Data"
                      type="date"
                      fullWidth
                      required
                      disabled={disabled}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <SysInput
                      registration={register("time")}
                      errorMessage={errors.time?.message}
                      label="Horário"
                      type="time"
                      fullWidth
                      required
                      disabled={disabled}
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Styles.DateTimeFields>
                </Styles.FormFields>
              </DialogContent>

              <DialogActions sx={{ px: 2, py: 1.5 }}>
                <Tooltip
                  title={mode === "edit" ? "Salvar alterações" : "Criar agendamento"}
                >
                  <span>
                    <IconButton
                      type="submit"
                      color="primary"
                      aria-label={
                        mode === "edit"
                          ? "Salvar alterações do agendamento"
                          : "Criar agendamento"
                      }
                      disabled={disabled}
                    >
                      {disabled ? (
                        <CircularProgress color="inherit" size={22} />
                      ) : mode === "edit" ? (
                        <SaveOutlinedIcon />
                      ) : (
                        <AddIcon />
                      )}
                    </IconButton>
                  </span>
                </Tooltip>
              </DialogActions>
            </>
          );
        }}
      </FormWrapper>
    </Dialog>
  );
};

export default AppointmentDetailsDialog;
