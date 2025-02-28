"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { carros } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getCars = async (): Promise<Carro[]> => {
  const data = await db.select().from(carros);
  return data;
};

export const addCarAction = async ({
  car,
}: {
  car: Omit<Carro, "id" | "userId">;
}) => {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      return { success: false, err: "Usuário não autenticado." };
    }

    await db.insert(carros).values({
      ano: car.ano,
      imagem: car.imagem,
      marca: car.marca,
      modelo: car.modelo,
      placa: car.placa,
      preco: car.preco,
      userId: session.user.id,
    });

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.log(err);
    return { success: false, err: "Erro ao adicionar carro." };
  }
};

export const handleRentalCar = async ({ carId }: { carId: string }) => {
  await db
    .update(carros)
    .set({ status: "alugado" })
    .where(eq(carros.id, carId));

  revalidatePath("/");
};

export const getCarrosById = async ({
  userId,
}: {
  userId: string;
}): Promise<Carro[]> => {
  const result = await db
    .select()
    .from(carros)
    .where(eq(carros.userId, userId));

  return result;
};
