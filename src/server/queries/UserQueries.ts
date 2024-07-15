import { auth, clerkClient } from "@clerk/nextjs/server";

// Gets the info about any user.
export async function getUser(userId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const queriedUser = await clerkClient.users.getUser(userId);

  if (!queriedUser) throw new Error("User not found");

  return queriedUser;
}
