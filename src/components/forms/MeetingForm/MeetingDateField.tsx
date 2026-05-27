import * as React from "react";
import { type Control } from "react-hook-form";
import { z } from "zod";
import { isSameDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { meetingFormSchema } from "@/schema/meetings";

type MeetingFormValues = z.infer<typeof meetingFormSchema>;

interface MeetingDateFieldProps {
    control: Control<MeetingFormValues>;
    /** Valid meeting dates already converted to the selected timezone. */
    validTimesInTimezone: Date[];
    /** Called after a date is picked (used to reset the dependent time slot). */
    onAfterSelect: () => void;
}

/** Calendar popover for picking the meeting day; disables days with no slots. */
export function MeetingDateField({
    control,
    validTimesInTimezone,
    onAfterSelect,
}: MeetingDateFieldProps): React.JSX.Element {
    const t = useTranslations("meetingForm");
    return (
        <FormField
            control={control}
            name="date"
            render={({ field }) => (
                <Popover>
                    <FormItem className="flex flex-col space-y-1.5">
                        <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <CalendarIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                            <span>{t("dateLabel")}</span>
                        </FormLabel>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "h-10 ps-3 text-start font-normal flex w-full bg-background/50 border-input hover:border-muted-foreground/40 hover:bg-secondary/40",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    {field.value ? (
                                        formatDate(field.value)
                                    ) : (
                                        <span>{t("datePlaceholder")}</span>
                                    )}
                                    <CalendarIcon aria-hidden="true" className="ms-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-border glass-card rounded-xl shadow-2xl" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(d) => {
                                    field.onChange(d);
                                    onAfterSelect();
                                }}
                                disabled={(d) =>
                                    !validTimesInTimezone.some((time) => isSameDay(d, time))
                                }
                                initialFocus
                            />
                        </PopoverContent>
                        <FormMessage />
                    </FormItem>
                </Popover>
            )}
        />
    );
}
