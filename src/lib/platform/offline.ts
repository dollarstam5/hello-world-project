/**
 * Offline-first foundation.
 *
 * Tiny localStorage-backed cache + write-queue scaffold. Domains use this
 * (rather than touching localStorage directly) so we can swap the engine
 * for IndexedDB / a SW background-sync queue without rewriting consumers.
 */

const NS = "eco.cache.v1";
const QUEUE_KEY = "eco.queue.v1";

export interface QueuedMutation {
  id: string;
  domain: string;
  action: string;
  payload: unknown;
  createdAt: number;
}

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export const offlineStore = {
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    return safeParse<T | null>(window.localStorage.getItem(`${NS}:${key}`), null);
  },
  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`${NS}:${key}`, JSON.stringify(value));
  },
  remove(key: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(`${NS}:${key}`);
  },
};

export const mutationQueue = {
  all(): QueuedMutation[] {
    if (typeof window === "undefined") return [];
    return safeParse<QueuedMutation[]>(window.localStorage.getItem(QUEUE_KEY), []);
  },
  enqueue(m: Omit<QueuedMutation, "id" | "createdAt">): QueuedMutation {
    const entry: QueuedMutation = { ...m, id: crypto.randomUUID(), createdAt: Date.now() };
    const next = [...this.all(), entry];
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(next));
    return entry;
  },
  drain(handler: (m: QueuedMutation) => Promise<void>) {
    const items = this.all();
    return Promise.allSettled(items.map(handler));
  },
  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(QUEUE_KEY);
  },
};
