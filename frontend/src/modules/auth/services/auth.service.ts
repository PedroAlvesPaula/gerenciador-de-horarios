import api from "../../../services/api";
import {
  type UserDataLogin,
  type AuthRegisterData,
  type AuthGoogleData,
} from "./types/auth.types";

export const authLogin = async (userData: UserDataLogin) => {
  try {
    const response = await api.post("/auth/login", {
      email: userData.email,
      password: userData.password,
    });

    const { access_token, user } = response.data;

    userData.callback(null, { user, token: access_token });
  } catch (error) {
    if (error instanceof Error) {
      userData.callback(error);
    } else {
      userData.callback(new Error("Erro desconhecido ao realizar login."));
    }
  }
};

export const authRegister = async (userData: AuthRegisterData) => {
  try {
    await api.post("/auth/register", {
      name: userData.name,
      email: userData.email,
      password: userData.password,
    });

    userData.onSuccess();
  } catch (error) {
    if (error instanceof Error) {
      userData.onError(error);
    } else {
      userData.onError(new Error("Erro desconhecido ao criar a conta."));
    }
  }
};

export const authLoginGoogle = async (authData: AuthGoogleData) => {
  try {
    const response = await api.post("auth/google", {
      token: authData.googleToken,
    });

    const { access_token, user } = response.data;

    authData.onSuccess({ user, token: access_token });
  } catch (error) {
    if (error instanceof Error) {
      authData.onError(error);
    } else {
      authData.onError(
        new Error("Erro desconhecido ao autenticar com o Google."),
      );
    }
  }
};
