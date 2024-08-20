import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import { getUser } from "~/server/queries/UserQueries";
import { hasAdminRights, isLoggedIn } from "~/lib/serverUtils";
import { getCalendarEvent } from "~/server/queries/CalendarQueries";
import { format } from "date-fns";
import {
  PiTag,
  PiEyeLight,
  PiEyeSlashLight,
  PiCalendarDotsLight,
} from "react-icons/pi";

import { Visibility } from "~/lib/types";
import { DeleteCalendarEventOverlay } from "~/app/calendar/_components/DeleteCalendarEventOverlay";
import { EditCalendarEventOverlay } from "~/app/calendar/_components/EditCalendarEventOverlay";
import { getTimeFromDate, getTimezoneOffsetTime } from "~/lib/utils";

const sectionClasses = "my-8";
const headingClasses = "text-sm font-bold mb-2";
const paragraphClasses = "text-xl";

export default async function QuoteIndividualPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isLoggedIn()) return null;

  const { id } = params;

  const calendarEvent = await getCalendarEvent(Number(id));
  if (!calendarEvent)
    throw new Error(`Coulnd't find calendar event with id: ${id}`);
  // sequential instead of using a join (becuase I don't know how to)
  const calendarEventUser = await getUser(calendarEvent.userId);

  const loggedInUser = await currentUser();

  const isAdmin = await hasAdminRights();

  const hasCRUDRights =
    loggedInUser?.id && (calendarEvent.userId === loggedInUser?.id || isAdmin);

  const formattedDate = format(calendarEvent.date, "EEEE MMMM d, yyyy");

  const time = getTimezoneOffsetTime(new Date(calendarEvent.date));

  return (
    <main className="page-side-margin-1">
      {hasCRUDRights && (
        <div className="fixed bottom-28 right-8">
          <div className="flex gap-2">
            <EditCalendarEventOverlay calendarEvent={calendarEvent} />
            <DeleteCalendarEventOverlay calendarEvent={calendarEvent} />
          </div>
        </div>
      )}
      <div className={"mb-12"}>
        {/* <h3 className={headingClasses}>Title</h3> */}
        <h1 className="mb-6 text-2xl font-bold">{calendarEvent.title}</h1>
        <p className={paragraphClasses + " text-muted-foreground"}>
          {calendarEvent.description}
        </p>
      </div>
      <Separator orientation="horizontal" />
      <div className={`${paragraphClasses} mt-12 grid gap-2`}>
        <div className="flex items-center gap-2">
          <PiTag className="h-5 w-5" />
          <span>{calendarEvent.category}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison */}
          {calendarEvent.visibility === Visibility.PRIVATE ? (
            <PiEyeSlashLight className="h-5 w-5" />
          ) : (
            <PiEyeLight className="h-5 w-5" />
          )}
          <span>{calendarEvent.visibility}</span>
        </div>
        <div className="flex items-center gap-2">
          <PiCalendarDotsLight className="h-5 w-5" />
          <span>{formattedDate}</span> {time && <span>- {time}</span>}
        </div>
      </div>

      <div className={sectionClasses}>
        <h3 className={headingClasses}>Created by</h3>
        <div className="align flex items-center gap-2">
          <Image
            width="48"
            height="48"
            src={calendarEventUser.imageUrl}
            alt={`user image for ${calendarEventUser.firstName} ${calendarEventUser.lastName}`}
          />
          <p className={paragraphClasses}>
            {calendarEventUser.firstName} {calendarEventUser.lastName}
          </p>
        </div>
      </div>
    </main>
  );
}
