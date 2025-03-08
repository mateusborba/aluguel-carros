"use client";

import React from "react";
import { Button } from "./button";
import { approveSolicitacao } from "@/actions/solicitatios-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ApproveSolicitationButton = ({
  id,
  disabled = false,
}: {
  id: string;
  disabled?: boolean;
}) => {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const handleApproveSolicitation = async () => {
    try {
      setIsPending(true);
      const result = await approveSolicitacao(id);

      if (!result.success) {
        toast.error(result.error || "Erro ao aprovar solicitação");
        return;
      }

      toast.success("Solicitação aprovada com sucesso");
      router.refresh();
    } catch {
      toast.error("Erro ao aprovar solicitação");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleApproveSolicitation}
      disabled={disabled || isPending}
    >
      {isPending ? "Aprovando..." : "Aprovar"}
    </Button>
  );
};
