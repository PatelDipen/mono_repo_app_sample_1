import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
}

const apiClient = axios.create({
  timeout: 15000,
});

export async function apiGet<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw {
      message:
        axiosError.response?.statusText ??
        axiosError.message ??
        "Unexpected request error",
      status: axiosError.response?.status,
    } satisfies ApiError;
  }
}
