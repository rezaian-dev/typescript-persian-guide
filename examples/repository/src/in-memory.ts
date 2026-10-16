import { ok, err, type Result } from "./result.js";
import type { Entity, RepoError, Repository } from "./repository.js";

export class InMemoryRepository<T extends Entity> implements Repository<T> {
  private readonly rows = new Map<string, T>();
  private seq = 0;

  async findById(id: string): Promise<Result<T, RepoError>> {
    const row = this.rows.get(id);
    return row ? ok(row) : err({ kind: "not-found", id });
  }

  async list(
    filter?: Partial<T>,
    page?: { limit: number; offset: number }
  ): Promise<Result<readonly T[], RepoError>> {
    let all = [...this.rows.values()];
    if (filter) {
      const entries = Object.entries(filter) as [keyof T, unknown][];
      all = all.filter(row => entries.every(([k, v]) => row[k] === v));
    }
    if (page) all = all.slice(page.offset, page.offset + page.limit);
    return ok(all);
  }

  async create(input: Omit<T, "id">): Promise<Result<T, RepoError>> {
    const id = `id_${++this.seq}`;
    // قرارداد Entity: T = Omit<T,"id"> + id — این cast مرز ساخت است و مستند
    const row = { ...input, id } as T;
    this.rows.set(id, row);
    return ok(row);
  }

  async update(id: string, patch: Partial<Omit<T, "id">>): Promise<Result<T, RepoError>> {
    const current = this.rows.get(id);
    if (!current) return err({ kind: "not-found", id });
    const next = { ...current, ...patch, id } as T;
    this.rows.set(id, next);
    return ok(next);
  }

  async remove(id: string): Promise<Result<void, RepoError>> {
    if (!this.rows.delete(id)) return err({ kind: "not-found", id });
    return ok(undefined);
  }
}
