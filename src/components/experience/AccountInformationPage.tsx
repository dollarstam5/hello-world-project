import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail, ShieldCheck } from "lucide-react";
import { Surface } from "@/components/app/Surface";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n/useI18n";

export function AccountInformationPage() {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) setFailed(true);
      else {
        setEmail(data.user.email ?? null);
        setCreatedAt(data.user.created_at ?? null);
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="page-shell stack-6">
      <header className="stack-2">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link to="/espace"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden />{t("space.back")}</Link>
        </Button>
        <p className="text-sm font-medium text-primary">{t("space.title")}</p>
        <h1 className="text-fluid-display-sm">{t("space.info.title")}</h1>
        <p className="text-subtitle">{t("space.info.desc")}</p>
      </header>
      {loading ? <p role="status" className="text-sm text-muted-foreground">{t("app.loading")}</p> : null}
      {failed ? <p role="alert" className="text-sm text-destructive">{t("space.info.error")}</p> : null}
      {!loading && !failed ? (
        <div className="stack-3">
          <Surface variant="elevated" padding="lg" bordered className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Mail className="h-5 w-5" aria-hidden /></span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{t("space.info.email")}</p>
              <p className="mt-1 break-all text-sm font-medium">{email || t("profile.notProvided")}</p>
            </div>
          </Surface>
          <Surface variant="sunken" padding="md" bordered className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
            <div>
              <p className="font-medium">{t("space.info.protected.title")}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("space.info.protected.desc")}</p>
            </div>
          </Surface>
          {createdAt ? (
            <p className="text-xs text-muted-foreground">{t("space.info.created")}: {new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(createdAt))}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
