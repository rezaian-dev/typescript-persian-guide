import type { Order, OrderStatus } from "./order-model.js";

// نقشه گذارهای مجاز — satisfies: حالت جدیدِ جامانده = خطای کامپایل (فصل ۲۱)
export const TRANSITIONS = {
  draft: ["placed", "canceled"],
  placed: ["paid", "canceled"],
  paid: ["shipped", "canceled"],
  shipped: [],
  canceled: [],
} as const satisfies Record<OrderStatus, readonly OrderStatus[]>;

export type CanTransition<S extends OrderStatus> = (typeof TRANSITIONS)[S][number];

export function canTransition(from: Order["status"], to: Order["status"]): boolean {
  return (TRANSITIONS[from] as readonly OrderStatus[]).includes(to);
}
