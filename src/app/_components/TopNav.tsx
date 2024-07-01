"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { ToggleDarkModeButton } from "~/app/_components/ToggleDarkModeButton";
import { Logo } from "~/assets/Logo";
import { BsArrowLeft } from "react-icons/bs";
import { usePathnameEntry } from "~/lib/hooks";
import { Button } from "~/components/ui/button";
import Link from "next/link";

export function TopNav() {
  const pathname = usePathname();
  const firstPathnameEntry = usePathnameEntry(1);
  const secondPathnameEntry = usePathnameEntry(2);

  const hasBackButton = firstPathnameEntry === "quotes" && secondPathnameEntry;
  const backButton = hasBackButton && (
    <Button asChild variant="ghost" size="icon">
      <Link href="/quotes">
        <BsArrowLeft fontSize={22} />{" "}
      </Link>
    </Button>
  );

  const title =
    pathname === "/quotes"
      ? "Quotes"
      : pathname === "/calendar"
        ? "Calendar"
        : null;

  return (
    <nav className="fixed top-0 flex w-full items-center justify-between border-b bg-slate-50 p-4 text-xl font-semibold">
      {/* <Logo width="165px" height="40px" /> */}
      <div className="flex grow basis-0 justify-start">{backButton}</div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div>{title}</div>
        {/* <ToggleDarkModeButton /> */}
        <div className="flex h-10 w-10 grow basis-0 justify-end">
          <UserButton />
        </div>
      </SignedIn>
    </nav>
  );
}
