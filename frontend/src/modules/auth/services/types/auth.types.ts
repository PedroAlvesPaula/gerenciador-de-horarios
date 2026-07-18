export interface UserCredentials {
  id: string;
  name: string;
  role: "ADMIN" | "USER";
}

export interface AuthSuccessData {
  user: UserCredentials;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface GoogleAuthPayload {
  googleToken: string;
}

export interface AuthApiResponse {
  access_token: string;
  user: UserCredentials;
}
