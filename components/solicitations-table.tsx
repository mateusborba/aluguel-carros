import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

import { ApproveSolicitationButton } from "./ui/approve-solicitation-button";
import { RejectSolicitationButton } from "./ui/reject-solicitation-button";

import { Badge } from "./ui/badge";

export const SolicitationsTable = ({
  solicitacoes,
}: {
  solicitacoes: Solicitacao[];
}) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Cpf</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Carro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {solicitacoes?.length > 0 &&
            solicitacoes.map((solicitacao) => (
              <TableRow key={solicitacao.id}>
                <TableCell>{solicitacao.nomeCompleto}</TableCell>
                <TableCell>{solicitacao.cpf}</TableCell>
                <TableCell>{solicitacao.telefone}</TableCell>
                <TableCell>{solicitacao.carro.modelo}</TableCell>
                <TableCell>
                  {solicitacao.status === "alugado" && (
                    <Badge variant="default">Alugado</Badge>
                  )}
                  {solicitacao.status === "aprovada" && (
                    <Badge variant="secondary">Aprovada</Badge>
                  )}
                  {solicitacao.status === "rejeitada" && (
                    <Badge variant="destructive">Rejeitada</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {solicitacao.status === "pendente" && (
                    <div className="flex items-center gap-1.5">
                      <ApproveSolicitationButton id={solicitacao.id} />
                      <RejectSolicitationButton id={solicitacao.id} />
                    </div>
                  )}
                  {solicitacao.status !== "pendente" && (
                    <div className="flex items-center gap-1.5">
                      <ApproveSolicitationButton id={solicitacao.id} disabled />
                      <RejectSolicitationButton id={solicitacao.id} disabled />
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
