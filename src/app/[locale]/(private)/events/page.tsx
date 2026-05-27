import { auth } from "@clerk/nextjs/server";
import { CalendarPlus, CalendarRange, Plus, SearchX } from "lucide-react";
import { and, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import EventsList from "@/components/EventsList";
import EventsSearch from "@/components/EventsSearch";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import * as React from "react";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

/** Number of event cards shown per page. */
const PAGE_SIZE = 6;

interface EventsPageProps {
    searchParams: { page?: string; q?: string };
}

export default async function EventsPage({
    searchParams,
}: EventsPageProps): Promise<React.JSX.Element> {
    const { userId, redirectToSignIn } = auth();
    const t = await getTranslations("events");

    if (userId == null) return redirectToSignIn();

    const query = (searchParams?.q ?? "").trim();

    // Whether the account holds any events at all, independent of the search —
    // this decides between the "create your first event" and "no matches" states.
    const hasAnyEvents =
        (await db.$count(EventTable, eq(EventTable.clerkUserId, userId))) > 0;

    // Restrict to the user's own events, optionally matching the search query
    // against the event name or description (case-insensitive).
    const searchFilter: SQL | undefined = query
        ? or(
              ilike(EventTable.name, `%${query}%`),
              ilike(EventTable.description, `%${query}%`)
          )
        : undefined;
    const whereClause = and(eq(EventTable.clerkUserId, userId), searchFilter);

    const totalCount = await db.$count(EventTable, whereClause);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

    const requestedPage = Number(searchParams?.page);
    const currentPage = Math.min(
        Number.isFinite(requestedPage) && requestedPage > 0 ? Math.floor(requestedPage) : 1,
        totalPages
    );

    const events = await db.query.EventTable.findMany({
        where: whereClause,
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
        limit: PAGE_SIZE,
        offset: (currentPage - 1) * PAGE_SIZE,
    });

    return (
        <div className="space-y-8">
            <PageHeader
                icon={CalendarRange}
                title={t("title")}
                description={t("description")}
                action={{ href: "/events/new", label: t("newEvent"), icon: CalendarPlus }}
            />

            {hasAnyEvents ? (
                <div className="space-y-6">
                    {totalCount > 0 ? (
                        <EventsList
                            events={events}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalCount={totalCount}
                            searchComponent={<EventsSearch initialQuery={query} />}
                        />
                    ) : (
                        /* Search ran but matched nothing */
                        <div className="space-y-6">
                            <EventsSearch initialQuery={query} className="max-w-md" />
                            <EmptyState
                                icon={SearchX}
                                tone="muted"
                                title={t("search.noResults.title")}
                                description={t("search.noResults.description", { query })}
                                action={{
                                    href: "/events",
                                    label: t("search.noResults.cta"),
                                    variant: "outline",
                                }}
                            />
                        </div>
                    )}
                </div>
            ) : (
                /* The account has no events yet */
                <EmptyState
                    icon={CalendarRange}
                    badgeIcon={Plus}
                    title={t("empty.title")}
                    description={t("empty.description")}
                    action={{ href: "/events/new", label: t("empty.cta"), icon: CalendarPlus }}
                />
            )}
        </div>
    );
}