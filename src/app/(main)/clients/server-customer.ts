"use server";
import { db } from "~/server/db";

import { Prisma } from "@prisma/client";

export type CustomerCreateInput = Prisma.CustomerCreateInput;
export type CustomerUpdateInput = Prisma.CustomerUpdateInput;
export type CustomerWhereUniqueInput = Prisma.CustomerWhereUniqueInput;


import { revalidatePath } from "next/cache";

export async function createCustomer(data: CustomerCreateInput) {
  console.log("data", data);
  try {
    const customer = await db.customer.create({ data });
    revalidatePath("/clients");
    return customer;
  } catch (error) {
    console.error("Server action create customer error:", error);
    throw new Error("Failed to create customer");
  }
}

export async function updateCustomer(id: string, data: CustomerUpdateInput) {
  try {
    const customer = await db.customer.update({
      where: { id },
      data,
    });
    revalidatePath(`/customers/${id}`);
    return customer;
  } catch (error) {
    console.error("Server action update customer error:", error);
    throw new Error("Failed to update customer");
  }
}

export async function deleteCustomer(id: string) {
  try {
    await db.customer.delete({ where: { id } });
    revalidatePath("/customers");
  } catch (error) {
    console.error("Server action delete customer error:", error);
    throw new Error("Failed to delete customer");
  }
}

export async function getCustomers() {
  try {
    return await db.customer.findMany();
  } catch (error) {
    console.error("Server action get customers error:", error);
    throw new Error("Failed to fetch customers");
  }
}

export async function getCustomerById(id: string) {
  try {
    return await db.customer.findUnique({
      where: { id },
      include: {
        invoices: true,
        quotes: true,
      },
    });
  } catch (error) {
    console.error("Server action get customer by ID error:", error);
    throw new Error("Failed to fetch customer");
  }
}
