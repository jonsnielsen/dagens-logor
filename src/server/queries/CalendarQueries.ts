"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { CreateCalendarEventDTO } from "~/server/db/dtoTypes";
import { calendarEvents } from "~/server/db/schema";
import { union } from "drizzle-orm/pg-core";
import { Visibility } from "~/lib/types";

export async function getCalendarEvent(calendarEventId: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const calendarEvent = await db.query.calendarEvents.findFirst({
    where: (model, { eq }) => eq(model.id, calendarEventId),
  });

  if (
    calendarEvent?.visibility === Visibility.PRIVATE &&
    calendarEvent.userId !== user.userId
  )
    throw new Error("User is not authorized to see the calendar event");

  if (!calendarEvent) throw new Error("calendarEvent not found");

  return calendarEvent;
}

export async function getCalendarEvents() {
  // get all public events.
  // get all private events for that user. make index for the user so this doesn't have to go through every data entry?

  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const foundCalendarEvents = await union(
    db
      .select({
        id: calendarEvents.id,
        title: calendarEvents.title,
        description: calendarEvents.description,
        date: calendarEvents.date,
        category: calendarEvents.category,
        visibility: calendarEvents.visibility,
      })
      .from(calendarEvents)
      .where(eq(calendarEvents.visibility, Visibility.PUBLIC)),
    db
      .select({
        id: calendarEvents.id,
        title: calendarEvents.title,
        description: calendarEvents.description,
        date: calendarEvents.date,
        category: calendarEvents.category,
        visibility: calendarEvents.visibility,
      })
      .from(calendarEvents)
      .where(
        and(
          eq(calendarEvents.userId, user.userId),
          eq(calendarEvents.visibility, Visibility.PRIVATE),
        ),
      ),
  ).orderBy(calendarEvents.date);

  return foundCalendarEvents;
}

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
// The type of the object returned. Not the array
export type GetCalendarEventsReturnType = ArrayElement<
  Awaited<ReturnType<typeof getCalendarEvents>>
>;

export async function createCalendarEvent(
  calendarEvent: CreateCalendarEventDTO,
) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  if (!calendarEvent.title) throw new Error("Title field cannot be empty");
  // if (!calendarEvent.date) throw new Error("Date field cannot be empty");
  if (!calendarEvent.category)
    throw new Error("Category field cannot be empty");
  if (!calendarEvent.visibility)
    throw new Error("Visibility field cannot be empty");

  try {
    await db.insert(calendarEvents).values({
      ...calendarEvent,
      userId: user.userId,
    });
  } catch (error) {
    const message = `Couldn't create CalendarEvent`;
    console.log(error);
    console.log(message);
    return {
      message,
    };
  }
}

export async function updateCalendarEvent(
  calendarEvent: CreateCalendarEventDTO,
  calendarEventId: number,
) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  if (!user.userId) throw new Error("Unauthorized, not logged in");

  if (!calendarEvent.title) throw new Error("Title field cannot be empty");
  if (!calendarEvent.date) throw new Error("Date field cannot be empty");
  if (!calendarEvent.category)
    throw new Error("Category field cannot be empty");
  if (!calendarEvent.visibility)
    throw new Error("Visibility field cannot be empty");

  try {
    await db
      .update(calendarEvents)
      .set({ ...calendarEvent })
      .where(eq(calendarEvents.id, calendarEventId));
  } catch (error) {
    const message = `Couldn't update Event. ${String(error)}`;
    console.log(message);
    return {
      message,
    };
  }
}

export async function deleteCalendarEvent(calendarEventId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) throw new Error("Unauthorized, not logged in");

  // Must be the owner of the quote to delete
  try {
    await db
      .delete(calendarEvents)
      .where(
        and(
          eq(calendarEvents.id, calendarEventId),
          eq(calendarEvents.userId, userId),
        ),
      );
  } catch (error) {
    const message = `Couldn't delete Event. User who tried to delete ${userId}. ${String(error)}`;
    console.log(message);
    return {
      message,
    };
  }
}
