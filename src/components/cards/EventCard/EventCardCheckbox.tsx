import * as React from "react";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface EventCardCheckboxProps {
  selected: boolean;
  onToggle: () => void;
}

/** Round selection checkbox shown in the card header when selectable. */
export function EventCardCheckbox({
  selected,
  onToggle,
}: EventCardCheckboxProps): React.JSX.Element {
  const t = useTranslations("common");

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      aria-label={t("select")}
      onClick={onToggle}
      className={cn(
        "flex size-5 items-center justify-center rounded-full border-[0.09375rem] cursor-pointer",
        "transition-all duration-200 active:scale-90",
        selected
          ? "border-primary bg-primary text-white shadow-sm shadow-primary/30"
          : "border-border/80 bg-card hover:border-primary/50",
      )}
    >
      <Check
        aria-hidden="true"
        className={cn(
          "size-3 transition-all duration-150",
          selected ? "scale-100 opacity-100" : "scale-0 opacity-0",
        )}
        strokeWidth={2.5}
      />
    </button>
  );
}
