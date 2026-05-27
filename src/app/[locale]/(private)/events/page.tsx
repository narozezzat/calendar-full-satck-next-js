import { auth } from "@clerk/nextjs/server";
import { Link } from "@/i18n/routing";
import { CalendarPlus, CalendarRange, Plus } from "lucide-react";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import EventsList from "@/components/EventsList";
import * as React from "react";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

/** Number of event cards shown per page. */
const PAGE_SIZE = 6;

interface EventsPageProps {
    searchParams: { page?: string };
}

export default async function EventsPage({
    searchParams,
}: EventsPageProps): Promise<React.JSX.Element> {
    const { userId, redirectToSignIn } = auth();
    const t = await getTranslations("events");

    if (userId == null) return redirectToSignIn();

    const totalCount = await db.$count(EventTable, eq(EventTable.clerkUserId, userId));
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const requestedPage = Number(searchParams?.page);
    const currentPage = Math.min(
        Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1,
        totalPages
    );

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
    });

    return (
        <div className="space-y-8">

            {/* Ultra Premium Dashboard Header */}
            <div className="relative mb-10">
                {/* Subtle glowing ambient background */}
                <div className="absolute -top-10 -start-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 opacity-70 dark:opacity-40 pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-background/60 dark:bg-card/40 border border-border/50 p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-xl relative overflow-hidden">

                    {/* Decorative glass reflection */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="space-y-2 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20 shadow-inner">
                                <CalendarRange aria-hidden="true" className="size-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                {t("title")}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-lg leading-relaxed ms-1 sm:ms-14">
                            {t("description")}
                        </p>
                    </div>

                    <Button
                        asChild
                        className="w-full sm:w-auto shadow-xl shadow-primary/25 bg-gradient-to-br from-primary to-indigo-600 hover:from-primary/95 hover:to-indigo-500 text-white font-semibold h-12 px-6 rounded-xl transition-all hover:-translate-y-0.5 active:scale-95 group relative overflow-hidden z-10 border border-primary/20"
                    >
                        <Link href="/events/new" className="flex items-center justify-center gap-2">
                            {/* Shimmer reflection */}
                            <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                            <CalendarPlus aria-hidden="true" className="size-5 transition-transform group-hover:rotate-12" />
                            <span className="text-base sm:text-sm">{t("newEvent")}</span>
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Events Grid / Empty State */}
            {totalCount > 0 ? (
                <EventsList
                    events={events}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                />
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