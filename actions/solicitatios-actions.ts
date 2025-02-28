"use server";

import { db } from "@/db/drizzle";
import { carros, solicitacoes } from "@/db/schema";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface CreateSolicitacaoParams {
  userId: string;
  carroId: string;
  dataInicio: Date;
  dataFim: Date;
}

export async function createSolicitacao({
  userId,
  carroId,
  dataInicio,
  dataFim,
}: CreateSolicitacaoParams) {
  const existingSolicitacoes = await db
    .select()
    .from(solicitacoes)
    .where(eq(solicitacoes.carroId, carroId));

  if (existingSolicitacoes.length > 0) {
    return { success: false, err: "Carro indisponível no momento." };
  }

  await db
    .insert(solicitacoes)
    .values({
      userId,
      carroId,
      dataInicio,
      dataFim,
    })
    .returning();

  await db
    .update(carros)
    .set({
      status: "pendente",
    })
    .where(eq(carros.id, carroId));

  revalidatePath("/");

  return { success: true };
}

export async function approveSolicitacao(solicitacaoId: string) {
  return await db
    .update(solicitacoes)
    .set({ status: "aprovada" })
    .where(eq(solicitacoes.id, solicitacaoId));
}

// Rejeita uma solicitação, atualizando o status para "rejeitada"
export async function rejectSolicitacao(solicitacaoId: string) {
  return await db
    .update(solicitacoes)
    .set({ status: "rejeitada" })
    .where(eq(solicitacoes.id, solicitacaoId));
}

// Busca todas as solicitações
export async function getAllSolicitacoes({ userId }: { userId: string }) {
  const result = await db
    .select()
    .from(solicitacoes)
    .where(eq(solicitacoes.userId, userId));

  if (result?.length <= 0) {
    return [];
  }

  return result;
}
