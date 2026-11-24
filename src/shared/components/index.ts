/**
 * shared/components — domain-agnostic composed primitives only.
 *
 * Governance: shared MUST NOT export business-specific components
 * (WalletCard, RadarCard, TrustCard, FlashCard, etc.). Those live in
 * their owning module and are re-exported through their module entrypoints.
 */
export { Icon } from "./Icon";
export { Surface } from "./Surface";
export { Indicator } from "./Indicator";
export { SmartCard } from "@/components/app/SmartCard";
export { AIBubble } from "@/components/app/AIBubble";
export { FloatingButton } from "@/components/app/FloatingButton";
export { SmartTabs, type SmartTab } from "@/components/app/SmartTabs";
export { Sheet } from "@/components/app/Sheet";
export { Modal } from "@/components/app/Modal";
export { EmptyState } from "@/components/app/EmptyState";
export { StatusBanner } from "@/components/app/StatusBanner";
export { FormField } from "@/components/app/FormField";
export { SkeletonLine, SkeletonText, SkeletonCard, SkeletonList } from "@/components/app/Skeletons";
export { SyncIndicator } from "./SyncIndicator";
