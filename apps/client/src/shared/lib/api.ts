import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../store/auth-store";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = "/api";

const publicApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use( async (config: CustomAxiosRequestConfig) => {

  // Artificial delay
  // await new Promise((resolve) => setTimeout(resolve, 1000))
  const { accessToken: token } = useAuthStore.getState();
  config.headers.Authorization =
    token && !config._retry ? `Bearer ${token}` : config.headers.Authorization;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.status === 401 && !originalRequest._retry) {
      const { setAccessToken } = useAuthStore.getState();

      const response = await publicApiClient.get("/identity/refresh", {
        headers: {
          "X-Org-Id": useAuthStore.getState().organizationId ?? null
        }
      });
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      originalRequest._retry = true;

      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);

export default {
  apiClient,
  publicApiClient,
};
