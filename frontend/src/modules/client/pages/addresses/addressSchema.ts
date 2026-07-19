import { z } from "zod";

const requiredText = (
  label: string,
  minimumLength: number,
  maximumLength: number,
) =>
  z
    .string()
    .trim()
    .min(minimumLength, `${label} deve ter pelo menos ${minimumLength} caracteres`)
    .max(maximumLength, `${label} deve ter no máximo ${maximumLength} caracteres`);

export const addressSchema = z.object({
  street: requiredText("A rua", 3, 120),
  number: requiredText("O número", 1, 20),
  complement: z
    .string()
    .trim()
    .max(100, "O complemento deve ter no máximo 100 caracteres")
    .transform((value) => value || null),
  neighborhood: requiredText("O bairro", 2, 80),
  city: requiredText("A cidade", 2, 80),
  state: z
    .string()
    .trim()
    .length(2, "Informe a sigla do estado com duas letras")
    .regex(/^[A-Za-z]{2}$/, "Informe uma sigla de estado válida")
    .transform((value) => value.toUpperCase()),
  zipCode: z
    .string()
    .trim()
    .refine(
      (value) => value.length === 0 || /^\d{5}-?\d{3}$/.test(value),
      "Informe o CEP no formato 00000-000",
    )
    .transform((value) => value || null),
});

export type AddressFormInput = z.input<typeof addressSchema>;
export type AddressFormData = z.output<typeof addressSchema>;
