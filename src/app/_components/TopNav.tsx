import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { ToggleDarkModeButton } from "~/app/_components/ToggleDarkModeButton";
import { Logo } from "~/assets/Logo";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b p-4 text-xl font-semibold">
      <Logo className="" width="165px" height="40px" />
      {/* <Logo className="" style={{ scale: 0.8 }} /> */}
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
