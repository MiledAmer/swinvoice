"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { QuoteItem } from "@prisma/client";
import { DialogTrigger } from "@radix-ui/react-dialog";

// type QuoteItem = {
//   id: string;
//   name: string;
//   description: string;
//   quantity: number;
//   unitPrice: number;
//   totalPrice: number;
//   totalVat?: number;
//   vatRate?: number;
// };

type QuoteItemsTableProps = {
  items: Omit<QuoteItem, "quoteId">[];
  setItems: React.Dispatch<React.SetStateAction<Omit<QuoteItem, "quoteId">[]>>;
};

export function QuoteItemsTable({ items, setItems }: QuoteItemsTableProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Omit<
    QuoteItem,
    "quoteId"
  > | null>(null);

  const openDialog = (item?: Omit<QuoteItem, "quoteId">) => {
    setCurrentItem(
      item || {
        id: "",
        name: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        totalVat: 0,
        vatRate: 0,
      },
    );
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentItem(null);
  };

  const handleSave = (item: Omit<QuoteItem, "quoteId">) => {
    item.totalVat =
      ((item.quantity as number) * item.unitPrice * (item.vatRate as number)) /
      100;
    item.totalPrice =
      (item.quantity as number) * item.unitPrice + item.totalVat;
    if (item.id) {
      setItems(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      setItems([...items, { ...item, id: Date.now().toString() }]);
    }
    closeDialog();
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const AddItemComponent = (
    isDialogOpen: boolean,
    setIsDialogOpen: (state: boolean) => void,
    variant?: string,
  ) => (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          // @ts-ignore
          variant={variant ? variant : "outline"}
        >
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentItem?.id ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <form>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={currentItem?.name || ""}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev!,
                    name: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={currentItem?.description || ""}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev!,
                    description: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={currentItem?.quantity || 0}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev!,
                    quantity: Number(e.target.value),
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unitPrice" className="text-right">
                Unit Price
              </Label>
              <Input
                id="unitPrice"
                type="number"
                value={currentItem?.unitPrice || 0}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev!,
                    unitPrice: Number(e.target.value),
                  }))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vatRate" className="text-right">
                VAT Rate
              </Label>
              <Input
                id="vatRate"
                type="number"
                value={currentItem?.vatRate || 0}
                onChange={(e) =>
                  setCurrentItem((prev) => ({
                    ...prev!,
                    vatRate: Number(e.target.value),
                  }))
                }
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={(e) => {
                e.preventDefault();
                if (currentItem) {
                  handleSave(currentItem);
                }
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit Price</TableHead>
            <TableHead>VAT Rate</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>{item.unitPrice}</TableCell>
              <TableCell>{item.vatRate}</TableCell>
              <TableCell>{item.totalPrice}</TableCell>
              <TableCell>
                {AddItemComponent(isDialogOpen, setIsDialogOpen, "ghost")}
                <Button variant="ghost" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {AddItemComponent(isDialogOpen, setIsDialogOpen)}
    </div>
  );
}
