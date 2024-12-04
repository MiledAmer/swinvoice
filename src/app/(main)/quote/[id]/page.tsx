import { notFound } from "next/navigation";
import { format } from "date-fns";
import { QuoteDetails } from "./_components/quote-details";
import { db } from "~/server/db";

async function getQuote(id: string) {
  // This is a placeholder function. Replace with your actual data fetching logic.
  const quote = await db.quote.findUnique({
    where: { id },
    include: {
      seller: true,
      customer: true,
      items: true,
    },
  });

  if (!quote) {
    notFound();
  }

  return quote;
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const quote = await getQuote(id);

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-6 text-3xl font-bold">Quote #{quote.number}</h1>
      <QuoteDetails quote={quote} />
    </div>
  );
}
