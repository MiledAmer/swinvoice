"use client";

import { Customer } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type CustomerDetailsModalProps = {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CustomerDetailsModal({
  customer,
  open,
  onOpenChange,
}: CustomerDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Name:</span>
            <span className="col-span-3">{customer.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="text-right font-medium">Address:</span>
            <span className="col-span-3">{customer.address}</span>
          </div>
          {customer.siret && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">SIRET:</span>
              <span className="col-span-3">{customer.siret}</span>
            </div>
          )}
          {customer.phone && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Phone:</span>
              <span className="col-span-3">{customer.phone}</span>
            </div>
          )}
          {customer.email && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-medium">Email:</span>
              <span className="col-span-3">{customer.email}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
