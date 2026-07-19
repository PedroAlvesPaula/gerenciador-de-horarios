import { z } from "zod";

export const appointmentSchema = z.object({
  clientId: z.string().min(1, "Selecione um cliente"),
  catalogItemIds: z
    .array(z.string())
    .min(1, "Selecione ao menos um serviço")
    .max(20, "Selecione no máximo 20 serviços"),
  addressId: z.string().min(1, "Selecione um endereço"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Informe um horário válido"),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
