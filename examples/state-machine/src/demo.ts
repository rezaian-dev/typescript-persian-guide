import assert from "node:assert/strict";
import type { Order } from "./order-model.js";
import { place, pay, ship, cancel } from "./transitions.js";
import { canTransition, type CanTransition } from "./machine-map.js";

// چرخه کامل: draft → placed → paid → shipped
const draft: Extract<Order, { status: "draft" }> = {
  status: "draft",
  items: [{ sku: "book-ts", qty: 1, unitPrice: 250 }],
};

const placed = place(draft, { city: "تهران", street: "انقلاب", postalCode: "13145" });
const paid = pay(placed, "tx_981");
const shipped = ship(paid, "TRK-42");

assert.equal(shipped.status, "shipped");
assert.equal(shipped.txId, "tx_981"); // تضمین paid با spread منتقل شد
assert.equal(shipped.trackingCode, "TRK-42");

// گذار نامعتبر، compile نمی‌شود — تست type-level:
// @ts-expect-error — پرداختِ سفارش ثبت‌نشده ممنوع
void (() => pay(draft, "tx_x"));
// @ts-expect-error — ارسالِ سفارش پرداخت‌نشده ممنوع
void (() => ship(placed, "TRK-0"));
// @ts-expect-error — لغو سفارشِ ارسال‌شده ممنوع
void (() => cancel(shipped, "دیر شد"));

// نقشه گذارها — runtime و type-level هم‌نظرند:
assert.equal(canTransition("paid", "shipped"), true);
assert.equal(canTransition("shipped", "paid"), false);
type FromPaid = CanTransition<"paid">; // "shipped" | "canceled"
const okTarget: FromPaid = "shipped";
void okTarget;

// invariant در runtime: ثبت سبد خالی
assert.throws(() => place({ status: "draft", items: [] }, shipped.address));

// لغو از حالت مجاز
const canceled = cancel(paid, "انصراف مشتری");
assert.equal(canceled.status, "canceled");

console.log("state-machine: all assertions passed ✓");
