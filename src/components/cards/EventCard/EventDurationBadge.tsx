import * as React from "react";
import { Clock } from "lucide-react";
import { useLocale } from "next-intl";
import { formatEventDescription } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface EventDurationBadgeProps {
  durationInMinutes: number;
  /** Active events use the primary accent; inactive ones a muted tone. */
  isActive: boolean;
}

/** Pill showing a human-readable event duration (e.g. "30 min"). */
export function EventDurationBadge({
  durationInMinutes,
  isActive,
}: EventDurationBadgeProps): React.JSX.Element {
  const locale = useLocale();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.6875rem] font-semibold border transition-all duration-200",
        isActive
          ? "text-primary bg-primary/10 border-primary/20 dark:bg-primary/20 dark:border-primary/30 hover:bg-primary/15"
          : "text-muted-foreground/80 bg-muted border-border/30",
      )}
    >
      <Clock aria-hidden="true" className="size-3" />
      <span>{formatEventDescription(durationInMinutes, locale)}</span>
    </div>
  );
}
