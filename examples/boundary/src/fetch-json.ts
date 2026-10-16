import { z } from "zod";

/** نقض قرارداد در مرز: سرور چیزی فرستاد که schema ردش کرد. */
export class ContractViolation extends Error {
  constructor(
    readonly url: string,
    readonly issues: z.core.$ZodIssue[]
  ) {
    super(`contract violation at ${url}`);
    this.name = "ContractViolation";
  }
}

/** دروازه عمومی: هر JSON بیرونی فقط از این‌جا وارد نوع‌ها می‌شود. */
export async function fetchJson<S extends z.ZodType>(
  url: string,
  schema: S,
  init?: RequestInit,
  fetchImpl: typeof fetch = fetch
): Promise<z.infer<S>> {
  const res = await fetchImpl(url, init);
  if (!res.ok) throw new Error(`HTTP ${res.status} at ${url}`);
  const raw: unknown = await res.json();
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new ContractViolation(url, parsed.error.issues);
  return parsed.data;
}
