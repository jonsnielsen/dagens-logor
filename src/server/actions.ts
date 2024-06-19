"use server";

import { auth } from "@clerk/nextjs/server";
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
    return { message: `Couldn't create Quote` };
  }
}
