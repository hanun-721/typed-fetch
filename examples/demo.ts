import { request, describeError } from "../src/index.js";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const API = "https://jsonplaceholder.typicode.com";

// 1. Success
const one = await request<Post>(API + "/posts/1");
if (one.ok) console.log("1. Success:", one.data.title);
else console.error("1. Error:", describeError(one.error));

// 2. HTTP error (404)
const missing = await request<Post>(API + "/posts/999999");
if (!missing.ok && missing.error.kind === "http") {
  console.log("2. HTTP error status:", missing.error.status);
}

// 3. Query params + POST with JSON body
const list = await request<Post[]>(API + "/posts", { params: { userId: 1 } });
if (list.ok) console.log("3a. Posts for user 1:", list.data.length);

const created = await request<Post>(API + "/posts", {
  method: "POST",
  body: { title: "Hello", body: "World", userId: 1 },
  headers: { "X-Demo": "typed-fetch" },
});
if (created.ok) console.log("3b. Created id:", created.data.id);

// 4. Network error (bad host)
const offline = await request<Post>("https://this-host-does-not-exist.invalid/x");
if (!offline.ok) console.log("4. Network error:", describeError(offline.error));