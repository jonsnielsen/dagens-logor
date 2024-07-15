"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import type { CreateQuoteDTO } from "~/server/db/dtoTypes";
import { quotes } from "~/server/db/schema";

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

export async function createQuote(quote: CreateQuoteDTO) {
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

export async function updateQuote(quote: CreateQuoteDTO, quoteId: number) {
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
