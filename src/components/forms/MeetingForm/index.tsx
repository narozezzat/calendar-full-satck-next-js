"use client"

import * as React from "react"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { isSameDay } from "date-fns"
import { toZonedTime } from "date-fns-tz"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import { Form } from "../../ui/form"
import { Button } from "../../ui/button"
import { Link } from "@/i18n/routing"
import { createMeeting } from "@/server/actions/meetings"
import { meetingFormSchema } from "@/schema/meetings"
import { FormRootError } from "../fields/FormRootError"
import { TimezoneSelectField } from "../fields/TimezoneSelectField"
import { MeetingDateField } from "./MeetingDateField"
import { MeetingTimeSlotField } from "./MeetingTimeSlotField"
import { GuestInfoFields } from "./GuestInfoFields"

export function MeetingForm({
    validTimes,
    eventId,
    clerkUserId,
}: {
    validTimes: Date[]
    eventId: string
    clerkUserId: string
}): React.JSX.Element {
    const t = useTranslations("meetingForm")
    const form = useForm<z.infer<typeof meetingFormSchema>>({
        resolver: zodResolver(meetingFormSchema),
        defaultValues: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    })

    const timezone = form.watch("timezone")
    const date = form.watch("date")

    const validTimesInTimezone = useMemo(() => {
        return validTimes.map((d) => toZonedTime(d, timezone))
    }, [validTimes, timezone])

    const availableSlotsForDay = useMemo(() => {
        if (!date) return []
        return validTimesInTimezone.filter((time) => isSameDay(time, date))
    }, [validTimesInTimezone, date])

    async function onSubmit(values: z.infer<typeof meetingFormSchema>) {
        const data = await createMeeting({ ...values, eventId, clerkUserId })

        if (data?.error) {
            toast.error(t("errorMessage"))
            form.setError("root", { message: t("errorMessage") })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormRootError message={form.formState.errors.root?.message} />

                <TimezoneSelectField control={form.control} label={t("timezoneLabel")} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t border-border/40">
                    <MeetingDateField
                        control={form.control}
                        validTimesInTimezone={validTimesInTimezone}
                        onAfterSelect={() => form.resetField("startTime")}
                    />
                    <MeetingTimeSlotField
                        control={form.control}
                        date={date}
                        availableSlotsForDay={availableSlotsForDay}
                    />
                </div>

                <GuestInfoFields control={form.control} />

                <div className="flex gap-2.5 justify-end pt-4 border-t border-border/40">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="button"
                        asChild
                        variant="outline"
                        className="h-10 text-xs font-semibold"
                    >
                        <Link href={`/book/${clerkUserId}`}>{t("cancelButton")}</Link>
                    </Button>
                    <Button
                        disabled={form.formState.isSubmitting || !form.watch("startTime")}
                        type="submit"
                        className="h-10 text-xs font-semibold shadow-lg shadow-primary/20 gap-1.5"
                    >
                        <CheckCircle2 aria-hidden="true" className="size-4" />
                        <span>{form.formState.isSubmitting ? t("submitting") : t("submitButton")}</span>
                    </Button>
                </div>
            </form>
        </Form>
    )
}
