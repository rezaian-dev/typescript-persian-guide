import { z } from "zod";
import type { Result } from "./result.js";
import { describe, type ApiError } from "./api-error.js";

export const SignupSchema = z.object({
  email: z.email("ایمیل معتبر نیست"),
  password: z.string().min(8, "حداقل ۸ کاراکتر"),
});
export type SignupData = z.infer<typeof SignupSchema>;

export type FieldErrors = Partial<Record<keyof SignupData, string>>;

export type FormState =
  | { phase: "editing"; errors: FieldErrors }
  | { phase: "submitting" }
  | { phase: "succeeded"; userId: string }
  | { phase: "failed"; message: string; errors: FieldErrors };

export function validate(
  raw: Record<string, string>
): { ok: true; data: SignupData } | { ok: false; errors: FieldErrors } {
  const parsed = SignupSchema.safeParse(raw);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if ((key === "email" || key === "password") && !errors[key]) {
      errors[key] = issue.message;
    }
  }
  return { ok: false, errors };
}

export async function submit(
  state: FormState,
  raw: Record<string, string>,
  api: (d: SignupData) => Promise<Result<{ userId: string }, ApiError>>
): Promise<FormState> {
  if (state.phase === "submitting") return state;
  const v = validate(raw);
  if (!v.ok) return { phase: "editing", errors: v.errors };
  const result = await api(v.data);
  return result.ok
    ? { phase: "succeeded", userId: result.value.userId }
    : { phase: "failed", message: describe(result.error), errors: {} };
}
