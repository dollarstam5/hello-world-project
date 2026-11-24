export { ReelProximityScreen } from "./ui/ReelProximityScreen";
export { ReelCommunicationBridge } from "./model/ReelCommunicationBridge";
export {
  resetReelActivityProjection,
  useReelActivityProjection,
} from "./model/reel-activity-projection";
export type { ReelActivityMode, ReelActivitySummary } from "./model/reel-activity-projection";
export { evaluateReelAccess } from "./policy/reel-access-policy";
export type {
  ReelAccessContext,
  ReelActorRole,
  ReelOperation,
} from "./policy/reel-access-policy";
