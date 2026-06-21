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
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }

    console.error(
      "Erro de API:",
      error.response?.data?.message || error.message,
    );

    return Promise.reject(error);
  },
);

export default api;
