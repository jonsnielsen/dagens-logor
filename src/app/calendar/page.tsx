import { CalendarIcon } from "@radix-ui/react-icons";
import { format, getISOWeek, getISOWeekYear } from "date-fns";
import Link from "next/link";
import { CreateCalendarEventOverlay } from "~/app/calendar/_components/CreateCalendarEventOverlay";
import { Card, CardContent } from "~/components/ui/card";
import { isLoggedIn } from "~/lib/serverUtils";
import { Category } from "~/lib/types";
import { getTimeFromDate, getTimezoneOffsetTime } from "~/lib/utils";
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
  const time = getTimezoneOffsetTime(new Date(date));
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
        </div>
      </CardContent>
    </Card>
  );
}

function initialiseYearGroup({
  firstWeekYear,
  lastWeekYear,
}: {
  firstWeekYear: number;
  lastWeekYear: number;
}) {
  const groupedByYear: Map<
    number,
    Map<number, GetCalendarEventsReturnType[]>
  > = new Map<number, Map<number, GetCalendarEventsReturnType[]>>();
  let year = firstWeekYear;
  while (year <= lastWeekYear) {
    groupedByYear.set(year, new Map());
    year++;
  }
  return groupedByYear;
}

function groupCalendarEvents(calendarEvents: GetCalendarEventsReturnType[]) {
  if (!calendarEvents.length) return [];

  const firstWeekNumber = getISOWeek(new Date(calendarEvents[0]!.date));
  const firstWeekYear = getISOWeekYear(new Date(calendarEvents[0]!.date));

  const lastWeekYear = getISOWeekYear(
    new Date(calendarEvents[calendarEvents.length - 1]!.date),
  );

  const groupedByYear = initialiseYearGroup({
    firstWeekYear,
    lastWeekYear,
  });

  let prevWeek = firstWeekNumber;

  // for each event, check the week, if the week has a gap from the previous weeks, add whose weeks
  calendarEvents.forEach((calendarEvent) => {
    const date = new Date(calendarEvent.date);
    const weekNumber = getISOWeek(date);
    const weekYear = getISOWeekYear(date);

    if (weekNumber > prevWeek + 1) {
      let week = prevWeek + 1;
      while (week < weekNumber) {
        groupedByYear.get(weekYear)?.set(week, []);
        week++;
      }
    }

    if (!groupedByYear.get(weekYear)?.get(weekNumber)) {
      groupedByYear.get(weekYear)?.set(weekNumber, []);
    }
    groupedByYear.get(weekYear)?.get(weekNumber)?.push(calendarEvent);

    prevWeek = weekNumber;
  });
  return groupedByYear;
}

export default async function CalendarPage() {
  if (!isLoggedIn()) return null;
  const calendarEvents = await getCalendarEvents();
  const groupedByYear = groupCalendarEvents(calendarEvents);

  return (
    <main className="page-side-margin-1 page-bottom-nav-offset">
      {Array.from(groupedByYear.entries()).map(([year, weeks], index) => {
        return (
          <div key={year}>
            {index > 0 && (
              <div className="mb-6 mt-3 text-3xl font-medium">{year}</div>
            )}
            {Array.from(weeks.entries()).map(([weekNumber, events]) => {
              return (
                <div
                  key={weekNumber}
                  className={`${events.length ? "mb-10" : ""}`}
                >
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
            })}
          </div>
        );
      })}
      <div className="fixed bottom-28 right-8">
        <CreateCalendarEventOverlay />
      </div>
    </main>
  );
}

// get all quotes
