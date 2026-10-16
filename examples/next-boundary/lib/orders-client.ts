import { z } from "zod";
import {
  CreateOrderOutput,
  type CreateOrderInputT,
  type CreateOrderOutputT,
} from "@/lib/contract";

export type OrderError =
  | { kind: "network" }
  | { kind: "validation"; status: 400 }
  | { kind: "http"; status: number }
  | { kind: "contract"; issues: z.core.$ZodIssue[] };

export type OrderResult =
  | { ok: true; value: CreateOrderOutputT }
  | { ok: false; error: OrderError };

export async function createOrder(input: CreateOrderInputT): Promise<OrderResult> {
  let res: Response;
  try {
    res = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return { ok: false, error: { kind: "network" } };
  }
  if (res.status === 400) return { ok: false, error: { kind: "validation", status: 400 } };
  if (!res.ok) return { ok: false, error: { kind: "http", status: res.status } };
  // به deploy ناهم‌زمان سرور هم اعتمادی نیست — خروجی validate می‌شود
  const parsed = CreateOrderOutput.safeParse(await res.json().catch(() => null));
  if (!parsed.success) {
    return { ok: false, error: { kind: "contract", issues: parsed.error.issues } };
  }
  return { ok: true, value: parsed.data };
}
