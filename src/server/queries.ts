import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function getQuotes() {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const quotes = await db.query.quotes.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return quotes;
}

export async function getQuote(quoteId: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const quote = await db.query.quotes.findFirst({
    where: (model, { eq }) => eq(model.id, quoteId),
  });

  if (!quote) throw new Error("Quote not found");

  return quote;
}

// Gets the info about any user.
export async function getUser(userId: string) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const queriedUser = await clerkClient.users.getUser(userId);

  if (!queriedUser) throw new Error("User not found");

  return queriedUser;
}
