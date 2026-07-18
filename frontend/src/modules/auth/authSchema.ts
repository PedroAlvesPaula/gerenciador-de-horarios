import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .pipe(z.string().regex(/^\d{10,11}$/, "Digite um celular válido")),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Digite um e-mail válido")),
  password: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .max(72, "A senha deve ter no máximo 72 caracteres"),
  confirmPassword: z.string().min(1, "Confirme sua senha"),
}).refine(({ password, confirmPassword }) => password === confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Digite um e-mail válido")),
  password: z.string().min(1, "Digite sua senha"),
});

export type RegisterFormDataType = z.infer<typeof registerSchema>;
export type LoginFormDataType = z.infer<typeof loginSchema>;
