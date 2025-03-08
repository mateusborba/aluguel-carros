import { getAllSolicitacoes } from "@/actions/solicitatios-actions";
import { PageTitle } from "@/components/page-title";
import { SolicitationsTable } from "@/components/solicitations-table";
import React from "react";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const solicitacoes = await getAllSolicitacoes({ userId: id });

  if (!solicitacoes.success || !solicitacoes.data) {
    return (
      <section className="flex flex-col gap-5">
        <div className="flex justify-between">
          <PageTitle title="Solicitações" />
        </div>
        <p className="text-center text-muted-foreground">
          {solicitacoes.error || "Nenhuma solicitação encontrada"}
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title="Solicitações" />
      </div>
      <SolicitationsTable solicitacoes={solicitacoes.data} />
    </section>
  );
};

export default Page;
