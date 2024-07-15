"use client";

import { SignedIn } from "@clerk/nextjs";
import { BsChatLeftQuote, BsChatLeftQuoteFill } from "react-icons/bs";
import { BsCalendar2Range, BsCalendar2RangeFill } from "react-icons/bs";
import { PiFireLight, PiFireFill, PiCalendarDotsLight } from "react-icons/pi";
import Link from "next/link";
import { usePathnameEntry } from "~/lib/hooks";

const navItems = [
  // { Icon: PiFireLight, IconFill: PiFireFill, fontSize: 22, url: "/kiln" },
  {
    Icon: BsCalendar2Range,
    IconFill: BsCalendar2RangeFill,
    fontSize: 20,
    url: "/calendar",
  },
  {
    Icon: BsChatLeftQuote,
    IconFill: BsChatLeftQuoteFill,
    fontSize: 20,
    url: "/quotes",
  },
];

export function BottomNav() {
  const firstPathnameEntry = usePathnameEntry(1);

  return (
    <SignedIn>
      <nav className="fixed bottom-0 flex w-full items-center justify-around border-b bg-slate-50 pb-10 pt-3 font-semibold">
        {navItems.map(({ Icon, IconFill, url, fontSize }) => {
          // take away the root slash from our url
          const isActiveRootTab = firstPathnameEntry === url.slice(1);
          return (
            <Link key={url} href={url}>
              {isActiveRootTab ? (
                <IconFill fontSize={fontSize} />
              ) : (
                <Icon fontSize={fontSize} />
              )}
            </Link>
          );
        })}
      </nav>
    </SignedIn>
  );
}
