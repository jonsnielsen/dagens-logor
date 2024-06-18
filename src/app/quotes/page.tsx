import { Button } from "~/components/ui/button";

export default function QuoteIndividualPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  return (
    <main className="">
      <div>{id}</div>
      <Button>Hello world</Button>
    </main>
  );
}

// get all quotes
