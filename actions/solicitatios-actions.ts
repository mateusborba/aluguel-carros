"use server";

import { db } from "@/db/drizzle";
import { carros, solicitacoes, users } from "@/db/schema";
import { eq, and, not, isNull } from "drizzle-orm";

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
  try {
    await db
      .update(solicitacoes)
      .set({ status: "aprovada" })
      .where(eq(solicitacoes.id, solicitacaoId));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error({ error });
    return { success: false, error: "Erro ao aprovar solicitação" };
  }
}

export async function rejectSolicitacao(solicitacaoId: string) {
  try {
    // Primeiro, busca a solicitação para obter o ID do carro
    const solicitacao = await db
      .select()
      .from(solicitacoes)
      .where(eq(solicitacoes.id, solicitacaoId));

    if (!solicitacao.length) {
      return { success: false, error: "Solicitação não encontrada" };
    }

    // Atualiza o status da solicitação para rejeitada
    await db
      .update(solicitacoes)
      .set({ status: "rejeitada" })
      .where(eq(solicitacoes.id, solicitacaoId));

    // Atualiza o status do carro para disponível
    await db
      .update(carros)
      .set({ status: "disponível" })
      .where(eq(carros.id, solicitacao[0].carroId));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error({ error });
    return { success: false, error: "Erro ao rejeitar solicitação" };
  }
}

// Busca todas as solicitações dos carros do usuário
export async function getAllSolicitacoes({
  userId,
}: {
  userId: string;
}): Promise<{ success: boolean; data?: Solicitacao[]; error?: string }> {
  try {
    // Primeiro, buscar todos os carros do usuário
    const carrosDoUsuario = await db
      .select()
      .from(carros)
      .where(eq(carros.userId, userId));

    if (!carrosDoUsuario.length) {
      return {
        success: false,
        data: [],
        error: "Nenhum carro encontrado para este usuário",
      };
    }

    // Buscar todas as solicitações para os carros do usuário
    const solicitacoesComCarro = await db
      .select({
        id: solicitacoes.id,
        userId: solicitacoes.userId,
        dataInicio: solicitacoes.dataInicio,
        dataFim: solicitacoes.dataFim,
        status: solicitacoes.status,
        createdAt: solicitacoes.createdAt,
        carro: {
          id: carros.id,
          modelo: carros.modelo,
          marca: carros.marca,
          ano: carros.ano,
          placa: carros.placa,
          status: carros.status,
          preco: carros.preco,
          imagem: carros.imagem,
          userId: carros.userId,
        },
      })
      .from(solicitacoes)
      .leftJoin(carros, eq(solicitacoes.carroId, carros.id))
      .where(
        and(
          eq(carros.userId, userId), // Filtra apenas carros do usuário logado
          not(isNull(carros.id))
        )
      );

    if (!solicitacoesComCarro.length) {
      return {
        success: false,
        data: [],
        error: "Nenhuma solicitação encontrada",
      };
    }

    // Para cada solicitação, buscar os dados do solicitante
    const solicitacoesCompletas = await Promise.all(
      solicitacoesComCarro.map(async (solicitacao) => {
        if (!solicitacao.carro) {
          throw new Error("Dados do carro não encontrados");
        }

        // Buscar dados do solicitante
        const solicitante = await db
          .select()
          .from(users)
          .where(eq(users.id, solicitacao.userId));

        if (!solicitante.length) {
          throw new Error("Solicitante não encontrado");
        }

        return {
          id: solicitacao.id,
          userId: solicitacao.userId,
          dataInicio: solicitacao.dataInicio,
          dataFim: solicitacao.dataFim,
          status: solicitacao.status,
          createdAt: solicitacao.createdAt,
          cpf: solicitante[0].cpf,
          nomeCompleto: solicitante[0].nomeCompleto,
          telefone: solicitante[0].telefone,
          carro: solicitacao.carro,
        };
      })
    );

    return { success: true, data: solicitacoesCompletas };
  } catch (error) {
    console.error({ error });
    return { success: false, error: "Erro no banco de dados" };
  }
}
