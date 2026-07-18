import api from "../../../services/api";
import {
  type AuthApiResponse,
  type AuthSuccessData,
  type GoogleAuthPayload,
  type LoginCredentials,
  type RegisterPayload,
} from "./types/auth.types";

export const authLogin = async (
  credentials: LoginCredentials,
): Promise<AuthSuccessData> => {
  const { data } = await api.post<AuthApiResponse>("/auth/login", credentials);

  return { user: data.user, token: data.access_token };
};

export const authRegister = async (payload: RegisterPayload): Promise<void> => {
  await api.post("/auth/register", payload);
};

export const authLoginGoogle = async ({
  googleToken,
}: GoogleAuthPayload): Promise<AuthSuccessData> => {
  const { data } = await api.post<AuthApiResponse>("/auth/google", {
    token: googleToken,
  });

  return { user: data.user, token: data.access_token };
};
