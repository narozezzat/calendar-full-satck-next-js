import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CalendarPlus, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import EventCard from "@/components/cards/EventCard";

export const revalidate = 0;

export default async function EventsPage() {
    const { userId, redirectToSignIn } = auth();

    if (userId == null) return redirectToSignIn();

    const events = await db.query.EventTable.findMany({
        where: ({ clerkUserId }, { eq }) => eq(clerkUserId, userId),
        orderBy: ({ createdAt }, { desc }) => desc(createdAt),
    });

    return (
        <>
            <div className="flex justify-between items-baseline">
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">Events</h1>
                <Button asChild>
                    <Link href="/events/new">
                        <CalendarPlus className="mr-4 size-6" /> New Events
                    </Link>
                </Button>
            </div>
            {events.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map(event => (
                        <EventCard key={event.id} {...event} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <CalendarRange className="size-16 mx-auto" />
                    You do not have any events yet. Create your first event to get started!
                    <Button size="lg" className="text-lg" asChild>
                        <Link href="/events/new">
                            <CalendarPlus className="mr-4 size-6" /> New Events
                        </Link>
                    </Button>
                </div>
            )}
        </>
    );
}