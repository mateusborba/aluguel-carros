"use server";
//import { eq, not } from "drizzle-orm";
//import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { carros } from "@/db/schema";

export const getCars = async (): Promise<Carro[]> => {
  const data = await db.select().from(carros);
  return data;
};

/* export const addCar = async ({}) => {
  await db.insert(carros).values({});
}; 

export const deleteCar = async ({}) => {
  await db.delete(carros); /* .where(eq(carros.id, id));

  revalidatePath("/");
};

export const editCar = async () => {
  await db.update(carros).set({}); /* .where(eq()); 

  revalidatePath("/");
}; */
