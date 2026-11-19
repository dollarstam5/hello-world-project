export function createFlashDashboardActionLock() {
  let activeId: string | null = null;

  return {
    acquire(id: string) {
      if (activeId !== null) return false;
      activeId = id;
      return true;
    },
    release(id: string) {
      if (activeId !== id) return false;
      activeId = null;
      return true;
    },
    isLocked() {
      return activeId !== null;
    },
  };
}
