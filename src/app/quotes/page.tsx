import { CreateQuoteOverlay } from "~/app/quotes/_components/CreateQuoteOverlay";
import { QuoteDTO } from "~/server/db/dtoTypes";
import { getQuotes } from "~/server/queries";

type QuoteProps = QuoteDTO;
function Quote({ quote, personQuoted }: QuoteProps) {
  return (
    <div>
      <blockquote className="ml-3 mt-6 border-l-2 border-gray-300 pl-3 pr-3 text-lg font-medium italic">
        {quote}
      </blockquote>
      <p className="ml-4 mt-2 text-sm"> - {personQuoted}</p>
    </div>
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
    <main className="">
      {quotes.map((quote) => (
        <Quote key={quote.id} {...quote} />
      ))}
      <div className="absolute bottom-8 right-8">
        <CreateQuoteOverlay />
      </div>
    </main>
  );
}

// get all quotes
