import * as React from "react";
import { type Control } from "react-hook-form";
import { z } from "zod";
import { Clock, CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { formatTimeString } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { meetingFormSchema } from "@/schema/meetings";

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

interface MeetingTimeSlotFieldProps {
  control: Control<MeetingFormValues>;
  /** Currently selected day, or undefined before one is picked. */
  date: Date | undefined;
  /** Slots bookable on the selected day, in the chosen timezone. */
  availableSlotsForDay: Date[];
}

/** Grid of selectable start-time buttons for the chosen day. */
export function MeetingTimeSlotField({
  control,
  date,
  availableSlotsForDay,
}: MeetingTimeSlotFieldProps): React.JSX.Element {
  const t = useTranslations("meetingForm");
  return (
    <FormField
      control={control}
      name="startTime"
      render={({ field }) => (
        <FormItem className="flex flex-col space-y-1.5">
          <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Clock
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <span>{t("timeLabel")}</span>
          </FormLabel>
          <div className="min-h-[6.25rem] flex-1">
            {date == null ? (
              <div className="flex flex-col items-center justify-center h-full border border-dashed border-border rounded-xl p-4 text-center bg-secondary/10">
                <CalendarIcon
                  aria-hidden="true"
                  className="size-5 text-muted-foreground/60 mb-1.5"
                />
                <span className="text-xs text-muted-foreground font-semibold">
                  {t("selectDateFirst")}
                </span>
              </div>
            ) : availableSlotsForDay.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full border border-dashed border-border rounded-xl p-4 text-center bg-secondary/10">
                <span className="text-xs text-muted-foreground font-semibold">
                  {t("noSlots")}
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-[10.9375rem] overflow-y-auto pe-1">
                {availableSlotsForDay.map((time) => {
                  const isSelected =
                    field.value?.toISOString() === time.toISOString();
                  return (
                    <Button
                      key={time.toISOString()}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "h-9 text-xs font-semibold rounded-lg transition-all",
                        isSelected
                          ? "shadow-md shadow-primary/20 scale-[1.02] bg-primary text-primary-foreground border-primary"
                          : "bg-background/40 border-input hover:border-primary/50 text-foreground",
                      )}
                      onClick={() => field.onChange(time)}
                    >
                      {formatTimeString(time)}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
