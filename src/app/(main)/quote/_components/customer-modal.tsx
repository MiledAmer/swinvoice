"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { getCustomers } from "./actions";

type Customer = {
  id: string;
  name: string;
};

type CustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customer: Customer) => void;
};

export function CustomerModal({
  isOpen,
  onClose,
  onSelect,
}: CustomerModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      getCustomers().then(setCustomers);
    }
  }, [isOpen]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {filteredCustomers.map((customer) => (
            <Button
              key={customer.id}
              variant="ghost"
              className="mb-2 w-full justify-start"
              onClick={() => onSelect(customer)}
            >
              {customer.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
