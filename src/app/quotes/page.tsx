import { CreateQuoteOverlay } from "~/app/quotes/_components/CreateQuoteOverlay";
import { getQuotes } from "~/server/queries";

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
        <div key={quote.id}>{quote.quote}</div>
      ))}
      <div className="absolute bottom-8 right-8">
        <CreateQuoteOverlay />
      </div>
    </main>
  );
}

// get all quotes
