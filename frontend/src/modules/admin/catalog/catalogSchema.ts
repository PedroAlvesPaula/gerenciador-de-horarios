import { z } from "zod";

export const catalogItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "A descrição deve ter no máximo 500 caracteres")
    .transform((value) => value || null),
  price: z
    .number({ error: "Informe um preço válido" })
    .min(0, "O preço não pode ser negativo")
    .max(99_999_999.99, "O preço informado é muito alto")
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
      "Use no máximo duas casas decimais",
    ),
  durationMinutes: z
    .number({ error: "Informe a duração em minutos" })
    .int("A duração deve ser um número inteiro")
    .min(1, "A duração deve ser de pelo menos 1 minuto")
    .max(1_440, "A duração não pode ultrapassar 1440 minutos"),
});

export type CatalogItemFormInput = z.input<typeof catalogItemSchema>;
export type CatalogItemFormData = z.output<typeof catalogItemSchema>;
