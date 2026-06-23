import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@phbarber:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    switch (status) {
      case 401:
        localStorage.clear();
        window.location.href = "/login";
        break;

      case 403:
        window.location.href = "/acesso-negado";
        break;

      case 500:
      case 502:
      case 503:
        console.error("Erro interno do servidor. Tente novamente mais tarde.");
        window.location.href = "/erro-servidor";
        break;

      case 400:
      case 422:
        break;

      default:
        console.error(
          "Erro de API:",
          error.response?.data?.message || error.message,
        );
    }

    return Promise.reject(error);
  },
);

export default api;
