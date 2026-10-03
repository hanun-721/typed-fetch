import type { RequestError, RequestOptions, Result } from "./types.js";

const fail = (error: RequestError): Result<never> => ({ ok: false, error });

export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<Result<T>> {
  const { method = "GET", params, body, headers = {} } = options;

  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return fail({ kind: "invalid_url", message: "Invalid URL: " + url });
  }
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) u.searchParams.set(key, String(value));
    }
  }

  const finalHeaders: Record<string, string> = { ...headers };
  if (body !== undefined && !finalHeaders["Content-Type"]) {
    finalHeaders["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(u, {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    return fail({
      kind: "network",
      message: err instanceof Error ? err.message : "Network error",
    });
  }

  let text: string;
  try {
    text = await res.text();
  } catch (err) {
    return fail({
      kind: "network",
      message: err instanceof Error ? err.message : "Failed to read response",
    });
  }

  let parsed: unknown = undefined;
  let parseFailed = false;
  if (text.length > 0) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parseFailed = true;
    }
  }

  if (!res.ok) {
    return fail({
      kind: "http",
      status: res.status,
      statusText: res.statusText,
      body: parseFailed ? text : parsed,
    });
  }

  if (parseFailed) {
    return fail({ kind: "parse", message: "Response was not valid JSON" });
  }

  return { ok: true, data: parsed as T, status: res.status };
}