"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addCarAction } from "@/actions/cars-actions";
import { useState } from "react";
import { useSession } from "next-auth/react";

const registerCarFormSchema = z.object({
  modelo: z.string().min(3, "O modelo deve ter no mínimo 3 caracteres."),
  marca: z.string().min(3, "A marca deve ter no mínimo 3 caracteres."),
  ano: z
    .string()
    .min(4, "O ano deve ter exatamente 4 dígitos.")
    .max(4, "O ano deve ter exatamente 4 dígitos."),
  placa: z.string().min(7, "A placa deve ter no mínimo 7 caracteres."),
  preco: z
    .number({ invalid_type_error: "O valor é obrigatório" })
    .positive("O preço deve ser um valor positivo."),
  imagem: z
    .instanceof(FileList, { message: "Imagem é obrigatória." })
    .refine((files) => files.length > 0, "Selecione uma imagem."),
});

type RegisterCarForm = z.infer<typeof registerCarFormSchema>;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function AddCarForm() {
  const session = useSession();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  console.log(session, "client");
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCarForm>({
    resolver: zodResolver(registerCarFormSchema),
    mode: "onSubmit",
  });

  const submit = async (data: RegisterCarForm) => {
    setLoading(true);

    try {
      if (session.status !== "authenticated") {
        return toast.error(
          "Você precisa estar logado para adicionar um carro."
        );
      }

      const file = data.imagem[0];
      const base64Image = await fileToBase64(file);

      const result = await addCarAction({
        car: { ...data, imagem: base64Image },
        userId: session.data.user.id!,
      });

      if (!result.success) {
        toast.error(result.err);
      } else {
        toast.success("Carro criado com sucesso.");
        reset();
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao adicionar carro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => reset()}>
        <Button>
          Adicionar carro
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl">
        <DialogHeader>
          <DialogTitle>Preencha as informações do seu carro</DialogTitle>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit(submit)}>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" {...register("marca")} />
            {errors?.marca && (
              <span className="text-red-500 text-sm">
                {errors.marca.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" {...register("modelo")} />
            {errors?.modelo && (
              <span className="text-red-500 text-sm">
                {errors.modelo.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="placa">Placa</Label>
            <Input id="placa" {...register("placa")} />
            {errors?.placa && (
              <span className="text-red-500 text-sm">
                {errors.placa.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ano">Ano</Label>
              <Input id="ano" {...register("ano")} />
              {errors?.ano && (
                <span className="text-red-500 text-sm">
                  {errors.ano.message}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preco">Valor</Label>
              <Input
                id="preco"
                type="number"
                {...register("preco", { valueAsNumber: true })}
              />
              {errors?.preco && (
                <span className="text-red-500 text-sm">
                  {errors.preco.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imagem">Foto</Label>
            <Input
              id="imagem"
              type="file"
              accept="image/*"
              {...register("imagem")}
            />
            {errors?.imagem && (
              <span className="text-red-500 text-sm">
                {errors.imagem.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
