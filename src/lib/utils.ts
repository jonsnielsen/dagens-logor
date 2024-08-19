import { auth } from "@clerk/nextjs/server";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMinutesTwoDigits(date: Date) {
  return ("0" + date.getMinutes()).slice(-2);
}

export function formatHoursTwoDigits(date: Date) {
  return ("0" + date.getHours()).slice(-2);
}

export function getTimeFromDate(date: Date) {
  let time: string | null =
    `${date.getHours()}:${formatMinutesTwoDigits(date)}`;
  time = time === "23:59" ? null : time; // 23:59 is when no time was set, in that case don't show the time.
  return time;
}

export function getTimeFromDateHourTwoDigits(date: Date) {
  let time: string | null =
    `${formatHoursTwoDigits(date)}:${formatMinutesTwoDigits(date)}`;
  time = time === "23:59" ? null : time; // 23:59 is when no time was set, in that case don't show the time.
  return time;
}
