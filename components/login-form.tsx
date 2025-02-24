"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm, type FieldErrors } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Loader } from "lucide-react";

interface LoginForm {
  submitForm: ({
    email,
    senha,
  }: {
    email: string;
    senha: string;
  }) => Promise<{ success: boolean; err?: string }>;
}

const loginFormSchema = z.object({
  email: z.string(),
  senha: z.string(),
});

type LoginFormType = z.infer<typeof loginFormSchema>;

export const LoginForm = ({ submitForm }: LoginForm) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  const submit = async ({ email, senha }: LoginFormType) => {
    try {
      const result = await submitForm({
        email,
        senha,
      });

      if (result.err) {
        return toast.error(result.err);
      }

      router.push("/");
    } catch (err) {
      console.log(err);
      toast.error("Um erro ocorreu ao tentar fazer o login.");
    }
  };

  const onError = (errors: FieldErrors<LoginFormType>) => {
    console.log(errors);
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Digite seu e-mail abaixo para acessar sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(submit, onError)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                  {...register("senha", { required: true })}
                />
              </div>
              <Button
                type="submit"
                className="w-full flex items-center gap-2"
                disabled={isSubmitting}
              >
                Entrar
                {isSubmitting && <Loader />}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Não possui uma conta ainda?{" "}
              <Link href="/sign-up" className="underline underline-offset-4">
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
