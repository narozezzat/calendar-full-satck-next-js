import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { formatEventDescription } from "@/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { ArrowRight, CalendarRange, Clock, Sparkles } from "lucide-react";
import * as React from "react";

export default async function BookingPage({ params: {
    clerkUserId
} }: { params: { clerkUserId: string } }): Promise<React.JSX.Element> {

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
            and(eq(userIdCol, clerkUserId), eq(isActive, true)),
        orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
    })

    if (events.length === 0) return notFound()

    const [{ fullName, imageUrl }, t, tc, locale] = await Promise.all([
        clerkClient().users.getUser(clerkUserId),
        getTranslations("booking"),
        getTranslations("common"),
        getLocale()
    ])

    const initials = (fullName ?? "?")
        .split(" ")
        .map(s => s[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase()

    return (
        <div className="max-w-6xl mx-auto w-full py-6">
            {/* Header — avatar + name + welcome */}
            <div className="flex flex-col items-center text-center gap-5 mb-12">
                <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-indigo-500 opacity-30 blur-md" />
                    <div className="relative size-20 rounded-full overflow-hidden border-2 border-primary/30 bg-secondary/30 flex items-center justify-center">
                        {imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imageUrl} alt={fullName ?? ""} className="size-full object-cover" />
                        ) : (
                            <span className="text-xl font-bold text-primary">{initials}</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.6875rem] font-semibold bg-primary/10 border border-primary/20 text-primary">
                        <Sparkles aria-hidden="true" className="size-3" />
                        <span>{tc("bookAnEvent")}</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                        {fullName}
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
                        {t("welcomeMessage")}
                    </p>
                </div>
            </div>

            {/* Event grid */}
            <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {events.map(event => (
                    <BookableEventCard
                        key={event.id}
                        id={event.id}
                        name={event.name}
                        description={event.description}
                        clerkUserId={clerkUserId}
                        durationInMinutes={event.durationInMinutes}
                        selectLabel={tc("select")}
                        locale={locale}
                    />
                ))}
            </div>
        </div>
    )
}

type BookableEventCardProps = {
    id: string
    name: string
    clerkUserId: string
    description: string | null
    durationInMinutes: number
    selectLabel: string
    locale: string
}

function BookableEventCard({
    id,
    name,
    description,
    clerkUserId,
    durationInMinutes,
    selectLabel,
    locale,
}: BookableEventCardProps): React.JSX.Element {
    return (
        <Card className="flex flex-col glass-card hover-card-glow relative group overflow-hidden">
            {/* decorative gradient corner */}
            <div className="pointer-events-none absolute -top-12 -end-12 size-32 rounded-full bg-primary/10 blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {name}
                </CardTitle>
                <CardDescription>
                    <span className="inline-flex items-center gap-1.5 mt-2 w-fit bg-primary/10 border border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                        <Clock aria-hidden="true" className="size-3.5" />
                        <span>{formatEventDescription(durationInMinutes, locale)}</span>
                    </span>
                </CardDescription>
            </CardHeader>

            {description != null && description.length > 0 ? (
                <CardContent className="text-sm text-muted-foreground flex-1 line-clamp-4 leading-relaxed">
                    {description}
                </CardContent>
            ) : (
                <CardContent className="flex-1" />
            )}

            <CardFooter className="pt-4 mt-auto border-t border-border/40 bg-secondary/10">
                <Button
                    asChild
                    className="w-full h-10 text-xs font-semibold shadow-md shadow-primary/20 group/btn"
                >
                    <Link
                        href={`/book/${clerkUserId}/${id}`}
                        className="flex items-center justify-center gap-1.5"
                    >
                        <CalendarRange aria-hidden="true" className="size-4" />
                        <span>{selectLabel}</span>
                        <ArrowRight
                            aria-hidden="true"
                            className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 rtl:rotate-180 rtl:group-hover/btn:-translate-x-0.5"
                        />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
