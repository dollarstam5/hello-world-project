/**
 * Feature-level registry for composing discovery sections on the home journey.
 * Domain modules register their own presentation without being imported here.
 */
import type { ReactNode } from "react";

export interface DiscoverySection {
  key: string;
  titleKey: string;
  order: number;
  render: () => ReactNode;
}

const sections = new Map<string, DiscoverySection>();

export function registerDiscoverySection(section: DiscoverySection) {
  sections.set(section.key, section);
}

export function unregisterDiscoverySection(key: string) {
  sections.delete(key);
}

export function getDiscoverySections(): DiscoverySection[] {
  return [...sections.values()].sort((a, b) => a.order - b.order);
}
