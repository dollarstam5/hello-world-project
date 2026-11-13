import { describe, expect, it } from "vitest";
import type { OutboxEntry, PushRequest } from "@eco/core-contracts";
import { runPush, type SyncClient } from "@/lib/sync/transport.server";

type Row = Record<string, unknown>;
type QueryResult = { data: unknown; error: { code?: string; message?: string } | null };

const ownerId = "00000000-0000-4000-8000-000000000001";
const recordId = "00000000-0000-4000-8000-000000000002";
const mutationId = "00000000-0000-4000-8000-000000000003";

function radarEntry(kind: OutboxEntry["kind"], patch: Row, id = mutationId): OutboxEntry {
  return {
    id,
    ownerId,
    table: "radars",
    recordId,
    kind,
    patch,
    mutatedAt: 1,
    attempts: 0,
    lastAttemptAt: null,
    lastError: null,
  };
}

function request(entry: OutboxEntry): PushRequest {
  return { protocolVersion: 2, entries: [entry] };
}

class FakeQuery {
  private operation: "select" | "insert" | "update" = "select";
  private payload: Row | null = null;
  private filters: Array<[string, unknown]> = [];
  private returning = false;

  constructor(private readonly database: FakeDatabase, private readonly table: string) {}

  select(): this {
    this.returning = true;
    return this;
  }

  eq(column: string, value: unknown): this {
    this.filters.push([column, value]);
    return this;
  }

  insert(row: Row): this {
    this.operation = "insert";
    this.payload = row;
    return this;
  }

  update(row: Row): this {
    this.operation = "update";
    this.payload = row;
    return this;
  }

  async maybeSingle(): Promise<QueryResult> {
    return this.execute();
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }

  private matches(row: Row): boolean {
    return this.filters.every(([column, value]) => row[column] === value);
  }

  private async execute(): Promise<QueryResult> {
    if (this.table === "sync_mutation_receipts") {
      if (this.operation === "select") {
        const receipt = this.database.receipts.find((row) => this.matches(row));
        return { data: receipt ? { response: receipt.response } : null, error: null };
      }
      if (this.database.receiptWriteFailures > 0) {
        this.database.receiptWriteFailures -= 1;
        return { data: null, error: { code: "08006", message: "simulated receipt write failure" } };
      }
      const receipt = this.payload ?? {};
      if (this.database.receipts.some((row) =>
        row.mutation_id === receipt.mutation_id && row.owner_id === receipt.owner_id
      )) {
        return { data: null, error: { code: "23505", message: "duplicate receipt" } };
      }
      this.database.receipts.push({ ...receipt });
      return { data: null, error: null };
    }

    const rows = this.database.tables[this.table] ?? (this.database.tables[this.table] = []);
    if (this.operation === "select") {
      const row = rows.find((candidate) => this.matches(candidate));
      return { data: row ? { ...row } : null, error: null };
    }
    if (this.operation === "insert") {
      const inserted = this.payload ?? {};
      if (rows.some((row) => row.id === inserted.id)) {
        return { data: null, error: { code: "23505", message: "duplicate record" } };
      }
      const saved = { revision: 1, ...inserted };
      rows.push(saved);
      this.database.successfulBusinessWrites += 1;
      return { data: this.returning ? { ...saved } : null, error: null };
    }

    const existing = rows.find((candidate) => this.matches(candidate));
    if (!existing) return { data: null, error: null };
    Object.assign(existing, this.payload ?? {});
    this.database.successfulBusinessWrites += 1;
    return { data: this.returning ? { ...existing } : null, error: null };
  }
}

class FakeDatabase {
  tables: Record<string, Row[]> = { radars: [] };
  receipts: Row[] = [];
  receiptWriteFailures = 0;
  successfulBusinessWrites = 0;

  from(table: string): FakeQuery {
    return new FakeQuery(this, table);
  }

  async rpc(): Promise<QueryResult> {
    return { data: null, error: null };
  }

