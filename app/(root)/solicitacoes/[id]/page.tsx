import { getAllSolicitacoes } from "@/actions/solicitatios-actions";
import { PageTitle } from "@/components/page-title";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  //const solicitacoes = await getAllSolicitacoes({ userId: id });

  return (
    <section className="flex flex-col gap-5">
      <div className="flex justify-between">
        <PageTitle title="Solicitações" />
      </div>
    </section>
  );
};

export default Page;
