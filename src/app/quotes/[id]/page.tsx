import Image from "next/image";
import { DeleteQuoteOverlay } from "~/app/quotes/_components/DeleteQuoteOverlay";
import { EditQuoteOverlay } from "~/app/quotes/_components/EditQuoteOverlay";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { getQuote, getUser } from "~/server/queries";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const sectionClasses = "my-8";
const headingClasses = "text-sm font-bold mb-2";
const paragraphClasses = "text-xl";

export default async function QuoteIndividualPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const quote = await getQuote(Number(id));
  if (!quote) throw new Error(`Coulnd't find quote with id: ${id}`);
  // sequential instead of using a join (becuase I don't know how to)
  const quoteUser = await getUser(quote.userId);

  const loggedInUser = await currentUser();

  const hasCRUDRights = loggedInUser?.id && quote.userId === loggedInUser?.id;

  return (
    <main className="page-side-margin-1 mt-16">
      {hasCRUDRights && (
        <div className="fixed bottom-28 right-8">
          <div className="flex gap-2">
            <EditQuoteOverlay quote={quote} />
            <DeleteQuoteOverlay quoteId={quote.id} />
          </div>
        </div>
      )}
      <div className={sectionClasses}>
        <h3 className={headingClasses}>Quote</h3>
        <p className={paragraphClasses}>{quote.quote}</p>
      </div>
      <Separator orientation="horizontal" />
      <div className={sectionClasses}>
        <h3 className={headingClasses}>Person quoted</h3>
        <p className={paragraphClasses}>{quote.personQuoted}</p>
      </div>

      <Separator orientation="horizontal" />
      <div className={sectionClasses}>
        <h3 className={headingClasses}>Context of quote</h3>
        <p className={paragraphClasses}>{quote.contextOfQuote}</p>
      </div>
      <Separator orientation="horizontal" />

      <div className={sectionClasses}>
        <h3 className={headingClasses}>Quote created by</h3>
        <div className="align flex items-center gap-2">
          <Image
            width="48"
            height="48"
            src={quoteUser.imageUrl}
            alt={`user image for ${quoteUser.firstName} ${quoteUser.lastName}`}
          />
          <p className={paragraphClasses}>
            {quoteUser.firstName} {quoteUser.lastName}
          </p>
        </div>
      </div>
    </main>
  );
}
