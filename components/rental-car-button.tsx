"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { createSolicitacao } from "@/actions/solicitatios-actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Controller, useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { DatePicker } from "./date-picker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const solicitationRentalFormSchema = z.object({
  dataInicio: z.date(),
  dataFim: z.date(),
});

type SolicitationForm = z.infer<typeof solicitationRentalFormSchema>;

export const RentalCarButton = ({ car }: { car: Carro }) => {
  const session = useSession();
  const { control, handleSubmit, reset } = useForm<SolicitationForm>({
    defaultValues: {
      dataFim: undefined,
      dataInicio: undefined,
    },
    resolver: zodResolver(solicitationRentalFormSchema),
  });

  const [pendingSolicitation, setPendingSolicitation] =
    useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleSendSolicitationRental = async ({
    dataFim,
    dataInicio,
  }: SolicitationForm) => {
    setPendingSolicitation(true);

    if (!session?.data?.user?.id) {
      setPendingSolicitation(false);
      return;
    }

    const result = await createSolicitacao({
      userId: session.data.user.id!,
      carroId: car.id!,
      dataInicio: dataInicio,
      dataFim: dataFim,
    });

    if (!result?.success) {
      toast.error("Erro: " + result.err);
      setPendingSolicitation(false);
      return;
    }

    toast.success("Solicitação enviada com sucesso.");
    setPendingSolicitation(false);
    handleCloseModal();
  };

  const submit = async ({ dataFim, dataInicio }: SolicitationForm) => {
    await handleSendSolicitationRental({ dataFim, dataInicio });
  };

  const handleCloseModal = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full mt-3"
          disabled={car.status !== "disponível"}
          onClick={() => setOpen(true)}
        >
          {car.status === "disponível" ? "Solicitar" : "Indisponível"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Escolha o período do aluguel</DialogTitle>
          <form
            className="flex flex-col py-3 gap-3"
            onSubmit={handleSubmit(submit)}
          >
            <div className="flex gap-3">
              <Controller
                name="dataInicio"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label>Data de início</Label>
                    <DatePicker
                      placeholder="Seleciona uma data"
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  </div>
                )}
              />
              <Controller
                name="dataFim"
                control={control}
                render={({ field }) => (
                  <div className="flex flex-col gap-1.5 w-full">
                    <Label>Data de entrega</Label>
                    <DatePicker
                      placeholder="Selecione uma data"
                      date={field.value}
                      onDateChange={field.onChange}
                    />
                  </div>
                )}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="destructive"
                type="button"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={pendingSolicitation}>
                Solicitar
                {pendingSolicitation && <Loader />}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
