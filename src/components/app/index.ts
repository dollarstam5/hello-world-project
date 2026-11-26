/**
 * Legacy app-component compatibility barrel.
 *
 * Canonical generic primitives live in src/shared/components. Domain-owned
 * components exposed here are compatibility facades; new consumers should
 * import from their owning module or shared component entrypoint.
 */

export { Icon } from "./Icon";
export { Surface } from "./Surface";
export { SmartCard } from "./SmartCard";
export { FlashCard } from "./FlashCard";
export { RadarCard } from "./RadarCard";
export { WalletCard } from "./WalletCard";
export { TrustCard } from "./TrustCard";
export { AIBubble } from "./AIBubble";
export { FloatingButton } from "./FloatingButton";
export { SmartTabs, type SmartTab } from "./SmartTabs";
export { Sheet } from "./Sheet";
export { Modal } from "./Modal";
export { Indicator } from "./Indicator";
export { EmptyState } from "./EmptyState";
export { StatusBanner } from "./StatusBanner";
export { FormField } from "./FormField";
export { SkeletonLine, SkeletonText, SkeletonCard, SkeletonList } from "./Skeletons";
export { PublicProfilePreview } from "./PublicProfilePreview";
