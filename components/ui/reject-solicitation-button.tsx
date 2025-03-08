"use client";

import React from "react";
import { Button } from "./button";
import { rejectSolicitacao } from "@/actions/solicitatios-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const RejectSolicitationButton = ({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const handleRejectSolicitation = async () => {
    try {
      setIsPending(true);
      const result = await rejectSolicitacao(id);

      if (!result.success) {
        toast.error(result.error || "Erro ao rejeitar solicitação");
        return;
      }

      toast.success("Solicitação rejeitada com sucesso");
      router.refresh();
    } catch {
      toast.error("Erro ao rejeitar solicitação");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="destructive"
      onClick={handleRejectSolicitation}
      disabled={disabled || isPending}
    >
      {isPending ? "Rejeitando..." : "Rejeitar"}
    </Button>
  );
};