  client(): SyncClient {
    return this as unknown as SyncClient;
  }
}

describe("runPush transport — Radar mutation receipts", () => {
  it("creates a Radar and stores its authoritative receipt", async () => {
    const db = new FakeDatabase();
    const entry = radarEntry("create", {
      title: "Recherche locale",
      query: "aide déménagement",
      category: "services",
      radiusKm: 5,
    });

    const result = await runPush(db.client(), request(entry), ownerId);

    expect(result.accepted).toEqual([mutationId]);
    expect(result.rejected).toEqual([]);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.tables.radars[0]).toMatchObject({
      id: recordId,
      owner_id: ownerId,
      title: "Recherche locale",
      query: "aide déménagement",
    });
    expect(db.receipts).toHaveLength(1);
    expect(db.receipts[0]).toMatchObject({
      mutation_id: mutationId,
      owner_id: ownerId,
      logical_table: "radars",
      record_id: recordId,
    });
  });

  it("updates an existing Radar and stores the resulting record in its receipt", async () => {
    const db = new FakeDatabase();
    db.tables.radars.push({
      id: recordId,
      owner_id: ownerId,
      title: "Ancien titre",
      revision: 1,
    });
    const entry = radarEntry("update", { title: "Nouveau titre" });

    const result = await runPush(db.client(), request(entry), ownerId);

    expect(result.accepted).toEqual([mutationId]);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.tables.radars[0].title).toBe("Nouveau titre");
    expect(db.receipts[0].response).toMatchObject({
      table: "radars",
      data: { id: recordId, title: "Nouveau titre" },
    });
  });

  it("performs a logical delete and records the accepted deletion", async () => {
    const db = new FakeDatabase();
    db.tables.radars.push({
      id: recordId,
      owner_id: ownerId,
      title: "Radar à clôturer",
      revision: 1,
      deleted_at: null,
    });
    const entry = radarEntry("delete", {});

    const result = await runPush(db.client(), request(entry), ownerId);

    expect(result.accepted).toEqual([mutationId]);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.tables.radars[0].deleted_at).toEqual(expect.any(Number));
    expect(db.receipts).toHaveLength(1);
    expect(db.receipts[0].response).toMatchObject({
      table: "radars",
      deleted: true,
    });
  });

  it("replays the same mutation id from its receipt without a second business write", async () => {
    const db = new FakeDatabase();
    const entry = radarEntry("create", {
      title: "Radar idempotent",
      query: "plombier",
      category: "services",
      radiusKm: 3,
    });

    const first = await runPush(db.client(), request(entry), ownerId);
    const writesAfterFirstPush = db.successfulBusinessWrites;
    const second = await runPush(db.client(), request(entry), ownerId);

    expect(first.accepted).toEqual([mutationId]);
    expect(second.accepted).toEqual([mutationId]);
    expect(db.successfulBusinessWrites).toBe(writesAfterFirstPush);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.receipts).toHaveLength(1);
  });

  it("recovers an applied write when receipt storage fails, then accepts the retry without duplicating the record", async () => {
    const db = new FakeDatabase();
    db.receiptWriteFailures = 1;
    const entry = radarEntry("create", {
      title: "Radar avec reçu temporairement indisponible",
      query: "garde d'enfants",
      category: "services",
      radiusKm: 2,
    });

    const first = await runPush(db.client(), request(entry), ownerId);

    expect(first.accepted).toEqual([]);
    expect(first.rejected).toEqual([
      { id: mutationId, code: "server_error", retryable: true },
    ]);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.receipts).toHaveLength(0);

    const retry = await runPush(db.client(), request(entry), ownerId);

    expect(retry.accepted).toEqual([mutationId]);
    expect(retry.rejected).toEqual([]);
    expect(db.tables.radars).toHaveLength(1);
    expect(db.successfulBusinessWrites).toBe(1);
    expect(db.receipts).toHaveLength(1);
  });
});
