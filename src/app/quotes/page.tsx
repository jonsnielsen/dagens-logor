import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { CreateQuoteOverlay } from "~/app/quotes/_components/CreateQuoteOverlay";
import { Card, CardContent } from "~/components/ui/card";
import { isLoggedIn } from "~/lib/serverUtils";
import { CreateQuoteDTO } from "~/server/db/dtoTypes";
import { getQuotes } from "~/server/queries/QuoteQueries";

function Quote({ quote, personQuoted }: CreateQuoteDTO) {
  return (
    <Card className="hover:bg-gray-50">
      <CardContent>
        <div className="border-l-2 border-gray-300 pl-3">
          <blockquote className="ml-2 mt-6 pr-3 text-lg font-medium italic">
            {quote}
          </blockquote>
          <p className="ml-2 mt-2 text-sm"> - {personQuoted}</p>
        </div>
      </CardContent>
    </Card>
  );
}
export default async function QuotesPage() {
  if (!isLoggedIn()) return null;

  const quotes = await getQuotes();

  return (
    <main className="page-side-margin-1">
      <div className="flex flex-col gap-4">
        {quotes.map((quote) => (
          <Link href={`/quotes/${quote.id}`} key={quote.id}>
            <Quote {...quote} />
          </Link>
        ))}
      </div>
      <div className="fixed bottom-28 right-8">
        <CreateQuoteOverlay />
      </div>
    </main>
  );
}

// get all quotes
