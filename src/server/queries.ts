import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function getQuotes() {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized, not logged in");

  const quotes = await db.query.quotes.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });

  return quotes;
}
