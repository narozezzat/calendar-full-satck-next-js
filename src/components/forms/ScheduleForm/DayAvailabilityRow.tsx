import * as React from "react";
import { type Control, type FieldErrors } from "react-hook-form";
import { z } from "zod";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormControl, FormField, FormItem, FormMessage } from "../../ui/form";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { scheduleFormSchema } from "@/schema/schedule";

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;
type DayOfWeek = (typeof DAYS_OF_WEEK_IN_ORDER)[number];

/** A single availability slot field paired with its index in the form array. */
type DaySlot = { id: string; index: number };

interface DayAvailabilityRowProps {
  dayOfWeek: DayOfWeek;
  /** Slots belonging to this day, each carrying its form-array index. */
  daySlots: DaySlot[];
  control: Control<ScheduleFormValues>;
  errors: FieldErrors<ScheduleFormValues>;
  onAdd: (dayOfWeek: DayOfWeek) => void;
  onRemove: (index: number) => void;
}

const timeInputClassName =
  "w-24 h-9 text-center bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 text-sm font-medium";

/**
 * One weekday row of the schedule editor: a day badge with an "add slot"
 * button and the list of start/end time inputs (or an "unavailable" marker).
 */
export function DayAvailabilityRow({
  dayOfWeek,
  daySlots,
  control,
  errors,
  onAdd,
  onRemove,
}: DayAvailabilityRowProps): React.JSX.Element {
  const t = useTranslations("schedule");
  const tDays = useTranslations("days");
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-border bg-card/45 hover:bg-card/75 transition-all shadow-sm">
      {/* Weekday badge block */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-28 shrink-0 pt-1">
        <span className="uppercase text-xs font-extrabold tracking-wider text-foreground bg-primary/10 border border-primary/20 rounded px-2.5 py-1 text-center w-16 select-none shadow-sm">
          {tDays(dayOfWeek)}
        </span>
        <Button
          type="button"
          size="icon"
          className="size-7 rounded-lg bg-secondary border border-border/60 hover:bg-primary hover:border-primary text-secondary-foreground hover:text-primary-foreground transition-all flex items-center justify-center shadow-sm"
          onClick={() => onAdd(dayOfWeek)}
          aria-label={t("addSlotAria", { day: tDays(dayOfWeek) })}
        >
          <Plus aria-hidden="true" className="size-4.5" />
        </Button>
      </div>

      {/* Availability time inputs list */}
      <div className="flex-1 flex flex-col gap-2.5">
        {daySlots.length === 0 ? (
          <div className="flex items-center pt-1">
            <span className="text-[0.625rem] uppercase font-bold tracking-wider text-muted-foreground bg-secondary/80 px-2.5 py-1 rounded border border-border/50 select-none">
              {tCommon("unavailable")}
            </span>
          </div>
        ) : (
          daySlots.map((field, labelIndex) => (
            <div className="flex flex-col gap-1" key={field.id}>
              <div className="flex gap-2 items-center">
                <FormField
                  control={control}
                  name={`availabilities.${field.index}.startTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={timeInputClassName}
                          placeholder="09:00"
                          aria-label={t("startTimeAria", {
                            day: tDays(dayOfWeek),
                            index: labelIndex + 1,
                          })}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <span className="text-muted-foreground font-semibold">-</span>
                <FormField
                  control={control}
                  name={`availabilities.${field.index}.endTime`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className={timeInputClassName}
                          placeholder="17:00"
                          aria-label={t("endTimeAria", {
                            day: tDays(dayOfWeek),
                            index: labelIndex + 1,
                          })}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructiveGhost"
                  className="size-8 rounded-lg border border-destructive/20 bg-destructive/15 hover:bg-destructive hover:text-destructive-foreground text-destructive transition-all"
                  onClick={() => onRemove(field.index)}
                  aria-label={t("removeSlotAria", {
                    index: labelIndex + 1,
                    day: tDays(dayOfWeek),
                  })}
                >
                  <X aria-hidden="true" className="size-3.5" />
                </Button>
              </div>
              <FormMessage>
                {errors.availabilities?.at?.(field.index)?.root?.message}
              </FormMessage>
              <FormMessage>
                {errors.availabilities?.at?.(field.index)?.startTime?.message}
              </FormMessage>
              <FormMessage>
                {errors.availabilities?.at?.(field.index)?.endTime?.message}
              </FormMessage>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
