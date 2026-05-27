"use client";

import * as React from "react";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

export function LanguageSwitcher(): React.JSX.Element {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale: Locale = locale === "en" ? "ar" : "en";
  const nextLabel = nextLocale === "ar" ? "العربية" : "English";
  const nextShort = nextLocale === "ar" ? "AR" : "EN";

  function handleToggle(): void {
    if (isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={handleToggle}
      disabled={isPending}
      aria-label={`${t("switchLabel")} (${nextLabel})`}
      title={nextLabel}
      className={cn(
        "h-9 px-3 rounded-full border border-border/40 bg-secondary/15 hover:bg-secondary/40 hover:border-primary/30",
        "text-foreground transition-all duration-300 group gap-2",
      )}
    >
      <Globe
        aria-hidden="true"
        className="size-4 text-primary/80 group-hover:text-primary transition-colors"
      />
      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
        {nextShort}
      </span>
    </Button>
  );
}
