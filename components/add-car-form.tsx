"use client";

import React, { useState, useRef, useEffect } from "react";
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
import { Loader, Plus, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { addCarAction } from "@/actions/cars-actions";
import { fileToBase64 } from "@/lib/file-to-base64";
import { cn } from "@/lib/utils";
import Image from "next/image";

const imageSchema =
  typeof FileList !== "undefined"
    ? z
        .instanceof(FileList)
        .refine((files) => files.length > 0, "Selecione uma imagem.")
    : z.any();

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
  imagem: imageSchema,
});

type RegisterCarForm = z.infer<typeof registerCarFormSchema>;

export function AddCarForm() {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterCarForm>({
    resolver: zodResolver(registerCarFormSchema),
    mode: "onSubmit",
  });

  const { ref: registerRef, ...registerProps } = register("imagem");

  // Observa mudanças no campo de imagem
  const imageFile = watch("imagem");
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      setSelectedFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [imageFile]);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setValue("imagem", files);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para o container
    setValue("imagem", undefined);
    setImagePreview("");
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const submit = async (data: RegisterCarForm) => {
    setLoading(true);

    try {
      const imageUrl = await fileToBase64(data.imagem[0]);

      const result = await addCarAction({
        car: { ...data, imagem: imageUrl },
      });

      if (!result.success) {
        toast.error(result.err);
      } else {
        toast.success("Carro criado com sucesso.");
        reset();
        setImagePreview("");
        setSelectedFileName("");
        setOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro inesperado ao adicionar carro.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      reset();
      setImagePreview("");
      setSelectedFileName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          Adicionar carro
          <Plus className="ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl max-h-[90vh] overflow-y-auto">
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
            <Label>Imagem do carro</Label>
            <div
              className={cn(
                "relative w-full h-[200px] border-2 border-dashed rounded-lg cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/20 hover:border-primary/50"
              )}
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleImageClick}
            >
              {imagePreview ? (
                <>
                  <div className="relative h-full">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-2 text-muted-foreground">
                    <Upload className="w-8 h-8 mx-auto" />
                    <p>Selecione a imagem do carro</p>
                    <p className="text-xs">Arraste ou clique para selecionar</p>
                  </div>
                </div>
              )}
            </div>
            {selectedFileName && (
              <div className="text-sm text-muted-foreground mt-1">
                <p>Arquivo selecionado: {selectedFileName}</p>
              </div>
            )}
            <Input
              ref={(e) => {
                registerRef(e);
                fileInputRef.current = e;
              }}
              id="imagem"
              type="file"
              accept="image/*"
              className="hidden"
              {...registerProps}
            />
            {errors?.imagem && (
              <span className="text-red-500 text-sm">
                {String(errors.imagem.message)}
              </span>
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader className="animate-spin" /> : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
