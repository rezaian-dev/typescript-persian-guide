import type { Result } from "./result.js";

export interface Entity {
  readonly id: string;
}

export type RepoError =
  | { kind: "not-found"; id: string }
  | { kind: "conflict"; id: string; detail: string }
  | { kind: "storage"; cause: unknown };

export interface Repository<T extends Entity> {
  findById(id: string): Promise<Result<T, RepoError>>;
  list(
    filter?: Partial<T>,
    page?: { limit: number; offset: number }
  ): Promise<Result<readonly T[], RepoError>>;
  create(input: Omit<T, "id">): Promise<Result<T, RepoError>>;
  update(id: string, patch: Partial<Omit<T, "id">>): Promise<Result<T, RepoError>>;
  remove(id: string): Promise<Result<void, RepoError>>;
}
