import { QuoteForm } from "../_components/quote-form";

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-5 text-2xl font-bold">Create New Quote</h1>
      <QuoteForm />
    </div>
  );
}
