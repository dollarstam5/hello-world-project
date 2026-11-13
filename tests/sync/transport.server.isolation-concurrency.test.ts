import { describe, expect, it } from "vitest";
import type { OutboxEntry, PushRequest } from "@eco/core-contracts";
import { runPush, type SyncClient } from "@/lib/sync/transport.server";

type Row = Record<string, unknown>;
type QueryResult = { data: unknown; error: { code?: string; message?: string } | null };

const ownerA = "00000000-0000-4000-8000-000000000011";
const ownerB = "00000000-0000-4000-8000-000000000012";
const recordA = "00000000-0000-4000-8000-000000000021";
const recordB = "00000000-0000-4000-8000-000000000022";
const mutationA = "00000000-0000-4000-8000-000000000031";
const mutationB = "00000000-0000-4000-8000-000000000032";

function entry(
  ownerId: string,
  recordId: string,
  mutationId: string,
  kind: OutboxEntry["kind"] = "create",
  patch: Row = {
    title: "Radar de test",
    query: "recherche locale",
    category: "services",
    radiusKm: 5,
  },
): OutboxEntry {
  return {
    id: mutationId,
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

function pushRequest(item: OutboxEntry): PushRequest {
  return { protocolVersion: 2, entries: [item] };
}

/**
 * This fake enforces the same owner predicates as the relevant RLS policies:
 * radar rows and receipt rows are visible only to their authenticated owner.
 * It is a transport-level isolation test, not a substitute for PostgreSQL RLS tests.
 */
class IsolationQuery {
  private operation: "select" | "insert" | "update" = "select";
  private payload: Row | null = null;
  private filters: Array<[string, unknown]> = [];
  private returning = false;

  constructor(
    private readonly database: IsolationDatabase,
    private readonly table: string,
    private readonly authenticatedUserId: string,
  ) {}

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

  maybeSingle(): Promise<QueryResult> {
    return this.execute();
  }

  then<TResult1 = QueryResult, TResult2 = never>(
    onfulfilled?: ((value: QueryResult) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled ?? undefined, onrejected ?? undefined);
  }

  private isVisible(row: Row): boolean {
    return row.owner_id === this.authenticatedUserId;
  }

  private matches(row: Row): boolean {
    return this.filters.every(([column, value]) => row[column] === value);
  }

  private async execute(): Promise<QueryResult> {
    if (this.table === "sync_mutation_receipts") {
      if (this.operation === "select") {
        await this.database.waitForConcurrentReceiptReads();
        const receipt = this.database.receipts.find(
          (row) => this.isVisible(row) && this.matches(row),
        );
        return { data: receipt ? { response: receipt.response } : null, error: null };
      }

      const receipt = this.payload ?? {};
      if (receipt.owner_id !== this.authenticatedUserId) {
        return { data: null, error: { code: "42501", message: "RLS insert denied" } };
      }
      if (this.database.receipts.some((row) => row.mutation_id === receipt.mutation_id)) {
        return { data: null, error: { code: "23505", message: "duplicate receipt" } };
      }
      this.database.receipts.push({ ...receipt });
      return { data: null, error: null };
    }

    const rows = this.database.radars;
    if (this.operation === "select") {
      const row = rows.find(
        (candidate) => this.isVisible(candidate) && this.matches(candidate),
      );
      return { data: row ? { ...row } : null, error: null };
    }

    if (this.operation === "insert") {
      const inserted = this.payload ?? {};
      if (inserted.owner_id !== this.authenticatedUserId) {
        return { data: null, error: { code: "42501", message: "RLS insert denied" } };
      }
      if (rows.some((row) => row.id === inserted.id)) {
        return { data: null, error: { code: "23505", message: "duplicate Radar" } };
      }
      const saved = { revision: 1, ...inserted };
      rows.push(saved);
      this.database.businessWrites += 1;
      return { data: this.returning ? { ...saved } : null, error: null };
    }

    const existing = rows.find(
      (candidate) => this.isVisible(candidate) && this.matches(candidate),
    );
    if (!existing) return { data: null, error: null };
    Object.assign(existing, this.payload ?? {});
    this.database.businessWrites += 1;
    return { data: this.returning ? { ...existing } : null, error: null };
  }
}

class IsolationDatabase {
  radars: Row[] = [];
  receipts: Row[] = [];
  businessWrites = 0;
  private receiptReadBarrier:
    | { target: number; arrivals: number; promise: Promise<void>; release: () => void }
    | undefined;

  armReceiptReadBarrier(target: number): void {
    let release = () => {};
    const promise = new Promise<void>((resolve) => {
      release = resolve;
    });
    this.receiptReadBarrier = { target, arrivals: 0, promise, release };
  }

  async waitForConcurrentReceiptReads(): Promise<void> {
    const barrier = this.receiptReadBarrier;
    if (!barrier || barrier.arrivals >= barrier.target) return;
    barrier.arrivals += 1;
    if (barrier.arrivals === barrier.target) barrier.release();
    await barrier.promise;
  }

  client(authenticatedUserId: string): SyncClient {
    return {
      from: (table: string) => new IsolationQuery(this, table, authenticatedUserId),
      rpc: async () => ({ data: null, error: null }),
    } as unknown as SyncClient;
  }
}

describe("runPush transport — owner isolation and concurrency", () => {
  it("keeps Radar records and replay receipts isolated between two owners", async () => {
    const database = new IsolationDatabase();
    const ownerAEntry = entry(ownerA, recordA, mutationA, "create", {
      title: "Radar privé A",
      query: "contenu A",
      category: "services",
      radiusKm: 3,
    });
    const ownerBEntry = entry(ownerB, recordB, mutationB, "create", {
      title: "Radar privé B",
      query: "contenu B",
      category: "services",
      radiusKm: 5,
    });

    const firstOwnerPush = await runPush(
      database.client(ownerA),
      pushRequest(ownerAEntry),
      ownerA,
    );
    const secondOwnerPush = await runPush(
      database.client(ownerB),
      pushRequest(ownerBEntry),
      ownerB,
    );
    const ownerARetry = await runPush(
      database.client(ownerA),
      pushRequest(ownerAEntry),
      ownerA,
    );
    const ownerBRetry = await runPush(
      database.client(ownerB),
      pushRequest(ownerBEntry),
      ownerB,
    );

    expect(firstOwnerPush.accepted).toEqual([mutationA]);
    expect(secondOwnerPush.accepted).toEqual([mutationB]);
    expect(ownerARetry.accepted).toEqual([mutationA]);
    expect(ownerBRetry.accepted).toEqual([mutationB]);
    expect(ownerARetry.records[0]?.data).toMatchObject({ title: "Radar privé A" });
    expect(ownerBRetry.records[0]?.data).toMatchObject({ title: "Radar privé B" });
    expect(database.radars).toHaveLength(2);
    expect(database.receipts).toHaveLength(2);
    expect(database.receipts.every((receipt) => receipt.owner_id === ownerA || receipt.owner_id === ownerB)).toBe(
      true,
    );
  });

  it("does not let one owner update another owner's Radar or create a receipt for that attempt", async () => {
    const database = new IsolationDatabase();
    database.radars.push({
      id: recordA,
      owner_id: ownerA,
      title: "Radar appartenant à A",
      query: "donnée privée",
      category: "services",
      radius_km: 5,
      revision: 1,
      deleted_at: null,
    });
    const attemptedUpdate = entry(ownerB, recordA, mutationB, "update", {
      title: "Modification non autorisée",
    });

    const result = await runPush(database.client(ownerB), pushRequest(attemptedUpdate), ownerB);

    expect(result.accepted).toEqual([]);
    expect(result.rejected).toEqual([
      { id: mutationB, code: "record_not_found", retryable: false },
    ]);
    expect(database.radars[0]).toMatchObject({
      owner_id: ownerA,
      title: "Radar appartenant à A",
    });
    expect(database.receipts).toHaveLength(0);
  });

  it("rejects an outbox entry whose declared owner differs from the authenticated user", async () => {
    const database = new IsolationDatabase();
    const forgedEntry = entry(ownerA, recordA, mutationA);

    const result = await runPush(database.client(ownerB), pushRequest(forgedEntry), ownerB);

    expect(result.accepted).toEqual([]);
    expect(result.rejected).toEqual([
      { id: mutationA, code: "owner_mismatch", retryable: false },
    ]);
    expect(database.radars).toHaveLength(0);
    expect(database.receipts).toHaveLength(0);
  });

  it("accepts concurrent retries of the same mutation without duplicating the Radar or receipt", async () => {
    const database = new IsolationDatabase();
    database.armReceiptReadBarrier(2);
    const sameMutation = entry(ownerA, recordA, mutationA);

    const [first, second] = await Promise.all([
      runPush(database.client(ownerA), pushRequest(sameMutation), ownerA),
      runPush(database.client(ownerA), pushRequest(sameMutation), ownerA),
    ]);

    expect(first.accepted).toEqual([mutationA]);
    expect(second.accepted).toEqual([mutationA]);
    expect(first.rejected).toEqual([]);
    expect(second.rejected).toEqual([]);
    expect(database.radars).toHaveLength(1);
    expect(database.receipts).toHaveLength(1);
    expect(database.businessWrites).toBe(1);
  });
});
