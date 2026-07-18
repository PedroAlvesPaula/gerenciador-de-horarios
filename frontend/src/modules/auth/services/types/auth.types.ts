export interface UserCredentials {
  id: string;
  name: string;
  role: "ADMIN" | "USER";
}

export interface AuthSuccessData {
  user: UserCredentials;
  token: string;
}

export interface UserDataLogin {
  email: string;
  password: string;
  callback: (error: Error | null, data?: AuthSuccessData) => void;
}

export interface AuthRegisterData {
  name: string;
  email: string;
  password: string;
  onSuccess: (data?: AuthSuccessData) => void;
  onError: (error: Error) => void;
}

export interface AuthGoogleData {
  googleToken: string;
  onSuccess: (data?: AuthSuccessData) => void;
  onError: (error: Error) => void;
}
