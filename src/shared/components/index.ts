/**
 * shared/components — domain-agnostic composed primitives only.
 *
 * Keep business-specific components in their owning modules. Shared
 * components receive copy/content from callers rather than owning product
 * translations or application navigation.
 */
export { Icon } from "./Icon";
export { Surface } from "./Surface";
export { Indicator } from "./Indicator";
export { FormField } from "./FormField";
export { StatusBanner } from "./StatusBanner";
export { SkeletonLine, SkeletonText, SkeletonCard, SkeletonList } from "./Skeletons";
export { SmartCard } from "./SmartCard";
export { AIBubble } from "@/components/app/AIBubble";
export { FloatingButton } from "./FloatingButton";
export { SmartTabs, type SmartTab } from "./SmartTabs";
export { Sheet } from "./Sheet";
export { Modal } from "./Modal";
export { EmptyState } from "@/components/app/EmptyState";
export { SyncIndicator } from "./SyncIndicator";
