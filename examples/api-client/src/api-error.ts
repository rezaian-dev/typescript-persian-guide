import type { z } from "zod";

/** سه جنس شکستِ قابل انتظار — discriminated union با فیلد retryable (فصل ۳۵). */
export type ApiError =
  | { kind: "network"; retryable: true; cause: unknown }
  | { kind: "http"; retryable: boolean; status: number; body: string }
  | { kind: "contract"; retryable: false; url: string; issues: z.core.$ZodIssue[] };

export function describe(e: ApiError): string {
  switch (e.kind) {
    case "network":
      return "خطای شبکه — دوباره تلاش کنید";
    case "http":
      return `پاسخ HTTP ${e.status}`;
    case "contract":
      return `نقض قرارداد در ${e.url} (${e.issues.length} issue)`;
  }
}
