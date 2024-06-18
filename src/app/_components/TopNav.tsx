import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ToggleDarkModeButton } from "~/app/_components/ToggleDarkModeButton";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <ToggleDarkModeButton />
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
