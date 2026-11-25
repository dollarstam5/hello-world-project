import type { ScanQuery, ScanResult } from "@eco/core-contracts";
import { discoverPublicFlashes } from "@/services/public-flash-discovery.server";

/** Scan-specific server entry; discovery mechanics live in a neutral shared service. */
export async function scanPublicFlashes(query: ScanQuery): Promise<ScanResult[]> {
  return discoverPublicFlashes(query);
}
