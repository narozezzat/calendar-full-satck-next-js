import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";
import { db } from "@/drizzle/db";
import { formatDateTime } from "@/lib/formatters";
import { clerkClient } from "@clerk/nextjs/server";
import { CircleCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export default async function SuccessPage({
  params: { clerkUserId, eventId },
  searchParams: { startTime },
}: {
  params: { clerkUserId: string; eventId: string };
  searchParams: { startTime: string };
}): Promise<React.JSX.Element> {
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  });

  if (event == null) notFound();

  const calendarUser = await clerkClient().users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);
  const t = await getTranslations("booking");

  return (
    <div className="flex-grow flex flex-col justify-center items-center w-full">
      <Card className="max-w-xl w-full text-center glass-card">
        <CardHeader>
          <div className="flex justify-center mb-2">
            <CardTitle>
              <CircleCheck color="#009A51" size={52} />
            </CardTitle>
          </div>
          <CardTitle>
            {t("successTitle", {
              eventName: event.name,
              userName: calendarUser.fullName ?? "",
            })}
          </CardTitle>
          <CardDescription>{formatDateTime(startTimeDate)}</CardDescription>
        </CardHeader>
        <CardContent>{t("successMessage")}</CardContent>
      </Card>
    </div>
  );
}
