import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useLayoutEffect, useMemo, useRef } from "react";
import { useAuthContext } from "../components/AuthProvider";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = "api/";
export const useApiClient = () => {
  const { accessToken, setAccessToken } = useAuthContext();

  const accessTokenRef = useRef(accessToken);

  useLayoutEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  const client = useMemo(() => {
    return axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  // Request Interceptor
  useLayoutEffect(() => {
    const requestInterceptor = client.interceptors.request.use((config) => {

      const token = accessToken

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      client.interceptors.request.eject(requestInterceptor);
    };
  }, [client, accessToken]);

  // Response Interceptor
  useLayoutEffect(() => {
    const responseIntecepter = client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (error.response?.status === 401 && !originalRequest._retry) {
          try {
            const response = await axios.get("/api/identity/refresh");
            const newAccessToken = response.data.accessToken;

            setAccessToken(newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            originalRequest._retry = true;

            return client(originalRequest);
          } catch (refreshError) {
            console.error("session expired");
            return Promise.reject(refreshError);
          }
        }
      },
    );

    return () => {
      client.interceptors.response.eject(responseIntecepter);
    };
  }, [client, setAccessToken]);

  return client;
};
