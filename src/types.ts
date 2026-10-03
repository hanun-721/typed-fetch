export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type QueryParams = Record<string, string | number | boolean | undefined>;

export interface RequestOptions {
  method?: HttpMethod;
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
}

export type RequestError =
  | { kind: "invalid_url"; message: string }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number; statusText: string; body?: unknown }
  | { kind: "parse"; message: string };

export type Result<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: RequestError };