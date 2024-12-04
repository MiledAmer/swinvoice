import { Button } from "~/components/ui/button";
import OuotesTable from "./_components/quotes-table";
import { getCustomers } from "../clients/server-customer";
import { getQuotes, QuoteData } from "./server-quote";
import { Prisma } from "@prisma/client";
import Link from "next/link";
// import UsersTable from "./_components/users-table";
// import { getCustomers } from "./server-customer";

export default async function page() {
  const customers = (await getQuotes()) as QuoteData[];
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl">Quotes page</h1>
      <div className="grid justify-items-end">
        <Button variant="outline">
          <Link href="/quote/create" className="">
            {" "}
            Create Ouote
          </Link>
        </Button>
      </div>
      <OuotesTable data={customers} />
    </div>
  );
}
