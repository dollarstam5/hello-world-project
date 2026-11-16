import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n/useI18n";
import type { useFlashComposer } from "./useFlashComposer";
import { FlashComposerWriteStep } from "./FlashComposerWriteStep";
import { FlashComposerReviewStep } from "./FlashComposerReviewStep";

type ComposerState = ReturnType<typeof useFlashComposer>;
type Props = {
  state: ComposerState;
  user: { id: string } | null;
  authLoading: boolean;
};

export function FlashComposerDialog({ state, user, authLoading }: Props) {
  const { t } = useI18n();

  return (
    <Dialog
      open={state.composerOpen}
      onOpenChange={(open) => {
        if (!open && !state.publishing) state.closeComposer();
      }}
    >
      <DialogContent className="fixed bottom-0 left-0 top-auto max-h-[92dvh] w-full max-w-lg translate-x-0 translate-y-0 overflow-y-auto rounded-t-[1.75rem] border-border bg-background p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:left-[50%] sm:top-[50%] sm:bottom-auto sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[1.75rem] sm:p-6">
        <DialogHeader className="mb-5 pr-10 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {state.step === "write" ? t("flash.composer.step1") : t("flash.composer.step2")}
          </p>
          <DialogTitle className="mt-1 text-xl font-bold">
            {state.step === "write" ? t("flash.composer.title") : t("flash.composer.reviewTitle")}
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            {state.step === "write"
              ? t("flash.composer.description")
              : t("flash.composer.reviewDescription")}
          </DialogDescription>
        </DialogHeader>

        {state.step === "write" ? (
          <FlashComposerWriteStep state={state} />
        ) : (
          <FlashComposerReviewStep state={state} user={user} authLoading={authLoading} />
        )}
      </DialogContent>
    </Dialog>
  );
}
