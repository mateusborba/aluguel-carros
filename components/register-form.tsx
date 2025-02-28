"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React from "react";
import { Controller, useForm, type FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { DatePicker } from "./date-picker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { formatPhone } from "@/lib/format-phone";
import { formatCpf } from "@/lib/format-cpf";

interface RegisterFormProps {
  submitForm: (
    data: RegisterFormType
  ) => Promise<{ success: boolean; err?: string }>;
}

const registerFormSchema = z.object({
  nomeCompleto: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  senha: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
  cpf: z.string().min(11, "O CPF deve ter pelo menos 11 caracteres"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(8, "O telefone deve ter pelo menos 8 caracteres"),
  dataNascimento: z.date({
    required_error: "A data de nascimento é obrigatória",
  }),
});

type RegisterFormType = z.infer<typeof registerFormSchema>;

export const RegisterForm = ({ submitForm }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    defaultValues: {
      cpf: "",
      telefone: "",
      email: "",
      dataNascimento: undefined,
      nomeCompleto: "",
      senha: "",
    },
    resolver: zodResolver(registerFormSchema),
  });

  const submit = async ({
    email,
    cpf,
    dataNascimento,
    nomeCompleto,
    senha,
    telefone,
  }: RegisterFormType) => {
    const response = await submitForm({
      email,
      nomeCompleto,
      cpf,
      telefone,
      dataNascimento,
      senha,
    });

    if (!response.success) {
      return toast.error(`${response?.err}`);
    }

    toast.success("Usuário criado com sucesso");
    redirect("/sign-in");
  };

  const onError = (error: FieldErrors<RegisterFormType>) => {
    console.log("deu erro:", error);
  };

  return (
    <div className={cn("flex flex-col w-full md:max-w-md")}>
      <Card>
        <CardHeader className="p-3 px-6">
          <CardTitle className="text-2xl">Cadastre-se</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para criar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit, onError)}>
            <div className="flex flex-col gap-3">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome"
                  {...register("nomeCompleto")}
                />
                {errors.nomeCompleto && (
                  <span className="text-sm text-red-600">
                    {errors.nomeCompleto.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-sm text-red-600">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor="email">CPF</Label>
                      <Input
                        id="cpf"
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target;
                          const valueFormated = formatCpf(value);
                          field.onChange(valueFormated);
                        }}
                        type="cpf"
                        placeholder="Digite seu cpf"
                      />
                      {errors.cpf && (
                        <span className="text-sm text-red-600">
                          {errors.cpf.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Controller
                  control={control}
                  name="telefone"
                  render={({ field }) => (
                    <>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        value={field.value}
                        onChange={(e) => {
                          const { value } = e.target;

                          const valueFormated = formatPhone(value);
                          field.onChange(valueFormated);
                        }}
                        id="phone"
                        type="text"
                        placeholder="Digite seu telefone"
                      />
                      {errors.telefone && (
                        <span className="text-sm text-red-600">
                          {errors.telefone.message}
                        </span>
                      )}
                    </>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthday">Data de nascimento</Label>
                <Controller
                  name="dataNascimento"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      date={field.value}
                      onDateChange={field.onChange}
                      classNames="w-full"
                      placeholder="Selecione a sua data de nascimento"
                    />
                  )}
                />
                {errors.dataNascimento && (
                  <span className="text-sm text-red-600">
                    {errors.dataNascimento.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register("senha")}
                />
                {errors.senha && (
                  <span className="text-sm text-red-600">
                    {errors.senha.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full flex gap-3"
                disabled={isSubmitting}
              >
                Cadastrar
                {isSubmitting && <Loader className="size-4" />}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já possui conta?{" "}
              <Link href="/sign-in" className="underline underline-offset-4">
                Ir para o login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
