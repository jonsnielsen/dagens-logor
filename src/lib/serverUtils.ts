import { auth, currentUser } from "@clerk/nextjs/server";

export function isLoggedIn() {
  const user = auth();
  return !!user?.userId;
}

export async function hasAdminRights() {
  const admins = [
    "user_2jpU2Ww9ZdoHK5IJSE0zDaQZZKC", // cilla
    "user_2i0LzpAtPPRcIrIxGj9ErRSJ4Cl", // jonathan
  ];

  const loggedInUser = await currentUser();
  return loggedInUser && admins.includes(loggedInUser.id);
}
