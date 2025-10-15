import axios, { type AxiosRequestConfig } from "axios";
import { authService } from "./auth";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
});

// Setup auth interceptors for automatic token handling
authService.setupInterceptors(apiClient);

export interface Log {
  id: number;
  timestamp: string;
  message: string;
  severity: "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";
  source: string;
}

export const SEVERITY_OPTIONS: Log["severity"][] = [
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
];

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface LogQueryParams {
  page?: number;
  search?: string;
  severity?: Log["severity"] | "";
  source?: string;
  ordering?:
    | "timestamp"
    | "-timestamp"
    | "severity"
    | "-severity"
    | "source"
    | "-source";
  date_from?: string;
  date_to?: string;
}

export interface AggregatedLogDatum {
  date?: string;
  severity?: Log["severity"];
  source?: string;
  count: number;
}

export type AggregateGroupBy = "date" | "severity" | "source";
export type AggregateInterval = "day" | "month";

const get = async <T>(path: string, config?: AxiosRequestConfig) => {
  const response = await apiClient.get<T>(path, config);
  return response.data;
};

const post = async <T, B>(
  path: string,
  body: B,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient.post<T>(path, body, config);
  return response.data;
};

const put = async <T, B>(
  path: string,
  body: B,
  config?: AxiosRequestConfig
) => {
  const response = await apiClient.put<T>(path, body, config);
  return response.data;
};

const destroy = async (path: string, config?: AxiosRequestConfig) => {
  await apiClient.delete(path, config);
};

export const listLogs = (params: LogQueryParams = {}) =>
  get<PaginatedResponse<Log>>("/logs/", { params });

export const getLog = (id: number) => get<Log>(`/logs/${id}/`);

export const createLog = (payload: Omit<Log, "id">) =>
  post<Log, Omit<Log, "id">>("/logs/", payload);

export const updateLog = (id: number, payload: Partial<Omit<Log, "id">>) =>
  put<Log, Partial<Omit<Log, "id">>>(`/logs/${id}/`, payload);

export const deleteLog = (id: number) => destroy(`/logs/${id}/`);

export const getRawLogs = (params: LogQueryParams = {}) =>
  get<Log[]>("/logs/raw/", { params });

export interface AggregatedQueryParams extends LogQueryParams {
  group_by?: AggregateGroupBy;
  interval?: AggregateInterval;
}

export const getAggregatedLogs = (params: AggregatedQueryParams = {}) =>
  get<AggregatedLogDatum[]>("/logs/aggregated/", { params });
