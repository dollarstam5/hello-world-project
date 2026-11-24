import { Check, Pencil, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MessageKey } from "@/lib/i18n/messages";

export type EditableProfileField = "display_name" | "handle";

type ProfileFieldRowProps = {
  field: EditableProfileField;
  value: string | null;
  label: string;
  editing: EditableProfileField | null;
  draft: string;
  saving: boolean;
  t: (key: MessageKey) => string;
  onDraftChange: (value: string) => void;
  onSave: (field: EditableProfileField) => void;
  onCancel: () => void;
  onEdit: (field: EditableProfileField) => void;
};

export function ProfileFieldRow({
  field,
  value,
  label,
  editing,
  draft,
  saving,
  t,
  onDraftChange,
  onSave,
  onCancel,
  onEdit,
}: ProfileFieldRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {editing === field ? (
          <div className="mt-2 flex gap-2">
            <Input
              autoFocus
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              className="h-11 min-w-0"
              aria-label={label}
            />
            <Button
              type="button"
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={saving}
              onClick={() => onSave(field)}
              aria-label={t("common.save")}
            >
              <Check className="h-4 w-4" aria-hidden />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-11 w-11 shrink-0"
              disabled={saving}
              onClick={onCancel}
              aria-label={t("common.cancel")}
            >
              <X className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        ) : (
          <p className="mt-1 truncate text-sm font-medium">{value || t("profile.notProvided")}</p>
        )}
      </div>
      {editing !== field ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0"
          onClick={() => onEdit(field)}
          aria-label={`${t("profile.edit")} ${label}`}
        >
          {value ? (
            <Pencil className="h-4 w-4" aria-hidden />
          ) : (
            <Plus className="h-5 w-5" aria-hidden />
          )}
        </Button>
      ) : null}
    </div>
  );
}
