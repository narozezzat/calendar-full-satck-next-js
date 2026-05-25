import { auth } from "@clerk/nextjs/server";
import { Link } from "@/i18n/routing";
import { CalendarPlus, CalendarRange, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import EventCard from "@/components/cards/EventCard";
import * as React from "react";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export default async function EventsPage(): Promise<React.JSX.Element> {
    const { userId, redirectToSignIn } = auth();
    const t = await getTranslations("events");

    if (userId == null) return redirectToSignIn();

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    });

    return (
        <div className="space-y-8">

            {/* Header Area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-muted-foreground">
                        {t("title")}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1.5">
                        {t("description")}
                    </p>
                </div>
                <Button asChild className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold shrink-0 group">
                    <Link href="/events/new" className="flex items-center gap-2">
                        <CalendarPlus aria-hidden="true" className="size-4.5 transition-transform group-hover:scale-110" />
                        <span>{t("newEvent")}</span>
                    </Link>
                </Button>
            </div>

            {/* Events Grid / Empty State */}
            {events.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map(event => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="py-12 flex justify-center">
                    <div className="w-full max-w-lg glass-card border-dashed border-2 border-border/60 rounded-2xl p-10 text-center flex flex-col items-center gap-6 relative overflow-hidden">

                        {/* Glowing backdrop decorator */}
                        <div className="absolute -top-12 -start-12 w-28 h-28 bg-primary/10 rounded-full blur-xl" />
                        <div className="absolute -bottom-12 -end-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl" />

                        {/* Calendar Icon Badge */}
                        <div className="bg-primary/10 p-4.5 rounded-full border border-primary/25 text-primary shadow-sm shadow-primary/10 relative">
                            <CalendarRange aria-hidden="true" className="size-10" />
                            <div className="absolute -top-1 -end-1 bg-primary text-primary-foreground p-1 rounded-full border-2 border-background">
                                <Plus aria-hidden="true" className="size-3" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-foreground">{t("empty.title")}</h3>
                            <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                                {t("empty.description")}
                            </p>
                        </div>

                        <Button size="lg" className="shadow-lg shadow-primary/20 font-semibold mt-2" asChild>
                            <Link href="/events/new" className="flex items-center gap-2">
                                <CalendarPlus aria-hidden="true" className="size-5" />
                                <span>{t("empty.cta")}</span>
                            </Link>
                        </Button>

                    </div>
                </div>
            )}
        </div>
    );
}