import { z } from "zod";

// قرارداد مشترک سرور/کلاینت — منبع حقیقت واحد (فصل ۳۸)
export const CreateOrderInput = z.object({
  items: z
    .array(z.object({ sku: z.string(), qty: z.number().int().min(1) }))
    .min(1),
  couponCode: z.string().optional(),
});
export const CreateOrderOutput = z.object({
  orderId: z.string(),
  total: z.number(),
  placedAt: z.iso.datetime(), // تاریخ در DTO: رشته ISO — صادقانه
});
export type CreateOrderInputT = z.infer<typeof CreateOrderInput>;
export type CreateOrderOutputT = z.infer<typeof CreateOrderOutput>;
