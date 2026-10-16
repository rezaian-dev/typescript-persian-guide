import type { Address, Order } from "./order-model.js";

// هر گذار: از حالتِ مشخص → به حالتِ مشخص. گذار نامعتبر = خطای کامپایل.
export function place(
  order: Extract<Order, { status: "draft" }>,
  address: Address
): Extract<Order, { status: "placed" }> {
  if (order.items.length === 0) throw new Error("سبد خالی قابل ثبت نیست");
  return { status: "placed", items: order.items, address, placedAt: new Date() };
}

export function pay(
  order: Extract<Order, { status: "placed" }>,
  txId: string
): Extract<Order, { status: "paid" }> {
  return { ...order, status: "paid", paidAt: new Date(), txId };
}

export function ship(
  order: Extract<Order, { status: "paid" }>,
  trackingCode: string
): Extract<Order, { status: "shipped" }> {
  return { ...order, status: "shipped", trackingCode };
}

export function cancel(
  order: Extract<Order, { status: "draft" | "placed" | "paid" }>,
  reason: string
): Extract<Order, { status: "canceled" }> {
  void order;
  return { status: "canceled", reason, canceledAt: new Date() };
}
