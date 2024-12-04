"use server";

import { PrismaClient } from "@prisma/client";
import { sub } from "date-fns";

const prisma = new PrismaClient();

export async function getSellers() {
  return prisma.seller.findMany({
    select: { id: true, name: true },
  });
}

export async function getCustomers() {
  return prisma.customer.findMany({
    select: { id: true, name: true },
  });
}

export async function createQuote(data: any) {
  const { items, ...quoteData } = data;
  const quote = await prisma.quote.create({
    data: {
      number: data.number,
      date: new Date(data.date),
      validUntil: new Date(data.validUntil),
      sellerId: data.sellerId,
      customerId: data.customerId,
      subtotal: items.reduce(
        (acc: number, item: any) => acc + item.totalPrice,
        0,
      ),
      vatRate: data.vatRate,
      vatAmount: items.reduce(
        (acc: number, item: any) => acc + item.totalPrice,
        0,
      ),
      total: items.reduce((acc: number, item: any) => acc + item.totalPrice, 0),
      terms: data.terms,
      notes: data.notes,
      comment: data.comment,

      items: {
        create: items,
      },
    },
  });

  return quote;
}
