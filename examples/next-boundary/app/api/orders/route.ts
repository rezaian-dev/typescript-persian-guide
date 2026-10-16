import { NextResponse } from "next/server";
import {
  CreateOrderInput,
  type CreateOrderInputT,
  type CreateOrderOutputT,
} from "@/lib/contract";

async function placeOrder(
  input: CreateOrderInputT
): Promise<{ id: string; total: number; placedAt: Date }> {
  const total = input.items.reduce((sum, it) => sum + it.qty * 100, 0);
  return { id: `o_${Date.now()}`, total, placedAt: new Date() };
}

export async function POST(req: Request) {
  // مرز ورودی همین‌جا بسته می‌شود — به fetch کلاینت اعتمادی نیست
  const parsed = CreateOrderInput.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid-input", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const order = await placeOrder(parsed.data);
  const dto: CreateOrderOutputT = {
    orderId: order.id,
    total: order.total,
    placedAt: order.placedAt.toISOString(),
  };
  return NextResponse.json(dto, { status: 201 });
}
