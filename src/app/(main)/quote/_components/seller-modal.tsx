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
import { getSellers } from "./actions";

type Seller = {
  id: string;
  name: string;
};

type SellerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (seller: Seller) => void;
};

export function SellerModal({ isOpen, onClose, onSelect }: SellerModalProps) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      getSellers().then(setSellers);
    }
  }, [isOpen]);

  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Seller</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search sellers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="max-h-[300px] overflow-y-auto">
          {filteredSellers.map((seller) => (
            <Button
              key={seller.id}
              variant="ghost"
              className="mb-2 w-full justify-start"
              onClick={() => onSelect(seller)}
            >
              {seller.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
