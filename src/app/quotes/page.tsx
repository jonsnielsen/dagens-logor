import Link from "next/link";
import { CreateQuoteOverlay } from "~/app/quotes/_components/CreateQuoteOverlay";
import { Card, CardContent } from "~/components/ui/card";
import { QuoteDTO } from "~/server/db/dtoTypes";
import { getQuotes } from "~/server/queries";

type QuoteProps = QuoteDTO;
function Quote({ quote, personQuoted }: QuoteProps) {
  return (
    <Card className="mb-3 mt-3 hover:bg-gray-50">
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
export default async function QuoteIndividualPage({
  params,
}: {
  params: { id: string };
}) {
  // const { id } = params;
  const quotes = await getQuotes();

  return (
    <main className="page-side-margin-1">
      <h1 className="mb-6 mt-6 text-center text-2xl">Quotes</h1>
      {quotes.map((quote) => (
        <Link href={`/quotes/${quote.id}`} key={quote.id}>
          <Quote {...quote} />
        </Link>
      ))}
      <div className="fixed bottom-8 right-8">
        <CreateQuoteOverlay />
      </div>
    </main>
  );
}

// get all quotes
