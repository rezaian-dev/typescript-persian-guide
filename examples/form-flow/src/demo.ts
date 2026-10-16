import assert from "node:assert/strict";
import { submit, type FormState } from "./form.js";
import { ok, err } from "./result.js";

const editing: FormState = { phase: "editing", errors: {} };

// ۱) خطای فیلد — phase به editing با پیام‌های نگاشته به فیلد برمی‌گردد
const invalid = await submit(editing, { email: "nope", password: "123" }, async () =>
  ok({ userId: "u1" })
);
assert(invalid.phase === "editing");
assert(invalid.errors.email && invalid.errors.password);

// ۲) خطای شبکه — phase=failed با پیام قابل نمایش، فرم نمی‌میرد
const netFail = await submit(editing, { email: "a@b.dev", password: "12345678" }, async () =>
  err({ kind: "network", retryable: true, cause: new Error("offline") })
);
assert(netFail.phase === "failed" && netFail.message.length > 0);

// ۳) موفقیت
const done = await submit(editing, { email: "a@b.dev", password: "12345678" }, async () =>
  ok({ userId: "u42" })
);
assert(done.phase === "succeeded" && done.userId === "u42");

// ۴) گذار تکراری ممنوع — submit روی submitting همان state را برمی‌گرداند
const submitting: FormState = { phase: "submitting" };
const repeat = await submit(submitting, {}, async () => ok({ userId: "x" }));
assert.equal(repeat, submitting);

console.log("form-flow: all assertions passed ✓");
