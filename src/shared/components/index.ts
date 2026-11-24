/**
 * shared/components — domain-agnostic composed primitives only.
 *
 * Business-specific components remain in their owning domains.
 * Implementations live in this directory; legacy src/components/app paths
 * are compatibility façades during the migration.
 */
export { Icon } from "./Icon";
export { Surface } from "./Surface";
export { SmartCard } from "./SmartCard";
export { FloatingButton } from "./FloatingButton";
export { SmartTabs, type SmartTab } from "./SmartTabs";
export { Sheet } from "./Sheet";
export { Modal } from "./Modal";
export { Indicator } from "./Indicator";
export { StatusBanner } from "./StatusBanner";
export { FormField } from "./FormField";
export { SkeletonLine, SkeletonText, SkeletonCard, SkeletonList } from "./Skeletons";
