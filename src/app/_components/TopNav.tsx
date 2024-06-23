import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ToggleDarkModeButton } from "~/app/_components/ToggleDarkModeButton";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-end border-b p-4 text-xl font-semibold">
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div className="flex justify-end">
          <ToggleDarkModeButton />
          <div className="ml-4 w-10">
            <UserButton />
          </div>
        </div>
      </SignedIn>
    </nav>
  );
}
