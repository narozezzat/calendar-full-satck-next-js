import * as React from "react";
import { EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface EventStatusBadgeProps {
  isActive: boolean;
}

/** Animated "active" / muted "inactive" status pill for an event card. */
export function EventStatusBadge({
  isActive,
}: EventStatusBadgeProps): React.JSX.Element {
  const t = useTranslations("common");

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
        </span>
        <span>{t("active")}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold bg-muted-foreground/10 text-muted-foreground/50 border border-border/40">
      <EyeOff aria-hidden="true" className="size-3" />
      <span>{t("inactive")}</span>
    </span>
  );
}
