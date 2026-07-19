import { z } from "zod";

export const inventoryItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "O nome deve ter pelo menos 2 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  category: z.enum(["RETORNAVEIS", "DESCARTAVEIS", "COSMETICOS"], {
    error: "Selecione uma categoria",
  }),
  minRecommended: z
    .number({ error: "Informe o mínimo recomendado" })
    .int("O mínimo recomendado deve ser inteiro")
    .min(0, "O mínimo recomendado não pode ser negativo")
    .max(1_000_000, "O mínimo recomendado excede o limite"),
  quantity: z
    .number({ error: "Informe a quantidade" })
    .int("A quantidade deve ser inteira")
    .min(0, "A quantidade não pode ser negativa")
    .max(1_000_000, "A quantidade excede o limite"),
});

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;
