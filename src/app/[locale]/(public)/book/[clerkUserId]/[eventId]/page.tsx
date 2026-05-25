import { MeetingForm } from "@/components/forms/MeetingForm"
import { Button } from "@/components/ui/button"
import * as React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { getValidTimesFromSchedule } from "@/lib/getValidTimesFromSchedule"
import { clerkClient } from "@clerk/nextjs/server"
import {
    addMonths,
    eachMinuteOfInterval,
    endOfDay,
    roundToNearestMinutes,
} from "date-fns"
import { Link } from "@/i18n/routing"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

export const revalidate = 0

export default async function BookEventPage({
    params: { clerkUserId, eventId },
}: {
    params: { clerkUserId: string; eventId: string }
}): Promise<React.JSX.Element> {
    const event = await db.query.EventTable.findFirst({
        where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
            and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
    })

    if (event == null) return notFound()

    const calendarUser = await clerkClient().users.getUser(clerkUserId)
    const startDate = roundToNearestMinutes(new Date(), {
        nearestTo: 15,
        roundingMethod: "ceil",
    })
    const endDate = endOfDay(addMonths(startDate, 2))

    const validTimes = await getValidTimesFromSchedule(
        eachMinuteOfInterval({ start: startDate, end: endDate }, { step: 15 }),
        event
    )

    const t = await getTranslations("booking")

    if (validTimes.length === 0) {
        return <NoTimeSlots event={event} calendarUser={calendarUser} t={t} />
    }

    return (
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <Card className="max-w-4xl w-full glass-card">
                <CardHeader>
                    <CardTitle>
                        {t("bookWith", { eventName: event.name, userName: calendarUser.fullName ?? "" })}
                    </CardTitle>
                    {event.description && (
                        <CardDescription>{event.description}</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    <MeetingForm
                        validTimes={validTimes}
                        eventId={event.id}
                        clerkUserId={clerkUserId}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

function NoTimeSlots({
    event,
    calendarUser,
    t,
}: {
    event: { name: string; description: string | null }
    calendarUser: { id: string; fullName: string | null }
    t: Awaited<ReturnType<typeof getTranslations<"booking">>>
}): React.JSX.Element {
    return (
        <div className="flex-grow flex flex-col justify-center items-center w-full">
            <Card className="max-w-md w-full glass-card">
                <CardHeader>
                    <CardTitle>
                        {t("bookWith", { eventName: event.name, userName: calendarUser.fullName ?? "" })}
                    </CardTitle>
                    {event.description && (
                        <CardDescription>{event.description}</CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {t("noTimeSlots", { userName: calendarUser.fullName ?? "" })}
                </CardContent>
                <CardFooter>
                    <Button className="w-full" asChild>
                        <Link href={`/book/${calendarUser.id}`}>{t("chooseAnother")}</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}