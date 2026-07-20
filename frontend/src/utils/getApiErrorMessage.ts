import axios from "axios";

interface ApiErrorBody {
  message?: string | string[];
}

const apiMessageTranslations: Record<string, string> = {
  "Invalid date. Use the YYYY-MM-DD format.":
    "Data inválida. Use o formato AAAA-MM-DD.",
  "Invalid time. Use the HH:mm format.":
    "Horário inválido. Use o formato HH:mm.",
  "Google login is not configured.":
    "O login com Google não está configurado.",
  "Invalid or expired Google ID token.":
    "O token do Google é inválido ou expirou.",
  "Google account email is not verified.":
    "O e-mail da conta Google não foi verificado.",
  "This email is already linked to another Google account.":
    "Este e-mail já está vinculado a outra conta Google.",
  "Business hours are already configured for this day.":
    "O horário de funcionamento deste dia já está configurado.",
  "Business hour not found.": "Horário de funcionamento não encontrado.",
  "This date is already registered off.":
    "Esta data já está cadastrada como folga.",
  "Day off not found.": "Folga não encontrada.",
  "openTime must be before closeTime.":
    "O horário de abertura deve ser anterior ao horário de fechamento.",
  "breakStart and breakEnd must be provided together.":
    "O início e o fim do intervalo devem ser informados juntos.",
  "The break must be a valid interval within business hours.":
    "O intervalo deve estar dentro do horário de funcionamento.",
  "The name is required": "O nome é obrigatório.",
  "The name cannot contain only spaces":
    "O nome não pode conter apenas espaços.",
  "The name must contain at least 3 characters":
    "O nome deve conter pelo menos 3 caracteres.",
  "Price must be a number with at most 2 decimal places":
    "O preço deve ser um número com no máximo duas casas decimais.",
  "Price cannot be negative": "O preço não pode ser negativo.",
  "Price exceeds the supported limit": "O preço excede o limite permitido.",
  "Duration must be an integer number of minutes":
    "A duração deve ser um número inteiro de minutos.",
  "Duration must be at least 1 minute":
    "A duração deve ser de pelo menos um minuto.",
  "Duration cannot exceed 1440 minutes":
    "A duração não pode exceder 1.440 minutos.",
  "Catalog item not found.": "Serviço não encontrado no catálogo.",
  "Address not found.": "Endereço não encontrado.",
  "Invalid appointment date.": "Data do agendamento inválida.",
  "Appointment time must be aligned to a full minute.":
    "O horário do agendamento deve corresponder a um minuto exato.",
  "The requested time is not available for the selected services.":
    "O horário solicitado não está disponível para os serviços selecionados.",
  "Select at least one service without repeated IDs.":
    "Selecione pelo menos um serviço, sem itens repetidos.",
  "One or more services were not found in the catalog.":
    "Um ou mais serviços não foram encontrados no catálogo.",
  "Invalid date format. Use ISO 8601 string.":
    "Formato de data inválido. Use o padrão ISO 8601.",
  "Appointment date is required": "A data do agendamento é obrigatória.",
  "Select at least one catalog item": "Selecione pelo menos um serviço.",
  "Select at most 20 catalog items": "Selecione no máximo 20 serviços.",
  "Catalog item IDs cannot be repeated":
    "Os serviços selecionados não podem ser repetidos.",
  "Invalid catalog item ID": "Identificador de serviço inválido.",
  "date must use the YYYY-MM-DD format.":
    "A data deve usar o formato AAAA-MM-DD.",
  "Select at least one catalog item.": "Selecione pelo menos um serviço.",
  "Select at most 20 catalog items.": "Selecione no máximo 20 serviços.",
  "Catalog item IDs cannot be repeated.":
    "Os serviços selecionados não podem ser repetidos.",
  "Invalid catalog item ID.": "Identificador de serviço inválido.",
  "openTime must use the HH:mm format.":
    "O horário de abertura deve usar o formato HH:mm.",
  "closeTime must use the HH:mm format.":
    "O horário de fechamento deve usar o formato HH:mm.",
  "breakStart must use the HH:mm format.":
    "O início do intervalo deve usar o formato HH:mm.",
  "breakEnd must use the HH:mm format.":
    "O fim do intervalo deve usar o formato HH:mm.",
};

const englishApiMessagePattern =
  /\b(?:appointment|business|cannot|catalog|date|day off|duration|invalid|must|not found|price|required|select|should|time)\b/i;

const localizeApiMessage = (message: string, fallback: string): string =>
  apiMessageTranslations[message] ??
  (englishApiMessagePattern.test(message) ? fallback : message);

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!axios.isAxiosError<ApiErrorBody>(error)) {
    return fallback;
  }

  const message = error.response?.data?.message;

  if (Array.isArray(message)) {
    return message
      .map((item) => localizeApiMessage(item, fallback))
      .join(" ");
  }

  return message ? localizeApiMessage(message, fallback) : fallback;
};
