import assert from "node:assert/strict";
import { InMemoryRepository } from "./in-memory.js";
import type { Entity } from "./repository.js";

interface User extends Entity {
  readonly id: string;
  name: string;
  role: "admin" | "member";
}

const repo = new InMemoryRepository<User>();

// create — id را مخزن می‌سازد؛ دادنش خطای کامپایل است
const created = await repo.create({ name: "Sara", role: "admin" });
assert(created.ok);
assert.equal(created.value.name, "Sara");

// findById — یافت‌شده
const found = await repo.findById(created.value.id);
assert(found.ok && found.value.role === "admin");

// findById — ناموجود ⇒ Result خطا، نه throw
const missing = await repo.findById("id_999");
assert(!missing.ok && missing.error.kind === "not-found");

// update جزئی — id هرگز در patch نیست
const renamed = await repo.update(created.value.id, { name: "Sara K." });
assert(renamed.ok && renamed.value.name === "Sara K.");

// list با فیلتر
await repo.create({ name: "Omid", role: "member" });
const admins = await repo.list({ role: "admin" });
assert(admins.ok && admins.value.length === 1);

// remove و تکرار آن
const gone = await repo.remove(created.value.id);
assert(gone.ok);
const again = await repo.remove(created.value.id);
assert(!again.ok && again.error.kind === "not-found");

console.log("repository: all assertions passed ✓");
