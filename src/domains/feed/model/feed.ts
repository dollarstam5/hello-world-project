/**
 * Domain-owned feed contracts and source registry.
 * Sources own the business query; this module only composes typed entries.
 */
export interface FeedItem<T = unknown> {
  id: string;
  source: string;
  weight?: number;
  ts: number;
  payload: T;
}

export interface FeedSource {
  key: string;
  load: () => Promise<FeedItem[]>;
}

const sources = new Map<string, FeedSource>();

export function registerFeedSource(source: FeedSource) {
  sources.set(source.key, source);
}

export function unregisterFeedSource(key: string) {
  sources.delete(key);
}

export async function loadFeed(): Promise<FeedItem[]> {
  const all = await Promise.all(
    [...sources.values()].map((source) => source.load().catch(() => [])),
  );
  return all.flat().sort((a, b) => b.ts - a.ts || (b.weight ?? 0) - (a.weight ?? 0));
}
