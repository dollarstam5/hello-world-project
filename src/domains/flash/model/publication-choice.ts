export const FLASH_PUBLISH_NOW_ENABLED = false;

export function canSaveFlashLater({
  hasUser,
  authLoading,
  publishing,
  text,
}: {
  hasUser: boolean;
  authLoading: boolean;
  publishing: boolean;
  text: string;
}) {
  return hasUser && !authLoading && !publishing && text.trim().length > 0;
}
