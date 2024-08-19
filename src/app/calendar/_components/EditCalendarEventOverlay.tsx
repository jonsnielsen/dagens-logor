"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { format } from "date-fns";

import type { TimeValue } from "react-aria";
import { Time } from "@internationalized/date";

import { CalendarIcon, Pencil1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { cn, getTimeFromDateHourTwoDigits } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TimePicker } from "~/components/ui/time-picker/time-picker";
import {
  createCalendarEvent,
  updateCalendarEvent,
} from "~/server/queries/CalendarQueries";
import { Category, Visibility } from "~/lib/types";
import { CalendarDBType } from "~/server/db/schema";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Required").max(254),
  description: z.string().max(1024),
  date: z.date({ required_error: "Date is required" }),
  time: z.custom<TimeValue | null>(),
  visibility: z.nativeEnum(Visibility),
  category: z.nativeEnum(Category),
});

export function EditCalendarEventOverlay({
  calendarEvent,
}: {
  calendarEvent: CalendarDBType;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const dateObject = new Date(calendarEvent.date);

  const time = getTimeFromDateHourTwoDigits(dateObject);
  console.log({ time });
  console.log({
    helsitime: dateObject.toLocaleString("en-US", {
      timeZone: "Europe/Copenhagen",
    }),
  });

  const timeValue =
    time && new Time(Number(time.slice(0, 2)), Number(time.slice(3)));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: calendarEvent.title,
      description: calendarEvent.description ?? "",
      date: dateObject,
      time: timeValue,
      visibility: calendarEvent.visibility as Visibility,
      category: calendarEvent.category as Category,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { date, time, ...rest } = values;
    const dateString = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time?.hour ?? 23,
        time?.minute ?? 59,
      ),
    ).toISOString();

    const res = await updateCalendarEvent({
      ...calendarEvent,
      ...rest,
      date: dateString,
    });

    if (!res?.message) {
      // reruns on the server and refreshes just the necessary parts.
      router.refresh();
      setOpen(false);
    } else {
      toast.error(res.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon">
          <Pencil1Icon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              rules={{ required: true }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-6">
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem className="grow basis-0">
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Visibility.PRIVATE}>
                          Private
                        </SelectItem>
                        <SelectItem value={Visibility.PUBLIC}>
                          Public
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="grow basis-0">
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Category.CERAMICS}>
                          Ceramics
                        </SelectItem>
                        <SelectItem value={Category.OTHER}>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex grow basis-0 flex-col">
                    <FormLabel>Date</FormLabel>
                    {/* modal is necessary for the popover portal to work inside dialog */}
                    <Popover modal>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="-mt-[10px] grow basis-0">
                    <FormLabel>Time</FormLabel>
                    <TimePicker
                      aria-label="Time"
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button className="mt-16" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
