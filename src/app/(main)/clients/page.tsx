import CreateCustomerModal from "./_components/create-modal";
import UsersTable from "./_components/users-table";
import { getCustomers } from "./server-customer";

export default async function page() {
  const customers = await getCustomers();
  return (
    <div className="flex flex-col">
      <h1 className="text-3xl">clients page</h1>
      <div className= "grid justify-items-end">
        <CreateCustomerModal />
      </div>
      <UsersTable data={customers}/>
    </div>
  );
}
