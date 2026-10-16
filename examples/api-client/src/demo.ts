/**
 * دمو با mock server واقعی (node:http) — سه سناریوی فصل ۳۵:
 *   /ok           → 200 سالم          → ok
 *   /flaky        → دوبار 500، بعد 200 → retry موفق
 *   /bad-contract → 200 با بدنه خراب   → kind: "contract" بدون retry
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { z } from "zod";
import { createClient } from "./client.js";
import { describe } from "./api-error.js";

const Todo = z.object({ id: z.number(), title: z.string(), done: z.boolean() });

let flakyHits = 0;
let badContractHits = 0;
const server = createServer((req, res) => {
  const send = (status: number, body: unknown) => {
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify(body));
  };
  switch (req.url) {
    case "/ok":
      return send(200, { id: 1, title: "خرید نان", done: false });
    case "/flaky":
      flakyHits += 1;
      return flakyHits <= 2 ? send(500, { error: "boom" })
                            : send(200, { id: 2, title: "retry جواب داد", done: true });
    case "/bad-contract":
      badContractHits += 1;
      return send(200, { id: "۳", title: 42 }); // شکل غلط — عمداً
    default:
      return send(404, { error: "not found" });
  }
});

await new Promise<void>(r => server.listen(0, r));
const addr = server.address();
assert(addr && typeof addr === "object");
const api = createClient({ baseUrl: `http://127.0.0.1:${addr.port}`, retries: 3 });

// ۱) مسیر سالم
const good = await api.request("/ok", Todo);
assert(good.ok && good.value.title === "خرید نان");

// ۲) خطای گذرا — retry تا موفقیت
const flaky = await api.request("/flaky", Todo);
assert(flaky.ok && flaky.value.done === true);
assert.equal(flakyHits, 3);

// ۳) نقض قرارداد — بدون retry، با issues ساخت‌یافته
const bad = await api.request("/bad-contract", Todo);
assert(!bad.ok && bad.error.kind === "contract");
assert.equal(badContractHits, 1); // قرارداد خراب، تکرار نشد
console.log("نمونه پیام خطا:", describe(bad.error));

server.close();
console.log("api-client: all assertions passed ✓");
