"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { TrashIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteCalendarEvent } from "~/server/queries/CalendarQueries";
import type { CalendarDBType } from "~/server/db/schema";
import { toast } from "sonner";

export function DeleteCalendarEventOverlay({
  calendarEvent,
}: {
  calendarEvent: CalendarDBType;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function onDelete() {
    const res = await deleteCalendarEvent(calendarEvent);
    if (!res?.message) {
      router.push("/calendar");
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sure you want to delete event?</DialogTitle>
          <DialogDescription>This action can not be undone</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="mt-4 flex flex-col gap-3">
            <Button onClick={onDelete} variant="destructive">
              Yes delete
            </Button>
            <Button onClick={() => setOpen(false)} variant="outline">
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
