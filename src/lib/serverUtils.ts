import { auth } from "@clerk/nextjs/server";

export function isLoggedIn() {
  const user = auth();
  return !!user?.userId;
}
