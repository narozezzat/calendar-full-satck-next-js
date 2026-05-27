"use client"

import * as React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Form, FormLabel } from "../../ui/form"
import { Button } from "../../ui/button"
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants"
import { groupBy, timeToInt } from "@/lib/utils"
import { saveSchedule } from "@/server/actions/schedule"
import { scheduleFormSchema } from "@/schema/schedule"
import { FormRootError } from "../fields/FormRootError"
import { TimezoneSelectField } from "../fields/TimezoneSelectField"
import { DayAvailabilityRow } from "./DayAvailabilityRow"

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
        (availability) => availability.dayOfWeek
    )

    async function onSubmit(values: z.infer<typeof scheduleFormSchema>) {
        const data = await saveSchedule(values)

        if (data?.error) {
            toast.error(t("errorMessage"))
            form.setError("root", { message: t("errorMessage") })
        } else {
            toast.success(t("successMessage"))
            form.reset(values)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormRootError message={form.formState.errors.root?.message} />

                <TimezoneSelectField
                    control={form.control}
                    label={t("timezoneLabel")}
                    contentClassName="max-h-[18.75rem]"
                />

                <div className="space-y-4 pt-4 border-t border-border/40">
                    <FormLabel className="text-sm font-bold text-foreground">{t("weeklyLabel")}</FormLabel>

                    <div className="space-y-3.5">
                        {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
                            <DayAvailabilityRow
                                key={dayOfWeek}
                                dayOfWeek={dayOfWeek}
                                daySlots={groupedAvailabilityFields[dayOfWeek] || []}
                                control={form.control}
                                errors={form.formState.errors}
                                onAdd={(day) =>
                                    addAvailability({
                                        dayOfWeek: day,
                                        startTime: "09:00",
                                        endTime: "17:00",
                                    })
                                }
                                onRemove={removeAvailability}
                            />
                        ))}
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
