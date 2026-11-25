import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
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
import { ProfileFieldRow } from "./ProfileFieldRow";
import { supabase } from "@/integrations/supabase/client";
import { useIdentity } from "@/domains/profile/model/identity";
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
      try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (!active) return;

        if (authError || !authData.user) {
          setUserId(null);
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
          setIdentityName(data.display_name || undefined, authData.user.id);
        }
      } catch {
        if (active) setError("profile.error");
      } finally {
        if (active) setLoading(false);
      }
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

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(update)
        .eq("id", userId);

      if (updateError) {
        setError("profile.error");
      } else {
        if (field === "handle") {
          setProfile({ ...profile, handle: value || null });
        } else {
          setProfile({ ...profile, display_name: value });
        }
        if (field === "display_name") setIdentityName(value, userId);
        setEditing(null);
        setNotice("profile.saved");
      }
    } catch {
      setError("profile.error");
    } finally {
      setSaving(false);
    }
  }

  async function removeHandle() {
    if (!profile || !userId || !profile.handle) return;

    setSaving(true);
    setError("");
    try {
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
    } catch {
      setError("profile.error");
    } finally {
      setSaving(false);
    }
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
          <Link to="/auth" search={{ mode: undefined }}>
            {t("auth.signIn")}
          </Link>
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
              <ProfileFieldRow
                field="display_name"
                value={profile.display_name}
                label={t("profile.name")}
                editing={editing}
                draft={draft}
                saving={saving}
                t={t}
                onDraftChange={setDraft}
                onSave={(field) => void saveField(field)}
                onCancel={() => setEditing(null)}
                onEdit={beginEdit}
              />
            </div>
            <div className="pt-4">
              <ProfileFieldRow
                field="handle"
                value={profile.handle}
                label={t("profile.handle")}
                editing={editing}
                draft={draft}
                saving={saving}
                t={t}
                onDraftChange={setDraft}
                onSave={(field) => void saveField(field)}
                onCancel={() => setEditing(null)}
                onEdit={beginEdit}
              />
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
