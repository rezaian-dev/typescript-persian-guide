import { z } from "zod";

// ======= قرارداد داده بیرونی — منبع حقیقت واحد (فصل ۳۴) =======
export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().min(1),
  createdAt: z.iso.datetime(),
});
export type User = z.infer<typeof UserSchema>;

// ======= متغیرهای محیطی — validation در boot =======
export const EnvSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z.coerce.number().int().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});
export type Env = z.infer<typeof EnvSchema>;
