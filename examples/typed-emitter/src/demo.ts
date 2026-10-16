import assert from "node:assert/strict";
import { TypedEmitter } from "./index.js";

type AppEvents = {
  "cart:add": { sku: string; qty: number };
  "cart:clear": undefined;
};

const bus = new TypedEmitter<AppEvents>();
const log: string[] = [];

const off = bus.on("cart:add", p => log.push(`${p.sku}×${p.qty}`));
bus.once("cart:clear", () => log.push("cleared-once"));

bus.emit("cart:add", { sku: "k1", qty: 2 });
bus.emit("cart:clear", undefined);
bus.emit("cart:clear", undefined); // once: بار دوم بی‌اثر
off();
bus.emit("cart:add", { sku: "k2", qty: 1 }); // بعد از off بی‌اثر

assert.deepEqual(log, ["k1×2", "cleared-once"]);
console.log("typed-emitter: all assertions passed ✓");
