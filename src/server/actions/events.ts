"use server";

import { db } from "@/drizzle/db";
import { EventTable } from "@/drizzle/schema";
import { eventFormSchema } from "@/schema/events";
import { auth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import "use-server";
import { z } from "zod";

export async function createEvent(
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean }> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  await db.insert(EventTable).values({ ...data, clerkUserId: userId });

  revalidatePath("/events");
  return { error: false };
}

export async function updateEvent(
  id: string,
  unsafeData: z.infer<typeof eventFormSchema>
): Promise<{ error: boolean }> {
  const { userId } = auth();
  const { success, data } = eventFormSchema.safeParse(unsafeData);

  if (!success || userId == null) {
    return { error: true };
  }

  const { rowCount } = await db
    .update(EventTable)
    .set({ ...data })
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  revalidatePath("/events");
  return { error: false };
}

export async function deleteEvent(
  id: string
): Promise<{ error: boolean }> {
  const { userId } = auth();

  if (userId == null) {
    return { error: true };
  }

  const { rowCount } = await db
    .delete(EventTable)
    .where(and(eq(EventTable.id, id), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true };
  }

  revalidatePath("/events");
  return { error: false };
}

export async function deleteManyEvents(
  ids: string[]
): Promise<{ error: boolean; deletedCount: number }> {
  const { userId } = auth();

  if (userId == null || ids.length === 0) {
    return { error: true, deletedCount: 0 };
  }

  const { rowCount } = await db
    .delete(EventTable)
    .where(and(inArray(EventTable.id, ids), eq(EventTable.clerkUserId, userId)));

  if (rowCount === 0) {
    return { error: true, deletedCount: 0 };
  }

  revalidatePath("/events");
  return { error: false, deletedCount: rowCount ?? 0 };
}
