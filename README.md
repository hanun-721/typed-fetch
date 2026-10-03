# typed-fetch

A tiny, fully typed fetch wrapper. request<T>() never throws. It returns a discriminated-union Result<T>, so TypeScript forces you to handle both success and failure.

## Install and run

npm install
npm run demo
## API

request<T>(url: string, options?: {
  method?: "GET" | "POST" | "PUT" | "DELETE"; // default GET
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown; // sent as JSON
  headers?: Record<string, string>;
}): Promise<Result<T>>
```ts
type Result<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; error: RequestError };

type RequestError =
  | { kind: "invalid_url"; message: string }
  | { kind: "network"; message: string }
  | { kind: "http"; status: number; statusText: string; body?: unknown }
  | { kind: "parse"; message: string };

## Example 1: Success (GET with query params)

ts
import { request } from "./src/index.js";

interface Post { id: number; title: string; }

const result = await request<Post[]>("https://jsonplaceholder.typicode.com/posts", {
  params: { userId: 1 },
});

if (result.ok) {
  console.log(result.data[0].title); // data is Post[]
} else {
  console.error(result.error); // error is RequestError
}

## Example 2: HTTP error (404)

ts
const result = await request<Post>("https://jsonplaceholder.typicode.com/posts/999999");

if (!result.ok && result.error.kind === "http") {
  console.log(result.error.status); // 404
}

## Example 3: POST with JSON body, custom headers and network errors

ts
import { request, describeError } from "./src/index.js";

const created = await request<Post>("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  body: { title: "Hello", body: "World", userId: 1 },
  headers: { Authorization: "Bearer my-token" },
});

if (!created.ok) {
  console.error(describeError(created.error)); // handles every error kind
}
`

## Why return a Result instead of throwing?

Throw for bugs. Return a Result for expected failures such as HTTP errors and network problems. The compiler can enforce that you check `result.ok` before using `result.data`, but it can't enforce `try/catch`.

## Limitations

`request<T>` trusts that the server returns a `T`. This is a type assertion, not runtime validation. For that, pair it with a library like Zod.