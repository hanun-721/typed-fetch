import type { RequestError } from "./types.js";

export function describeError(error: RequestError): string {
  switch (error.kind) {
    case "invalid_url":
      return error.message;
    case "network":
      return "Network problem: " + error.message;
    case "http":
      return "HTTP " + error.status + " " + error.statusText;
    case "parse":
      return error.message;
    default: {
      const _exhaustive: never = error;
      throw new Error("Unhandled error: " + JSON.stringify(_exhaustive));
    }
  }
}