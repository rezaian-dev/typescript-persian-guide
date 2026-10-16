import { useEffect, useState } from "react";
import { z } from "zod";
import { ok, err, type Result } from "./result.js";

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
});
export type User = z.infer<typeof UserSchema>;

export type LoadError =
  | { kind: "network" }
  | { kind: "http"; status: number }
  | { kind: "contract" };

export type UsersState =
  | { status: "loading" }
  | { status: "error"; error: LoadError }
  | { status: "success"; users: User[] };

export async function loadUsers(
  signal: AbortSignal,
  fetchImpl: typeof fetch = fetch
): Promise<Result<User[], LoadError>> {
  let res: Response;
  try {
    res = await fetchImpl("/api/users", { signal });
  } catch {
    return err({ kind: "network" });
  }
  if (!res.ok) return err({ kind: "http", status: res.status });
  const parsed = z.array(UserSchema).safeParse(await res.json().catch(() => null));
  return parsed.success ? ok(parsed.data) : err({ kind: "contract" });
}

export function useUsers(): UsersState {
  const [state, setState] = useState<UsersState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    void loadUsers(controller.signal).then(result => {
      if (controller.signal.aborted) return;
      setState(
        result.ok
          ? { status: "success", users: result.value }
          : { status: "error", error: result.error }
      );
    });
    return () => controller.abort(); // لغو تایپ‌شده — فصل ۳۹
  }, []);

  return state;
}
