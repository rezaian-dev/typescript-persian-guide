import assert from "node:assert/strict";
import { UserSchema, EnvSchema } from "./schemas.js";
import { fetchJson, ContractViolation } from "./fetch-json.js";

// fetch ساختگی — دمو بدون شبکه، سناریوها قطعی
const routes: Record<string, unknown> = {
  "/api/user-good": {
    id: "u1", email: "sara@example.com", name: "Sara",
    createdAt: "2026-10-16T08:00:00Z",
  },
  "/api/user-bad": { id: "u2", email: "not-an-email", name: "" },
};
const fakeFetch: typeof fetch = async url =>
  new Response(JSON.stringify(routes[String(url)] ?? null), {
    status: String(url) in routes ? 200 : 404,
    headers: { "content-type": "application/json" },
  });

// ۱) پاسخ سالم — نوع User بدون هیچ as
const user = await fetchJson("/api/user-good", UserSchema, undefined, fakeFetch);
assert.equal(user.name, "Sara");

// ۲) پاسخ خراب — ContractViolation با issues ساخت‌یافته، نه undefined در عمق UI
let violated = false;
try {
  await fetchJson("/api/user-bad", UserSchema, undefined, fakeFetch);
} catch (e) {
  violated = e instanceof ContractViolation && e.issues.length >= 2;
  if (e instanceof ContractViolation) {
    // هر issue مسیر و پیام ساخت‌یافته دارد — قابل نگاشت به UI
    for (const issue of e.issues) assert(typeof issue.message === "string");
  }
}
assert(violated, "bad payload must raise ContractViolation");

// ۳) env — اعتبارسنجی در boot: خراب باشد، همان لحظه بالا می‌آید
const env = EnvSchema.parse({ DATABASE_URL: "postgres://localhost/db", PORT: "8080" });
assert.equal(env.PORT, 8080); // coerce: string → number
assert.equal(env.NODE_ENV, "development"); // default

assert.throws(() => EnvSchema.parse({ DATABASE_URL: "oops" }));

console.log("boundary: all assertions passed ✓");
