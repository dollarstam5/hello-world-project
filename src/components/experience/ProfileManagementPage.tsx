import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useIdentity } from "@/lib/experience/identity";
import { useI18n } from "@/lib/i18n/useI18n";
import type { MessageKey } from "@/lib/i18n/messages";

type EditableField = "display_name" | "handle";
type ProfileRecord = {
  display_name: string;
  handle: string | null;
};

export function ProfileManagementPage() {
  const { t } = useI18n();
  const setIdentityName = useIdentity((state) => state.setDisplayName);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmRemoveHandle, setConfirmRemoveHandle] = useState(false);
  const [editing, setEditing] = useState<EditableField | null>(null);
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState<MessageKey | "">("");
  const [error, setError] = useState<MessageKey | "">("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (!active) return;

      if (authError || !authData.user) {
        setUserId(null);
        setLoading(false);
        return;
      }

      setUserId(authData.user.id);
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("display_name,handle")
        .eq("id", authData.user.id)
        .maybeSingle();

      if (!active) return;
      if (profileError || !data) {
        setError("profile.error");
      } else {
        setProfile(data);
        setIdentityName(data.display_name || undefined);
      }
      setLoading(false);
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [setIdentityName]);

  function beginEdit(field: EditableField) {
    if (!profile) return;
    setError("");
    setNotice("");
    setEditing(field);
    setDraft(profile[field] ?? "");
  }

  async function saveField(field: EditableField) {
    if (!profile || !userId) return;
    const value = draft.trim();

    if (field === "display_name" && !value) {
      setError("profile.nameRequired");
      return;
    }

    setSaving(true);
    setError("");
    const update = field === "handle" ? { handle: value || null } : { display_name: value };
    const { error: updateError } = await supabase.from("profiles").update(update).eq("id", userId);

    if (updateError) {
      setError("profile.error");
    } else {
      if (field === "handle") {
        setProfile({ ...profile, handle: value || null });
      } else {
        setProfile({ ...profile, display_name: value });
      }
      if (field === "display_name") setIdentityName(value);
      setEditing(null);
      setNotice("profile.saved");
    }
    setSaving(false);
  }

  async function removeHandle() {
    if (!profile || !userId || !profile.handle) return;

    setSaving(true);
    setError("");
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ handle: null })
      .eq("id", userId);

    if (updateError) {
      setError("profile.error");
    } else {
      setProfile({ ...profile, handle: null });
      setEditing(null);
      setNotice("profile.saved");
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="page-shell py-10 text-center text-sm text-muted-foreground">
        {t("app.loading")}
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="page-shell stack-4">
        <header className="stack-2">
          <p className="text-sm font-medium text-primary">{t("profile.eyebrow")}</p>
          <h1 className="text-fluid-display-sm">{t("profile.title")}</h1>
          <p className="text-subtitle">{t("profile.signInHint")}</p>
        </header>
        <Button asChild className="h-12 rounded-xl">
          <Link to="/auth">{t("auth.signIn")}</Link>
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page-shell stack-3">
        <h1 className="text-fluid-display-sm">{t("profile.title")}</h1>
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t(error || "profile.error")}
        </p>
      </div>
    );
  }

  const fieldRow = (field: EditableField, value: string | null, label: string) => (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {editing === field ? (
          <div className="mt-2 flex gap-2">
            <Input
              autoFocus
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-11 min-w-0"
              aria-label={label}
            />
            <Button
              type="button"
              size="icon"
              className="h-11 w-11 shrink-0"
              disabled={saving}
              onClick={() => void saveField(field)}
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
              onClick={() => setEditing(null)}
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
          onClick={() => beginEdit(field)}
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

  return (
    <div className="page-shell stack-6">
      <header className="stack-2 motion-rise-in">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link to="/espace">{t("space.back")}</Link>
        </Button>
        <p className="text-sm font-medium text-primary">{t("profile.eyebrow")}</p>
        <h1 className="text-fluid-display-sm">{t("profile.title")}</h1>
        <p className="text-subtitle max-w-prose">{t("profile.subtitle")}</p>
      </header>

      {notice ? (
        <p role="status" className="rounded-xl bg-primary-soft px-3 py-2 text-sm text-primary">
          {t(notice)}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {t(error)}
        </p>
      ) : null}

      <section className="stack-3">
        <h2 className="text-base font-semibold">{t("profile.section.identity")}</h2>
        <Surface variant="elevated" padding="lg" bordered>
          <div className="divide-y divide-border-soft">
            <div className="pb-4">
              {fieldRow("display_name", profile.display_name, t("profile.name"))}
            </div>
            <div className="pt-4">
              {fieldRow("handle", profile.handle, t("profile.handle"))}
              {profile.handle && editing !== "handle" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={saving}
                  onClick={() => setConfirmRemoveHandle(true)}
                  className="mt-2 h-10 px-2 text-muted-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                  {t("profile.handle.remove")}
                </Button>
              ) : null}
            </div>
          </div>
        </Surface>
      </section>

      <section className="stack-2">
        <h2 className="text-base font-semibold">{t("profile.section.protection")}</h2>
        <Surface variant="sunken" padding="md" bordered>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {t("profile.systemFields")}
          </p>
        </Surface>
      </section>

      <AlertDialog open={confirmRemoveHandle} onOpenChange={setConfirmRemoveHandle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("profile.handle.removeTitle")}</AlertDialogTitle>
            <AlertDialogDescription>{t("profile.handle.removeConfirm")}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={saving}
              onClick={() => void removeHandle()}
            >
              {t("profile.handle.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
