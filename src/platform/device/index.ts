/** Device, viewport and network capabilities. */
export { useDevice } from "./useDevice";
export { useNetworkStatus } from "./useNetworkStatus";
export { useResponsive } from "./useResponsive";
export {
  detectPlatformIdentity,
  getDetailedPlatformIdentity,
  getPlatformCapabilities,
} from "./capabilities";
export type {
  PlatformOS,
  BrowserName,
  PlatformIdentity,
  PlatformCapabilities,
} from "./capabilities";
export type { DeviceClass, DeviceInfo } from "./useDevice";
export type { NetworkStatus } from "./useNetworkStatus";
export type { ResponsiveInfo } from "./useResponsive";
