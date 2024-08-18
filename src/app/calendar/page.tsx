import { CalendarIcon } from "@radix-ui/react-icons";
import { format, getISOWeek } from "date-fns";
import Link from "next/link";
import { CreateCalendarEventOverlay } from "~/app/calendar/_components/CreateCalendarEventOverlay";
import { Card, CardContent } from "~/components/ui/card";
import { isLoggedIn } from "~/lib/serverUtils";
import { Category } from "~/lib/types";
import { getTimeFromDate } from "~/lib/utils";
import {
  GetCalendarEventsReturnType,
  getCalendarEvents,
} from "~/server/queries/CalendarQueries";

function CalendarEvent({
  category,
  date,
  title,
  visibility,
  description,
}: GetCalendarEventsReturnType) {
  const time = getTimeFromDate(new Date(date));
  const formattedDate = format(date, "E MMM d");

  return (
    <Card
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      className={`hover:bg-gray-50 ${category === Category.OTHER ? "bg-yellow-100 hover:bg-yellow-200" : ""}`}
    >
      <CardContent>
        <div className="">
          {/* <p>{formattedDate}</p> */}
          <div className="grid grid-cols-[1fr_88px] grid-rows-[auto_auto] gap-3 align-top">
            <p className="line-clamp-2 text-lg font-semibold">{title}</p>
            <p className="justify-self-end">{formattedDate}</p>
            <p className="line-clamp-2">{description}</p>
            <p className="justify-self-end">{time}</p>
          </div>
          {/* <p className="ml-2 mt-2 text-sm"> - {personQuoted}</p> */}
        </div>
      </CardContent>
    </Card>
  );
}
function initialiseWeekGroup(firstWeekNumber: number, lastWeekNumber: number) {
  const groupedByWeek = new Map<number, GetCalendarEventsReturnType[]>();
  let week = firstWeekNumber;
  while (week <= lastWeekNumber) {
    groupedByWeek.set(week, []);
    week++;
  }
  return groupedByWeek;
}

function groupCalendarEventsByWeek(
  calendarEvents: GetCalendarEventsReturnType[],
) {
  if (!calendarEvents.length) return [];

  const firstEventWeekNumber = getISOWeek(new Date(calendarEvents[0]!.date));
  const lastEventWeekNumber = getISOWeek(
    new Date(calendarEvents[calendarEvents.length - 1]!.date),
  );

  const groupedByWeek = initialiseWeekGroup(
    firstEventWeekNumber,
    lastEventWeekNumber,
  );

  calendarEvents.forEach((calendarEvent) => {
    const weekNumber = getISOWeek(new Date(calendarEvent.date));
    groupedByWeek.get(weekNumber)?.push(calendarEvent);
  });
  return groupedByWeek;
}

export default async function CalendarPage() {
  if (!isLoggedIn()) return null;
  const calendarEvents = await getCalendarEvents();
  const groupedCalendarEvents = groupCalendarEventsByWeek(calendarEvents);

  // sort calendar events into weeks
  // Take first event, and last event. Calculate the weekend numbers til og med, and all the weeks in between.

  return (
    <main className="page-side-margin-1 page-bottom-nav-offset">
      {Array.from(groupedCalendarEvents.entries()).map(
        ([weekNumber, events]) => {
          return (
            <div key={weekNumber} className={`${events.length ? "mb-10" : ""}`}>
              <div className="mb-4 flex items-center gap-2 font-medium text-muted-foreground">
                <CalendarIcon className="h-5 w-5" />
                Week {weekNumber}
              </div>
              <div className="flex flex-col gap-4">
                {events.map((calendarEvent) => {
                  return (
                    <Link
                      href={`/calendar/${calendarEvent.id}`}
                      key={calendarEvent.id}
                    >
                      <CalendarEvent
                        key={calendarEvent.id}
                        {...calendarEvent}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        },
      )}
      <div className="fixed bottom-28 right-8">
        <CreateCalendarEventOverlay />
      </div>
    </main>
  );
}

// get all quotes
