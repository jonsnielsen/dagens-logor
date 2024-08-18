"use server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { eq, and } from "drizzle-orm";
import type { CreateQuoteDTO } from "~/server/db/dtoTypes";
import { QuoteDBType, quotes } from "~/server/db/schema";
import { hasAdminRights } from "~/lib/serverUtils";
import { ServerErrorType } from "~/lib/types";

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
  const error: ServerErrorType = { message: null };

  const user = auth();
  if (!user.userId) error.message = "Unauthorized, not logged in";

  if (!quote.quote) error.message = "Quote field cannot be empty";

  if (!quote.personQuoted)
    error.message = "Person quoted field cannot be empty";

  if (error.message) return error;

  try {
    await db.insert(quotes).values({ ...quote, userId: user.userId! }); // we know that userId will be present, otherwise we return early.
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}

export async function updateQuote(quote: QuoteDBType) {
  const error: ServerErrorType = { message: null };

  const user = auth();
  const isAdmin = await hasAdminRights();

  if (!user.userId) error.message = "Unauthorized, not logged in";

  // must be the owner or admin to edit
  if (user.userId !== quote.userId && !isAdmin)
    error.message = "Unauthorized, not the user that created the quote";

  if (!quote.quote) error.message = "Quote field cannot be empty";

  if (!quote.personQuoted)
    error.message = "Person quoted field cannot be empty";

  if (error.message) return error;

  try {
    await db
      .update(quotes)
      .set({ ...quote })
      .where(eq(quotes.id, quote.id));
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}

export async function deleteQuote(quote: QuoteDBType) {
  const error: ServerErrorType = { message: null };

  const user = auth();
  const isAdmin = await hasAdminRights();

  if (!user.userId) error.message = "Unauthorized, not logged in";

  // must be the owner or admin to delete
  if (user.userId !== quote.userId && !isAdmin)
    error.message = "Unauthorized, not the user that created the quote";

  if (error.message) return error;

  try {
    await db
      .delete(quotes)
      .where(and(eq(quotes.id, quote.id), eq(quotes.userId, user.userId!))); // we know that userId will be present, otherwise we return early.
  } catch (e) {
    error.message = `${String(e)}`;
    return error;
  }
}
