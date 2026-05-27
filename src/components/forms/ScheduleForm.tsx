"use client"

import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form"
import { Button } from "../ui/button"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { groupBy, timeToInt } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select"
import { formatTimezoneOffset } from "@/lib/formatters"
import * as React from "react"
import { Plus, X, Globe, Save } from "lucide-react"
import { Input } from "../ui/input"
import { saveSchedule } from "@/server/actions/schedule"
import { scheduleFormSchema } from "@/schema/schedule"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

type Availability = {
    startTime: string
    endTime: string
    dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number]
}

export function ScheduleForm({
    schedule,
}: {
    schedule?: {
        timezone: string
        availabilities: Availability[]
    }
}): React.JSX.Element {
    const t = useTranslations("schedule")
    const tDays = useTranslations("days")
    const tCommon = useTranslations("common")
    const form = useForm<z.infer<typeof scheduleFormSchema>>({
        resolver: zodResolver(scheduleFormSchema),
        defaultValues: {
            timezone:
                schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
            availabilities: schedule?.availabilities.toSorted((a, b) => {
                return timeToInt(a.startTime) - timeToInt(b.startTime)
            }),
        },
    })

    const {
        append: addAvailability,
        remove: removeAvailability,
        fields: availabilityFields,
    } = useFieldArray({ name: "availabilities", control: form.control })

    const groupedAvailabilityFields = groupBy(
        availabilityFields.map((field, index) => ({ ...field, index })),
        availability => availability.dayOfWeek
    )

    async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
        const data = await saveSchedule(values)

        if (data?.error) {
            toast.error(t("errorMessage"))
            form.setError("root", {
                message: t("errorMessage"),
            })
        } else {
            toast.success(t("successMessage"))
            form.reset(values)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {form.formState.errors.root ? (
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg p-3.5 font-medium">
                        {form.formState.errors.root.message}
                    </div>
                ) : null}

                <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                        <FormItem className="space-y-1.5">
                            <FormLabel className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                <Globe aria-hidden="true" className="size-4 text-muted-foreground" />
                                <span>{t("timezoneLabel")}</span>
                            </FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-10 bg-background/50 border-input hover:border-muted-foreground/40 focus:ring-primary/30">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-[18.75rem] glass-card">
                                    {Intl.supportedValuesOf("timeZone").map(timezone => (
                                        <SelectItem key={timezone} value={timezone} className="text-sm">
                                            {timezone}
                                            {` (${formatTimezoneOffset(timezone)})`}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4 pt-4 border-t border-border/40">
                    <FormLabel className="text-sm font-bold text-foreground">{t("weeklyLabel")}</FormLabel>

                    <div className="space-y-3.5">
                        {DAYS_OF_WEEK_IN_ORDER.map(dayOfWeek => {
                            const daySlots = groupedAvailabilityFields[dayOfWeek] || [];
                            return (
                                <div key={dayOfWeek} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-xl border border-border bg-card/45 hover:bg-card/75 transition-all shadow-sm">

                                    {/* Weekday badge block */}
                                    <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-28 shrink-0 pt-1">
                                        <span className="uppercase text-xs font-extrabold tracking-wider text-foreground bg-primary/10 border border-primary/20 rounded px-2.5 py-1 text-center w-16 select-none shadow-sm">
                                            {tDays(dayOfWeek)}
                                        </span>
                                        <Button
                                            type="button"
                                            size="icon"
                                            className="size-7 rounded-lg bg-secondary border border-border/60 hover:bg-primary hover:border-primary text-secondary-foreground hover:text-primary-foreground transition-all flex items-center justify-center shadow-sm"
                                            onClick={() => {
                                                addAvailability({
                                                    dayOfWeek,
                                                    startTime: "09:00",
                                                    endTime: "17:00",
                                                })
                                            }}
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
                                                            control={form.control}
                                                            name={`availabilities.${field.index}.startTime`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="w-24 h-9 text-center bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 text-sm font-medium"
                                                                            placeholder="09:00"
                                                                            aria-label={t("startTimeAria", { day: tDays(dayOfWeek), index: labelIndex + 1 })}
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <span className="text-muted-foreground font-semibold">-</span>
                                                        <FormField
                                                            control={form.control}
                                                            name={`availabilities.${field.index}.endTime`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormControl>
                                                                        <Input
                                                                            className="w-24 h-9 text-center bg-background/50 border-input hover:border-muted-foreground/40 focus-visible:ring-primary/20 text-sm font-medium"
                                                                            placeholder="17:00"
                                                                            aria-label={t("endTimeAria", { day: tDays(dayOfWeek), index: labelIndex + 1 })}
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
                                                            onClick={() => removeAvailability(field.index)}
                                                            aria-label={t("removeSlotAria", { index: labelIndex + 1, day: tDays(dayOfWeek) })}
                                                        >
                                                            <X aria-hidden="true" className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                    <FormMessage>
                                                        {form.formState.errors.availabilities?.at?.(field.index)?.root?.message}
                                                    </FormMessage>
                                                    <FormMessage>
                                                        {form.formState.errors.availabilities?.at?.(field.index)?.startTime?.message}
                                                    </FormMessage>
                                                    <FormMessage>
                                                        {form.formState.errors.availabilities?.at?.(field.index)?.endTime?.message}
                                                    </FormMessage>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-border/40">
                    <Button
                        disabled={form.formState.isSubmitting || !form.formState.isDirty}
                        type="submit"
                        className="shadow-lg shadow-primary/20 font-semibold gap-1.5 h-10 px-5"
                    >
                        <Save aria-hidden="true" className="size-4" />
                        <span>{form.formState.isSubmitting ? t("saving") : t("saveButton")}</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}