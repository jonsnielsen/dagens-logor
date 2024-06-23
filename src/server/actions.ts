"use server";

import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { db } from "~/server/db";
import type { QuoteDTO } from "~/server/db/dtoTypes";
import { quotes } from "~/server/db/schema";

export async function createQuote(quote: QuoteDTO) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  if (!quote.quote) throw new Error("Quote field cannot be empty");
  if (!quote.personQuoted)
    throw new Error("Person quoted field cannot be empty");

  try {
    await db.insert(quotes).values({ ...quote, userId: user.userId });
  } catch (error) {
    const message = `Couldn't create Quote`;
    console.log(message);
    return {
      message,
    };
  }
}

export async function updateQuote(quote: QuoteDTO, quoteId: number) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  if (!quote.quote) throw new Error("Quote field cannot be empty");
  if (!quote.personQuoted)
    throw new Error("Person quoted field cannot be empty");

  try {
    await db
      .update(quotes)
      .set({ ...quote })
      .where(eq(quotes.id, quoteId));
  } catch (error) {
    const message = `Couldn't update Quote. ${String(error)}`;
    console.log(message);
    return {
      message,
    };
  }
}

export async function deleteQuote(quoteId: number) {
  const user = auth();
  const userId = user.userId;
  if (!userId) throw new Error("Unauthorized, not logged in");

  // Must be the owner of the quote to delete
  try {
    await db
      .delete(quotes)
      .where(and(eq(quotes.id, quoteId), eq(quotes.userId, userId)));
  } catch (error) {
    const message = `Couldn't delete Quote. User who tried to delete ${userId}. ${String(error)}`;
    console.log(message);
    return {
      message,
    };
  }
}
