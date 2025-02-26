"use server";

import { db } from "@/db/drizzle";
import { carros } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const getCars = async (): Promise<Carro[]> => {
  const data = await db.select().from(carros);
  return data;
};

export const addCarAction = async ({
  car,
  userId,
}: {
  car: Omit<Carro, "id" | "userId">;
  userId: string;
}) => {
  try {
    await db.insert(carros).values({
      ano: car.ano,
      imagem: car.imagem,
      marca: car.marca,
      modelo: car.modelo,
      placa: car.placa,
      preco: car.preco,
      userId: userId,
    });

    // Revalidar o cache da rota raiz
    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err: "Erro ao adicionar carro." };
  }
};
