import axios, { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
}

const apiClient = axios.create({
  timeout: 15000,
});

function createApiError(error: unknown): ApiError {
  const axiosError = error as AxiosError;

  return {
    message:
      axiosError.response?.statusText ??
      axiosError.message ??
      "Unexpected request error",
    status: axiosError.response?.status,
  } satisfies ApiError;
}

export async function apiGet<T>(url: string): Promise<T> {
  try {
    const response = await apiClient.get<T>(url);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function apiPost<TResponse, TRequest>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  try {
    const response = await apiClient.post<TResponse>(url, body);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function apiPut<TResponse, TRequest>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  try {
    const response = await apiClient.put<TResponse>(url, body);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function apiPatch<TResponse, TRequest>(
  url: string,
  body: TRequest,
): Promise<TResponse> {
  try {
    const response = await apiClient.patch<TResponse>(url, body);
    return response.data;
  } catch (error) {
    throw createApiError(error);
  }
}

export async function apiDelete(url: string): Promise<void> {
  try {
    await apiClient.delete(url);
  } catch (error) {
    throw createApiError(error);
  }
}
