import type { z } from "zod";
import { ok, err, type Result } from "./result.js";
import type { ApiError } from "./api-error.js";

export interface ClientConfig {
  baseUrl: string;
  retries?: number;       // پیش‌فرض ۲ — فقط برای خطاهای retryable
  timeoutMs?: number;     // پیش‌فرض ۸۰۰۰ — با AbortSignal.timeout
  fetchImpl?: typeof fetch;
}

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function createClient(cfg: ClientConfig) {
  const { baseUrl, retries = 2, timeoutMs = 8000, fetchImpl = fetch } = cfg;

  async function once<S extends z.ZodType>(
    path: string,
    schema: S,
    init?: RequestInit
  ): Promise<Result<z.infer<S>, ApiError>> {
    const url = baseUrl + path;
    let res: Response;
    try {
      res = await fetchImpl(url, {
        ...init,
        signal: init?.signal ?? AbortSignal.timeout(timeoutMs),
      });
    } catch (cause) {
      return err({ kind: "network", retryable: true, cause });
    }
    if (!res.ok) {
      return err({
        kind: "http",
        retryable: res.status >= 500 || res.status === 429,
        status: res.status,
        body: await res.text().catch(() => ""),
      });
    }
    const raw: unknown = await res.json().catch(() => null);
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      // نقض قرارداد هرگز retryable نیست — تکرار، داده را درست نمی‌کند
      return err({ kind: "contract", retryable: false, url, issues: parsed.error.issues });
    }
    return ok(parsed.data);
  }

  return {
    async request<S extends z.ZodType>(
      path: string,
      schema: S,
      init?: RequestInit
    ): Promise<Result<z.infer<S>, ApiError>> {
      let attempt = 0;
      for (;;) {
        const r = await once(path, schema, init);
        if (r.ok || !r.error.retryable || attempt >= retries) return r;
        attempt += 1;
        await sleep(2 ** attempt * 100); // backoff نمایی: ۲۰۰ms، ۴۰۰ms، …
      }
    },
  };
}
