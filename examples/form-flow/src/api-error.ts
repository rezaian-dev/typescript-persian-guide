export type ApiError =
  | { kind: "network"; retryable: true; cause: unknown }
  | { kind: "http"; retryable: boolean; status: number; body: string };

export function describe(e: ApiError): string {
  switch (e.kind) {
    case "network":
      return "اتصال برقرار نشد — بعداً تلاش کنید";
    case "http":
      return `خطای سرور (HTTP ${e.status})`;
  }
}
