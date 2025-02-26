"use server";

import { signIn, signOut } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/hash-password";
import { eq } from "drizzle-orm";

export const registerUser = async (
  user: Omit<User, "id">
): Promise<{ success: boolean; err?: string }> => {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, user.email));

  if (existingUser.length > 0) {
    return { success: false, err: "Email já cadastrado." };
  }

  const hashedPassword = await hashPassword(user.senha);

  try {
    await db.insert(users).values({
      cpf: user.cpf,
      dataNascimento: user.dataNascimento,
      email: user.email,
      nomeCompleto: user.nomeCompleto,
      senha: hashedPassword,
      telefone: user.telefone,
    });

    return { success: true };
  } catch (err) {
    let errorMessage = "Erro ao criar usuário";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else if (typeof err === "string") {
      errorMessage = err;
    }

    return { success: false, err: errorMessage };
  }
};

export const signInAction = async ({
  email,
  senha,
}: {
  email: string;
  senha: string;
}) => {
  try {
    const result = await signIn("credentials", {
      email,
      password: senha,
      redirect: false,
    });

    if (result?.err) {
      return { success: false, err: result.err };
    }

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error: "Signin error" };
  }
};

export const logOutAction = async () => {
  await signOut({ redirectTo: "/" });
};
