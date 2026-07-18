import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import Styles from "./BusinessSettings.styles";
import { useBusinessSettings } from "./BusinessSettings.context";

const weekDayLabels = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const getTodayForDateInput = (): string => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const formatDateOnly = (value: string): string =>
  value.slice(0, 10).split("-").reverse().join("/");

const BusinessSettingsView = () => {
  const {
    businessHours,
    daysOff,
    isLoading,
    savingDay,
    isSavingDayOff,
    errorMessage,
    newDayOffDate,
    newDayOffReason,
    updateBusinessHourField,
    toggleBusinessDay,
    saveBusinessDay,
    setNewDayOffDate,
    setNewDayOffReason,
    addDayOff,
    removeDayOff,
    reloadSettings,
  } = useBusinessSettings();

  if (isLoading) {
    return (
      <Styles.CenteredPage>
        <CircularProgress />
      </Styles.CenteredPage>
    );
  }

  return (
    <Styles.PageWrapper>
      <Box>
        <Styles.PageTitle variant="h4" component="h1">
          Configurações do negócio
        </Styles.PageTitle>
        <Typography color="text.secondary">
          Defina o expediente semanal e as exceções do calendário.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={reloadSettings}>
              Tentar novamente
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      <Box component="section">
        <Styles.SectionTitle variant="h6">
          Horário de funcionamento
        </Styles.SectionTitle>

        <Styles.WeekGrid>
          {businessHours.map((hour) => (
            <Styles.SettingCard key={hour.dayOfWeek}>
              <Styles.CardHeader>
                <Typography fontWeight={700}>
                  {weekDayLabels[hour.dayOfWeek]}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {hour.enabled ? "Aberto" : "Fechado"}
                  </Typography>
                  <Switch
                    checked={hour.enabled}
                    disabled={savingDay === hour.dayOfWeek}
                    onChange={(_, checked) => {
                      void toggleBusinessDay(hour.dayOfWeek, checked);
                    }}
                    inputProps={{
                      "aria-label": `Funcionamento de ${weekDayLabels[hour.dayOfWeek]}`,
                    }}
                  />
                </Box>
              </Styles.CardHeader>

              {hour.enabled && (
                <>
                  <Styles.TimeFields>
                    <TextField
                      label="Abertura"
                      type="time"
                      size="small"
                      value={hour.openTime}
                      onChange={(event) =>
                        updateBusinessHourField(
                          hour.dayOfWeek,
                          "openTime",
                          event.target.value,
                        )
                      }
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                      label="Fechamento"
                      type="time"
                      size="small"
                      value={hour.closeTime}
                      onChange={(event) =>
                        updateBusinessHourField(
                          hour.dayOfWeek,
                          "closeTime",
                          event.target.value,
                        )
                      }
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                      label="Início do intervalo"
                      type="time"
                      size="small"
                      value={hour.breakStart}
                      onChange={(event) =>
                        updateBusinessHourField(
                          hour.dayOfWeek,
                          "breakStart",
                          event.target.value,
                        )
                      }
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                    <TextField
                      label="Fim do intervalo"
                      type="time"
                      size="small"
                      value={hour.breakEnd}
                      onChange={(event) =>
                        updateBusinessHourField(
                          hour.dayOfWeek,
                          "breakEnd",
                          event.target.value,
                        )
                      }
                      slotProps={{ inputLabel: { shrink: true } }}
                    />
                  </Styles.TimeFields>

                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      savingDay === hour.dayOfWeek ? (
                        <CircularProgress color="inherit" size={16} />
                      ) : (
                        <SaveOutlinedIcon />
                      )
                    }
                    disabled={savingDay === hour.dayOfWeek}
                    onClick={() => void saveBusinessDay(hour.dayOfWeek)}
                  >
                    Salvar dia
                  </Button>
                </>
              )}
            </Styles.SettingCard>
          ))}
        </Styles.WeekGrid>
      </Box>

      <Box component="section">
        <Styles.SectionTitle variant="h6">
          Folgas e feriados
        </Styles.SectionTitle>

        <Styles.DayOffForm>
          <TextField
            label="Data"
            type="date"
            size="small"
            value={newDayOffDate}
            onChange={(event) => setNewDayOffDate(event.target.value)}
            slotProps={{
              htmlInput: { min: getTodayForDateInput() },
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Motivo (opcional)"
            size="small"
            value={newDayOffReason}
            inputProps={{ maxLength: 160 }}
            onChange={(event) => setNewDayOffReason(event.target.value)}
          />
          <Button
            variant="contained"
            disabled={isSavingDayOff || !newDayOffDate}
            onClick={() => void addDayOff()}
          >
            {isSavingDayOff ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Adicionar"
            )}
          </Button>
        </Styles.DayOffForm>

        <Styles.DayOffList>
          {daysOff.length === 0 ? (
            <Alert severity="info">Nenhuma folga cadastrada.</Alert>
          ) : (
            daysOff.map((dayOff) => (
              <Styles.DayOffItem key={dayOff.id}>
                <Box>
                  <Typography fontWeight={700}>
                    {formatDateOnly(dayOff.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dayOff.reason || "Sem motivo informado"}
                  </Typography>
                </Box>
                <IconButton
                  color="error"
                  aria-label={`Remover folga de ${formatDateOnly(dayOff.date)}`}
                  onClick={() => void removeDayOff(dayOff.id)}
                >
                  <DeleteOutlinedIcon />
                </IconButton>
              </Styles.DayOffItem>
            ))
          )}
        </Styles.DayOffList>
      </Box>
    </Styles.PageWrapper>
  );
};

export default BusinessSettingsView;
