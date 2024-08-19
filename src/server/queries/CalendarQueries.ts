"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import { CreateCalendarEventDTO } from "~/server/db/dtoTypes";
import { CalendarDBType, calendarEvents } from "~/server/db/schema";
import { union } from "drizzle-orm/pg-core";
import { ServerErrorType, Visibility } from "~/lib/types";
import { hasAdminRights } from "~/lib/serverUtils";

export async function getCalendarEvent(calendarEventId: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const calendarEvent = await db.query.calendarEvents.findFirst({
    where: (model, { eq }) => eq(model.id, calendarEventId),
  });

  console.log(calendarEvent?.date);
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
  const error: ServerErrorType = { message: null };

  const user = auth();
  if (!user.userId) error.message = "Unauthorized, not logged in";

  if (!calendarEvent.title) error.message = "Title field cannot be empty";
  // if (!calendarEvent.date) throw new Error("Date field cannot be empty");
  if (!calendarEvent.category) error.message = "Category field cannot be empty";
  if (!calendarEvent.visibility)
    error.message = "Visibility field cannot be empty";

  if (error.message) return error;

  try {
    await db.insert(calendarEvents).values({
      ...calendarEvent,
      userId: user.userId!,
    });
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}

export async function updateCalendarEvent(calendarEvent: CalendarDBType) {
  const error: ServerErrorType = { message: null };

  const user = auth();
  const isAdmin = await hasAdminRights();

  if (!user.userId) error.message = "Unauthorized, not logged in";

  // must be the owner or admin to edit
  if (user.userId !== calendarEvent.userId && !isAdmin)
    error.message = "Unauthorized, not the user that created the quote";

  if (!calendarEvent.title) error.message = "Title field cannot be empty";
  if (!calendarEvent.date) error.message = "Date field cannot be empty";
  if (!calendarEvent.category) error.message = "Category field cannot be empty";
  if (!calendarEvent.visibility)
    error.message = "Visibility field cannot be empty";

  if (error.message) return error;

  try {
    await db
      .update(calendarEvents)
      .set({ ...calendarEvent })
      .where(eq(calendarEvents.id, calendarEvent.id));
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}

export async function deleteCalendarEvent(calendarEvent: CalendarDBType) {
  const error: ServerErrorType = { message: null };

  const user = auth();
  const isAdmin = await hasAdminRights();

  if (!user.userId) error.message = "Unauthorized, not logged in";

  // must be the owner or admin to delete
  if (user.userId !== calendarEvent.userId && !isAdmin)
    error.message = "Unauthorized, not the user that created the quote";

  if (error.message) return error;

  try {
    await db
      .delete(calendarEvents)
      .where(
        and(
          eq(calendarEvents.id, calendarEvent.id),
          eq(calendarEvents.userId, calendarEvent.userId),
        ),
      );
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}
