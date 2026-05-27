import * as React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";
import { Globe } from "lucide-react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";
import { formatTimezoneOffset } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface TimezoneSelectFieldProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    /** Field path. Defaults to `"timezone"`. */
    name?: Path<TFieldValues>;
    /** Localized label rendered next to the globe icon. */
    label: string;
    /** Extra classes for the dropdown content (e.g. to tune max height). */
    contentClassName?: string;
}

/**
 * Timezone picker bound to a react-hook-form field. Lists every IANA timezone
 * supported by the runtime, each annotated with its current UTC offset.
 * Shared by the meeting and schedule forms.
 */
export function TimezoneSelectField<TFieldValues extends FieldValues>({
    control,
    name = "timezone" as Path<TFieldValues>,
    label,
    contentClassName,
}: TimezoneSelectFieldProps<TFieldValues>): React.JSX.Element {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-1.5">
                    <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                        <Globe aria-hidden="true" className="size-4 text-muted-foreground" />
                        <span>{label}</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus:ring-primary/30">
                                <SelectValue />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className={cn("max-h-[15.625rem] glass-card", contentClassName)}>
                            {Intl.supportedValuesOf("timeZone").map((tz) => (
                                <SelectItem key={tz} value={tz} className="text-sm">
                                    {tz}
                                    {` (${formatTimezoneOffset(tz)})`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
