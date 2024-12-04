"use server";
import { db } from "~/server/db";
import { Prisma, Quote, QuoteItem } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type QuoteCreateInput = Prisma.QuoteCreateInput;
export type QuoteUpdateInput = Prisma.QuoteUpdateInput;
export type QuoteWhereUniqueInput = Prisma.QuoteWhereUniqueInput;
export type QuoteData = Prisma.QuoteGetPayload<{
  include: {
    seller: true;
    customer: true;
    items: true;
  };
}>;

// export async function createQuote(data: QuoteCreateInput) {
//   try {
//     const quote = await db.quote.create({ data });
//     revalidatePath("/quotes");
//     return quote;
//   } catch (error) {
//     console.error("Server action create quote error:", error);
//     throw new Error("Failed to create quote");
//   }
// }

export async function createQuote(data: any) {
  const { items, ...quoteData } = data;
  const quote = await db.quote.create({
    data: {
      number: data.number,
      date: new Date(data.date),
      validUntil: new Date(data.validUntil),
      sellerId: data.sellerId,
      customerId: data.customerId,
      subtotal: items.reduce(
        (acc: number, item: QuoteItem) =>
          acc + item.unitPrice * (item.quantity as number),
        0,
      ),
      vatRate: data.vatRate,
      vatAmount: items.reduce(
        (acc: number, item: QuoteItem) => acc + (item.totalVat as number),
        0,
      ),
      total: items.reduce((acc: number, item: any) => acc + item.totalPrice, 0),
      terms: data.terms,
      notes: data.notes,
      comment: data.comment,

      items: {
        create: items.map((item: QuoteItem) => {
          // You can add any additional processing for each item here
          return item;
        }),
      },
    },
  });

  return quote;
}

export async function updateQuote(id: string, data: QuoteUpdateInput) {
  try {
    const quote = await db.quote.update({
      where: { id },
      data,
    });
    revalidatePath(`/quotes/${id}`);
    return quote;
  } catch (error) {
    console.error("Server action update quote error:", error);
    throw new Error("Failed to update quote");
  }
}

export async function deleteQuote(id: string) {
  try {
    await db.quote.delete({ where: { id } });
    revalidatePath("/quotes");
  } catch (error) {
    console.error("Server action delete quote error:", error);
    throw new Error("Failed to delete quote");
  }
}

export async function getQuotes() {
  try {
    return await db.quote.findMany({
      include: {
        seller: true,
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Server action get quotes error:", error);
    throw new Error("Failed to fetch quotes");
  }
}

export async function getQuoteById(id: string) {
  try {
    return await db.quote.findUnique({
      where: { id },
      include: {
        seller: true,
        customer: true,
        items: true,
      },
    });
  } catch (error) {
    console.error("Server action get quote by ID error:", error);
    throw new Error("Failed to fetch quote");
  }
}
