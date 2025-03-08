"use server";

import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { carros } from "@/db/schema";
import { eq, not } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const getCars = async (): Promise<Carro[]> => {
  const session = await auth();

  // Se não houver usuário logado, retorna todos os carros
  if (!session?.user?.id) {
    const data = await db.select().from(carros);
    return data;
  }

  // Se houver usuário logado, retorna apenas os carros que não são dele
  const data = await db
    .select()
    .from(carros)
    .where(not(eq(carros.userId, session.user.id)));

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

export const updateCarAction = async ({
  car,
  carId,
}: {
  car: Omit<Carro, "id" | "userId">;
  carId: string;
}) => {
  const session = await auth();

  try {
    if (!session?.user?.id) {
      return { success: false, err: "Usuário não autenticado." };
    }

    // Verificar se o carro pertence ao usuário
    const existingCar = await db
      .select()
      .from(carros)
      .where(eq(carros.id, carId));

    if (!existingCar.length || existingCar[0].userId !== session.user.id) {
      return {
        success: false,
        err: "Você não tem permissão para editar este carro.",
      };
    }

    await db
      .update(carros)
      .set({
        ano: car.ano,
        imagem: car.imagem,
        marca: car.marca,
        modelo: car.modelo,
        placa: car.placa,
        preco: car.preco,
      })
      .where(eq(carros.id, carId));

    revalidatePath("/");

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, err: "Erro ao atualizar carro." };
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
