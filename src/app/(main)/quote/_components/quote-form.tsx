"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { SellerModal } from "./seller-modal";
import { CustomerModal } from "./customer-modal";
import { QuoteItemsTable } from "./quote-items-table";
import { QuoteItem } from "@prisma/client";
import { createQuote } from "../server-quote";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const quoteFormSchema = z.object({
  number: z.string().min(1, "Quote number is required"),
  date: z.string().min(1, "date is required"),
  validUntil: z.string().min(1, "Valid until date is required"),
  sellerId: z.string().min(1, "Seller is required"),
  customerId: z.string().min(1, "Customer is required"),
  terms: z.string().optional(),
  notes: z.string().optional(),
});

export function QuoteForm() {
  const router = useRouter();
  const [items, setItems] = useState<Omit<QuoteItem, "quoteId">[]>([]);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const form = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      number: "",
      date: "",
      validUntil: "",
      sellerId: "",
      customerId: "",
      terms: "",
      notes: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof quoteFormSchema>) => {
    try {
      await createQuote({ ...data, items });
      toast.success("Quote automatically saved");
      router.push("/quote");
      // Handle success (e.g., show a success message, redirect, etc.)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error("Failed to create quote:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valid Until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sellerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seller</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input {...field} readOnly />
                    <Button
                      type="button"
                      onClick={() => setIsSellerModalOpen(true)}
                    >
                      Select
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Input {...field} readOnly />
                    <Button
                      type="button"
                      onClick={() => setIsCustomerModalOpen(true)}
                    >
                      Select
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <QuoteItemsTable items={items} setItems={setItems} />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Terms</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Create Quote</Button>
      </form>

      <SellerModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        onSelect={(seller) => {
          form.setValue("sellerId", seller.id);
          setIsSellerModalOpen(false);
        }}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSelect={(customer) => {
          form.setValue("customerId", customer.id);
          setIsCustomerModalOpen(false);
        }}
      />
    </Form>
  );
}
